"use client";

import React, { useRef } from 'react';
import { Clock } from "lucide-react";

const days = ["Segunda, 27/04", "Terça, 28/04", "Quarta, 29/04", "Quinta, 30/04", "Sexta, 1/05", "Sábado, 2/05", "Domingo, 3/05"];

const schedule = [
  { time: "9:30 - 11:25", title: "Manhã Desportiva", color: "#1e3a8a" },
  { time: "11:30 - 12:25", title: "Tá na Mesa", color: "#f1b333" },
  { time: "12:30 - 13:10", title: "Cara ou Coroa", color: "#4f67b0" },
];

export function TVGuideGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#0a0c10] pb-24 font-nurom border-t border-white/5 select-none">
      <div className="container mx-auto px-6 pt-12">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
          Guia TV
        </h2>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto mb-10 pb-1 scroll-smooth scrollbar-hide snap-x snap-mandatory border-b border-white/10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {days.map((day, i) => (
            <button 
              key={day}
              className={`
                relative shrink-0 transition-all duration-300 group snap-start
                /* Slanted Background using before element */
                before:absolute before:inset-0 before:-skew-x-12 before:origin-bottom cursor-pointer
                ${i === 0 
                  ? "text-[#00a6f0] before:bg-[#161b22] z-10" 
                  : "text-white/30 hover:text-white/60 before:bg-white/5"
                }
              `}
            >
              {/* Text content un-skewed for readability */}
              <span className="relative block px-12 py-5 text-[11px] font-black uppercase italic tracking-[0.15em] whitespace-nowrap">
                {day}
              </span>
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a6f0] -skew-x-12 translate-y-px" />
              )}
              
              {/* Vertical Divider Line */}
              {i < days.length - 1 && (
                <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/10 -skew-x-12" />
              )}
            </button>
          ))}
          {/* Edge spacer for the last slanted tab */}
          <div className="min-w-10 shrink-0" />
        </div>

        {/* Schedule list remains focused on the grid */}
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div 
              key={idx} 
              className="group flex items-center bg-[#161b22]/40 hover:bg-[#161b22]/60 transition-all rounded-lg overflow-hidden border border-white/5 select-none cursor-pointer"
            >
              <div 
                className="w-48 aspect-video flex items-center justify-center p-4 relative shrink-0"
                style={{ backgroundColor: item.color }}
              >
                <span className="text-white font-black uppercase italic text-xs text-center leading-tight drop-shadow-md">
                  {item.title}
                </span>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
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