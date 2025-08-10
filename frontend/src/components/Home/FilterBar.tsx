import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useSearchParams } from "react-router-dom";
import useFilterStore from "../../store/filter.store";

interface IFilterOption {
  label: string;
  value: string;
}

interface IFilterGroup {
  name: string;
  queryKey: string;
  options: IFilterOption[];
}

const filterGroups: IFilterGroup[] = [
  {
    name: "Category",
    queryKey: "category",
    options: [
      { label: "Shirt", value: "shirt" },
      { label: "T-shirt", value: "tshirt" },
      { label: "Pant", value: "pant" },
      { label: "Jacket", value: "jacket" },
      { label: "Dress", value: "dress" },
      { label: "Accessories", value: "accessories" },
      { label: "Footwear", value: "footwear" },
    ],
  },
  {
    name: "Size",
    queryKey: "size",
    options: [
      { label: "S", value: "small" },
      { label: "M", value: "medium" },
      { label: "L", value: "large" },
      { label: "XL", value: "xlarge" },
    ],
  },
  {
    name: "Brand",
    queryKey: "brand",
    options: [
      { label: "Adidas", value: "Adidas" },
      { label: "Zara", value: "Zara" },
      { label: "Levi's", value: "Levi's" },
      { label: "H&M", value: "H&M" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "Condition",
    queryKey: "condition",
    options: [
      { label: "New with tags", value: "new_with_tags" },
      { label: "New without tags", value: "new_without_tags" },
      { label: "Like New", value: "like_new" },
      { label: "Used", value: "used" },
      { label: "Gently Used", value: "gently_used" },
      { label: "Good", value: "good" },
      { label: "Fair", value: "fair" },
      { label: "Poor", value: "poor" },
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

        const selectedOption = group.options.find(
          (o) => o.value === selectedValue
        );

        return (
          <DropdownMenu.Root key={group.name}>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:ring-2 data-[state=open]:ring-black transition-all">
                <span>{selectedOption?.label || group.name}</span>
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
                    key={option.label}
                    onSelect={() => handleSelect(group.queryKey, option.value)}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-black cursor-pointer focus:outline-none focus:bg-gray-100"
                  >
                    {option.label}
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
