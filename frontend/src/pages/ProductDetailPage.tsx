import ProductmageGallery from "../components/ProductmageGallery";
import ProductDetails from "../components/ProductDetails";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useItemStore from "../store/item.store";

const ProductDetailPage = () => {
  const { itemId } = useParams();

  const { item, isLoading, error, fetchItemById } = useItemStore();

  useEffect(() => {
    if (!itemId) return;
    fetchItemById(itemId);
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
