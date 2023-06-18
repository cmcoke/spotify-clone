// This file is responsible for getting a song by it's title

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";
import getSongs from "./getSongs";

//  an asynchronous function that takes a title string as an argument and returns a Promise of an array of Song objects
const getSongsByTitle = async (title: string): Promise<Song[]> => {
  // creates the supabase client for the server component
  const supabase = createServerComponentClient({
    cookies: cookies // cookies are being used to authenticate the user with Supabase.
  });

  // if there are no titles, call the getSongs function to get all songs and return them
  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  // uses the Supabase client to fetch data from the songs table in the Supabase database
  // selects all columns, filters by title using a case-insensitive LIKE operator with wildcards,
  // and orders the results by created_at in descending order
  const { data, error } = await supabase.from("songs").select("*").ilike("title", `%${title}%`).order("created_at", { ascending: false });

  // if there is an error fetching data, log the error message
  if (error) {
    console.log(error.message);
  }

  // returns the data as an array of Song objects or an empty array if there is no data.
  return (data as any) || [];
};

export default getSongsByTitle;
