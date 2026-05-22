import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export const metadata = {
  title: "404 — Página não encontrada | Terras de Gaia",
};

export default function NotFound() {
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

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-3xl h-[60vh] bg-[#00a6f0]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Ghost number */}
      <span className="absolute inset-0 flex items-center justify-center text-[40vw] font-black italic text-white/2.5 leading-none select-none pointer-events-none">
        404
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-0">
        <p className="text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.6em] mb-6">
          Erro 404
        </p>

        <h1 className="text-[clamp(3.5rem,14vw,11rem)] font-black uppercase italic leading-[0.82] tracking-tighter mb-6">
          Página<br />
          <span className="text-[#00a6f0] drop-shadow-[0_0_50px_rgba(0,166,240,0.35)]">
            não encontrada.
          </span>
        </h1>

        <div className="w-16 h-px bg-white/10 my-8" />

        <p className="text-white/40 text-base max-w-md leading-relaxed mb-10">
          A página que procura não existe ou foi movida. Verifique o endereço ou navegue para a página inicial.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2 bg-[#00a6f0] text-white text-[11px] font-black uppercase tracking-[0.3em] px-8 py-4 hover:bg-[#00a6f0]/80 transition-colors duration-300"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Início
          </Link>
        </div>
      </div>
    </main>
  );
}
