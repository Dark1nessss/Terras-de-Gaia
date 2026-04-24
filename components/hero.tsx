import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[100vh] w-full overflow-hidden flex items-end">
      {/* Background Video */}
      <video 
        autoPlay muted loop playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Blue Overlay / Gradient Effect */}
      <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent z-20" />

      {/* Content */}
      <div className="container mx-auto px-6 pb-12 relative z-30 text-white">
        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4">
          <span className="w-2 h-2 bg-orange-500 rounded-full inline-block mr-2 animate-pulse" />
          Em direto
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-2">Jornal Diário</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-xl">
          Espaço de notícias que marcam a atualidade do desporto e da região.
        </p>
        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12">
            Ver emissão em direto
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 px-8 h-12">
            Programas
          </Button>
        </div>
      </div>
    </section>
  );
}