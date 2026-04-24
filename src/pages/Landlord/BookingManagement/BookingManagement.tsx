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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

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
        pageSize: 8,
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
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage guest bookings and check-ins
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <BookingManagementFilter
              filters={filters}
              onFilterChange={(values) => {
                setPage(1);
                setFilters(values);
              }}
              onReset={handleResetFilters}
            />
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Bookings ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={BookingColumns(
                handleCheckIn,
                handleCheckOut,
                fetchOccupantList,
                triggerAddOccupant,
              )}
              data={bookings}
              limit={8}
              loading={loading}
              total={totalCount}
              page={page}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
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
