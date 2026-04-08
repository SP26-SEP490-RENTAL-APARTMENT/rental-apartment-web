import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ListingAction from "./ListingAction";

export const ListingColumns = (
  onApproveApartment: (id: string) => void
): ColumnDef<Apartment>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "basePricePerNight",
    header: "Price per night",
    cell: ({ row }) => `${row.original.basePricePerNight.toLocaleString()} đ`,
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const listing = row.original;
      return (
        <ListingAction listings={listing} onAppvrove={onApproveApartment} />
      );
    },
  },
];