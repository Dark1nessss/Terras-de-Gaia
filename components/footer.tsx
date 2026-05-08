"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail, 
  Phone,
  MapPin,
  ExternalLink
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/contact";
import { getCurrentYear } from "@/lib/date";

export default function Footer() {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/[0.08] text-white pt-16 pb-10 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00a6f0]/5 rounded-full filter blur-3xl opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-14">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <Image 
                src="/logo.png" 
                alt="Direto Gaia Logo" 
                width={48}
                height={48}
                className="object-contain" 
              />
              <span className="font-black text-sm uppercase tracking-wider text-white">
                Direto <span className="text-[#00a6f0]">Gaia</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              A sua estação de televisão digital, com emissões em direto, entrevistas, notícias e desporto local. Mantenha-se informado sobre o que acontece na nossa região.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#00a6f0] rounded-full"></span>
              Navegação
            </h4>
            <nav className="flex flex-col gap-2.5 pl-3 border-l border-white/5">
              <Link href="/live" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300 flex items-center justify-between group max-w-[200px]">
                <span>Emissão em Directo</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#00a6f0]" />
              </Link>
              <Link href="/programacao" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Programação
              </Link>
              <Link href="/arquivo" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Arquivo de Vídeos
              </Link>
              <Link href="/contacto" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Contactos
              </Link>
            </nav>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#00a6f0] rounded-full"></span>
              Suporte
            </h4>
            <nav className="flex flex-col gap-2.5 pl-3 border-l border-white/5">
              <Link href="/ajuda" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Centro de Ajuda
              </Link>
              <Link href="/termos" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Termos de Utilização
              </Link>
              <Link href="/privacidade" className="text-sm text-white/60 hover:text-[#00a6f0] transition-all duration-300">
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Contacts Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#00a6f0] rounded-full"></span>
              Contactos
            </h4>
            <div className="flex flex-col gap-3 pl-3 border-l border-white/5 text-white/50">
              <a href="mailto:geral@diretogaia.pt" className="flex items-center gap-2.5 text-sm hover:text-[#00a6f0] transition-all duration-200">
                <Mail size={14} className="text-[#00a6f0]" />
                <span className="underline decoration-white/20 underline-offset-4">geral@diretogaia.pt</span>
              </a>
              <a href="tel:+351220000000" className="flex items-center gap-2.5 text-sm hover:text-[#00a6f0] transition-all duration-200">
                <Phone size={14} className="text-[#00a6f0]" />
                <span>+351 220 000 000</span>
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin size={14} className="text-[#00a6f0]" />
                <span>Vila Nova de Gaia, Portugal</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/[0.03] my-8" />

        {/* Footer Bottom / Copyright and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/30 tracking-wider flex items-center gap-2 font-medium">
            &copy; {getCurrentYear()} Direto Gaia. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-3 text-white/40">
            <a href={SOCIAL_LINKS.facebook} className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:bg-[#00a6f0]/10 hover:text-[#00a6f0] hover:border-[#00a6f0]/20 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.instagram} className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:bg-[#00a6f0]/10 hover:text-[#00a6f0] hover:border-[#00a6f0]/20 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.twitter} className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:bg-[#00a6f0]/10 hover:text-[#00a6f0] hover:border-[#00a6f0]/20 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.youtube} className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.08] hover:bg-[#00a6f0]/10 hover:text-[#00a6f0] hover:border-[#00a6f0]/20 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}