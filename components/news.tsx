import { ChevronRight, Calendar} from "lucide-react";
import { getPosts } from "../app/lib/wp";

const posts = await getPosts();

// display posts in frontend

const news = [
  {
    id: 1,
    category: "Desporto",
    title: "FC Porto vence clássico e assume a liderança do campeonato",
    date: "27 Abril, 2026",
  },
  {
    id: 2,
    category: "Região",
    title: "Novas infraestruturas em Gaia prometem melhorar mobilidade urbana",
    date: "26 Abril, 2026",
  },
  {
    id: 3,
    category: "Cultura",
    title: "Festival de Verão confirma primeiras atrações internacionais",
    date: "26 Abril, 2026",
  },
];

export function News() {
  return (
    <>
      {/* 3. NEWS SECTION (Integrated directly) */}
      <section className="py-16 border-t border-white/5 bg-[#0a0c10]">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
                Últimas <span className="text-[#00a6f0]">Notícias</span>
              </h2>
              <div className="h-1 w-12 bg-[#00a6f0] mt-2" />
            </div>
            <button className="flex items-center gap-2 text-white/50 hover:text-[#00a6f0] transition-colors uppercase text-xs font-bold tracking-widest">
              Ver Todas <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="group cursor-pointer">
                {/* News Thumbnail Placeholder */}
                <div className="relative aspect-3/2 mb-6 overflow-hidden rounded-sm border border-white/10 bg-white/5">
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10" />
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 z-20 bg-[#00a6f0] text-white text-[10px] font-black uppercase px-2 py-1 italic tracking-widest">
                    {item.category}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Calendar size={12} className="text-[#00a6f0]" />
                  {item.date}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl text-white leading-tight group-hover:text-[#00a6f0] transition-colors uppercase italic tracking-tighter">
                  {item.title}
                </h3>

                {/* Animated underline */}
                <div className="mt-6 w-8 group-hover:w-full h-px bg-white/10 group-hover:bg-[#00a6f0] transition-all duration-500" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
