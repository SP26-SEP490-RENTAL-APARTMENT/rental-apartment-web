import { useState } from "react";

export interface BookingFilterValues {
  search: string;
  fromDate?: Date;
  toDate?: Date;
  sortOrder: "asc" | "desc";
}
interface Props {
  onFilterChange: (values: BookingFilterValues) => void;
}

function BookingManagementFilter({ onFilterChange }: Props) {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleApply = () => {
    onFilterChange({
      search,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      sortOrder,
    });
  };

  const handleReset = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setSortOrder("desc");

    onFilterChange({
      search: "",
      fromDate: undefined,
      toDate: undefined,
      sortOrder: "desc",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search booking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        {/* From date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        {/* To date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border rounded-lg px-3 py-2 w-full"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="bg-black text-white px-4 py-2 rounded-lg w-full"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="border px-4 py-2 rounded-lg w-full"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingManagementFilter;