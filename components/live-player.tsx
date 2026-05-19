"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_VIDEO_ID = "jfKfPfyJRdk";

const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function todayLabel(): string {
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return DIAS[d.getDay()] + ', ' + day + '/' + month;
}

function parseYouTubeId(link: string): string | null {
  if (!link) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(link)) return link;
  const m = link.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function LivePlayer({
  defaultVideoId = DEFAULT_VIDEO_ID,
  initialPrograms = [],
}: {
  defaultVideoId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPrograms?: any[];
}) {
  const [videoId, setVideoId] = useState(defaultVideoId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function applyPrograms(programs: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const now = new Date();
      const ct =
        now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0');
      const today = todayLabel();

      const live = programs.find(
        (p) =>
          p.data_completa?.trim() === today &&
          p.hora_inicio &&
          p.hora_fim &&
          p.hora_inicio <= ct &&
          p.hora_fim > ct
      );

      const id = (live?.link && parseYouTubeId(live.link)) || defaultVideoId;
      setVideoId(id);

      // Schedule auto-switch when this program ends
      if (live?.hora_fim) {
        const parts = (live.hora_fim as string).split(':').map(Number);
        const end = new Date();
        end.setHours(parts[0], parts[1], 5, 0); // 5s buffer after program end
        const ms = end.getTime() - Date.now();
        if (ms > 0) {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            fetch('/api/tv-guide')
              .then((r) => r.json())
              .then(applyPrograms)
              .catch(() => null);
          }, ms);
        }
      }
    }

    applyPrograms(initialPrograms);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [initialPrograms, defaultVideoId]);

  const src =
    'https://www.youtube.com/embed/' +
    videoId +
    '?autoplay=1&mute=0&controls=1&modestbranding=1';

  return (
    <iframe
      src={src}
      className="w-full h-full"
      allow="autoplay; fullscreen"
    />
  );
}
