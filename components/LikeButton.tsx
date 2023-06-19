/*
  This code defines a LikeButton component that displays either a filled or outlined heart icon depending on whether the current user has liked a song or not. 
  
  When the button is clicked, it either likes or unlikes the song in the database and updates the state of the component accordingly.
*/

"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

// This defines an interface for the props that the LikeButton component will accept
interface LikeButtonProps {
  songId: string;
}

const LikeButton = ({ songId }: LikeButtonProps) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  // check to see if a song that is currently loading is liked or not
  useEffect(() => {
    // check if there is an user id
    if (!user?.id) {
      return;
    }

    // This is an async function that fetches data from the liked_songs table in the database
    const fetchData = async () => {
      /*
        This line of code is using the supabaseClient object to query the liked_songs table in the database. 
        
        The from method is called with "liked_songs" as an argument to specify the table to query. 
        
        The select method is called with "*" as an argument to specify that all columns should be returned. 
        
        The eq method is called twice, first with "user_id" and user.id as arguments and then with "song_id" and songId as arguments, to add 
        two conditions to the query: the user_id column must equal user.id and the song_id column must equal songId. 
        
        The single method is called to specify that only a single row should be returned.

        In summary, this line of code queries the liked_songs table in the database for a single row where the user_id column equals user.id and 
        the song_id column equals songId, and stores the result in two variables called data and error.
      */
      const { data, error } = await supabaseClient.from("liked_songs").select("*").eq("user_id", user.id).eq("song_id", songId).single();

      // If there was no error and data was returned, then setIsLiked is called with true as an argument
      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData(); // The fetchData function is called
  }, [songId, supabaseClient, user?.id]);

  // This sets the Icon variable to either AiFillHeart or AiOutlineHeart depending on whether isLiked is true or false
  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  // This is an async function that handles liking or unliking a song
  const handleLike = async () => {
    // If there is no user object, then the authModal is opened and the function returns early
    if (!user) {
      return authModal.onOpen(); // if a user is not logged in and they click the heart icon then the auth modal will open
    }

    // If isLiked is true, then a delete request is sent to the liked_songs table in the database
    if (isLiked) {
      /*
        This line of code is using the supabaseClient object to delete rows from the liked_songs table in the database. 
        
        The from method is called with "liked_songs" as an argument to specify the table to delete from. 
        
        The delete method is called to specify that rows should be deleted. 
        
        The eq method is called twice, first with "user_id" and user.id as arguments and then with "song_id" and songId as arguments, 
        to add two conditions to the query: the user_id column must equal user.id and the song_id column must equal songId.

        In summary, this line of code deletes rows from the liked_songs table in the database where the user_id column equals user.id and the song_id column equals songId, 
        and stores any error that occurred while executing the query in a variable called error.
      */
      const { error } = await supabaseClient.from("liked_songs").delete().eq("user_id", user.id).eq("song_id", songId);

      // If there was an error, then a toast notification is displayed with the error message
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      /* 
        If isLiked is false, then an insert request is sent to the liked_songs table in the database 
        
        This line of code is using the supabaseClient object to insert a row into the liked_songs table in the database. 
        
        The from method is called with "liked_songs" as an argument to specify the table to insert into. 
        
        The insert method is called with an object as an argument to specify the data to insert. 
        
        The object has two properties: song_id and user_id, which are set to the values of songId and user.id, respectively.
        
        In summary, this line of code inserts a row into the liked_songs table in the database with the song_id column set to songId and 
        the user_id column set to user.id, and stores any error that occurred while executing the query in a variable called error.
      */
      const { error } = await supabaseClient.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id
      });

      // If there was an error, then a toast notification is displayed with the error message
      if (error) {
        toast.error(error.message);
      } else {
        // Otherwise, setIsLiked is called with true as an argument and a success toast notification is displayed
        setIsLiked(true);
        toast.success("Success");
      }
    }

    router.refresh(); // The router.refresh method is called to refresh the page
  };

  return (
    <button className="cursor-pointer hover:opacity-75 transition" onClick={handleLike} aria-label="liked">
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};
export default LikeButton;
