
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export interface InspectionFilterValues {
  sortBy: string;
  sortOrder: "asc" | "desc";
  status: string;
}

interface InspectionFilterProps {
  onFilterChange: (filters: InspectionFilterValues) => void;
  filters: InspectionFilterValues;
  onReset?: () => void;
}

const SORT_BY_OPTIONS = [
  { label: "Scheduled Date", value: "scheduledDate" },
  { label: "Completed Date", value: "completedDate" },
  { label: "Status", value: "status" },
];

const STATUS_OPTIONS = [
//   { label: "All Statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Passed", value: "passed" },
];

const SORT_ORDER_OPTIONS = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

function InspectionFilter({
  onFilterChange,
  filters,
  onReset,
}: InspectionFilterProps) {
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

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value,
    });
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 bg-card border border-border rounded-lg mb-4">
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

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
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

export default InspectionFilter;
