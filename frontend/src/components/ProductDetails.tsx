import type z from "zod";
import type { itemSchema } from "../../../common/schema/item.schema";

type Item = z.infer<typeof itemSchema>;

interface ProductDetailsProps {
  item: Item;
}

const ProductDetails = ({ item }: ProductDetailsProps) => {
  const handleAction = () => {
    console.log(`Action taken for ${item.listingType} item:`, item._id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl">
      {/* Title & Description */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {item.title}
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed">{item.description}</p>

      {/* Item Info */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 divide-y divide-gray-200">
        <div className="flex justify-between py-2">
          <span className="text-sm text-gray-500">Brand</span>
          <span className="font-medium text-gray-800">{item.brand}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-sm text-gray-500">Size</span>
          <span className="font-medium text-gray-800">
            {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-sm text-gray-500">Condition</span>
          <span className="font-medium text-gray-800">
            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        {item.listingType === "redeem" && (
          <>
            <h3 className="font-semibold text-lg text-gray-900">
              Redeem with Points
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Use your accumulated points to redeem this item instantly.
            </p>
            <button
              onClick={handleAction}
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors"
            >
              Redeem ({item.price} Points)
            </button>
          </>
        )}

        {item.listingType === "swap" && (
          <>
            <h3 className="font-semibold text-lg text-gray-900">Swap Item</h3>
            <p className="mt-2 text-sm text-gray-600">
              Offer an item from your wardrobe to start the exchange.
            </p>
            <button
              onClick={handleAction}
              className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors"
            >
              Offer a Swap
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
