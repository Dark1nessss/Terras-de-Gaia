"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Tv, Radio, Play, Newspaper, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  {
    icon: Tv,
    label: "01",
    title: "Transmissão em Direto",
    items: [
      {
        q: "Como posso ver a Terras de Gaia TV em direto?",
        a: "Acede à secção 'Live' no menu principal ou no separador 'Transmissões'. A emissão em direto está disponível 24 horas por dia, 7 dias por semana, sem necessidade de registo.",
      },
      {
        q: "A transmissão em direto é gratuita?",
        a: "Sim. Toda a transmissão em direto da Terras de Gaia TV é completamente gratuita e acessível a qualquer pessoa com ligação à internet.",
      },
      {
        q: "Porque é que o direto está a fazer buffering?",
        a: "O buffering pode ser causado por uma ligação à internet lenta. Recomendamos uma ligação mínima de 5 Mbps para uma visualização estável. Verifica também se tens outras aplicações a utilizar largura de banda em simultâneo.",
      },
      {
        q: "Consigo ver o direto no telemóvel?",
        a: "Sim. O site é completamente responsivo e otimizado para dispositivos móveis. Podes aceder ao direto através do browser do teu telemóvel ou tablet.",
      },
    ],
  },
  {
    icon: Play,
    label: "02",
    title: "Gaia Play",
    items: [
      {
        q: "O que é o Gaia Play?",
        a: "O Gaia Play é a plataforma de vídeo on-demand da Terras de Gaia TV. Aqui podes ver programas, reportagens e conteúdos exclusivos quando quiseres, ao teu ritmo.",
      },
      {
        q: "Como funciona o arquivo de vídeos?",
        a: "Todos os conteúdos disponíveis estão organizados por programa e por data. Podes navegar pelas categorias ou utilizar a pesquisa para encontrar um conteúdo específico.",
      },
      {
        q: "Os vídeos do Gaia Play são gratuitos?",
        a: "Sim. Todo o catálogo do Gaia Play está disponível gratuitamente, sem necessidade de subscrição ou registo.",
      },
    ],
  },
  {
    icon: Radio,
    label: "03",
    title: "Programação",
    items: [
      {
        q: "Onde posso consultar a grelha de programação?",
        a: "A grelha de programação está disponível na secção 'Programação' do menu. Podes ver os programas do dia atual e dos dias seguintes.",
      },
      {
        q: "A programação é atualizada em tempo real?",
        a: "Sim. A grelha é atualizada regularmente pela nossa equipa de produção. Em caso de alterações de última hora, o site reflete as mudanças assim que possível.",
      },
    ],
  },
  {
    icon: Newspaper,
    label: "04",
    title: "Conteúdo & Notícias",
    items: [
      {
        q: "Com que frequência são publicadas notícias?",
        a: "A nossa redação publica conteúdos diariamente, com foco em Gaia, na região metropolitana do Porto e em temas de interesse local e nacional.",
      },
      {
        q: "Como posso partilhar um artigo?",
        a: "Em cada artigo encontras botões de partilha para as principais redes sociais. Podes também copiar o link diretamente da barra de endereço do browser.",
      },
      {
        q: "Posso sugerir um tema ou reportagem?",
        a: "Claro! Entra em contacto connosco através da página de Contactos. A nossa equipa analisa todas as sugestões recebidas.",
      },
    ],
  },
];

function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`border-b border-white/6 last:border-0 transition-colors duration-300 ${open ? "bg-[#006ec2]/4" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-6 py-5 px-4 text-left group cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <span className={`text-[10px] font-black tabular-nums pt-0.5 transition-colors duration-200 ${open ? "text-[#006ec2]" : "text-white/20"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`font-bold text-sm leading-snug transition-colors duration-200 ${open ? "text-white" : "text-white/70 group-hover:text-white"}`}>
            {q}
          </span>
        </div>
        <div className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? "bg-[#006ec2] border-[#006ec2]" : "border-white/20 group-hover:border-[#006ec2]/50"}`}>
          <ChevronDown size={11} className={`transition-transform duration-300 ${open ? "rotate-180 text-white" : "text-white/40"}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-white/50 text-sm leading-relaxed pb-6 pl-12 pr-10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CentroDeAjuda() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom overflow-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-150 h-150 bg-[#006ec2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-100 h-100 bg-[#006ec2]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6">

          {/* Hero */}
          <div className="mb-20">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[#006ec2] text-[10px] font-black uppercase tracking-[0.8em] mb-6"
            >
              <span className="w-4 h-px bg-[#006ec2]" />
              Suporte & FAQ
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter mb-8"
            >
              CENTRO<br />
              <span className="text-[#006ec2]">DE AJUDA</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/40 text-base max-w-lg leading-relaxed"
            >
              Encontra respostas para as perguntas mais frequentes sobre os nossos serviços.
            </motion.p>
          </div>

          {/* Layout: sidebar nav + content */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* Sidebar category nav */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-56 shrink-0"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-5">Categorias</p>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                {SECTIONS.map((s, i) => {
                  const Icon = s.icon;
                  const active = activeSection === i;
                  return (
                    <button
                      key={s.title}
                      onClick={() => setActiveSection(i)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal w-full cursor-pointer ${
                        active
                          ? "bg-[#006ec2]/10 border border-[#006ec2]/20 text-[#006ec2]"
                          : "border border-transparent text-white/40 hover:text-white/70 hover:border-white/10"
                      }`}
                    >
                      <Icon size={14} className={active ? "text-[#006ec2]" : "text-white/30 group-hover:text-white/50"} />
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${active ? "text-[#006ec2]/70" : "text-white/20"}`}>{s.label}</p>
                        <p className="text-xs font-bold uppercase tracking-wide">{s.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* FAQ content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/6">
                    {(() => {
                      const Icon = SECTIONS[activeSection].icon;
                      return (
                        <div className="w-10 h-10 rounded-sm bg-[#006ec2]/10 border border-[#006ec2]/20 flex items-center justify-center">
                          <Icon size={18} className="text-[#006ec2]" />
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#006ec2]/60 mb-1">
                        {SECTIONS[activeSection].label}
                      </p>
                      <h2 className="text-xl font-black uppercase italic tracking-tight">
                        {SECTIONS[activeSection].title}
                      </h2>
                    </div>
                    <span className="ml-auto text-xs font-black text-white/20 uppercase tracking-widest">
                      {SECTIONS[activeSection].items.length} perguntas
                    </span>
                  </div>

                  {/* Accordion items */}
                  <div className="border border-white/6 rounded-sm overflow-hidden">
                    {SECTIONS[activeSection].items.map((item, i) => (
                      <AccordionItem key={item.q} q={item.q} a={item.a} index={i} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 relative overflow-hidden rounded-sm border border-white/6 bg-linear-to-br from-[#006ec2]/5 to-transparent p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="absolute right-0 top-0 w-72 h-72 bg-[#006ec2]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em] mb-3">
                Não encontraste resposta?
              </p>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                Fala diretamente<br />connosco
              </h2>
            </div>
            <Link
              href="/contacto"
              className="relative shrink-0 group flex items-center gap-3 bg-[#006ec2] hover:bg-[#0090d4] text-white font-black uppercase text-xs tracking-widest px-8 py-4 transition-colors duration-300"
            >
              <Mail size={14} />
              Página de Contactos
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

