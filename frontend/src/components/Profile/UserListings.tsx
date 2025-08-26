import type z from "zod";
import type { itemSchema } from "../../../../common/schema/item.schema";
import ItemGrid from "../Home/ItemGrid";

type Items = z.infer<typeof itemSchema>;

interface UserListingsProps {
  items: Items[];
  isLoading: Boolean;
}

const UserListings: React.FC<UserListingsProps> = ({ items, isLoading }) => {
  return (
    <div className="mt-4">
      <ItemGrid items={items} isLoading={isLoading} />
    </div>
  );
};

export default UserListings;
