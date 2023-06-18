/*
  This code defines a getLikedSongs function that creates a new Supabase client object, gets the current session, queries the liked_songs table 
  
  in the database for all liked songs for the current user, and returns an array of Song objects representing those liked songs.
*/

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// This defines the getLikedSongs function, which is an async function that returns a Promise that resolves to an array of Song objects
const getLikedSongs = async (): Promise<Song[]> => {
  // This creates a new supabase client object by calling the createServerComponentClient function with an object as an argument
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  // This calls the getSession method on the auth property of the supabase object and destructures the session property from the data property of the result
  const {
    data: { session }
  } = await supabase.auth.getSession();

  /* 
    This line of code is using the supabase object to query the liked_songs table in the database. 
    
    The from method is called with "liked_songs" as an argument to specify the table to query. 
    
    The select method is called with "*, songs(*)" as an argument to specify that all columns should be returned, as well as all related data from the songs table. 
    
    The eq method is called with "user_id" and session?.user?.id as arguments to add a condition to the query: the user_id column must equal session?.user?.id. 
    
    The order method is called with "created_at" and { ascending: false } as arguments to specify that the results should be ordered by the created_at column in descending order.

    In summary, this line of code queries the liked_songs table in the database for all rows where the user_id column equals session?.user?.id, orders the results

    by the created_at column in descending order, and stores the result in a variable called data.
  */
  const { data } = await supabase.from("liked_songs").select("*, songs(*)").eq("user_id", session?.user?.id).order("created_at", { ascending: false });

  // If data is falsy, then an empty array is returned
  if (!data) return [];

  // Otherwise, the data is mapped to a new array where each item is the songs property of the original item
  return data.map(item => ({
    ...item.songs
  }));
};

export default getLikedSongs;
