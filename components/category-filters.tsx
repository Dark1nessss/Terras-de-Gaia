"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";

/* ── Sort options ─────────────────────────────────────────────────────────── */
export const SORT_OPTIONS = [
  { key: "date_desc", label: "Recentes"  },
  { key: "date_asc",  label: "Antigas"   },
  { key: "title_asc", label: "A – Z"     },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function buildUrl(
  pathname: string,
  params: URLSearchParams,
  q: string,
  sort: string
): string {
  const next = new URLSearchParams(params.toString());
  if (q.trim()) { next.set("q", q.trim()); } else { next.delete("q"); }
  if (sort !== "date_desc") { next.set("sort", sort); } else { next.delete("sort"); }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/* ── Props ────────────────────────────────────────────────────────────────── */
export interface CategoryFiltersProps {
  /** Display name for the placeholder text */
  categoryName: string;
  /** Total number of posts in the category */
  totalPosts: number;
  /** Accent colour (hex). Defaults to the site's primary blue. */
  accent?: string;
}

/* ── Component ────────────────────────────────────────────────────────────── */
export function CategoryFilters({
  categoryName,
  totalPosts,
  accent = "#00a6f0",
}: CategoryFiltersProps) {
  const router    = useRouter();
  const pathname  = usePathname();
  const params    = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ    = params.get("q")    ?? "";
  const currentSort = (params.get("sort") ?? "date_desc") as SortKey;

  /* Local input mirrors the URL param; updates immediately while
     the URL push is debounced so the cursor never jumps. */
  const [inputValue, setInputValue] = useState(currentQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  /* Sync input when the URL changes (back/forward navigation) */
  useEffect(() => {
    setInputValue(currentQ);
  }, [currentQ]);

  /* Push new URL after debounce */
  const pushParams = useCallback(
    (q: string, sort: string) => {
      startTransition(() => {
        router.push(buildUrl(pathname, params, q, sort), { scroll: false });
      });
    },
    [router, pathname, params]
  );

  /* Handlers */
  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams(val, currentSort), 400);
  };

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue("");
    pushParams("", currentSort);
    inputRef.current?.focus();
  };

  const isSearching = currentQ.trim().length > 0;
  const isSorted    = currentSort !== "date_desc";
  const isFiltered  = isSearching || isSorted;

  /* Pre-built URLs for the sort <Link> elements */
  const sortUrls = SORT_OPTIONS.reduce<Record<string, string>>((acc, opt) => {
    acc[opt.key] = buildUrl(pathname, params, currentQ, opt.key);
    return acc;
  }, {});

  /* Clear-all URL: removes q, resets sort */
  const clearAllUrl = (() => {
    const next = new URLSearchParams(params.toString());
    next.delete("q");
    next.delete("sort");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  })();

  return (
    <div
      className="sticky top-16 z-30 border-b border-white/5 bg-[#06080b]/95 backdrop-blur-sm"
      style={{ borderTop: isFiltered ? `2px solid ${accent}` : "1px solid transparent" }}
    >
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">

          {/* ── Search input ──────────────────────────────────────────── */}
          <div className="relative flex items-center flex-1 min-w-0">
            {/* Leading icon: spinner when pending, magnifier otherwise */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
              {isPending ? (
                <Loader2
                  size={16}
                  strokeWidth={2.5}
                  className="animate-spin"
                  style={{ color: accent }}
                />
              ) : (
                <Search
                  size={16}
                  strokeWidth={2.5}
                  style={{
                    color: focused || isSearching
                      ? accent
                      : "rgba(255,255,255,0.4)",
                    transition: "color 150ms",
                  }}
                />
              )}
            </span>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={`Pesquisar em ${categoryName}…`}
              autoComplete="off"
              spellCheck={false}
              className="
                w-full bg-transparent pl-7 pr-8 py-2
                text-sm font-bold tracking-wide text-white
                placeholder:text-white/35
                outline-none border-b-2 border-white/12
                transition-[border-color] duration-200
              "
              style={{
                borderBottomColor: focused
                  ? accent
                  : isSearching
                  ? `${accent}45`
                  : undefined,
              }}
            />

            {/* Clear × */}
            {inputValue && (
              <button
                onClick={handleClear}
                aria-label="Limpar pesquisa"
                className="
                  absolute right-0 top-1/2 -translate-y-1/2
                  text-white/45 hover:text-white/80
                  transition-colors p-0.5
                "
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Divider — only on desktop */}
          <div className="hidden sm:block h-5 w-px bg-white/15 shrink-0" />

          {/* ── Sort links ────────────────────────────────────────────── */}
          <nav
            className="flex items-center gap-0 shrink-0"
            aria-label="Ordenar artigos"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mr-4 select-none">
              Ordenar
            </span>

            {SORT_OPTIONS.map((opt, i) => {
              const isActive = currentSort === opt.key;
              return (
                <span key={opt.key} className="flex items-center">
                  <Link
                    href={sortUrls[opt.key]}
                    scroll={false}
                    prefetch={false}
                    className="
                      text-[12px] font-black uppercase tracking-widest
                      pb-0.5 border-b-2 transition-all duration-150
                    "
                    style={
                      isActive
                        ? {
                            color:       accent,
                            borderColor: `${accent}70`,
                          }
                        : {
                            color:       "rgba(255,255,255,0.45)",
                            borderColor: "transparent",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(255,255,255,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(255,255,255,0.45)";
                    }}
                  >
                    {opt.label}
                  </Link>
                  {i < SORT_OPTIONS.length - 1 && (
                    <span className="mx-3 text-white/20 text-sm select-none">
                      ·
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
        </div>

        {/* ── Status / result count ─────────────────────────────────── */}
        {isFiltered && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">
              {isPending ? (
                <span style={{ color: `${accent}70` }}>A pesquisar…</span>
              ) : isSearching ? (
                <>
                  <span className="tabular-nums font-black" style={{ color: accent }}>
                    {totalPosts}
                  </span>
                  {" "}resultado{totalPosts !== 1 ? "s" : ""} para{" "}
                  <span className="text-white/70 normal-case">"{currentQ}"</span>
                </>
              ) : (
                <>
                  <span className="tabular-nums font-black" style={{ color: accent }}>
                    {totalPosts}
                  </span>
                  {" "}artigo{totalPosts !== 1 ? "s" : ""}
                </>
              )}
            </p>

            <Link
              href={clearAllUrl}
              scroll={false}
              prefetch={false}
              className="
                ml-auto flex items-center gap-1.5
                text-[11px] font-black uppercase tracking-widest
                text-white/40 hover:text-white/75 transition-colors
              "
            >
              <X size={11} strokeWidth={2.5} />
              Limpar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
