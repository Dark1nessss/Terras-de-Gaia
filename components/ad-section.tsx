"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Advertisement } from '@/lib/ads';
import { X } from 'lucide-react';

interface AdSectionProps {
  ads: Advertisement[];
  position: 'sidebar' | 'featured' | 'inline';
  rotationInterval?: number; // milliseconds, default 8000 (8 seconds)
  autoRotate?: boolean;
  showLabel?: boolean;
}

export function AdSection({
  ads,
  position,
  rotationInterval = 8000,
  autoRotate = true,
  showLabel = true,
}: AdSectionProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentAd = ads[currentAdIndex];

  // Auto-rotate ads
  useEffect(() => {
    if (!autoRotate || ads.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [ads.length, autoRotate, rotationInterval, isHovered]);

  if (!ads || ads.length === 0) {
    return null;
  }

  // Sidebar: vertical rectangle 300x600 or square 300x300
  if (position === 'sidebar') {
    return (
      <div
        className="relative bg-[#161b22] border border-white/5 rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showLabel && (
          <div className="absolute top-2 left-2 z-10 bg-white/10 text-white/50 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">
            Publicidade
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-square"
          >
            {currentAd.featured_image_url ? (
              <Link
                href={currentAd.acf?.clickthrough_url || '#'}
                target={currentAd.acf?.clickthrough_url ? '_blank' : undefined}
                rel={currentAd.acf?.clickthrough_url ? 'noopener noreferrer' : undefined}
                className="block w-full h-full"
              >
                <Image
                  src={currentAd.featured_image_url}
                  alt={currentAd.acf?.clickthrough_url ? 'Advertisement' : 'Ad'}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </Link>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00a6f0]/10 to-transparent flex items-center justify-center">
                <span className="text-white/20 text-xs font-black">{currentAd.title}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 px-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentAdIndex
                    ? 'bg-[#00a6f0] w-4'
                    : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Featured: horizontal rectangle or full-width banner
  if (position === 'featured') {
    return (
      <div
        className="relative bg-[#161b22] border border-white/5 rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showLabel && (
          <div className="absolute top-2 left-2 z-10 bg-white/10 text-white/50 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">
            Publicidade
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-video"
          >
            {currentAd.featured_image_url ? (
              <Link
                href={currentAd.acf?.clickthrough_url || '#'}
                target={currentAd.acf?.clickthrough_url ? '_blank' : undefined}
                rel={currentAd.acf?.clickthrough_url ? 'noopener noreferrer' : undefined}
                className="block w-full h-full"
              >
                <Image
                  src={currentAd.featured_image_url}
                  alt={currentAd.acf?.clickthrough_url ? 'Advertisement' : 'Ad'}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                />
              </Link>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00a6f0]/10 to-transparent flex items-center justify-center">
                <span className="text-white/20 text-sm font-black">{currentAd.title}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 px-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentAdIndex
                    ? 'bg-[#00a6f0] w-6'
                    : 'bg-white/20 w-2 hover:bg-white/40'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Inline: small horizontal ad for within content
  if (position === 'inline') {
    return (
      <div
        className="relative bg-[#161b22] border border-white/5 rounded-lg overflow-hidden my-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-video"
          >
            {currentAd.featured_image_url ? (
              <Link
                href={currentAd.acf?.clickthrough_url || '#'}
                target={currentAd.acf?.clickthrough_url ? '_blank' : undefined}
                rel={currentAd.acf?.clickthrough_url ? 'noopener noreferrer' : undefined}
                className="block w-full h-full"
              >
                <Image
                  src={currentAd.featured_image_url}
                  alt={currentAd.acf?.clickthrough_url ? 'Advertisement' : 'Ad'}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 100vw"
                />
              </Link>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00a6f0]/10 to-transparent flex items-center justify-center">
                <span className="text-white/20 text-xs font-black">{currentAd.title}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 px-2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentAdIndex
                    ? 'bg-[#00a6f0] w-4'
                    : 'bg-white/20 w-1.5 hover:bg-white/40'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
