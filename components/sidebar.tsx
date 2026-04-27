"use client";

import { useState, useEffect } from "react";
import { 
  X, Trophy, Shield, Users, Newspaper, Info, Calendar, 
  ChevronRight, MessageSquare, ArrowLeft, Search, 
  MonitorPlay, Radio, BookOpen, Phone 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // State for drill-down menu
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    { label: "Pesquisa", icon: <Search size={24} />, hasSub: false },
    { label: "Programas", icon: <MonitorPlay size={24} />, hasSub: false },
    { label: "Informação", icon: <Newspaper size={24} />, hasSub: false },
    { 
      label: "Desporto", 
      icon: <Trophy size={24} />, 
      hasSub: true, 
      subItems: [
        "Futebol", "Futsal", "Andebol", "Basquetebol", "Voleibol", 
        "Ciclismo", "Hóquei", "Natação", "Desporto Adaptado", 
        "Ginástica", "Artes Marciais", "Ténis de Mesa"
      ] 
    },
    { label: "Agenda", icon: <Calendar size={24} />, hasSub: false },
    { label: "Transmissões", icon: <Radio size={24} />, hasSub: false },
    { label: "Revista Terras de Gaia", icon: <BookOpen size={24} />, hasSub: false },
    { label: "Terras de Gaia", icon: <Shield size={24} />, hasSub: false },
    { label: "Contactos", icon: <Phone size={24} />, hasSub: false },
  ];

  const handleClose = () => {
    onClose();
    // Reset submenu after the sidebar finishes its closing transition
    setTimeout(() => setActiveSubmenu(null), 400);
  };

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling and handle potential layout shift from scrollbar disappearing
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure scrolling is restored if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-400 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <aside 
      className={`fixed top-0 left-0 z-[110] h-dvh w-[85%] md:w-[320px] bg-[#2c272f] text-white font-nurom shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-none bg-[#2c272f]">
          <div className="flex items-center gap-3">
            {activeSubmenu ? (
              <button 
                onClick={() => setActiveSubmenu(null)}
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} strokeWidth={2} />
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Jornal Diário Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </Link>
            )}
            <span className="font-bold uppercase text-sm tracking-wide">
              {activeSubmenu || "Terras de Gaia"}
            </span>
          </div>
          <button onClick={handleClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Sliding Container */}
        <div className="relative flex-1 overflow-hidden">
          <div 
            className={`flex h-full w-[200%] transition-transform duration-400 ease-[cubic-bezier(0.05,0.7,0.1,1)] ${
              activeSubmenu ? "-translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* MAIN MENU LIST */}
            <div className="w-1/2 h-full overflow-y-auto scrollbar-hide flex flex-col px-2 py-4 gap-1">
              {menuItems.map((item) => (
                <button 
                  key={item.label}
                  type="button"
                  onClick={() => item.hasSub ? setActiveSubmenu(item.label) : null}
                  className="group relative shrink-0 flex items-center justify-between gap-2 rounded-sm px-4 py-3 text-left transition duration-300 active:scale-[0.98] enabled:cursor-pointer hover:bg-transparent"
                >
                  <div className="flex items-center gap-8">
                    <div className="text-[#969199] group-hover:text-[#00a6f0] transition-colors duration-300">
                      {item.icon}
                    </div>

                    <div className="relative">
                      <span className="font-bold uppercase text-[15px] tracking-wide">
                        {item.label}
                      </span>
                      <div className="absolute -bottom-1.5 left-0 w-6 h-[2px] bg-white/10 group-hover:bg-[#00a6f0] group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>

                  {item.hasSub && (
                    <ChevronRight size={16} className="text-[#969199] group-hover:text-[#00a6f0] group-hover:translate-x-1 transition-all" />
                  )}
                </button>
              ))}
            </div>

            {/* SUBMENU LIST */}
            <div className="w-1/2 h-full overflow-y-auto scrollbar-hide flex flex-col px-2 py-4 gap-1">
              {menuItems.find(m => m.label === activeSubmenu)?.subItems?.map((sub) => (
                <button 
                  key={sub}
                  className="group relative shrink-0 flex flex-col px-10 py-3 text-left transition duration-300 active:scale-[0.98]"
                >
                  {/* w-fit ensures the relative container and the absolute line stop at the end of the text */}
                  <div className="relative w-fit">
                    <span className="font-bold uppercase text-[15px] tracking-wide text-white/80 group-hover:text-[#00a6f0] transition-colors">
                      {sub}
                    </span>
                    <div className="absolute -bottom-1.5 left-0 w-6 h-[2px] bg-white/10 group-hover:bg-[#00a6f0] group-hover:w-full transition-all duration-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {!activeSubmenu && (
          <div className="p-6 bg-black/10 mt-auto border-t border-white/5">
            <button className="w-full flex items-center justify-start gap-4 text-white/60 hover:text-white transition-all px-2">
              <MessageSquare size={20} className="text-[#00a6f0]" />
              <span className="font-black uppercase text-xs tracking-widest border-b border-white/20 pb-1">
                Dar Feedback
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}