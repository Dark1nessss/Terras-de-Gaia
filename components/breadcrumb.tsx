'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  current?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: "Inicial", href: "/" }];
  
  segments.forEach((segment, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    crumbs.push({ label, href });
  });
  
  return crumbs;
}

export function Breadcrumb({ items, current }: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  return (
    <nav className="mb-8 flex items-center gap-2 text-ssm text-white/50 border-b border-white/[0.03] pb-4 overflow-x-auto">
      {breadcrumbs.map((item, idx) => (
        <div key={item.href} className="flex items-center gap-2 whitespace-nowrap">
          <Link 
            href={item.href}
            className="hover:text-[#00a6f0] transition-colors"
          >
            {item.label}
          </Link>
          {idx < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-white/30" />}
        </div>
      ))}
      {current && (
        <>
          <ChevronRight size={12} className="text-white/20" />
          <span className="text-white/70 font-semibold whitespace-nowrap">{current}</span>
        </>
      )}
    </nav>
  );
}