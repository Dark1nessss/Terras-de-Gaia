"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Mic2, Headphones, SkipForward } from 'lucide-react';

const PODCASTS = [
  {
    id: 1,
    title: "O Futuro da Linha Rubi",
    host: "Carlos Bento",
    duration: "24:15",
    tags: ["Mobilidade", "Entrevista"],
    active: true
  },
  {
    id: 2,
    title: "Cultura em Gaia: O que mudou?",
    host: "Ana Silva",
    duration: "18:40",
    tags: ["Cultura", "Debate"],
    active: false
  }
];

export function GaiaWaves() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(PODCASTS[0]);

  return (
    <section className="py-24 bg-[#0a0c10] font-nurom overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LADO ESQUERDO: BRANDING E LISTA */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="flex items-center gap-3 text-[#00a6f0] text-xs font-black uppercase tracking-[0.4em]">
                <Mic2 size={16} />
                Original Podcast
              </span>
              <h2 className="text-6xl md:text-7xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
                GAIA <br />
                <span className="text-transparent border-text-blue outline-text-vibrant">WAVES</span>
              </h2>
            </div>

            <div className="space-y-3">
              {PODCASTS.map((pod) => (
                <button
                  key={pod.id}
                  onClick={() => setCurrentTrack(pod)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border cursor-pointer ${
                    currentTrack.id === pod.id 
                    ? 'bg-[#00a6f0]/10 border-[#00a6f0]/30 text-white' 
                    : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`size-10 rounded-lg flex items-center justify-center ${currentTrack.id === pod.id ? 'bg-[#00a6f0] text-white' : 'bg-white/10'}`}>
                      <Headphones size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase italic tracking-tight">{pod.title}</h4>
                      <p className="text-[10px] uppercase opacity-60 tracking-widest">{pod.host}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold">{pod.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: O PLAYER VISUAL */}
          <div className="lg:col-span-7">
            <div className="relative p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden group">
              
              {/* Background Glow Dinâmico */}
              <div className={`absolute -top-24 -right-24 size-64 bg-[#00a6f0]/20 blur-[100px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-40'}`} />

              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                
                {/* Visualizador de Onda Sonora (Waveform) */}
                <div className="h-32 flex items-center gap-1.5 w-full justify-center">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isPlaying ? [20, Math.random() * 80 + 20, 20] : 15 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 + Math.random() * 0.5,
                        ease: "easeInOut" 
                      }}
                      className={`w-1.5 rounded-full ${isPlaying ? 'bg-[#00a6f0]' : 'bg-white/10'}`}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <motion.h3 
                    key={currentTrack.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-tighter"
                  >
                    {currentTrack.title}
                  </motion.h3>
                  <p className="text-[#00a6f0] text-xs font-black uppercase tracking-[0.3em]">
                    Com {currentTrack.host}
                  </p>
                </div>

                {/* Controlos do Player */}
                <div className="flex items-center gap-8 pt-4">
                  <button className="text-white/20 hover:text-white transition-colors cursor-pointer">
                    <SkipForward size={24} className="rotate-180" />
                  </button>

                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="size-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.15)] cursor-pointer"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                  </button>

                  <button className="text-white/20 hover:text-white transition-colors cursor-pointer">
                    <SkipForward size={24} />
                  </button>
                </div>

                {/* Barra de Progresso Subtil */}
                <div className="w-full space-y-2 cursor-pointer">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: isPlaying ? "45%" : "45%" }}
                      className="h-full bg-[#00a6f0]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <span>10:42</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Extra */}
            <div className="mt-8 flex justify-center gap-6">
               <span className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                 <Volume2 size={14} /> Disponível no Spotify & Apple Podcasts
               </span>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .outline-text-vibrant {
          -webkit-text-stroke: 1.5px #00a6f0;
          text-shadow: 0 0 30px rgba(0,166,240,0.2);
        }
      `}</style>
    </section>
  );
}