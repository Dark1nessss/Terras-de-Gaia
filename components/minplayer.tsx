"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Minus, Tv, Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import Link from "next/link";

const DEFAULT_VIDEO_ID = "jfKfPfyJRdk";
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function todayLabel(): string {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return DIAS[d.getDay()] + ', ' + day + '/' + month;
}

function parseYouTubeId(link: string): string | null {
  if (!link) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(link)) return link;
  const m = link.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function LiveStreamPlayer() {
  const [viewState, setViewState] = useState<"hidden" | "pip" | "loading">("loading");
  const [isFullscreen, setIsFullscreen] = useState(false); // Track FS state explicitly
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [hasStream, setHasStream] = useState(true);
  const [currentProgram, setCurrentProgram] = useState<string | null>(null);
  const [streamVideoId, setStreamVideoId] = useState(DEFAULT_VIDEO_ID);

  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const embedUrl = 'https://www.youtube.com/embed/' + streamVideoId + '?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1';

  // Sync with localStorage and Fullscreen events
  useEffect(() => {
    const saved = localStorage.getItem("tg-player-hidden");
    setViewState(saved === "true" ? "hidden" : "pip");

    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Fetch current on-air program and manage auto-switch
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function applyPrograms(programs: any[]) {
      const now = new Date();
      const ct = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const today = todayLabel();
      const live = programs.find(
        (p) =>
          p.data_completa?.trim() === today &&
          p.hora_inicio && p.hora_fim &&
          p.hora_inicio <= ct && p.hora_fim > ct
      );
      if (live?.title) setCurrentProgram(live.title);
      const id = (live?.link && parseYouTubeId(live.link)) || DEFAULT_VIDEO_ID;
      setStreamVideoId(id);
      // Schedule auto-switch when program ends
      if (live?.hora_fim) {
        const parts = (live.hora_fim as string).split(':').map(Number);
        const end = new Date();
        end.setHours(parts[0], parts[1], 5, 0);
        const ms = end.getTime() - Date.now();
        if (ms > 0) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            fetch('/api/tv-guide')
              .then(r => r.json())
              .then(applyPrograms)
              .catch(() => null);
          }, ms);
        }
      }
    }

    fetch('/api/tv-guide')
      .then(r => r.json())
      .then(applyPrograms)
      .catch(() => null);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Listen to isPlaying state changes and send postMessage to YouTube IFrame API
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = JSON.stringify({
        event: "command",
        func: isPlaying ? "playVideo" : "pauseVideo",
        args: [],
      });
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  }, [isPlaying]);

  // Listen to isMuted state changes and send postMessage to YouTube IFrame API
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = JSON.stringify({
        event: "command",
        func: isMuted ? "mute" : "unMute",
        args: [],
      });
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.detail === 1) {
      clickTimer.current = setTimeout(() => setIsPlaying((p) => !p), 250);
    } else if (e.detail === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      toggleFullscreen();
    }
  };

  const toggleView = useCallback(async (state: "hidden" | "pip") => {
    if (state === "hidden" && document.fullscreenElement) await document.exitFullscreen();
    setViewState(state);
    localStorage.setItem("tg-player-hidden", state === "hidden" ? "true" : "false");
  }, []);

  if (viewState === "loading") return null;

  if (viewState === "hidden") {
    return (
      <div className="fixed bottom-6 right-6 z-70">
        <button 
          onClick={() => toggleView("pip")} 
          className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-[#0055ff] text-white shadow-lg border border-white/10 active:scale-95 transition-all cursor-pointer"
        >
          {/* The Blue Broadcast Pulse */}
          <span className="absolute inset-0 rounded-full bg-[#0055ff] animate-ping opacity-40 group-hover:opacity-60" />
          
          {/* The Icon (Static Center) */}
          <Tv size={24} fill="currentColor" className="relative z-10" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`fixed z-70 transition-all duration-300 group bg-black overflow-hidden 
        ${isFullscreen ? 'inset-0 w-screen h-screen rounded-none' : 'bottom-6 right-6 w-[320px] md:w-105 aspect-video rounded-xl shadow-2xl border border-white/10'}`}
    >
      {!hasStream ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center">
          <Radio className="text-white/20 mb-3 animate-pulse" size={48} />
          <h3 className="text-white font-bold uppercase italic">No Livestream atm</h3>
          <button onClick={() => toggleView("hidden")} className="absolute top-4 right-4 text-white/40 cursor-pointer"><Minus size={20} /></button>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <iframe ref={iframeRef} src={embedUrl} className="w-full h-full pointer-events-none" allow="autoplay; fullscreen" />
          
          {/* Top Bar - Hidden when FS */}
          {!isFullscreen && (
            <div className="absolute top-3 right-3 z-60 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/live"><button className="bg-black/40 p-2 rounded-full border border-white/10 text-white cursor-pointer"><Tv size={16} /></button></Link>
              <button onClick={() => toggleView("hidden")} className="bg-black/40 p-2 rounded-full border border-white/10 text-white cursor-pointer"><Minus size={16} /></button>
            </div>
          )}

          {/* Logic Overlay */}
          <div className="absolute inset-0 z-40" onClick={handleInteraction} />

          {/* Bottom Bar */}
          <div className={`absolute bottom-0 inset-x-0 h-14 z-50 bg-linear-to-t from-black flex items-center px-5 justify-between gap-3 transition-all 
            ${isFullscreen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
            <div className="flex items-center gap-5 pointer-events-auto shrink-0">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-white cursor-pointer">{isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}</button>
              <button onClick={() => setIsMuted(!isMuted)} className="text-white cursor-pointer">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
              <button onClick={() => { if (iframeRef.current) iframeRef.current.src = embedUrl; }} className="flex items-center gap-2 px-2 py-1 border border-red-600 rounded text-xs font-bold text-white uppercase italic cursor-pointer">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Direto
              </button>
            </div>
            {currentProgram && (
              <span className="text-white/50 text-[9px] font-black uppercase italic tracking-wide truncate flex-1 text-center hidden sm:block">
                {currentProgram}
              </span>
            )}
            <button onClick={toggleFullscreen} className="text-white/60 hover:text-white pointer-events-auto cursor-pointer shrink-0"><Maximize2 size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}