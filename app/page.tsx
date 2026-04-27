import { getPosts } from "./lib/wp";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import LiveStreamPlayer from "@/components/minplayer";
import ContentHub from "@/components/programs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jornal Diário - Terras de Gaia",
  description: "Espaço de notícias que marcam a atualidade do desporto e da região.",
};

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <ContentHub />
      <LiveStreamPlayer />
    </div>
  );
}