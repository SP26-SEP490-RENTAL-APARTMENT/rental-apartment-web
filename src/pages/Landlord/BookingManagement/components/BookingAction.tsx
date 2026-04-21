import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BookingHistory } from "@/types/bookingHistory";
import {
  CheckCheck,
  Eye,
  FileDown,
  LogOut,
  Plus,
  ScanEye,
  Send,
  UserRoundPlus,
} from "lucide-react";
import CheckOutDialog from "./CheckOutDialog";
import CheckInDialog from "./CheckinDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { bookingManagementApi } from "@/services/privateApi/landlordApi";
import { toast } from "sonner";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateReportNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export interface Props {
  bookings: BookingHistory;
  onCheckIn: (
    bookingId: string,
    data: { actualCheckIn: Date; note: string },
  ) => Promise<void>;
  onCheckOut: (
    bookingId: string,
    data: { actualCheckOut: Date; note: string },
  ) => Promise<void>;
  onGetOccupantList: (bookingId: string) => Promise<void>;
  onAddOccupant: (bookingId: string) => void;
}
function BookingAction({ bookings, onCheckIn, onCheckOut, onGetOccupantList, onAddOccupant }: Props) {
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);

  const handleSubmitResidenceReport = async () => {
    try {
      await bookingManagementApi.submitResidenceReport(bookings.bookingId, {
        reportedToPolice: true,
        reportDate: formatDate(new Date()),
        reportNumber: generateReportNumber().toString(),
        actualCheckIn: bookings.actualCheckIn || new Date(),
      });
      toast.success("Residence report submitted successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to submit residence report",
      );
    }
  };

  const handleGetPDF = async (id: string) => {
    try {
      const response = await bookingManagementApi.getPDFFile(id);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `residence-report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF file downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF file");
    }
  };

  const handleGetDOC = async (id: string) => {
    try {
      const response = await bookingManagementApi.getDOCFile(id);
      const blob = new Blob([response.data], { type: "application/msword" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `residence-report-${id}.doc`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("DOC file downloaded successfully");
    } catch (error) {
      toast.error("Failed to download DOC file");
    }
  };

  const handleCheckInSubmit = async (data: {
    actualCheckIn: Date;
    note: string;
  }) => {
    await onCheckIn(bookings.bookingId, data);
  };

  const handleCheckOutSubmit = async (data: {
    actualCheckOut: Date;
    note: string;
  }) => {
    await onCheckOut(bookings.bookingId, data);
  };
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Booking Detail
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            {/* Status + Payment */}
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium capitalize">
                {bookings.status}
              </span>
              <span className="text-gray-600 capitalize">
                {bookings.paymentMode} payment
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Check-in</p>
                <p className="font-medium">
                  {new Date(bookings.checkInDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Check-out</p>
                <p className="font-medium">
                  {new Date(bookings.checkOutDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Nights + Guests */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500">Nights</p>
                <p className="font-medium">{bookings.nights}</p>
              </div>
              <div>
                <p className="text-gray-500">Adults</p>
                <p className="font-medium">{bookings.noOfAdults}</p>
              </div>
              <div>
                <p className="text-gray-500">Pets</p>
                <p className="font-medium">{bookings.noOfPets}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Package</span>
                <span>{bookings.packagePrice.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Deposit</span>
                <span>{bookings.depositAmount.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{bookings.totalPrice.toLocaleString()}₫</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span>{bookings.upfrontPaymentAmount.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Status</span>
                <span className="capitalize">
                  {bookings.depositPaid ? "Paid" : "Unpaid"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Balance Due</span>
                <span>
                  {new Date(bookings.balanceDueDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Created */}
            <div className="text-xs text-gray-400 pt-2">
              Created at: {new Date(bookings.createdAt).toLocaleString()}
            </div>

            <div className="flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSubmitResidenceReport}
                    variant="outline"
                  >
                    <Send />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Submit residence report</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!bookings.actualCheckIn && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setCheckInDialogOpen(true)}
        >
          <CheckCheck />
        </Button>
      )}
      {bookings.actualCheckIn && !bookings.actualCheckOut && (
        <Button
          size="sm"
          variant="default"
          onClick={() => setCheckOutDialogOpen(true)}
        >
          <LogOut />
        </Button>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" className="bg-blue-500">
            <FileDown />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleGetPDF(bookings.bookingId)}
            >
              PDF
            </Button>
            <Button size="sm" onClick={() => handleGetDOC(bookings.bookingId)}>
              DOC
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>

      {bookings.actualCheckIn && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" className="bg-amber-500">
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onAddOccupant(bookings.bookingId)}
              >
                <UserRoundPlus />
              </Button>
              <Button
                size="sm"
                onClick={() => onGetOccupantList(bookings.bookingId)}
              >
                <ScanEye />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      )}

      <CheckInDialog
        open={checkInDialogOpen}
        onClose={() => setCheckInDialogOpen(false)}
        onSubmit={handleCheckInSubmit}
      />

      <CheckOutDialog
        open={checkOutDialogOpen}
        onClose={() => setCheckOutDialogOpen(false)}
        onSubmit={handleCheckOutSubmit}
      />
    </div>
  );
}

export default BookingAction;
