/*
  This code defines a useOnPlay hook that takes in an array of songs as an argument and returns a function for playing a song. 
  
  When the returned function is called with a song ID, it checks if there is a logged-in user. If there is no user, then it opens an authentication modal. 
  
  If there is a user, then it updates the global state of the music player to play the specified song.
*/

import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

// This defines the useOnPlay hook, which takes in an array of songs as an argument
const useOnPlay = (songs: Song[]) => {
  // The following lines use various hooks to get access to the player, authModal, and user objects
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  // This defines the onPlay function, which takes in a song ID as an argument
  const onPlay = (id: string) => {
    // If there is no user, then the authModal is opened
    if (!user) {
      return authModal.onOpen();
    }

    // The player's activeId and ids properties are updated with the given song ID and the array of song IDs
    player.setId(id);
    player.setIds(songs.map(song => song.id));
  };

  // The onPlay function is returned
  return onPlay;
};

export default useOnPlay;
