"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { Play, Plus, Info, ChevronRight, MonitorPlay, Star, Calendar } from 'lucide-react';

// MOCK DATA - Estrutura preparada para expansão
const PROGRAMS_DATA = [
  {
    id: 1,
    title: "Mesa Posta",
    category: "Gastronomia",
    slug: "mesa-posta",
    thumb: "/thumbs/mesa.jpg",
    description: "Uma viagem imersiva pelos sabores e histórias das gentes de Gaia.",
    isOriginal: true,
    rating: "4.9",
    duration: "12 Eps"
  },
  {
    id: 2,
    title: "Grande Angular",
    category: "Informação",
    slug: "grande-angular",
    thumb: "/thumbs/angular.jpg",
    description: "Análise profunda aos temas que marcam a atualidade da nossa região.",
    isOriginal: true,
    rating: "4.7",
    duration: "8 Eps"
  },
  {
    id: 3,
    title: "No Relvado",
    category: "Desporto",
    slug: "no-relvado",
    thumb: "/thumbs/relvado.jpg",
    description: "O pulsar do desporto gaiense, do futebol de formação às grandes elites.",
    isOriginal: true,
    rating: "4.8",
    duration: "24 Eps"
  },
  {
    id: 4,
    title: "Vozes de Gaia",
    category: "Sociedade",
    slug: "vozes-de-gaia",
    thumb: "/thumbs/vozes.jpg",
    description: "As figuras que moldam o futuro da cidade em conversas exclusivas.",
    isOriginal: false,
    duration: "10 Eps"
  },
  {
    id: 5,
    title: "Agenda Viva",
    category: "Cultura",
    slug: "agenda-viva",
    thumb: "/thumbs/agenda.jpg",
    description: "O roteiro essencial para tudo o que acontece no concelho.",
    isOriginal: false,
    duration: "15 Eps"
  }
];

export default function ProgramsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl space-y-8"
          >
            <div className="flex items-center gap-4">
              <span className="bg-[#00a6f0] text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.3em] rounded-sm">
                <p className="pt-[2px]">Destaque da Semana</p>
              </span>
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest italic pt-[2px]">Streaming em 4K</span>
            </div>

            <h1 className="text-7xl md:text-[11rem] font-black uppercase italic leading-[0.75] tracking-tighter">
              MESA <br />
              <span className="text-transparent outline-text-vibrant">POSTA</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 font-medium italic max-w-2xl leading-relaxed border-l-2 border-[#00a6f0] pl-8">
              Aceda aos episódios exclusivos da série que está a dar que falar. O segredo está em Gaia
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link href="/gaia-play/mesa-posta">
                <button className="bg-white text-black px-12 py-5 font-black uppercase italic tracking-widest text-xs flex items-center gap-4 hover:bg-[#00a6f0] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer">
                  <Play size={20} fill="currentColor" /> Ver Agora
                </button>
              </Link>
            </div>
          </motion.div>
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
          {PROGRAMS_DATA.map((prog) => (
            <motion.div
              key={prog.id}
              layout
              whileHover={{ 
                width: "650px", // Expande a largura no hover
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
              }}
              className="relative min-w-[280px] md:min-w-[320px] h-full flex-shrink-0 cursor-pointer overflow-hidden border-x border-white/5"
            >
              <Link href={`/gaia-play/${prog.slug}`} className="block size-full relative">
                {/* Thumb Background */}
                <Image 
                  src={prog.thumb} 
                  alt={prog.title} 
                  fill 
                  className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />

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
                    <div className="overflow-hidden">
                       <motion.p 
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        className="text-[#00a6f0] text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                       >
                         {prog.category}
                       </motion.p>
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none tracking-tighter whitespace-nowrap">
                      {prog.title}
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
          
          {/* Card Final de "Explorar Mais" */}
          <div className="min-w-[300px] h-full flex items-center justify-center bg-white/5 border border-dashed border-white/10 hover:bg-[#00a6f0]/10 transition-colors">
             <div className="text-center space-y-4">
                <MonitorPlay className="mx-auto text-white/20" size={40} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] block text-white/40">Ver Tudo</span>
             </div>
          </div>
        </div>

        {/* Dica de Navegação */}
        <div className="container mx-auto px-6 mt-12 flex items-center gap-4">
           <div className="h-px w-20 bg-[#00a6f0]" />
           <span className="text-xs font-black uppercase tracking-[0.5em] text-white/40">Usa o Shift + Scroll para navegar</span>
        </div>
      </section>

      {/* 3. SECTION: THE PULSE (Exploração Sensorial) */}
      <section className="py-20 bg-[#0a0c10] relative overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-6">
          
          <div className="mb-16">
            <h2 className="text-md font-black uppercase tracking-[0.6em] text-[#00a6f0] mb-4">Gaia em Tempo Real</h2>
            <div className="h-px w-full bg-linear-to-r from-[#00a6f0] to-transparent opacity-30" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[160px]">
            
            {/* Tile 1: Grande Destaque / Citação */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="col-span-2 row-span-2 bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase text-[#00a6f0]">Trending Agora</span>
                <p className="text-2xl md:text-4xl font-black uppercase italic italic tracking-tighter mt-6 leading-none">
                  &quot;O segredo da <span className="text-transparent outline-text-vibrant">gastronomia</span> de Gaia está nas pessoas.&quot;
                </p>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="size-10 rounded-full bg-white/10" />
                <span className="text-[10px] font-bold uppercase opacity-40">Chef do Mesa Posta</span>
              </div>
              {/* Decorativo de fundo */}
              <div className="absolute -right-10 -bottom-10 text-[15rem] font-black italic opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">&quot;</div>
            </motion.div>

            {/* Tile 2: Foto de Bastidores */}
            <div className="col-span-2 row-span-3 relative group overflow-hidden border border-white/10">
              <Image 
                src="/backstage.jpg" 
                alt="Backstage" 
                fill 
                className="object-cover opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 font-black uppercase italic text-xs tracking-widest">
                #Bastidores <br /> <span className="text-[#00a6f0]">Grande Angular</span>
              </div>
            </div>

            {/* Tile 3: Estatística / Counter */}
            <div className="col-span-2 row-span-1 bg-[#00a6f0] p-6 flex items-center justify-between group cursor-help">
              <div className="space-y-1">
                <span className="text-[40px] font-black italic leading-none text-white tracking-tighter">+250k</span>
                <p className="text-[9px] font-black uppercase text-black/60 tracking-widest leading-none">Minutos de Streaming</p>
              </div>
              <Star size={32} className="text-white opacity-20 group-hover:rotate-90 transition-transform duration-500" />
            </div>

            {/* Tile 4: Pequena Curiosidade */}
            <div className="col-span-1 row-span-2 bg-zinc-900 border border-white/5 p-6 flex flex-col justify-end gap-4 hover:border-[#00a6f0]/50 transition-colors">
              <Calendar className="text-[#00a6f0]" size={20} />
              <p className="text-[10px] font-bold uppercase leading-relaxed text-white/40">
                Próximo Evento ao Vivo: <br />
                <span className="text-white font-black italic text-xs uppercase tracking-tighter">15 MAIO</span>
              </p>
            </div>

            {/* Tile 5: Minimal Play Button */}
            <div className="col-span-1 row-span-1 border border-white/10 flex items-center justify-center group hover:bg-white transition-all duration-500">
               <Play size={24} className="text-white group-hover:text-black transition-colors" fill="currentColor" />
            </div>

            {/* Tile 6: Local weather/vibe */}
            <div className="col-span-2 row-span-1 bg-zinc-900/50 border border-white/10 p-6 flex items-center gap-6">
               <div className="text-4xl font-black italic text-[#00a6f0]">18°C</div>
               <div className="h-8 w-px bg-white/10" />
               <div className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-tight">
                  Céu Limpo em <br /> Vila Nova de Gaia
               </div>
            </div>

          </div>
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