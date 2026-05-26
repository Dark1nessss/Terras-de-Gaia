"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SeasonSelectorProps {
  seasons: Array<{ numero_temporada: number; descricao_temporada: string }>;
  activeSeason: number;
  onSeasonChange: (seasonIndex: number) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  activeSeason,
  onSeasonChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentSeason = seasons[activeSeason];

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.06] text-white text-sm font-black uppercase tracking-wider rounded-lg border border-white/20 hover:border-[#006ec2]/50 focus:border-[#006ec2] focus:outline-none focus:ring-2 focus:ring-[#006ec2]/30 transition-colors cursor-pointer"
      >
        <span className="flex-1 text-left truncate">
          T{(activeSeason + 1).toString().padStart(2, '0')} — {currentSeason?.descricao_temporada}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 ml-2 text-[#006ec2] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0a0c10] border border-white/20 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {seasons.map((season, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSeasonChange(idx);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-wider transition-colors border-b border-white/5 last:border-b-0 cursor-pointer ${
                  activeSeason === idx
                    ? 'bg-[#006ec2]/10 text-[#006ec2] border-l-4 border-l-[#006ec2]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-l-transparent'
                }`}
              >
                <span className="text-xs font-black text-[#006ec2]">
                  T{(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="truncate">{season.descricao_temporada}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
