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
import { useGetPaymentMode, useGetStatus } from "@/lib/utils";

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
  const { t } = useTranslation("user");
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
              {t("booking.details")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-80px)] pr-2">
            {/* Status + ID */}
            <div className="flex items-center justify-between">
              <Badge variant="default" className="capitalize">
                {useGetStatus(booking.status)}
              </Badge>
            </div>

            {/* Tenant */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.name")}
                </p>
                <p className="font-medium">{booking.tenantFullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.guests")}
                </p>
                <div className="flex flex-col">
                  <p>
                    {booking.noOfAdults} {t("booking.adults")}
                  </p>
                  {booking.noOfInfants > 0 && (
                    <p>
                      {booking.noOfInfants} {t("booking.infants")}
                    </p>
                  )}
                  {booking.noOfPets > 0 && (
                    <p>
                      {booking.noOfPets} {t("booking.pets")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.checkIn")}
                </p>
                <p className="font-medium">{formatDate(booking.checkInDate)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.checkOut")}
                </p>
                <p className="font-medium">
                  {formatDate(booking.checkOutDate)}
                </p>
              </div>
            </div>

            {/* Stay info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.nights")}
                </p>
                <p className="font-medium">
                  {booking.nights} {t("booking.nightsUnit")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {t("booking.paymentMode")}
                </p>
                <p className="font-medium">
                  {useGetPaymentMode(booking.paymentMode)}
                </p>
              </div>
            </div>

            {/* Actual Stay */}
            {(booking.actualCheckIn || booking.actualCheckOut) && (
              <div className="border rounded-lg p-4 space-y-3">
                <p className="font-semibold">{t('booking.actualStay')}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('booking.actualCheckIn')}
                    </p>
                    <p className="font-medium">
                      {formatDateTime(booking.actualCheckIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('booking.actualCheckOut')}
                    </p>
                    <p className="font-medium">
                      {formatDateTime(booking.actualCheckOut)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="border rounded-lg p-4 space-y-3">
              <p className="font-semibold">{t("booking.paymentSection")}</p>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("booking.packagePrice")}
                </span>
                <span>{formatCurrency(booking.packagePrice)}</span>
              </div>

              {booking.paymentMode !== "full" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("booking.partialPayment")}
                  </span>
                  <span>{formatCurrency(booking.depositAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("booking.totalPrice")}
                </span>
                <span className="font-semibold">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            </div>

            {/* {booking.actualCheckOut && ()} */}
            <div className="flex justify-end">
              <Button
                onClick={handleReviewClick}
                className="text-gray-500 cursor-pointer"
                variant="link"
              >
                {t("booking.rateService")}
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
