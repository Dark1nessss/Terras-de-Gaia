"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Calendar, Eye, Zap } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

interface PlaylistArchiveProps {
  initialVideos: Video[];
  nextPageToken?: string;
  playlistId: string;
}

export default function YouTubePlaylistArchive({
  initialVideos,
  nextPageToken: initialPageToken,
  playlistId,
}: PlaylistArchiveProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video>(initialVideos[0]);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(
    initialPageToken
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch more videos when reaching the bottom
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;

    if (isAtBottom && nextPageToken && !isLoading) {
      await loadMoreVideos();
    }
  };

  const loadMoreVideos = async () => {
    if (!nextPageToken || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/youtube-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId,
          pageToken: nextPageToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load more videos");
      }

      const data = await response.json();
      setVideos((prev) => [...prev, ...data.videos]);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      setError("Erro ao carregar mais vídeos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-12 md:py-16  bg-[#0a0c10] border-t border-white/10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[#00a6f0] text-xs font-black uppercase tracking-[0.2em] inline-block mb-3 px-3 py-1 border border-[#00a6f0]/30 rounded-full">
            ✦ Arquivo
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-2">
            Transmissões <span className="text-[#00a6f0]">Anteriores</span>
          </h2>
          <p className="text-white/60 text-base max-w-2xl">
            Reveja as transmissões anteriores de Terras de Gaia. Conteúdo que marcou presença.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT: Video Player */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Player */}
            <div className="relative aspect-video bg-black border border-white/10 rounded overflow-hidden shadow-lg group">
              <iframe
                key={selectedVideo.id}
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=0&controls=1&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                title={selectedVideo.title}
              />
            </div>

            {/* Video Info */}
            <div className="border border-white/10 rounded p-4 md:p-5 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white mb-3 line-clamp-2">
                {selectedVideo.title}
              </h3>

              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar size={14} className="text-[#00a6f0]" />
                  <span className="text-white/70">
                    {formatDate(selectedVideo.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Eye size={14} className="text-[#00a6f0]" />
                  <span className="text-white/70">YouTube</span>
                </div>
              </div>

              <p className="text-white/60 leading-relaxed text-xs line-clamp-3">
                {selectedVideo.description}
              </p>

              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-[#00a6f0] hover:text-[#00d4ff] font-black uppercase text-xs tracking-widest transition-colors cursor-pointer group"
              >
                Ver no YouTube <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT: Video List - Scrollable */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h4 className="text-sm font-black uppercase italic tracking-tighter text-white mb-3 px-3 py-1.5 bg-gradient-to-r from-[#00a6f0] to-[#00d4ff] rounded-t">
                Mais Transmissões
              </h4>

              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="bg-black/30 border border-white/10 border-t-0 rounded-b overflow-y-auto max-h-[500px] md:max-h-[calc(100vh-13.5rem)] scrollbar-thin"
              >
                <div className="divide-y divide-white/5">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full group text-left p-2.5 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                        selectedVideo.id === video.id
                          ? "bg-gradient-to-r from-[#00a6f0]/20 to-transparent border-l-4 border-l-[#00a6f0]"
                          : "hover:bg-white/5 border-l-4 border-l-transparent"
                      }`}
                    >
                      {/* Hover glow background */}
                      {selectedVideo.id === video.id && (
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00a6f0]/10 to-transparent"></div>
                      )}
                      
                      {/* Thumbnail */}
                      <div className="relative aspect-video mb-1.5 overflow-hidden rounded bg-black/50 border border-white/10 group-hover:border-[#00a6f0]/50 transition-colors">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300 cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-[#00a6f0] flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-lg">
                            <Play
                              size={16}
                              className="text-white ml-0.5"
                              fill="white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h5 className="text-xs font-black uppercase italic tracking-tight text-white group-hover:text-[#00a6f0] transition-colors line-clamp-2 mb-0.5">
                        {video.title}
                      </h5>

                      {/* Date */}
                      <div className="flex items-center gap-1">
                        <p className="text-[10px] text-white/50 font-bold">
                          {formatDate(video.publishedAt)}
                        </p>
                      </div>
                    </button>
                  ))}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="p-2 text-center">
                      <div className="inline-block w-3 h-3 border-2 border-[#00a6f0]/30 border-t-[#00a6f0] rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="p-2 text-center text-red-500 text-xs">
                      {error}
                    </div>
                  )}

                  {/* No More Videos */}
                  {!nextPageToken && videos.length > 0 && (
                    <div className="p-2 text-center text-white/40 text-[10px]">
                      Fim da lista
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
