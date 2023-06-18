/*
  This code defines a Player component that displays the currently active song in the music player and provides controls for playing, pausing, and skipping songs. 
  
  The component uses several hooks to get information about the currently active song and its URL, and renders a PlayerContent component with this information.
*/

"use client";

import usePlayer from "@/hooks/usePlayer";
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import PlayerContent from "./PlayerContent";

// This is the definition of the Player component, which takes no props
const Player = () => {
  // The following lines use various hooks to get access to the player, song, and songUrl objects
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);

  // If there is no song, no songUrl, or no activeId, then null is returned
  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">{<PlayerContent key={songUrl} song={song} songUrl={songUrl} />}</div>;
};
export default Player;
