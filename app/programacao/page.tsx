import { getTVGuide } from '@/lib/wp';
import { TVGuideGrid } from '@/components/tvguidegrid';
import Link from 'next/link';

export const revalidate = 300;

export const metadata = {
  title: 'Programação | Terras de Gaia TV',
  description: 'Guia de programação da Terras de Gaia TV — saiba o que está a dar agora e nos próximos dias.',
};

export default async function ProgramacaoPage() {
  const programs = await getTVGuide();

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const liveNow = programs.find((p) =>
    p.hora_inicio && p.hora_fim && p.hora_inicio <= currentTime && p.hora_fim > currentTime
  );

  const upNext = programs.find((p) => p.hora_inicio && p.hora_inicio > currentTime);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-150 h-75 bg-[#00a6f0]/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 pt-14 pb-10 relative z-10">

          {/* Label */}
          <span className="flex items-center gap-3 text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.5em] mb-8">
            <span className="size-2 bg-[#00a6f0] rounded-full" />
            Terras de Gaia TV
          </span>

          {/* Title + inline meta */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter shrink-0">
              AGE<span className="text-transparent" style={{ WebkitTextStroke: '2px #00a6f0' }}>NDA</span>
            </h1>

            {/* Vertical stat stack — replaces the two boxes */}
            <div className="flex flex-col gap-0 border-l border-white/10 pl-8 pb-2 min-w-64">
              {liveNow ? (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-[0.45em] text-red-400">Em Emissão</span>
                  </div>
                  <p className="text-white font-black uppercase italic text-2xl leading-tight tracking-tighter">{liveNow.title}</p>
                  <p className="text-white/30 text-xs font-bold mt-1 tracking-widest">{liveNow.time}</p>
                </div>
              ) : (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 rounded-full bg-white/10 shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white/20">Em Emissão</span>
                  </div>
                  <p className="text-white/20 italic text-sm">Sem emissão agendada</p>
                </div>
              )}

              <div className="h-px bg-white/5 mb-5" />

              {upNext ? (
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white/30 block mb-2">A Seguir</span>
                  <p className="text-white/60 font-black uppercase italic text-lg leading-tight tracking-tighter">{upNext.title}</p>
                  <p className="text-[#00a6f0] text-xs font-bold mt-1 tracking-widest">{upNext.time}</p>
                </div>
              ) : (
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.45em] text-white/20 block mb-2">A Seguir</span>
                  <p className="text-white/20 italic text-sm">—</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width divider strip */}
        <div className="relative h-px bg-white/5">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-linear-to-r from-[#00a6f0]/40 to-transparent" />
        </div>
      </section>

      {/* ── TV GUIDE GRID ────────────────────────────────────────────── */}
      <TVGuideGrid initialPrograms={programs} />

      {/* ── FOOTER CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-1">Quer ver em direto?</p>
            <p className="text-white font-black uppercase italic text-2xl tracking-tighter">Acompanha a emissão ao vivo</p>
          </div>
          <Link href="/live">
            <button className="flex items-center gap-3 bg-[#00a6f0] text-white px-10 py-4 font-black uppercase italic tracking-widest text-xs hover:bg-white hover:text-black transition-all cursor-pointer">
              <span className="size-2 rounded-full bg-red-600 animate-pulse" />
              <span className="mt-1">Ver em Direto</span>
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}

