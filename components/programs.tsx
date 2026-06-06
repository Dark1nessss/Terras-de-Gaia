import React from 'react';
import { ProgramSlider } from "./programslider";
import { TVGuideGrid } from "./tvguidegrid";
import { News } from "./news"
import { ProgramsPortal } from "./program-portal";
import { GaiaWaves } from "./test";
import { AdPlaceholder } from "./ad-placeholder";
import { getTVGuide } from '@/lib/wp';
import PlaylistArchiveSection from './playlist-archive-section';

export const dynamic = "force-dynamic";

export default async function ContentHub() {
  const programs = await getTVGuide();
  return (
    <div className="font-nurom">
      
      {/* 1. COMPONENT: A SEGUIR (Slider) */}
      <ProgramSlider initialPrograms={programs} />
      <AdPlaceholder position="inline" />

      {/* 2. COMPONENT: GUIA TV (Schedule) */}
      <TVGuideGrid initialPrograms={programs} />

      {/* 3. COMPONENT: ÚLTIMAS NOTÍCIAS */}
      <News />

      {/* 4. COMPONENT: VOZ DE GAIA CURRENTLY NOT AVAILABLE*/}
      {/* <GaiaWaves /> */}

      {/* 5. COMPONENT: PROGRAMA EM DESTAQUE */}
      <AdPlaceholder position="inline" />
      <ProgramsPortal />

      {/* 6. COMPONENT: GAIA PLAY (Playlist Archive) */}
      <PlaylistArchiveSection />
    </div>
  );
}