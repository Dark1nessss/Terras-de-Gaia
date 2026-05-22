"use client";
import { useState, useEffect } from "react";
import { Menu, Phone, MoreVertical } from "lucide-react";
import Sidebar from "./sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [isSolid, setIsSolid] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkStatus = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      if (pathname === "/") {
        // Home page behavior: dynamic scroll
        const heroHeight = window.innerHeight * 0.935;
        setIsSolid(currentScroll > heroHeight);
      } else {
        setIsSolid(true);
      }
    };

    checkStatus();

    window.addEventListener("scroll", checkStatus);
    return () => window.removeEventListener("scroll", checkStatus);
  }, [pathname]);

  const getNavbarStyles = () => {
    if (pathname !== "/") return "bg-[#0045ac] shadow-2xl"; // Always solid on non-home pages
    if (scrollY === 0) return "bg-transparent"; // Invisible at top
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
          className="text-white hover:text-neutral-400 p-2 rounded-full transition-colors cursor-pointer"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative shrink-0">
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
        <Link href="/contacto">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 px-5 rounded-sm border border-white/10 transition-all cursor-pointer">
            <Phone size={14} className="text-blue-300" />
            <span className="top-0.5 relative">CONTACTOS</span>
          </button>
        </Link>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </nav>
  );
}