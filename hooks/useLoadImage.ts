/*
  This file is responsible for getting the image associated with a song from the supabase database
*/

import { useSupabaseClient } from "@supabase/auth-helpers-react";

// imports the Song type from the "@/types" module
import { Song } from "@/types";

const useLoadImage = (song: Song) => {
  // uses the useSupabaseClient hook to get a Supabase client instance
  const supabaseClient = useSupabaseClient();

  // if there is no song just return null
  if (!song) {
    return null;
  }

  // uses the Supabase client to get the public URL of the image associated with the song
  const { data: imageData } = supabaseClient.storage.from("images").getPublicUrl(song.image_path);

  // returns the public URL of the image
  return imageData.publicUrl;
};

export default useLoadImage;
