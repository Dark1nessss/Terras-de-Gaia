import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { getPostBySlug } from "@/components/lib/wp";
import { ShareButton } from "@/components/share-button";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";

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

  // Sem fallback - apresenta 404 diretamente
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

  // Debug logging
  console.log("Post category data:", categoryName);
  console.log("Category slug:", categorySlug);
  console.log("Full embedded object:", post._embedded);

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Breadcrumb with custom components */}
        <Breadcrumb 
          items={[
            { label: "Inicial", href: "/" },
            { 
              label: categoryName, 
              href: categoryName === "Desporto" ? `/desporto/${categorySlug}` : `/categoria/${categorySlug}`
            }
          ]} 
          current={post.title.rendered.replace(/<[^>]*>/g, "").slice(0, 50)}
        />

        {/* Article Content */}
        <article className="space-y-8">
          <div className="space-y-5">
            <h1
              className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-white/90"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-4 text-md font-medium tracking-wide text-white/50 border-y border-white/[0.03]">
              <div>
                <span className="text-white/30">Por </span>
                <span className="text-white/80 font-semibold">{authorName}</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div>
                <span className="text-white/30">Publicado em </span>
                <span className="text-white/80 font-semibold">
                  {new Date(post.date).toLocaleDateString("pt-PT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Imagem de Destaque */}
          <div className="relative w-full h-[420px] md:h-[500px] rounded overflow-hidden border border-white/5 shadow-2xl">
            <Image
              src={featuredImage}
              alt={post.title.rendered || "Imagem do Artigo"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
          </div>

          {/* Texto do Artigo */}
          <div
            className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-6 text-base md:text-lg border-b border-white/[0.03] pb-10"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Rodapé do Artigo com partilha e leituras */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <ShareButton title={post.title.rendered} slug={post.slug} />
            <span className="text-xs text-white/30 flex items-center gap-2">
              <Eye size={14} /> 245 leituras
            </span>
          </div>
        </article>
      </div>
    </main>
  );
}