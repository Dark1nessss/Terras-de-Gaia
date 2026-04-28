import { notFound } from "next/navigation";

const SPORT_CONFIG: Record<string, { title: string; widgetId: string; theme: string }> = {
  futebol: { title: "Futebol", widgetId: "zz_fb_1", theme: "#00a6f0" },
  futsal: { title: "Futsal", widgetId: "zz_fs_1", theme: "#ff4500" },
  andebol: { title: "Andebol", widgetId: "zz_an_1", theme: "#00ffcc" },
};

// 1. Change to async function
export default async function SportSlugPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> // 2. Define params as a Promise
}) {
  // 3. Await the params
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const sport = SPORT_CONFIG[slug.toLowerCase()];

  if (!sport) return notFound();

  return (
    <main className="min-h-screen bg-[#020406] pt-32 pb-20 px-4 md:px-8 font-nurom">
      <div className="max-w-7xl mx-auto">
        <div className="text-[#00a6f0] font-mono text-[10px] tracking-[0.4em] mb-4 uppercase">
          Unidade_Gaia // Desporto // {slug}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <h1 className="text-6xl font-black italic uppercase text-white mb-12 tracking-tighter">
              {sport.title}
            </h1>
            <div className="p-10 border border-white/5 bg-white/[0.02]">
               <p className="text-white/40">Conteúdo para {sport.title} a carregar...</p>
            </div>
          </div>

          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00a6f0]" /> Classificação
              </h2>
              <div className="aspect-[3/4] bg-black/40 border border-dashed border-white/10 flex items-center justify-center">
                 <span className="text-white/20 font-mono text-[10px]">WIDGET_{sport.widgetId}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}