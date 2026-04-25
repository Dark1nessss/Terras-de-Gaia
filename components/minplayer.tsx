"use client";

import { useState, useRef } from "react";
import { Maximize2, Minus, Tv } from "lucide-react";

export default function LiveStreamPlayer() {
  const [viewState, setViewState] = useState<"hidden" | "pip">("pip");
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // 1. HIDDEN STATE: Small Pulse Button (Exact Porto Canal Spec)
  if (viewState === "hidden") {
    return (
      <div className="fixed bottom-6 right-6 z-[60] flex items-center justify-center">
        {/* The 2.4s Pulse Effect from your code */}
        <span 
          className="absolute inset-0 rounded-full bg-blue-900/40 animate-ping" 
          style={{ animationDuration: "2.4s" }} 
        />
        <button
          onClick={() => setViewState("pip")}
          className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#0045ac] text-white shadow-lg active:scale-95 transition-transform z-10"
          aria-label="Reabrir direto"
        >
          <Tv size={24} fill="currentColor" />
        </button>
      </div>
    );
  }

  // 2. PIP STATE: The Mini Player
  return (
    <div 
      className="fixed bottom-6 right-6 z-[60] w-[320px] md:w-[420px] aspect-video rounded-lg overflow-hidden shadow-2xl bg-[#2c272f] border border-white/5 transition-all duration-500 ease-emphasized"
      onDoubleClick={toggleFullscreen}
    >
      {/* Top Action Bar: Exact Porto Canal Button Styling */}
      <div className="absolute top-2 right-2 z-20 flex gap-2">
        <button 
          onClick={toggleFullscreen}
          className="backdrop-blur-sm bg-black/70 text-white border border-white/10 size-8 rounded-full flex items-center justify-center transition hover:bg-black/90 active:scale-90"
          aria-label="Ver direto"
        >
          <Maximize2 size={14} />
        </button>
        <button 
          onClick={() => setViewState("hidden")}
          className="backdrop-blur-sm bg-black/70 text-white border border-white/10 size-8 rounded-full flex items-center justify-center transition hover:bg-black/90 active:scale-90"
          aria-label="Fechar direto"
        >
          <Minus size={14} />
        </button>
      </div>

      <div className="relative w-full h-full group">
        {/* Video Feed Area */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover cursor-pointer"
        >
          <source src="/live-stream-placeholder.mp4" type="video/mp4" />
        </video>

        {/* The Live Score Bug (from our previous spec) */}
        <div className="absolute top-3 left-3 flex items-center bg-[#1a181e]/95 rounded-sm overflow-hidden text-[10px] font-nurom border border-white/5 shadow-xl pointer-events-none">
          <div className="bg-[#00a6f0] px-2 py-0.5 text-white font-black italic">LP</div>
          <div className="px-2.5 py-0.5 text-white flex items-center gap-1.5 border-r border-white/10">
            <span className="font-bold">FCP</span>
            <span className="text-[#00a6f0] font-black text-xs">2</span>
          </div>
          <div className="px-2.5 py-0.5 text-white flex items-center gap-1.5 border-r border-white/10">
            <span className="font-bold">CHA</span>
            <span className="text-white/40 font-black text-xs">0</span>
          </div>
          <div className="bg-black/20 px-2 py-0.5 text-white/50 tabular-nums">74:12</div>
        </div>

        {/* Bottom Banner Area */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-center px-4 justify-between">
           <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Direto</span>
           </div>
           <span className="text-[9px] font-bold text-white/40 uppercase italic tracking-widest">Porto Canal</span>
        </div>
      </div>
    </div>
  );
}