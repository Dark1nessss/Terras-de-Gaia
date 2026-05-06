import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link
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
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>{post.author_name}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString("pt-PT")}</span>
        </div>
      </div>
    </Link>
  );
}