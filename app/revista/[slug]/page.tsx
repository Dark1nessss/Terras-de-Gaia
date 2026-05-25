import { getRevistaBySlug, getRevistas, getPdfUrlFromRevista } from '@/lib/revista';
import { notFound } from 'next/navigation';
import { PdfViewer } from '@/components/pdf-viewer-dynamic';
import { Breadcrumb } from '@/components/breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, BookOpen, ArrowLeft } from 'lucide-react';
import { cleanText, decodeHtml } from '@/lib/decode-html';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const revistas = await getRevistas();
  return revistas.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const revista = await getRevistaBySlug(slug);
  if (!revista) return { title: 'Revista não encontrada' };
  const title = cleanText(revista.title.rendered);
  return {
    title: `${title} — Revista Digital | Terras de Gaia`,
    description: revista.excerpt?.rendered
      ? decodeHtml(revista.excerpt.rendered).replace(/<[^>]*>/g, '').slice(0, 155)
      : `Leia a edição ${title} da Revista Digital do Jornal Terras de Gaia.`,
    openGraph: {
      images: revista.featured_media_url ? [{ url: revista.featured_media_url }] : [],
    },
  };
}

export default async function RevistaDetailPage({ params }: Props) {
  const { slug } = await params;
  const revista = await getRevistaBySlug(slug);

  if (!revista) notFound();

  const title = cleanText(revista.title.rendered);
  const rawPdfUrl = getPdfUrlFromRevista(revista);
  const pdfUrl = rawPdfUrl ? `/api/pdf?url=${encodeURIComponent(rawPdfUrl)}` : null;

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom">
      {/* Header */}
      <section className="pt-24 pb-10 border-b border-white/4">
        <div className="container mx-auto px-6 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Inicial', href: '/' },
              { label: 'Revista Digital', href: '/revista' },
            ]}
            current={title}
          />

          <div className="flex flex-col sm:flex-row gap-8 mt-8 items-start">
            {/* Thumbnail */}
            {revista.featured_media_url && (
              <div className="shrink-0">
                <div
                  className="relative w-28 sm:w-36 aspect-3/4 rounded-sm overflow-hidden"
                  style={{ boxShadow: '4px 8px 32px rgba(0,0,0,0.7)' }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-linear-to-r from-black/60 to-transparent z-10" />
                  <Image
                    src={revista.featured_media_url}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-0.75 bg-[#00a6f0]" />
                <span className="text-[#00a6f0] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <BookOpen size={13} />
                  Revista Digital
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                {title}
              </h1>

              <div className="flex flex-wrap gap-4 text-white/40 text-sm">
                {revista.acf?.data_publicacao && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {revista.acf.data_publicacao}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Reader */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl py-10 pb-24">
        {pdfUrl ? (
          <>
            <p className="text-white/25 text-xs text-center mb-6 uppercase tracking-widest">
              Use as setas do teclado ← → para navegar entre páginas
            </p>
            <PdfViewer pdfUrl={pdfUrl} title={title} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-white/30 gap-4">
            <BookOpen size={64} className="opacity-20" />
            <p className="text-xl font-bold uppercase italic">PDF não disponível para esta edição.</p>
            <Link
              href="/revista"
              className="flex items-center gap-2 text-[#00a6f0] hover:underline text-sm mt-2"
            >
              <ArrowLeft size={14} />
              Voltar ao arquivo
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
