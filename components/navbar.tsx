"use client";
import { useState, useEffect } from "react";
import { Menu, Phone, MessageCircle, MoreVertical } from "lucide-react";
import Sidebar from "./sidebar";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isSolid, setIsSolid] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger solid state when scrolled past 93.5% of the viewport height (Hero size)
      const currentScroll = window.scrollY;
      const heroHeight = window.innerHeight * .935;

      setScrollY(currentScroll);
      setIsSolid(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavbarStyles = () => {
    if (scrollY === 0) return "bg-transparent pointer-events-none"; // Invisible at top
    if (isSolid) return "bg-[#0045ac] shadow-2xl"; // Hard Solid
    return "bg-white/5 backdrop-blur-[12px] border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"; // Glassy
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out px-4 md:px-8 py-3 flex items-center justify-between ${
        // If scrollY = 0 opacity is 0, if scrollY > 0 & isSolid is false opacity is 100 but with glassy effect, if scrollY > 0 & isSolid is true opacity is 100 with solid background
        getNavbarStyles()
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger Trigger */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex-shrink-0">
            {/* Image link sends user to the top of the page */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Jornal Diário Logo"
                width={56}
                height={56}
                  className="object-contain"
                />
              </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Improved Visuals */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="hidden xl:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-2.5 px-5 rounded-sm border border-white/10 transition-all">
          <MessageCircle size={14} className="text-blue-300" />
          DÚVIDAS? CANAL DE SUPORTE
        </button>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold py-2.5 px-5 rounded-sm border border-white/10 transition-all">
          <Phone size={14} className="text-blue-300" />
          CONTACTOS
        </button>
        <button className="text-white/50 hover:text-white p-1">
          <MoreVertical size={20} />
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  );
}