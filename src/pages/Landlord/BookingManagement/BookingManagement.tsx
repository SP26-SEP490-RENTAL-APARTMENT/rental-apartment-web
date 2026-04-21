import DataTable from "@/components/ui/dataTable/DataTable";
import { bookingManagementApi } from "@/services/privateApi/landlordApi";
import type { BookingHistory } from "@/types/bookingHistory";
import { useCallback, useEffect, useState } from "react";
import { BookingColumns } from "./components/BookingColumns";
import BookingManagementFilter, {
  type BookingFilterValues,
} from "./components/BookingManagementFilter";
import type { Occupant } from "@/types/occupant";
import ViewOccupantDialog from "./components/ViewOccupantDialog";
import AddOccupantDialog from "./components/AddOccupantDialog";
import type { OccupantFormData } from "@/schemas/occupantSchema";
import { toast } from "sonner";

function BookingManagement() {
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [occupantList, setOccupantList] = useState<Occupant[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<BookingFilterValues>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [open, setOpen] = useState({ viewOccupant: false, addOccupant: false });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

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

  const fetchOccupantList = async (bookingId: string) => {
    try {
      const response = await bookingManagementApi.getOccupantList(bookingId);
      setOpen({ ...open, viewOccupant: true });
      setOccupantList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch occupant list:", error);
    }
  };

  const handleAddOccupant = async (data: OccupantFormData) => {
    try {
      const formData = new FormData();
      formData.append("FullName", data.fullName);
      formData.append("PassportId", data.passportId);
      formData.append("NationalIdCardNumber", data.nationalIdCardNumber);
      formData.append("DateOfBirth", data.dateOfBirth);
      formData.append("Email", data.email);
      formData.append("Phone", data.phone);
      formData.append("Nationality", data.nationality);
      formData.append("ProofPhoto", data.proofPhoto);
      formData.append("Sex", data.sex);
      await bookingManagementApi.addOccupant(selectedBookingId!, formData);
      setOpen({ ...open, addOccupant: false });
      toast.success("Occupant added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add occupant");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerAddOccupant = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setOpen({ ...open, addOccupant: true });
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
        columns={BookingColumns(
          handleCheckIn,
          handleCheckOut,
          fetchOccupantList,
          triggerAddOccupant,
        )}
        data={bookings}
        limit={5}
        loading={loading}
        total={totalCount}
        page={page}
        onPageChange={handlePageChange}
      />

      <ViewOccupantDialog
        occupantList={occupantList}
        onClose={() => setOpen({ ...open, viewOccupant: false })}
        open={open.viewOccupant}
      />

      <AddOccupantDialog
        onClose={() => setOpen({ ...open, addOccupant: false })}
        open={open.addOccupant}
        onSubmit={handleAddOccupant}
      />
    </div>
  );
}

export default BookingManagement;
