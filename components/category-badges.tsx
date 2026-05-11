'use client';

import { getCategoryLink } from '@/lib/wp';
import Link from 'next/link';

interface Category {
  name: string;
  slug: string;
  href?: string;
}

interface CategoryBadgesProps {
  categories: Category[];
}

export function CategoryBadges({ categories }: CategoryBadgesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.href || getCategoryLink(category.slug)}
          className="inline-flex px-4 py-2 bg-[#00a6f0] text-black font-black uppercase text-xs tracking-widest rounded hover:bg-[#0088c3] transition-colors duration-200"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}