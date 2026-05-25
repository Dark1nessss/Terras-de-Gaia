"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Clock, Plus, Minus } from "lucide-react";
import { TVSidebarInfo } from "./tv-sidebar-info";
import { LiveDot } from "./live-dot";
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
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  // Shift+wheel → horizontal scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.shiftKey && scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  // Mouse-drag → horizontal scroll
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.5;
  }, []);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [handleMouseMove, stopDrag]);

  return (
    <section className="bg-[#0a0c10] font-nurom border-t border-white/5 select-none relative">
      <div className="container mx-auto px-6 pt-10 pb-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
          Guia <span className="text-[#00a6f0]">TV</span>
        </h2>
        
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          className="flex overflow-x-auto mb-8 pb-1 scroll-smooth scrollbar-hide snap-x snap-mandatory border-b border-white/10 cursor-grab active:cursor-grabbing"
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
                <div className="w-30 md:w-48 aspect-video relative shrink-0 bg-black">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 96px, 192px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  {isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-1">
                      <LiveDot size="sm" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400 mt-0.75">Ao Vivo</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col px-4 md:px-8 min-w-0">
                  <h4 className="text-white font-black uppercase italic text-sm md:text-lg group-hover:text-[#00a6f0] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 md:gap-4 text-xs mt-1.5">
                    <div className="flex items-center gap-1 md:gap-1.5 text-white/40">
                      <Clock size={11} className="text-[#00a6f0] shrink-0" />
                      <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs">{item.time}</span>
                    </div>
                    {duration > 0 && (
                      <span className="text-white/25 font-bold uppercase tracking-wider text-[10px] md:text-xs">{duration}min</span>
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