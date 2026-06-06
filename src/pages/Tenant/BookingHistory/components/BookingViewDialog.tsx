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
  ChevronDown,
  Clock3,
  CreditCard,
  Moon,
  TriangleAlert,
  User,
  Users,
  Wallet,
} from "lucide-react";
import IncidentDialog from "./IncidentDialog";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OfflinePaymentDialog from "./OfflinePaymentDialog";

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
  const [offlinePaymentDialog, setOfflinePaymentDialog] = useState(false);

  const handleReviewClick = () => {
    setShowReviewDialog(true);
  };

  const handlePayBalance = async () => {
    try {
      const response = await bookingApi.payBalance(
        booking.bookingId,
        "payos",
        "web",
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error occurred while processing payment:", error);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-3xl max-h-[90dvh] overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-5">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold">
                {t("booking.details")}
              </DialogTitle>

              <Badge className="capitalize px-4 py-1.5 text-sm">
                {useGetStatus(booking.status)}
              </Badge>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-90px)] p-6 space-y-6">
            {/* Guest + Stay */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-blue-500" />
                    {t("booking.guestInfo")}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("booking.name")}
                    </p>
                    <p className="font-semibold text-base">
                      {booking.tenantFullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4" />
                      {t("booking.guests")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3 py-1.5">
                        <span className="font-semibold">
                          {booking.noOfAdults}
                        </span>
                        <span className="ml-1.5">{t("booking.adults")}</span>
                      </Badge>

                      {booking.noOfChildren > 0 && (
                        <Badge className="bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 px-3 py-1.5">
                          <span className="font-semibold">
                            {booking.noOfChildren}
                          </span>
                          <span className="ml-1.5">
                            {t("booking.children")}
                          </span>
                        </Badge>
                      )}

                      {booking.noOfInfants > 0 && (
                        <Badge className="bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 px-3 py-1.5">
                          <span className="font-semibold">
                            {booking.noOfInfants}
                          </span>
                          <span className="ml-1.5">{t("booking.infants")}</span>
                        </Badge>
                      )}

                      {booking.noOfPets > 0 && (
                        <Badge className="bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-3 py-1.5">
                          <span className="font-semibold">
                            {booking.noOfPets}
                          </span>
                          <span className="ml-1.5">{t("booking.pets")}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarDays className="h-4 w-4 text-green-500" />
                    {t("booking.stayInfo")}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
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

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span>{t("booking.nights")}</span>
                    </div>

                    <span className="font-semibold">
                      {booking.nights} {t("booking.nightsUnit")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4 text-orange-500" />
                      <span>{t("booking.paymentMode")}</span>
                    </div>

                    <span className="font-medium">
                      {useGetPaymentMode(booking.paymentMode)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actual Stay */}
            {(booking.actualCheckIn || booking.actualCheckOut) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock3 className="h-4 w-4 text-purple-500" />
                    {t("booking.actualStay")}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        {t("booking.actualCheckIn")}
                      </p>

                      <p className="font-medium">
                        {booking.actualCheckIn
                          ? formatDateTime(booking.actualCheckIn)
                          : "--"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        {t("booking.actualCheckOut")}
                      </p>

                      <p className="font-medium">
                        {booking.actualCheckOut
                          ? formatDateTime(booking.actualCheckOut)
                          : "--"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="h-4 w-4 text-emerald-500" />
                  {t("booking.paymentSection")}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("booking.packagePrice")}
                    </span>

                    <span className="font-medium">
                      {formatCurrency(booking.packagePrice)}
                    </span>
                  </div>

                  {booking.paymentMode !== "full" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.partialPayment")}
                      </span>

                      <span className="font-medium text-orange-600">
                        {formatCurrency(booking.depositAmount)}
                      </span>
                    </div>
                  )}

                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {t("booking.totalPrice")}
                      </span>

                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {!booking.actualCheckIn &&
              (booking.status === "paid" || booking.status === "confirmed") && (
                <div className="flex flex-wrap justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setReportDialog(true)}
                  >
                    <TriangleAlert size={16} />
                    {t("incident.title")}
                  </Button>

                  {booking.status === "confirmed" &&
                    booking.paymentMode === "partial" && (
                      <div className="flex">
                        <Button
                          className="rounded-r-none"
                          onClick={handlePayBalance}
                        >
                          Pay Balance
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="default"
                              size="icon"
                              className="rounded-l-none border-l"
                            >
                              <ChevronDown size={16} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setOfflinePaymentDialog(true)}
                            >
                              Pay offline
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                </div>
              )}

            {booking.actualCheckOut && (
              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleReviewClick}>
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

      <OfflinePaymentDialog
        onClose={() => setOfflinePaymentDialog(false)}
        open={offlinePaymentDialog}
        bookingId={booking.bookingId}
      />
    </>
  );
}

export default BookingViewDialog;
