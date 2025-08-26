import { create } from "zustand";
import api from "../util/api";
import type z from "zod";
import { redemptionSchema } from "../../../common/schema/redemption.schema";

type TRedemption = z.infer<typeof redemptionSchema>;

interface RedeemStore {
  isLoading: boolean;
  error: string | null;
  redemptionSuccessful: boolean;
  redeemItem: (itemId: string) => Promise<void>;
  getItemStatus: (itemId: string) => Promise<any>;
  resetRedemptionState: () => void;
  redemptions: TRedemption[];
  getRedemptions: () => Promise<void>;
}

const useRedeemStore = create<RedeemStore>((set) => ({
  isLoading: false,
  error: null,
  redemptionSuccessful: false,
  redemptions: [],
  redeemItem: async (itemId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post(`/redemptions/${itemId}`);
      set({ redemptionSuccessful: true });
      return response.data.data;
    } catch (error: any) {
      console.log(error);

      if (error?.status === 500) {
        set({ error: "Something went wrong while redeeming the item" });
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
      const response = await api.get(`/redemptions/${itemId}`);
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
  resetRedemptionState: () => {
    set({ error: null, isLoading: false, redemptionSuccessful: false });
  },
  getRedemptions: async () => {
    try {
      const response = await api.get("/redemptions");

      set({ redemptions: response.data.data });
      console.log(response.data.data);
    } catch (err: any) {
      console.log("Failed to fetch user's redemptions: ", err);

      if (err.status == 500) {
        throw new Error("Something went wrong while fetching redemptions");
      }
    }
  },
}));

export default useRedeemStore;
