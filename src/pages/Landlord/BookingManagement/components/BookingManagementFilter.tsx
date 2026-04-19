import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface BookingFilterValues {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface BookingManagementFilterProps {
  onFilterChange: (filters: BookingFilterValues) => void;
  filters: BookingFilterValues;
  onReset?: () => void;
}

const SORT_BY_OPTIONS = [
  { label: "Created Date", value: "createdAt" },
  { label: "Status", value: "status" },
  { label: "Total", value: "total" },
  { label: "Check-in Date", value: "checkInDate" },
];

const SORT_ORDER_OPTIONS = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

function BookingManagementFilter({
  onFilterChange,
  filters,
  onReset,
}: BookingManagementFilterProps) {
  const [search, setSearch] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({
      ...filters,
      search: value,
    });
  };

  const handleSortByChange = (value: string) => {
    onFilterChange({
      ...filters,
      sortBy: value,
    });
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    onFilterChange({
      ...filters,
      sortOrder: value,
    });
  };

  const handleReset = () => {
    setSearch("");
    onReset?.();
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-card border border-border rounded-lg mb-4">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Search</label>
        <input
          type="text"
          placeholder="Search booking..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border rounded-lg px-3 py-2 w-48"
        />
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={filters.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {SORT_BY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Sort Order</label>
        <Select value={filters.sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            {SORT_ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="gap-2"
      >
        <X className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}

export default BookingManagementFilter;
