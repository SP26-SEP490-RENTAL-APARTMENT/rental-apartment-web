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
  const { t: filterT } = useTranslation("filter");
  const sortOptions: Array<{ value: keyof Apartment; label: string }> = [
    { value: "basePricePerNight", label: filterT("apartment.pricePerNight") },
    { value: "maxOccupants", label: filterT("apartment.maxOccupant") },
  ];

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div>
        <Label
          htmlFor="search"
          className="block text-sm font-semibold text-gray-900 mb-3"
        >
          {filterT("label.search")}
        </Label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <Input
            id="search"
            type="text"
            placeholder={filterT("apartment.address") + ", " + filterT("apartment.title")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 py-2.5 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        {/* Sort By Select */}
        <div>
          <Label className="block text-sm font-semibold text-gray-900 mb-2">
            {filterT("label.sortBy")}
          </Label>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortByChange(value as keyof Apartment)}
          >
            <SelectTrigger className="bg-white border border-gray-300 rounded-lg">
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
        <div>
          <Label className="block text-sm font-semibold text-gray-900 mb-2">
            {filterT("label.sortOrder")}
          </Label>
          <Button
            variant={sortOrder === "asc" ? "default" : "outline"}
            onClick={() =>
              onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
            }
            className="w-full h-10 rounded-lg"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "asc" ? filterT("label.asc") : filterT("label.desc")}
          </Button>
        </div>

        {/* Clear Filters Button */}
        <div>
          <Button
            variant="outline"
            onClick={() => {
              onSearchChange("");
              onSortByChange("basePricePerNight");
              onSortOrderChange("asc");
            }}
            className="w-full h-10 rounded-lg"
          >
            {filterT("label.clearFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeFilter;
