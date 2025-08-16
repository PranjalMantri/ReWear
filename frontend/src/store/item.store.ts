import { create } from "zustand";
import type { itemSchema } from "../../../common/schema/item.schema";
import type z from "zod";
import api from "../util/api";

type Item = z.infer<typeof itemSchema>;

interface ItemStore {
  items: Item[];
  item: Item | null;
  isLoading: Boolean;
  error: string | null;
  page: number;
  limit: number;
  hasMore: boolean;
  fetchItems: (filters: string, query: string) => Promise<void>;
  clearItems: () => void;
  fetchItemById: (itemId: string) => Promise<void>;
}

const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  item: null,
  isLoading: false,
  error: null,
  page: 1,
  limit: 20,
  hasMore: true,
  fetchItems: async (filters: string, searchQuery: string) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams(filters);

      params.set("page", get().page.toString());
      params.set("limit", get().limit.toString());

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await api.get(`/items?${params.toString()}`);

      const { items: newItems, totalCount } = response.data.data;

      set((state) => ({
        items: [...state.items, ...newItems],
        page: get().page + 1,
        hasMore: state.items.length + newItems.length < totalCount,
      }));
    } catch (err: any) {
      console.log(err);

      if (err.status == 500) {
        set({ error: "Something went wrong while fetching items" });
        return;
      }

      const errorMessage =
        err?.response.data.message || "An unexpected error occurred";

      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  clearItems: () => {
    set({ items: [], page: 1 });
  },
  fetchItemById: async (itemId: string) => {
    set({ isLoading: true, error: null, item: null });
    try {
      const response = await api.get(`/items/${itemId}`);

      set({ item: response.data.data });
    } catch (err: any) {
      console.log("Failed to fetch item by ID: ", err);

      if (err.status == 500) {
        throw new Error("Something went wrong while fetching item");
      }

      set({ error: err?.response?.data?.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useItemStore;
