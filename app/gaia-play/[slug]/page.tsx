"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareButton } from "@/components/share-button";
import { SeasonSelector } from "@/components/season-selector";
import { cleanText } from "@/lib/decode-html";
import { formatExibicao, formatYear } from "@/lib/date";
import { MidrollAd } from "@/components/midroll-ad";
import { buildBunnyVodEmbedUrl, toBunnyEmbedUrl } from "@/lib/bunny";
import type { Program } from '@/lib/programas';
import { useMidroll } from '@/hooks/use-midroll';

// ── Minimal Bunny playerjs types ─────────────────────────────────────────────
interface PlayerJSInstance {
  pause(): void;
  play(): void;
  on(event: string, cb: () => void): void;
}
declare global {
  interface Window {
    playerjs?: { Player: new (iframe: HTMLElement) => PlayerJSInstance };
  }
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  try {
    // Handle youtu.be/xxx format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return videoId;
    }
    // Handle youtube.com/watch?v=xxx format
    if (url.includes('youtube.com/watch')) {
      const params = new URL(url).searchParams;
      return params.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolve an episode to a renderable embed URL.
 * Priority: `link` (Bunny or any URL) → `link_youtube` (legacy fallback)
 */
function resolveEpisodeVideo(
  ep: { link?: string; link_youtube?: string } | undefined,
): 
  | { type: 'youtube'; id: string }
  | { type: 'bunny'; embedUrl: string }
  | null {
  const candidates = [ep?.link, ep?.link_youtube].filter(Boolean) as string[];
  for (const link of candidates) {
    // Bunny URL (either /embed/ or /play/) — normalise to /embed/ for iframe
    const bunnyEmbed = toBunnyEmbedUrl(link);
    if (bunnyEmbed) return { type: 'bunny', embedUrl: bunnyEmbed };
    // Bare Bunny video UUID
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(link)) {
      return { type: 'bunny', embedUrl: buildBunnyVodEmbedUrl(link) };
    }
    // YouTube
    const ytId = getYouTubeVideoId(link);
    if (ytId) return { type: 'youtube', id: ytId };
  }
  return null;
}

export default function ProgramSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [activeEpIndex, setActiveEpIndex] = useState(0);
  const [activeSeason, setActiveSeason] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTitleBar, setShowTitleBar] = useState(false);
  /** False = show poster/play-button (no iframe in DOM, zero bandwidth). True = player active. */
  const [playerActive, setPlayerActive] = useState(false);

  // Ref to the player iframe so we can pause/resume via postMessage or playerjs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Ref for the 5-second title bar hide timer
  const titleBarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Stable ref so pause/resume callbacks always see the current video type
  const videoTypeRef = useRef<'youtube' | 'bunny' | null>(null);
  // Bunny playerjs instance — set up when the Bunny iframe loads
  const bunnyPlayerRef = useRef<PlayerJSInstance | null>(null);
  // Ref to the player container div — used to request fullscreen from within ads
  const playerContainerRef = useRef<HTMLDivElement>(null);

  /** Show the title bar for 5 seconds then auto-hide */
  const showTitleBarFor5s = useCallback(() => {
    setShowTitleBar(true);
    if (titleBarTimerRef.current) clearTimeout(titleBarTimerRef.current);
    titleBarTimerRef.current = setTimeout(() => setShowTitleBar(false), 5000);
  }, []);

  /** Pause the active player */
  const pausePlayer = useCallback(() => {
    if (videoTypeRef.current === 'youtube') {
      iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    } else if (videoTypeRef.current === 'bunny') {
      bunnyPlayerRef.current?.pause?.();
    }
  }, []);

  /** Resume the active player */
  const resumePlayer = useCallback(() => {
    if (videoTypeRef.current === 'youtube') {
      iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    } else if (videoTypeRef.current === 'bunny') {
      bunnyPlayerRef.current?.play?.();
    }
  }, []);

  // ── Mid-roll ad timing ──────────────────────────────────────────────────────
  const { showMidroll, startTicking, stopTicking, reset: resetMidroll, handleAdFinished } = useMidroll({
    intervalSeconds: 1200,
    onAdStart:  pausePlayer,
    onAdEnd:    resumePlayer,
  });

  // Listen for YouTube player state changes via postMessage
  useEffect(() => {
    const handleYTMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        let playerState: number | undefined;
        if (data.event === 'onStateChange') {
          playerState = data.info;
        } else if (data.event === 'infoDelivery' && typeof data.info?.playerState === 'number') {
          playerState = data.info.playerState;
        }
        // 1 = playing → start ticker; 0 = ended, 2 = paused → stop ticker
        if (playerState === 1) startTicking();
        if (playerState === 0 || playerState === 2) {
          stopTicking();
          showTitleBarFor5s();
        }
      } catch { /* non-JSON messages ignored */ }
    };
    window.addEventListener('message', handleYTMessage);
    return () => window.removeEventListener('message', handleYTMessage);
  }, [showTitleBarFor5s, startTicking, stopTicking]);

  /** Set up playerjs on the Bunny iframe — required for reliable pause/play/events */
  const setupBunnyPlayer = useCallback((iframe: HTMLIFrameElement) => {
    if (!window.playerjs) return;
    const player = new window.playerjs.Player(iframe);
    bunnyPlayerRef.current = player;
    player.on('ready', () => {
      player.on('play',  () => startTicking());
      player.on('pause', () => stopTicking());
      player.on('ended', () => stopTicking());
    });
  }, [startTicking, stopTicking]);

  /** Called when any player iframe finishes loading */
  const handleIframeLoad = useCallback(() => {
    if (videoTypeRef.current === 'bunny' && iframeRef.current) {
      if (window.playerjs) {
        setupBunnyPlayer(iframeRef.current);
      } else {
        const el = iframeRef.current;
        setTimeout(() => { if (window.playerjs) setupBunnyPlayer(el); }, 1000);
      }
    } else {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
    }
    showTitleBarFor5s();
  }, [showTitleBarFor5s, setupBunnyPlayer]);

  // Reset mid-roll and unload player when the episode changes
  useEffect(() => {
    setPlayerActive(false);
    bunnyPlayerRef.current = null;
    resetMidroll();
    if (titleBarTimerRef.current) clearTimeout(titleBarTimerRef.current);
  }, [activeEpIndex, activeSeason, resetMidroll]);

  // Cleanup title-bar timer on unmount (ticker cleanup is handled by useMidroll)
  useEffect(() => {
    return () => { if (titleBarTimerRef.current) clearTimeout(titleBarTimerRef.current); };
  }, []);

  const handlePlayClick = useCallback(() => {
    setPlayerActive(true);
    showTitleBarFor5s();
    // Midroll ticking starts when the player fires its first 'play' event
  }, [showTitleBarFor5s]);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        const response = await fetch(`/api/programs?slug=${slug}`);
        const data = await response.json();
        setProgram(data || null);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgram();
  }, [slug]);

  const allEpisodes = program?.temporadas?.flatMap(season => 
    season.episodios?.map(ep => ({
      ...ep,
      season_num: season.numero_temporada,
      season_title: season.descricao_temporada
    })) || []
  ) || [];

  const currentSeasonEpisodes = program?.temporadas?.[activeSeason]?.episodios || [];
  const currentEp = currentSeasonEpisodes[activeEpIndex];
  const currentVideo = resolveEpisodeVideo(currentEp);
  // Keep the ref in sync — done in an effect to avoid updating refs during render
  useEffect(() => { videoTypeRef.current = currentVideo?.type ?? null; });

  const handleEpisodeClick = (episode: any) => {
    const epIdx = currentSeasonEpisodes.findIndex(ep => ep.numero === episode.numero) || 0;
    setActiveEpIndex(epIdx);
  };

  if (isLoading || !program) {
    return (
      <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-center h-96">
          <p className="text-white/40">{isLoading ? 'Carregando programa...' : 'Programa não encontrado'}</p>
        </div>
      </main>
    );
  }

  if (!program.title?.rendered) {
    return (
      <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-center h-96">
          <p className="text-white/40">Erro ao carregar dados do programa</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20 overflow-x-hidden">
      {/* playerjs library — required for Bunny player pause/play/event control */}
      <Script src="//assets.mediadelivery.net/playerjs/playerjs-latest.min.js" strategy="afterInteractive" />
      
      <div className="container mx-auto px-6 md:px-12">
        
        {/* NAVEGAÇÃO & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div className="space-y-4">
            <Link href="/gaia-play" className="group flex items-center gap-2 text-white/40 hover:text-[#00a6f0] transition-colors">
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-[0.3em] pt-[2px]">Explorar Programas</span>
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              {program.title.rendered.split(' ')[0]} <br />
              <span className="text-transparent outline-text-vibrant">
                {program.title.rendered.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <ShareButton title={program.title.rendered} season={currentEp?.season_num} episode={currentEp?.numero} />
          </div>
        </div>

        {/* CINEMA BLOCK (PLAYER + SIDEBAR) */}
        <div className="flex flex-col lg:flex-row bg-[#0a0c10] border border-white/10 shadow-3xl overflow-hidden lg:max-h-[600px]">
          
          {/* LADO ESQUERDO: VIDEO AREA */}
          <div ref={playerContainerRef} className="lg:w-[72%] relative aspect-video bg-black group flex-shrink-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${currentEp?.numero}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {currentVideo ? (
                  playerActive ? (
                    // ── ACTIVE PLAYER — iframe only injected after user clicks play ──
                    currentVideo.type === 'bunny' ? (
                      <iframe
                        ref={iframeRef}
                        key={`${activeSeason}-${currentEp?.numero}`}
                        width="100%"
                        height="100%"
                        src={`${currentVideo.embedUrl}?autoplay=true`}
                        title={currentEp?.titulo}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        onLoad={handleIframeLoad}
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <iframe
                        ref={iframeRef}
                        key={`${activeSeason}-${currentEp?.numero}`}
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentVideo.id}?modestbranding=1&rel=0&controls=1&enablejsapi=1&autoplay=1`}
                        title={currentEp?.titulo}
                        frameBorder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={handleIframeLoad}
                        className="w-full h-full"
                      />
                    )
                  ) : (
                    // ── POSTER / FACADE — zero CDN requests until user clicks ──
                    <button
                      onClick={handlePlayClick}
                      className="absolute inset-0 w-full h-full flex items-center justify-center group/play cursor-pointer bg-black"
                      aria-label={`Reproduzir ${currentEp?.titulo}`}
                    >
                      {program?.featured_image_url && (
                        <Image
                          src={program.featured_image_url}
                          alt={currentEp?.titulo ?? ''}
                          fill
                          className="object-cover opacity-40 transition-opacity duration-300 group-hover/play:opacity-30"
                          priority
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm transition-all duration-200 group-hover/play:scale-110 group-hover/play:bg-white/20 group-hover/play:border-white/70">
                          <Play size={32} className="text-white ml-1" fill="white" />
                        </div>
                        <div className="text-center">
                          <p className="text-white/50 text-xs uppercase tracking-widest font-black">S{(activeSeason + 1).toString().padStart(2, '0')} · EP{currentEp?.numero?.toString().padStart(2, '0')}</p>
                          <p className="text-white font-black text-lg uppercase italic tracking-tight mt-1">{currentEp?.titulo}</p>
                        </div>
                      </div>
                    </button>
                  )
                ) : (
                  <>
                    {program.featured_image_url ? (
                      <Image 
                        src={program.featured_image_url} 
                        alt={program.title.rendered} 
                        fill 
                        className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00a6f0]/20 to-[#0a0c10] opacity-50" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Play size={40} className="mx-auto text-white/40" />
                        <p className="text-white/40 text-sm">Nenhum vídeo disponível</p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-linear-to-t from-black via-black/80 to-transparent">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-md font-black text-white/40 uppercase tracking-widest italic">S{(activeSeason + 1).toString().padStart(2, '0')} : EP{currentEp?.numero?.toString().padStart(2, '0')}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{currentEp?.titulo}</h2>
                    </div>
                  </>
                )}

                {currentVideo && playerActive && (
                  <AnimatePresence>
                    {showTitleBar && (
                      <motion.div
                        key="title-bar"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-md font-black text-white/40 uppercase tracking-widest italic">S{(activeSeason + 1).toString().padStart(2, '0')} : EP{currentEp?.numero?.toString().padStart(2, '0')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{currentEp?.titulo}</h2>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            </AnimatePresence>

            {/* MID-ROLL AD OVERLAY */}
            {showMidroll && (
              <MidrollAd onFinished={handleAdFinished} containerRef={playerContainerRef} />
            )}
          </div>

          {/* LADO DIREITO: EPISODE LIST (FIXED SCROLL) */}
          <div className="lg:w-[28%] bg-[#08090b] border-l border-white/10 flex flex-col min-h-[400px] lg:min-h-0">
            {/* Season Selector */}
            {program.temporadas && program.temporadas.length > 0 && (
              <div className="p-5 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/10 flex-shrink-0">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-[#00a6f0] block mb-3">Temporadas</label>
                <SeasonSelector
                  seasons={program.temporadas}
                  activeSeason={activeSeason}
                  onSeasonChange={(seasonIdx) => {
                    setActiveSeason(seasonIdx);
                    setActiveEpIndex(0);
                  }}
                />
              </div>
            )}
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MonitorPlay size={14} className="text-[#00a6f0]" /> Episódios
              </h3>
              <span className="text-sm font-black text-white/40">{currentSeasonEpisodes.length} EP</span>
            </div>
            
            {/* LISTA DE EPISÓDIOS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
              {currentSeasonEpisodes.map((ep, idx) => (
                <button 
                  key={`${ep.numero}`}
                  onClick={() => handleEpisodeClick(ep)}
                  className={`w-full flex flex-col gap-1 p-6 transition-all border-b border-white/5 text-left relative cursor-pointer group
                    ${activeEpIndex === idx
                      ? 'bg-[#00a6f0]/10 border-l-4 border-l-[#00a6f0]' 
                      : 'hover:bg-white/10 border-l-4 border-l-transparent group-hover:border-l-[#00a6f0]/50'}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black uppercase tracking-widest transition-colors ${activeEpIndex === idx ? 'text-[#00a6f0]' : 'text-white/40 group-hover:text-white/70'}`}>
                      EP {ep.numero?.toString().padStart(2, '0')}
                    </span>
                    {activeEpIndex === idx && <div className="h-1 w-8 bg-[#00a6f0] animate-pulse" />}
                  </div>
                  <h4 className={`text-sm font-black uppercase tracking-tight leading-tight transition-colors ${activeEpIndex === idx ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {ep.titulo}
                  </h4>
                  <span className="text-sm font-bold text-white/40 mt-1 uppercase italic">{ep.duracao || 0}m</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-black border-t border-white/5 hidden lg:block flex-shrink-0">
               <p className="text-xs font-bold text-white/40 uppercase">Terras de Gaia © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* INFO BAR CONTEXTUAL */}
        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-8 gap-x-12 py-8 border-y border-white/5">
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Ano</span>
               <span className="text-sm font-bold">{formatYear(program.acf?.ano_lancamento)}</span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:border-none md:pl-0">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Género</span>
               <span className="text-sm font-bold uppercase tracking-tighter">{program.acf?.categoria_programa || "Geral"}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Duração Média</span>
               <span className="text-sm font-bold uppercase tracking-tighter">
                 {allEpisodes.length > 0 
                   ? Math.round(allEpisodes.reduce((acc, ep) => acc + (ep.duracao || 0), 0) / allEpisodes.length) 
                   : 0} min
               </span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:text-right md:border-none md:pl-0">
               <span className="text-sm font-black text-[#00a6f0] uppercase tracking-[0.2em] mb-1">Exibição Original</span>
               <span className="text-sm font-bold italic">{formatExibicao(program.acf?.exibicao_original) || "Não especificado"}</span>
             </div>
          </div>

          <div className="max-w-4xl mt-12 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#00a6f0]">Sobre o Programa</h3>
            <p className="text-xl md:text-3xl text-white/60 font-medium italic leading-[1.3] tracking-tight">
              {cleanText(program.excerpt.rendered)}
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        .outline-text-vibrant {
          -webkit-text-stroke: 1.5px #00a6f0;
          text-shadow: 0 0 30px rgba(0,166,240,0.1);
        }
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00a6f0; border-radius: 10px; }
      `}</style>
    </main>
  );
}