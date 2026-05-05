import { getPostsByCategory } from "@/components/lib/wp";
import { SportsHero } from "@/components/sports-hero";
import { VideoCard } from "@/components/video-card";
import { SidebarWidget } from "@/components/sidebar-widget";
import { Trophy, PlayCircle } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export default async function SportsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Properly unwrap the promise
  const posts = await getPostsByCategory(slug);
  
  // Debugging: If nothing appears, check your terminal for this log
  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-white/20 uppercase font-black italic">
        Sem conteúdos de {slug} disponíveis
      </div>
    );
  }

  const [mainStory, ...secondaryNews] = posts;

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Inicial", href: "/" },
            ...(slug !== "desporto" ? [{ label: "Desporto", href: "/desporto" }] : [])
          ]} 
          current={slug !== "desporto" ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Desporto"}
        />

        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10 border-l-4 border-[#00a6f0] pl-6">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">
            Desporto <span className="text-[#00a6f0]">{slug}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-9 space-y-12">
            <SportsHero post={mainStory} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryNews.map((post: any) => (
                <VideoCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <SidebarWidget title="Classificações" icon={<Trophy size={18} />}>
              <div className="text-[10px] font-bold text-white/40 uppercase italic">
                Brevemente: Live Scores
              </div>
            </SidebarWidget>
            
            <SidebarWidget title="Mais Vistos" icon={<PlayCircle size={18} />}>
               {posts.slice(0, 3).map((p: any) => (
                 <div key={p.id} className="group border-b border-white/5 pb-3 last:border-0 mb-3">
                    <p className="text-[9px] text-[#00a6f0] font-black uppercase mb-1">Vídeo</p>
                    <p className="text-sm font-black uppercase italic group-hover:text-[#00a6f0] transition-colors leading-tight">
                      {p.title.rendered}
                    </p>
                 </div>
               ))}
            </SidebarWidget>
          </div>
        </div>
      </div>
    </main>
  );
}