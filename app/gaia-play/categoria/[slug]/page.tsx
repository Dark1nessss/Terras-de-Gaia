import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play, Layers } from 'lucide-react';
import { getProgramasByCategory } from '@/lib/wp';
import { Breadcrumb } from '@/components/breadcrumb';
import type { Program } from '@/lib/programas';

export const revalidate = 300;

function unslugify(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = unslugify(slug);
  return {
    title: `${label} | Gaia Play`,
    description: `Todos os programas da categoria ${label} em Gaia Play — Terras de Gaia TV.`,
  };
}

export default async function GaiaPlayCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const programs: Program[] = await getProgramasByCategory(slug);

  if (!programs.length) notFound();

  const categoryLabel = programs[0].acf?.categoria_programa || unslugify(slug);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24 pb-20">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[#00a6f0]/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 pt-10 pb-12 relative z-10">
          <Breadcrumb
            items={[
              { label: 'Inicial', href: '/' },
              { label: 'Gaia Play', href: '/gaia-play' },
            ]}
            current={categoryLabel}
          />

          <div className="mt-8 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.5em] mb-4">
                <Layers size={12} />
                Categoria
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none break-words">
                {categoryLabel}
              </h1>
              <p className="text-white/30 text-sm mt-4">
                {programs.length} {programs.length === 1 ? 'programa' : 'programas'}
              </p>
            </div>

            <Link
              href="/gaia-play"
              className="hidden md:flex items-center gap-2 text-white/30 hover:text-[#00a6f0] transition-colors text-xs font-black uppercase tracking-widest shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="mt-0.5">Voltar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS GRID ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {programs.map((prog) => (
            <Link
              key={prog.id}
              href={`/gaia-play/${prog.slug}`}
              className="group relative aspect-3/4 overflow-hidden border border-white/10 hover:border-[#00a6f0]/50 transition-all duration-300 bg-zinc-900/40"
            >
              {/* Thumbnail */}
              {prog.featured_image_url ? (
                <Image
                  src={prog.featured_image_url}
                  alt={prog.title.rendered}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-[#00a6f0]/10 to-transparent" />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/40 to-transparent" />

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-[#00a6f0] transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h2 className="text-xl font-black uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-[#00a6f0] transition-colors">
                  {prog.title.rendered}
                </h2>

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
    </main>
  );
}
