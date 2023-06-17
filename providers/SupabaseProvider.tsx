/*
  This code defines a SupabaseProvider component that sets up a Supabase client and provides it to its children components via a SessionContextProvider. 
  
  The useState hook is used to create a state variable for the supabaseClient, which is initialized using the createClientComponentClient function. 
  
  The Database type is imported and passed as a generic argument to the createClientComponentClient function. 
  
  The SessionContextProvider component is used to provide the supabaseClient to child components via a React context.
*/

"use client";

import { Database } from "@/types_db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

// Defining the type for the props of the SupabaseProvider component
interface SupabaseProviderProps {
  children: React.ReactNode;
}

// Defining the SupabaseProvider component
const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  // Initializing a state variable for the supabaseClient using the useState hook and createClientComponentClient function
  const [supabaseClient] = useState(() => createClientComponentClient<Database>());

  // Returning a SessionContextProvider component with the supabaseClient and children passed down
  return <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>;
};

export default SupabaseProvider;
