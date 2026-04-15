import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookingHistory } from "@/types/bookingHistory";

export interface Props {
  data: BookingHistory;
  onClick?: (booking: BookingHistory) => void;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const formatCurrency = (value: number) => value.toLocaleString("vi-VN") + " ₫";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentModeLabel = (mode: "full" | "partial") => {
  return mode === "full" ? "Full Payment" : "Partial Payment";
};

const getPaymentModeColor = (mode: "full" | "partial") => {
  return mode === "full"
    ? "bg-green-100 text-green-700"
    : "bg-blue-100 text-blue-700";
};

export default function BookingHistoryCard({ data, onClick }: Props) {
  return (
    <Card className="w-full hover:shadow-md transition cursor-pointer" onClick={() => onClick?.(data)}>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">
                Booking #{data.bookingId.slice(0, 8)}
              </p>

              <Badge className={getStatusColor(data.status)}>
                {data.status}
              </Badge>

              <Badge className={getPaymentModeColor(data.paymentMode)}>
                {getPaymentModeLabel(data.paymentMode)}
              </Badge>
            </div>

            {/* 👇 createdAt */}
            <p className="text-xs text-gray-500">
              Booked on {formatDate(data.createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
            <div>
              <p>Check-in</p>
              <p className="font-medium text-gray-900">
                {formatDate(data.checkInDate)}
              </p>
            </div>

            <div>
              <p>Check-out</p>
              <p className="font-medium text-gray-900">
                {formatDate(data.checkOutDate)}
              </p>
            </div>

            <div>
              <p>Nights</p>
              <p className="font-medium text-gray-900">{data.nights} nights</p>
            </div>

            <div>
              <p>Guests</p>
              <p className="font-medium text-gray-900">
                {data.noOfAdults} adults
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-start md:items-end gap-1 min-w-45">
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-lg font-semibold text-primary">
            {formatCurrency(data.totalPrice)}
          </p>

          {data.paymentMode === "partial" && (
            <p className="text-xs text-gray-500">
              Deposit: {formatCurrency(data.depositAmount)}
            </p>
          )}

          <p
            className={`text-xs font-medium ${
              data.depositPaid ? "text-green-600" : "text-red-500"
            }`}
          >
            {data.depositPaid ? "Paid" : "Unpaid"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
