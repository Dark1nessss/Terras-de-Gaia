import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ 
  text = "A carregar...",
  fullscreen = false,
  size = 'md'
}: LoadingSpinnerProps) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';
  const container = fullscreen ? 'fixed inset-0 z-50' : 'relative';
  const flexContainer = fullscreen ? 'flex items-center justify-center' : 'flex flex-col items-center justify-center';

  return (
    <div className={`${container} ${flexContainer} ${fullscreen ? 'py-0' : 'py-12'} gap-4 bg-[#0a0c10]`}>
      <div className="flex gap-1">
        {[0, 0.1, 0.2].map((delay) => (
          <div
            key={delay}
            className={`${dotSize} rounded-full bg-[#00a6f0] animate-bounce`}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <p className="text-white/40 text-sm uppercase font-black italic tracking-widest">{text}</p>
    </div>
  );
}