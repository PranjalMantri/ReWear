import { create } from "zustand";
import type { itemSchema } from "../../../common/schema/item.schema";
import type z from "zod";
import api from "../util/api";

type Items = z.infer<typeof itemSchema>;

interface ItemStore {
  items: Items[];
  isLoading: Boolean;
  error: null;
  fetchItems: (filters: string, query: string) => Promise<void>;
}

const useItemStore = create<ItemStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,
  fetchItems: async (filters: string, searchQuery: string) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams(filters);

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await api.get(`/items?${params.toString()}`);
      console.log(response);
      set({ items: response.data.data.items });
    } catch (err: any) {
      console.log(err);

      const errorMessage =
        err?.response.data.message || "An unexpected error occurred";

      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useItemStore;
