import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankList } from "@/constants/bankList";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  refetch: () => void;
}

function CancelBookingDialog({ open, onClose, bookingId, refetch }: Props) {
  const [form, setForm] = useState({
    payOsAccountNumber: "",
    payOsBankCode: "",
  });

  const handleSelectBank = (bin: string) => {
    setForm({
      ...form,
      payOsBankCode: form.payOsBankCode === bin ? "" : bin,
    });
  };

  const handleSubmitCancellation = async () => {
    try {
      await bookingApi.cancelWithRefund(bookingId, {
        reason: "tenant_request",
        notes: "Cancel booking",
        payOsBankCode: form.payOsBankCode,
        payOsAccountNumber: form.payOsAccountNumber,
      });
      toast.success("Cancellation submitted successfully");
      onClose();
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit cancellation");
      console.error("Error occurred while submitting cancellation:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cancel Booking Form</DialogTitle>
          <DialogDescription>
            Fill in your bank details to receive the refund.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="mb-4 block">Select Bank</Label>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {bankList.map((bank) => (
                <button
                  key={bank.bin}
                  type="button"
                  onClick={() => handleSelectBank(bank.bin)}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all cursor-pointer ${
                    form.payOsBankCode === bank.bin
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  title={bank.name}
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="w-10 h-10 object-contain mb-2"
                  />
                  <span className="text-xs text-center line-clamp-2">
                    {bank.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Your Account Number</Label>
            <Input
              placeholder="0849017399"
              type="number"
              value={form.payOsAccountNumber}
              onChange={(e) =>
                setForm({ ...form, payOsAccountNumber: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmitCancellation}>
              Submit Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CancelBookingDialog;
