import Hero from "@/components/hero";
import LiveStreamPlayer from "@/components/minplayer";
import ContentHub from "@/components/programs";
import PlaylistArchiveSection from "@/components/playlist-archive-section";

export default async function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <ContentHub />
      <PlaylistArchiveSection />
      <LiveStreamPlayer />
    </div>
  );
}