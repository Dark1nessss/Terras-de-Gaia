import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/date";

interface PostCardProps {
  post: {
    id: number;
    slug: string;
    title: { rendered: string };
    date: string;
    author_name: string;
    _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
  };
}

export function PostCard({ post }: PostCardProps) {
  const thumb = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex flex-col bg-[#07090c] border border-white/6 hover:border-white/15 overflow-hidden transition-[border-color] duration-200"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-950 shrink-0">
        {thumb && (
          <Image
            src={thumb}
            alt={post.title.rendered.replace(/<[^>]*>/g, "")}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover brightness-55 group-hover:brightness-70 group-hover:scale-[1.03] transition-all duration-400"
          />
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <h4 className="font-black italic uppercase text-base tracking-tighter leading-tight group-hover:text-[#00a6f0] transition-colors line-clamp-3">
          {post.title.rendered.replace(/<[^>]*>/g, "")}
        </h4>
        <div className="mt-auto pt-2.5 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-white/40 truncate">{post.author_name}</span>
          <span className="text-white/15 shrink-0">·</span>
          <span className="text-white/40 tabular-nums shrink-0">{formatDate(post.date, "short")}</span>
        </div>
      </div>
    </Link>
  );
}