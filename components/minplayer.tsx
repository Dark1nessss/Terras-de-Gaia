"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, Minus, Tv, Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import Link from "next/link";

export default function LiveStreamPlayer() {
  const [viewState, setViewState] = useState<"hidden" | "pip" | "loading">("loading");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [hasStream, setHasStream] = useState(true); // Toggle this based on your API

  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = "jfKfPfyJRdk";
  // YouTube embed with JS API enabled for custom controls
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`;

  // Fix cascading render & sync storage
  useEffect(() => {
    const saved = localStorage.getItem("tg-player-hidden");
    setViewState(saved === "true" ? "hidden" : "pip");
  }, []);

  const toggleView = useCallback(async (state: "hidden" | "pip") => {
    if (state === "hidden" && document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    setViewState(state);
    localStorage.setItem("tg-player-hidden", state === "hidden" ? "true" : "false");
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  }, []);

  const syncToLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (iframeRef.current) {
      // Refreshing src is the safest way to "Catch up" without a complex API
      iframeRef.current.src = embedUrl;
    }
    setIsLive(true);
  };

  if (viewState === "loading") return null;

  if (viewState === "hidden") {
    return (
      <div className="fixed bottom-6 right-6 z-70 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping" />
        <button
          onClick={() => toggleView("pip")}
          className="relative w-14 h-14 flex items-center justify-center rounded-full bg-[#0055ff] text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] active:scale-90 transition-all z-10 border border-white/10"
        >
          <Tv size={24} fill="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`fixed bottom-6 right-6 z-70 transition-all duration-500 ease-in-out group
        ${document.fullscreenElement ? 'w-screen h-screen bottom-0 right-0 rounded-none' : 'w-[calc(100vw-48px)] sm:w-[320px] md:w-105 aspect-video rounded-xl shadow-2xl border border-white/10'}
        bg-black overflow-hidden`}
    >
      {!hasStream ? (
        /* Empty State / Schedule */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
          <Radio className="text-white/20 mb-3 animate-pulse" size={48} />
          <h3 className="text-white font-bold uppercase tracking-tighter italic">No Livestream atm</h3>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Next stream: Jornal Diário • 21:00</p>
          <button onClick={() => toggleView("hidden")} className="absolute top-4 right-4 text-white/40 hover:text-white">
            <Minus size={20} />
          </button>
        </div>
      ) : (
        <>
          {/* Top Bar - Only visible in PiP mode */}
          {!document.fullscreenElement && (
            <div className="absolute top-3 right-3 z-60 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/live" onClick={(e) => e.stopPropagation()}>
                <button className="bg-black/40 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-black/80"><Tv size={16} /></button>
              </Link>
              <button onClick={() => toggleView("hidden")} className="bg-black/40 backdrop-blur-md text-white p-2 rounded-full border border-white/10 hover:bg-black/80"><Minus size={16} /></button>
            </div>
          )}

          {/* Player Content */}
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full pointer-events-none scale-[1.01]"
              allow="autoplay; fullscreen"
            />

            {/* Desktop Interaction Overlay */}
            <div 
              className="absolute inset-0 z-40 cursor-pointer" 
              onClick={(e) => {
                if (e.detail === 1) setIsPlaying(!isPlaying);
                if (e.detail === 2) toggleFullscreen();
              }} 
            />

            {/* Bottom Broadcast Controller */}
            <div className={`absolute bottom-0 inset-x-0 h-14 z-50 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center px-5 justify-between transition-transform duration-300
              ${document.fullscreenElement ? 'translate-y-0' : 'translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'}`}>
              
              <div className="flex items-center gap-5 pointer-events-auto">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:scale-110 transition active:scale-95">
                  {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                </button>

                <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white transition">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <button onClick={syncToLive} className="flex items-center gap-2 px-2 py-1 rounded-sm border border-red-600/50 hover:bg-red-600/10 transition group/btn">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-zinc-500'}`} />
                  <span className="text-[10px] font-black text-white uppercase italic tracking-tight">Direto</span>
                </button>
              </div>

              <div className="flex items-center gap-4 pointer-events-auto">
                {/* Fullscreen Button in Bottom Right */}
                <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}