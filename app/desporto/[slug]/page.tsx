import { getPostsByCategory, getCategoryBySlug } from "@/lib/wp";
import { SportsHero } from "@/components/sports-hero";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { SidebarWidget } from "@/components/sidebar-widget";
import { Trophy, PlayCircle, TrendingUp } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default async function SportsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug)
  ]);
  
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-white/20 uppercase font-black italic">
        Sem conteúdos disponíveis
      </div>
    );
  }

  const [mainStory, ...secondaryNews] = posts;
  // Use category title from WordPress if available, fallback to slug manipulation
  const categoryName = category?.name || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Inicial", href: "/" },
            ...(slug !== "desporto" ? [{ label: "Desporto", href: "/desporto" }] : [])
          ]} 
          current={slug !== "desporto" ? categoryName : "Desporto"}
        />

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-end gap-6 border-l-4 border-[#00a6f0] pl-6 mb-2">
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">
              {slug === "desporto" ? "Desporto" : (
                <>
                  <span>Desporto</span> <span className="text-[#00a6f0]">{categoryName}</span>
                </>
              )}
            </h1>
          </div>
          {category?.description && (
            <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-2xl">
              {category.description.replace(/<[^>]*>/g, '')}
            </p>
          )}
          <p className="text-white/40 text-sm uppercase tracking-widest font-bold mt-4">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-9 space-y-12">
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8 sticky top-32 self-start">
            <SidebarWidget title="Classificações" icon={<Trophy size={18} />}>
              <div className="space-y-3">
                <div className="text-xs font-bold text-white/40 uppercase italic">
                  Brevemente: Live Scores
                </div>
                <div className="h-32 bg-gradient-to-b from-white/5 to-transparent rounded flex items-center justify-center">
                  <p className="text-white/30 text-xs">Scores ao vivo em breve</p>
                </div>
              </div>
            </SidebarWidget>
            
            <SidebarWidget title="Mais Vistos" icon={<TrendingUp size={18} />}>
              <div className="space-y-4">
                {posts.slice(0, 3).map((p: any, idx: number) => (
                  <div key={p.id} className="group border-b border-white/5 pb-3 last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-[#00a6f0] font-black text-lg leading-none">#{idx + 1}</div>
                      <p className="text-xs text-[#00a6f0] font-black uppercase leading-tight">Destaque</p>
                    </div>
                    <p className="text-xs font-black uppercase italic group-hover:text-[#00a6f0] transition-colors leading-snug line-clamp-2">
                      {p.title.rendered.replace(/<[^>]*>/g, '')}
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
          </div>
        </div>
      </div>
    </main>
  );
}