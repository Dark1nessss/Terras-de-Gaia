import { Tv, Calendar } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { LivePlayer } from "@/components/live-player";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { LiveDot } from "@/components/live-dot";
import { formatDate } from "@/lib/date";
import { getTVGuide } from "@/lib/wp";
import { buildServerLivestreamEmbedUrl } from "@/lib/bunny";

export const revalidate = 300;

const DIAS_PT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function todayLabel(): string {
  const d = new Date();
  const dayName = DIAS_PT[d.getDay()];
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return dayName + ', ' + day + '/' + month;
}

export default async function LivePage() {
  const programs = await getTVGuide();
  const livestreamEmbedUrl = buildServerLivestreamEmbedUrl();
  const today = todayLabel();
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todayPrograms = (programs as any[])
    .filter((p) => p.data_completa?.trim() === today)
    .sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));
  const liveNow = todayPrograms.find((p) =>
    p.hora_inicio && p.hora_fim && p.hora_inicio <= currentTime && p.hora_fim > currentTime
  );

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24 pb-12">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[#006ec2] text-xs font-black uppercase tracking-widest mt-0.5 ml-2 lg:ml-3">Em Direto</span>
              <LiveDot />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Terras de Gaia <span className="text-[#006ec2]">TV</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{formatDate(new Date(), "full")}</p>
          </div>
        </div>

        {/* Main Theater Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Video Player */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative aspect-video bg-black shadow-2xl border border-white/5 overflow-hidden group">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <LivePlayer initialPrograms={programs as any[]} livestreamEmbedUrl={livestreamEmbedUrl} />
              <div className="absolute top-4 left-4">
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 rounded flex items-center gap-2">
                    <Tv size={14} className="text-[#006ec2]" />
                    <span className="text-xs font-black uppercase italic mt-1">
                      {liveNow?.title ?? 'Canal Principal'}
                    </span>
                 </div>
              </div>
            </div>
            
            {/* Live Description Block */}
            <div className="mt-6 p-6 md:p-8 bg-white/2 border border-white/5 rounded-sm flex-1">
              <h2 className="text-xl md:text-2xl font-black uppercase italic mb-4">
                {liveNow?.title ?? 'Em Emissão'}
              </h2>
              {liveNow?.description ? (
                <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-3xl mb-6">
                  {liveNow.description.replace(/<[^>]*>/g, '').trim().slice(0, 280)}
                </p>
              ) : (
                <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-3xl mb-6">
                  Acompanhe a emissão ao vivo da Terras de Gaia TV.
                </p>
              )}
              <ShareButton title={liveNow?.title ?? 'Terras de Gaia TV — Em Direto'} />
            </div>

            {/* Ad Inline - Below description with margin */}
            <div className="mt-6">
              <AdPlaceholder position="inline" />
            </div>
          </div>

          {/* RIGHT: Schedule Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-0 h-fit lg:sticky lg:top-24">
            
            {/* Header */}
            <div className="bg-[#006ec2] p-4 md:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-white" />
                <span className="font-black uppercase italic tracking-tighter text-sm md:text-base">Programação</span>
              </div>
              <span className="text-xs font-bold opacity-80 uppercase">Hoje</span>
            </div>

            {/* Schedule: Scrollable Container */}
            <div className="bg-black/20 border border-white/5 border-t-0 overflow-y-auto max-h-96 lg:max-h-[calc(100vh-10rem)] scrollbar-thin">
              {todayPrograms.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-white/30 text-xs italic">Sem programação disponível para hoje</p>
                </div>
              ) : todayPrograms.map((item, idx: number) => {
                const isActive = !!(item.hora_inicio && item.hora_fim && item.hora_inicio <= currentTime && item.hora_fim > currentTime);
                return (
                  <div
                    key={idx}
                    className={'group px-4 md:px-5 py-4 md:py-5 border-b border-white/5 transition-all duration-300 hover:bg-white/3' + (isActive ? ' bg-white/5 border-l-4 border-l-[#006ec2] pl-3 md:pl-4' : '')}
                  >
                    <div className="flex items-center gap-3">
                      <span className={'text-xs font-black italic whitespace-nowrap ' + (isActive ? 'text-[#006ec2]' : 'text-white/30')}>
                        {item.time}
                      </span>
                      <p className={'text-sm font-black uppercase tracking-tight italic line-clamp-1 flex-1 ' + (isActive ? 'text-white' : 'text-white/60 group-hover:text-white')}>
                        {item.title}
                      </p>
                      {isActive && (
                        <span className="text-xs font-black uppercase text-[#006ec2] animate-pulse whitespace-nowrap shrink-0 ml-2">
                          Agora
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}