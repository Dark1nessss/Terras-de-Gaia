import React from 'react';
import { ProgramSlider } from "./programslider";
import { TVGuideGrid } from "./tvguidegrid";
import { News } from "./news"
import { ProgramsPortal } from "./program-portal";
import { getTVGuide } from '@/lib/wp';

export default async function ContentHub() {
  const programs = await getTVGuide();
  return (
    <div className="font-nurom">
      
      {/* 1. COMPONENT: A SEGUIR (Slider) */}
      <ProgramSlider initialPrograms={programs} />

      {/* 2. COMPONENT: GUIA TV (Schedule) */}
      <TVGuideGrid initialPrograms={programs} />

      {/* 3. COMPONENT: ÚLTIMAS NOTÍCIAS */}
      <News />

      {/* 4. COMPONENT: PROGRAMA EM DESTAQUE */}
      <ProgramsPortal />
    </div>
  );
}