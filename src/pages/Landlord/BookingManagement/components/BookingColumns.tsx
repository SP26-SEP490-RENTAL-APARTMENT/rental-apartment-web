import { Button } from "@/components/ui/button";
import type { BookingHistory } from "@/types/bookingHistory";
import type { ColumnDef } from "@tanstack/react-table";
import BookingAction from "./BookingAction";

export const BookingColumns = (): ColumnDef<BookingHistory>[] => [
  {
    accessorKey: "apartmentId",
    header: "Apartment",
    cell: ({ row }) => {
      const apartmentId = row.original.apartmentId;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
        >
          {apartmentId}
        </Button>
      );
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Payment mode",
    cell: ({ row }) => {
      const paymentMode = row.original.paymentMode;
      return paymentMode.charAt(0).toUpperCase() + paymentMode.slice(1);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Book at",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return new Date(createdAt).toLocaleString();
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
    cell: ({ row }) => `${row.original.totalPrice.toLocaleString()} đ`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;
      return <BookingAction bookings={booking} />;
    },
  },
];
