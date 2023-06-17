/*

  This code defines a UserProvider component that wraps its children in a MyUserContextProvider component, which was imported from “@/hooks/useUser”. 

  The MyUserContextProvider component provides user-related data to its children components via a React context. 

  The UserProvider component is simply a wrapper around the MyUserContextProvider component.

*/

"use client";

import { MyUserContextProvider } from "@/hooks/useUser"; // // Importing the MyUserContextProvider component from the local useUser hook file

// Defining the type for the props of the UserProvider component
interface UserProviderProps {
  children: React.ReactNode;
}

// Defining the UserProvider component
const UserProvider = ({ children }: UserProviderProps) => {
  // Returning a MyUserContextProvider component with the children passed down
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
