// This code defines a PlayerContent component that displays information about a song and provides controls for playing, pausing, and skipping songs.

"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { useEffect, useState } from "react";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";

// This defines an interface for the props that the PlayerContent component will accept
interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

// This is the definition of the PlayerContent component, which accepts a song and a songUrl prop
const PlayerContent = ({ song, songUrl }: PlayerContentProps) => {
  // The following lines set up state variables for the volume, playing state, and player object
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = usePlayer();

  // These lines set the Icon and VolumeIcon variables to different icons depending on whether the player is playing or muted
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // This code defines a onPlayNext function that skips to the next song in the player’s queue. If there is no next song, then it wraps around to the first song in the queue.
  const onPlayNext = () => {
    // If the player's queue is empty, then the function returns early
    if (player.ids.length === 0) {
      return;
    }

    // This line finds the index of the currently active song in the player's queue
    const currentIndex = player.ids.findIndex(id => id === player.activeId);

    // This line gets the ID of the next song in the player's queue
    const nextSong = player.ids[currentIndex + 1];

    // If there is no next song, then the first song in the player's queue is set as the active song
    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    // Otherwise, the next song is set as the active song
    player.setId(nextSong);
  };

  // This code defines a onPlayPrevious function that skips to the previous song in the player’s queue. If there is no previous song, then it wraps around to the last song in the queue.
  const onPlayPrevious = () => {
    // If the player's queue is empty, then the function returns early
    if (player.ids.length === 0) {
      return;
    }

    // This line finds the index of the currently active song in the player's queue
    const currentIndex = player.ids.findIndex(id => id === player.activeId);

    // This line gets the ID of the previous song in the player's queue
    const previousSong = player.ids[currentIndex - 1];

    // If there is no previous song, then the last song in the player's queue is set as the active song
    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    // Otherwise, the previous song is set as the active song
    player.setId(previousSong);
  };

  /*  
     This code uses the useSound hook to create a sound object for playing the song specified by songUrl. 
     
     The hook also returns play and pause functions that can be used to play and pause the sound, respectively.
  */
  const [play, { pause, sound }] = useSound(songUrl, {
    // The volume of the sound is set to the value of the volume state variable
    volume: volume,

    // When the sound starts playing, the isPlaying state variable is set to true
    onplay: () => setIsPlaying(true),

    // When the sound ends, the isPlaying state variable is set to false and the onPlayNext function is called
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },

    // When the sound is paused, the isPlaying state variable is set to false
    onpause: () => setIsPlaying(false),

    // The format of the sound file is specified as mp3
    format: ["mp3"]
  });

  // This useEffect hook runs whenever the sound object changes
  useEffect(() => {
    // If the sound object exists, then its play method is called
    sound?.play();

    // This returns a cleanup function that will be called when the component unmounts or when the sound object changes
    return () => {
      // If the sound object exists, then its unload method is called
      sound?.unload();
    };
  }, [sound]);

  // This is a function that handles playing or pausing the song
  const handlePlay = () => {
    // If the song is not currently playing, then the play function is called
    if (!isPlaying) {
      play();
    } else {
      // Otherwise, the pause function is called
      pause();
    }
  };

  //  This code defines a toggleMute function that toggles the volume of the music player between 0 and 1 by calling the setVolume function with either 0 or 1 as an argument.
  const toggleMute = () => {
    // If the volume is currently 0, then it is set to 1
    if (volume === 0) {
      setVolume(1);
    } else {
      // Otherwise, the volume is set to 0
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      {/* Song Information & Like Button */}
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      {/* mobile version */}
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer" onClick={handlePlay}>
          <Icon size={30} className="text-black" />
        </div>
      </div>

      {/* desktop version */}
      <div className=" hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6 ">
        <AiFillStepBackward onClick={onPlayPrevious} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        <div onClick={handlePlay} className="flex items-center justify-centerh-10w-10 rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
      </div>

      {/* volume */}
      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34} />
          <Slider value={volume} onChange={value => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};
export default PlayerContent;
