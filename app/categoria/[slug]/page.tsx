import { Suspense } from "react";
import Link from "next/link";
import { getPostsByCategoryPaginated, getCategoryBySlug } from "@/lib/wp";
import { FeaturedPostSection } from "@/components/featured-post-section";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { CategoryFilters } from "@/components/category-filters";
import { PostCard } from "@/components/post-card";
import { SidebarWidget } from "@/components/sidebar-widget";
import { Clock } from "lucide-react";

const ACCENT = "#00a6f0";

const SORT_MAP: Record<string, { orderby: string; order: string }> = {
  date_desc: { orderby: "date",  order: "desc" },
  date_asc:  { orderby: "date",  order: "asc"  },
  title_asc: { orderby: "title", order: "asc"  },
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { q = "", sort = "date_desc" } = await searchParams;

  const accent   = ACCENT;
  const { orderby, order } = SORT_MAP[sort] ?? SORT_MAP.date_desc;
  const perPage  = q ? 24 : 12;

  const [category, { posts, totalPosts }] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategoryPaginated(slug, 1, perPage, { search: q || undefined, orderby, order }),
  ]);

  const categoryName = category?.name ?? slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const categoryDescription = category?.description ?? "";
  const isFiltered = !!q || sort !== "date_desc";

  if (!posts?.length && !isFiltered) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-white/20 uppercase font-black italic">
        Sem conteúdos disponíveis
      </div>
    );
  }

  const [mainPost, ...otherPosts] = posts;
  const leadPosts = otherPosts.slice(0, 2);
  const gridPosts = otherPosts.slice(2);

  return (
    <main className="min-h-screen bg-[#080a0d] text-white font-nurom">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="pt-24 border-b border-white/5">
        <div className="container mx-auto px-6 pt-6 pb-5">
          <Breadcrumb items={[{ label: "Inicial", href: "/" }]} current={categoryName} />

          <div className="mt-5 flex items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <div className="w-1 self-stretch" style={{ backgroundColor: accent }} />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: accent }}>
                  Terras de Gaia
                </p>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {categoryName}
                </h1>
                {categoryDescription && (
                  <p className="text-white/45 text-sm leading-relaxed mt-3 max-w-2xl">
                    {categoryDescription.replace(/<[^>]*>/g, "")}
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
        <CategoryFilters categoryName={categoryName} totalPosts={totalPosts} accent={accent} />
      </Suspense>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main column — 9 cols */}
          <div className="lg:col-span-9 space-y-12">
            {isFiltered ? (
              /* Filtered / search state — PostCard grid */
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
              /* Normal state — featured hero + 2-col leads + infinite scroll */
              <>
                {mainPost && <FeaturedPostSection post={mainPost} />}
                {leadPosts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {leadPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
                {gridPosts.length > 0 && (
                  <div>
                    <div className="mb-8 flex items-center gap-4">
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mais Artigos</h2>
                      <div className="h-0.5 flex-1 bg-white/10" />
                    </div>
                    <InfiniteScrollPosts slug={slug} initialPosts={gridPosts} variant="grid-2" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar — 3 cols, always visible */}
          <div className="lg:col-span-3 sticky top-32 self-start space-y-8">
            {/* Ad — sticks at top while scrolling widgets */}
              <AdPlaceholder position="sidebar" />

            {/* Scrollable widgets */}
            <div className="mt-6 space-y-6">
              <SidebarWidget title="Recentes" icon={<Clock size={18} />}>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/post/${p.slug}`}
                      className="group flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0"
                    >
                      <span
                        className="font-black text-sm leading-none shrink-0 mt-0.5"
                        style={{ color: accent }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-black uppercase italic leading-tight line-clamp-2 group-hover:text-[#00a6f0] transition-colors mb-1">
                          {p.title.rendered.replace(/<[^>]*>/g, "")}
                        </p>
                        <p className="text-[10px] text-white/35 tabular-nums">
                          {new Date(p.date).toLocaleDateString("pt-PT", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </SidebarWidget>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}