import { getPostsByCategoryPaginated } from "@/lib/wp";
import { FeaturedPostSection } from "@/components/featured-post-section";
import { InfiniteScrollPosts } from "@/components/infinite-scroll";
import { Breadcrumb } from "@/components/breadcrumb";

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
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white pt-24 pb-12 font-nurom">
      <div className="container mx-auto px-6 max-w-7xl">
        <Breadcrumb 
          items={[{ label: "Inicial", href: "/" }]} 
          current={categoryName}
        />

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-end gap-6 border-l-4 border-[#00a6f0] pl-6 mb-2">
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter">
              {categoryName}
            </h1>
          </div>
          <p className="text-white/40 text-sm uppercase tracking-widest font-bold">
            {totalPosts} {totalPosts === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>

        {/* Featured Post */}
        <FeaturedPostSection post={mainPost} />

        {/* Posts Grid */}
        {otherPosts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mais Artigos</h2>
              <div className="h-0.5 flex-1 bg-white/10" />
            </div>
            <InfiniteScrollPosts slug={slug} initialPosts={otherPosts} />
          </div>
        )}
      </div>
    </main>
  );
}