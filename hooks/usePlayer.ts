/*
  This code defines a usePlayer hook that creates a global state store for a music player using the zustand library. 
  
  The store has an ids property that is an array of song IDs, an activeId property that is the ID of the currently active song, and several methods for updating the state of the store.
*/

import { create } from "zustand";

// This defines an interface for the PlayerStore type
interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
}

// This calls the create function from the zustand library with a function as an argument to create a new store
const usePlayer = create<PlayerStore>(set => ({
  // The initial state of the store is defined here
  ids: [],
  activeId: undefined,
  /* 
    setId, is a function that takes in a single argument, which is the ID of a song. 
    
    When this function is called, it updates the value of the activeId property in the global state store to the value of the ID that was passed in as an argument. 
    
    This means that the currently active song in the music player is set to the song with the ID that was passed in as an argument to the setId function.
   */
  setId: (id: string) => set({ activeId: id }),

  /*
    setIds, is a function that takes in a single argument, which is an array of song IDs. 
    
    When this function is called, it updates the value of the ids property in the global state store to the value of the array of IDs that was passed in as an argument. 
    
    This means that the list of song IDs in the music player is set to the list of IDs that was passed in as an argument to the setIds function.
  */
  setIds: (ids: string[]) => set({ ids }),

  /*
   reset, is a function that takes no arguments. 
   
   When this function is called, it updates the values of both the ids and activeId properties in the global state store to their initial values. 
   
   This means that the list of song IDs in the music player is set to an empty array and the currently active song in the music player is set to undefined, effectively resetting the state of the music player.
  */
  reset: () => set({ ids: [], activeId: undefined })
}));

export default usePlayer;
