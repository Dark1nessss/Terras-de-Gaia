import React from 'react';
import { ChevronRight, Calendar, Clock, PlayCircle } from 'lucide-react';
import { ProgramSlider } from "./programslider";
import { TVGuideGrid } from "./tvguidegrid";
import { News } from "./news"

export default function ContentHub() {
  return (
    <div className="font-nurom">
      
      {/* 1. COMPONENT: A SEGUIR (Slider) */}
      <ProgramSlider />

      {/* 2. COMPONENT: GUIA TV (Schedule) */}
      <TVGuideGrid />

      {/* 3. COMPONENT: ÚLTIMAS NOTÍCIAS */}
      <News />
    </div>
  );
}