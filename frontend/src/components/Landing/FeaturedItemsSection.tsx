import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface FeaturedItem {
  id: number;
  title: string;
  category: string;
  condition: string;
  points: number;
  image: string;
  user: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    category: "Outerwear",
    condition: "Like New",
    points: 45,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    user: "Emma K.",
  },
  {
    id: 2,
    title: "Designer Silk Scarf",
    category: "Accessories",
    condition: "Excellent",
    points: 35,
    image:
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=500&fit=crop",
    user: "Alex M.",
  },
  {
    id: 3,
    title: "Boho Maxi Dress",
    category: "Dresses",
    condition: "Good",
    points: 40,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    user: "Sarah L.",
  },
  {
    id: 4,
    title: "Classic Wool Coat",
    category: "Outerwear",
    condition: "Very Good",
    points: 55,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
    user: "Maya R.",
  },
];

interface FeaturedItemsProps {
  items: FeaturedItem[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  setCurrentSlide: (index: number) => void;
}

const FeaturedItemsSection: React.FC<FeaturedItemsProps> = ({
  items,
  currentSlide,
  nextSlide,
  prevSlide,
  setCurrentSlide,
}) => {
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="py-20 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Hot Swaps this week
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Check out some of the most sought-after items currently available on
            the platform.
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden max-h-[650px] relative md:h-auto">
            {/* h-[650px] */}
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`w-full h-full transition-opacity duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 z-10"
                    : "opacity-0 absolute top-0 left-0 pointer-events-none"
                }`}
              >
                <div className="w-full h-full p-2">
                  <div className="grid md:grid-cols-2 items-center gap-8 bg-slate-100/70 p-8 h-full rounded-3xl">
                    <div className="relative group w-full h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full aspect-[4/5] object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-800">
                        {item.condition}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="font-semibold text-emerald-600">
                        {item.category}
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-slate-600">
                        <img
                          className="w-6 h-6 rounded-full"
                          src={`https://i.pravatar.cc/24?u=${item.user}`}
                          alt={item.user}
                        />
                        <span>
                          Listed by <strong>{item.user}</strong>
                        </span>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-xl my-6">
                        <div className="text-emerald-800 font-bold text-2xl">
                          {item.points} Points
                        </div>
                        <div className="text-emerald-600 text-sm">
                          or available for a direct
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300">
                          Swap Request{" "}
                        </button>
                        <button className="flex-1 border-2 border-emerald-500 text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300">
                          Use Points
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 md:-left-12 transform -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-md hover:shadow-lg transition-all z-20"
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 md:-right-12 transform -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full shadow-md hover:shadow-lg p-3 transtiotin-all z-20"
          >
            <ChevronRight />
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-emerald-600 scale-125"
                    : "bg-slate-300 hover:bg-slate-400"
                } `}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItemsSection;
export { featuredItems };
export type { FeaturedItem };
