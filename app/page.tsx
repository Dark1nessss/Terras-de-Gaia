import Hero from "@/components/hero";
import LiveStreamPlayer from "@/components/minplayer";
import ContentHub from "@/components/programs";

export default async function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <ContentHub />
      <LiveStreamPlayer />
    </div>
  );
}