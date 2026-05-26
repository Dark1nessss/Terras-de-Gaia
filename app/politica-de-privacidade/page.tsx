"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    id: "responsavel",
    num: "01",
    title: "Responsável pelo Tratamento",
    content: "A Terras de Gaia TV é o responsável pelo tratamento dos dados pessoais recolhidos através deste Website. Para qualquer questão relacionada com a proteção de dados, poderá contactar-nos através da página de Contactos.",
  },
  {
    id: "dados",
    num: "02",
    title: "Dados Recolhidos",
    content: "Recolhemos os seguintes tipos de dados: dados de navegação (endereço IP, tipo de browser, páginas visitadas, duração da visita), recolhidos de forma automática para fins estatísticos e de melhoria do serviço; dados fornecidos voluntariamente pelo utilizador, nomeadamente através de formulários de contacto (nome, endereço de e-mail, mensagem).",
  },
  {
    id: "finalidade",
    num: "03",
    title: "Finalidade do Tratamento",
    content: "Os dados pessoais recolhidos são utilizados para: assegurar o funcionamento e a melhoria contínua do Website; responder a pedidos de contacto ou suporte; elaborar estatísticas anónimas de utilização; cumprir obrigações legais quando aplicável. Os seus dados não são utilizados para fins de marketing direto sem o seu consentimento explícito.",
  },
  {
    id: "base",
    num: "04",
    title: "Base Legal do Tratamento",
    content: "O tratamento dos seus dados pessoais assenta nas seguintes bases legais: execução de um contrato ou de diligências pré-contratuais (quando aplicável); cumprimento de obrigações legais; interesses legítimos da Terras de Gaia TV na melhoria dos seus serviços; consentimento do titular dos dados, quando expressamente solicitado.",
  },
  {
    id: "cookies",
    num: "05",
    title: "Cookies e Tecnologias Semelhantes",
    content: "Este Website utiliza cookies para melhorar a experiência de navegação, analisar o tráfego e personalizar conteúdos. Os cookies são pequenos ficheiros de texto armazenados no seu dispositivo. Pode configurar o seu browser para recusar cookies, mas tal poderá afetar a funcionalidade do Website. Ao continuar a navegar sem alterar as suas configurações, aceita o uso de cookies.",
  },
  {
    id: "partilha",
    num: "06",
    title: "Partilha de Dados com Terceiros",
    content: "Não vendemos nem cedemos os seus dados pessoais a terceiros para fins comerciais. Os dados podem ser partilhados com prestadores de serviços técnicos que nos auxiliam na operação do Website (ex.: serviços de alojamento, análise de dados), sempre sob obrigações contratuais de confidencialidade e segurança. Podemos igualmente divulgar dados quando exigido por lei ou autoridade competente.",
  },
  {
    id: "transferencias",
    num: "07",
    title: "Transferências Internacionais",
    content: "Em caso de transferência de dados para países fora do Espaço Económico Europeu, asseguramos que essa transferência é realizada com base em mecanismos legais adequados, incluindo cláusulas contratuais-tipo aprovadas pela Comissão Europeia, garantindo um nível de proteção equivalente ao estabelecido pelo RGPD.",
  },
  {
    id: "conservacao",
    num: "08",
    title: "Conservação dos Dados",
    content: "Os dados pessoais são conservados apenas pelo período necessário para os fins que motivaram a sua recolha, ou pelo período exigido por lei. Dados de contacto são conservados pelo período máximo de 2 anos após o último contacto. Dados de navegação anónimos são conservados por um período máximo de 26 meses.",
  },
  {
    id: "direitos",
    num: "09",
    title: "Direitos do Titular dos Dados",
    content: "Nos termos do RGPD, tem direito a: aceder aos seus dados pessoais; solicitar a retificação de dados incorretos; solicitar o apagamento dos dados (\"direito a ser esquecido\"); opor-se ao tratamento ou solicitar a sua limitação; solicitar a portabilidade dos seus dados; apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD). Para exercer estes direitos, contacte-nos através da página de Contactos.",
  },
  {
    id: "seguranca",
    num: "10",
    title: "Segurança dos Dados",
    content: "Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra acesso não autorizado, perda, destruição ou divulgação acidental. Não obstante, nenhum sistema de transmissão de dados pela internet é absolutamente seguro, pelo que não podemos garantir a segurança absoluta das informações transmitidas.",
  },
  {
    id: "atualizacoes",
    num: "11",
    title: "Alterações à Política",
    content: "Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. Quaisquer alterações serão publicadas nesta página com indicação da data de última atualização. Recomendamos que consulte esta página regularmente para se manter informado sobre como protegemos os seus dados.",
  },
];

export default function PoliticaDePrivacidade() {
  const [activeId, setActiveId] = useState("responsavel");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-125 h-125 bg-[#006ec2]/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-[#006ec2]/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6">

          {/* Hero */}
          <div className="mb-16 pb-16 border-b border-white/6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 text-[#006ec2] text-[10px] font-black uppercase tracking-[0.8em] mb-6"
            >
              <span className="w-4 h-px bg-[#006ec2]" />
              RGPD · Última atualização: Janeiro 2025
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter mb-8"
            >
              POLÍTICA DE<br />
              <span className="text-[#006ec2]">
                PRIVACIDADE
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/40 text-sm leading-relaxed max-w-xl border-l-2 border-[#006ec2]/30 pl-5"
            >
              A Terras de Gaia TV respeita e protege a privacidade dos seus utilizadores.
              Esta política descreve como recolhemos, utilizamos e protegemos os seus dados,
              em conformidade com o RGPD e a legislação portuguesa aplicável.
            </motion.p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Sticky TOC */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:w-52 shrink-0 lg:sticky lg:top-32 lg:self-start"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Índice</p>
                <span className="text-[9px] font-black text-white/15 tabular-nums">{SECTIONS.findIndex(s => s.id === activeId) + 1} / {SECTIONS.length}</span>
              </div>
              <nav className="flex flex-col">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 cursor-pointer border-l-2 ${
                      activeId === s.id
                        ? "border-[#006ec2] bg-[#006ec2]/5 text-[#006ec2]"
                        : "border-transparent text-white/30 hover:text-white/60 hover:border-white/10"
                    }`}
                  >
                    <span className={`text-[9px] font-black tabular-nums shrink-0 ${activeId === s.id ? "text-[#006ec2]" : "text-white/20"}`}>
                      {s.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide leading-tight">{s.title}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>

            {/* Content — timeline */}
            <div className="flex-1 min-w-0 relative">
              {/* Vertical timeline line */}
              <div className="absolute left-0 top-3 bottom-3 w-px bg-white/5" />

              {SECTIONS.map((s, i) => (
                <motion.div
                  key={s.id}
                  id={s.id}
                  ref={(el) => { sectionRefs.current[s.id] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="group relative pl-10 pb-12 last:pb-0 scroll-mt-36"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-1 top-1.5 w-2 h-2 rounded-full border transition-all duration-500 ${
                      activeId === s.id
                        ? "bg-[#006ec2] border-[#006ec2] shadow-[0_0_10px_rgba(0, 166, 240, ,0.5)]"
                        : "bg-[#0a0c10] border-white/20 group-hover:border-[#006ec2]/50"
                    }`}
                  />

                  {/* Ghost number */}
                  <span className="absolute right-0 top-0 text-[5rem] font-black italic leading-none text-white/2 select-none pointer-events-none group-hover:text-[#006ec2]/4 transition-colors duration-500">
                    {s.num}
                  </span>

                  <div className="relative">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-[#006ec2]/50 mb-3">{s.num}</span>
                    <h2 className={`text-base font-black uppercase italic tracking-tight mb-4 transition-colors duration-300 ${
                      activeId === s.id ? "text-[#006ec2]" : "text-white group-hover:text-[#006ec2]"
                    }`}>
                      {s.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-[1.85]">{s.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
