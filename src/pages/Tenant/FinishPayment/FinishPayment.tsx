import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store/bookingStore";

function FinishPayment() {
  const navigate = useNavigate();
  const bookingData = useBookingStore((state) => state.bookingData);
  const clearBookingData = useBookingStore((state) => state.clearBookingData);

  const handleNavigate = (path: string) => {
    clearBookingData();
    navigate(path);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy thông tin thanh toán
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  const totalGuests =
    bookingData.noOfAdults + bookingData.noOfInfants + bookingData.noOfPets;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-xl shadow-sm">
        <CardContent className="p-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Thanh toán thành công
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Đặt phòng của bạn đã được xác nhận
            </p>
          </div>

          {/* Main Info */}
          <div className="space-y-4 text-sm">
            {/* Date */}
            <div className="flex justify-between">
              <span className="text-gray-500">Thời gian</span>
              <span className="font-medium text-right">
                {formatDate(bookingData.checkInDate)} –{" "}
                {formatDate(bookingData.checkOutDate)}
              </span>
            </div>

            {/* Nights */}
            <div className="flex justify-between">
              <span className="text-gray-500">Số đêm</span>
              <span className="font-medium">{bookingData.nights} đêm</span>
            </div>

            {/* Guests */}
            <div className="flex justify-between">
              <span className="text-gray-500">Khách</span>
              <span className="font-medium">{totalGuests} người</span>
            </div>

            {/* Payment */}
            <div className="flex justify-between">
              <span className="text-gray-500">Thanh toán</span>
              <span className="font-medium">
                {bookingData.paymentMode === "partial" ? "Đặt cọc" : "Toàn bộ"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t my-6" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => handleNavigate("/tenant/booking-history")}
            >
              Xem đơn đặt phòng
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleNavigate("/")}
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinishPayment;
