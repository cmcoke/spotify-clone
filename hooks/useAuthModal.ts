import { create } from "zustand";

// Defining the type for the AuthModalStore
interface AuthModalStore {
  isOpen: boolean; // A boolean value indicating whether the modal is open
  onOpen: () => void; // A function to open the modal
  onClose: () => void; // A function to close the modal
}

// Creating a zustand store using the create function and defining its initial state and actions
const useAuthModal = create<AuthModalStore>(set => ({
  isOpen: false, // The initial value for the isOpen state
  onOpen: () => set({ isOpen: true }), // An action to set the isOpen state to true
  onClose: () => set({ isOpen: false }) // An action to set the isOpen state to false
}));

export default useAuthModal;
