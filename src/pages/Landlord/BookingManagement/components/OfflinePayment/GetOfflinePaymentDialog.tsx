import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OfflinePayment } from "@/types/offlinePayment";
import PaymentItem from "./PaymentItem";

interface Props {
  open: boolean;
  onClose: () => void;
  offlinePayments: OfflinePayment[] | [];
  bookingId: string;
  refetch?: () => void;
}

function GetOfflinePaymentDialog({
  open,
  onClose,
  offlinePayments,
  bookingId,
  refetch,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Offline Payment Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {offlinePayments.map((payment) => (
            <PaymentItem
              key={payment.paymentId}
              data={payment}
              bookingId={bookingId}
              onClose={onClose}
              refetch={refetch}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GetOfflinePaymentDialog;
