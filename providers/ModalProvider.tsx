"use client";

import AuthModal from "@/components/AuthModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
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
    </>
  );
};
export default ModalProvider;
