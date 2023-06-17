/* 
   this code defines a getSongsByUserId function that returns an array of Song objects associated with the current user. 
   
   It uses a Supabase client created with createServerComponentClient to get session data and fetch songs from a Supabase database.
*/

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// imports the Song type from the "@/types" module
import { Song } from "@/types";

// defines the getSongsByUserId function, which is an asynchronous function that returns a Promise of an array of Song objects
const getSongsByUserId = async (): Promise<Song[]> => {
  // creates a Supabase client for the server component using the createServerComponentClient function
  const supabase = createServerComponentClient({
    cookies: cookies // sets the cookies option to the value of the cookies import
  });

  // gets the current session data from Supabase auth
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  // if there is an error getting the session data, log the error message and return an empty array
  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  /* 
    uses the Supabase client to fetch data from the songs table in the Supabase database

    selects all columns, filters by user_id equal to the id of the user in the current session,

    and orders the results by created_at in descending order 
  */
  const { data, error } = await supabase.from("songs").select("*").eq("user_id", sessionData.session?.user.id).order("created_at", { ascending: false });

  // if there is an error fetching data, log the error message
  if (error) {
    console.log(error.message);
  }

  // returns the data as an array of Song objects or an empty array if there is no data
  return (data as any) || [];
};

export default getSongsByUserId;
