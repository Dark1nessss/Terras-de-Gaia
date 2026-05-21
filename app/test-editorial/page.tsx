/**
 * TEST PAGE â€” "Front Page" Editorial Layout v3
 * Visit /test-editorial to preview.
 * Change PREVIEW_SLUG to test any category.
 */

import { getPostsByCategoryPaginated, getCategoryBySlug } from "@/lib/wp";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { AdPlaceholder } from "@/components/ad-placeholder";
import { Breadcrumb } from "@/components/breadcrumb";
import { decodeHtml, stripHtml } from "@/lib/decode-html";
import { formatDate } from "@/lib/date";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Radio, TrendingUp } from "lucide-react";

// â”€â”€ Change this slug to preview any section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PREVIEW_SLUG = "opiniao";

const ACCENTS: Record<string, string> = {
  informacao: "#00a6f0",
  cultura:    "#f59e0b",
  opiniao:    "#8b5cf6",
  politica:   "#ef4444",
  desporto:   "#ef4444",
  default:    "#00a6f0",
};

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (mins  < 60) return `hÃ¡ ${mins}m`;
  if (hours < 24) return `hÃ¡ ${hours}h`;
  return `hÃ¡ ${days}d`;
}

function isRecent(dateStr: string) {
  return Date.now() - new Date(dateStr).getTime() < 6 * 60 * 60 * 1000;
}

export default async function EditorialTestPage() {
  const slug   = PREVIEW_SLUG;
  const accent = ACCENTS[slug] ?? ACCENTS.default;

  const [category, { posts, totalPosts }] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategoryPaginated(slug, 1, 18),
  ]);

  const categoryName =
    category?.name ??
    slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

  if (!posts?.length) {
    return (
      <div className="min-h-screen bg-[#080a0d] flex items-center justify-center font-nurom">
        <p className="text-white/20 text-4xl font-black uppercase italic">
          Sem artigos â€” muda PREVIEW_SLUG
        </p>
      </div>
    );
  }

  /* â”€â”€ Slice posts into zones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const [lead, sideA, sideB, featA, featB, ...tail] = posts;
  const wireStories  = tail.slice(0, 5);
  const gridPosts    = tail.slice(5);
  const gridFeatA    = gridPosts[0] ?? null;
  const gridFeatB    = gridPosts[1] ?? null;
  const gridFeatC    = gridPosts[2] ?? null;
  const gridRest     = gridPosts.slice(3);

  const leadImg  = lead._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const sideAImg = sideA?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const sideBImg = sideB?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const featAImg     = featA?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const featBImg     = featB?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const gridFeatAImg = gridFeatA?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const gridFeatBImg = gridFeatB?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const gridFeatCImg = gridFeatC?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;

  const wire0        = wireStories[0] ?? null;
  const wire0Img     = wire0?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const wire0Excerpt = wire0 ? decodeHtml(stripHtml(wire0.excerpt?.rendered ?? "")).slice(0, 160) : "";

  const leadExcerpt = decodeHtml(stripHtml(lead.excerpt?.rendered ?? "")).slice(0, 200);

  return (
    <main className="min-h-screen bg-[#080a0d] text-white font-nurom">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MASTHEAD â€” publication bar
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="pt-24 border-b border-white/4">
        <div className="container mx-auto px-6">
          <Breadcrumb items={[{ label: "Inicial", href: "/" }]} current={categoryName} />
        </div>

        {/* Newspaper-style meta bar */}
        <div className="container mx-auto px-6 flex items-center justify-between py-3 border-b border-white/4 mt-3">
          <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
            <span>Terras de Gaia</span>
            <span className="text-white/10">Â·</span>
            <span>{formatDate(new Date().toISOString(), "short")}</span>
            <span className="text-white/10">Â·</span>
            <span>{totalPosts} artigos</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span
              className="text-[9px] font-black uppercase tracking-[0.4em]"
              style={{ color: accent }}
            >
              {categoryName}
            </span>
          </div>
        </div>

        {/* Typographic section title â€” massive, bleeds to the right on purpose */}
        <div className="relative overflow-hidden">
          <h1
            className="font-black uppercase italic tracking-tighter leading-none py-4 px-6 select-none"
            style={{
              fontSize: "clamp(5rem, 16vw, 18rem)",
              lineHeight: 0.82,
              WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              color: "transparent",
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {categoryName}
          </h1>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TICKER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        className="overflow-hidden border-b border-white/5 py-2.5"
        style={{ backgroundColor: `${accent}12` }}
      >
        <div className="animate-marquee flex gap-0 w-max">
          {[...posts.slice(0, 7), ...posts.slice(0, 7)].map((p, i) => (
            <Link
              key={i}
              href={`/post/${p.slug}`}
              className="flex items-center gap-4 px-10 whitespace-nowrap group"
            >
              {isRecent(p.date) && (
                <span className="relative flex size-1.5 shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    className="relative inline-flex size-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                </span>
              )}
              <span
                className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:underline"
                style={{ color: accent }}
              >
                {p.title.rendered.replace(/<[^>]*>/g, "").slice(0, 70)}
              </span>
              <span className="text-white/10 text-xs select-none">â—†</span>
            </Link>
          ))}
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOSAIC â€” lead (8) + 2 stacked sides (4)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/4"
        style={{ minHeight: "min(70vh, 720px)" }}
      >
        {/* LEAD */}
        <Link
          href={`/post/${lead.slug}`}
          className="group relative md:col-span-8 overflow-hidden bg-zinc-950"
          style={{ minHeight: "min(70vh, 720px)" }}
        >
          {leadImg && (
            <Image
              src={leadImg}
              alt={decodeHtml(lead.title.rendered)}
              fill priority
              className="object-cover brightness-45 group-hover:brightness-55 group-hover:scale-[1.02] transition-all duration-700"
            />
          )}
          {!leadImg && (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}20 0%, transparent 60%)` }} />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#080a0d] via-[#080a0d]/25 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#080a0d]/50 via-transparent to-transparent" />

          {/* Left accent stripe */}
          <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: accent }} />

          {/* Top-left badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 text-black text-[10px] font-black px-2.5 py-1 uppercase tracking-[0.2em]"
              style={{ backgroundColor: accent }}
            >
              <Radio size={9} strokeWidth={3} />
              {categoryName}
            </span>
            {isRecent(lead.date) && (
              <span className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                <span className="relative flex size-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                Recente
              </span>
            )}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.88] mb-4"
              dangerouslySetInnerHTML={{ __html: lead.title.rendered }}
            />
            {leadExcerpt && (
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2 max-w-xl mb-5">
                {leadExcerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/30">
              <span className="text-white/60">{lead.author_name}</span>
              <span className="text-white/15">â€”</span>
              <span>{timeAgo(lead.date)}</span>
              <span
                className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: accent }}
              >
                Ler artigo <ArrowUpRight size={13} />
              </span>
            </div>
          </div>
        </Link>

        {/* SIDE STORIES */}
        <div className="md:col-span-4 grid grid-rows-2 gap-px" style={{ minHeight: "min(70vh, 720px)" }}>
          {sideA && (
            <Link href={`/post/${sideA.slug}`} className="group relative overflow-hidden bg-zinc-950">
              {sideAImg && (
                <Image src={sideAImg} alt={decodeHtml(sideA.title.rendered)} fill
                  className="object-cover brightness-40 group-hover:brightness-55 group-hover:scale-[1.04] transition-all duration-500" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
              {/* Top border */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
              <div className="absolute bottom-0 p-5 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                  {sideA.category?.name ?? categoryName}
                </span>
                <h3
                  className="text-lg font-black uppercase italic tracking-tighter leading-[0.9] line-clamp-3 group-hover:text-white/90 transition-colors"
                  dangerouslySetInnerHTML={{ __html: sideA.title.rendered }}
                />
                <p className="text-[10px] text-white/25 font-bold uppercase tracking-widest">
                  {sideA.author_name} Â· {timeAgo(sideA.date)}
                </p>
              </div>
            </Link>
          )}

          {sideB && (
            <Link href={`/post/${sideB.slug}`} className="group relative overflow-hidden bg-zinc-950">
              {sideBImg ? (
                <>
                  <Image src={sideBImg} alt={decodeHtml(sideB.title.rendered)} fill
                    className="object-cover brightness-30 group-hover:brightness-45 group-hover:scale-[1.04] transition-all duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: `${accent}08` }} />
              )}
              <div className="absolute bottom-0 p-5 space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                  {sideB.category?.name ?? categoryName}
                </span>
                <h3
                  className="text-lg font-black uppercase italic tracking-tighter leading-[0.9] line-clamp-3 group-hover:text-white/90 transition-colors text-white/80"
                  dangerouslySetInnerHTML={{ __html: sideB.title.rendered }}
                />
                <p className="text-[10px] text-white/25 font-bold uppercase tracking-widest">
                  {sideB.author_name} Â· {timeAgo(sideB.date)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SUB-FEATURE STRIP â€” 2 horizontal story cards (stories 4 + 5)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {(featA || featB) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/4 border-t border-white/4">
          {[featA, featB].filter(Boolean).map((post, i) => {
            const img = i === 0 ? featAImg : featBImg;
            const excerpt = decodeHtml(stripHtml(post.excerpt?.rendered ?? "")).slice(0, 120);
            return (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group flex bg-[#080a0d] hover:bg-white/2.5 transition-colors"
                style={{ minHeight: "180px" }}
              >
                {/* Image panel */}
                {img && (
                  <div className="relative w-2/5 shrink-0 overflow-hidden">
                    <Image
                      src={img}
                      alt={decodeHtml(post.title.rendered)}
                      fill
                      className="object-cover brightness-50 group-hover:brightness-65 group-hover:scale-[1.04] transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#080a0d]/30" />
                    {/* Accent left stripe */}
                    <div className="absolute top-0 bottom-0 left-0 w-0.5" style={{ backgroundColor: accent }} />
                  </div>
                )}

                {/* Text panel */}
                <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                        {post.category?.name ?? categoryName}
                      </span>
                      {isRecent(post.date) && (
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accent }} />
                          <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-base md:text-lg font-black uppercase italic tracking-tighter leading-[0.9] line-clamp-3 group-hover:text-white transition-colors text-white/85"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    {excerpt && (
                      <p className="text-white/30 text-xs leading-relaxed line-clamp-2 hidden md:block">
                        {excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/25 mt-3">
                    <span>{post.author_name}</span>
                    <span>{timeAgo(post.date)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════
          WIRE FEED — featured lead + compact rows
      ══════════════════════════════════════════════════════════════ */}
      {wireStories.length > 0 && (
        <section className="border-y border-white/5" style={{ backgroundColor: "#06080b" }}>

          {/* Live header bar */}
          <div
            className="flex items-center gap-4 px-6 py-3.5"
            style={{ backgroundColor: `${accent}16`, borderBottom: `1px solid ${accent}25` }}
          >
            <span className="relative flex size-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: accent }} />
              <span className="relative inline-flex size-2.5 rounded-full" style={{ backgroundColor: accent }} />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.5em]" style={{ color: accent }}>
              Últimas Notícias
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: `${accent}20` }} />
            <div className="flex items-center gap-1.5 text-white/20">
              <TrendingUp size={10} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{wireStories.length} destaques</span>
            </div>
          </div>

          {/* Big first story */}
          {wire0 && (
            <Link
              href={`/post/${wire0.slug}`}
              className="group grid md:grid-cols-5 border-b border-white/5"
              style={{ minHeight: "260px" }}
            >
              {/* Image panel */}
              <div className="relative md:col-span-2 overflow-hidden bg-zinc-950" style={{ minHeight: "190px" }}>
                {wire0Img ? (
                  <Image
                    src={wire0Img}
                    alt={decodeHtml(wire0.title.rendered)}
                    fill
                    className="object-cover brightness-45 group-hover:brightness-62 group-hover:scale-[1.03] transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}15 0%, transparent 70%)` }} />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#06080b]/50" />
                <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
                <div className="absolute top-4 left-5">
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.35em] px-2.5 py-1"
                    style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}
                  >
                    {wire0.category?.name ?? categoryName}
                  </span>
                </div>
              </div>

              {/* Content panel */}
              <div className="md:col-span-3 flex flex-col justify-between px-8 py-7 gap-4">
                <div className="space-y-3">
                  {isRecent(wire0.date) && (
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accent }} />
                        <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: accent }} />
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-[0.5em]" style={{ color: accent }}>Recente</span>
                    </div>
                  )}
                  <h3
                    className="text-xl md:text-2xl lg:text-[1.75rem] font-black uppercase italic tracking-tighter leading-[0.88] group-hover:text-white/90 transition-colors"
                    dangerouslySetInnerHTML={{ __html: wire0.title.rendered }}
                  />
                  {wire0Excerpt && (
                    <p className="text-white/35 text-sm leading-relaxed line-clamp-2 hidden sm:block">
                      {wire0Excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/25 border-t border-white/5 pt-4">
                  <span className="text-white/45">{wire0.author_name}</span>
                  <span className="text-white/10">—</span>
                  <span style={{ color: `${accent}75` }}>{timeAgo(wire0.date)}</span>
                  <span
                    className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: accent }}
                  >
                    Ler <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Compact rows 2–5 */}
          <div className="container mx-auto px-6 divide-y divide-white/4">
            {wireStories.slice(1).map((post, i) => {
              const thumb = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
              return (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="group flex items-center -mx-6 hover:bg-white/2 transition-colors"
                >
                  <div
                    className="self-stretch w-0.5 shrink-0 opacity-25 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: accent }}
                  />
                  <span
                    className="text-[10px] font-black tabular-nums shrink-0 w-10 text-center"
                    style={{ color: `${accent}45` }}
                  >
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1 py-4 pr-4 min-w-0">
                    <h3
                      className="text-sm font-black uppercase italic tracking-tighter leading-tight text-white/60 group-hover:text-white transition-colors line-clamp-1 mb-0.5"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest">
                      <span className="text-white/20 hidden sm:block">{post.author_name}</span>
                      <span style={{ color: `${accent}60` }}>{timeAgo(post.date)}</span>
                      {isRecent(post.date) && (
                        <span className="text-red-400/60 text-[8px] font-black uppercase">● recente</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 pr-4 py-2.5">
                    {thumb ? (
                      <div className="relative size-14 overflow-hidden">
                        <Image src={thumb} alt="" fill className="object-cover brightness-60 group-hover:brightness-80 transition-all" />
                      </div>
                    ) : (
                      <div className="size-14 bg-white/4" />
                    )}
                  </div>
                  <ArrowUpRight
                    size={12}
                    className="shrink-0 mr-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: accent }}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MAIS ARTIGOS + SIDEBAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Main column */}
          <div className="lg:col-span-9">

            {/* Section header — solid accent pill */}
            <div className="flex items-center gap-0 mb-10">
              <div className="px-4 py-2 shrink-0" style={{ backgroundColor: accent }}>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">Mais Artigos</span>
              </div>
              <div className="h-px flex-1" style={{ backgroundColor: `${accent}22` }} />
              <span className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-white/20 border border-white/5">
                {Math.max(0, totalPosts - 8)} artigos
              </span>
            </div>

            {/* Wide horizontal lead card */}
            {gridFeatA && (
              <Link
                href={`/post/${gridFeatA.slug}`}
                className="group grid md:grid-cols-5 bg-zinc-950 overflow-hidden border border-white/5 mb-px"
                style={{ minHeight: "300px" }}
              >
                <div className="relative md:col-span-2 bg-black overflow-hidden" style={{ minHeight: "200px" }}>
                  {gridFeatAImg ? (
                    <Image
                      src={gridFeatAImg}
                      alt={decodeHtml(gridFeatA.title.rendered)}
                      fill
                      className="object-cover brightness-40 group-hover:brightness-55 group-hover:scale-[1.04] transition-all duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 70%)` }} />
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-950/60" />
                  <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
                </div>
                <div className="md:col-span-3 flex flex-col justify-between px-7 py-8 gap-5 border-t md:border-t-0 md:border-l border-white/5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.45em]" style={{ color: accent }}>
                        {gridFeatA.category?.name ?? categoryName}
                      </span>
                      {isRecent(gridFeatA.date) && (
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accent }} />
                          <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        </span>
                      )}
                    </div>
                    <h2
                      className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-[0.88] group-hover:text-white/90 transition-colors"
                      dangerouslySetInnerHTML={{ __html: gridFeatA.title.rendered }}
                    />
                    {(() => {
                      const ex = decodeHtml(stripHtml(gridFeatA.excerpt?.rendered ?? "")).slice(0, 180);
                      return ex ? <p className="text-white/30 text-sm leading-relaxed line-clamp-3 hidden md:block">{ex}</p> : null;
                    })()}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/25 border-t border-white/5 pt-4">
                    <span>{gridFeatA.author_name}</span>
                    <span className="text-white/10">—</span>
                    <span style={{ color: `${accent}65` }}>{timeAgo(gridFeatA.date)}</span>
                    <span
                      className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accent }}
                    >
                      Ler artigo <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* 2-col image card grid */}
            {(gridFeatB || gridFeatC) && (
              <div className="grid grid-cols-2 gap-px bg-white/4 border border-white/5 border-t-0 mb-8">
                {[gridFeatB, gridFeatC].filter(Boolean).map((post, i) => {
                  const img = i === 0 ? gridFeatBImg : gridFeatCImg;
                  const ex = decodeHtml(stripHtml(post.excerpt?.rendered ?? "")).slice(0, 100);
                  return (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="group relative overflow-hidden bg-zinc-950"
                      style={{ minHeight: "220px" }}
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt={decodeHtml(post.title.rendered)}
                          fill
                          className="object-cover brightness-30 group-hover:brightness-50 group-hover:scale-[1.04] transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}10 0%, transparent 70%)` }} />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#080a0d] via-[#080a0d]/45 to-transparent" />
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: `${accent}70` }} />
                      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                          {post.category?.name ?? categoryName}
                        </span>
                        <h3
                          className="text-[1.05rem] font-black uppercase italic tracking-tighter leading-[0.9] line-clamp-2 group-hover:text-white transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                        {ex && <p className="text-white/25 text-[11px] leading-relaxed line-clamp-1 hidden sm:block">{ex}</p>}
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/20 pt-1">
                          <span>{post.author_name}</span>
                          <span style={{ color: `${accent}55` }}>{timeAgo(post.date)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Inline ad */}
            <div className="py-5 flex flex-col gap-1.5 border-y border-white/5 mb-8">
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/10 text-center">Publicidade</span>
              <AdPlaceholder position="inline" />
            </div>

            {/* Infinite scroll */}
            {gridRest.length > 0 ? (
              <InfiniteScrollPosts slug={slug} initialPosts={gridRest} variant="grid-3" />
            ) : gridPosts.length === 0 ? (
              <p className="text-white/15 text-sm uppercase tracking-widest italic">Sem mais artigos.</p>
            ) : null}
          </div>

          {/* ── Sidebar */}
          <aside className="lg:col-span-3 space-y-8 sticky top-32 self-start">

            {/* Top ad */}
            <AdPlaceholder position="sidebar" />

            {/* Destaques widget */}
            <div className="overflow-hidden" style={{ border: `1px solid ${accent}20` }}>
              <div className="px-4 py-2.5" style={{ backgroundColor: accent }}>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-black">Destaques</span>
              </div>

              {/* #1 image card */}
              <Link href={`/post/${lead.slug}`} className="group relative block overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {leadImg ? (
                  <Image
                    src={leadImg}
                    alt={decodeHtml(lead.title.rendered)}
                    fill
                    className="object-cover brightness-35 group-hover:brightness-50 group-hover:scale-[1.03] transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ backgroundColor: `${accent}10` }} />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
                <div className="absolute bottom-0 left-0 right-0 p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: accent }}>01</span>
                    <div className="h-px flex-1" style={{ backgroundColor: `${accent}30` }} />
                  </div>
                  <p
                    className="text-xs font-black uppercase italic leading-snug line-clamp-2 group-hover:text-white transition-colors text-white/85"
                    dangerouslySetInnerHTML={{ __html: lead.title.rendered }}
                  />
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{timeAgo(lead.date)}</p>
                </div>
              </Link>

              {/* Rows #2–5 with thumbnails */}
              <div className="divide-y divide-white/5">
                {[sideA, sideB, featA, featB].filter(Boolean).slice(0, 4).map((p, i) => {
                  const pImg = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
                  return (
                    <Link
                      key={p.id}
                      href={`/post/${p.slug}`}
                      className="group flex items-center gap-3 px-3 py-3 hover:bg-white/3 transition-colors"
                    >
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <span className="text-[8px] font-black uppercase tracking-[0.35em]" style={{ color: `${accent}65` }}>
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <p
                          className="text-[11px] font-black uppercase italic leading-snug line-clamp-2 text-white/50 group-hover:text-white transition-colors"
                          dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                        />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">{timeAgo(p.date)}</p>
                      </div>
                      <div className="relative size-14 shrink-0 overflow-hidden">
                        {pImg ? (
                          <Image src={pImg} alt="" fill className="object-cover brightness-55 group-hover:brightness-80 transition-all" />
                        ) : (
                          <div className="absolute inset-0 bg-white/5" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Second ad */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/10 text-center">Publicidade</span>
              <AdPlaceholder position="sidebar" />
            </div>

            {/* Tendências widget — ghost numbers */}
            <div className="overflow-hidden border border-white/6">
              <div className="px-4 py-2.5 border-b border-white/6">
                <span className="text-[9px] font-black uppercase tracking-[0.5em]" style={{ color: accent }}>Tendências</span>
              </div>
              <div className="divide-y divide-white/5">
                {wireStories.slice(0, 3).map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/post/${p.slug}`}
                    className="group relative overflow-hidden block px-4 py-5 hover:bg-white/3 transition-colors"
                  >
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[5.5rem] font-black tabular-nums leading-none select-none pointer-events-none"
                      style={{ color: `${accent}07` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative z-10 space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: `${accent}60` }}>
                        {p.category?.name ?? categoryName}
                      </span>
                      <p
                        className="text-[11px] font-black uppercase italic leading-snug line-clamp-2 text-white/50 group-hover:text-white transition-colors pr-10"
                        dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                      />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">{timeAgo(p.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Dev notice */}
      <div className="container mx-auto px-6 pb-16">
        <div className="border border-dashed border-white/5 p-4 text-center text-white/10 text-xs font-mono">
          ðŸ§ª TEST v3 â€” Slug: <strong className="text-white/25">{slug}</strong> â€” edita{" "}
          <code>PREVIEW_SLUG</code> em <code>app/test-editorial/page.tsx</code>
        </div>
      </div>
    </main>
  );
}
