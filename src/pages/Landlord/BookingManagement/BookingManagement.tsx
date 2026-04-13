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
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookingManagementApi.getBookings({
        page,
        pageSize: 5,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
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

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const handleCheckIn = async (
    bookingId: string,
    data: { actualCheckIn: Date; note: string },
  ) => {
    try {
      await bookingManagementApi.checkIn(bookingId, data);
      // Refresh bookings list after successful check-in
      fetchBookings();
    } catch (error) {
      console.error("Check-in failed:", error);
      throw error;
    }
  };
  const handleCheckOut = async (
    bookingId: string,
    data: { actualCheckOut: Date; note: string },
  ) => {
    try {
      await bookingManagementApi.checkOut(bookingId, data);
      // Refresh bookings list after successful check-out
      fetchBookings();
    } catch (error) {
      console.error("Check-out failed:", error);
      throw error;
    }
  };
  return (
    <div>
      <BookingManagementFilter
        filters={filters}
        onFilterChange={(values) => {
          setPage(1);
          setFilters(values);
        }}
        onReset={handleResetFilters}
      />
      <DataTable
        columns={BookingColumns(handleCheckIn, handleCheckOut)}
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
