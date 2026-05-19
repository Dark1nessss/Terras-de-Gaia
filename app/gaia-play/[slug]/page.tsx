"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft, Plus, Star, MonitorPlay, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareButton } from "@/components/share-button";
import { SeasonSelector } from "@/components/season-selector";
import { cleanText } from "@/lib/decode-html";
import { formatExibicao, formatYear } from "@/lib/date";
import type { Program, Season } from '@/lib/programas';

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  try {
    // Handle youtu.be/xxx format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return videoId;
    }
    // Handle youtube.com/watch?v=xxx format
    if (url.includes('youtube.com/watch')) {
      const params = new URL(url).searchParams;
      return params.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

export default function ProgramSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [activeEpIndex, setActiveEpIndex] = useState(0);
  const [activeSeason, setActiveSeason] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        const response = await fetch(`/api/programs?slug=${slug}`);
        const data = await response.json();
        console.log('[PAGE] Program data:', data);
        console.log('[PAGE] ACF data:', data?.acf);
        console.log('[PAGE] ano_lancamento raw:', data?.acf?.ano_lancamento, typeof data?.acf?.ano_lancamento);
        console.log('[PAGE] exibicao_original raw:', data?.acf?.exibicao_original, typeof data?.acf?.exibicao_original);
        setProgram(data || null);
      } catch (error) {
        console.error('Error fetching program:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgram();
  }, [slug]);

  // Get all episodes from all seasons
  const allEpisodes = program?.temporadas?.flatMap(season => 
    season.episodios?.map(ep => ({
      ...ep,
      season_num: season.numero_temporada,
      season_title: season.descricao_temporada
    })) || []
  ) || [];

  // Get episodes for active season
  const currentSeasonEpisodes = program?.temporadas?.[activeSeason]?.episodios || [];
  const currentEp = currentSeasonEpisodes[activeEpIndex];
  const currentVideoId = currentEp?.link ? getYouTubeVideoId(currentEp.link) : null;

  // Handle episode click - update episode index for current season
  const handleEpisodeClick = (episode: any) => {
    // Find the index only within the CURRENT season
    const epIdx = currentSeasonEpisodes.findIndex(ep => ep.numero === episode.numero) || 0;
    setActiveEpIndex(epIdx);
  };

  if (isLoading || !program) {
    return (
      <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-center h-96">
          <p className="text-white/40">{isLoading ? 'Carregando programa...' : 'Programa não encontrado'}</p>
        </div>
      </main>
    );
  }

  if (!program.title?.rendered) {
    return (
      <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-center h-96">
          <p className="text-white/40">Erro ao carregar dados do programa</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white font-nurom pt-28 pb-20 overflow-x-hidden">
      
      <div className="container mx-auto px-6 md:px-12">
        
        {/* NAVEGAÇÃO & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
          <div className="space-y-4">
            <Link href="/gaia-play" className="group flex items-center gap-2 text-white/40 hover:text-[#00a6f0] transition-colors">
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-[0.3em] pt-[2px]">Explorar Programas</span>
            </Link>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              {program.title.rendered.split(' ')[0]} <br />
              <span className="text-transparent outline-text-vibrant">
                {program.title.rendered.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <ShareButton title={program.title.rendered} season={currentEp?.season_num} episode={currentEp?.numero} />
          </div>
        </div>

        {/* CINEMA BLOCK (PLAYER + SIDEBAR) */}
        <div className="flex flex-col lg:flex-row bg-[#0a0c10] border border-white/10 shadow-3xl overflow-hidden lg:max-h-[600px]">
          
          {/* LADO ESQUERDO: VIDEO AREA */}
          <div className="lg:w-[72%] relative aspect-video bg-black group flex-shrink-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${currentEp?.numero}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {currentVideoId ? (
                  <iframe
                    key={`${activeSeason}-${currentEp?.numero}`}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentVideoId}?modestbranding=1&rel=0&controls=1`}
                    title={currentEp?.titulo}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    {program.featured_image_url ? (
                      <Image 
                        src={program.featured_image_url} 
                        alt={program.title.rendered} 
                        fill 
                        className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00a6f0]/20 to-[#0a0c10] opacity-50" />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Play size={40} className="mx-auto text-white/40" />
                        <p className="text-white/40 text-sm">Nenhum vídeo disponível</p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-linear-to-t from-black via-black/80 to-transparent">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-2 py-0.5 bg-[#00a6f0] text-white text-sm font-black uppercase tracking-tighter">HD 4K</span>
                        <span className="text-md font-black text-white/40 uppercase tracking-widest italic">S{(activeSeason + 1).toString().padStart(2, '0')} : EP{currentEp?.numero?.toString().padStart(2, '0')}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{currentEp?.titulo}</h2>
                    </div>
                  </>
                )}

                {currentVideoId && (
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-2 py-0.5 bg-[#00a6f0] text-white text-sm font-black uppercase tracking-tighter">HD 4K</span>
                      <span className="text-md font-black text-white/40 uppercase tracking-widest italic">S{(activeSeason + 1).toString().padStart(2, '0')} : EP{currentEp?.numero?.toString().padStart(2, '0')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{currentEp?.titulo}</h2>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* LADO DIREITO: EPISODE LIST (FIXED SCROLL) */}
          <div className="lg:w-[28%] bg-[#08090b] border-l border-white/10 flex flex-col min-h-[400px] lg:min-h-0">
            {/* Season Selector */}
            {program.temporadas && program.temporadas.length > 0 && (
              <div className="p-5 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/10 flex-shrink-0">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-[#00a6f0] block mb-3">Temporadas</label>
                <SeasonSelector
                  seasons={program.temporadas}
                  activeSeason={activeSeason}
                  onSeasonChange={(seasonIdx) => {
                    setActiveSeason(seasonIdx);
                    setActiveEpIndex(0);
                  }}
                />
              </div>
            )}
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <MonitorPlay size={14} className="text-[#00a6f0]" /> Episódios
              </h3>
              <span className="text-sm font-black text-white/40">{currentSeasonEpisodes.length} EP</span>
            </div>
            
            {/* LISTA DE EPISÓDIOS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
              {currentSeasonEpisodes.map((ep, idx) => (
                <button 
                  key={`${ep.numero}`}
                  onClick={() => handleEpisodeClick(ep)}
                  className={`w-full flex flex-col gap-1 p-6 transition-all border-b border-white/5 text-left relative cursor-pointer group
                    ${activeEpIndex === idx
                      ? 'bg-[#00a6f0]/10 border-l-4 border-l-[#00a6f0]' 
                      : 'hover:bg-white/10 border-l-4 border-l-transparent group-hover:border-l-[#00a6f0]/50'}
                  `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black uppercase tracking-widest transition-colors ${activeEpIndex === idx ? 'text-[#00a6f0]' : 'text-white/40 group-hover:text-white/70'}`}>
                      EP {ep.numero?.toString().padStart(2, '0')}
                    </span>
                    {activeEpIndex === idx && <div className="h-1 w-8 bg-[#00a6f0] animate-pulse" />}
                  </div>
                  <h4 className={`text-sm font-black uppercase tracking-tight leading-tight transition-colors ${activeEpIndex === idx ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {ep.titulo}
                  </h4>
                  <span className="text-sm font-bold text-white/40 mt-1 uppercase italic">{ep.duracao || 0}m</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-black border-t border-white/5 hidden lg:block flex-shrink-0">
               <p className="text-xs font-bold text-white/40 uppercase">Terras de Gaia © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* INFO BAR CONTEXTUAL */}
        <div className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-8 gap-x-12 py-8 border-y border-white/5">
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Ano</span>
               <span className="text-sm font-bold">{formatYear(program.acf?.ano_lancamento)}</span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:border-none md:pl-0">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Género</span>
               <span className="text-sm font-bold uppercase tracking-tighter">{program.acf?.categoria_programa || "Geral"}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-1">Duração Média</span>
               <span className="text-sm font-bold uppercase tracking-tighter">
                 {allEpisodes.length > 0 
                   ? Math.round(allEpisodes.reduce((acc, ep) => acc + (ep.duracao || 0), 0) / allEpisodes.length) 
                   : 0} min
               </span>
             </div>
             <div className="flex flex-col border-l border-white/5 pl-8 md:text-right md:border-none md:pl-0">
               <span className="text-sm font-black text-[#00a6f0] uppercase tracking-[0.2em] mb-1">Exibição Original</span>
               <span className="text-sm font-bold italic">{formatExibicao(program.acf?.exibicao_original) || "Não especificado"}</span>
             </div>
          </div>

          <div className="max-w-4xl mt-12 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#00a6f0]">Sobre o Programa</h3>
            <p className="text-xl md:text-3xl text-white/60 font-medium italic leading-[1.3] tracking-tight">
              {cleanText(program.excerpt.rendered)}
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