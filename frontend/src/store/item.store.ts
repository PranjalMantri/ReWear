import { create } from "zustand";
import type { itemSchema } from "../../../common/schema/item.schema";
import type z from "zod";
import api from "../util/api";

type Items = z.infer<typeof itemSchema>;

interface ItemStore {
  items: Items[];
  isLoading: Boolean;
  error: null;
  page: number;
  limit: number;
  hasMore: boolean;
  fetchItems: (filters: string, query: string) => Promise<void>;
  clearItems: () => void;
}

const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
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
      console.log(response);

      const { items: newItems, totalCount } = response.data.data;

      set((state) => ({
        items: [...state.items, ...newItems],
        page: get().page + 1,
        hasMore: state.items.length + newItems.length < totalCount,
      }));
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
  clearItems: () => {
    set({ items: [], page: 1 });
  },
}));

export default useItemStore;
