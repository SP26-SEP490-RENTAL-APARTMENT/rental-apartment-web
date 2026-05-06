import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface SupportTicketFiltersProps {
  addFilters: AddFilter;
  setAddFilters: (filters: AddFilter) => void;
}

export interface AddFilter {
  status: string;
  priority: string;
  category: string;
}

export function SupportTicketFilters({
  addFilters,
  setAddFilters,
}: SupportTicketFiltersProps) {
  const { t } = useTranslation("support");

  const statusList = [
    { value: "open", label: t("support.statuses.open") },
    { value: "in_progress", label: t("support.statuses.in_progress") },
    { value: "resolved", label: t("support.statuses.resolved") },
    { value: "closed", label: t("support.statuses.closed") },
    { value: "escalated", label: t("support.statuses.escalated") },
  ];

  const priorityOptions = [
    { value: "low", label: t("support.priorities.low") },
    { value: "medium", label: t("support.priorities.medium") },
    { value: "high", label: t("support.priorities.high") },
    { value: "urgent", label: t("support.priorities.urgent") },
  ];

  const categoryOptions = [
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

  return (
    <div className="flex gap-3 items-center">
      <Select
        value={addFilters.status}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, status: value })
        }
      >
        <SelectTrigger className="w-45 bg-blue-100">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent className="bg-blue-200">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {statusList.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={addFilters.category}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, category: value })
        }
      >
        <SelectTrigger className="w-45 bg-blue-200">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>

        <SelectContent className="bg-blue-300">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {categoryOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={addFilters.priority}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, priority: value })
        }
      >
        <SelectTrigger className="w-45 bg-blue-300">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>

        <SelectContent className="bg-blue-400">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {priorityOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
