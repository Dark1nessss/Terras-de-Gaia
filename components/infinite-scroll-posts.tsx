'use client';

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  author_name: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

export function InfiniteScrollPosts({ 
  slug, 
  initialPosts 
}: { 
  slug: string;
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?slug=${slug}&page=${page}`);
      const data = await res.json();

      if (data.posts && data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, page, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="group bg-white/2 border border-white/5 rounded overflow-hidden hover:border-[#00a6f0] transition-colors"
          >
            <div className="relative h-48 overflow-hidden bg-white/5">
              {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <Image
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post.title.rendered}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <div className="p-4">
              <h4 className="font-black italic uppercase text-sm mb-2 group-hover:text-[#00a6f0] transition-colors line-clamp-2">
                {post.title.rendered.replace(/<[^>]*>/g, "")}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-white/40">
                <span>{post.author_name}</span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString("pt-PT")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#00a6f0] animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-[#00a6f0] animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-[#00a6f0] animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-white/40 text-sm uppercase font-black italic">A carregar...</p>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of results */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-white/40 text-sm">
          Todos os artigos carregados
        </div>
      )}
    </div>
  );
}