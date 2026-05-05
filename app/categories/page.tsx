import { Breadcrumb } from "@/components/breadcrumb";
import { SectionHeader } from "@/components/section-header";
import Link from "next/link";

const CATEGORIES = [
  { name: "Informação", slug: "informacao" },
  { name: "Cultura", slug: "cultura" },
  { name: "Institucional", slug: "institucional" },
  { name: "Desporto", slug: "desporto" },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
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
              className="group p-8 bg-white/2 border border-white/5 rounded hover:border-[#00a6f0] transition-colors text-center"
            >
              <h3 className="text-2xl font-black italic uppercase group-hover:text-[#00a6f0] transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}