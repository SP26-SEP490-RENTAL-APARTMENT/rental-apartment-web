import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ApproveListingFilter({
  status,
  setStatus,
  statusList,
}: {
  status: string;
  setStatus: (status: string) => void;
  statusList: { label: string; value: string }[];
}) {
  return (
    <div>
      <Select value={status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select inspection status" />
        </SelectTrigger>

        <SelectContent>
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
    </div>
  );
}

export default ApproveListingFilter;
