import { create } from "zustand";

interface FilterStore {
  filters: any;
  updateFilters: (key: string, value: string) => void;
  clearFilters: () => void;
  searchQuery: string;
  updateSearchQuery: (searchQuery: string) => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  updateFilters: (key, value) => {
    set((state: FilterStore) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },
  clearFilters: () => set({ filters: {} }),
  searchQuery: "",
  updateSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
  },
}));

export default useFilterStore;
