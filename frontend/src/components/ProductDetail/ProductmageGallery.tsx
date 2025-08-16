import { useState } from "react";
import useSwapStore from "../../store/swap.store";

interface ProductmageGalleryProps {
  images: string[];
}

const ProductmageGallery = ({ images }: ProductmageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  const { isSwapModalOpen } = useSwapStore();

  if (!activeImage) {
    return (
      <div className="w-full aspect-sqaure bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500">No Images</p>
      </div>
    );
  }

  return (
    <div className={`${isSwapModalOpen ? "opacity-50" : "opacity-100"}`}>
      <img
        src={activeImage}
        alt={"Main image preview"}
        className="w-full max-h-[55vh] aspect-square object-contain rounded-lg shadow-md"
      />

      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => setActiveImage(img)}
            className="rounded-md overflow-hidden ring-offset-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img
              src={img}
              alt={"Item Thumbnail"}
              className={`w-full aspect-square object-cover transition-all duration-200 ${
                activeImage === img
                  ? "opacity-100 scale-105"
                  : "opacity-60 hover:opacity-1000"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductmageGallery;
