import { Suspense } from "react";
import Image from "next/image";
import { getPostsByCategoryPaginated } from "@/lib/wp";
import { SportsHero } from "@/components/sports-hero";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { CategoryFilters } from "@/components/category-filters";
import { PostCard } from "@/components/post-card";
import { Trophy, Timer, Star } from "lucide-react";
import Link from "next/link";

const SORT_MAP: Record<string, { orderby: string; order: string }> = {
  date_desc: { orderby: "date",  order: "desc" },
  date_asc:  { orderby: "date",  order: "asc"  },
  title_asc: { orderby: "title", order: "asc"  },
};

export default async function SportsMainPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q = "", sort = "date_desc" } = await searchParams;
  const slug = "desporto";
  const { orderby, order } = SORT_MAP[sort] ?? SORT_MAP.date_desc;
  const perPage = q ? 24 : 15;
  const isFiltered = !!q || sort !== "date_desc";

  const [{ posts, totalPosts }] = await Promise.all([
    getPostsByCategoryPaginated(slug, 1, perPage, { search: q || undefined, orderby, order }),
  ]);

  if (!posts || (posts.length === 0 && !isFiltered)) return null;

  const modalities = [
    { name: "Futebol", slug: "futebol" },
    { name: "Basquetebol", slug: "basquetebol" },
    { name: "Voleibol", slug: "voleibol" },
    { name: "Trail", slug: "trail" }
  ];

  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  return (
    <main className="min-h-screen bg-[#080a0d] text-white font-nurom">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="pt-24 border-b border-white/5">
        <div className="container mx-auto px-6 pt-6 pb-5">
          <Breadcrumb items={[{ label: "Inicial", href: "/" }]} current="Desporto" />

          <div className="mt-5 flex items-end justify-between gap-6 flex-wrap">
            <div className="flex items-end gap-5">
              <div className="w-1 self-stretch bg-[#006ec2]" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2 text-[#006ec2]">
                  Terras de Gaia
                </p>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  Arena <span className="text-[#006ec2]">Gaia</span>
                </h1>
              </div>
            </div>

            {/* MODALIDADES QUICK LINKS */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
              {modalities.map((m) => (
                <Link
                  key={m.slug}
                  href={`/desporto/${m.slug}`}
                  className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-[#006ec2] transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#006ec2] group-hover:scale-150 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{m.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="border-b border-white/5 bg-[#06080b] h-13" />}>
        <CategoryFilters categoryName="Arena Gaia" totalPosts={totalPosts} accent="#00a6f0" />
      </Suspense>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-10">

        {isFiltered ? (
          /* ── FILTERED STATE ─────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              {posts.length === 0 ? (
                <p className="py-24 text-center text-white/30 text-sm font-bold uppercase italic tracking-wider">
                  Sem resultados{q ? ` para "${q}"` : ""}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                  <InfiniteScrollPosts slug={slug} initialPosts={[]} variant="grid-3" />
                </>
              )}
            </div>
            <aside className="lg:col-span-3 space-y-8 sticky top-32 self-start">
              <AdPlaceholder position="sidebar" />
            </aside>
          </div>
        ) : (
          /* ── NORMAL STATE ───────────────────────────────────────────── */
          <>
            {/* HERO SECTION - ASYMMETRIC GRID */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
              <div className="lg:col-span-8">
                <SportsHero post={featuredPosts[0]} />
              </div>
              <div className="lg:col-span-4 grid grid-rows-2 gap-4">
                {featuredPosts.slice(1, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/desporto/${post.category?.slug ?? "desporto"}/${post.slug}`}
                    className="group relative overflow-hidden bg-zinc-900 border border-white/5 min-h-45"
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10" />
                    {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                      <Image
                        src={post._embedded["wp:featuredmedia"][0].source_url}
                        alt={post.title_clean ?? ""}
                        fill
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />
                    )}
                    <div className="absolute bottom-0 p-5 z-20">
                      <span className="bg-[#006ec2] text-black text-[9px] font-black px-2 py-0.5 uppercase italic mb-2 inline-block">
                        {post.category?.name ?? "Desporto"}
                      </span>
                      <h3 className="text-lg font-black uppercase italic leading-tight line-clamp-2">
                        {post.title_clean}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-black uppercase italic flex items-center gap-3">
                    <Trophy className="text-[#006ec2]" size={24} />
                    Em Destaque
                  </h2>
                </div>
                <InfiniteScrollPosts slug={slug} initialPosts={remainingPosts} />
              </div>

              <aside className="lg:col-span-4 space-y-10 sticky top-32 self-start">
                <AdPlaceholder position="sidebar" />

                <div className="bg-[#0e1014] border-l-4 border-[#006ec2] p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Timer size={16} className="text-[#006ec2]" /> Calendário
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0">
                        <div className="text-center w-10 shrink-0">
                          <span className="block text-xs font-black text-[#006ec2]">MAI</span>
                          <span className="block text-lg font-black italic">1{i}</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 font-bold uppercase">Campeonato Regional</p>
                          <p className="text-xs font-black uppercase italic">Gaia FC vs Valadares</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Star size={16} className="text-[#006ec2]" /> Top Arena
                  </h3>
                  <div className="space-y-6">
                    {posts.slice(0, 5).map((p, idx) => (
                      <Link
                        key={p.id}
                        href={`/desporto/${p.category?.slug ?? "desporto"}/${p.slug}`}
                        className="flex gap-4 group"
                      >
                        <span className="text-4xl font-black italic text-white/10 group-hover:text-[#006ec2]/20 transition-colors shrink-0">
                          0{idx + 1}
                        </span>
                        <p className="text-xs font-black uppercase italic leading-snug group-hover:text-[#006ec2] transition-colors">
                          {p.title_clean}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}