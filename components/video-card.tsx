import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function VideoCard({ post }: { post: any }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <div className="relative aspect-video mb-4 overflow-hidden border border-white/5 bg-zinc-900">
        <Image 
          src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url} 
          alt="Video" fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#00a6f0] rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
            <Play size={20} fill="white" className="text-white ml-1" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-[#00a6f0] transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <p className="text-white/40 text-[10px] font-bold uppercase mt-2 tracking-widest">Ver Reportagem →</p>
    </Link>
  );
}