import { create } from "zustand";

interface NotificationStore {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {
    set({ isModalOpen });
  },
}));

export default useNotificationStore;
