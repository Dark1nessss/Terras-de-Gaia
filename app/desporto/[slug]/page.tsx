import { Suspense } from "react";
import { getPostsByCategoryPaginated, getCategoryBySlug } from "@/lib/wp";
import { SportsHero } from "@/components/sports-hero";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { SidebarWidget } from "@/components/sidebar-widget";
import { Trophy, PlayCircle, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { CategoryFilters } from "@/components/category-filters";
import { PostCard } from "@/components/post-card";

const ACCENT = "#00a6f0";

const SORT_MAP: Record<string, { orderby: string; order: string }> = {
  date_desc: { orderby: "date",  order: "desc" },
  date_asc:  { orderby: "date",  order: "asc"  },
  title_asc: { orderby: "title", order: "asc"  },
};

export default async function SportsCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { q = "", sort = "date_desc" } = await searchParams;

  const { orderby, order } = SORT_MAP[sort] ?? SORT_MAP.date_desc;
  const perPage  = q ? 24 : 12;
  const isFiltered = !!q || sort !== "date_desc";

  const [category, { posts, totalPosts }] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategoryPaginated(slug, 1, perPage, { search: q || undefined, orderby, order }),
  ]);

  if (!posts || (posts.length === 0 && !isFiltered)) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-white/20 uppercase font-black italic">
        Sem conteúdos disponíveis
      </div>
    );
  }

  const categoryName = category?.name ?? slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const displayTitle = slug === "desporto" ? "Desporto" : categoryName;
  const [mainStory, ...secondaryNews] = posts;

  return (
    <main className="min-h-screen bg-[#080a0d] text-white font-nurom">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="pt-24 border-b border-white/5">
        <div className="container mx-auto px-6 pt-6 pb-5">
          <Breadcrumb
            items={[
              { label: "Inicial", href: "/" },
              ...(slug !== "desporto" ? [{ label: "Desporto", href: "/desporto" }] : []),
            ]}
            current={displayTitle}
          />

          <div className="mt-5 flex items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="w-1 self-stretch" style={{ backgroundColor: ACCENT }} />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: ACCENT }}>
                  Terras de Gaia
                </p>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {slug === "desporto" ? (
                    "Desporto"
                  ) : (
                    <>
                      <span className="text-white/50">Desporto</span>{" "}
                      <span style={{ color: ACCENT }}>{categoryName}</span>
                    </>
                  )}
                </h1>
                {category?.description && (
                  <p className="text-white/45 text-sm leading-relaxed mt-3 max-w-2xl">
                    {category.description.replace(/<[^>]*>/g, "")}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right hidden sm:block shrink-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/25 tabular-nums">
                {totalPosts} artigo{totalPosts !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="border-b border-white/5 bg-[#06080b] h-13" />}>
        <CategoryFilters categoryName={displayTitle} totalPosts={totalPosts} accent={ACCENT} />
      </Suspense>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main column — 9 cols */}
          <div className="lg:col-span-9 space-y-12">
            {isFiltered ? (
              /* Filtered / search state */
              posts.length === 0 ? (
                <p className="py-24 text-center text-white/30 text-sm font-bold uppercase italic tracking-wider">
                  Sem resultados{q ? ` para "${q}"` : ""}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )
            ) : (
              /* Normal state — sports hero + infinite scroll */
              <>
                <SportsHero post={mainStory} />

                {secondaryNews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Últimas Notícias</h2>
                      <div className="h-0.5 flex-1 bg-white/10" />
                    </div>
                    <InfiniteScrollPosts
                      slug={slug}
                      initialPosts={secondaryNews}
                      variant="grid-2"
                      showVideoCards={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar — 3 cols, always visible */}
          <aside className="lg:col-span-3 space-y-8 sticky top-32 self-start">
            {/* Ad — sticks at top while scrolling widgets */}
              <AdPlaceholder position="sidebar" />

            {/* Scrollable widgets */}
            <div className="mt-6 space-y-6">
              <SidebarWidget title="Classificações" icon={<Trophy size={18} />}>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/40 uppercase italic">
                  Brevemente: Live Scores
                </div>
                <div className="h-32 bg-linear-to-b from-white/5 to-transparent rounded flex items-center justify-center">
                  <p className="text-white/30 text-xs">Scores ao vivo em breve</p>
                </div>
              </div>
            </SidebarWidget>

            <SidebarWidget title="Mais Vistos" icon={<TrendingUp size={18} />}>
              <div className="space-y-4">
                {posts.slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="group border-b border-white/5 pb-3 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="font-black text-lg leading-none" style={{ color: ACCENT }}>#{idx + 1}</div>
                      <p className="text-xs font-black uppercase leading-tight" style={{ color: ACCENT }}>Destaque</p>
                    </div>
                    <p className="text-xs font-black uppercase italic group-hover:text-[#006ec2] transition-colors leading-snug line-clamp-2">
                      {p.title.rendered.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                ))}
              </div>
            </SidebarWidget>

            <SidebarWidget title="Informação" icon={<PlayCircle size={18} />}>
              <div className="space-y-3 text-[11px] text-white/50 leading-relaxed">
                <p>
                  Acompanhe toda a cobertura de <strong className="text-white">{categoryName}</strong> em tempo real.
                </p>
                <p>
                  Notícias, análises e estatísticas sobre as principais competições e eventos da modalidade.
                </p>
              </div>
            </SidebarWidget>
            </div>{/* end scrollable widgets */}
          </aside>
        </div>
      </div>
    </main>
  );
}