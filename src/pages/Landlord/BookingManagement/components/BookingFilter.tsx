import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface Props {
  setStatus: (status: string) => void;
  status: string;
  statusList: { label: string; value: string }[];
}
function BookingFilter({ setStatus, status, statusList }: Props) {
  const { t } = useTranslation("status");
  return (
    <div>
      <Select value={status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-45 bg-blue-100">
          <SelectValue placeholder={t("selectStatus")} />
        </SelectTrigger>

        <SelectContent className="bg-blue-100">
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

export default BookingFilter;
