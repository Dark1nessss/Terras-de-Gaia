"use client";

import React from "react";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { CONTACT_INFO, OFFICIAL_PROFILES } from "@/lib/contact";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-32 pb-20 font-nurom overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Kinetic Header */}
        <div className="relative mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#00a6f0] text-xs font-black uppercase tracking-[0.8em] mb-5 block"
          >
            Digital Directory {new Date().getFullYear()}
          </motion.span>
          <h1 className="text-8xl md:text-[12rem] font-black uppercase italic leading-[0.7] tracking-tighter">
            FALE <br /> 
            <span className="text-white/5 outline-text ml-20">CONNOSCO</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-12">
          
          {/* Left Side: Editorial Contacts */}
          <div className="lg:col-span-4 space-y-12">
            <a href={`mailto:${CONTACT_INFO.email}`} className="group cursor-pointer">
              <p className="text-[#00a6f0] text-[10px] font-black uppercase tracking-widest mb-4">Redação e Geral</p>
              <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6 group-hover:border-[#00a6f0] transition-colors">
                <Mail className="text-white/20 group-hover:text-[#00a6f0]" size={20} />
                <span className="text-2xl font-bold italic uppercase tracking-tighter group-hover:pl-2 transition-all">
                  {CONTACT_INFO.email}
                </span>
              </div>
            </a>

            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="group cursor-pointer">
              <p className="text-[#00a6f0] text-[10px] font-black uppercase tracking-widest mb-4">Linha Direta</p>
              <div className="flex items-center gap-4 border-b border-white/5 pb-6 group-hover:border-[#00a6f0] transition-colors">
                <Phone className="text-white/20 group-hover:text-[#00a6f0]" size={20} />
                <span className="text-2xl font-bold italic uppercase tracking-tighter group-hover:pl-2 transition-all">
                  {CONTACT_INFO.phone}
                </span>
              </div>
            </a>
          </div>

          {/* Right Side: The Big Social List (SVG Focus) */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
              
              {/* Instagram Row */}
              <a href={OFFICIAL_PROFILES.instagram} target="_blank" className="group relative py-10 border-b border-white/5 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                  <span className="text-white/10 group-hover:text-[#00a6f0] font-black italic text-2xl transition-colors">01</span>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                    Instagram
                  </h2>
                </div>
                <div className="flex items-center gap-4 relative z-10 group-hover:-translate-x-4 transition-transform duration-500">
                   <span className="hidden md:block text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Seguir @TerrasdeGaia</span>
                   <div className="p-4 bg-white/5 rounded-full group-hover:bg-[#00a6f0] transition-colors">
                      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                   </div>
                </div>
                {/* Background SVG Ghost Logo */}
                <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-[30%] opacity-[0.02] group-hover:opacity-10 group-hover:-translate-x-10 transition-all duration-700 fill-white" viewBox="0 0 24 24">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook Row */}
              <a href={OFFICIAL_PROFILES.facebook} target="_blank" className="group relative py-10 border-b border-white/5 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                  <span className="text-white/10 group-hover:text-[#00a6f0] font-black italic text-2xl transition-colors">02</span>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                    Facebook
                  </h2>
                </div>
                <div className="flex items-center gap-4 relative z-10 group-hover:-translate-x-4 transition-transform duration-500">
                  <span className="hidden md:block text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Seguir @TerrasdeGaia</span>
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-[#0045ac] transition-colors relative z-10">
                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </div>
                </div>
                <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-[30%] opacity-[0.02] group-hover:opacity-10 group-hover:-translate-x-10 transition-all duration-700 fill-white" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>

              {/* YouTube Row */}
              <a href={OFFICIAL_PROFILES.youtube} target="_blank" rel="noopener noreferrer" className="group relative py-10 border-b border-white/5 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                  <span className="text-white/10 group-hover:text-[#00a6f0] font-black italic text-2xl transition-colors">03</span>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                    YouTube
                  </h2>
                </div>
                <div className="flex items-center gap-4 relative z-10 group-hover:-translate-x-4 transition-transform duration-500">
                  <span className="hidden md:block text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Subescreva @TerrasdeGaia</span>
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-red-600 transition-colors relative z-10">
                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                </div>
                <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-[30%] opacity-[0.02] group-hover:opacity-10 group-hover:-translate-x-10 transition-all duration-700 fill-white" viewBox="0 0 24 24">
                   <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>

              {/* TikTok Row */}
              <a href={OFFICIAL_PROFILES.tiktok} target="_blank" rel="noopener noreferrer" className="group relative py-10 flex items-center justify-between overflow-hidden">
                <div className="flex items-center gap-8 relative z-10">
                  <span className="text-white/10 group-hover:text-[#00a6f0] font-black italic text-2xl transition-colors">04</span>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                    TikTok
                  </h2>
                </div>
                <div className="flex items-center gap-4 relative z-10 group-hover:-translate-x-4 transition-transform duration-500">
                  <span className="hidden md:block text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Seguir @TerrasdeGaia</span>
                  <div className="p-4 bg-white/5 rounded-full group-hover:bg-[#ee1d52] transition-colors relative z-10">
                    <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
                    </svg>
                  </div>
                </div>
                <svg className="absolute -right-10 top-1/2 -translate-y-1/2 w-[30%] opacity-[0.02] group-hover:opacity-10 group-hover:-translate-x-10 transition-all duration-700 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}