import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface addFilters {
  status: string;
  priority: string;
  category: string;
}

interface Props {
  addFilters: addFilters;
  setAddFilters: (filters: addFilters) => void;
  statusList: { label: string; value: string }[];
  priorityList: { label: string; value: string }[];
  categoryList: { label: string; value: string }[];
}
function SupportFilter({
  addFilters,
  setAddFilters,
  statusList,
  priorityList,
  categoryList,
}: Props) {
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

        <SelectContent className="bg-blue-100">
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
        value={addFilters.priority}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, priority: value })
        }
      >
        <SelectTrigger className="w-45 bg-blue-100">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>

        <SelectContent className="bg-blue-100">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {priorityList.map((item) => (
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
        <SelectTrigger className="w-45 bg-blue-100">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>

        <SelectContent className="bg-blue-100">
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {categoryList.map((item) => (
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

export default SupportFilter;
