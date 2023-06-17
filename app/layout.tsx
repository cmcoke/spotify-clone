import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToastProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "Listen to music!"
};

export const revalidate = 0; // prevents the page from being cached

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        {/* The SupabaseProvider and UserProvider components provide context for managing Supabase and user-related data, respectively. */}
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
