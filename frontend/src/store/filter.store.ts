import { create } from "zustand";

interface FilterStore {
  filters: any;
  updateFilters: (key: string, value: string) => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filters: {},
  updateFilters: (key, value) => {
    set((state: FilterStore) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },
  clearFilters: () => set({ filters: {} }),
}));

export default useFilterStore;
