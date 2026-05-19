"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { WeatherWidgetSidebar } from "./weather-widget";

export function NewsFeed({ initialPosts }: { initialPosts: any[] }) {
  const [activePost, setActivePost] = useState(initialPosts[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* LEFT: Main Story */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        <Link href={`/post/${activePost.slug}`} className="group block outline-none">
          <div className="relative aspect-video mb-6 overflow-hidden bg-[#161b22] border border-white/5">
            {activePost._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
              <Image
                src={activePost._embedded['wp:featuredmedia'][0].source_url}
                alt={activePost.title?.rendered || "News"}
                fill
                priority // Performance: Loads main image faster
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#161b22] flex items-center justify-center text-white/5" />
            )}
            <div className="absolute top-0 right-0 bg-[#00a6f0] text-white text-xs font-black uppercase px-4 py-2">
              {activePost._embedded?.['wp:term']?.[0]?.[0]?.name || "Destaque"}
            </div>
          </div>
          
          <h3 
            className="text-4xl md:text-5xl text-white font-black leading-none uppercase italic tracking-tighter mb-4 group-hover:text-[#00a6f0] transition-colors duration-300"
            dangerouslySetInnerHTML={{ __html: activePost.title?.rendered || "" }}
          />
          <div
            className="text-white/50 text-lg line-clamp-2 font-medium border-l-2 border-[#00a6f0] pl-4 mb-2"
            dangerouslySetInnerHTML={{ __html: activePost.excerpt?.rendered || "" }}
          />
        </Link>
      </div>

      {/* RIGHT: Sidebar */}
      <div className="lg:col-span-4 flex flex-col justify-between h-full lg:max-h-145"> 
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-white/5 p-4 mb-4 shrink-0">
            <span className="text-[#00a6f0] text-xs font-black uppercase tracking-widest">Feed de Notícias</span>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 pr-2 mb-4">
            {initialPosts.map((post: any) => (
              <button 
                key={post.id} 
                onClick={() => setActivePost(post)}
                onKeyDown={(e) => e.key === 'Enter' && setActivePost(post)}
                className={`w-full text-left group flex flex-col border-b border-white/5 pb-4 last:border-0 cursor-pointer transition-all duration-300 outline-none focus:pl-2 ${
                  activePost.id === post.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-1">
                  <span className={`text-xs font-black uppercase tracking-tighter transition-colors ${
                    activePost.id === post.id ? 'text-[#00a6f0]' : 'text-gray-500 group-hover:text-white'
                  }`}>
                    {post._embedded?.['wp:term']?.[0]?.[0]?.name || "Gaia"}
                  </span>
                  <div className="flex items-center gap-1 text-white/20 text-xs">
                    <Clock size={10} />
                    {new Date(post.date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <h4 
                  className={`text-md font-black leading-tight uppercase italic tracking-tighter transition-colors duration-300 ${
                    activePost.id === post.id ? 'text-[#00a6f0]' : 'text-white group-hover:text-[#00a6f0]'
                  }`}
                  dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
                />
              </button>
            ))}
          </div>

          {/* Weather Widget */}
          <div className="mt-auto shrink-0">
            <WeatherWidgetSidebar />
          </div>
        </div>
      </div>

    </div>
  );
}