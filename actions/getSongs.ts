// This file is responsible for loading songs to the server component

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

//  an asynchronous function that returns a Promise of an array of Song objects.
const getSongs = async (): Promise<Song[]> => {
  // creates the supabase client for the server component
  const supabase = createServerComponentClient({
    cookies: cookies // cookies are being used to authenticate the user with Supabase.
  });

  // uses the Supabase client to fetch data from the songs table in the Supabase database. It selects all columns and orders the results by the created_at column in descending order.
  const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });

  // if there is an error
  if (error) {
    console.log(error.message);
  }

  // returns the data as an array of Song objects or an empty array if there is no data.
  return (data as any) || [];
};

export default getSongs;
