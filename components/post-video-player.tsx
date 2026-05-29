"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Eye } from "lucide-react";
import { detectVideoType, parseYouTubeId } from "@/lib/video";

interface PostVideoPlayerProps {
  videoUrl: string;     // embed-ready URL from lib/video.ts extractVideoUrl()
  thumbnailUrl: string;
  title: string;
}

export function PostVideoPlayer({ videoUrl, thumbnailUrl, title }: PostVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [viewCount, setViewCount] = useState<string | null>(null);
  const type = detectVideoType(videoUrl);
  const ytId = type === 'youtube' ? parseYouTubeId(videoUrl) : null;

  // Poll YouTube view count every 7 minutes (only for YouTube videos)
  useEffect(() => {
    if (!ytId) return;
    const fetch_ = () =>
      fetch(`/api/youtube-stats?id=${ytId}&type=vod`)
        .then(r => r.json())
        .then(d => { if (d.views != null) setViewCount(Number(d.views).toLocaleString('pt-PT')); })
        .catch(() => null);
    fetch_();
    const id = setInterval(fetch_, 7 * 60 * 1000);
    return () => clearInterval(id);
  }, [ytId]);

  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
      {playing ? (
        type === 'youtube' ? (
          <>
            <iframe
              src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
            {viewCount && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 rounded-full px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm pointer-events-none select-none">
                <Eye size={11} />
                <span className="mt-1">{viewCount}</span>
              </div>
            )}
          </>
        ) : type === 'bunny' ? (
          <iframe
            src={`${videoUrl}?autoplay=true`}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          /* Direct video file — VPS-hosted mp4/webm */
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
          />
        )
      ) : (
        <>
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <button
            onClick={() => setPlaying(true)}
            aria-label="Reproduzir vídeo"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <span className="w-20 h-20 rounded-full bg-[#006ec2] flex items-center justify-center shadow-[0_0_40px_rgba(0,166,240,0.5)] group-hover:scale-110 group-hover:bg-[#0090d0] transition-all duration-200">
              <Play size={36} fill="white" className="text-white ml-1" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
