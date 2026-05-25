"use client";

import { useEffect, useRef, useState } from "react";
import { Tv } from "lucide-react";
import { parseYouTubeId } from "@/lib/video";
import { parseBunnyEmbedUrl } from "@/lib/bunny";
import { useMidroll } from "@/hooks/use-midroll";
import { MidrollAd } from "@/components/midroll-ad";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function todayLabel(): string {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return DIAS[d.getDay()] + ', ' + day + '/' + month;
}

type StreamSource =
  | { type: 'bunny'; embedUrl: string }
  | { type: 'youtube'; id: string }
  | { type: 'video'; url: string }
  | { type: 'offline' };

function resolveSource(
  videoUrl: string | null | undefined,
  livestreamEmbedUrl?: string,
): StreamSource {
  // Bunny livestream has priority when configured
  if (livestreamEmbedUrl) return { type: 'bunny', embedUrl: livestreamEmbedUrl };
  if (!videoUrl) return { type: 'offline' };
  // Fallback: Bunny embed URL stored in the program's video_url field
  if (parseBunnyEmbedUrl(videoUrl)) return { type: 'bunny', embedUrl: videoUrl };
  const ytId = parseYouTubeId(videoUrl);
  if (ytId) return { type: 'youtube', id: ytId };
  if (videoUrl.startsWith('http') || videoUrl.startsWith('/')) return { type: 'video', url: videoUrl };
  return { type: 'offline' };
}

export function LivePlayer({
  initialPrograms = [],
  livestreamEmbedUrl,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPrograms?: any[];
  /** Pre-built Bunny embed URL passed from the server. When set, this is always shown. */
  livestreamEmbedUrl?: string;
}) {
  const [source, setSource] = useState<StreamSource>({ type: 'offline' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // ── Mid-roll ads ─────────────────────────────────────────────────────
  // Live streams aren't paused during ads — the ad overlays on top.
  const { showMidroll, startTicking, stopTicking, reset: resetMidroll, handleAdFinished } =
    useMidroll({ intervalSeconds: 1200 });

  // Start / stop ticking based on whether the stream is live
  useEffect(() => {
    if (source.type !== 'offline') {
      startTicking();
    } else {
      stopTicking();
      resetMidroll();
    }
  }, [source.type, startTicking, stopTicking, resetMidroll]);

  useEffect(() => {
    // If a fixed Bunny livestream is configured, use it immediately
    if (livestreamEmbedUrl) {
      setSource({ type: 'bunny', embedUrl: livestreamEmbedUrl });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function applyPrograms(programs: any[]) {
      const now = new Date();
      const ct =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0');
      const today = todayLabel();

      const live = programs.find(
        (p) =>
          p.data_completa?.trim() === today &&
          p.hora_inicio && p.hora_fim &&
          p.hora_inicio <= ct && p.hora_fim > ct
      );

      setSource(resolveSource(live?.video_url, livestreamEmbedUrl));

      if (live?.hora_fim) {
        const parts = (live.hora_fim as string).split(':').map(Number);
        const end = new Date();
        end.setHours(parts[0], parts[1], 5, 0);
        const ms = end.getTime() - Date.now();
        if (ms > 0) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            fetch('/api/tv-guide')
              .then((r) => r.json())
              .then(applyPrograms)
              .catch(() => null);
          }, ms);
        }
      }
    }

    applyPrograms(initialPrograms);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [initialPrograms, livestreamEmbedUrl]);

  // Catch YouTube embed errors and fall back to offline placeholder
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.event === 'onError') setSource({ type: 'offline' });
      } catch { /* ignore */ }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (source.type === 'offline') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#070809] select-none relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)' }}
        />
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent to-black/60" />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
          <Tv size={40} className="text-white/10 mb-2" />
          <p className="text-white/15 text-[10px] font-black uppercase tracking-[0.5em]">Terras de Gaia TV</p>
          <p className="text-white/50 text-2xl font-black uppercase italic tracking-tighter">Fora de Emissão</p>
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mt-1">
            Consulta a programação para os próximos conteúdos
          </p>
        </div>
      </div>
    );
  }

  if (source.type === 'video') {
    return (
      <video
        src={source.url}
        autoPlay
        controls
        className="w-full h-full bg-black"
        onError={() => setSource({ type: 'offline' })}
      />
    );
  }

  if (source.type === 'bunny') {
    return (
      <div ref={playerContainerRef} className="relative w-full h-full">
        <iframe
          ref={iframeRef}
          src={`${source.embedUrl}?autoplay=true&muted=false`}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
        {showMidroll && <MidrollAd onFinished={handleAdFinished} containerRef={playerContainerRef} />}
      </div>
    );
  }

  // YouTube
  return (
    <div ref={playerContainerRef} className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${source.id}?autoplay=1&mute=0&controls=1&modestbranding=1&enablejsapi=1`}
        className="w-full h-full"
        allow="autoplay; fullscreen"
        onLoad={() =>
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening' }), '*'
          )
        }
      />
      {showMidroll && <MidrollAd onFinished={handleAdFinished} containerRef={playerContainerRef} />}
    </div>
  );
}

