import { z } from "zod";
import { itemSchema } from "../../../common/schema/item.schema";
import FilterBar from "../components/Home/FilterBar";
import ItemGrid from "../components/Home/ItemGrid";

type ItemCardProps = z.infer<typeof itemSchema>;

function HomePage() {
  const items: ItemCardProps[] = [
    {
      _id: "123",
      title: "Vintage Denim Jacket",
      description:
        "Classic Levi's-style denim jacket, barely used, perfect for casual layering.",
      category: "jacket",
      gender: "unisex",
      size: "medium",
      condition: "gently_used",
      tags: ["denim", "vintage", "casual", "winter"],
      price: 0,
      images: [
        "https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c",
      ],
      listingType: "swap", // or "sell", "donate"
      status: "active",
      color: "blue",
      brand: "Levi's",
    },
    {
      _id: "123",
      title: "Vintage Denim Jacket",
      description:
        "Classic Levi's-style denim jacket, barely used, perfect for casual layering.",
      category: "jacket",
      gender: "unisex",
      size: "medium",
      condition: "gently_used",
      tags: ["denim", "vintage", "casual", "winter"],
      price: 0,
      images: [
        "https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c",
      ],
      listingType: "swap", // or "sell", "donate"
      status: "active",
      color: "blue",
      brand: "Levi's",
    },
    {
      _id: "123",
      title: "Vintage Denim Jacket",
      description:
        "Classic Levi's-style denim jacket, barely used, perfect for casual layering.",
      category: "jacket",
      gender: "unisex",
      size: "medium",
      condition: "gently_used",
      tags: ["denim", "vintage", "casual", "winter"],
      price: 0,
      images: [
        "https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c",
      ],
      listingType: "swap", // or "sell", "donate"
      status: "active",
      color: "blue",
      brand: "Levi's",
    },
    {
      _id: "123",
      title: "Vintage Denim Jacket",
      description:
        "Classic Levi's-style denim jacket, barely used, perfect for casual layering.",
      category: "jacket",
      gender: "unisex",
      size: "medium",
      condition: "gently_used",
      tags: ["denim", "vintage", "casual", "winter"],
      price: 0,
      images: [
        "https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c",
      ],
      listingType: "swap", // or "sell", "donate"
      status: "active",
      color: "blue",
      brand: "Levi's",
    },
  ];

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FilterBar />
        <ItemGrid items={items} />
      </div>
    </div>
  );
}

export default HomePage;
