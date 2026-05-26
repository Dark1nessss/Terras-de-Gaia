import Image from "next/image";
import Link from "next/link";
import { getPostsByCategoryPaginated } from "@/lib/wp";
import { decodeHtml, stripHtml } from "@/lib/decode-html";
import { formatDate } from "@/lib/date";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";

const CAT_COLOR: Record<string, string> = {
  desporto: "#00a6f0", futebol: "#00a6f0", basquetebol: "#f59e0b",
  voleibol: "#10b981", trail: "#ec4899", cultura: "#a78bfa",
  sociedade: "#34d399", politica: "#f87171", economia: "#fb923c",
};
const cc = (slug?: string) => CAT_COLOR[slug ?? ""] ?? "#00a6f0";

type P = Record<string, unknown> & {
  id: number; slug: string;
  title: { rendered: string };
  date: string; author_name?: string;
  excerpt?: { rendered: string };
  category?: { slug: string; name: string };
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
};

const psrc  = (p: P) => p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
const txt   = (h: string) => decodeHtml(stripHtml(h));
const excr  = (p: P, n = 180) => txt(p.excerpt?.rendered ?? "").slice(0, n);

// ── Reusable pieces ───────────────────────────────────────────────────────────

function CatLabel({ p, size = "md" }: { p: P; size?: "sm" | "md" | "lg" }) {
  const accent = cc(p.category?.slug);
  const cls = size === "lg"
    ? "text-[11px] px-3 py-1 tracking-[0.45em]"
    : size === "sm"
      ? "text-[8px] px-2 py-0.5 tracking-[0.35em]"
      : "text-[9px] px-2.5 py-0.5 tracking-[0.4em]";
  return (
    <span className={`font-black uppercase inline-block ${cls}`}
      style={{ backgroundColor: accent, color: "#07090c" }}>
      {p.category?.name ?? "Noticia"}
    </span>
  );
}


function SectionBand({
  label, accent = "#00a6f0", href,
}: { label: string; accent?: string; href?: string }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      <div className="flex items-center gap-4 border border-white/10 px-5 py-3 bg-white/3">
        <div className="w-0.75 h-4 rounded-full" style={{ backgroundColor: accent }} />
        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">
          {label}
        </span>
      </div>
      <div className="h-px flex-1 bg-white/8" />
      {href && (
        <Link href={href}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#006ec2] transition-colors border border-white/10 px-4 py-3">
          Ver tudo <ArrowRight size={10} />
        </Link>
      )}
    </div>
  );
}

// ── LATEST sidebar rows (rendered next to hero) ────────────────────────────────
function LatestRow({ post, rank }: { post: P; rank: number }) {
  const accent = cc(post.category?.slug);
  return (
    <Link href={`/post/${post.slug}`}
      className="group flex gap-3 items-start px-5 py-4 hover:bg-white/3 transition-colors border-b border-white/6 last:border-0">
      <span className="text-2xl font-black italic tabular-nums leading-none shrink-0 mt-0.5 w-5 text-right"
        style={{ color: `${accent}28` }}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-[8px] font-black uppercase tracking-widest block mb-1" style={{ color: accent }}>
          {post.category?.name}
        </span>
        <h4
          className="text-[13px] font-black uppercase italic tracking-tight leading-snug line-clamp-2 group-hover:text-[#006ec2] transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <span className="text-[9px] text-white/25 tabular-nums mt-1 block">
          {formatDate(post.date, "short")}
        </span>
      </div>
    </Link>
  );
}

// ── THREE-UP secondary strip ───────────────────────────────────────────────────
function ThreeCard({ post }: { post: P }) {
  const image  = psrc(post);
  const accent = cc(post.category?.slug);
  const excerpt = excr(post, 120);

  return (
    <Link href={`/post/${post.slug}`} className="group flex flex-col gap-0 border border-white/8 overflow-hidden">
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-950">
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover brightness-70 group-hover:brightness-90 group-hover:scale-[1.03] transition-all duration-500"
          />
        ) : <div className="absolute inset-0 bg-zinc-900" />}
        <div className="absolute top-0 left-0 right-0 h-0.75" style={{ backgroundColor: accent }} />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <CatLabel p={post} size="sm" />
        <h3
          className="mt-3 text-xl md:text-2xl font-black uppercase italic tracking-tight leading-tight mb-3 group-hover:text-[#006ec2] transition-colors flex-1"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        {excerpt && (
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-white/6 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>{post.author_name}</span>
          <span className="tabular-nums">{formatDate(post.date, "short")}</span>
        </div>
      </div>
    </Link>
  );
}

// ── BREAKING ASYMMETRIC: 1 big lead + 3 smaller ──────────────────────────────
function BreakingLead({ post }: { post: P }) {
  const image  = psrc(post);
  const accent = cc(post.category?.slug);
  const excerpt = excr(post, 200);

  return (
    <Link href={`/post/${post.slug}`}
      className="group flex flex-col border border-white/8 overflow-hidden h-full">
      <div className="relative w-full aspect-4/3 overflow-hidden bg-zinc-950">
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover brightness-70 group-hover:brightness-88 group-hover:scale-[1.02] transition-all duration-600"
          />
        ) : <div className="absolute inset-0 bg-zinc-900" />}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
        {/* Zap icon badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#07090c]/90 border border-white/10 px-2.5 py-1.5">
          <Zap size={10} style={{ color: accent }} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]" style={{ color: accent }}>
            Destaque
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <CatLabel p={post} size="md" />
        <h3
          className="mt-4 text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-tight mb-4 group-hover:text-[#006ec2] transition-colors flex-1"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        {excerpt && (
          <p className="text-white/45 text-sm leading-relaxed line-clamp-3 mb-4">{excerpt}</p>
        )}
        <div className="flex items-center gap-3 pt-4 border-t border-white/6 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>{post.author_name}</span>
          <span className="text-white/15">·</span>
          <span className="tabular-nums">{formatDate(post.date, "short")}</span>
          <ChevronRight size={12} className="ml-auto text-white/20 group-hover:text-[#006ec2] transition-colors" />
        </div>
      </div>
    </Link>
  );
}

function BreakingSmall({ post }: { post: P }) {
  const image  = psrc(post);
  const accent = cc(post.category?.slug);

  return (
    <Link href={`/post/${post.slug}`}
      className="group flex gap-4 border border-white/8 p-4 hover:bg-white/2 transition-colors">
      {image && (
        <div className="relative shrink-0 w-24 h-18 overflow-hidden bg-zinc-900">
          <Image src={image} alt="" fill sizes="96px"
            className="object-cover brightness-65 group-hover:brightness-82 transition-all duration-400"
          />
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <CatLabel p={post} size="sm" />
        <h4
          className="mt-2 text-[15px] font-black uppercase italic tracking-tight leading-snug line-clamp-2 group-hover:text-[#006ec2] transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <span className="text-[9px] text-white/25 tabular-nums mt-1.5 block">
          {formatDate(post.date, "short")}
        </span>
      </div>
    </Link>
  );
}

// ── FULL-WIDTH FEATURE BAND ────────────────────────────────────────────────────
function FeatureBand({ post }: { post: P }) {
  const image  = psrc(post);
  const accent = cc(post.category?.slug);
  const excerpt = excr(post, 260);

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <div className="grid grid-cols-1 md:grid-cols-2 border border-white/8 overflow-hidden">
        <div className="relative h-72 md:h-auto min-h-72 overflow-hidden bg-zinc-950">
          {image ? (
            <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover brightness-70 group-hover:brightness-88 group-hover:scale-[1.02] transition-all duration-600"
            />
          ) : <div className="absolute inset-0 bg-zinc-900" />}
          <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-between bg-[#0a0c10]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CatLabel p={post} size="lg" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 tabular-nums">
                {formatDate(post.date, "short")}
              </span>
            </div>
            <h3
              className="text-3xl md:text-4xl xl:text-5xl font-black uppercase italic tracking-tighter leading-[0.9] mb-5 group-hover:text-[#006ec2] transition-colors"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            {excerpt && (
              <p className="text-white/50 text-base leading-relaxed line-clamp-4">{excerpt}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/35">
              {post.author_name}
            </span>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest"
              style={{ color: accent }}>
              Ler artigo <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── LATEST NEWS table rows ─────────────────────────────────────────────────────
function TableRow({ post }: { post: P }) {
  const image  = psrc(post);
  const accent = cc(post.category?.slug);

  return (
    <Link href={`/post/${post.slug}`}
      className="group flex gap-5 items-start py-5 border-b border-white/7 last:border-0 hover:bg-white/2 transition-colors -mx-6 px-6">
      {image && (
        <div className="relative shrink-0 w-28 h-18 overflow-hidden bg-zinc-900">
          <Image src={image} alt="" fill sizes="112px"
            className="object-cover brightness-65 group-hover:brightness-85 transition-all duration-400"
          />
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <CatLabel p={post} size="sm" />
          <span className="text-[9px] text-white/25 tabular-nums">{formatDate(post.date, "short")}</span>
        </div>
        <h4
          className="text-base md:text-lg font-black uppercase italic tracking-tight leading-snug line-clamp-2 group-hover:text-[#006ec2] transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <p className="text-[12px] text-white/35 mt-1.5 line-clamp-1">{excr(post, 100)}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 mt-2 text-white/15 group-hover:text-[#006ec2] transition-colors" />
    </Link>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default async function TestNewsPage() {
  const { posts } = await getPostsByCategoryPaginated("desporto", 1, 30);

  if (!posts.length) {
    return (
      <div className="min-h-screen bg-[#07090c] flex items-center justify-center text-white/20 font-black uppercase italic text-2xl">
        Sem conteudos
      </div>
    );
  }

  const hero        = posts[0];
  const latestSide  = posts.slice(1, 7);
  const threeUp     = posts.slice(7, 10);
  const breakLead   = posts[10];
  const breakSmall  = posts.slice(11, 14);
  const featureBand = posts[14];
  const tableRows   = posts.slice(15, 23);

  const todayStr = new Date().toLocaleDateString("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const quickLinks = [
    { label: "Desporto",    href: "/desporto" },
    { label: "Futebol",     href: "/desporto/futebol" },
    { label: "Basquetebol", href: "/desporto/basquetebol" },
    { label: "Voleibol",    href: "/desporto/voleibol" },
    { label: "Trail",       href: "/desporto/trail" },
  ];

  return (
    <main className="min-h-screen bg-[#07090c] text-white font-nurom">

      {/* ── MASTHEAD ────────────────────────────────────────────────────── */}
      <div className="pt-20 border-b border-white/10">
        <div className="container mx-auto px-6">

          {/* Date line */}
          <div className="flex items-center gap-6 py-2.5 border-b border-white/6 text-[9px] font-bold uppercase tracking-[0.5em] text-white/20">
            <span className="tabular-nums">{todayStr}</span>
            <div className="h-px flex-1 bg-white/6" />
            <span>Edicao Digital</span>
          </div>

          {/* Title */}
          <div className="py-7 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
              Terras de Gaia
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.7em] text-white/20 mt-2.5">
              Canal de Televisao &middot; Gazeta Online &middot; Noticias &middot; Desporto &middot; Cultura
            </p>
          </div>

          {/* Quick links */}
          <div className="flex items-stretch border-t border-white/8 overflow-x-auto scrollbar-hide">
            {quickLinks.map((lk) => (
              <Link key={lk.href} href={lk.href}
                className="group flex items-center gap-2.5 px-6 py-3.5 border-r border-white/8 last:border-0 hover:bg-white/4 transition-colors shrink-0">
                <span className="text-[#006ec2] font-black text-base leading-none">&rarr;</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/55 group-hover:text-white transition-colors">
                  {lk.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO + LATEST SIDEBAR ───────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-white/8">

          {/* Hero — 8 cols */}
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-white/8">
            {/* Full-bleed image */}
            {(() => {
              const image  = psrc(hero);
              const accent = cc(hero.category?.slug);
              const excerpt = excr(hero, 240);
              return (
                <Link href={`/post/${hero.slug}`} className="group flex flex-col h-full">
                  <div className="relative w-full h-[50vh] min-h-64 overflow-hidden bg-zinc-950">
                    {image ? (
                      <Image src={image} alt={txt(hero.title.rendered)} fill priority sizes="(max-width:1024px)100vw,67vw"
                        className="object-cover brightness-80 group-hover:brightness-95 group-hover:scale-[1.015] transition-all duration-700"
                      />
                    ) : <div className="absolute inset-0 bg-zinc-900" />}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#07090c] to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
                    <div className="absolute top-5 left-6 flex items-center gap-2">
                      <span className="bg-white text-[#07090c] text-[8px] font-black uppercase tracking-[0.5em] px-2.5 py-1.5">
                        Top Story
                      </span>
                      <CatLabel p={hero} />
                    </div>
                  </div>
                  <div className="p-7 lg:p-9 flex flex-col flex-1">
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.88] mb-5 group-hover:text-[#006ec2] transition-colors duration-400"
                      dangerouslySetInnerHTML={{ __html: hero.title.rendered }}
                    />
                    {excerpt && (
                      <p className="text-white/50 text-base md:text-lg leading-relaxed line-clamp-3 mb-6 max-w-2xl">
                        {excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/8">
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/35">
                        <span>{hero.author_name}</span>
                        <span className="text-white/15">·</span>
                        <span className="tabular-nums">{formatDate(hero.date, "short")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest"
                        style={{ color: accent }}>
                        Ler artigo <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}
          </div>

          {/* Latest sidebar — 4 cols */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="px-5 py-3.5 bg-white/3 border-b border-white/8">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/45">
                Ultimas Noticias
              </span>
            </div>
            {latestSide.map((p, i) => <LatestRow key={p.id} post={p} rank={i + 1} />)}
          </div>
        </div>
      </div>

      {/* ── THREE-UP SECONDARY STORIES ──────────────────────────────────── */}
      <div className="border-t border-white/8 bg-[#050709]">
        <div className="container mx-auto px-6 py-10">
          <SectionBand label="Destaques" href="/" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {threeUp.map((p) => <ThreeCard key={p.id} post={p} />)}
          </div>
        </div>
      </div>

      {/* ── BREAKING: ASYMMETRIC GRID ───────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="container mx-auto px-6 py-10">
          <SectionBand label="Noticias de Hoje" accent="#f59e0b" href="/" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Lead — wider */}
            <div className="lg:col-span-5">
              {breakLead && <BreakingLead post={breakLead} />}
            </div>
            {/* Smaller three — stacked */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {breakSmall.map((p) => <BreakingSmall key={p.id} post={p} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL-WIDTH FEATURE BAND ─────────────────────────────────────── */}
      <div className="border-t border-white/8 bg-[#050709]">
        <div className="container mx-auto px-6 py-10">
          <SectionBand label="Artigo em Destaque" />
          {featureBand && <FeatureBand post={featureBand} />}
        </div>
      </div>

      {/* ── LATEST NEWS TABLE ───────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="container mx-auto px-6 py-10">
          <SectionBand label="Ultimas Noticias" href="/" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            <div>
              {tableRows.slice(0, 4).map((p) => <TableRow key={p.id} post={p} />)}
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/7 pt-5 md:pt-0 md:pl-16">
              {tableRows.slice(4).map((p) => <TableRow key={p.id} post={p} />)}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
