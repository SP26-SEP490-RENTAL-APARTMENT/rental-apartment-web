import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ListingAction from "./ListingAction";

export const ListingColumns = (
  onApproveApartment: (id: string) => void,
  onAssignInspection: (id: string) => void
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
    accessorKey: "inspectionStatus",
    header: "Inspection Status",
    cell: ({ row }) => {
      const inspectionStatus = row.original.inspectionStatus;
      return inspectionStatus ? inspectionStatus.charAt(0).toUpperCase() + inspectionStatus.slice(1) : "Not Inspected";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const listing = row.original;
      return (
        <ListingAction listings={listing} onAppvrove={onApproveApartment} onAssign={onAssignInspection} />
      );
    },
  },
];