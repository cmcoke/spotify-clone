/*
   This code defines a React functional component named SubscribeModal that displays a Modal with Button components for each price of each provided product that has prices, 
   
   and handles checkout by calling an imported function to post data, retrieving stripe object using an imported function, and redirecting to checkout using it.
*/

"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductWithPrice } from "@/types";

import Modal from "./Modal";
import Button from "./Button";

// defines an interface named SubscribeModalProps.
interface SubscribeModalProps {
  products: ProductWithPrice[]; // defines a products property of type array of ProductWithPrice.
}

// defines a function named formatPrice that takes a Price object as an argument.
const formatPrice = (price: Price) => {
  // creates a new Intl.NumberFormat object with provided options and formats the unit_amount property of the price object divided by 100 using it, returning the result.
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

// defines a functional component named SubscribeModal that takes an object with a products property as props and destructures it.
const SubscribeModal = ({ products }: SubscribeModalProps) => {
  // calls the useSubscribeModal hook and assigns its return value to a variable named subscribeModal.
  const subscribeModal = useSubscribeModal();

  // calls the useUser hook and destructures its return value into user, isLoading, and subscription variables.
  const { user, isLoading, subscription } = useUser();

  // calls the useState hook with an initial value of undefined and destructures its return value into priceIdLoading and setPriceIdLoading variables.
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  // defines a function named onChange that takes a boolean argument named open.
  const onChange = (open: boolean) => {
    //  checks if open is falsy.
    if (!open) {
      // if it is, calls the onClose function of subscribeModal.
      subscribeModal.onClose();
    }
  };

  // defines an async function named handleCheckout that takes a Price object as an argument.
  const handleCheckout = async (price: Price) => {
    //  calls setPriceIdLoading with the id property of price.
    setPriceIdLoading(price.id);

    // Checks if user is falsy and if so, calls setPriceIdLoading with undefined, returns early, and displays an error toast with “Must be logged in” message.
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }

    // Checks if subscription is truthy and if so, calls setPriceIdLoading with undefined, returns early, and displays a toast with “Already subscribed” message.
    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already subscribed");
    }

    try {
      // calls postData with provided url and data arguments, destructures its return value to get sessionId,
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price }
      });

      // calls getStripe to retrieve stripe object, and calls redirectToCheckout on stripe with provided sessionId.
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  // Initializes content variable to display “No products available.” message if products length is 0.
  let content = <div className="text-center">No products available.</div>;

  // If products length is greater than 0, sets content to display Button components for each price of each product that has prices.
  if (products.length) {
    content = (
      <div>
        {products.map(product => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product.prices.map(price => (
            <Button key={price.id} onClick={() => handleCheckout(price)} disabled={isLoading || price.id === priceIdLoading} className="mb-4" aria-label="subscribe">
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  //  If subscription is truthy, sets content to display “Already subscribed.” message.
  if (subscription) {
    content = <div className="text-center">Already subscribed.</div>;
  }

  return (
    <Modal title="Only for premium users" description="Listen to music with Spotify Premium" isOpen={subscribeModal.isOpen} onChange={onChange}>
      {content}
    </Modal>
  );
};

export default SubscribeModal;
