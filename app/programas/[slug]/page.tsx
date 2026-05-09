"use client";

import React, { useState } from 'react';
import { Play, ArrowLeft, Plus, Star, MonitorPlay, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareButton } from "@/components/share-button"; 

const PROGRAM_DATA = {
  title: "Peixe da Aguda",
  category: "Sociedade & Tradição",
  year: "2026",
  episodes: [
    { 
      id: 1, 
      title: "O Segredo da Francesinha", 
      duration: "24:00", 
      date: "10 Mai 2024",
      description: "Uma viagem às origens do molho mais famoso de Gaia, onde as receitas são guardadas a sete chaves pelas famílias locais.",
      thumb: "/thumb1.jpg" 
    },
    { 
      id: 2, 
      title: "As Redes da Aguda", 
      duration: "21:30", 
      date: "03 Mai 2024",
      description: "Acompanhamos a faina matinal na Aguda e o percurso do peixe desde as redes tradicionais até ao prato.",
      thumb: "/thumb2.jpg" 
    },
    { 
      id: 3, 
      title: "Gastronomia de Costa", 
      duration: "19:45", 
      date: "26 Abr 2024",
      description: "Como a proximidade ao mar molda a identidade culinária de Vila Nova de Gaia e atrai visitantes de todo o mundo.",
      thumb: "/thumb3.jpg" 
    },
    { 
      id: 4, 
      title: "Tradição em Família", 
      duration: "22:15", 
      date: "19 Abr 2024",
      description: "As histórias de quem passa o testemunho da pesca há mais de quatro gerações.",
      thumb: "/thumb1.jpg" 
    },
    { 
      id: 5, 
      title: "O Mercado Municipal", 
      duration: "25:00", 
      date: "12 Abr 2024",
      description: "As cores e os sons de um dos pontos mais emblemáticos de Vila Nova de Gaia.",
      thumb: "/thumb2.jpg" 
    }
  ]
};

export default function ProgramSlugPage() {
  const [activeEpIndex, setActiveEpIndex] = useState(0);
  const currentEp = PROGRAM_DATA.episodes[activeEpIndex];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20 overflow-x-hidden">
      
      <div className="container mx-auto px-6 md:px-12">
        
        {/* NAVEGAÇÃO & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div className="space-y-4">
            <Link href="/programas" className="group flex items-center gap-2 text-white/40 hover:text-[#00a6f0] transition-colors">
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-[0.3em] pt-[2px]">Explorar Programas</span>
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              {PROGRAM_DATA.title.split(' ')[0]} <br />
              <span className="text-transparent outline-text-vibrant">
                {PROGRAM_DATA.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <ShareButton title={PROGRAM_DATA.title} />
          </div>
        </div>

        {/* CINEMA BLOCK (PLAYER + SIDEBAR) */}
        <div className="flex flex-col lg:flex-row bg-[#0a0c10] border border-white/10 shadow-3xl overflow-hidden lg:max-h-[600px]">
          
          {/* LADO ESQUERDO: VIDEO AREA */}
          <div className="lg:w-[72%] relative aspect-video bg-black group flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentEp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image 
                  src={currentEp.thumb} 
                  alt={currentEp.title} 
                  fill 
                  className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="size-20 md:size-28 bg-[#00a6f0] text-white flex items-center justify-center shadow-[0_0_50px_rgba(0,166,240,0.3)]"
                  >
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </motion.button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-linear-to-t from-black via-black/80 to-transparent">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-2 py-0.5 bg-[#00a6f0] text-white text-sm font-black uppercase tracking-tighter">HD 4K</span>
                    <span className="text-md font-black text-white/40 uppercase tracking-widest italic">S01 : EP0{activeEpIndex + 1}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{currentEp.title}</h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LADO DIREITO: EPISODE LIST (FIXED SCROLL) */}
          <div className="lg:w-[28%] bg-[#08090b] border-l border-white/10 flex flex-col min-h-[400px] lg:min-h-0">
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MonitorPlay size={14} className="text-[#00a6f0]" /> Próximos
              </h3>
              <span className="text-sm font-black text-white/40">{PROGRAM_DATA.episodes.length} EP</span>
            </div>
            
            {/* ESTA É A PARTE DO SCROLL */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
              {PROGRAM_DATA.episodes.map((ep, idx) => (
                <button 
                  key={ep.id}
                  onClick={() => setActiveEpIndex(idx)}
                  className={`w-full flex flex-col gap-1 p-6 transition-all border-b border-white/5 text-left relative cursor-pointer
                    ${activeEpIndex === idx 
                      ? 'bg-[#00a6f0]/10 border-l-4 border-l-[#00a6f0]' 
                      : 'hover:bg-white/5 border-l-4 border-l-transparent'}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black uppercase tracking-widest ${activeEpIndex === idx ? 'text-[#00a6f0]' : 'text-white/40'}`}>
                      EP 0{idx + 1}
                    </span>
                    {activeEpIndex === idx && <div className="h-1 w-8 bg-[#00a6f0] animate-pulse" />}
                  </div>
                  <h4 className={`text-sm font-black uppercase tracking-tight leading-tight ${activeEpIndex === idx ? 'text-white' : 'text-white/70'}`}>
                    {ep.title}
                  </h4>
                  <span className="text-sm font-bold text-white/40 mt-1 uppercase italic">{ep.duration}</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-black border-t border-white/5 hidden lg:block flex-shrink-0">
               <p className="text-xs font-bold text-white/40 uppercase">Terras de Gaia © {PROGRAM_DATA.year}</p>
            </div>
          </div>
        </div>

        {/* INFO BAR CONTEXTUAL */}
        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-8 gap-x-12 py-8 border-y border-white/5">
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Ano</span>
               <span className="text-sm font-bold">{PROGRAM_DATA.year}</span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:border-none md:pl-0">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Género</span>
               <span className="text-sm font-bold uppercase tracking-tighter">{PROGRAM_DATA.category}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Duração Média</span>
               <span className="text-sm font-bold uppercase tracking-tighter">22 min</span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:text-right md:border-none md:pl-0">
               <span className="text-sm font-black text-[#00a6f0] uppercase tracking-[0.2em] mb-1">Exibição Original</span>
               <span className="text-sm font-bold italic">Sextas às 21:00</span>
             </div>
          </div>

          <div className="max-w-4xl mt-12 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#00a6f0]">Sobre o Episódio</h3>
            <p className="text-xl md:text-3xl text-white/60 font-medium italic leading-[1.3] tracking-tight">
              {currentEp.description}
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        .outline-text-vibrant {
          -webkit-text-stroke: 1.5px #00a6f0;
          text-shadow: 0 0 30px rgba(0,166,240,0.1);
        }
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00a6f0; border-radius: 10px; }
      `}</style>
    </main>
  );
}