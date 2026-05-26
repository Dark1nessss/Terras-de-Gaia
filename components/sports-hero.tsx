import Image from "next/image";
import Link from "next/link";

export function SportsHero({ post }: { post: any }) {
  return (
    <Link href={`/post/${post.slug}`} className="group relative block aspect-video overflow-hidden bg-zinc-900 border border-white/5">
      <Image 
        src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url} 
        alt="Hero" fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-transparent to-transparent" />
      <div className="absolute bottom-0 p-8 w-full md:w-2/3">
        <span className="bg-[#006ec2] text-white text-xs font-black px-2 py-1 uppercase mb-4 inline-block">Destaque Desportivo</span>
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none group-hover:text-[#006ec2] transition-colors"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </div>
    </Link>
  );
}