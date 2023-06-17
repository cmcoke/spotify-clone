/* 

  This code creates a custom React context to manage user-related data in a Supabase application. 
  
  It provides an easy way for components in the application to access and update information about the current user, their details, and their subscription.
  
  The code defines a MyUserContextProvider component that fetches data from the Supabase database and manages the state of the user data. 
  
  It also defines a custom useUser hook to provide easy access to the user data from other components in the application.

*/

import { User, useUser as useSupaUser, useSessionContext } from "@supabase/auth-helpers-react";
import { UserDetails, Subscription } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

// Defining the type for the UserContext value
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

// Creating the UserContext with an initial value of undefined
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Defining the type for the props of the MyUserContextProvider component
export interface Props {
  [propName: string]: any;
}

// managees the state of the UserContext
export const MyUserContextProvider = (props: Props) => {
  const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext(); // Gets the current session, user loading state, and Supabase client using the useSessionContext hook
  const user = useSupaUser(); // Gets the current user using the useSupaUser hook (renamed from useUser)
  const accessToken = session?.access_token ?? null; // Get the access token from the session or setting it to null if there is no session

  // Initializing the state for the data loading state, user details, and subscription using the useState hook
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Defining a function to fetch user details from the Supabase database
  const getUserDetails = () => supabase.from("users").select("*").single();

  // Defining a function to fetch subscription data from the Supabase database
  const getSubscription = () => supabase.from("subscriptions").select("*, prices(*, products(*))").in("status", ["trialing", "active"]).single();

  // Using the useEffect hook to fetch data when necessary
  useEffect(() => {
    // Checking if the user is logged in and data has not been loaded yet
    if (user && !isLoadingData && !userDetails && !subscription) {
      // Setting the data loading state to true
      setIsloadingData(true);

      // Fetching user details and subscription data using Promise.allSettled
      Promise.allSettled([getUserDetails(), getSubscription()]).then(results => {
        // Getting the results of each promise
        const userDetailsPromise = results[0];
        const subscriptionPromise = results[1];

        // Checking if the userDetailsPromise was fulfilled and updating the state accordingly
        if (userDetailsPromise.status === "fulfilled") setUserDetails(userDetailsPromise.value.data as UserDetails);

        // Checking if the subscriptionPromise was fulfilled and updating the state accordingly
        if (subscriptionPromise.status === "fulfilled") setSubscription(subscriptionPromise.value.data as Subscription);

        // Setting the data loading state to false
        setIsloadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      // If there is no user and no loading is happening, reset userDetails and subscription to null
      setUserDetails(null);
      setSubscription(null);
    }
    // Adding dependencies to useEffect to ensure it runs when necessary
  }, [user, isLoadingUser]);

  // Defining the value for the UserContext.Provider
  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  // Returning a UserContext.Provider with the value and props passed down to children components
  return <UserContext.Provider value={value} {...props} />;
};

// Defining a custom hook for accessing the UserContext value
export const useUser = () => {
  // Getting the current context value using useContext hook
  const context = useContext(UserContext);
  // Throwing an error if context is undefined (i.e. used outside of a MyUserContextProvider)
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
