/*
  This code defines a useSongById hook that takes in an optional song ID as an argument and returns an object containing the song data and a loading state. 
  
  When the hook is used with a valid song ID, it fetches data for that song from the database and updates its internal state accordingly.
*/

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

// This defines the useSongById hook, which takes in an optional id argument
const useSongById = (id?: string) => {
  // The following lines set up state variables for the loading state and the song data
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  // This line uses the useSessionContext hook to get access to the supabaseClient object
  const { supabaseClient } = useSessionContext();

  // This useEffect hook runs whenever the id or supabaseClient changes
  useEffect(() => {
    // If there is no id, then the function returns early
    if (!id) {
      return;
    }

    // The loading state is set to true
    setIsLoading(true);

    // This is an async function that fetches data for a song from the database
    const fetchSong = async () => {
      /*
        This line of code is using the supabaseClient object to query the songs table in the database for a single song with a specific ID. 
        
        The from method is called with "songs" as an argument to specify the table to query. 
        
        The select method is called with "*" as an argument to specify that all columns should be returned. 
        
        The eq method is called with "id" and id as arguments to add a condition to the query: the id column must equal the value of the id variable. 
        
        The single method is called to specify that only a single row should be returned.

        The result of the query is an object with two properties: data and error. 
        
        The data property contains the data returned by the query, if any, and the error property contains any error that occurred while executing the query. 
        
        These properties are destructured into two variables called data and error using the syntax const { data, error } = ....

        In summary, this line of code queries the songs table in the database for a single song with a specific ID, and stores the result in two variables called data and error.
      */
      const { data, error } = await supabaseClient.from("songs").select("*").eq("id", id).single();

      // If there was an error, then a toast notification is displayed with the error message and the loading state is set to false
      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      // The song data is set to the data returned by the query and the loading state is set to false
      setSong(data as Song);
      setIsLoading(false);
    };

    // The fetchSong function is called
    fetchSong();
  }, [id, supabaseClient]);

  // This returns an object containing the isLoading and song state variables, wrapped in a useMemo hook to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isLoading,
      song
    }),
    [isLoading, song]
  );
};

export default useSongById;
