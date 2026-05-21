'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Advertisement } from '@/lib/ads';

interface MidrollAdProps {
  /** true = ad actually played; false = skipped instantly (no URL / no ads) */
  onFinished: (played: boolean) => void;
}

const SKIP_DELAY_S = 5;

export function MidrollAd({ onFinished }: MidrollAdProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [noAds, setNoAds] = useState(false);

  // Short ad: seconds remaining display
  const [adCountdown, setAdCountdown] = useState<number | null>(null);

  // Long ad: skip unlock countdown + ready flag
  const [skipIn, setSkipIn] = useState(SKIP_DELAY_S);
  const [skipReady, setSkipReady] = useState(false);

  // Progress bar 0-100 (short = video position, long = skip delay elapsed)
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const adCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skipIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback((played: boolean) => {
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    if (skipIntervalRef.current) clearInterval(skipIntervalRef.current);
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
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

  // Instant-dismiss when nothing to show
  useEffect(() => { if (noAds) finish(false); }, [noAds, finish]);
  useEffect(() => {
    if (!loading && ad && !ad.featured_media_url) finish(false);
  }, [loading, ad, finish]);

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

  // Auto-skip when video ends (works for both short and long ads)
  const handleVideoEnded = useCallback(() => finish(true), [finish]);

  if (loading || noAds || !ad?.featured_media_url) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        src={ad.featured_media_url}
        autoPlay
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Click-through overlay */}
      {ad.acf?.url_clickthrough && (
        <a
          href={ad.acf.url_clickthrough}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Publicidade: ${ad.title.rendered}`}
        />
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0.75 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 bg-linear-to-t from-black/80 to-transparent">
        <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] select-none pointer-events-none">
          Publicidade
        </span>

        {/* Skip area — right side */}
        <div>
          {skipReady ? (
            <button
              onClick={() => finish(true)}
              className="flex items-center gap-2 bg-[#00a6f0] hover:bg-[#0090d0] text-white text-sm font-black uppercase tracking-widest px-5 py-2.5 transition-colors cursor-pointer"
            >
              <span className="mt-0.75">Saltar Anúncio </span><span className="text-base leading-none">›</span>
            </button>
          ) : skipIn > 0 ? (
            // Long ad waiting for skip, OR no metadata yet — show unlock countdown
            <div className="flex items-center bg-black/60 text-white/50 text-sm font-black uppercase tracking-widest px-5 py-2.5 select-none">
              Saltar em {skipIn}s
            </div>
          ) : adCountdown !== null ? (
            // Short ad: seconds remaining
            <div className="flex items-center gap-2 bg-black/60 text-white text-sm font-black tabular-nums px-5 py-2.5 select-none">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00a6f0]" />
              {adCountdown}s
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.75 bg-white/10 z-20 pointer-events-none">
        <div
          className="h-full bg-[#00a6f0]"
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        />
      </div>
    </div>
  );
}
