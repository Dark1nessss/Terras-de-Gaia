import Hero from "@/components/hero";
import LiveStreamPlayer from "@/components/minplayer";
import ContentHub from "@/components/programs";
import PlaylistArchiveSection from "@/components/playlist-archive-section";
import { AdPlaceholder } from "@/components/ad-placeholder";

export default async function HomePage() {
  return (
    <div className="bg-[#0a0c10]">
      <Hero />
      <AdPlaceholder position="inline" />
      <ContentHub />
      <PlaylistArchiveSection />
      <LiveStreamPlayer />
    </div>
  );
}