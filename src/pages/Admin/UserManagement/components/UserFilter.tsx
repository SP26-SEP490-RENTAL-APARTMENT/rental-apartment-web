import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  role: string;
  setRole: (role: string) => void;
  roleList: { label: string; value: string }[];
}
function UserFilter({ role, setRole, roleList }: Props) {
  return (
    <div>
      <Select value={role} onValueChange={(value) => setRole(value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Roles</SelectItem>
            {roleList.map((item) => (
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

export default UserFilter;
