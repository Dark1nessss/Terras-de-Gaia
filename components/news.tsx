import { getPosts } from "../app/lib/wp";
import Link from "next/link";
import { NewsFeed } from "./news-feed";

export async function News() {
  const posts = await getPosts();

  if (!posts?.length) return null;

  // DRY: Centralized date formatting
  const formattedDate = new Date().toLocaleDateString('pt-PT', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <section className="py-20 bg-[#0a0c10] font-nurom">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="border-y border-white/10 py-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="bg-[#00a6f0] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">Live</span>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              {formattedDate}
            </div>
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Terras de Gaia <span className="text-[#00a6f0]">Gazeta</span>
          </h2>
          <Link href="/noticias" className="text-white/40 hover:text-[#00a6f0] text-[10px] font-black uppercase tracking-widest transition-colors">
            Edição Digital →
          </Link>
        </div>

        <NewsFeed initialPosts={posts} />
      </div>
    </section>
  );
}