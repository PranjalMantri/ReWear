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
  acceptSwap: (swapId: string) => Promise<void>;
  rejectSwap: (swapId: string) => Promise<void>;
  cancelSwap: (swapId: string) => Promise<void>;
  completeSwap: (swapId: string) => Promise<void>;
}

const useSwapStore = create<SwapStore>((set, get) => ({
  isLoading: false,
  error: null,
  swapSuccessful: false,
  swaps: [],
  proposeSwap: async (
    proposedItemId: string,
    receiver: string,
    receivedItemId: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(`/swap/propose`, {
        proposedItemId,
        receiver,
        receivedItemId,
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
  acceptSwap: async (swapId: string) => {
    const { swaps } = get();

    set({
      swaps: swaps.map((swap) =>
        swap._id === swapId ? { ...swap, status: "accepted" } : swap
      ),
    });

    try {
      await api.put(`/swap/${swapId}/accept`);

      await get().getSwaps();
    } catch (err: any) {
      console.error("Failed to accept swap:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while accepting swap";

      throw new Error(errorMessage);
    }
  },
  rejectSwap: async (swapId: string) => {
    const { swaps } = get();

    set({
      swaps: swaps.map((swap) =>
        swap._id === swapId ? { ...swap, status: "rejected" } : swap
      ),
    });

    try {
      await api.put(`/swap/${swapId}/reject`);

      await get().getSwaps();
    } catch (err: any) {
      console.error("Failed to reject swap:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while rejectign swap";

      throw new Error(errorMessage);
    }
  },
  cancelSwap: async (swapId: string) => {
    const { swaps } = get();

    set({
      swaps: swaps.map((swap) =>
        swap._id === swapId ? { ...swap, status: "cancelled" } : swap
      ),
    });

    try {
      await api.put(`/swap/${swapId}/cancel`);

      await get().getSwaps();
    } catch (err: any) {
      console.error("Failed to cancel swap:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while cancelling swap";

      throw new Error(errorMessage);
    }
  },
  completeSwap: async (swapId: string) => {
    try {
      await api.put(`/swap/${swapId}/complete`);

      await get().getSwaps();
    } catch (err: any) {
      console.error("Failed to complete swap:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while complete swap";

      throw new Error(errorMessage);
    }
  },
}));

export default useSwapStore;
