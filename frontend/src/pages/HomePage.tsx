import FilterBar from "../components/Home/FilterBar";
import ItemGrid from "../components/Home/ItemGrid";
import useItemStore from "../store/item.store";
import useFilterStore from "../store/filter.store";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useRef } from "react";

function HomePage() {
  const { isLoading, error, items, hasMore, fetchItems, clearItems } =
    useItemStore();
  const { filters, searchQuery } = useFilterStore();

  const debouncedSearch = useDebounce(searchQuery, 300);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // clear current items list whenever any of the filters or search query changes
    clearItems();
    fetchItems(filters, debouncedSearch);
  }, [filters, fetchItems, debouncedSearch]);

  // to handle infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;

      if (isAtBottom && !isLoading && hasMore) {
        fetchItems(filters, debouncedSearch);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore, fetchItems, filters, debouncedSearch]);

  return (
    <div ref={containerRef} className="bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FilterBar />
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        <ItemGrid items={items} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default HomePage;
