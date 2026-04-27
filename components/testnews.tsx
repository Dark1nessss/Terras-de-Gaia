"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Activity, Radio, Binary, Cpu } from 'lucide-react';

const newsData = [
  { id: 1, cat: "Cultura", title: "FESTIVAL OUTONO GAIA 2026", color: "#00a6f0", icon: <Orbit />, desc: "As ruas transformam-se em galerias num evento cultural que marca o calendário local..." },
  { id: 2, cat: "Desporto", title: "DRAGÕES DOMINAM E VENCEM CLÁSSICO", color: "#1e3a8a", icon: <Activity />, desc: "Num jogo tático e intenso, a equipa local superiorou-se e garantiu a liderança..." },
  { id: 3, cat: "Cidade", title: "NOVA PONTE SOBRE O DOURO ANUNCIADA", color: "#ea6e4b", icon: <Radio />, desc: "Prevista para ligar o centro histórico a Gaia, a nova infraestrutura promete..." },
  { id: 4, cat: "Política", title: "VOTO 2026: AS DECISÕES MUNICIPAIS", color: "#ffffff", icon: <Binary />, desc: "As autárquicas aproximam-se e os candidatos revelam as suas visões para o futuro..." },
  { id: 5, cat: "Lifestyle", title: "ROTEIRO GASTRONÓMICO À BEIRA-RIO", color: "#f1b333", icon: <Cpu />, desc: "Descubra os sabores autênticos que definem a identidade culinária da região..." },
];

export default function NeuralNews() {
  const [activeTab, setActiveTab] = useState("Tudo");
  const categories = ["Tudo", "Cultura", "Desporto", "Cidade", "Lifestyle"];

  return (
    <section className="bg-[#020406] py-40 relative cursor-crosshair min-h-screen block overflow-x-hidden">
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] z-10 opacity-20" />
      
      <div className="container mx-auto px-8 relative z-20 flex flex-col lg:flex-row gap-24 items-start">
        
        {/* STICKY SIDEBAR */}
        <aside className="sticky top-20 hidden lg:flex flex-col gap-10 min-w-[240px] z-30 py-4 self-start">
          <div className="text-[#00a6f0] text-[9px] font-mono tracking-[0.5em] mb-12 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00a6f0] animate-pulse" />
            UNIDADE_GAIA // FEED
          </div>
          
          <div className="flex flex-col gap-8 border-l border-white/5 pl-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className="group flex items-center gap-4 text-left outline-none"
              >
                <div className={`h-[2px] transition-all duration-700 ease-in-out ${
                  activeTab === cat 
                    ? 'w-12 bg-[#00a6f0] shadow-[0_0_12px_#00a6f0]' 
                    : 'w-3 bg-white/10 group-hover:w-8 group-hover:bg-white/30'
                }`} />
                <span className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
                  activeTab === cat ? 'text-white translate-x-2' : 'text-white/20 hover:text-white/60'
                }`}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* ANIMATED GRID CONTAINER */}
        <motion.div 
          layout
          className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-0 min-h-[500px]"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {newsData
              .filter(item => activeTab === "Tudo" || item.cat === activeTab)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className={`relative group w-full mb-16 md:mb-32 ${
                    index % 2 !== 0 ? 'md:translate-y-24' : ''
                  }`}
                >
                  <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-md border border-white/10 p-8 transition-all duration-500 group-hover:border-[#00a6f0]/50 group-hover:bg-white/[0.05]">
                    <div className="absolute top-4 right-6 font-mono text-[8px] text-white/20 tracking-tighter">
                      LOG_REF::{item.id}00X // 2026
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-8 text-white/30 group-hover:text-[#00a6f0] transition-colors">
                        {React.cloneElement(item.icon, { size: 22, strokeWidth: 1.5 })}
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-2xl lg:text-4xl text-white font-black leading-[0.9] uppercase italic tracking-tighter group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_#00a6f0] transition-all">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4">
                           <div className="h-[1px] flex-grow bg-white/5 group-hover:bg-[#00a6f0]/30 transition-all" />
                           <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: item.color }}>
                            {item.cat}
                           </span>
                        </div>
                        <p className="text-white/40 text-xs font-serif leading-relaxed line-clamp-3 italic">
                           {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}