"use client";

import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Clock, Play } from 'lucide-react';

const programs = [
  { id: 1, title: "Tá na Mesa", time: "11:30 - 12:25", color: "#f1b333", image: "/programs/tanamesa.jpg" },
  { id: 2, title: "Cara ou Coroa", time: "12:30 - 13:10", color: "#4f67b0", image: "/programs/cara.jpg" },
  { id: 3, title: "Nagenda", time: "13:15 - 13:25", color: "#e43c8c", image: "/programs/nagenda.jpg" },
  { id: 4, title: "Finanças em Dia", time: "13:30 - 13:55", color: "#ea6e4b", image: "/programs/financas.jpg" },
  { id: 5, title: "Ordem do Dia", time: "14:00 - 14:55", color: "#ffffff", image: "/programs/ordem.jpg" },
];

export function ProgramSlider() {
  // Reference to the scrollable container for manual button control
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#0a0c10] py-12 font-nurom overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            A seguir
          </h2>
          
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full text-white transition-all border border-white/5"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full text-white transition-all border border-white/5"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Update: Added 'snap-x snap-mandatory' for the sliding 'snap' effect 
            Update: Added padding-right to the last item via a ghost div 
        */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 scroll-smooth scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ WebkitOverflowScrolling: 'touch' }} // Smooth momentum on iOS
        >
          {programs.map((prog) => (
            <div 
              key={prog.id} 
              className="min-w-[85%] sm:min-w-[45%] lg:min-w-[320px] group cursor-pointer snap-start"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl mb-4 bg-[#161b22] border border-white/5">
                <div 
                  className="absolute inset-0 z-10 transition-opacity duration-500 group-hover:opacity-40" 
                  style={{ backgroundColor: prog.color, opacity: 0.85 }}
                />
                
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-[#00a6f0] p-4 rounded-full shadow-[0_0_20px_rgba(0,166,240,0.4)]">
                    <Play fill="white" className="text-white ml-1" size={24} />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-6 z-15 group-hover:scale-110 transition-transform duration-500">
                   <span className="text-black font-black uppercase italic text-center text-2xl leading-tight drop-shadow-sm">
                     {prog.title}
                   </span>
                </div>
              </div>

              <h3 className="text-white font-black uppercase italic text-base group-hover:text-[#00a6f0] transition-colors">
                {prog.title}
              </h3>
              <div className="flex items-center gap-2 text-white/40 text-[11px] mt-1 font-bold uppercase tracking-widest">
                <Clock size={12} className="text-[#00a6f0]" />
                {prog.time}
              </div>
            </div>
          ))}
          {/* Ghost element to ensure the last card has spacing */}
          <div className="min-w-6 h-1" />
        </div>
      </div>
    </section>
  );
}