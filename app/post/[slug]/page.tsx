import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Eye, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { getPostBySlug } from "@/lib/wp";
import { ShareButton } from "@/components/share-button";
import { CategoryBadges } from "@/components/category-badges";
import { RelatedPosts } from "@/components/related-posts";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { decodeHtml, truncateBreadcrumbTitle } from "@/lib/decode-html";
import { formatDate } from "@/lib/date";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: `${post.title.rendered} - Terras de Gaia Gazeta`,
    description: post.excerpt?.rendered.replace(/<[^>]*>/g, "").slice(0, 150) || "",
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post.featured_image_url ||
    "/image_9678bc.png";

  const authorName = post.author_name || "Autor";
  const categoryName = post.category?.name || "Categoria";
  const categorySlug = post.category?.slug || "categoria";
  const categories = post.categories || [];
  const relatedPosts = post.relatedPosts || [];

  const contentText = post.content?.rendered.replace(/<[^>]*>/g, '') || '';
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6 max-w-8xl">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[
            { label: "Inicial", href: "/" },
            { 
              label: categoryName, 
              href: categoryName === "Desporto" ? `/desporto/${categorySlug}` : `/categoria/${categorySlug}`
            }
          ]} 
          current={truncateBreadcrumbTitle((post.title.rendered), 50)}
        />

        {/* Main Content: Grid Layout for Desktop, Stack for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Article - Takes 3 columns on desktop, full width on mobile */}
          <article className="lg:col-span-3 space-y-8">
            {/* Title */}
            <div className="space-y-5">
              <h1
                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight text-white/95"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              {categories.length > 0 && (
                <div className="flex items-center">
                  <CategoryBadges categories={categories} />
                </div>
              )}
            </div>

              {/* Metadata Row + Category Badge on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-y border-white/[0.03] text-xs sm:text-sm font-medium tracking-wide text-white/50">
                {/* Left Side Group - Metadata */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <span className="text-white/40 mr-1.5">Por</span>
                    <span className="text-white/85 font-semibold leading-none">{authorName}</span>
                  </div>
                  
                  <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
                  
                  <div className="flex items-center">
                    <span className="text-white/40 mr-1.5">Publicado em</span>
                    <span className="text-white/85 font-semibold leading-none">
                      {formatDate(post.date, "short")}
                    </span>
                  </div>
                  
                  <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
                  
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-white/40" />
                    <span className="text-white/85 font-semibold leading-none">{readingTime} min leitura</span>
                  </div>
                </div>
              </div>

            {/* Featured Image */}
            <div className="relative w-full h-[420px] md:h-[500px] rounded-lg overflow-hidden border border-white/5 shadow-2xl">
              <Image
                src={featuredImage}
                alt={post.title.rendered || "Imagem do Artigo"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
            </div>

            {/* Article Content */}
            <div
              className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-6 text-base md:text-lg border-b border-white/[0.03]"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Article Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8">
              <ShareButton title={decodeHtml(post.title.rendered)} />
              <div className="flex items-center gap-6 text-xs text-white/40 uppercase font-semibold tracking-widest">
                <div className="flex items-center gap-2">
                  <FileText size={14} />
                  {wordCount} palavras
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={14} />
                  245 leituras
                </div>
              </div>
            </div>
          </article>

          {/* Mobile: Horizontal Scrollable Carousel (Non-sticky) */}
          {relatedPosts.length > 0 && (
            <div className="lg:hidden -mx-6 px-6 mt-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/90 mb-3">
                Artigos Relacionados
              </h3>
              <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory">
                {relatedPosts.map((post) => {
                  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                  return (
                    <Link
                      key={post.id}
                      href={`/post/${post.slug}`}
                      className="flex-shrink-0 w-40 border border-white/5 rounded overflow-hidden hover:border-[#00a6f0]/40 transition-all duration-300 bg-white/[0.02] snap-start"
                    >
                      {image ? (
                        <div className="relative h-24 overflow-hidden bg-white/2">
                          <Image
                            src={image}
                            alt={post.title.rendered}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="h-24 bg-gradient-to-br from-[#00a6f0]/10 to-transparent flex items-center justify-center">
                          <span className="text-white/20 text-xs">Sem imagem</span>
                        </div>
                      )}
                      <div className="p-2">
                        <h4 className="text-[10px] font-black uppercase italic text-white/80 line-clamp-2 leading-tight">
                          {decodeHtml(post.title.rendered).replace(/<[^>]*>/g, '')}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Sidebar: Related Posts (Sticky, Desktop Only) */}
          {relatedPosts.length > 0 && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="border border-white/5 rounded-lg overflow-hidden sticky top-24">
                <div className="px-5 py-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/90">
                    Artigos Relacionados
                  </h3>
                </div>
                <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}