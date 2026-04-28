"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, Activity, ShieldAlert } from 'lucide-react';

export default function LiveBroadcast() {
  return (
    <main className="bg-[#020406] min-h-screen pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header HUD */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 text-[#00a6f0] font-mono text-xs tracking-[0.3em] mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              LIVE_STREAM // SAT_CMD_04
            </div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Porto Canal Directo</h1>
          </div>
          <div className="flex gap-12 font-mono text-[10px] text-white/40">
            <div className="flex flex-col items-end">
              <span>ESPECTADORES</span>
              <span className="text-white">12,842</span>
            </div>
            <div className="flex flex-col items-end">
              <span>BITRATE</span>
              <span className="text-white text-[#00a6f0]">8.4 Mbps</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Player Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="aspect-video bg-black border border-white/10 relative overflow-hidden group">
               {/* Replace with actual Player Component */}
               <img 
                 src="https://images.unsplash.com/photo-1540747913346-19e3adbd17c3?q=80&w=2000" 
                 className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]" 
                 alt="Live Stadium"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-[#00a6f0] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#00a6f0]/20 transition-all">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                  </div>
               </div>
            </div>
            
            <div className="p-6 bg-white/[0.02] border border-white/5 font-mono text-[11px] text-white/60">
              <p className="flex items-center gap-4">
                <span className="text-[#00a6f0]">[SYSTEM]</span> 
                Sincronização de áudio estabelecida via rede neural. Streaming otimizado para 4K HDR.
              </p>
            </div>
          </div>

          {/* Sidebar: Interactive HUD */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/10 p-6">
              <h3 className="text-[10px] font-mono tracking-widest text-white/30 uppercase mb-4">Grelha de Emissão</h3>
              <div className="space-y-4">
                {[
                  { time: "18:30", title: "Flash Entrevista", active: true },
                  { time: "19:00", title: "Jornal das 7", active: false },
                  { time: "20:30", title: "Análise Tática", active: false }
                ].map((item, i) => (
                  <div key={i} className={`p-3 border-l-2 ${item.active ? 'border-[#00a6f0] bg-white/5' : 'border-white/10'}`}>
                    <div className="text-[9px] text-[#00a6f0]">{item.time}</div>
                    <div className="text-xs text-white uppercase font-bold">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}