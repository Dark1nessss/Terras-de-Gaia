import { Clock } from "lucide-react";

const days = ["Segunda, 27/04", "Terça, 28/04", "Quarta, 29/04", "Quinta, 30/04", "Sexta, 1/05"];

const schedule = [
  { time: "9:30 - 11:25", title: "Manhã Desportiva", color: "#1e3a8a" },
  { time: "11:30 - 12:25", title: "Tá na Mesa", color: "#f1b333" },
  { time: "12:30 - 13:10", title: "Cara ou Coroa", color: "#4f67b0" },
];

export function TVGuideGrid() {
  return (
    <section className="bg-[#0a0c10] pb-24 font-nurom border-t border-white/5">
      <div className="container mx-auto px-6 pt-12">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
          Guia TV
        </h2>

        {/* Day Tabs with Parallelogram Shape */}
        <div className="flex overflow-x-auto gap-4 mb-10 pb-2 scrollbar-hide border-b border-white/5 px-4">
          {days.map((day, i) => (
            <button 
              key={day}
              className={`
                relative shrink-0 transition-all duration-300 group before:absolute before:inset-0 before:-skew-x-8 before:transition-colors
                ${i === 0 
                  ? "before:bg-[#161b22] text-[#00a6f0] before:border-b-2 before:border-[#00a6f0]" 
                  : "text-white/30 hover:text-white/60 before:bg-white/5 hover:before:bg-white/10"
                }
              `}
            >
              <span className="relative block px-8 py-4 text-[11px] font-black uppercase italic tracking-[0.2em] whitespace-nowrap">
                {day}
              </span>
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex items-center bg-[#161b22]/40 hover:bg-[#161b22]/80 transition-all rounded-lg overflow-hidden border border-white/5"
            >
              <div 
                className="w-48 aspect-video flex items-center justify-center p-4 relative shrink-0"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-white font-black uppercase italic text-xs text-center leading-tight">
                  {item.title}
                </span>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              
              <div className="flex flex-col px-8">
                <h4 className="text-white font-black uppercase italic text-lg group-hover:text-[#00a6f0] transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                  <Clock size={14} className="text-[#00a6f0]" />
                  <span className="font-bold uppercase tracking-wider">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}