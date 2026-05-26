"use client";

import { CheckCircle2, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { CONTACT_INFO } from "@/lib/contact";

export default function ViraParceiro() {
  const partnershipTypes = [
    {
      number: "01",
      title: "Patrocínios",
      description: "Apoie conteúdos e programas específicos da nossa plataforma",
      items: ["Programas de TV", "Conteúdos digitais", "Eventos especiais"]
    },
    {
      number: "02",
      title: "Publicidade",
      description: "Coloque a sua marca onde a audiência nos vê",
      items: ["Banners digitais", "Spots publicitários", "Publicidade integrada"]
    },
    {
      number: "03",
      title: "Parcerias Comerciais",
      description: "Desenvolva oportunidades de negócio em conjunto",
      items: ["Produtos conjuntos", "Promoções exclusivas", "Colaborações criativas"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-32 pb-20 font-nurom overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Kinetic Header */}
        <div className="relative mb-24">
          <span className="text-[#006ec2] text-xs font-black uppercase tracking-[0.8em] mb-5 block">
            Oportunidades de Negócio
          </span>
          <h1 className="text-8xl md:text-[12rem] font-black uppercase italic leading-[0.7] tracking-tighter">
            SEJA NOSSO<br /> 
            <span className="text-white/5 outline-text ml-20">PARCEIRO</span>
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-12">
          
          {/* Left Side: Info + Contact */}
          <div className="lg:col-span-4 space-y-16">
            
            {/* Intro */}
            <div>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-widest mb-4">Sobre a Parceria</p>
              <p className="text-white/70 leading-relaxed mb-4">
                O Terras de Gaia é uma plataforma digital de comunicação mais influente
                da região. Ao tornar-se parceiro, a sua marca ganha acesso direto a uma audiência ativa,
                conteúdos de alto impacto e oportunidades exclusivas de visiblidade.
              </p>
              <div className="space-y-2 text-sm text-white/60">
                <p>✓ 100k+ utilizadores mensais</p>
                <p>✓ Disponibilidade 24/7</p>
                <p>✓ 50+ parcerias ativas</p>
              </div>
            </div>

            {/* Email Contact */}
            <div className="group cursor-pointer">
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-widest mb-4">Email</p>
              <a href={`mailto:${CONTACT_INFO.email_comercial}`} className="flex items-center gap-4 border-b border-white/5 pb-6 group-hover:border-[#006ec2] transition-colors">
                <Mail className="text-white/20 group-hover:text-[#006ec2]" size={24} />
                <span className="text-2xl font-bold italic uppercase tracking-tighter group-hover:pl-2 transition-all">
                  {CONTACT_INFO.email_comercial}
                </span>
              </a>
            </div>

            {/* Phone Contact */}
            <div className="group cursor-pointer">
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-widest mb-4">Telefone</p>
              <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-4 border-b border-white/5 pb-6 group-hover:border-[#006ec2] transition-colors">
                <Phone className="text-white/20 group-hover:text-[#006ec2]" size={24} />
                <span className="text-2xl font-bold italic uppercase tracking-tighter group-hover:pl-2 transition-all">
                  {CONTACT_INFO.phone}
                </span>
              </a>
            </div>
          </div>

          {/* Right Side: Partnership Types */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
              {partnershipTypes.map((partnership, idx) => (
                <div key={idx} className="group relative py-12 border-b border-white/5 flex flex-col md:flex-row md:items-start md:justify-between overflow-hidden">
                  
                  {/* Number + Title */}
                  <div className="flex items-start gap-8 relative z-10 mb-6 md:mb-0 flex-1">
                    <span className="text-white/10 group-hover:text-[#006ec2] font-black italic text-3xl transition-colors flex-shrink-0">
                      {partnership.number}
                    </span>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-3 group-hover:translate-x-2 transition-transform duration-500">
                        {partnership.title}
                      </h2>
                      <p className="text-white/60 leading-relaxed max-w-sm mb-4">
                        {partnership.description}
                      </p>
                      
                      {/* Items List */}
                      <ul className="space-y-2">
                        {partnership.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 size={16} className="text-[#006ec2] flex-shrink-0" />
                            <span className="text-white/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Background SVG Ghost Logo */}
                  <svg className="absolute -right-20 top-0 w-[40%] opacity-[0.02] group-hover:opacity-[0.08] group-hover:-translate-x-10 transition-all duration-700 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m3.5-9c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5m-7 0c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5m3.5 6.5c2.33 0 4.31-1.46 5.05-3.5h-10.1c.74 2.04 2.72 3.5 5.05 3.5z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
