import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  type: string;
  setType: (type: string) => void;
  typeList: { label: string; value: string }[];
}

function NearbyFilter({ type, setType, typeList }: Props) {
  return (
    <div>
      <Select value={type} onValueChange={(value) => setType(value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {typeList.map((item) => (
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

export default NearbyFilter;
