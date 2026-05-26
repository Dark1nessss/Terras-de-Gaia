'use client';

import { useEffect, useState } from 'react';
import {
  Sun, CloudSun, Cloud, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, CloudFog, Snowflake, ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

const IPMA_URL = 'https://www.accuweather.com/en/pt/vila-nova-de-gaia/275272/weather-forecast/275272';

const WEATHER_ICONS: Record<string, LucideIcon> = {
  'sun':             Sun,
  'cloud-sun':       CloudSun,
  'cloud':           Cloud,
  'cloud-rain':      CloudRain,
  'cloud-snow':      CloudSnow,
  'cloud-lightning': CloudLightning,
  'cloud-drizzle':   CloudDrizzle,
  'cloud-fog':       CloudFog,
  'snowflake':       Snowflake,
};

function WeatherIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Icon = WEATHER_ICONS[name] ?? Cloud;
  return <Icon size={size} className={className} />;
}

// ── Sidebar variant (news-feed) ──────────────────────────────────────────────
export function WeatherWidgetSidebar() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((d) => { if (d.temperature !== undefined) setWeather(d); })
      .catch(() => null);
  }, []);

  return (
    <a
      href={IPMA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 border border-dashed border-white/20 rounded-sm bg-white/2 hover:border-white/40 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between text-white/40 mb-2">
        <span className="text-xs font-black uppercase tracking-widest">Gaia Agora</span>
        <ArrowUpRight size={14} className="text-[#006ec2]" />
      </div>
      <div className="flex items-end gap-4">
        <div className="flex items-center gap-2">
          {weather && <WeatherIcon name={weather.icon} size={28} className="text-[#006ec2]" />}
          <span className="text-4xl text-white font-black italic leading-none">
            {weather ? `${weather.temperature}°C` : '—°C'}
          </span>
        </div>
        <div className="text-xs text-white/50 leading-tight uppercase font-bold pb-1">
          {weather ? weather.condition : 'A carregar...'}<br />Vila Nova de Gaia
        </div>
      </div>
    </a>
  );
}

// ── Tile variant (gaia-play) ─────────────────────────────────────────────────
export function WeatherWidgetTile() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then((r) => r.json())
      .then((d) => { if (d.temperature !== undefined) setWeather(d); })
      .catch(() => null);
  }, []);

  return (
    <a
      href={IPMA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-6 w-full h-full"
    >
      <div className="flex items-center gap-2">
        {weather && <WeatherIcon name={weather.icon} size={28} className="text-[#006ec2]" />}
        <span className="text-4xl font-black italic text-[#006ec2]">
          {weather ? `${weather.temperature}°C` : '—°C'}
        </span>
      </div>
      <div className="h-8 w-px bg-white/10" />
      <div className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-tight">
        {weather ? weather.condition : 'A carregar...'} em <br /> Vila Nova de Gaia
      </div>
    </a>
  );
}

