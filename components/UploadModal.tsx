/* 
  This code defines an UploadModal component that allows users to upload new songs to a Supabase-powered web application by using a form. 

  When the form is submitted, the onSubmit function uploads the selected image and song files to Supabase storage, creates a new record 
  in the Supabase database’s songs table, and displays success or error messages using the toast function from the react-hot-toast package. 

  The page is also refreshed using the Next.js router’s refresh method to show the newly uploaded song.
*/

"use client";

import uniqid from "uniqid";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal(); // Getting an instance of the uploadModal store using the useUploadModal hook
  const { user } = useUser(); // Getting the current user using the useUser hook
  const supabaseClient = useSupabaseClient(); // Getting an instance of the Supabase client using the useSupabaseClient hook
  const router = useRouter();

  // Initializing a form using the useForm hook and setting default values for each field
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null
    }
  });

  // Defining a function to handle changes to the modal's open state
  const onChange = (open: boolean) => {
    // Checking if the modal is being closed
    if (!open) {
      reset(); // Resetting the form to its default values
      uploadModal.onClose(); // Closing the upload modal using an action from the uploadModal store
    }
  };

  // upload to supabase
  const onSubmit: SubmitHandler<FieldValues> = async values => {
    try {
      setIsLoading(true); // Setting isLoading to true to indicate that data is being uploaded

      // Getting references to the selected image and song files
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      // Checking if any required fields are missing or if there is no user logged in
      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields"); // Displaying an error message using react-hot-toast's toast function
        return;
      }

      const uniqueID = uniqid(); // Generating a unique ID for this upload using uniqid's unique ID generation function

      // Uploading song file to Supabase storage and checking for errors
      const { data: songData, error: songError } = await supabaseClient.storage.from("songs").upload(`song-${values.title}-${uniqueID}`, songFile, {
        cacheControl: "3600",
        upsert: false
      });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed song upload");
      }

      // Uploading image file to Supabase storage and checking for errors
      const { data: imageData, error: imageError } = await supabaseClient.storage.from("images").upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl: "3600",
        upsert: false
      });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }

      // Creating a new record in Supabase database's songs table with uploaded data and checking for errors.
      const { error: supabaseError } = await supabaseClient.from("songs").insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path
      });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }

      // Refreshing the page to show the newly uploaded song
      router.refresh();
      setIsLoading(false);
      toast.success("Song created!");
      reset();
      uploadModal.onClose();

      // Catching any errors that may have occurred during the upload process
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Add a song" description="Upload an mp3 file" isOpen={uploadModal.isOpen} onChange={onChange}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input id="title" disabled={isLoading} {...register("title", { required: true })} placeholder="Song title" />
        <Input id="author" disabled={isLoading} {...register("author", { required: true })} placeholder="Song author" />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input disabled={isLoading} type="file" accept=".mp3" id="song" {...register("song", { required: true })} />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input disabled={isLoading} type="file" accept="image/*" id="image" {...register("image", { required: true })} />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};
export default UploadModal;
