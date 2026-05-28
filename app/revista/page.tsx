"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/breadcrumb';
import { BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import type { Revista } from '@/lib/revista';
import { cleanText } from '@/lib/decode-html';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: cardEase },
  },
};

function MagazineCard({ revista }: { revista: Revista }) {
  const title = cleanText(revista.title.rendered);

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group cursor-pointer"
    >
      {/* Cover */}
      <div
        className="relative aspect-3/4 overflow-hidden rounded-sm"
        style={{
          boxShadow: '4px 8px 32px rgba(0,0,0,0.7)',
        }}
      >
        {/* Left spine shadow for book-like feel */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-linear-to-r from-black/70 via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Cover image */}
        {revista.featured_media_url ? (
          <Image
            src={revista.featured_media_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#0045ac] via-[#003080] to-[#0a0c10] flex items-center justify-center">
            <BookOpen size={48} className="text-white/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-20 flex flex-col justify-end p-4">
          <span className="text-[#006ec2] text-xs font-black uppercase tracking-widest flex items-center gap-1">
            Ler Agora <ArrowRight size={12} />
          </span>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-black uppercase italic tracking-tight line-clamp-2 leading-tight group-hover:text-[#006ec2] transition-colors duration-300">
          {title}
        </h3>
        {revista.acf?.data_publicacao && (
          <p className="text-white/35 text-xs mt-1.5 flex items-center gap-1.5">
            <Calendar size={10} />
            {revista.acf.data_publicacao}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function RevistaPage() {
  const [revistas, setRevistas] = useState<Revista[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/revista')
      .then((r) => r.json())
      .then((data) => {
        setRevistas(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#006ec2]/8 blur-[120px] rounded-full" />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl z-20">
          <Breadcrumb
            items={[{ label: 'Inicial', href: '/' }]}
            current="Revista Digital"
          />

          <div className="flex items-start justify-between mt-6 gap-8">
            {/* Left: title + description */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.75 bg-[#006ec2]" />
                <span className="text-[#006ec2] text-xs font-black uppercase tracking-[0.2em]">
                  Arquivo Digital
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-5">
                Jornal
                <br />
                <span className="text-[#006ec2]">Mensal</span>
              </h1>

              <p className="text-white/40 text-base max-w-md leading-relaxed">
                Consulte a versão digital do Jornal impresso Terras de Gaia — folheie cada número diretamente no seu browser.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/4 mx-6" />

      {/* Grid */}
      <section className="container mx-auto px-6 max-w-7xl py-16 pb-28">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#006ec2]" size={40} />
            <p className="text-white/30 text-sm">A carregar revistas...</p>
          </div>
        ) : revistas.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <BookOpen size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold uppercase italic">Nenhuma revista disponível.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <p className="text-white/30 text-sm">
                {revistas.length} edição{revistas.length !== 1 ? 'ões' : ''} publicada{revistas.length !== 1 ? 's' : ''}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {revistas.map((revista) => (
                <motion.div key={revista.id} variants={cardVariants}>
                  <Link href={`/revista/${revista.slug}`}>
                    <MagazineCard revista={revista} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
