import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import { decodeHtml } from "@/lib/decode-html";

interface RelatedPostsProps {
  posts: any[];
  currentPostId?: number;
  categorySlug: string;
  categoryName: string;
}

export function RelatedPosts({ posts, currentPostId, categorySlug, categoryName }: RelatedPostsProps) {
  const filteredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  if (filteredPosts.length === 0) return null;

  const viewAllHref = categoryName === "Desporto" 
    ? `/desporto/${categorySlug}` 
    : `/categoria/${categorySlug}`;

  return (
    <div className="w-full mt-20 pt-12 border-t-2 border-white/10">
      {/* Header with Gazette Aesthetic */}
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1">
          <span className="text-[#00a6f0] text-xs font-bold uppercase tracking-[0.3em]">Continuar a Ler</span>
          <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Artigos <span className="text-white/20">Relacionados</span>
          </h3>
        </div>
        {/* Link must be from category */}

        <Link href={viewAllHref} className="hidden md:flex items-center gap-2 text-white/40 hover:text-[#00a6f0] transition-colors text-xs font-bold uppercase tracking-widest pb-2">
          Ver Tudo <MoveRight size={16} />
        </Link>
      </div>

      {/* Grid: 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-white/5 border border-white/5">
        {filteredPosts.map((post, index) => {
          const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/placeholder.jpg";
          
          return (
            <Link 
              key={post.id} 
              href={`/post/${post.slug}`}
              className="group relative bg-[#0a0c10] p-6 md:p-8 hover:bg-[#00a6f0] transition-all duration-500 flex flex-col min-h-[300px]"
            >
              {/* Index Number Background */}
              <span className="absolute top-4 right-6 text-6xl font-black italic text-white/[0.03] group-hover:text-white/50 transition-colors">
                0{index + 1}
              </span>

              <div className="relative z-10 flex flex-col h-full">
                {/* Minimal Category Tag */}
                <span className="text-[#00a6f0] group-hover:text-[#0a0c10] text-xs font-black uppercase tracking-widest mb-4 transition-colors">
                  {post.category?.name || "Gazeta"}
                </span>

                <h4 className="text-xl md:text-2xl font-black uppercase italic leading-[1.1] text-white group-hover:text-white transition-colors mb-6 line-clamp-3">
                  {decodeHtml(post.title.rendered)}
                </h4>

                {/* Reveal Image on Hover for Desktop */}
                <div className="mt-auto relative w-full h-32 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 rounded overflow-hidden">
                   <Image 
                    src={image} 
                    alt="Related" 
                    fill 
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700 aspect-video"
                   />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}