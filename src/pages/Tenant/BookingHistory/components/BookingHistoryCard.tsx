import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookingHistory } from "@/types/bookingHistory";
import { useTranslation } from "react-i18next";
import { ChevronRight, CheckCircle2, Clock, Home } from "lucide-react";
import { useGetStatus } from "@/lib/utils";

export interface Props {
  data: BookingHistory;
  onClick?: (booking: BookingHistory) => void;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const formatCurrency = (value: number) => value.toLocaleString("vi-VN") + " ₫";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-700 border-0";
    case "confirmed":
      return "bg-emerald-100 text-emerald-700 border-0";
    case "cancelled":
      return "bg-red-100 text-red-700 border-0";
    default:
      return "bg-gray-100 text-gray-700 border-0";
  }
};

const getPaymentModeColor = (mode: "full" | "partial") => {
  return mode === "full"
    ? "bg-green-100 text-green-700 border-0"
    : "bg-blue-100 text-blue-700 border-0";
};

export default function BookingHistoryCard({ data, onClick }: Props) {
  const { t } = useTranslation("user");

  const getPaymentModeLabel = (mode: "full" | "partial") => {
    return mode === "full" ? t("booking.fullPayment") : t("booking.partialPayment");
  };

  return (
    <Card
      className="w-full hover:shadow-lg border-0 transition-all duration-300 cursor-pointer group bg-white overflow-hidden"
      onClick={() => onClick?.(data)}
    >
      <CardContent className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Home className="h-4 w-4 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">
                {t("booking.booking")} #{data.bookingId.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {t("booking.bookedOn")} {formatDate(data.createdAt)}
            </p>
          </div>

          {/* Badges & Amount */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2 flex-wrap justify-end">
              <Badge className={getStatusColor(data.status)}>
                {useGetStatus(data.status)}
              </Badge>
              <Badge className={getPaymentModeColor(data.paymentMode)}>
                {getPaymentModeLabel(data.paymentMode)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">{t("booking.totalPrice")}</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-4" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Check-in */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{t("booking.checkIn")}</p>
            <p className="font-semibold text-gray-900">
              {formatDate(data.checkInDate)}
            </p>
          </div>

          {/* Check-out */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{t("booking.checkOut")}</p>
            <p className="font-semibold text-gray-900">
              {formatDate(data.checkOutDate)}
            </p>
          </div>

          {/* Nights */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{t("booking.nights")}</p>
            <p className="font-semibold text-gray-900">
              {data.nights} {t("booking.nightsUnit")}
            </p>
          </div>

          {/* Guests */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{t("booking.guests")}</p>
            <p className="font-semibold text-gray-900">
              {data.noOfAdults} {t("booking.guestsUnit")}
            </p>
          </div>
        </div>

        {/* Footer Row - Payment Status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {data.depositPaid ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {t("booking.paid")}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-600">
                  {t("booking.pending")}
                </span>
              </>
            )}
            {data.paymentMode === "partial" && (
              <span className="text-xs text-gray-500 ml-2">
                ({t("depositLabel")} {formatCurrency(data.depositAmount)})
              </span>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

