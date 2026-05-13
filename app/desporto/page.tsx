import { getPostsByCategory, getCategoryBySlug } from "@/lib/wp";
import { SportsHero } from "@/components/sports-hero";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { Breadcrumb } from "@/components/breadcrumb";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { Trophy, Timer, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function SportsMainPage() {
  const slug = "desporto"; 
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug)
  ]);

  if (!posts || posts.length === 0) return null;

  const modalities = [
    { name: "Futebol", slug: "futebol", color: "#00a6f0" },
    { name: "Basquetebol", slug: "basquetebol", color: "#f59e0b" },
    { name: "Voleibol", slug: "voleibol", color: "#10b981" },
    { name: "Trail", slug: "trail", color: "#ec4899" }
  ];

  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white py-24 font-nurom">
      <div className="container mx-auto px-6 max-w-8xl">
        
        {/* HEADER & BREADCRUMB */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <Breadcrumb items={[{ label: "Inicial", href: "/" }]} current="Desporto" />
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mt-4 leading-none">
              Arena <span className="text-[#00a6f0]">Gaia</span>
            </h1>
          </div>
          
          {/* MODALIDADES QUICK LINKS */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {modalities.map((m) => (
              <Link 
                key={m.slug}
                href={`/desporto/${m.slug}`}
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm hover:border-[#00a6f0] transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#00a6f0] group-hover:scale-150 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* HERO SECTION - ASYMMETRIC GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
          <div className="lg:col-span-8">
            <SportsHero post={featuredPosts[0]} priority={true} />
          </div>
          <div className="lg:col-span-4 grid grid-rows-2 gap-4">
            {featuredPosts.slice(1, 3).map((post) => (
              <Link key={post.id} href={`/desporto/${post.category?.slug}/${post.slug}`} className="group relative overflow-hidden bg-zinc-900 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" />
                <div className="absolute bottom-0 p-6 z-20">
                  <span className="bg-[#00a6f0] text-black text-[9px] font-black px-2 py-0.5 uppercase italic mb-2 inline-block">
                    {post.category?.name}
                  </span>
                  <h3 className="text-xl font-black uppercase italic leading-tight line-clamp-2">
                    {post.title_clean}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FEED PRINCIPAL */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black uppercase italic flex items-center gap-3">
                <Trophy className="text-[#00a6f0]" size={24} />
                Em Destaque
              </h2>
            </div>
            <InfiniteScrollPosts 
              slug={slug} 
              initialPosts={remainingPosts}
            />
          </div>

          {/* SIDEBAR DESPORTIVA (Widgetized) */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* PUBLICIDADE - Sidebar Small Ad */}
            <AdPlaceholder 
              position="sidebar" 
            />
            
            {/* WIDGET: PRÓXIMOS EVENTOS */}
            <div className="bg-[#111] border-l-4 border-[#00a6f0] p-6">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Timer size={16} className="text-[#00a6f0]" /> Calendário
              </h3>
              <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0">
                    <div className="text-center">
                      <span className="block text-xs font-black text-[#00a6f0]">MAI</span>
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

            {/* WIDGET: MAIS LIDAS */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Star size={16} className="text-[#00a6f0]" /> Top Arena
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 4).map((p, idx) => (
                  <Link key={p.id} href={`/desporto/${p.slug}`} className="flex gap-4 group">
                    <span className="text-4xl font-black italic text-white/10 group-hover:text-[#00a6f0]/20 transition-colors">
                      0{idx + 1}
                    </span>
                    <p className="text-xs font-black uppercase italic leading-snug group-hover:text-[#00a6f0] transition-colors">
                      {p.title_clean}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}