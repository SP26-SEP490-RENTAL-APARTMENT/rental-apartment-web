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
              Booking Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-80px)] pr-2">
            {/* Status + ID */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                ID: {booking.bookingId}
              </p>
              <Badge variant="default" className="capitalize">
                {booking.status}
              </Badge>
            </div>

            {/* Tenant */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tenant</p>
                <p className="font-medium">{booking.tenantFullName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-medium">
                  {booking.noOfAdults} adults • {booking.noOfInfants} infants •{" "}
                  {booking.noOfPets} pets
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
                <p className="text-sm text-muted-foreground">Nights</p>
                <p className="font-medium">{booking.nights}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment Mode</p>
                <p className="font-medium capitalize">{booking.paymentMode}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="border rounded-lg p-4 space-y-3">
              <p className="font-semibold">Payment</p>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package Price</span>
                <span>{formatCurrency(booking.packagePrice)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Deposit</span>
                <span>{formatCurrency(booking.depositAmount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Created: {formatDate(booking.createdAt)}</p>
              <p>Balance Due: {formatDate(booking.balanceDueDate)}</p>
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
