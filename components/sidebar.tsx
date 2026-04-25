"use client";

import { X, Trophy, Shield, Users, Newspaper, Info, Calendar, ShoppingBag, Ticket, Tv, AppWindow, ChevronRight, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { label: "Clube", icon: <Shield size={20} />, hasSub: true },
    { label: "Futebol", icon: <Trophy size={20} />, hasSub: true },
    { label: "Modalidades", icon: <Users size={20} />, hasSub: true },
    { label: "Notícias", icon: <Newspaper size={20} />, hasSub: false },
    { label: "Transparência", icon: <Info size={20} />, hasSub: false },
    { label: "Agenda", icon: <Calendar size={20} />, hasSub: false },
    { label: "Loja", icon: <ShoppingBag size={20} />, hasSub: false },
    { label: "Bilhetes", icon: <Ticket size={20} />, hasSub: false },
    { label: "Sócios", icon: <Users size={20} />, hasSub: true },
    { label: "Multimédia", icon: <Tv size={20} />, hasSub: false },
    { label: "Apps", icon: <AppWindow size={20} />, hasSub: false },
  ];

  return (
    <>
      {/* Backdrop: Matching the dialog spec opacity-32 */}
      <div 
        className={`fixed inset-0 bg-[#2c272f]/32 backdrop-blur-none z-[60] transition-opacity duration-400 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Main Sidebar: Using your exact color #2c272f and timing */}
      <aside 
        data-status={isOpen ? "open" : "closed"}
        className={`fixed top-0 left-0 z-[70] h-dvh w-[75%] md:w-full md:max-w-xs bg-[#2c272f] text-white font-nurom shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.05,0.7,0.1,1)] overflow-hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-none bg-[#2c272f]">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Jornal Diário Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </Link>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content: Using your overflow and scrollbar hidden specs */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col px-2 py-4 gap-1 pointer-events-auto">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              type="button"
              className="group relative shrink-0 flex items-center justify-between gap-2 rounded-sm px-4 py-3 text-left transition duration-300 active:scale-[0.98] enabled:cursor-pointer hover:bg-transparent"
            >
              <div className="flex items-center gap-4">
                {/* Icon Color Spec: Default #969199, Hover #00a6f0 */}
                <div className="text-[#969199] group-hover:text-[#00a6f0] transition-colors duration-300">
                  {item.icon}
                </div>

                <div className="relative">
                  <span className="font-bold uppercase text-[15px] tracking-wide">
                    {item.label}
                  </span>
                  {/* Subtle highlight bar from your screenshot */}
                  <div className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-white/10 group-hover:bg-[#00a6f0] group-hover:w-full transition-all duration-300" />
                </div>
              </div>

              {item.hasSub && (
                <ChevronRight size={16} className="text-[#969199] group-hover:text-[#00a6f0] group-hover:translate-x-1 transition-all" />
              )}
            </button>
          ))}
        </div>

        {/* Footer: Feedback Section */}
        <div className="p-6 bg-black/10 mt-auto border-t border-white/5">
          <button className="w-full flex items-center justify-start gap-4 text-white/60 hover:text-white transition-all px-2">
            <MessageSquare size={20} className="text-[#00a6f0]" />
            <span className="font-black uppercase text-xs tracking-widest border-b border-white/20 pb-1">
              Dar Feedback
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}