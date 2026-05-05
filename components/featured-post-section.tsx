import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link href={`/post/${post.slug}`} className="block group mb-16 bg-white/2 border border-white/5 rounded overflow-hidden hover:border-[#00a6f0] transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
          <div className="md:col-span-1 relative h-64 md:h-auto rounded overflow-hidden">
            <Image
              src={post._embedded["wp:featuredmedia"][0].source_url}
              alt={post.title.rendered}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black italic uppercase mb-4 leading-tight group-hover:text-[#00a6f0] transition-colors">
              {post.title.rendered.replace(/<[^>]*>/g, "")}
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              {post.excerpt?.rendered.replace(/<[^>]*>/g, "").slice(0, 200)}...
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="font-semibold">{post.author_name}</span>
            <span className="text-white/30">•</span>
            <span>{new Date(post.date).toLocaleDateString("pt-PT")}</span>
          </div>
          <div className="inline-block mt-4 px-6 py-3 bg-[#00a6f0] text-black font-black uppercase group-hover:bg-white transition-colors w-fit">
            Ler Artigo
          </div>
        </div>
      </div>
    </Link>
  );
}