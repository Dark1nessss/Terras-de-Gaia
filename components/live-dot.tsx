'use client';

import { useState, useEffect } from 'react';

interface LiveDotProps {
  /** 'live' = auto-check schedule (default), 'broadcast' = always blue, 'inactive' = always gray */
  variant?: 'live' | 'broadcast' | 'inactive';
  /** 'md' = size-2 (default), 'sm' = size-1.5 */
  size?: 'md' | 'sm';
  className?: string;
}

const DIAS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function todayLabel(): string {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${DIAS_PT[d.getDay()]}, ${day}/${month}`;
}

function currentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function LiveDot({ variant, size = 'md', className }: LiveDotProps) {
  // 'broadcast' and 'inactive' are always manual — no live check needed
  const isManual = variant === 'broadcast' || variant === 'inactive';
  const [liveStatus, setLiveStatus] = useState<'live' | 'inactive'>('inactive');

  useEffect(() => {
    if (isManual) return;

    async function checkLive() {
      try {
        const res = await fetch('/api/tv-guide');
        if (!res.ok) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const programs: any[] = await res.json();
        const today = todayLabel();
        const time = currentTime();
        const isLive = programs.some(
          (p) =>
            p.data_completa?.trim() === today &&
            p.hora_inicio && p.hora_fim &&
            p.hora_inicio <= time && p.hora_fim > time
        );
        setLiveStatus(isLive ? 'live' : 'inactive');
      } catch {
        // keep inactive on error
      }
    }

    checkLive();
  }, [isManual]);

  const resolved = isManual ? variant! : liveStatus;

  const color =
    resolved === 'broadcast' ? 'bg-[#00a6f0]' :
    resolved === 'inactive'  ? 'bg-white/20' :
    'bg-red-500';
  const pingColor =
    resolved === 'broadcast' ? 'bg-[#00a6f0]' :
    resolved === 'inactive'  ? '' :
    'bg-red-400';
  const glow =
    resolved === 'broadcast' ? 'shadow-[0_0_8px_rgba(0,166,240,0.8)]' :
    resolved === 'inactive'  ? '' :
    'shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  const dotSize = size === 'sm' ? 'size-1.5' : 'size-2';
  const active = resolved !== 'inactive';

  return (
    <span className={`relative flex shrink-0 ${dotSize}${className ? ` ${className}` : ''}`}>
      {active && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingColor}`} />
      )}
      <span className={`relative inline-flex h-full w-full rounded-full ${color} ${glow}`} />
    </span>
  );
}
