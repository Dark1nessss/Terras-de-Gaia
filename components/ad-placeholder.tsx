"use client";

/**
 * Ad Placement Placeholder Component
 * Minimal grey background for ad validation
 * Replace with <AdSection /> when ready to use real ads
 */

interface AdPlaceholderProps {
  position: 'sidebar' | 'featured' | 'inline';
  label?: string;
}

export function AdPlaceholder({ position, label }: AdPlaceholderProps) {
  const sizes = {
    sidebar: 'aspect-square w-full rounded',
    featured: 'w-full h-24 ',
    inline: 'w-full h-24',
  };

  return (
    <div className={`${sizes[position]} bg-[#2a2a2a] flex items-center justify-center`}>
      <span className="text-white/30 text-xs uppercase font-bold">Publicidade</span>
    </div>
  );
}
