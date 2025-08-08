import React from "react";
import { z } from "zod";
import type { itemSchema } from "../../../../common/schema/item.schema";
import ItemCard from "./ItemCard";

type Items = z.infer<typeof itemSchema>;

interface ItemGridProps {
  items: Items[];
}

const ItemGrid: React.FC<ItemGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id} {...item} />
      ))}
    </div>
  );
};

export default ItemGrid;
