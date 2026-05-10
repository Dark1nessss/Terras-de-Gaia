"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowRight, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PORTAL_PROGRAMS = [
  {
    id: "01",
    title: "Mesa Posta",
    category: "Gastronomia",
    image: "/mesa-posta.jpg",
    slug: "mesa-posta",
    description: "Aceda ao arquivo completo da Terras de Gaia. Episódios exclusivos."
  },
  {
    id: "02",
    title: "Grande Angular",
    category: "Informação",
    image: "/grande-angular.jpg",
    slug: "grande-angular",
    description: "Análise profunda dos acontecimentos que moldam a nossa região."
  },
  {
    id: "03",
    title: "No Relvado",
    category: "Desporto",
    image: "/no-relvado.jpg",
    slug: "no-relvado",
    description: "Onde o desporto bate mais forte. Entrevistas e resumos exclusivos."
  }
];

export function ProgramsPortal() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PORTAL_PROGRAMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeProg = PORTAL_PROGRAMS[currentIndex];

  return (
    <section className="relative bg-[#0a0c10] py-24 font-nurom overflow-hidden border-t border-white/10">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[#00a6f0]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LADO ESQUERDO: BRANDING FIXO */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="flex items-center gap-3 text-[#00a6f0] text-xs font-black uppercase tracking-[0.5em] mb-8 drop-shadow-[0_0_8px_rgba(0,166,240,0.4)]">
              <span className="size-2 bg-[#00a6f0] rounded-full animate-pulse" />
              Conteúdo On Demand
            </span>
            
            <h2 className="text-7xl md:text-[8rem] lg:text-[9.5rem] font-black uppercase italic leading-[0.75] tracking-tighter mb-10 text-white drop-shadow-2xl">
              GAIA <br /> 
              <span className="text-transparent border-text-blue outline-text-vibrant">PLAY</span>
            </h2>

            <p className="text-white/50 text-lg font-bold uppercase italic tracking-tight leading-snug max-w-sm mb-12 border-l-4 border-[#00a6f0] pl-6 py-2">
              Explore os nossos programas originais, reportagens e teasers exclusivos.
            </p>

            <Link href="/gaia-play">
              <button className="group bg-[#00a6f0] text-white px-10 py-5 font-black uppercase italic tracking-widest text-sm flex items-center gap-4 hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(0,166,240,0.3)] cursor-pointer">
                Ver Todo o Catálogo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* LADO DIREITO: ECRÃ DINÂMICO COM TÍTULO DO PROGRAMA */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-video w-full flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeProg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full bg-[#161b22] border border-white/20 rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] z-20 group"
                >
                  <Image 
                    src={activeProg.image}
                    alt={activeProg.title}
                    fill
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradientes de Profundidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                  {/* INFO DO PROGRAMA (DINÂMICO) */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#00a6f0] text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded"
                      >
                        {activeProg.category}
                      </motion.span>
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-tighter"
                      >
                        {activeProg.title}
                      </motion.h3>
                    </div>

                    {/* Botão Play Dinâmico */}
                    <Link href={`/gaia-play/${activeProg.slug}`}>
                      <div className="size-16 rounded-full bg-[#00a6f0] flex items-center justify-center shadow-[0_0_30px_rgba(0,166,240,0.5)] hover:scale-110 transition-transform cursor-pointer">
                        <Play fill="white" className="text-white ml-1 size-7" />
                      </div>
                    </Link>
                  </div>

                  {/* Barra de Progresso Autoplay */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-[#00a6f0] w-full origin-left animate-progress" 
                    key={`progress-${currentIndex}`} 
                  />
                  {/* Elemento Decorativo Flutuante */}
                  <div className="absolute -top-6 -right-6 bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-lg z-20 hidden md:block">
                    <MonitorPlay className="text-[#00a6f0]" size={24} />
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Dots de Navegação Manual */}
            <div className="flex gap-2 justify-center mt-8">
              {PORTAL_PROGRAMS.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 transition-all duration-500 ${currentIndex === i ? 'w-10 bg-[#00a6f0]' : 'w-4 bg-white/10'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .outline-text-vibrant {
          -webkit-text-stroke: 2px #00a6f0;
          text-shadow: 0 0 20px rgba(0,166,240,0.3);
        }
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </section>
  );
}