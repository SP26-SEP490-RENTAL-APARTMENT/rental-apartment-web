import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

function ApartmentFilter({
  status,
  setStatus,
  statusList,
}: {
  status: string;
  setStatus: (status: string) => void;
  statusList: { label: string; value: string }[];
}) {
  const { t } = useTranslation("status");
  return (
    <div>
      <Select value={status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t("all")}</SelectItem>
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

export default ApartmentFilter;
