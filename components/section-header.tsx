interface SectionHeaderProps {
  title: string;
  count: number;
  itemName?: string;
}

export function SectionHeader({ title, count, itemName = "artigo" }: SectionHeaderProps) {
  return (
    <div className="mb-10 border-b border-white/[0.03] pb-6">
      <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 capitalize">
        {title}
      </h1>
      <p className="text-white/40 text-sm">
        {count} {itemName}{count !== 1 ? 's' : ''} publicado{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
}