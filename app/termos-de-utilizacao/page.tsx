  "use client";

import React from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    num: "01",
    title: "Aceitação dos Termos",
    content: "Ao aceder e utilizar o website da Terras de Gaia TV, o utilizador declara ter lido, compreendido e aceite os presentes Termos de Utilização, bem como a nossa Política de Privacidade. Caso não concorde com estes termos, deverá abster-se de utilizar o Website.",
  },
  {
    num: "02",
    title: "Descrição do Serviço",
    content: "A Terras de Gaia TV é um canal de televisão local que disponibiliza conteúdos noticiosos, informativos e de entretenimento focados no município de Gaia e região. O Website oferece acesso gratuito a emissão em direto, arquivo de vídeos (Gaia Play), programação e conteúdo editorial.",
  },
  {
    num: "03",
    title: "Propriedade Intelectual",
    content: "Todo o conteúdo publicado neste Website — incluindo textos, vídeos, imagens, logótipos e grafismos — é propriedade da Terras de Gaia TV ou de terceiros que cederam a respetiva licença. É expressamente proibida a reprodução ou uso não autorizado destes conteúdos sem autorização prévia e escrita.",
  },
  {
    num: "04",
    title: "Utilização Aceitável",
    content: "O utilizador compromete-se a utilizar o Website de forma lícita. É proibido utilizar o Website para fins ilegais ou fraudulentos; tentar obter acesso não autorizado a sistemas; publicar conteúdos ilícitos ou ofensivos; ou utilizar ferramentas automatizadas sem autorização expressa.",
  },
  {
    num: "05",
    title: "Isenção de Responsabilidade",
    content: "A Terras de Gaia TV não se responsabiliza por quaisquer danos resultantes do uso ou impossibilidade de uso do Website. O Website é disponibilizado \"tal como está\", sem garantias de disponibilidade contínua, ausência de erros ou adequação a fins específicos.",
  },
  {
    num: "06",
    title: "Links para Sites de Terceiros",
    content: "O Website pode conter links para sites externos. Esses links são fornecidos para conveniência do utilizador e não implicam qualquer endosso ou responsabilidade da Terras de Gaia TV relativamente ao conteúdo, políticas ou práticas desses sites.",
  },
  {
    num: "07",
    title: "Conteúdo do Utilizador",
    content: "Os utilizadores são inteiramente responsáveis pelos conteúdos que submetem. A Terras de Gaia TV reserva-se o direito de remover qualquer conteúdo que viole estes Termos ou que considere inadequado, sem aviso prévio.",
  },
  {
    num: "08",
    title: "Alterações aos Termos",
    content: "A Terras de Gaia TV reserva-se o direito de alterar os presentes Termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação no Website. O uso continuado do Website constitui a aceitação dos novos termos.",
  },
  {
    num: "09",
    title: "Lei Aplicável",
    content: "Os presentes Termos de Utilização regem-se pela lei portuguesa. Qualquer litígio será submetido à jurisdição exclusiva dos tribunais competentes da comarca de Vila Nova de Gaia.",
  },
  {
    num: "10",
    title: "Contacto",
    content: "Para qualquer questão relacionada com estes Termos, poderá contactar-nos através da página de Contactos disponível neste Website.",
  },
];

export default function TermosDeUtilizacao() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-125 h-125 bg-[#006ec2]/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-100 h-100 bg-[#006ec2]/3 rounded-full blur-[120px]" />
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
              Última atualização: Janeiro 2025
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter mb-8"
            >
              TERMOS DE<br />
              <span className="text-[#006ec2]">UTILIZAÇÃO</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/40 text-sm leading-relaxed max-w-xl border-l-2 border-[#006ec2]/30 pl-6"
            >
              Estes termos regulam o acesso e uso do website da Terras de Gaia TV.
              Por favor, leia-os atentamente antes de utilizar os nossos serviços.
            </motion.p>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/4">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group relative bg-[#0a0c10] p-8 hover:bg-[#006ec2]/3 transition-colors duration-300"
              >
                {/* Large ghost number */}
                <span className="absolute top-4 right-6 text-[5rem] font-black italic leading-none text-white/3 select-none pointer-events-none group-hover:text-[#006ec2]/5 transition-colors duration-500">
                  {s.num}
                </span>
                <div className="relative">
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-[#006ec2] mb-3">
                    Art.º {s.num}
                  </span>
                  <h2 className="text-base font-black uppercase italic tracking-tight text-white mb-4 group-hover:text-[#006ec2] transition-colors duration-300">
                    {s.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-[1.8]">{s.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
