import { Breadcrumb } from "@/components/breadcrumb";
import { SectionHeader } from "@/components/section-header";
import { AdPlaceholder } from "@/components/ad-placeholder";
import Link from "next/link";
import { Newspaper, Trophy, BookOpen, Palette } from "lucide-react";

const CATEGORIES = [
  { name: "Informação", slug: "informacao", icon: <Newspaper size={32} /> },
  { name: "Cultura", slug: "cultura", icon: <Palette size={32} /> },
  { name: "Institucional", slug: "institucional", icon: <BookOpen size={32} /> },
  { name: "Desporto", slug: "desporto", icon: <Trophy size={32} /> },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-20 font-nurom">
      <div className="container mx-auto px-6 max-w-7xl">
        <Breadcrumb 
          items={[{ label: "Inicial", href: "/" }]} 
          current="Categorias"
        />
        <SectionHeader title="Categorias" count={CATEGORIES.length} itemName="categoria" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "desporto" ? `/desporto` : `/categoria/${cat.slug}`}
              className="group relative p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-lg hover:border-[#00a6f0] transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a6f0]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="text-[#00a6f0] group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase group-hover:text-[#00a6f0] transition-colors duration-300 tracking-tighter">
                  {cat.name}
                </h3>
                <div className="h-0.5 w-8 bg-white/20 group-hover:bg-[#00a6f0] transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}