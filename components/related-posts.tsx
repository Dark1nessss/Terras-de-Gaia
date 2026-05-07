'use client';

import Link from 'next/link';
import Image from 'next/image';
import { decodeHtml } from '@/lib/decode-html';
import { ArrowRight } from 'lucide-react';

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

interface RelatedPostsSidebarProps {
  posts: Post[];
  currentPostId: number;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsSidebarProps) {
  const related = posts.filter(p => p.id !== currentPostId).slice(0, 5);

  if (related.length === 0) return null;

  return (
    <div className="sticky top-4 space-y-3">
      {related.map((post) => {
        const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
        
        return (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="group block border border-white/5 rounded-lg overflow-hidden hover:border-[#00a6f0]/40 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04]"
          >
            {/* Image Container */}
            {image ? (
              <div className="relative h-40 overflow-hidden bg-white/2">
                <Image
                  src={image}
                  alt={post.title.rendered}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-br from-[#00a6f0]/10 to-transparent flex items-center justify-center">
                <span className="text-white/20 text-sm">Sem imagem</span>
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              <h4 className="text-xs font-black uppercase italic text-white/80 group-hover:text-[#00a6f0] transition-colors line-clamp-2 leading-tight">
                {decodeHtml(post.title.rendered).replace(/<[^>]*>/g, '')}
              </h4>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-white/40 font-medium">
                  {new Date(post.date).toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
                <ArrowRight size={14} className="text-white/30 group-hover:text-[#00a6f0] transition-colors" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}