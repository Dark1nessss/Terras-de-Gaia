import { Tv, Clock, Info, Calendar } from "lucide-react";
import Link from "next/link";

// Mock Data for DRYness - later fetch from WP or API
const DAILY_SCHEDULE = [
  { time: "09:00", title: "Manhã em Gaia", category: "Informação" },
  { time: "13:00", title: "Jornal Diário", category: "Notícias", active: true },
  { time: "15:30", title: "Cultura Viva", category: "Magazine" },
  { time: "18:00", title: "Desporto Local", category: "Desporto" },
  { time: "21:00", title: "Grande Entrevista", category: "Talk Show" },
];

export default function LivePage() {
  const videoId = "jfKfPfyJRdk"; // Replace with your live source

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[#00a6f0] text-[10px] font-black uppercase tracking-widest">Em Direto</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Terras de Gaia <span className="text-[#00a6f0]">TV</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Quarta-feira, 29 de Abril</p>
          </div>
        </div>

        {/* Main Theater Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Video Player */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-black shadow-2xl border border-white/5 overflow-hidden group">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
              />
              <div className="absolute top-4 left-4 pointer-events-none">
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 rounded flex items-center gap-2">
                    <Tv size={14} className="text-[#00a6f0]" />
                    <span className="text-[10px] font-black uppercase italic">Canal Principal</span>
                 </div>
              </div>
            </div>
            
            {/* Live Description Block */}
            <div className="mt-8 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
              <h2 className="text-2xl font-black uppercase italic mb-4">Jornal Diário — Edição da Tarde</h2>
              <p className="text-white/60 leading-relaxed max-w-3xl">
                Acompanhe as principais notícias que marcam a atualidade de Vila Nova de Gaia e da região. 
                Entrevistas em estúdio, reportagens locais e a análise desportiva diária.
              </p>
            </div>
          </div>

          {/* RIGHT: Schedule Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#00a6f0] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-white" />
                <span className="font-black uppercase italic tracking-tighter">Programação</span>
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase">Hoje</span>
            </div>

            <div className="space-y-1">
              {DAILY_SCHEDULE.map((item, idx) => (
                <div 
                  key={idx}
                  className={`group p-5 flex items-center justify-between border-b border-white/5 transition-all duration-300 hover:bg-white/[0.03] ${item.active ? 'bg-white/5 border-l-4 border-l-[#00a6f0]' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`text-xs font-black italic ${item.active ? 'text-[#00a6f0]' : 'text-white/30'}`}>
                      {item.time}
                    </span>
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight italic ${item.active ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                        {item.title}
                      </p>
                      <p className="text-[9px] font-bold text-[#00a6f0] uppercase tracking-widest mt-0.5">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  {item.active && (
                    <span className="text-[9px] font-black uppercase text-[#00a6f0] animate-pulse">Agora</span>
                  )}
                </div>
              ))}
            </div>

            {/* Support/Interaction Box */}
            <div className="mt-auto p-6 border border-dashed border-white/20 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-white/40">
                  <Info size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Informações</span>
               </div>
               <p className="text-xs text-white/50 leading-relaxed italic">
                 Dificuldades com a emissão? Contacte o nosso suporte técnico através do canal oficial.
               </p>
               <Link href="/contactos" className="inline-block text-center py-3 border border-white/10 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">
                  Pedir Ajuda
               </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}