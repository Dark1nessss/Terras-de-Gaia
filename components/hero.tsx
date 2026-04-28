import Link from "next/link";

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
        
        {/* Status Badge */}
        <div className="flex items-center mb-4 md:mb-6">
          <div className="flex items-center bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              Em direto
            </span>
          </div>
        </div>

        {/* Headlines: Adjusting size for Mobile */}
        <div className="max-w-4xl select-none">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4 md:mb-6 drop-shadow-2xl">
            Jornal <br /> 
            <span className="text-[#00a6f0]">Diário</span>
          </h1>
          
          <div className="relative border-l-[3px] border-[#00a6f0] pl-4 md:pl-6 py-1 md:py-2">
            <p className="text-md md:text-lg text-white/90 font-bold max-w-sm md:max-w-xl leading-tight italic tracking-tight uppercase">
              Espaço de notícias que marcam a atualidade <br className="hidden md:block" /> 
              do desporto e da região.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full Width Separator Line */}
      <div className="w-screen h-px bg-white/10 relative z-40 left-1/2 -translate-x-1/2" />

      {/* 3. Glued Buttons Area - Responsive Layout */}
      <div className="w-full bg-[#1a181e]/80 backdrop-blur-xl relative z-50 border-t border-white/5">
        <div className="container mx-auto px-0 md:px-6 flex flex-row items-center">
          
          {/* Primary Button - Emission */}
          <Link href="/live">
          <button className="
            [--h:60px] md:[--h:64px] [--x:calc(var(--h)/2/7.115)] 
            flex-1 md:flex-none relative h-(--h) px-4 md:px-12 flex items-center justify-center font-black isolate transition-all active:scale-95 cursor-pointer group
            before:absolute before:-z-10 before:-inset-x-(--x) before:inset-y-0 before:-skew-x-8 before:bg-[#0055ff]
          ">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-white uppercase italic tracking-tight md:tracking-widest text-[10px] md:text-[12px] whitespace-nowrap">
                Emissão Direto
              </span>
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></span>
              </span>
            </div>
          </button>
          </Link>
          
          {/* Secondary Button - Programs */}
          <button className="
            [--h:60px] md:[--h:64px] [--x:calc(var(--h)/2/7.115)] 
            flex-1 md:flex-none relative h-(--h) px-4 md:px-16 flex items-center justify-center font-black transition-all group cursor-pointer
            before:absolute before:-z-10 before:-inset-x-(--x) before:inset-y-0 before:-skew-x-8 before:bg-white/5 md:hover:before:bg-white/10
          ">
            <span className="text-white/60 group-hover:text-white uppercase italic tracking-tight md:tracking-widest text-[10px] md:text-[12px] transition-colors relative">
              Programas
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}