import React from "react";
import { z } from "zod";
import type { itemSchema } from "../../../../common/schema/item.schema";
import ItemCard from "./ItemCard";

type Items = z.infer<typeof itemSchema>;

interface ItemGridProps {
  items: Items[];
  isLoading: Boolean;
}

const ItemCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
    <div className="w-full h-52 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);

const ItemGrid: React.FC<ItemGridProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <ItemCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <div>No items to show</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.length > 0 &&
        items.map((item) => <ItemCard key={item._id} {...item} />)}
    </div>
  );
};

export default ItemGrid;
