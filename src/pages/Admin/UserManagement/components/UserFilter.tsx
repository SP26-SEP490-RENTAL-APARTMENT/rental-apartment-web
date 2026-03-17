import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { User } from "@/types/user";

interface UserFilterProps {
  search: string;
  sortBy: keyof User;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortByChange: (value: keyof User) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

const SORT_OPTIONS: { key: keyof User; label: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "createdAt", label: "Created Date" },
  { key: "identityVerified", label: "Verified" },
];

function UserFilter({
  search,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
}: UserFilterProps) {
  const { t: userTranslation } = useTranslation("user");
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

  return (
    <div className="flex gap-3 items-center">
      <Input
        type="text"
        placeholder={userTranslation("search") || "Search users..."}
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
    </div>
  );
}

export default UserFilter;
