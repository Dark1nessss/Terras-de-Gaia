"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

export const PdfViewer = dynamic(
  () => import('./pdf-viewer').then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-125 bg-[#0d0f14] rounded-xl border border-white/6">
        <Loader2 className="animate-spin text-[#006ec2]" size={40} />
      </div>
    ),
  }
);
