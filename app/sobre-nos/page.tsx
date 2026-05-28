"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, Mail, MapPin, Newspaper, Radio, Tv, Camera, Globe, Play, Users } from "lucide-react";
import { STATS_FALLBACK } from "@/lib/stats";

/* ─── Animation helpers ──────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function DrawLineV({ className }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
      className={`origin-top ${className ?? ""}`}
    />
  );
}

function TimelineItem({ year, title, desc, index, sub }: { year: string; title: string; desc: string; index: number; sub?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;
  return (
    <div ref={ref} className="relative">
      {/* ── Mobile: left-aligned ── */}
      <div className="md:hidden pl-10 pb-14">
        <motion.div
          className="absolute left-0 top-2 size-3 rounded-full bg-[#006ec2] ring-4 ring-[#0a0c10] z-10"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em] mb-1">
            {sub ? <span>{year}</span> : year}
          </p>
          <p className="text-white/90 font-black uppercase italic tracking-tight text-xl mb-2">{title}</p>
          <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
        </motion.div>
      </div>
      {/* ── Desktop: alternating left/right ── */}
      <div className="hidden md:grid grid-cols-[1fr_80px_1fr] items-center mb-20">
        <div className="pr-10 text-right">
          {isLeft && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em] mb-1">
                {sub ? <span>{year}</span> : year}
              </p>
              <p className="text-white/90 font-black uppercase italic tracking-tight text-2xl mb-3">{title}</p>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs ml-auto">{desc}</p>
            </motion.div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <motion.div
            className="size-4 rounded-full bg-[#006ec2] ring-4 ring-[#0a0c10] z-10"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="pl-10">
          {!isLeft && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em] mb-1">
                {sub ? <span>{year}</span> : year}
              </p>
              <p className="text-white/90 font-black uppercase italic tracking-tight text-2xl mb-3">{title}</p>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">{desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const MARQUEE_WORDS = [
  "DESPORTO", "INFORMAÇÃO", "ENTRETENIMENTO", 
  "GAIA", "RIGOR", "COMPROMISSO", 
  "INOVAÇÃO", "EXPERIÊNCIA",
];

const SERVICES = [
  { num: "01", Icon: Newspaper, title: "Jornalismo Local", sub: "Notícias · Reportagem · Opinião", desc: "Cobertura diária do que molda Vila Nova de Gaia — política, cultura, sociedade, desporto. As histórias que o jornalismo nacional ignora, nós contamos." },
  { num: "02", Icon: Radio, title: "Transmissões em Direto", sub: "Live · Streaming · Eventos", desc: "Jogos, cerimónias, sessões municipais, eventos culturais. Transmitidos em direto para quem não pode estar lá mas precisa de ver." },
  { num: "03", Icon: Tv, title: "Canal TV & Gaia Play", sub: "Programas Originais · On Demand", desc: "Conteúdos exclusivos, reportagens de fundo e programas originais disponíveis quando quiser. O arquivo vivo da identidade de Gaia." },
  { num: "04", Icon: Camera, title: "Audiovisual & Fotografia", sub: "Produção · Criação · Registo", desc: "Produção audiovisual e fotografia profissional para empresas, instituições e eventos da região. Da ideia ao ecrã, somos o vosso parceiro criativo." },
];

const TIMELINE = [
  { year: "2003", title: "Jornal Notícias de Avintes", desc: "As primeiras páginas impressas chegam às mãos dos habitantes de Avintes. Um jornal local com grandes ambições." },
  { year: "2014", title: "Presença na Internet", desc: "O jornalismo local dá os primeiros passos no digital. A informação começa a circular sem fronteiras físicas." },
  { year: "2016", title: "Produção Audiovisual", desc: "A câmara entra em cena. Reportagens em vídeo, cobertura de eventos e o início da linguagem televisiva." },
  { year: "2016", title: "Canal de Televisão", desc: "Nasce o canal Terras de Gaia TV. Transmissões em direto, programas originais e a região no ecrã de casa.", sub: true },

  { year: "2022", title: "Gaia Play", desc: "Plataforma on demand com programas originais, arquivo histórico e conteúdos exclusivos para a comunidade." },
  { year: "Hoje", title: "Ecossistema Completo", desc: "Jornal · Canal TV · Streaming · Redes Sociais. Um meio de comunicação completo ao serviço de Vila Nova de Gaia." },
];

const PLATFORMS = [
  { Icon: Globe, label: "Jornal Online", desc: "Notícias, reportagens e opinião em terrasdegaia.pt", href: "/" },
  { Icon: Newspaper, label: "Jornal em Papel", desc: "Edição impressa disponível na redação Terras de Gaia", href: "/revista" },
  { Icon: Tv, label: "Canal TV", desc: "Transmissão televisiva em direto para a região", href: "/live" },
  { Icon: Play, label: "Gaia Play", desc: "Programas originais e conteúdos on demand", href: "/gaia-play" },
  { Icon: Users, label: "Redes Sociais", desc: "Siga-nos e acompanhe as últimas novidades", href: "/contacto" },
];

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function SobreNos() {
  const { scrollY } = useScroll();
  const heroGhostY = useTransform(scrollY, [0, 800], [0, 160]);

  const [stats, setStats] = useState(STATS_FALLBACK);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data: Array<{ acf?: { stat_value?: string; stat_label?: string } }>) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(
            data.map((s) => ({
              number: s.acf?.stat_value ?? '',
              label: s.acf?.stat_label ?? '',
            }))
          );
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO — "SOMOS GAIA."
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 pt-40 px-6 border-b border-white/10">
        
        {/* Glow */}
        <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-[#006ec2]/5 blur-[160px] rounded-full pointer-events-none" />
        {/* Dot grid texture */}
        <div className="absolute inset-0 pointer-events-none select-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute top-36 left-6 md:left-12 flex items-center gap-4"
        >
        </motion.div>

        {/* Ghost chapter - parallax */}
        <motion.div
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 text-[20vw] font-black italic text-white/2.5 leading-none select-none pointer-events-none"
          style={{ y: heroGhostY }}
        >
          GAIA
        </motion.div>

        {/* Main declaration */}
        <div className="container mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white/30 text-sm md:text-base font-bold uppercase tracking-[0.4em] mb-6"
          >
            Sobre Nós
          </motion.p>

          <div>
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4rem,15vw,14rem)] font-black uppercase italic leading-[0.82] tracking-tighter"
            >
              SOMOS
            </motion.h1>
          </div>
          <div>
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4rem,15vw,14rem)] font-black uppercase italic leading-[0.82] tracking-tighter text-[#006ec2] drop-shadow-[0_0_60px_rgba(0,166,240,0.3)]"
            >
              GAIA.
            </motion.h1>
          </div>

          {/* Divider + pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/10 pt-10"
          >
            <p className="md:col-span-5 text-white/80 text-xl md:text-2xl font-black italic uppercase tracking-tight leading-snug border-l-4 border-[#006ec2] pl-6">
              Um jornal. Uma câmara.<br />Uma região. Uma voz.
            </p>
            <p className="md:col-span-5 md:col-start-7 text-white/50 leading-relaxed">
              O Projeto Terras de Gaia TV/Jornal nasceu do <em>Jornal Notícias de Avintes</em> com
              um único propósito: dar voz ao que acontece em Vila Nova de Gaia,
              de forma gratuita, acessível e sem filtros.
            </p>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 right-6 md:right-12 flex items-center gap-3 text-white/20 text-[10px] uppercase tracking-widest"
        >
          <span>Scroll</span>
          <div className="w-12 h-px bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 w-full bg-[#006ec2]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE BAND
      ═══════════════════════════════════════════════════════════ */}
      <div className="border-b border-white/10 py-4 overflow-hidden bg-[#006ec2]/5">
        <div className="marquee-track flex gap-12 whitespace-nowrap">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 shrink-0 flex items-center gap-12">
              {w}
              <span className="size-1 bg-[#006ec2] rounded-full" />
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CHAPTER 01 — A ORIGEM
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 border-b border-white/10">
        <div className="container mx-auto">

          {/* Chapter label */}
          <Reveal className="flex items-center gap-6 mb-20">
            <span className="text-[8rem] md:text-[10rem] font-black italic text-white/4 leading-none select-none">01</span>
            <div>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-2">Capítulo Um</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">A Origem</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Big pull quote */}
            <Reveal delay={0.1} className="relative">
              <span className="absolute -top-4 -left-2 text-[11rem] font-black leading-none select-none pointer-events-none text-[#006ec2]/8">&ldquo;</span>
              <blockquote className="relative text-4xl md:text-5xl lg:text-6xl font-black uppercase italic leading-[0.85] tracking-tighter">
                &ldquo;Tudo começou <br />
                com um <span className="text-[#006ec2]">papel.</span>&rdquo;
              </blockquote>
            </Reveal>

            {/* Story body */}
            <RevealStagger className="space-y-6 pt-2">
              <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed">
                Era o <strong className="text-white">Jornal Notícias de Avintes</strong> — páginas impressas, distribuídas pelas mãos
                de quem acreditava que as histórias da terra mereciam ser contadas.
              </motion.p>
              <motion.p variants={fadeUp} className="text-white/50 leading-relaxed">
                Não havia grandes orçamentos nem redações lotadas. Havia determinação, 
                um território para cobrir e uma comunidade que merecia informação de qualidade.
              </motion.p>
              <motion.p variants={fadeUp} className="text-white/50 leading-relaxed">
                Quando o digital chegou, não o combatemos. Transformámos o jornal em plataforma,
                a plataforma em televisão, e a televisão num ecossistema completo de comunicação —
                sempre gratuito, sempre de Gaia, sempre para Gaia.
              </motion.p>
              <motion.div variants={fadeUp} className="pt-4 flex items-center gap-3 text-white/30 text-sm">
                <MapPin size={14} className="text-[#006ec2]" />
                Avintes, Vila Nova de Gaia, Portugal
              </motion.div>
            </RevealStagger>

          </div>

          {/* Timeline — vertical scrollable */}
          <div className="mt-24 pt-12 border-t border-white/5">
            <Reveal>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-16">Uma trajetória</p>
            </Reveal>
            <div className="relative">
              {/* Vertical line — mobile */}
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/5 md:hidden" />
              <DrawLineV className="absolute left-1.5 top-0 bottom-0 w-px bg-[#006ec2]/30 md:hidden" />
              {/* Vertical line — desktop */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-white/5 hidden md:block" />
              <DrawLineV className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#006ec2]/30 hidden md:block" />
              {TIMELINE.map((t, i) => (
                <TimelineItem key={i} year={t.year} title={t.title} desc={t.desc} index={i} sub={t.sub} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MANIFESTO BLOCK — CHAPTER 02
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 border-b border-white/10 overflow-hidden">
        
        {/* Ghost background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[22vw] font-black italic text-white/1.5 leading-none">MISSÃO</span>
        </div>

        <div className="container mx-auto relative z-10">
          <Reveal className="flex items-center gap-6 mb-16">
            <span className="text-[8rem] md:text-[10rem] font-black italic text-white/4 leading-none select-none">02</span>
            <div>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-2">Capítulo Dois</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">A Missão</h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[clamp(2rem,5vw,5.5rem)] font-black uppercase italic leading-[0.88] tracking-tighter max-w-6xl">
              Garantir informação de{" "}
              <span className="text-[#006ec2] drop-shadow-[0_0_40px_rgba(0,166,240,0.5)]">qualidade.</span>{" "}
              Gratuita.{" "}
              Acessível.{" "}
              Para todos os que vivem e respiram{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Gaia.</span>
                <span className="absolute bottom-1 left-0 right-0 h-1 bg-[#006ec2]" />
              </span>
            </p>
          </Reveal>

          {/* Values */}
          <RevealStagger className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Independência", text: "Sem agenda política. Sem patrocinadores que nos calam. Só os factos." },
              { label: "Proximidade", text: "Conhecemos cada rua, cada freguesia, cada história que merece ser contada." },
              { label: "Continuidade", text: "Todos os dias. Todas as semanas. Há anos. E continuaremos aqui." },
            ].map((v) => (
              <motion.div key={v.label} variants={fadeUp} className="group pl-6 border-l-2 border-white/10 hover:border-[#006ec2] transition-colors duration-500 py-4">
                <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-widest mb-4">{v.label}</p>
                <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">{v.text}</p>
              </motion.div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS — DRAMATIC NUMBERS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="container mx-auto">
          <Reveal className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em]">Em Números</span>
            <div className="flex-1 h-px bg-white/5" />
          </Reveal>
          <RevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/5">
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="group px-8 py-10 text-center hover:bg-white/2 transition-colors">
                <p className="text-4xl md:text-6xl font-black italic text-[#006ec2] tracking-tighter leading-none mb-3">
                  {s.number}
                </p>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHERE TO FIND US — PLATFORMS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b border-white/10 bg-[#0d0f14]">
        <div className="container mx-auto">
          <Reveal className="flex items-center gap-6 mb-16">
            <div>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-2">Multiplataforma</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Onde nos Encontrar</h2>
            </div>
          </Reveal>

          <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PLATFORMS.map((p) => {
              const PIcon = p.Icon;
              return (
                <motion.div key={p.label} variants={fadeUp}>
                  <Link href={p.href} className="group relative flex flex-col bg-white/3 border border-white/5 hover:border-[#006ec2]/50 p-8 transition-all duration-500 hover:bg-[#006ec2]/5 overflow-hidden h-full">
                    <div className="absolute top-0 right-0 size-20 bg-[#006ec2]/5 rounded-bl-full group-hover:bg-[#006ec2]/10 transition-colors duration-500" />
                    <PIcon size={26} className="text-[#006ec2]/50 group-hover:text-[#006ec2] transition-colors duration-500 mb-6 shrink-0" />
                    <p className="text-white font-black uppercase italic tracking-tight text-xl mb-2">{p.label}</p>
                    <p className="text-white/40 text-sm leading-relaxed flex-1 group-hover:text-white/60 transition-colors">{p.desc}</p>
                    <ArrowRight size={14} className="mt-6 opacity-0 group-hover:opacity-100 text-[#006ec2] transition-all duration-500 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CHAPTER 03 — O QUE FAZEMOS
      ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="container mx-auto px-6 pt-32 pb-16">
          <Reveal className="flex items-center gap-6">
            <span className="text-[8rem] md:text-[10rem] font-black italic text-white/4 leading-none select-none">03</span>
            <div>
              <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-2">Capítulo Três</p>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">O Que Fazemos</h2>
            </div>
          </Reveal>
        </div>

        {/* Full-bleed alternating editorial blocks */}
        {SERVICES.map((s, i) => {
          const ServiceIcon = s.Icon;
          const isEven = i % 2 === 0;
          return (
            <Reveal key={s.num} delay={i * 0.06}>
              <div className={`group relative border-t border-white/5 py-20 md:py-28 overflow-hidden cursor-default`}>

                {/* Ghost number — alternates corners */}
                <span className={`absolute ${isEven ? '-right-6 bottom-0' : '-left-6 bottom-0'} text-[clamp(10rem,22vw,20rem)] font-black italic text-white/3 leading-[0.8] select-none pointer-events-none translate-y-1/4 group-hover:text-[#006ec2]/6 transition-colors duration-700`}>
                  {s.num}
                </span>

                {/* Sweep fill — alternates direction */}
                <div className={`absolute inset-0 bg-[#006ec2]/4 ${isEven ? '-translate-x-full' : 'translate-x-full'} group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`} />

                {/* Bottom accent line — alternates origin */}
                <div className={`absolute bottom-0 left-0 right-0 h-px bg-[#006ec2] scale-x-0 group-hover:scale-x-100 ${isEven ? 'origin-left' : 'origin-right'} transition-transform duration-700`} />

                {/* Content — alternating alignment */}
                <div className="container mx-auto px-6 relative z-10">
                  <div className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-3xl w-full ${!isEven ? 'text-right' : ''}`}>

                      {/* Meta row */}
                      <div className={`flex items-center gap-4 mb-6 ${!isEven ? 'justify-end' : ''}`}>
                        <ServiceIcon size={20} className="text-[#006ec2]/50 group-hover:text-[#006ec2] transition-colors duration-500 shrink-0" />
                        <span className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em]">{s.num}</span>
                        <div className="w-8 h-px bg-white/20" />
                        <span className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.5em]">{s.sub}</span>
                      </div>

                      {/* Oversized title */}
                      <h3 className="text-[clamp(2.8rem,6vw,7.5rem)] font-black uppercase italic leading-[0.88] tracking-tighter mb-8 group-hover:text-[#006ec2] transition-colors duration-500">
                        {s.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-white/50 text-lg leading-relaxed max-w-xl group-hover:text-white/70 transition-colors ${!isEven ? 'ml-auto' : ''}`}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CLOSING CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#006ec2]/8 blur-[160px] rounded-full -translate-y-1/3" />
        </div>
        <div className="container mx-auto relative z-10">

          <Reveal>
            <p className="text-[#006ec2] text-[10px] font-black uppercase tracking-[0.6em] mb-8">Faça Parte</p>
            <h2 className="text-[clamp(3rem,10vw,9rem)] font-black uppercase italic leading-[0.85] tracking-tighter mb-12">
              A história<br />
              <span className="text-white/20">continua.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div className="space-y-6">
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Seja para partilhar uma notícia, propor uma parceria ou simplesmente
                conhecer melhor o que fazemos — estamos sempre disponíveis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contacto">
                  <button className="group bg-[#006ec2] text-white px-8 py-4 font-black uppercase italic tracking-widest text-sm flex items-center gap-3 hover:bg-white hover:text-black transition-all cursor-pointer">
                    Contactar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/vira-parceiro">
                  <button className="group border border-white/20 text-white px-8 py-4 font-black uppercase italic tracking-widest text-sm flex items-center gap-3 hover:border-[#006ec2] hover:text-[#006ec2] transition-all cursor-pointer">
                    Torne se parceiro TG <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="space-y-0">
              {[
                { icon: <Mail size={18} />, label: "Email", value: "geral@terrasdegaia.pt", href: "mailto:geral@terrasdegaia.pt" },
                { icon: <MapPin size={18} />, label: "Localização", value: "Avintes, Vila Nova de Gaia", href: null },
              ].map((c) => (
                <div key={c.label} className="group border-b border-white/5 hover:border-[#006ec2]/40 transition-colors py-6 flex items-center gap-5 cursor-pointer">
                  <span className="text-white/20 group-hover:text-[#006ec2] transition-colors">{c.icon}</span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-xl font-bold italic uppercase tracking-tighter group-hover:text-[#006ec2] transition-colors">{c.value}</a>
                    ) : (
                      <span className="text-xl font-bold italic uppercase tracking-tighter">{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </main>
  );
}