import { PdfViewer } from '@/components/pdf-viewer-dynamic';

export default function TestPdfViewerPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10] text-white font-nurom pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8 text-white/80">
          PDF Viewer — Test
        </h1>
        <PdfViewer pdfUrl="/test.pdf" title="test.pdf" />
      </div>
    </main>
  );
}
