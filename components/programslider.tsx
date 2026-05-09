"use client";

import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { TVSidebarInfo } from "./tv-sidebar-info";
import Image from 'next/image';

interface ProgramSliderProps {
  initialPrograms?: any[];
}

export function ProgramSlider({ initialPrograms = [] }: ProgramSliderProps) {
  // Reference to the scrollable container for manual button control
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Track image errors by ID
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    // Get starting point and current scroll position
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!initialPrograms.length) return null;

  return (
    <section className="bg-[#0a0c10] py-12 font-nurom overflow-hidden select-none">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            A seguir
          </h2>
          
          <div className="flex gap-3">
            <button onClick={() => scroll('left')} className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full text-white transition-all border border-white/5">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="p-3 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full text-white transition-all border border-white/5">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-5 scroll-smooth scrollbar-hide snap-x snap-mandatory pb-4 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }} // Smooth momentum on iOS
        >
          {initialPrograms.map((prog) => (
            <div key={prog.id} onClick={() => setSelectedProgram(prog)} className="shrink-0 snap-start">
              <div className="bg-[#12161f] text-white border border-white/10 overflow-hidden rounded-2xl w-87.5 flex flex-col transition-all duration-300 hover:border-white/30 h-full">
                
                {/* Image Section with Fallback Logic */}
                <div className="h-37.5 w-full relative overflow-hidden bg-zinc-900">
                  {imageErrors[prog.id] ? (
                    /* Fallback UI: Centered text with background color */
                    <div 
                      className="absolute inset-0 flex items-center justify-center p-6 text-center transition-all"
                      style={{ backgroundColor: prog.color }}
                    >
                      <span className="text-black font-black uppercase italic text-xl leading-tight drop-shadow-sm">
                        {prog.title}
                      </span>
                    </div>
                  ) : (
                    /* Main Image */
                    <Image
                      src={prog.image}
                      alt={prog.title}
                      fill
                      className="object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [prog.id]: true }))}
                    />
                  )}
                </div>

                {/* Content Section */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-6">
                  <h3 className="text-white font-bold text-md leading-tight line-clamp-2">
                    {prog.title}
                  </h3>
                  
                  <div className="flex flex-row items-center gap-1.5 text-white/60">
                    <Clock size={14} />
                    <span className="text-sm font-bold tracking-tight">
                      {prog.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Ghost element to ensure the last card has spacing */}
          <div className="min-w-6 h-1" />
        </div>
      </div>
      {/* Renderiza a Sidebar quando houver um programa selecionado */}
      <TVSidebarInfo 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />
    </section>
  );
}