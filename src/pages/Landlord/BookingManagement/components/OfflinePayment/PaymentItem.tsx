import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { bookingManagementApi } from "@/services/privateApi/landlordApi";
import type { OfflinePayment } from "@/types/offlinePayment";
import { formatCurrency, formatDateTime } from "@/utils/utils";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: OfflinePayment;
  bookingId: string;
  refetch?: () => void;
  onClose?: () => void;
}
function PaymentItem({ data, bookingId, refetch, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const getStatusVariant = () => {
    switch (data.status.toLowerCase()) {
      case "approved":
      case "confirmed":
        return "default";

      case "rejected":
        return "destructive";

      default:
        return "secondary";
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await bookingManagementApi.confirmOfflinePayment(bookingId, {
        paymentId: data.paymentId,
        approve: true,
        notes: "Confirmed by landlord",
      });
      toast.success("Payment confirmed successfully.");
      refetch?.();
      onClose?.();
    } catch (error) {
      toast.error("Failed to confirm payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    setLoading(true);
    try {
      await bookingManagementApi.confirmOfflinePayment(bookingId, {
        paymentId: data.paymentId,
        approve: false,
        notes: "Rejected by landlord",
      });
      toast.success("Payment rejected successfully.");
      refetch?.();
      onClose?.();
    } catch (error) {
      toast.error("Failed to reject payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all py-0">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Proof */}
          <a
            href={data.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src={data.proofUrl}
              alt="Payment proof"
              className="h-24 w-24 rounded-xl object-cover border hover:opacity-90"
            />
          </a>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Offline Payment</p>

                <p className="text-2xl font-bold">
                  {formatCurrency(data.amount)}
                </p>
              </div>

              <Badge variant={getStatusVariant()}>{data.status}</Badge>
            </div>

            {/* Notes */}
            {data.notes && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {data.notes}
              </p>
            )}

            {/* Footer */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Paid:</span>{" "}
                {data.paidAt ? formatDateTime(data.paidAt) : "--"}
              </div>

              <div>
                <span className="text-muted-foreground">Confirmed:</span>{" "}
                {data.confirmedAt ? formatDateTime(data.confirmedAt) : "--"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleConfirmPayment} disabled={loading}>
            Confirm Payment
          </Button>
          <Button
            onClick={handleRejectPayment}
            variant="destructive"
            disabled={loading}
          >
            Reject Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentItem;
