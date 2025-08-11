import type { itemSchema } from "../../../common/schema/item.schema";
import { z } from "zod";
import ProductmageGallery from "../components/ProductmageGallery";
import ProductDetails from "../components/ProductDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useItemStore from "../store/item.store";

type Item = z.infer<typeof itemSchema>;

const ProductDetailPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemById = useItemStore((state) => state.fetchItemById);

  useEffect(() => {
    const getItem = async () => {
      try {
        setIsLoading(true);

        if (!itemId) {
          setIsLoading(false);
          setError("The URL might be broken");
          return;
        }

        const data = await fetchItemById(itemId);
        setItem(data);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getItem();
  }, [itemId, fetchItemById]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!item) {
    return <div>Could not find the requested item</div>;
  }

  return (
    <div className="flex flex-row mx-auto max-w-7xl gap-4 p-4 items-center justify-center">
      {item && (
        <div className="flex">
          <div className="flex-1">
            <ProductmageGallery images={item.images} />
          </div>
          <div className="flex">
            <ProductDetails item={item} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
