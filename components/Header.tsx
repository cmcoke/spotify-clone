"use client";

import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const player = usePlayer();

  // handles logging out of application
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    player.reset(); // reset any playing song
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
    }
  };

  return (
    <div className={twMerge(` h-fit bg-gradient-to-b from-emerald-800 p-6`, className)}>
      <div className="w-full mb-4 flex items-center justify-between">
        {/* back and foward buttons for screens with a width of 768px and more */}
        <div className="hidden md:flex gap-x-2 items-center">
          <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition" aria-label="back">
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center cursor-pointer hover:opacity-75 transition" aria-label="forward">
            <RxCaretRight className="text-white" size={35} name="forward button" />
          </button>
        </div>

        {/* home and search buttons for screens with a width less than 769px */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button onClick={() => router.push("/")} className="rounded-full p-2 bg-white flex items-center justify-center cursor-pointer hover:opacity-75 transition" aria-label="home">
            <HiHome className="text-black" size={20} />
          </button>
          <button onClick={() => router.push("/search")} className="rounded-full p-2 bg-white flex items-center justify-center cursor-pointer hover:opacity-75 transition" aria-label="search">
            <BiSearch className="text-black" size={20} />
          </button>
        </div>

        {/* logout, sign up and login button */}
        <div className="flex justify-between items-center gap-x-4">
          {/* if the user is logged in shows the 'Logout' button and 'user profile icon' else show the 'Sign Up' and 'Log In' button */}
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button onClick={handleLogout} className="bg-white px-6 py-2" aria-label="logout">
                Logout
              </Button>
              <Button onClick={() => router.push("/account")} className="bg-white" aria-label="user account">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button className=" bg-transparent text-neutral-300 font-medium" onClick={authModal.onOpen} aria-label="sign up">
                  Sign Up
                </Button>
              </div>
              <div>
                <Button className=" bg-white px-6 py-2" onClick={authModal.onOpen} aria-label="log in">
                  Log In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default Header;
