import Link from "next/link";
import { LiveDot } from "@/components/live-dot";

export default function Hero() {
  return (
    <section className="relative h-dvh w-full overflow-hidden flex flex-col justify-end font-nurom z-0">
      {/* Background Video */}
      <video 
        autoPlay muted loop playsInline 
        className="absolute inset-0 size-full object-cover z-0 scale-105 md:scale-100"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[#0045ac]/20 mix-blend-overlay z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-20" />

      {/* 1. Main Content Container */}
      <div className="container mx-auto px-6 relative z-30 text-white mb-6 md:mb-10">

        {/* Headlines: Adjusting size for Mobile */}
        <div className="max-w-4xl select-none">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4 md:mb-6 drop-shadow-2xl">
            Terras de <br /> 
            <span className="text-[#00a6f0]">Gaia</span>
          </h1>
          
          <div className="relative border-l-[3px] border-[#00a6f0] pl-4 md:pl-6 py-1 md:py-2">
            <p className="text-md md:text-lg text-white/90 font-bold max-w-sm md:max-w-xl leading-tight italic tracking-tight uppercase">
              O lugar onde as Histórias de Gaia ganham vida <br className="hidden md:block" /> 
              Desporto, Informação e Entretenimento num só Espaço.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full Width Separator Line */}
      <div className="w-screen h-px bg-white/10 relative z-40 left-1/2 -translate-x-1/2" />

      {/* 3. Glued Buttons Area - Responsive Layout */}
      <div className="w-full bg-[#1a181e]/80 backdrop-blur-xl relative z-50 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-0 md:px-6 flex flex-row items-center md:justify-start">
        <Link href="/gaia-play" className="flex-[0.4] md:flex-none md:order-2">
          <button className="
            [--h:50px] md:[--h:40px] [--x:calc(var(--h)/2/7.115)] 
            w-full md:w-auto relative h-(--h) px-4 md:px-8 flex items-center justify-center font-black transition-all group cursor-pointer isolate
            before:absolute before:-z-10 before:-inset-x-(--x) before:inset-y-0 before:-skew-x-8 hover:before:bg-white/10
          ">
            <span className="text-white/60 group-hover:text-white uppercase italic tracking-tight md:tracking-widest text-xs md:text-[11px] transition-colors relative">
              Programas
            </span>
          </button>
        </Link>
          <Link href="/live" className="flex-[0.6] md:flex-none md:order-1">
            <button className="
              [--h:50px] md:[--h:40px] [--x:calc(var(--h)/2/7.115)] 
              w-full md:w-auto relative h-(--h) px-6 md:px-8 flex items-center justify-center font-black isolate transition-all active:scale-95 cursor-pointer group
              before:absolute before:-z-10 before:-inset-x-(--x) before:inset-y-0 before:-skew-x-8 before:bg-[#0055ff]
            ">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-white uppercase italic tracking-tight md:tracking-widest text-xs md:text-[11px] whitespace-nowrap mt-1">
                  Ver emissão em direto
                </span>
                  <LiveDot size="sm" />
              </div>
            </button>
          </Link>

        </div>
      </div>
    </section>
  );
}