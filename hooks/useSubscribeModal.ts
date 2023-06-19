// This code creates a Zustand store for managing the state of a subscribe modal, with an isOpen property and onOpen and onClose functions for updating its value, and exports a hook for accessing and updating the store’s state.

import { create } from "zustand";

// defines an interface named SubscribeModalStore.
interface SubscribeModalStore {
  isOpen: boolean; // defines an isOpen property of type boolean.
  onOpen: () => void; // defines an onOpen function property that takes no arguments and returns void.
  onClose: () => void; // defines an onClose function property that takes no arguments and returns void.
}

// creates a Zustand store with the provided SubscribeModalStore type and set function, and assigns it to a variable named useSubscribeModal.
const useSubscribeModal = create<SubscribeModalStore>(set => ({
  isOpen: false, //  sets the initial value of the isOpen property to false.
  onOpen: () => set({ isOpen: true }), // defines the onOpen function to call the set function with isOpen set to true.
  onClose: () => set({ isOpen: false }) // defines the onClose function to call the set function with isOpen set to false.
}));

export default useSubscribeModal;
