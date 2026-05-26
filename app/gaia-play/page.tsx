"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Program } from '@/lib/programas';
import { slugifyCategory } from '@/lib/utils';
import { Play, Plus, MonitorPlay, Layers, ArrowRight, Tv } from 'lucide-react';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await fetch('/api/programs?featured=true');
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrograms();
  }, []);

  // Auto-rotate featured program
  useEffect(() => {
    if (programs.length === 0) return;

    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % programs.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [programs.length]);

  const featuredProgram = programs[currentFeaturedIndex];

  return (
    <main className="bg-[#0a0c10] min-h-screen font-nurom text-white selection:bg-[#00a6f0]">
      
      {/* 1. CINEMATIC HERO (VIDEO BACKGROUND) */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex items-end pb-24">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay muted loop playsInline 
            className="absolute inset-0 size-full object-cover opacity-50 scale-100"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0a0c10] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[#00a6f0]/5 mix-blend-overlay z-10" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <AnimatePresence mode="wait">
            {featuredProgram && (
              <motion.div 
                key={`featured-${currentFeaturedIndex}`}
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl space-y-8"
              >
                <div className="flex items-center gap-4">
                  <span className="bg-[#00a6f0] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.3em] rounded-sm">
                    <p className="pt-[2px]">Destaque da Semana</p>
                  </span>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest italic pt-[2px]">Streaming em 4K</span>
                </div>

                <h1 className="text-7xl md:text-[11rem] font-black uppercase italic leading-[0.75] tracking-tighter">
                  {featuredProgram.title.rendered.length > 20 ? (
                    <>
                      {featuredProgram.title.rendered.split(' ').slice(0, -1).join(' ')} <br />
                      <span className="text-transparent outline-text-vibrant">
                        {featuredProgram.title.rendered.split(' ').slice(-1).join(' ')}
                      </span>
                    </>
                  ) : (
                    <span className="text-transparent outline-text-vibrant">
                      {featuredProgram.title.rendered}
                    </span>
                  )}
                </h1>

                <p className="text-xl md:text-2xl text-white/60 font-medium italic max-w-2xl leading-relaxed border-l-2 border-[#00a6f0] pl-8">
                  {featuredProgram.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 120)}...
                </p>

                <div className="flex flex-wrap gap-6 pt-4">
                  <Link href={`/gaia-play/${featuredProgram.slug}`}>
                    <button className="bg-white text-black px-12 py-5 font-black uppercase italic tracking-widest text-xs flex items-center gap-4 hover:bg-[#00a6f0] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer">
                      <Play size={20} fill="currentColor" /> Ver Agora
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. GRID DE EXPLORAÇÃO MODERNO (Layout Assimétrico Integrado) */}
      <section className="py-32 relative z-30 bg-[#0a0c10]">
        <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <span className="text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.5em]">Originais</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
              Programas <span className="text-transparent outline-text-vibrant">Gaia</span>
            </h2>
          </div>
        </div>

        {/* O Carrossel de Expansão */}
        <div className="flex w-full h-[450px] md:h-[550px] overflow-x-auto no-scrollbar px-6 md:px-[5%] gap-2 group/list">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[320px] h-full flex-shrink-0 bg-zinc-900/60 border border-white/5 animate-pulse" />
              ))
            : programs.map((prog) => (
            <motion.div
              key={prog.id}
              layout
              whileHover={{ 
                width: "650px",
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
              }}
              className="relative min-w-[280px] md:min-w-[320px] h-full flex-shrink-0 cursor-pointer overflow-hidden border-x border-white/5"
            >
              <Link href={`/gaia-play/${prog.slug}`} className="block size-full relative">
                {/* Thumb Background */}
                {prog.featured_image_url ? (
                  <Image 
                    src={prog.featured_image_url} 
                    alt={prog.title.rendered} 
                    fill 
                    className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00a6f0]/20 to-transparent opacity-40 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-[#0a0c10]/20 to-transparent" />
                <div className="absolute inset-0 bg-[#00a6f0]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#00a6f0] transition-colors">
                      {prog.id.toString().padStart(2, '0')}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all">
                       <Plus size={20} className="text-[#00a6f0]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                       <motion.p 
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        className="text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                       >
                         {prog.acf?.categoria_programa || "Sem Categoria"}
                       </motion.p>
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none tracking-tighter whitespace-nowrap">
                      {prog.title.rendered}
                    </h3>

                    <div className="h-0.5 w-0 group-hover:w-full bg-[#00a6f0] transition-all duration-700" />
                    
                    <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                       <div className="size-12 rounded-full border border-white flex items-center justify-center">
                          <Play size={18} fill="currentColor" />
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest italic">Ver Detalhes</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* Card Final de "Ver Tudo" */}
          <Link href="/gaia-play/todos" className="min-w-[300px] h-full flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 hover:bg-[#00a6f0]/10 hover:border-[#00a6f0]/40 transition-all duration-300 gap-4 group">
            <MonitorPlay className="text-white/20 group-hover:text-[#00a6f0] transition-colors" size={40} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-[#00a6f0] transition-colors">Ver Tudo</span>
            <ArrowRight size={16} className="text-white/10 group-hover:text-[#00a6f0] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Dica de Navegação */}
        <div className="container mx-auto px-6 mt-12 flex items-center gap-4">
           <div className="h-px w-20 bg-[#00a6f0]" />
           <span className="text-xs font-black uppercase tracking-[0.5em] text-white/40">Usa o Shift + Scroll para navegar</span>
        </div>
      </section>

      {/* 3. SECTION: CATEGORIAS */}
      <section className="py-24 bg-[#0a0c10] relative border-t border-white/5">
        <div className="container mx-auto px-6">

          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-2">
              <span className="text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.5em]">Explorar</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
                Browse por <span className="text-transparent outline-text-vibrant">Categoria</span>
              </h2>
            </div>
            <Link href="/programacao" className="hidden md:flex items-center gap-2 text-white/40 hover:text-[#00a6f0] transition-colors text-xs font-black uppercase tracking-widest">
              <span className="mt-1">Ver Programação</span> <ArrowRight size={14} />
            </Link>
          </div>

          {/* Dynamic category cards from programs data */}
          {(() => {
            const categories = Array.from(
              programs.reduce((map, prog) => {
                const cat = prog.acf?.categoria_programa || 'Sem Categoria';
                if (!map.has(cat)) map.set(cat, []);
                map.get(cat)!.push(prog);
                return map;
              }, new Map<string, Program[]>())
            );

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(([cat, progs], i) => (
                  <Link key={cat} href={`/gaia-play/categoria/${slugifyCategory(cat)}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group relative border border-white/10 hover:border-[#00a6f0]/50 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-300 p-8 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-[#00a6f0] transition-all duration-500" />
                    <div className="absolute -right-6 -bottom-6 text-[6rem] font-black italic opacity-[0.04] group-hover:opacity-[0.08] transition-opacity select-none">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex items-start justify-between mb-6">
                      <Layers size={20} className="text-[#00a6f0]" />
                      <ArrowRight size={16} className="text-white/20 group-hover:text-[#00a6f0] group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">
                      {progs.length} {progs.length === 1 ? 'Programa' : 'Programas'}
                    </p>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{cat}</h3>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {progs.slice(0, 3).map(p => (
                        <span key={p.id} className="text-[9px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1">
                          {p.title.rendered}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                  </Link>
                ))}

                {/* Platform CTA card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group relative border border-dashed border-[#00a6f0]/30 hover:border-[#00a6f0] bg-[#00a6f0]/5 hover:bg-[#00a6f0]/10 transition-all duration-300 p-8 flex flex-col justify-between cursor-pointer"
                >
                  <Link href="/live" className="absolute inset-0 z-10" aria-label="Conteúdo On Demand" />
                  <Tv size={24} className="text-[#00a6f0]" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00a6f0]/60 mb-2">Gaia Play</p>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Conteúdo On Demand</h3>
                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00a6f0] group-hover:gap-4 transition-all">
                      <span className="mt-0.75">Ver em Direto</span> <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </div>
      </section>

      <style jsx>{`
        .outline-text-vibrant { 
          -webkit-text-stroke: 2.1px #00a6f0;
          text-shadow: 0 0 30px rgba(0,166,240,0.3);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}