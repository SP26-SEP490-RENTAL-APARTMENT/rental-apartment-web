import { bookingApi } from "@/services/privateApi/tenantApi";
import type { BookingHistory } from "@/types/bookingHistory";
import { useCallback, useEffect, useState } from "react";
import BookingHistoryCard from "./components/BookingHistoryCard";
import BookingHistorySkeleton from "./components/BookingHistorySkeleton";
import PaginationComponent from "@/components/ui/paginationComponent/PaginationComponent";
import BookingViewDialog from "./components/BookingViewDialog";

function BookingHistories() {
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
        pageSize: 3,
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

  const totalPage = Math.ceil(totalCount / 3);
  return (
    <div className="p-10">
      {bookingHistory.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4 mb-10">
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

          <div>
            <PaginationComponent
              page={page}
              totalPages={totalPage}
              onPageChange={setPage}
            />
          </div>
        </div>
      ) : (
        <div className="text-gray-500 flex justify-center items-center">
          No Booking History Found
        </div>
      )}

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
