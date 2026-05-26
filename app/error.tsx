"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 3px)" }}
      />

      {/* Blue glow for service outage */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-3xl h-[60vh] bg-[#006ec2]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] max-w-xl h-[40vh] bg-[#006ec2]/4 blur-[100px] rounded-full pointer-events-none" />

      {/* Ghost text */}
      <span className="absolute inset-0 flex items-center justify-center text-[30vw] font-black italic text-white/2 leading-none select-none pointer-events-none">
        500
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-0">
        <p className="text-[#006ec2]/80 text-[10px] font-black uppercase tracking-[0.6em] mb-6">
          Serviço Indisponível
        </p>

        <h1 className="text-[clamp(3rem,12vw,10rem)] font-black uppercase italic leading-[0.82] tracking-tighter mb-6">
          Estamos a<br />
          <span className="text-[#006ec2] drop-shadow-[0_0_50px_rgba(0,166,240,0.35)]">
            trabalhar.
          </span>
        </h1>

        <div className="w-16 h-px bg-white/10 my-8" />

        <p className="text-white/40 text-base max-w-md leading-relaxed mb-10">
          Os nossos conteúdos estão temporariamente indisponíveis. A equipa já está a resolver o problema — volte mais tarde.
        </p>

        {error.digest && (
          <p className="text-white/15 text-[10px] font-mono tracking-wider mb-8">
            #{error.digest}
          </p>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="group flex items-center gap-2 bg-[#006ec2] text-white text-[11px] font-black uppercase tracking-[0.3em] px-8 py-4 hover:bg-[#006ec2]/80 transition-colors duration-300 cursor-pointer"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="mt-1">Tentar novamente</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 border border-white/10 text-white/50 hover:border-white/30 hover:text-white text-[11px] font-black uppercase tracking-[0.3em] px-8 py-4 transition-all duration-300"
          >
            <ArrowLeft size={14} />
            <span className="mt-1">Início</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
