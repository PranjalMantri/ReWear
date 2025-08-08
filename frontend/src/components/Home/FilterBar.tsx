import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSearchParams } from "react-router-dom";
import useFilterStore from "../../store/filter.store";

interface IFilterGroup {
  name: string;
  queryKey: string;
  options: string[];
}

const filterGroups: IFilterGroup[] = [
  {
    name: "Category",
    queryKey: "category",
    options: [
      "Shirt",
      "Tshirt",
      "Pant",
      "Jacket",
      "Dress",
      "Accessories",
      "Footwear",
    ],
  },
  {
    name: "Size",
    queryKey: "size",
    options: ["S", "M", "L", "XL"],
  },
  {
    name: "Brand",
    queryKey: "brand",
    options: ["Adidas", "Zara", "Levi's", "H&M"],
  },
  {
    name: "Condition",
    queryKey: "condition",
    options: [
      "New with tags",
      "New without tags",
      "Like ew",
      "Used",
      "Gently sed",
      "Good",
      "Fair",
      "Poor",
    ],
  },
];

function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters: selectedFilters, updateFilters } = useFilterStore();

  const handleSelect = (key: string, value: string) => {
    updateFilters(key, value);

    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {filterGroups.map((group) => {
        const selectedValue =
          selectedFilters[group.queryKey] || searchParams.get(group.queryKey);

        return (
          <DropdownMenu.Root key={group.name}>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:ring-2 data-[state=open]:ring-black transition-all">
                <span>{selectedValue || group.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={5}
                className="w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 animate-in fade-in-20"
              >
                {group.options.map((option) => (
                  <DropdownMenu.Item
                    key={option}
                    onSelect={() => handleSelect(group.queryKey, option)}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-black cursor-pointer focus:outline-none focus:bg-gray-100"
                  >
                    {option}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      })}
    </div>
  );
}

export default FilterBar;
