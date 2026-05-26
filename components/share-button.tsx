"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { SOCIAL_LINKS } from "@/lib/contact";

interface ShareButtonProps {
  title: string;
  season?: number;
  episode?: number;
}

export function ShareButton({ title, season, episode }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      // Automatically build URL from current pathname
      const fullPath = baseUrl + pathname;
      setCurrentUrl(fullPath);
    }
  }, [pathname]);

  const shareTitle = season && episode 
    ? `${title} - S${season.toString().padStart(2, '0')}E${episode.toString().padStart(2, '0')}`
    : title;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "Facebook",
      href: SOCIAL_LINKS.facebook + `?u=${encodeURIComponent(currentUrl)}`,
      color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/20",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      name: "X / Twitter",
      href: SOCIAL_LINKS.twitter + `?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: "hover:text-white hover:bg-white/10 hover:border-white/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.6.75h2.45l-5.34 5.92L16 15.25H11.1l-3.9-5.18L2.55 15.25H.1l5.72-6.35L0 .75h5.05l3.52 4.67L12.6.75zm-.24 13.5h1.28l-5.68-7.85H6.28l5.88 7.85z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: SOCIAL_LINKS.whatsapp + `?text=${encodeURIComponent(`${shareTitle} - ${currentUrl}`)}`,
      color: "hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48C18.45 1.40 15.56 0.24 12.47 0.24 6.08 0.24 0.96 5.36 0.96 11.76c0 2.07 0.54 4.08 1.57 5.87L0.84 23.76l6.32-1.66c1.71 0.94 3.64 1.43 5.63 1.43 6.39 0 11.51-5.12 11.51-11.51 0-3.08-1.16-5.97-3.28-8.15zm-8.05 17.65c-1.76 0-3.49-0.47-5-1.35l-0.36-0.21-3.71 0.97 0.99-3.62-0.23-0.36c-1.02-1.62-1.56-3.50-1.56-5.43 0-5.30 4.32-9.62 9.62-9.62 2.57 0 4.98 1.00 6.80 2.82 1.82 1.82 2.82 4.23 2.82 6.80 0 5.30-4.32 9.62-9.62 9.62zm5.27-7.20c-0.29-0.15-1.70-0.84-1.96-0.94-0.26-0.09-0.46-0.14-0.65 0.14-0.19 0.29-0.74 0.93-0.91 1.12-0.17 0.19-0.34 0.22-0.63 0.07-0.29-0.15-1.22-0.45-2.32-1.43-0.86-0.76-1.44-1.70-1.61-1.99-0.17-0.29-0.02-0.44 0.13-0.59 0.13-0.13 0.29-0.33 0.43-0.50 0.14-0.17 0.19-0.29 0.29-0.48 0.09-0.19 0.05-0.36-0.02-0.50-0.07-0.14-0.65-1.56-0.89-2.14-0.24-0.56-0.47-0.48-0.65-0.49-0.17-0.01-0.36-0.01-0.55-0.01-0.19 0-0.50 0.07-0.77 0.36-0.26 0.29-1.01 0.98-1.01 2.40 0 1.41 1.03 2.78 1.17 2.97 0.14 0.19 2.03 3.10 4.92 4.34 0.69 0.30 1.22 0.47 1.64 0.60 0.69 0.22 1.32 0.19 1.81 0.11 0.55-0.08 1.70-0.70 1.94-1.37 0.24-0.67 0.24-1.25 0.17-1.37-0.07-0.12-0.26-0.19-0.55-0.34z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: SOCIAL_LINKS.instagram + "/",
      color: "hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
          <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 flex items-center justify-center rounded bg-white/[0.02] text-white/30 border border-white/5 transition-all duration-300 ${link.color}`}
          title={`Partilhar no ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className={`h-10 px-4 flex items-center gap-2 rounded bg-white/[0.02] border border-white/5 text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
          copied
            ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
            : "text-white/40 hover:text-[#006ec2] hover:bg-[#006ec2]/5 hover:border-[#006ec2]/20"
        }`}
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        <span className="font-bold hidden sm:block cursor-pointer"> {copied ? "Copiado!" : "Copiar"}</span>
      </button>
    </div>
  );
}