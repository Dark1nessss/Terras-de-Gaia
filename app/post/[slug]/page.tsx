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
import { AdPlaceholder } from "@/components/ad-placeholder";
import { decodeHtml, truncateBreadcrumbTitle } from "@/lib/decode-html";
import { formatDate } from "@/lib/date";
import { PostVideoPlayer } from "@/components/post-video-player";
import { stripVideoEmbeds } from "@/lib/video";

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

  const bodyHtml = post.hasVideo
    ? stripVideoEmbeds(post.content.rendered)
    : post.content.rendered;
  const contentText = bodyHtml.replace(/<[^>]*>/g, '') || '';
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Article Container */}
          <article className="lg:col-span-3">
            
            {/* Header Section (Title + Meta) */}
            <header className="space-y-8 mb-12">
              <h1
                className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white/95"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              
              {/* Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-y border-white/10 py-6 text-sm font-bold uppercase tracking-widest">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 italic">Por</span>
                    <span className="text-[#006ec2] font-black">{authorName}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/60">{formatDate(post.date, "short")}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Clock size={16} className="text-[#006ec2]" />
                  <span className="text-white/60">{readingTime} min leitura</span>
                </div>
              </div>

              {/* Category Badges */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <CategoryBadges categories={categories} />
                </div>
              )}
            </header>

            {/* Featured Image / Video Player */}
            {post.hasVideo && post.videoUrl ? (
              <PostVideoPlayer
                videoUrl={post.videoUrl}
                thumbnailUrl={featuredImage}
                title={decodeHtml(post.title.rendered)}
              />
            ) : (
              <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <Image
                  src={featuredImage}
                  alt={post.title.rendered || "Imagem do Artigo"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Body Content */}
            <div
              className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-6 text-base md:text-lg mb-16"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Footer Section */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
              <ShareButton title={decodeHtml(post.title.rendered)} />
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <span>{wordCount} Palavras</span>
              </div>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} currentPostId={post.id} categorySlug={categorySlug} categoryName={categoryName} />
            )}

          </article>

          {/* Sidebar Area */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <AdPlaceholder position="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}