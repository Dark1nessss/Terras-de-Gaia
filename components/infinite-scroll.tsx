'use client';

import { useEffect, useRef, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { VideoCard } from "./video-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { setCachedData } from "@/lib/cache";
import { ArrowRight } from "lucide-react";

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  title_clean?: string;
  excerpt?: { rendered: string };
  date?: string;
  author_name?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ 
      source_url: string;
      media_type?: string;
    }>;
  };
}

interface InfiniteScrollPostsProps {
  slug: string;
  initialPosts: Post[];
  variant?: 'grid-2' | 'grid-3';
  showVideoCards?: boolean;
}

function dedupeById(arr: Post[]): Post[] {
  const seen = new Set<number>();
  return arr.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function InfiniteScrollPosts({ 
  slug, 
  initialPosts,
  variant = 'grid-3',
  showVideoCards = false
}: InfiniteScrollPostsProps) {
  const pathname = usePathname();
  const [posts, setPosts] = useState<Post[]>(() => dedupeById(initialPosts));
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadCount, setLoadCount] = useState(0); // Contador de loads
  const observerTarget = useRef(null);

  // Determina se o próximo load deve ser automático ou manual
  const shouldBeAutomatic = loadCount % 2 === 0; // 0=automático, 1=botão, 2=automático, etc

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `/api/posts?slug=${slug}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.posts && data.posts.length > 0) {
          setPosts(prev => {
            const combined = dedupeById([...prev, ...data.posts]);
            setCachedData(pathname, combined);
            return combined;
          });
        setPage(prev => prev + 1);
        setLoadCount(prev => prev + 1); // Incrementa counter
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(`Erro ao carregar:`, err);
      setError("Ocorreu um erro ao carregar mais artigos.");
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, slug, pathname]);

  // Intersection Observer para loads automáticos
  useEffect(() => {
    // Só observa se o próximo load deve ser automático
    if (!shouldBeAutomatic) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMore, isLoading, shouldBeAutomatic]);

  const gridClass = variant === 'grid-2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const renderPost = (post: Post) => {
    const hasVideo = showVideoCards && post._embedded?.['wp:featuredmedia']?.[0]?.media_type === 'video';

    if (hasVideo) {
      return <VideoCard key={post.id} post={post} />;
    }

    return (
      <Link
        key={`${post.id}-${post.slug}`}
        href={`/post/${post.slug}`}
        className={showVideoCards ? "group block" : "group flex flex-col bg-[#07090c] border border-white/6 hover:border-white/15 overflow-hidden transition-[border-color] duration-200"}
      >
        <div className={showVideoCards ? "relative aspect-video mb-4 overflow-hidden bg-zinc-900" : "relative aspect-video overflow-hidden bg-zinc-950 shrink-0"}>
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <Image
              src={post._embedded["wp:featuredmedia"][0].source_url}
              alt={post.title.rendered}
              fill
              sizes={showVideoCards ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              className={showVideoCards ? "object-cover group-hover:scale-105 transition-transform" : "object-cover brightness-55 group-hover:brightness-70 group-hover:scale-[1.03] transition-all duration-400"}
            />
          )}
        </div>
        <div className={showVideoCards ? "" : "flex flex-col flex-1 p-4 gap-2.5"}>
          <h3 className={showVideoCards ? "text-lg font-black uppercase tracking-tight group-hover:text-[#006ec2] transition-colors line-clamp-2" : "font-black uppercase italic text-base tracking-tighter leading-tight group-hover:text-[#006ec2] transition-colors line-clamp-3"}>
            {post.title_clean || post.title.rendered.replace(/<[^>]*>/g, "")}
          </h3>
          {!showVideoCards && post.author_name && post.date && (
            <div className="mt-auto pt-2.5 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-white/40 truncate">{post.author_name}</span>
              <span className="text-white/15 shrink-0">·</span>
              <span className="text-white/40 tabular-nums shrink-0">{new Date(post.date).toLocaleDateString("pt-PT")}</span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-12">
      <div className={`grid ${gridClass} gap-6`}>
        {posts.map(renderPost)}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center py-4 px-4 bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && <LoadingSpinner text="A carregar..." />}

      {/* Manual Load Button (aparece quando deve ser manual) */}
      {!shouldBeAutomatic && hasMore && !isLoading && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMorePosts}
            className="px-8 py-3 border border-white/20 hover:border-white/40 font-black uppercase text-sm flex items-center gap-2 transition-all group cursor-pointer hover:text-[#006ec2]"
          >
            <span className="transition-colors mt-0.75">Carregar Mais</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Intersection observer target (só ativa em loads automáticos) */}
      {shouldBeAutomatic && hasMore && (
        <div ref={observerTarget} className="h-4" />
      )}

      {/* End of results */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-12 text-white/40 text-sm uppercase font-black">
          Fim dos artigos
        </div>
      )}
    </div>
  );
}