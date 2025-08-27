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
  cancelRedemption: (redemptionId: string) => Promise<void>;
  markItemReceived: (redemptionId: string) => Promise<void>;
  markItemShipped: (redemptionId: string) => Promise<void>;
}

const useRedeemStore = create<RedeemStore>((set, get) => ({
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
    } catch (err: any) {
      console.log("Failed to fetch user's redemptions: ", err);

      if (err.status == 500) {
        throw new Error("Something went wrong while fetching redemptions");
      }
    }
  },
  cancelRedemption: async (redemptionId: string) => {
    console.log("cancel redemption was called");

    const { redemptions } = get();

    set({
      redemptions: redemptions.map((redemption) =>
        redemption._id === redemptionId
          ? { ...redemption, status: "cancelled" }
          : redemption
      ),
    });

    try {
      await api.put(`/redemptions/${redemptionId}/cancel`);

      await get().getRedemptions();
    } catch (err: any) {
      console.error("Failed to cancel redemption:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while cancelling redemption";

      throw new Error(errorMessage);
    }
  },
  markItemReceived: async (redemptionId: string) => {
    const { redemptions } = get();

    set({
      redemptions: redemptions.map((redemption) =>
        redemption._id === redemptionId
          ? { ...redemption, confirmedByReceiver: true }
          : redemption
      ),
    });

    try {
      await api.put(`/redemptions/${redemptionId}/mark-received`);

      await get().getRedemptions();
    } catch (err: any) {
      console.error("Failed to mark item as received:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while marking item as received";

      throw new Error(errorMessage);
    }
  },
  markItemShipped: async (redemptionId: string) => {
    const { redemptions } = get();

    set({
      redemptions: redemptions.map((redemption) =>
        redemption._id === redemptionId
          ? { ...redemption, confirmedBySender: true }
          : redemption
      ),
    });

    try {
      await api.put(`/redemptions/${redemptionId}/mark-shipped`);

      await get().getRedemptions();
    } catch (err: any) {
      console.error("Failed to mark item as shipped:", err);

      const errorMessage =
        err?.response?.data?.message ||
        "Something went wrong while marking item as shipped";

      throw new Error(errorMessage);
    }
  },
}));

export default useRedeemStore;
