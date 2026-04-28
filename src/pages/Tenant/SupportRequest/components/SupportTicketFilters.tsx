import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SupportTicketFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

export interface FilterState {
  status: string;
  priority: string;
  category: string;
  search: string;
}

export function SupportTicketFilters({
  onFilterChange,
  isLoading,
}: SupportTicketFiltersProps) {
  const { t } = useTranslation("support");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  });

  const statusOptions = [
    { value: "all", label: t("support.filters.allStatus") },
    { value: "open", label: t("support.statuses.open") },
    { value: "in_progress", label: t("support.statuses.in_progress") },
    { value: "resolved", label: t("support.statuses.resolved") },
    { value: "closed", label: t("support.statuses.closed") },
    { value: "escalated", label: t("support.statuses.escalated") },
  ];

  const priorityOptions = [
    { value: "all", label: t("support.filters.allPriority") },
    { value: "low", label: t("support.priorities.low") },
    { value: "medium", label: t("support.priorities.medium") },
    { value: "high", label: t("support.priorities.high") },
    { value: "urgent", label: t("support.priorities.urgent") },
  ];

  const categoryOptions = [
    { value: "all", label: t("support.filters.allCategory") },
    { value: "booking_issue", label: t("support.categories.booking_issue") },
    { value: "payment_problem", label: t("support.categories.payment_problem") },
    { value: "listing_problem", label: t("support.categories.listing_problem") },
    {
      value: "account_verification",
      label: t("support.categories.account_verification"),
    },
    { value: "cancellation", label: t("support.categories.cancellation") },
    { value: "dispute", label: t("support.categories.dispute") },
    { value: "property_quality", label: t("support.categories.property_quality") },
    { value: "other", label: t("support.categories.other") },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "all",
      priority: "all",
      category: "all",
      search: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.search !== "";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("support.filters.search")}
          className="pl-10"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("filters.statusPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => handleFilterChange("priority", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("filters.priorityPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("filters.categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          {t("filters.reset")}
        </Button>
      )}
    </div>
  );
}
