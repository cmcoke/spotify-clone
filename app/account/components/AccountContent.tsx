/*
  This code defines a React functional component named AccountContent that displays different content based on subscription truthiness using imported hooks and components, 
  
  handles redirecting to customer portal by calling an imported function to post data and assigning window.location to returned url, and updates loading state using useState hook.
*/

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";

const AccountContent = () => {
  const router = useRouter(); // calls the useRouter hook and assigns its return value to a variable named router.
  const subscribeModal = useSubscribeModal(); // calls the useSubscribeModal hook and assigns its return value to a variable named subscribeModal.
  const { isLoading, subscription, user } = useUser(); //  calls the useUser hook and destructures its return value into isLoading, subscription, and user variables.

  const [loading, setLoading] = useState(false); //  calls the useState hook with an initial value of false and destructures its return value into loading and setLoading variables.

  useEffect(() => {
    // checks if isLoading is falsy and user is falsy and if so, calls replace on router with “/” argument
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    // calls setLoading with true argument.
    setLoading(true);
    try {
      // calls postData with provided url argument, destructures its return value into url and error variables, and calls assign on window.location with url argument.
      const { url, error } = await postData({
        url: "/api/create-portal-link"
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active plan.</p>
          <Button onClick={subscribeModal.onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the
            <b> {subscription?.prices?.products?.name} </b>
            plan.
          </p>
          <Button disabled={loading || isLoading} onClick={redirectToCustomerPortal} className="w-[300px]">
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
