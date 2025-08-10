import { z } from "zod";
import { itemSchema } from "../../../../common/schema/item.schema";
import { sizeMap } from "../../constants";
import { Link } from "react-router-dom";

type ItemCardProps = z.infer<typeof itemSchema>;

const formatString = (str: string = ""): string => {
  return str.charAt(0).toUpperCase() + str.replace(/_/g, " ").slice(1);
};

const ItemCard: React.FC<ItemCardProps> = (item) => {
  const { title, images, _id, size, brand, condition, listingType } = item;

  const details = [sizeMap[size], brand, formatString(condition)]
    .filter(Boolean)
    .join(" | ");

  return (
    <Link to={`/items/${_id}`} className="block group w-full">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-300 group-hover:shadow-xl flex flex-col h-full">
        <div className="relative">
          <img
            src={images?.[0]}
            alt={title}
            className="w-full object-contain h-60"
          />
          <span className="absolute top-1.5 right-2 bg-black/70 text-white  text-xs font-semibold px-2 py-1 rounded-full flex items-center justify-center">
            {formatString(listingType)}
          </span>
        </div>
        <div className="py-3 px-2 flex flex-grow flex-col">
          <h3
            className="text-lg font-semibold text-gray-800 truncate"
            title={title}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex-grow">{details}</p>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
