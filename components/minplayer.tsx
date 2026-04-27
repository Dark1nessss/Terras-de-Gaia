"use client";

import { useState, useRef } from "react";
import { Maximize2, Minus, Tv } from "lucide-react";

export default function LiveStreamPlayer() {
  const [viewState, setViewState] = useState<"hidden" | "pip">("pip");
  const [isLive, setIsLive] = useState(true); // Toggles the red/grey indicator
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = "jfKfPfyJRdk";
  // Added t=0 to help with resetting to live if needed
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`;

  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Fullscreen failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const jumpToLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simple way to refresh the live edge: reload src
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
    setIsLive(true);
  };

  if (viewState === "hidden") {
    return (
      <div className="fixed bottom-6 right-6 z-60 flex items-center justify-center">
        <span 
          className="absolute inset-0 rounded-full bg-blue-900/40 animate-ping" 
          style={{ animationDuration: "2.4s" }} 
        />
        <button
          onClick={() => setViewState("pip")}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#0045ac] text-white shadow-lg active:scale-95 transition-transform z-10"
        >
          <Tv size={24} fill="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className="fixed bottom-6 right-6 z-60 w-[320px] md:w-105 aspect-video rounded-lg overflow-hidden shadow-2xl bg-black border border-white/5 transition-all duration-500 ease-in-out"
    >
      {/* Top Action Bar */}
      <div className="absolute top-2 right-2 z-30 flex gap-2">
        <button 
          onClick={toggleFullscreen}
          className="backdrop-blur-sm bg-black/70 text-white border border-white/10 size-8 rounded-full flex items-center justify-center transition hover:bg-black/90 active:scale-90"
        >
          <Maximize2 size={14} />
        </button>
        <button 
          onClick={() => setViewState("hidden")}
          className="backdrop-blur-sm bg-black/70 text-white border border-white/10 size-8 rounded-full flex items-center justify-center transition hover:bg-black/90 active:scale-90"
        >
          <Minus size={14} />
        </button>
      </div>

      <div className="relative w-full h-full group">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full pointer-events-none"
          allow="autoplay; fullscreen; picture-in-picture"
          title="Live Stream"
        />
        
        {/* Click Overlay - Handling click for better permission support */}
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          onClick={(e) => {
             // If double click is too fast, some browsers fail permission on the second click.
             // Single click for fullscreen is more production-stable, but we'll keep your toggleFullscreen.
             if (e.detail === 2) toggleFullscreen();
          }} 
        />

        {/* Bottom Banner Area */}
        <div className="absolute bottom-0 inset-x-0 h-10 z-20 bg-linear-to-t from-black/80 to-transparent flex items-center px-4 justify-between pointer-events-none">
           <button 
              onClick={jumpToLive}
              className="flex items-center gap-2 pointer-events-auto group/live"
           >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-gray-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isLive ? 'text-white' : 'text-gray-400 group-hover/live:text-white'}`}>
                Direto
              </span>
           </button>
           <span className="text-[9px] font-bold text-white/40 uppercase italic tracking-widest">Terras de Gaia</span>
        </div>
      </div>
    </div>
  );
}