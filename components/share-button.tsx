"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}/post/${slug}`);
    }
  }, [slug]);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
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
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
      color: "hover:text-white hover:bg-white/10 hover:border-white/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.6.75h2.45l-5.34 5.92L16 15.25H11.1l-3.9-5.18L2.55 15.25H.1l5.72-6.35L0 .75h5.05l3.52 4.67L12.6.75zm-.24 13.5h1.28l-5.68-7.85H6.28l5.88 7.85z"/>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`,
      color: "hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.059 3.965L0 16l4.204-1.102a7.833 7.833 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.327-5.608zM7.994 14.492a6.526 6.526 0 0 1-3.328-.909l-.239-.142-2.48.651.664-2.414-.153-.245a6.566 6.566 0 1 1 5.536-2.906z"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      color: "hover:text-[#E1306C] hover:bg-[#E1306C]/10 hover:border-[#E1306C]/20",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.088 3.85.048 4.703.01 5.556 0 5.829 0 8c0 2.171.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.092.333 1.942.372C5.556 15.99 5.829 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.89.923-1.416.198-.51.333-1.092.372-1.942C15.99 10.444 16 10.171 16 8c0-2.171-.01-2.444-.048-3.297-.04-.852-.174-1.433-.372-1.942a3.916 3.916 0 0 0-.923-1.417A3.916 3.916 0 0 0 13.24.42C12.732.222 12.15.088 11.297.048 10.444.01 10.171 0 8 0zm0 1.438c1.936 0 2.17.008 2.936.042.708.032 1.093.146 1.348.244.33.128.567.28.814.526.246.246.398.483.526.814.098.255.212.64.244 1.348.034.766.042 1.001.042 2.936 0 1.936-.008 2.17-.042 2.936-.032.708-.146 1.093-.244 1.348-.128.33-.28.567-.526.814-.246.246-.483.398-.814.526-.255.098-.64.212-1.348.244-.766.034-1.001.042-2.936.042-1.936 0-2.17-.008-2.936-.042-.708-.032-1.093-.146-1.348-.244-.33-.128-.567-.28-.814-.526-.246-.246-.398-.483-.526-.814-.098-.255-.212-.64-.244-1.348-.034-.766-.042-1.001-.042-2.936 0-1.936.008-2.17.042-2.936.032-.708.146-1.093.244-1.348.128-.33.28-.567.526-.814.246-.246.483-.398.814-.526.255-.098.64-.212 1.348-.244.766-.034 1.001-.042 2.936-.042zm0 3.312a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5zm0 1.875A1.375 1.375 0 1 1 8 9.688 1.375 1.375 0 0 1 8 6.438zm4.562-1.571a.76.76 0 1 0 0-1.52.76.76 0 0 0 0 1.52z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-black uppercase text-white/40 tracking-wider mr-1">Partilhar:</span>
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
            : "text-white/40 hover:text-[#00a6f0] hover:bg-[#00a6f0]/5 hover:border-[#00a6f0]/20"
        }`}
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        <span>{copied ? "Copiado!" : "Copiar"}</span>
      </button>
    </div>
  );
}