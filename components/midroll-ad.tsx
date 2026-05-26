'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import type { Advertisement } from '@/lib/ads';

interface MidrollAdProps {
  /** true = ad actually played; false = skipped instantly (no URL / no ads) */
  onFinished: (played: boolean) => void;
  /** Ref to the player container — used to request fullscreen from within the ad. */
  containerRef?: React.RefObject<HTMLElement | null>;
}

const SKIP_DELAY_S = 5;
const POST_AD_DURATION_S = 5;

export function MidrollAd({ onFinished, containerRef }: MidrollAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [noAds, setNoAds] = useState(false);

  // 'playing' = ad video running; 'post-ad' = 5s preview countdown after video ends
  const [phase, setPhase] = useState<'playing' | 'post-ad'>('playing');
  const [postAdCountdown, setPostAdCountdown] = useState(POST_AD_DURATION_S);

  // Short ad: seconds remaining display
  const [adCountdown, setAdCountdown] = useState<number | null>(null);

  // Long ad: skip unlock countdown + ready flag
  const [skipIn, setSkipIn] = useState(SKIP_DELAY_S);
  const [skipReady, setSkipReady] = useState(false);

  // Progress bar 0-100 (short = video position, long = skip delay elapsed)
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const adCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postAdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tracks the dialog's current open mode — prevents unnecessary close/reopen cycles
  const dialogModeRef = useRef<'normal' | 'fullscreen' | null>(null);

  // Ad video pause state + center icon flash
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Track whether the user is in fullscreen so we can render via top-layer dialog
  // (needed because a fullscreened iframe renders above normal DOM overlays)
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement
  );

  const finish = useCallback((played: boolean) => {
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    if (skipIntervalRef.current) clearInterval(skipIntervalRef.current);
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (postAdTimerRef.current) clearInterval(postAdTimerRef.current);
    onFinished(played);
  }, [onFinished]);

  // ── Fetch ad ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch('/api/ads?position=midroll')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (cancelled) return;
        if (!data.ads?.length) { setNoAds(true); setLoading(false); return; }
        const picked = data.ads[Math.floor(Math.random() * data.ads.length)];
        setAd(picked);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setNoAds(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Instant-dismiss when nothing to show — resume video as if ad never happened
  useEffect(() => { if (noAds) finish(true); }, [noAds, finish]);
  useEffect(() => {
    if (!loading && ad && !ad.featured_media_url) finish(true);
  }, [loading, ad, finish]);

  // Sync fullscreen state
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // Open the dialog and switch modes after every render.
  // Using show() for normal mode and showModal() for fullscreen keeps the video
  // in ONE stable DOM node — close()+show/showModal() only toggles visibility,
  // it never remounts the video so audio cannot restart.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const mode = isFullscreen ? 'fullscreen' : 'normal';
    if (dialogModeRef.current === mode && dialog.open) return; // already correct
    dialogModeRef.current = mode;
    if (dialog.open) dialog.close();
    if (isFullscreen) dialog.showModal();
    else dialog.show();
  }); // intentionally no deps — dialogModeRef guards against redundant work

  // Prevent Escape from dismissing the ad
  useEffect(() => {
    const prevent = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogRef.current?.open) e.preventDefault();
    };
    document.addEventListener('keydown', prevent);
    return () => document.removeEventListener('keydown', prevent);
  }, []);

  // Hard 120s fallback
  useEffect(() => {
    if (loading || noAds || !ad?.featured_media_url) return;
    fallbackRef.current = setTimeout(() => finish(true), 120_000);
    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current); };
  }, [loading, noAds, ad, finish]);

  // ── Video metadata ready ──────────────────────────────────────────────────
  const handleLoadedMetadata = useCallback(() => {
    const duration = videoRef.current?.duration ?? 0;

    if (duration > 10) {
      // Long ad: accurate skip-delay progress using elapsed wall-clock time
      const startedAt = Date.now();
      skipIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        const pct = Math.min(100, (elapsed / SKIP_DELAY_S) * 100);
        setProgress(pct);
        setSkipIn(Math.max(0, Math.ceil(SKIP_DELAY_S - elapsed)));
        if (elapsed >= SKIP_DELAY_S) {
          clearInterval(skipIntervalRef.current!);
          setProgress(100);
          setSkipReady(true);
        }
      }, 100);
    } else {
      // Short ad: seconds display only (progress driven by onTimeUpdate)
      const secs = Math.ceil(duration) || 10;
      setAdCountdown(secs);
      adCountdownRef.current = setInterval(() => {
        setAdCountdown(prev => {
          if (prev === null || prev <= 1) { clearInterval(adCountdownRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  }, []);

  // Short ads: smooth progress bar from video currentTime
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration > 10 || video.duration === 0) return;
    setProgress(Math.min(100, (video.currentTime / video.duration) * 100));
  }, []);

  // Video ends — enter post-ad phase with 5s countdown, then auto-finish
  // (finish(false) = video stays paused — user must resume manually)
  const handleVideoEnded = useCallback(() => {
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    if (skipIntervalRef.current) clearInterval(skipIntervalRef.current);
    setProgress(100);
    setPhase('post-ad');
    let count = POST_AD_DURATION_S;
    setPostAdCountdown(count);
    postAdTimerRef.current = setInterval(() => {
      count -= 1;
      setPostAdCountdown(count);
      if (count <= 0) {
        clearInterval(postAdTimerRef.current!);
        finish(false); // auto-expired → stay paused, don't resume
      }
    }, 1000);
  }, [finish]);

  // Pause/resume via the controls button
  const handlePause = useCallback(() => {
    const video = videoRef.current;
    if (!video || phase === 'post-ad') return;
    if (video.paused) { video.play(); }
    else { video.pause(); }
  }, [phase]);

  // Toggle mute
  const handleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Fullscreen toggle — targets the player container, not the iframe
  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef?.current?.requestFullscreen?.().catch(() => {});
    }
  }, [containerRef]);

  if (loading || noAds || !ad?.featured_media_url) return null;

  // Dialog style: absolute (fills player container) in normal mode,
  // fixed (fills viewport via top layer) in fullscreen mode.
  const dialogStyle: React.CSSProperties = isFullscreen
    ? { position: 'fixed', inset: 0, width: '100vw', height: '100vh' }
    : { position: 'absolute', inset: 0, width: '100%', height: '100%' };

  return (
    // Single dialog — the video is always in this element, never remounted.
    // show() for normal mode, showModal() for fullscreen (handled in effect above).
    <dialog
      ref={dialogRef}
      className="m-0 p-0 max-w-none max-h-none border-0 overflow-hidden bg-black backdrop:hidden"
      style={dialogStyle}
    >
      {/* Video — pointer-events-none so the pause button layer handles clicks */}
      <video
        ref={videoRef}
        src={ad.featured_media_url}
        autoPlay
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onPause={() => setIsPaused(true)}
        onPlay={() => setIsPaused(false)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Post-ad: vignette shadow + ring countdown in center.
           Hides once the ring completes (postAdCountdown hits 0). */}
      {phase === 'post-ad' && postAdCountdown > 0 && (
        <div className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center">
          {/* Radial vignette darkens edges, leaving the frozen frame readable in the center */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.72) 100%)' }}
          />
          {/* Ring countdown */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Track ring */}
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
              {/* Depleting ring — CSS animation driven, r=15.9 ⇒ circumference ≈99.9≈00 */}
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="white" strokeWidth="2.5"
                strokeDasharray="100"
                strokeLinecap="round"
                style={{ animation: 'midroll-ring 5s linear forwards' }}
              />
            </svg>
            <span className="text-white text-xl font-black tabular-nums relative z-10 select-none">
              {postAdCountdown}
            </span>
          </div>
        </div>
      )}

      {/* Centre click area — opens ad clickthrough URL (playing phase only) */}
      {phase === 'playing' && ad.acf?.url_clickthrough && (
        <a
          href={ad.acf.url_clickthrough}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label="Visitar anúncio"
        />
      )}

      {/* Controls bar */}
      <div className="absolute bottom-0.75 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5 bg-linear-to-t from-black/80 to-transparent">
        {/* Left: pause + mute + label + advertiser link */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePause}
            disabled={phase === 'post-ad'}
            className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
            aria-label={isPaused ? 'Retomar anúncio' : 'Pausar anúncio'}
          >
            {isPaused
              ? <Play  className="w-4 h-4" fill="currentColor" />
              : <Pause className="w-4 h-4" fill="currentColor" />
            }
          </button>
          <button
            onClick={handleMute}
            className="flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] select-none pointer-events-none ml-1">
            Publicidade
          </span>
          {ad.acf?.url_clickthrough && (
            <a
              href={ad.acf.url_clickthrough}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/60 hover:text-white text-[11px] font-semibold transition-colors ml-1"
            >
              Saber mais <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Right: skip + fullscreen */}
        <div className="flex items-center gap-2">
          {phase === 'post-ad' ? (
            // Post-ad: ring finished, user must actively click skip
            <div className="flex items-center gap-3">
              {postAdCountdown > 0 && (
                <span className="text-white/50 text-xs font-semibold tabular-nums whitespace-nowrap select-none">
                  Conteúdo em {postAdCountdown}s
                </span>
              )}
              <button
                onClick={() => finish(true)}
                className="flex items-center gap-2 bg-white hover:bg-white/90 text-black text-sm font-black uppercase tracking-widest px-5 py-2 transition-colors cursor-pointer select-none"
              >
                <span className="mt-0.5">Saltar agora</span>
                <span className="text-base leading-none">›</span>
              </button>
            </div>
          ) : skipReady ? (
            <button
              onClick={() => finish(true)}
              className="flex items-center gap-2 bg-[#006ec2] hover:bg-[#0090d0] text-white text-sm font-black uppercase tracking-widest px-5 py-2 transition-colors cursor-pointer select-none"
            >
              <span className="mt-0.5">Saltar Anúncio</span>
              <span className="text-base leading-none">›</span>
            </button>
          ) : skipIn > 0 ? (
            <div className="flex items-center bg-black/60 text-white/50 text-sm font-black uppercase tracking-widest px-4 py-2 select-none">
              Saltar em {skipIn}s
            </div>
          ) : adCountdown !== null ? (
            <div className="flex items-center gap-2 bg-black/60 text-white text-sm font-black tabular-nums px-4 py-2 select-none">
              <span className="inline-block w-2 h-2 rounded-full bg-[#006ec2]" />
              {adCountdown}s
            </div>
          ) : null}

          {/* Fullscreen toggle */}
          <button
            onClick={handleFullscreen}
            className="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label={isFullscreen ? 'Sair de ecrã completo' : 'Ecrã completo'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.75 bg-white/10 z-20 pointer-events-none">
        <div
          className="h-full bg-[#006ec2]"
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        />
      </div>
    </dialog>
  );
}
