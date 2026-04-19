import { Button } from "@/components/ui/button";
import type { BookingHistory } from "@/types/bookingHistory";
import type { ColumnDef } from "@tanstack/react-table";
import BookingAction from "./BookingAction";

export const BookingColumns = (
  onCheckIn: (
    bookingId: string,
    data: { actualCheckIn: Date; note: string },
  ) => Promise<void>,
  onCheckOut: (
    bookingId: string,
    data: { actualCheckOut: Date; note: string },
  ) => Promise<void>,
): ColumnDef<BookingHistory>[] => [
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
    accessorKey: "tenantFullName",
    header: "Tenant",
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
      return (
        <BookingAction
          bookings={booking}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      );
    },
  },
];
