"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Clock, Plus, Minus } from "lucide-react";
import { TVSidebarInfo } from "./tv-sidebar-info";
import Image from 'next/image';

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function formatDay(date: Date): string {
  const dayName = DIAS_SEMANA[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${dayName}, ${day}/${month}`;
}

function generateNextDays(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return formatDay(d);
  });
}

function computeDurationMin(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

export function TVGuideGrid({ initialPrograms = [], maxDays = 7 }: { initialPrograms?: any[]; maxDays?: number }) {
  const [activeDay, setActiveDay] = useState(() => formatDay(new Date()));
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [limit, setLimit] = useState(5);

  const currentTime = useMemo(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }, []);

  const availableDays = useMemo(() => generateNextDays(maxDays), [maxDays]);

  const dayPrograms = useMemo(() => {
    return initialPrograms
      .filter(p => p.data_completa?.trim() === activeDay)
      .sort((a, b) => (a.hora_inicio || "").localeCompare(b.hora_inicio || ""));
  }, [activeDay, initialPrograms]);

  const handleDayChange = (day: string) => {
    setActiveDay(day);
    setLimit(5);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#0a0c10] font-nurom border-t border-white/5 select-none relative">
      <div className="container mx-auto px-6 pt-10 pb-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
          Guia <span className="text-[#00a6f0]">TV</span>
        </h2>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto mb-8 pb-1 scroll-smooth scrollbar-hide snap-x snap-mandatory border-b border-white/10"
        >
          {availableDays.map((day, i) => (
            <button 
              key={day}
              onClick={() => handleDayChange(day)}
              className={`
                relative shrink-0 transition-all duration-300 group snap-start
                before:absolute before:inset-0 before:-skew-x-12 before:origin-bottom cursor-pointer
                ${day === activeDay
                  ? "text-[#00a6f0] before:bg-[#161b22] z-10" 
                  : "text-white/30 hover:text-white/60 before:bg-white/5"
                }
              `}
            >
              <span className="relative block px-12 py-5 text-[11px] font-black uppercase italic tracking-[0.15em] whitespace-nowrap">
                {day}
              </span>
              {day === activeDay && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a6f0] -skew-x-12 translate-y-px" />
              )}
              {i < availableDays.length - 1 && (
                <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/10 -skew-x-12" />
              )}
            </button>
          ))}
        </div>

        {dayPrograms.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/40 text-sm italic">Nenhum programa disponível para {activeDay}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPrograms.slice(0, limit).map((item, idx) => {
              const isLive = item.hora_inicio <= currentTime && item.hora_fim > currentTime;
              const duration = computeDurationMin(item.hora_inicio, item.hora_fim);
              return (
              <div 
                key={idx} 
                onClick={() => setSelectedProgram(item)}
                className="group flex items-center bg-[#161b22]/40 hover:bg-[#161b22]/60 transition-all rounded-lg overflow-hidden border border-white/5 select-none cursor-pointer"
              >
                {/* Color accent bar */}
                <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: item.color || '#00a6f0' }} />

                {/* Image */}
                <div className="w-48 aspect-video relative shrink-0 bg-black">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  {isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-1">
                      <span className="size-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400">Ao Vivo</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col px-8">
                  <h4 className="text-white font-black uppercase italic text-lg group-hover:text-[#00a6f0] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs mt-1.5">
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Clock size={13} className="text-[#00a6f0]" />
                      <span className="font-bold uppercase tracking-wider">{item.time}</span>
                    </div>
                    {duration > 0 && (
                      <span className="text-white/25 font-bold uppercase tracking-wider">{duration}min</span>
                    )}
                  </div>
                </div>
              </div>
            );
            })}

            {dayPrograms.length > 5 && (
              <div className="pt-6 flex justify-center">
                <button 
                  onClick={() => setLimit(limit >= dayPrograms.length ? 5 : dayPrograms.length)}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase italic tracking-[0.2em] text-[#00a6f0] hover:text-white transition-colors"
                >
                  {limit >= dayPrograms.length ? "Ver Menos" : "Ver Mais"}
                  {limit >= dayPrograms.length ? <Minus size={14} /> : <Plus size={14} />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <TVSidebarInfo 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />
    </section>
  );
}