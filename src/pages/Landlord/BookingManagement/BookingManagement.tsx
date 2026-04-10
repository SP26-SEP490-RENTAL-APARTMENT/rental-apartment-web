import DataTable from "@/components/ui/dataTable/DataTable";
import { bookingManagementApi } from "@/services/privateApi/landlordApi";
import type { BookingHistory } from "@/types/bookingHistory";
import { useCallback, useEffect, useState } from "react";
import { BookingColumns } from "./components/BookingColumns";
import BookingManagementFilter, {
  type BookingFilterValues,
} from "./components/BookingManagementFilter";

function BookingManagement() {
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<BookingFilterValues>({
    search: "",
    fromDate: undefined,
    toDate: undefined,
    sortOrder: "desc",
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookingManagementApi.getBookings({
        page,
        pageSize: 5,
        search: filters.search,
        sortBy: "createdAt",
        sortOrder: filters.sortOrder,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
      setBookings(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div>
      <BookingManagementFilter
        onFilterChange={(values) => {
          setPage(1); // reset về page 1 khi filter
          setFilters(values);
        }}
      />
      <DataTable
        columns={BookingColumns()}
        data={bookings}
        limit={5}
        loading={loading}
        total={totalCount}
        page={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default BookingManagement;
