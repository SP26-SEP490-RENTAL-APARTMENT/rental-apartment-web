import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BookingHistory } from "@/types/bookingHistory";
import { ReviewDialog } from "./ReviewDialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface Props {
  open: boolean;
  onClose: () => void;
  booking: BookingHistory;
}
const formatDate = (date?: string | null) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("vi-VN");
};

const formatCurrency = (value?: number) => {
  if (!value) return "0₫";
  return value.toLocaleString("vi-VN") + "₫";
};
const formatDateTime = (date?: string | null) => {
  if (!date) return "--";
  return new Date(date).toLocaleString("vi-VN");
};

function BookingViewDialog({ open, onClose, booking }: Props) {
  const { t } = useTranslation("booking");
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleReviewClick = () => {
    setShowReviewDialog(true);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {t("details")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-80px)] pr-2">
            {/* Status + ID */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t("id")} {booking.bookingId}
              </p>
              <Badge variant="default" className="capitalize">
                {booking.status}
              </Badge>
            </div>

            {/* Tenant */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{booking.tenantFullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-medium">
                  {booking.noOfAdults}
                  {t("guestSeparator")}
                  {booking.noOfInfants}
                  {t("infantSeparator")}
                  {booking.noOfPets}
                  {t("petSuffix")}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">{formatDate(booking.checkInDate)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-medium">
                  {formatDate(booking.checkOutDate)}
                </p>
              </div>
            </div>

            {/* Actual Stay */}
            {(booking.actualCheckIn || booking.actualCheckOut) && (
              <div className="border rounded-lg p-4 space-y-3">
                <p className="font-semibold">Actual Stay</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Actual Check-in
                    </p>
                    <p className="font-medium">
                      {formatDateTime(booking.actualCheckIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Actual Check-out
                    </p>
                    <p className="font-medium">
                      {formatDateTime(booking.actualCheckOut)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stay info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("nights")}</p>
                <p className="font-medium">{booking.nights}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t("paymentMode")}
                </p>
                <p className="font-medium capitalize">{booking.paymentMode}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="border rounded-lg p-4 space-y-3">
              <p className="font-semibold">{t("paymentSection")}</p>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package Price</span>
                <span>{formatCurrency(booking.packagePrice)}</span>
              </div>

              {booking.paymentMode !== "full" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("deposit")}</span>
                  <span>{formatCurrency(booking.depositAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("total")}</span>
                <span className="font-semibold">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                {t("created")} {formatDate(booking.createdAt)}
              </p>
              <p>
                {t("balanceDue")} {formatDate(booking.balanceDueDate)}
              </p>
            </div>

            {/* {booking.actualCheckOut && ()} */}
            <div className="flex justify-end">
              <Button
                onClick={handleReviewClick}
                className="text-gray-500 cursor-pointer"
                variant="link"
              >
                Đánh giá dịch vụ của chúng tôi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ReviewDialog
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        bookingId={booking.bookingId}
      />
    </>
  );
}

export default BookingViewDialog;
