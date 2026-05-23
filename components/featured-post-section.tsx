import Link from "next/link";
import Image from "next/image";
import { decodeHtml, stripHtml } from "@/lib/decode-html";
import { formatDate } from "@/lib/date";

interface FeaturedPostProps {
  post: {
    slug: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    author_name: string;
    _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
  };
}

export function FeaturedPostSection({ post }: FeaturedPostProps) {
  const thumb  = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const excerpt = decodeHtml(stripHtml(post.excerpt?.rendered ?? "")).slice(0, 220);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block relative overflow-hidden bg-zinc-950"
    >
      {/* Image */}
      <div className="relative aspect-4/3 sm:aspect-video">
        {thumb ? (
          <Image
            src={thumb}
            alt={decodeHtml(post.title.rendered)}
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover brightness-45 group-hover:brightness-55 group-hover:scale-[1.02] transition-all duration-500"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        {/* Strong bottom-to-top gradient so text is always readable */}
        <div className="absolute inset-0 bg-linear-to-t from-[#080a0d] via-[#080a0d]/55 to-transparent" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00a6f0]" />
      </div>

      {/* Content — overlaid on the gradient */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-12">
        <p className="text-[11px] font-black uppercase tracking-[0.45em] text-[#00a6f0] mb-3">
          Destaque
        </p>
        <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none text-white group-hover:text-[#00a6f0] transition-colors mb-3 sm:mb-4 line-clamp-3">
          {decodeHtml(post.title.rendered)}
        </h2>
        {excerpt && (
          <p className="text-white/50 text-sm md:text-base leading-relaxed line-clamp-2 max-w-3xl mb-5 hidden sm:block">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">
            {post.author_name}
          </span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/35 tabular-nums">
            {formatDate(post.date, "short")}
          </span>
        </div>
      </div>
    </Link>
  );
}