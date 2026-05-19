"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
  FileWarning,
  BookOpen,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
}

// react-pageflip requires every direct child to be a React.forwardRef div
const FlipPage = React.forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number; height: number }
>(({ pageNumber, width, height }, ref) => (
  <div
    ref={ref}
    style={{ width, height, overflow: 'hidden', backgroundColor: '#ffffff' }}
  >
    <Page
      pageNumber={pageNumber}
      width={width}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  </div>
));
FlipPage.displayName = 'FlipPage';

export function PdfViewer({ pdfUrl, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const [containerWidth, setContainerWidth] = useState(960);

  const isMobile = containerWidth < 680;

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 960;
      setContainerWidth(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // One page width; flipbook shows two side-by-side on desktop
  const pageWidth = isMobile
    ? Math.min(containerWidth - 32, 520)
    : Math.floor((containerWidth - 120) / 2);
  const pageHeight = Math.floor(pageWidth * 1.415); // A4 ratio

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  const goToPrev = () => flipBookRef.current?.pageFlip().flipPrev('FOLD');
  const goToNext = () => flipBookRef.current?.pageFlip().flipNext('FOLD');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const pageLabel = (() => {
    if (isMobile) return `${currentPage + 1} / ${numPages}`;
    if (currentPage === 0) return `1 / ${numPages}`;
    if (currentPage >= numPages - 1) return `${numPages} / ${numPages}`;
    const right = Math.min(currentPage + 2, numPages - 1);
    return `${currentPage + 1}–${right} / ${numPages}`;
  })();

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full bg-[#0d0f14] rounded-xl border border-white/6 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="w-full flex items-center justify-between px-4 py-3 border-b border-white/6 bg-[#0a0c10]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest min-w-0">
          <BookOpen size={13} className="text-[#00a6f0] shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            title="Ecrã completo"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00a6f0] hover:bg-[#0091d1] text-white rounded text-xs font-bold transition-all"
          >
            <Download size={12} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Book stage */}
      <div
        className="w-full flex justify-center items-center py-10 px-4"
        style={{
          minHeight: pageHeight + 80,
          background: 'radial-gradient(ellipse at center, #1a1d24 0%, #0a0c10 100%)',
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div
              className="flex flex-col items-center justify-center gap-4"
              style={{ height: pageHeight }}
            >
              <Loader2 className="animate-spin text-[#00a6f0]" size={40} />
              <p className="text-white/30 text-sm">A carregar revista...</p>
            </div>
          }
          error={
            <div
              className="flex flex-col items-center justify-center gap-4 text-white/40"
              style={{ height: pageHeight }}
            >
              <FileWarning size={48} className="opacity-40" />
              <p>Não foi possível carregar o PDF.</p>
            </div>
          }
        >
          {numPages > 0 && pageWidth > 0 && (
            <HTMLFlipBook
              key={String(isMobile)}
              ref={flipBookRef}
              width={pageWidth}
              height={pageHeight}
              size="fixed"
              minWidth={100}
              maxWidth={1000}
              minHeight={100}
              maxHeight={1600}
              drawShadow
              flippingTime={800}
              usePortrait={isMobile}
              startZIndex={10}
              autoSize={false}
              maxShadowOpacity={0.5}
              showCover
              mobileScrollSupport
              useMouseEvents
              showPageCorners
              swipeDistance={20}
              disableFlipByClick={false}
              clickEventForward
              className=""
              style={{}}
              startPage={0}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onFlip={(e: any) => setCurrentPage(e.data)}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <FlipPage
                  key={i}
                  pageNumber={i + 1}
                  width={pageWidth}
                  height={pageHeight}
                />
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {/* Navigation bar */}
      {numPages > 0 && (
        <div className="w-full flex items-center justify-center gap-4 py-4 border-t border-white/6 bg-[#0a0c10]/80">
          <button
            onClick={goToPrev}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/10 hover:border-[#00a6f0]"
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>
          <span className="text-white/40 text-sm tabular-nums min-w-24 text-center">
            {pageLabel}
          </span>
          <button
            onClick={goToNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/10 hover:border-[#00a6f0]"
          >
            <span>Próxima</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
