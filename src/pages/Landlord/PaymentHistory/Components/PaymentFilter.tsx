import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface addFilters {
  method: string;
  status: string;
  paymentPurpose: string;
}

interface Props {
  addFilters: addFilters;
  setAddFilters: (filters: addFilters) => void;
  statusList: { label: string; value: string }[];
  methodList: { label: string; value: string }[];
    paymentPurposeList: { label: string; value: string }[];
}

function PaymentFilter({
  addFilters,
  setAddFilters,
  statusList,
  methodList,
  paymentPurposeList,
}: Props) {
  return (
    <div className="flex gap-3 items-center">
      <Select
        value={addFilters.status}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, status: value })
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select status" />
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

      <Select
        value={addFilters.method}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, method: value })
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select method" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {methodList.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={addFilters.paymentPurpose}
        onValueChange={(value) =>
          setAddFilters({ ...addFilters, paymentPurpose: value })
        }
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Select payment type" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {paymentPurposeList.map((item) => (
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

export default PaymentFilter;
