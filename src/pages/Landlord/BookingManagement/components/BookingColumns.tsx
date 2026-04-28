import { Button } from "@/components/ui/button";
import type { BookingHistory } from "@/types/bookingHistory";
import type { ColumnDef } from "@tanstack/react-table";
import BookingAction from "./BookingAction";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status?: string | null) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;

    case "negotiating":
      return <Badge className="bg-orange-500 text-white">Negotiating</Badge>;

    case "confirmed":
      return <Badge className="bg-blue-500 text-white">Confirmed</Badge>;

    case "paid":
      return <Badge className="bg-emerald-500 text-white">Paid</Badge>;

    case "completed":
      return <Badge className="bg-green-600 text-white">Completed</Badge>;

    case "cancelled":
      return <Badge className="bg-gray-500 text-white">Cancelled</Badge>;

    case "disputed":
      return <Badge className="bg-red-500 text-white">Disputed</Badge>;

    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export const BookingColumns = (
  onCheckIn: (
    bookingId: string,
    data: { actualCheckIn: Date; note: string },
  ) => Promise<void>,
  onCheckOut: (
    bookingId: string,
    data: { actualCheckOut: Date; note: string },
  ) => Promise<void>,
  onGetOccupantList: (bookingId: string) => Promise<void>,
  onAddOccupant: (bookingId: string) => void,
  getApartmentDetail: (apartmentId: string) => void,
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
          onClick={() => getApartmentDetail(apartmentId)}
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
      return getStatusBadge(status);
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
          onGetOccupantList={onGetOccupantList}
          onAddOccupant={onAddOccupant}
        />
      );
    },
  },
];
