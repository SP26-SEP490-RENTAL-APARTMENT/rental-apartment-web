import { bookingApi } from "@/services/privateApi/tenantApi";
import type { BookingHistory } from "@/types/bookingHistory";
import { useCallback, useEffect, useState } from "react";
import BookingHistoryCard from "./components/BookingHistoryCard";
import BookingHistorySkeleton from "./components/BookingHistorySkeleton";
import PaginationComponent from "@/components/ui/paginationComponent/PaginationComponent";
import BookingViewDialog from "./components/BookingViewDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

function BookingHistories() {
  const { t } = useTranslation("user");
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [bookingDetail, setBookingDetail] = useState<BookingHistory | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBookingHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookingApi.getBookingHistory({
        page,
        pageSize: 6,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
      });
      setBookingHistory(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookingHistory();
  }, [fetchBookingHistory]);

  const handleCardClick = (booking: BookingHistory) => {
    setBookingDetail(booking);
    setIsDialogOpen(true);
  };

  const totalPage = Math.ceil(totalCount / 6);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("booking.label")}
            </h1>
          </div>
          <p className="text-gray-600">{t("booking.description")}</p>
        </div>

        {bookingHistory.length > 0 ? (
          <>
            {/* Bookings Grid */}
            <div className="space-y-4 mb-10">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <BookingHistorySkeleton key={i} />
                  ))
                : bookingHistory &&
                  bookingHistory.map((item) => (
                    <BookingHistoryCard
                      key={item.bookingId}
                      data={item}
                      onClick={handleCardClick}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex justify-center">
                <PaginationComponent
                  page={page}
                  totalPages={totalPage}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No bookings yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Start exploring apartments to
                find your perfect stay!
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Browse Apartments
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      {bookingDetail && (
        <BookingViewDialog
          booking={bookingDetail}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default BookingHistories;
