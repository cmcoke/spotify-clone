"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";

interface ModalProvideProps {
  products: ProductWithPrice[];
}

const ModalProvider = ({ products }: ModalProvideProps) => {
  const [isMounted, setIsMounted] = useState(false);

  // prevents hydration errors by updating 'isMounted' to true after the component has mounted.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If the isMounted state variable is false
  if (!isMounted) {
    return null; // Return null to prevent rendering until the component has mounted
  }

  // Once the component has mounted and the isMounted state variable is updated to true, the component will render
  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};
export default ModalProvider;
