import { ArrowDownUp, Search } from "lucide-react";
import { Button } from "../button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export interface Filter {
  search: string;
  sortOrder: "asc" | "desc";
  sortBy: string;
}

interface SortOption {
  label: string;
  value: string;
}

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  sortByList: SortOption[];
}

function ManagementFilter({ filter, setFilter, sortByList }: Props) {
  return (
    <div className="flex gap-3">
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Search anything..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <Button
        onClick={() =>
          setFilter({
            ...filter,
            sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
          })
        }
      >
        {filter.sortOrder === "asc" ? (
          <p className="flex items-center gap-2">
            Asc <ArrowDownUp size={16} />
          </p>
        ) : (
          <p className="flex items-center gap-2">
            Desc <ArrowDownUp size={16} />
          </p>
        )}
      </Button>

      <Select
        value={filter.sortBy}
        onValueChange={(value) => setFilter({ ...filter, sortBy: value })}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {sortByList.map((item) => (
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

export default ManagementFilter;
