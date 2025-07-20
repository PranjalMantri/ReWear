import { create } from "zustand";

interface UserStore {
  isUserLoggedIn: boolean;
}

const useUserStore = create<UserStore>(() => ({
  isUserLoggedIn: true,
}));

export default useUserStore;
