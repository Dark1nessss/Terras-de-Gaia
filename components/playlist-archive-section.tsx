import YouTubePlaylistArchive from "@/components/youtube-playlist-archive";
import { getPlaylistVideos } from "@/lib/youtube";

const PLAYLIST_ID = "PLtlfL8axK0w2LJ7-yfhAIVax7qvb31FRx";

export default async function PlaylistArchiveSection() {
  // Fetch initial batch of videos server-side
  const { videos, nextPageToken } = await getPlaylistVideos(PLAYLIST_ID, undefined, 20);

  // If no videos, don't render the section
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <YouTubePlaylistArchive
      initialVideos={videos}
      nextPageToken={nextPageToken}
      playlistId={PLAYLIST_ID}
    />
  );
}
