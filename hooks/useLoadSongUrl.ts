/*
  This code defines a custom hook called useLoadSongUrl that takes in a song object as an argument and returns the public URL of the song’s file.
*/

import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

// This defines the useLoadSongUrl hook, which takes in a song argument
const useLoadSongUrl = (song: Song) => {
  // This line uses the useSupabaseClient hook to get access to the supabaseClient object
  const supabaseClient = useSupabaseClient();

  // If there is no song, then an empty string is returned
  if (!song) {
    return "";
  }

  /* 
    This line of code is using the supabaseClient object to get the public URL of a file from the songs bucket in Supabase Storage. 
    
    The from method is called with "songs" as an argument to specify the bucket to get the file from. 
    
    The getPublicUrl method is called with song.song_path as an argument to specify the path of the file to get the public URL for.

    The result of the method call is an object with a data property that contains an object with information about the file, including its public URL. 
    
    This property is destructured into a variable called songData using the syntax const { data: songData } = ....

    In summary, this line of code gets the public URL of a file from the songs bucket in Supabase Storage and stores it in a variable called songData.
  */
  const { data: songData } = supabaseClient.storage.from("songs").getPublicUrl(song.song_path);

  // The publicUrl property of the songData object is returned
  return songData.publicUrl;
};

export default useLoadSongUrl;
