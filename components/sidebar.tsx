"use client";

import { useState, useEffect } from "react";
import { 
  X, Trophy, Shield, Newspaper, Calendar, 
  ChevronRight, MessageSquare, ArrowLeft, Radio, BookOpen, Phone, 
  Tv, Home
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  hasSub: boolean;
  path?: string;
  subItems?: string[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Início",
      icon: <Home size={24} />,
      hasSub: false,
      path: "/"
    },
    { 
      label: "Informação", 
      icon: <Newspaper size={24} />, 
      hasSub: true,
      path: "/categoria/informacao",
      subItems: [
        "Política", "Saúde", "Espaço Cidadão", "Música",
        "Empresas e Empreendedorismo", "Lazer", "Multimédia e Informática",
        "Acidentes e Socorro", "Água e Energia", "Alimentação e Agricultura"
      ]
    },
    { 
      label: "Desporto", 
      icon: <Trophy size={24} />, 
      hasSub: true,
      path: "/desporto",
      subItems: [
        "Futebol", "Futsal", "Andebol", "Basquetebol", "Voleibol", 
        "Ciclismo", "Hóquei", "Natação", "Desporto Adaptado", 
        "Ginástica", "Artes Marciais", "Ténis de Mesa"
      ] 
    },
    { label: "Transmissões", icon: <Radio size={24} />, hasSub: false, path: "/live" },
    { label: "Programação", icon: <Calendar size={24} />, hasSub: false, path: "/programacao" },
    { label: "Gaia Play", icon: <Tv size={24} />, hasSub: false, path: "/gaia-play" },
    { label: "Jornal Digital", icon: <BookOpen size={24} />, hasSub: false, path: "/revista" },
    { label: "Sobre Nós", icon: <Shield size={24} />, hasSub: false, path: "/sobre-nos" },
    { label: "Contactos", icon: <Phone size={24} />, hasSub: false, path: "/contacto" },
    { label: "Torne-se Parceiro TG", icon: <MessageSquare size={24} />, hasSub: false, path: "/vira-parceiro" },
  ];

  const handleClose = () => {
    onClose();
    setTimeout(() => setActiveSubmenu(null), 400);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const getSubItems = (label: string) => {
    const item = menuItems.find(m => m.label === label);
    return item?.subItems || [];
  };

  const getSubLink = (menu: string, sub: string) => {
    const slug = sub.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');

    if (menu === "Desporto") {
      return `/desporto/${slug}`;
    }
    
    return `/categoria/${slug}`;
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-100 transition-opacity duration-400 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <aside 
        className={`fixed top-0 left-0 z-110 h-dvh w-[85%] md:w-[320px] bg-[#2c272f] text-white font-nurom shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-none bg-[#2c272f]">
          <div className="flex items-center gap-3">
            {activeSubmenu ? (
              <button onClick={() => setActiveSubmenu(null)} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors cursor-pointer">
                <ArrowLeft size={24} strokeWidth={2} />
              </button>
            ) : (
              <Link href="/" onClick={handleClose} className="flex items-center gap-3">
                <Image src="/logo-tg.png" alt="Logo" width={48} height={48} className="object-contain" />
              </Link>
            )}
            <span className="font-bold uppercase text-sm tracking-wide mt-1.5">{activeSubmenu || "Terras de Gaia"}</span>
          </div>
          <button onClick={handleClose} className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer">
            <X size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Main Menu */}
        <div className="relative flex-1 overflow-hidden">
          <div className={`flex h-full w-[200%] transition-transform duration-400 ease-[cubic-bezier(0.05,0.7,0.1,1)] ${activeSubmenu ? "-translate-x-1/2" : "translate-x-0"}`}>
            
            {/* MAIN MENU LIST */}
            <div className="w-1/2 h-full overflow-y-auto scrollbar-hide flex flex-col px-2 py-4 gap-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.hasSub ? (
                    item.path ? (
                      <div className="group relative w-full flex items-center rounded-sm overflow-hidden transition duration-300">
                        {/* Main link — navigates to the category page */}
                        <Link
                          href={item.path}
                          onClick={handleClose}
                          className="flex items-center gap-8 flex-1 px-4 py-3 active:scale-[0.98]"
                        >
                          <div className="text-[#969199] group-hover:text-[#006ec2] transition-colors shrink-0">{item.icon}</div>
                          <div className="relative">
                            <span className="font-bold uppercase text-[15px] tracking-wide">{item.label}</span>
                            <div className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-white/10 group-hover:bg-[#006ec2] group-hover:w-full transition-all duration-300" />
                          </div>
                        </Link>
                        {/* Divider */}
                        <div className="w-px h-10 bg-white/10 shrink-0" />
                        {/* Submenu trigger — clearly labelled */}
                        <button
                          onClick={() => setActiveSubmenu(item.label)}
                          className="flex items-center gap-1 px-3 py-3 shrink-0 text-[#969199] hover:text-[#006ec2] hover:bg-white/5 transition-all cursor-pointer"
                          title="Ver subcategorias"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none">ver mais</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    ) : (
                    <button 
                      onClick={() => setActiveSubmenu(item.label)}
                      className="group relative w-full flex items-center justify-between gap-2 rounded-sm px-4 py-3 text-left transition duration-300 active:scale-[0.98] cursor-pointer"
                    >
                      <div className="flex items-center gap-8">
                        <div className="text-[#969199] group-hover:text-[#006ec2] transition-colors">{item.icon}</div>
                        <div className="relative">
                          <span className="font-bold uppercase text-[15px] tracking-wide">{item.label}</span>
                          <div className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-white/10 group-hover:bg-[#006ec2] group-hover:w-full transition-all duration-300" />
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#969199] group-hover:text-[#006ec2] group-hover:translate-x-1 transition-all" />
                    </button>
                    )
                  ) : (
                    <Link 
                      href={item.path || "#"}
                      onClick={handleClose}
                      className="group relative flex items-center justify-between gap-2 rounded-sm px-4 py-3 text-left transition duration-300 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-8">
                        <div className="text-[#969199] group-hover:text-[#006ec2] transition-colors">{item.icon}</div>
                        <div className="relative">
                          <span className="font-bold uppercase text-[15px] tracking-wide">{item.label}</span>
                          <div className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-white/10 group-hover:bg-[#006ec2] group-hover:w-full transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* SUBMENU LIST */}
            <div className="w-1/2 h-full overflow-y-auto scrollbar-hide flex flex-col px-2 py-4 gap-1">
              {getSubItems(activeSubmenu || "").map((sub) => (
                <Link 
                  key={sub}
                  href={getSubLink(activeSubmenu || "", sub)}
                  onClick={handleClose}
                  className="group relative flex flex-col px-10 py-3 text-left transition duration-300 active:scale-[0.98]"
                >
                  <div className="relative w-fit">
                    <span className="font-bold uppercase text-[15px] tracking-wide text-white/80 group-hover:text-[#006ec2] transition-colors">{sub}</span>
                    <div className="absolute -bottom-1.5 left-0 w-6 h-0.5 bg-white/10 group-hover:bg-[#006ec2] group-hover:w-full transition-all duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}