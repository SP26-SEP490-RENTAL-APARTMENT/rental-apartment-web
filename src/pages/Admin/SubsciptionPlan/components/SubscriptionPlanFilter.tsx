import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface SubscriptionFilterProps {
  search: string;
  sortBy: keyof SubscriptionPlan;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortByChange: (value: keyof SubscriptionPlan) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

const SORT_OPTIONS: { key: keyof SubscriptionPlan; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "priceMonthly", label: "Monthly Price" },
  { key: "priceAnnual", label: "Annual Price" },
  { key: "maxApartments", label: "Max Apartments" },
  { key: "isActive", label: "Active" },
  { key: "features", label: "Features" },
  { key: "createdAt", label: "Created Date" },
];

function SubscriptionPlanFilter({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: SubscriptionFilterProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.key === sortBy)?.label || "Sort By";
  return <div className="flex gap-3 items-center">
      <Input
        type="text"
        placeholder="Search subscription plans..."
        value={searchValue}
        onChange={handleSearchInput}
        className="w-64"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            {currentSortLabel}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.key}
              onClick={() => onSortByChange(option.key)}
              className={sortBy === option.key ? "bg-accent" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleSortOrder}
        className="gap-2"
        title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
      >
        <ArrowUpDown className="h-4 w-4" />
        {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </Button>
    </div>;
}

export default SubscriptionPlanFilter;
