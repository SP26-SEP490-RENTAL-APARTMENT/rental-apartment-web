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
import {
  CalendarDays,
  Clock3,
  CreditCard,
  Moon,
  User,
  Users,
  Wallet,
} from "lucide-react";
import IncidentDialog from "./IncidentDialog";

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
  const [reportDialog, setReportDialog] = useState(false);

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
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {t("booking.status")}
                </span>
                <Badge className="capitalize px-3 py-1">
                  {useGetStatus(booking.status)}
                </Badge>
              </div>

              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest */}
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-blue-500" />
                    {t("booking.guestInfo")}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("booking.name")}
                    </p>
                    <p className="font-semibold">{booking.tenantFullName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {t("booking.guests")}
                    </p>
                    <div className="text-sm space-y-1 mt-1">
                      <p>
                        {booking.noOfAdults} {t("booking.adults")}
                      </p>
                      {booking.noOfChildren > 0 && (
                        <p>
                          {booking.noOfChildren} {t("booking.children")}
                        </p>
                      )}
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

                {/* Stay Info */}
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 text-green-500" />
                    {t("booking.stayInfo")}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("booking.checkIn")}
                      </p>
                      <p className="font-medium">
                        {formatDate(booking.checkInDate)}
                      </p>
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

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-muted-foreground">
                        {t("booking.nights")}
                      </span>
                    </div>
                    <span className="font-medium">
                      {booking.nights} {t("booking.nightsUnit")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">
                        {t("booking.paymentMode")}
                      </span>
                    </div>
                    <span className="font-medium">
                      {useGetPaymentMode(booking.paymentMode)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actual Stay */}
            {(booking.actualCheckIn || booking.actualCheckOut) && (
              <div className="rounded-xl border p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="w-4 h-4 text-purple-500" />
                  <p className="font-semibold text-foreground">
                    {t("booking.actualStay")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("booking.actualCheckIn")}
                    </p>
                    <p className="font-medium">
                      {booking.actualCheckIn
                        ? formatDateTime(booking.actualCheckIn)
                        : "--"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("booking.actualCheckOut")}
                    </p>
                    <p className="font-medium text-center">
                      {booking.actualCheckOut
                        ? formatDateTime(booking.actualCheckOut)
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="rounded-xl border p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <p className="font-semibold text-foreground">
                  {t("booking.paymentSection")}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {t("booking.packagePrice")}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(booking.packagePrice)}
                  </span>
                </div>

                {booking.paymentMode !== "full" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {t("booking.partialPayment")}
                    </span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(booking.depositAmount)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium">{t("booking.totalPrice")}</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {!booking.actualCheckIn && (
              <div className="flex justify-end">
                <Button onClick={() => setReportDialog(true)}>
                  Report Incident
                </Button>
              </div>
            )}

            {booking.actualCheckOut && (
              <div className="flex justify-end">
                <Button
                  onClick={handleReviewClick}
                  className="text-gray-500 cursor-pointer"
                  variant="link"
                >
                  {t("booking.rateService")}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ReviewDialog
        open={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        bookingId={booking.bookingId}
      />

      <IncidentDialog
        open={reportDialog}
        onClose={() => setReportDialog(false)}
        bookingId={booking.bookingId}
      />
    </>
  );
}

export default BookingViewDialog;
