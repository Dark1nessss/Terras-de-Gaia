import { getPosts } from "./lib/wp";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import { Metadata } from "next";
import LiveStreamPlayer from "../components/minplayer";

export const metadata: Metadata = {
  title: "Jornal Diário - Terras de Gaia",
  description: "Espaço de notícias que marcam a atualidade do desporto e da região.",
};

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LiveStreamPlayer />
      <main className="container mx-auto py-12 px-6">
        <section className="h-[100vh]">
          <h2 className="text-3xl font-bold mb-6">Últimas Notícias</h2>
        </section>
      </main>
    </div>
  );
}