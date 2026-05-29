import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { feeManagementApi } from "@/services/privateApi/landlordApi";
import type { OutstandingFee } from "@/types/outstandingFee";
import { AlertCircle, Calendar, Clock, MapPin, User } from "lucide-react";
import { toast } from "sonner";

interface Props {
  fee: OutstandingFee;
  refetch: () => void;
}

export default function OutstandingFeeCard({ fee, refetch }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

  const getStatus = () => {
    if (fee.isOverdue) return <Badge variant="destructive">Overdue</Badge>;

    switch (fee.feeSettlementStatus) {
      case "due":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Due
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "disputed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Disputed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const paymentDate = new Date(Date.now() - 5000).toISOString();

      await feeManagementApi.confirmFeePayment(fee.bookingId, {
        paymentDate,
        notes: "Confirmed by landlord",
      });

      refetch();
      toast.success("Payment confirmed successfully!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to confirm payment",
      );
      console.error("Error confirming payment:", error);
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition py-0">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Booking: {fee.bookingId.slice(0, 8)}...
            </p>
          </div>
          {getStatus()}
        </div>

        {/* Tenant */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{fee.tenantName}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <span>{fee.apartmentAddress}</span>
        </div>

        {/* Checkin/out */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Check-in</p>
              <p>{formatDate(fee.scheduledCheckIn)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p>{formatDate(fee.scheduledCheckOut)}</p>
            </div>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="border rounded-xl p-3 bg-muted/30 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Early check-in</span>
            <span>{formatCurrency(fee.earlyCheckInFee)}</span>
          </div>

          <div className="flex justify-between">
            <span>Late check-out</span>
            <span>{formatCurrency(fee.lateCheckOutFee)}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(fee.totalFee)}</span>
          </div>
        </div>

        {/* Due */}
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <Clock className="w-4 h-4" />
          Due: {formatDate(fee.feeDueAt)}
        </div>

        {/* dispute */}
        {fee.tenantDisputeReason && (
          <div className="flex gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{fee.tenantDisputeReason}</span>
          </div>
        )}

        {/* action */}

        <Button className="w-full rounded-xl" onClick={handleConfirmPayment}>
          Confirm
        </Button>
      </CardContent>
    </Card>
  );
}
