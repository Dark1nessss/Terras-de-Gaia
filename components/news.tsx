import { Calendar, ArrowUpRight, Clock, MessageSquare } from "lucide-react";
import { getPosts } from "../app/lib/wp";
import Link from "next/link";
import Image from "next/image";

export async function News() {
  const posts = await getPosts();

  if (!posts || !Array.isArray(posts) || posts.length === 0) return null;

  const mainStory = posts[0];
  const listStories = posts.slice(1, 5); // 4 more stories for the side/bottom

  return (
    <section className="py-20 bg-[#0a0c10] font-nurom">
      <div className="container mx-auto px-6">
        
        {/* Header - Traditional Newspaper Style */}
        <div className="border-y border-white/10 py-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="bg-[#00a6f0] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">Live</span>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Terras de Gaia <span className="text-[#00a6f0]">Gazeta</span>
          </h2>
          <Link href="/noticias" className="text-white/40 hover:text-[#00a6f0] text-[10px] font-black uppercase tracking-widest transition-colors">
            Edição Digital →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN (Featured Story) */}
          <div className="lg:col-span-8">
            <Link href={`/post/${mainStory.slug}`} className="group block">
              <div className="relative aspect-video mb-6 overflow-hidden bg-[#161b22] border border-white/5">
                {mainStory._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                  <Image
                    src={mainStory._embedded['wp:featuredmedia'][0].source_url}
                    alt="Main"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-0 right-0 bg-[#00a6f0] text-white text-[10px] font-black uppercase px-4 py-2">
                  {mainStory._embedded?.['wp:term']?.[0]?.[0]?.name || "Destaque"}
                </div>
              </div>
              
              <h3 
                className="text-4xl md:text-5xl text-white font-black leading-none uppercase italic tracking-tighter mb-4 group-hover:text-[#00a6f0] transition-colors"
                dangerouslySetInnerHTML={{ __html: mainStory.title?.rendered || "" }}
              />
              <div
                className="text-white/50 text-lg line-clamp-2 mb-6 font-medium border-l-2 border-[#00a6f0] pl-4"
                dangerouslySetInnerHTML={{ __html: mainStory.excerpt?.rendered || "" }}
              />
            </Link>
          </div>

          {/* SIDEBAR (Traditional News Feed) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/5 p-4 mb-2">
              <span className="text-[#00a6f0] text-[10px] font-black uppercase tracking-widest">Última Hora</span>
            </div>
            
            {listStories.map((post: any) => (
              <Link 
                href={`/post/${post.slug}`} 
                key={post.id} 
                className="group flex flex-col border-b border-white/5 pb-6 last:border-0"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="text-[#00a6f0] text-[9px] font-black uppercase tracking-tighter">
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name || "Gaia"}
                  </span>
                  <div className="flex items-center gap-1 text-white/20 text-[9px]">
                    <Clock size={10} />
                    {new Date(post.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <h4 
                  className="text-lg text-white font-black leading-tight uppercase italic tracking-tighter group-hover:text-[#00a6f0] transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                />
              </Link>
            ))}

            {/* Unique Niche Widget: Weather or Stock placeholder */}
            <div className="mt-auto p-6 border border-dashed border-white/10 rounded-sm">
              <div className="flex items-center justify-between text-white/40 mb-4">
                <span className="text-[10px] font-black uppercase">Gaia Agora</span>
                <ArrowUpRight size={14} />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl text-white font-black">18°C</div>
                <div className="text-[10px] text-white/60 leading-tight uppercase font-bold">Céu Limpo<br/>Vila Nova de Gaia</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}