"use client";

import { AdPosition } from '@/lib/ads';
import { AdCarousel } from './ad-carousel';
import Link from 'next/link';

interface AdPlaceholderProps {
  position: AdPosition;
  label?: string;
}

export function AdPlaceholder({ position, label }: AdPlaceholderProps) {
  const sizes = {
    sidebar: 'aspect-square w-full rounded',
    featured: 'w-full h-24',
    inline: 'w-full h-24',
    footer: 'w-full h-24',
  };

  // Center inline and footer ads
  const containerClass =
    position === 'inline' || position === 'footer'
      ? `${sizes[position]} flex justify-center`
      : sizes[position];

  return (
    <div className={containerClass}>
      <AdCarousel position={position} fallback={<PlaceholderFallback position={position} />} />
    </div>
  );
}

function PlaceholderFallback({ position }: { position: AdPosition }) {
  const bgClasses = {
    sidebar: 'aspect-square w-full rounded',
    featured: 'w-full h-24',
    inline: 'w-full h-24',
    footer: 'w-full h-24',
  };

  return (
    <Link
      href="/vira-parceiro"
      className={`${
        bgClasses[position]
      } bg-[#2a2a2a] flex flex-col items-center justify-center gap-1 group hover:bg-[#1a2a3a] transition-colors rounded`}
    >
      <span className="text-[#00a6f0]/70 text-md uppercase font-bold group-hover:text-[#00a6f0] transition-colors">
        Valorize A Sua Marca Connosco
      </span>
      <span className="text-white/20 text-xs">Clica para saber mais</span>
    </Link>
  );
}
