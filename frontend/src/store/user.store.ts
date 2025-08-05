import { create } from "zustand";
import api from "../util/api";
import { z } from "zod";
import type {
  signinSchema,
  signupSchema,
} from "../../../common/schema/user.schema";

interface UserStore {
  isLoading: boolean;
  error: string | null;
  isUserLoggedIn: boolean;
  isAuthChecked: boolean;
  user: Object | null;
  signupUser: (data: SignupFormFields) => Promise<void>;
  signinUser: (data: SigninFormFields) => Promise<void>;
  checkAuth: () => Promise<void>;
}

type SignupFormFields = z.infer<typeof signupSchema>;
type SigninFormFields = z.infer<typeof signinSchema>;

const useUserStore = create<UserStore>((set) => ({
  isLoading: false,
  error: null,
  isUserLoggedIn: false,
  user: null,
  signupUser: async (data: SignupFormFields) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/user/signup", data);
      set({ isUserLoggedIn: true, user: response.data.user });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "An unexpected error occured";
      set({ error: errorMessage });

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  signinUser: async (data: SigninFormFields) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/user/signin", data);
      set({ isUserLoggedIn: true, user: response.data.user });
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "An unexpected error occured";
      set({ error: errorMessage });

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  isAuthChecked: false,
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const response = await api.get("/user/me");
      set({
        isUserLoggedIn: true,
        user: response.data.user,
        error: null,
      });
    } catch (err: any) {
      set({
        isUserLoggedIn: false,
        user: null,
        error: null,
      });
    } finally {
      set({ isLoading: false, isAuthChecked: true });
    }
  },
}));

export default useUserStore;
