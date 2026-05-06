'use client';

import { useEffect, useRef, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { VideoCard } from "./video-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getCachedData, setCachedData, invalidateCache, setLastRoute } from "@/lib/cache";

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
  variant?: 'grid-2' | 'grid-3'; // Default: 'grid-3'
  showVideoCards?: boolean; // Default: false
}

export function InfiniteScrollPosts({ 
  slug, 
  initialPosts,
  variant = 'grid-3',
  showVideoCards = false
}: InfiniteScrollPostsProps) {
  const pathname = usePathname();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [lastFetchSize, setLastFetchSize] = useState(12);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  // Detect route changes and clear cache
  useEffect(() => {
    setLastRoute(pathname);
    // Reset state on route change
    setPosts(initialPosts);
    setPage(2);
    setHasMore(true);
    setError(null);
    retryCountRef.current = 0;
  }, [pathname, initialPosts]);

  // Setup periodic refresh every 180s
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      invalidateCache(`/api/`);
      // Force re-fetch by resetting page
      setPage(2);
      setPosts(initialPosts);
    }, 180000); // 180 seconds

    return () => clearInterval(refreshInterval);
  }, [initialPosts]);

  const getApiEndpoint = useCallback(() => {
    if (pathname.includes('/desporto/')) return '/api/desporto';
    if (pathname.includes('/categoria/')) return '/api/category';
    return '/api/category';
  }, [pathname]);

  const apiEndpoint = getApiEndpoint();

  const MAX_PAGES = 50;

  const loadMorePosts = useCallback(async () => {
    // Prevent requests beyond max page
    if (page > MAX_PAGES) {
      setHasMore(false);
      return;
    }

    if (isLoading || !hasMore) return;

    const cacheKey = `${apiEndpoint}?slug=${slug}&page=${page}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
      const existingIds = new Set(posts.map(p => p.id));
      const newPosts = cached.filter((post: any) => !existingIds.has(post.id));
      
      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setPage((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiEndpoint}?slug=${slug}&page=${page}`);
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        setCachedData(cacheKey, data.posts); // Cache successful response
        
        const existingIds = new Set(posts.map(p => p.id));
        const newPosts = data.posts.filter((post: any) => !existingIds.has(post.id));
        
        if (newPosts.length > 0) {
          setPosts((prev) => [...prev, ...newPosts]);
        }
        
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
        setLastFetchSize(newPosts.length);
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setCachedData(cacheKey, null, true); // Mark cache as error
      setError("Erro ao carregar artigos. Tentando novamente...");
      
      // Retry logic
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => {
          loadMorePosts();
        }, 2000 + (retryCountRef.current * 1000)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, page, isLoading, hasMore, apiEndpoint, posts]);

  useEffect(() => {
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
  }, [loadMorePosts, hasMore, isLoading]);

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
        className={showVideoCards ? "group block" : "group bg-white/2 border border-white/5 rounded overflow-hidden hover:border-[#00a6f0] transition-colors"}
      >
        <div className={showVideoCards ? "relative aspect-video mb-4 overflow-hidden border border-white/5 bg-zinc-900" : "relative h-48 overflow-hidden bg-white/5"}>
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <Image
              src={post._embedded["wp:featuredmedia"][0].source_url}
              alt={post.title.rendered}
              fill
              sizes={showVideoCards ? "(max-width: 768px) 100vw, 50vw" : ""}
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
        </div>
        <div className={showVideoCards ? "" : "p-4"}>
          <h3 className={showVideoCards ? "text-xl font-black uppercase italic tracking-tighter group-hover:text-[#00a6f0] transition-colors line-clamp-2" : "font-black italic uppercase text-sm mb-2 group-hover:text-[#00a6f0] transition-colors line-clamp-2"}>
            {post.title_clean || post.title.rendered.replace(/<[^>]*>/g, "")}
          </h3>
          {!showVideoCards && post.author_name && post.date && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>{post.author_name}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString("pt-PT")}</span>
            </div>
          )}
          {showVideoCards && (
            <p className="text-white/40 text-xs font-bold uppercase mt-2 tracking-widest">Ler Artigo →</p>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      <div className={`grid ${gridClass} gap-6`}>
        {posts.map(renderPost)}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center py-4 px-4 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && <LoadingSpinner text="A carregar mais artigos..." />}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of results */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-white/40 text-sm uppercase font-black italic">
          Sem mais artigos
        </div>
      )}
    </div>
  );
}