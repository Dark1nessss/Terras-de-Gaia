import { getPostsByCategoryPaginated } from "@/components/lib/wp";
import { FeaturedPostSection } from "@/components/featured-post-section";
import { InfiniteScrollPosts } from "@/components/infinite-scroll-posts";
import { Breadcrumb } from "@/components/breadcrumb";
import { SectionHeader } from "@/components/section-header";

export default async function CategoryPage({ 
  params,
}: { 
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { posts, totalPosts } = await getPostsByCategoryPaginated(slug, 1, 12);
  
  if (!posts?.length) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-white/20 uppercase font-black italic">
        Sem conteúdos de {slug} disponíveis
      </div>
    );
  }

  const [mainPost, ...otherPosts] = posts;

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6 max-w-7xl">
        <Breadcrumb 
          items={[{ label: "Inicial", href: "/" }]} 
          current={slug.charAt(0).toUpperCase() + slug.slice(1)}
        />
        <SectionHeader title={slug} count={totalPosts} />
        <FeaturedPostSection post={mainPost} />
        {otherPosts.length > 0 && (
          <InfiniteScrollPosts slug={slug} initialPosts={otherPosts} />
        )}
      </div>
    </main>
  );
}