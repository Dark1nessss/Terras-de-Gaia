import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Layers, ArrowRight } from 'lucide-react';
import { getProgramas } from '@/lib/wp';
import { Breadcrumb } from '@/components/breadcrumb';
import { slugifyCategory } from '@/lib/utils';
import type { Program } from '@/lib/programas';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Todos os Programas | Gaia Play',
  description: 'Catálogo completo de programas Gaia Play — Terras de Gaia TV.',
};

export default async function AllProgramsPage() {
  const programs: Program[] = await getProgramas();

  // Group by category for the section headers
  const byCategory = programs.reduce((map, prog) => {
    const cat = prog.acf?.categoria_programa || 'Sem Categoria';
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(prog);
    return map;
  }, new Map<string, Program[]>());

  const categories = Array.from(byCategory.entries());

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24 pb-20">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#006ec2]/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 pt-10 pb-12 relative z-10">
          <Breadcrumb
            items={[
              { label: 'Inicial', href: '/' },
              { label: 'Gaia Play', href: '/gaia-play' },
            ]}
            current="Todos os Programas"
          />

          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <span className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em] block mb-4">
                Catálogo Completo
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                Todos os
                <br />
                <span className="text-[#006ec2]">Programas</span>
              </h1>
              <p className="text-white/30 text-sm mt-4">
                {programs.length} {programs.length === 1 ? 'programa' : 'programas'} · {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS BY CATEGORY ──────────────────────────────────── */}
      <div className="container mx-auto px-6 py-16 space-y-14 md:space-y-20">
        {categories.map(([cat, progs]) => (
          <section key={cat}>
            {/* Category header */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <Layers size={16} className="text-[#006ec2]" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">{cat}</h2>
                <span className="hidden sm:inline text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  · {progs.length} {progs.length === 1 ? 'programa' : 'programas'}
                </span>
              </div>
              <Link
                href={`/gaia-play/categoria/${slugifyCategory(cat)}`}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#006ec2] transition-colors"
              >
                <span className="mt-0.5">Ver categoria</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {progs.map((prog) => (
                <Link
                  key={prog.id}
                  href={`/gaia-play/${prog.slug}`}
                  className="group relative aspect-3/4 overflow-hidden border border-white/10 hover:border-[#006ec2]/50 transition-all duration-300 bg-zinc-900/40"
                >
                  {prog.featured_image_url ? (
                    <Image
                      src={prog.featured_image_url}
                      alt={prog.title.rendered}
                      fill
                      className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-[#006ec2]/10 to-transparent" />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/40 to-transparent" />
                  <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-[#006ec2] transition-all duration-500" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-[#006ec2] transition-colors">
                      {prog.title.rendered}
                    </h3>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="size-9 rounded-full border border-white/40 flex items-center justify-center">
                        <Play size={14} fill="currentColor" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
