"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TVSidebarInfoProps {
  program: any | null;
  onClose: () => void;
}

export function TVSidebarInfo({ program, onClose }: TVSidebarInfoProps) {
  const [isAnimateIn, setIsAnimateIn] = useState(false);
  const [activeProgram, setActiveProgram] = useState<any | null>(null);

  useEffect(() => {
    if (program) {
      setActiveProgram(program);
      // Abre: 400ms duration
      const timer = setTimeout(() => setIsAnimateIn(true), 10);
      
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (window.innerWidth > 768) document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => clearTimeout(timer);
    } else {
      setIsAnimateIn(false);
      // Fecha: 250ms duration
      const timer = setTimeout(() => {
        setActiveProgram(null);
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [program]);

  if (!activeProgram) return null;

  return (
    <div className="fixed inset-0 z-[100] font-nurom">
      {/* Backdrop: bg-black/20 com transição suave */}
      <div 
        onClick={() => {
          setIsAnimateIn(false);
          setTimeout(onClose, 250);
        }}
        className={`fixed inset-0 bg-black/20 transition-opacity ease-in-out ${
          isAnimateIn 
            ? 'opacity-100 duration-400' 
            : 'opacity-0 duration-200 delay-150'
        }`}
      />
      
      {/* Drawer / Sidebar */}
      <div 
        className={`
          fixed bg-[#0a0c10] shadow-2xl border-white/5 flex flex-col overflow-hidden
          transition-transform cubic-bezier(0.05, 0.7, 0.1, 1.0)
          
          /* MOBILE: Bottom-up, 50-60% height, rounded top */
          bottom-0 left-0 right-0 max-h-[calc(100dvh-4rem)] min-h-[60svh] rounded-t-xl border-t
          ${isAnimateIn ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}

          /* DESKTOP: Right-to-left, max-w-lg */
          md:top-0 md:right-0 md:left-auto md:h-full md:w-full md:max-w-lg md:rounded-none md:border-l md:border-t-0
          md:translate-y-0
          ${isAnimateIn ? 'md:translate-x-0' : 'md:translate-x-full'}

          /* Durations */
          ${isAnimateIn ? 'duration-400' : 'duration-250'}
        `}
        style={{ 
          transitionTimingFunction: isAnimateIn 
            ? 'cubic-bezier(0.05, 0.7, 0.1, 1.0)' // Emphasized decelerate
            : 'cubic-bezier(0.3, 0, 0.8, 0.15)'   // Emphasized accelerate
        }}
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* 1. Imagem */}
          <div className="relative w-full aspect-video shrink-0 bg-black overflow-hidden">
            <Image 
              src={activeProgram.image} 
              alt={activeProgram.title} 
              fill 
              className="object-cover opacity-90"
              priority
            />
          </div>

          {/* 2. Conteúdo Compacto */}
          <div className="p-6 md:p-10 flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-1 leading-tight">
              {activeProgram.title}
            </h2>

            <div className="h-1 w-8 bg-[#00a6f0] mb-4" />

            <div 
              className="text-[#999] text-lg leading-snug font-normal normal-case prose-p:mb-3"
              dangerouslySetInnerHTML={{ __html: activeProgram.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}