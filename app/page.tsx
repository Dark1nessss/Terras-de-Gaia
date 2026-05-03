import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import LiveStreamPlayer from "@/components/minplayer";
import ContentHub from "@/components/programs";
import { Metadata } from "next";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Jornal Diário - Terras de Gaia",
  description: "Espaço de notícias que marcam a atualidade do desporto e da região.",
};

export default async function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <ContentHub />
      <LiveStreamPlayer />
    </div>
  );
}