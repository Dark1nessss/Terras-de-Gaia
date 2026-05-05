import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  current?: string;
}

export function Breadcrumb({ items, current }: BreadcrumbProps) {
  return (
    <nav className="mb-8 flex items-center gap-2 text-sm text-white/50 border-b border-white/[0.03] pb-4 overflow-x-auto">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
          <Link 
            href={item.href} 
            className="hover:text-[#00a6f0] transition-colors"
          >
            {item.label}
          </Link>
          <span className="text-white/30">/</span>
        </div>
      ))}
      {current && (
        <span className="text-white/70 font-semibold whitespace-nowrap">{current}</span>
      )}
    </nav>
  );
}