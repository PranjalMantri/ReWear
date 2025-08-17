import { create } from "zustand";
import api from "../util/api";
import { swapSchema } from "../../../common/schema/swap.schema";
import type z from "zod";

type TSwap = z.infer<typeof swapSchema>;

interface SwapStore {
  isLoading: boolean;
  error: string | null;
  swapSuccessful: boolean;
  proposeSwap: (
    proposedItemId: string,
    userId: string,
    userItemId: string
  ) => Promise<void>;
  getItemStatus: (itemId: string) => Promise<any>;
  isSwapModalOpen: boolean;
  setIsSwapModalOpen: (state: boolean) => void;
  resetSwapState: () => void;
  swaps: TSwap[];
  getSwaps: () => Promise<void>;
}

const useSwapStore = create<SwapStore>((set) => ({
  isLoading: false,
  error: null,
  swapSuccessful: false,
  swaps: [],
  proposeSwap: async (
    proposedItemId: string,
    receiver: string,
    receiveItemId: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(`/swap/propose`, {
        proposedItemId,
        receiver,
        receiveItemId,
      });
      set({ swapSuccessful: true });
      return response.data.data;
    } catch (error: any) {
      console.log(error);

      if (error?.status === 500) {
        set({ error: "Something went wrong while proposing a swap" });
        return;
      }

      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred";

      set({
        error: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  getItemStatus: async (itemId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get(`/swap/${itemId}`);
      return response.data.data;
    } catch (error: any) {
      console.log(error);

      if (error?.status === 500) {
        set({ error: "Something went wrong while checking the item status" });
        return;
      }

      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred";

      set({
        error: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  isSwapModalOpen: false,
  setIsSwapModalOpen: (state: boolean) => {
    set({ isSwapModalOpen: state });
  },
  resetSwapState: () => {
    set({
      error: null,
      isLoading: false,
      swapSuccessful: false,
      isSwapModalOpen: false,
    });
  },
  getSwaps: async () => {
    try {
      const response = await api.get("/swap");

      set({ swaps: response.data.data });
    } catch (err: any) {
      console.log("Failed to fetch user's swaps: ", err);

      if (err.status == 500) {
        throw new Error("Something went wrong while fetching swaps");
      }
    }
  },
}));

export default useSwapStore;
