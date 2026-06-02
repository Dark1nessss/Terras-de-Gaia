"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Eye } from "lucide-react";
import { detectVideoType, parseYouTubeId } from "@/lib/video";

interface PostVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
}

export function PostVideoPlayer({ videoUrl, thumbnailUrl, title }: PostVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [viewCount, setViewCount] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const type = detectVideoType(videoUrl);
  const ytId = type === 'youtube' ? parseYouTubeId(videoUrl) : null;
  // Prefer YouTube thumbnail when available; fall back to passed thumbnailUrl
  const effectiveThumbnail = ytId
    ? (imgError
      ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`
      : `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`)
    : thumbnailUrl;

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
    <div className="mb-12">
      {/* Video / Thumbnail container */}
      <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
        {playing ? (
          type === 'youtube' ? (
            <iframe
              src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : type === 'bunny' ? (
            <iframe
              src={`${videoUrl}?autoplay=true`}
              title={title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
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
            {/* Thumbnail — gradient fallback if image fails */}
            {(imgError && !ytId) ? (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#0a1628] to-[#001a3a]" />
            ) : (
              <Image
                src={effectiveThumbnail}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            )}
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

      {/* View count — below video, not overlaid */}
      {viewCount && (
        <div className="flex items-center gap-1.5 mt-3 text-white/40 text-xs font-bold uppercase tracking-widest">
          <Eye size={12} />
          <span>{viewCount} visualizações</span>
        </div>
      )}
    </div>
  );
}
