import React from 'react';
import { ChevronRight, ChevronLeft, Clock, Play } from 'lucide-react';

const programs = [
  { id: 1, title: "Tá na Mesa", time: "11:30 - 12:25", color: "#f1b333", image: "/programs/tanamesa.jpg" },
  { id: 2, title: "Cara ou Coroa", time: "12:30 - 13:10", color: "#4f67b0", image: "/programs/cara.jpg" },
  { id: 3, title: "Nagenda", time: "13:15 - 13:25", color: "#e43c8c", image: "/programs/nagenda.jpg" },
  { id: 4, title: "Finanças em Dia", time: "13:30 - 13:55", color: "#ea6e4b", image: "/programs/financas.jpg" },
  { id: 5, title: "Ordem do Dia", time: "14:00 - 14:55", color: "#ffffff", image: "/programs/ordem.jpg" },
];

export function ProgramSlider() {
  return (
    <section className="bg-[#0a0c10] py-12 font-nurom">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            A seguir
          </h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {programs.map((prog) => (
            <div key={prog.id} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                <div 
                  className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-80" 
                  style={{ backgroundColor: prog.color, opacity: 0.9 }}
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                    <Play fill="white" className="text-white" size={24} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6 z-15">
                   <span className="text-black font-black uppercase italic text-center text-xl leading-tight">
                     {prog.title}
                   </span>
                </div>
              </div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wide group-hover:text-[#00a6f0] transition-colors">
                {prog.title}
              </h3>
              <div className="flex items-center gap-2 text-white/40 text-[11px] mt-1 font-bold">
                <Clock size={12} />
                {prog.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}