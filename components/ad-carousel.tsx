'use client';

import { Advertisement, AdPosition } from '@/lib/ads';
import Image from 'next/image';
import { useEffect, useState, ReactNode } from 'react';

function AdMedia({ ad }: { ad: Advertisement }) {
  const mediaType = ad.acf?.tipo_de_midia;

  if (!ad.featured_media_url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
        <span className="text-white/30 text-xs uppercase font-bold">Publicidade</span>
      </div>
    );
  }

  if (mediaType === 'muted_video') {
    return (
      <video
        src={ad.featured_media_url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
      />
    );
  }

  if (mediaType === 'gif') {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={ad.featured_media_url}
        alt={ad.title.rendered}
        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
      />
    );
  }

  return (
    <Image
      src={ad.featured_media_url}
      alt={ad.title.rendered}
      fill
      className="object-cover group-hover:opacity-90 transition-opacity"
      priority={false}
    />
  );
}

interface AdCarouselProps {
  position: AdPosition;
  fallback?: ReactNode;
}

export function AdCarousel({ position, fallback }: AdCarouselProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ads?position=${position}`);

        if (!response.ok) {
          setError(true);
          return;
        }

        const data = await response.json();
        if (data.ads && data.ads.length > 0) {
          setAds(data.ads);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  // Rotate ads every 5 seconds
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  // Show fallback if loading, error, or no ads
  if (loading || error || ads.length === 0) {
    return fallback;
  }

  const currentAd = ads[currentAdIndex];
  const sizeClasses = {
    sidebar: 'aspect-square w-full rounded',
    featured: 'w-full h-24',
    inline: 'w-full h-24 max-w-7xl',
    footer: 'w-full h-24',
  };

  return (
    <a
      href={currentAd.acf?.url_clickthrough || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`${sizeClasses[position]} block overflow-hidden rounded bg-[#2a2a2a] relative group`}
      title={currentAd.title.rendered}
    >
      <AdMedia ad={currentAd} />

      {/* Ad counter dots if multiple ads */}
      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentAdIndex ? 'w-2 bg-white' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </a>
  );
}
