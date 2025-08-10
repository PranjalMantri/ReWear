import FilterBar from "../components/Home/FilterBar";
import ItemGrid from "../components/Home/ItemGrid";
import useItemStore from "../store/item.store";
import useFilterStore from "../store/filter.store";
import { useEffect } from "react";

function HomePage() {
  const { isLoading, error, items, fetchItems } = useItemStore();
  const { filters, searchQuery } = useFilterStore();

  useEffect(() => {
    fetchItems(filters, searchQuery);
  }, [filters, fetchItems, searchQuery]);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FilterBar />
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        <ItemGrid items={items} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default HomePage;
