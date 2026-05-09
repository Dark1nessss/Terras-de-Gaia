"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Clock } from "lucide-react";

export function TVGuideGrid({ initialPrograms = [] }: { initialPrograms?: any[] }) {
  const [activeDay, setActiveDay] = useState("Segunda");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const availableDays = useMemo(() => {
    if (!Array.isArray(initialPrograms)) return [];
    // Get unique days - data_completa is just the day name like "Segunda"
    const days = initialPrograms.map(p => p.data_completa?.trim()).filter(Boolean);
    return Array.from(new Set(days));
  }, [initialPrograms]);

  // Auto-select first available day when programs load
  React.useEffect(() => {
    if (availableDays.length > 0 && !availableDays.includes(activeDay)) {
      setActiveDay(availableDays[0]);
    }
  }, [availableDays, activeDay]);

  const dayPrograms = useMemo(() => {
    return initialPrograms
      .filter(p => p.data_completa?.trim() === activeDay)
      .sort((a, b) => (a.hora_inicio || "").localeCompare(b.hora_inicio || ""));
  }, [activeDay, initialPrograms]);

  const focusedProgram = useMemo(() => {
    return dayPrograms.find(p => p.id === selectedId) || dayPrograms[0];
  }, [dayPrograms, selectedId]);

  // Add this right after availableDays is set:
React.useEffect(() => {
  console.log("Available days:", availableDays);
  console.log("Active day:", activeDay);
  console.log("Day programs count:", dayPrograms.length);
  console.log("Day programs:", dayPrograms.map(p => ({ title: p.title, day: p.data_completa, time: p.time })));
}, [availableDays, activeDay, dayPrograms]);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#0a0c10] font-nurom border-t border-white/5 select-none">
      <div className="container mx-auto px-6 pt-12">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
          Guia TV
        </h2>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto mb-10 pb-1 scroll-smooth scrollbar-hide snap-x snap-mandatory border-b border-white/10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {availableDays.map((day, i) => (
            <button 
              key={day}
              onClick={() => setActiveDay(day)} // ← ADD THIS LINE
              className={`
                relative shrink-0 transition-all duration-300 group snap-start
                before:absolute before:inset-0 before:-skew-x-12 before:origin-bottom cursor-pointer
                ${day === activeDay
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
              {i < availableDays.length - 1 && (
                <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/10 -skew-x-12" />
              )}
            </button>
          ))}
          {/* Edge spacer for the last slanted tab */}
          <div className="min-w-10 shrink-0" />
        </div>

        {/* Schedule list remains focused on the grid */}
        {dayPrograms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/40 text-sm italic">Nenhum programa disponível para {activeDay}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPrograms.map((item, idx) => (
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
        )}
      </div>
    </section>
  );
}