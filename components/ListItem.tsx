"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
}

const ListItem = ({ image, name, href }: ListItemProps) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    router.push(href);
  };

  return (
    <button onClick={onClick} className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 cursor-pointer hover:bg-neutral-100/20 transition pr-4" aria-label="song">
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image className="object-cover" src={image} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Image" priority={true} />
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5group-hover:opacity-100 hover:scale-110">
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};
export default ListItem;
