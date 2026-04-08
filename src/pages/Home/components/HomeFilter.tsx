import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Apartment } from "@/types/apartment";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface HomeFilterProps {
  search: string;
  sortBy: keyof Apartment;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortByChange: (value: keyof Apartment) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

function HomeFilter({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: HomeFilterProps) {
  const { t: apartmentT } = useTranslation("apartment");
  const { t: filterT } = useTranslation("filter");
  const sortOptions: Array<{ value: keyof Apartment; label: string }> = [
    { value: "address", label: apartmentT("address") },
    { value: "title", label: apartmentT("title") },
    { value: "basePricePerNight", label: apartmentT("pricePerNight") },
    { value: "maxOccupants", label: apartmentT("maxOccupants") },
    { value: "createdAt", label: apartmentT("createdAt") },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {filterT("search")}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, địa chỉ..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-4">
          {/* Sort By Select */}
          <div className="flex-1">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              {filterT("sortBy")}
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                onSortByChange(value as keyof Apartment)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order Button */}
          <div className="flex items-end">
            <Button
              variant={sortOrder === "asc" ? "default" : "outline"}
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
              className="h-10"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? filterT("desc") : filterT("asc")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFilter;
