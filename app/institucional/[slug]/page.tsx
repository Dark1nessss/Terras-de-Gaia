export default async function InstitutionalPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <main className="min-h-screen bg-[#fdfcf0] text-black pt-40 pb-20 px-6 font-nurom">
      <article className="max-w-3xl mx-auto">
        <header className="mb-16 border-b-4 border-black pb-8">
          <h1 className="text-7xl font-black uppercase tracking-tighter italic">
            {slug.replace('-', ' ')}
          </h1>
        </header>
        <div className="prose prose-xl font-serif leading-relaxed text-black/80">
          <p className="first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:mt-2">
            Carregando informação oficial sobre {slug}...
          </p>
        </div>
      </article>
    </main>
  );
}