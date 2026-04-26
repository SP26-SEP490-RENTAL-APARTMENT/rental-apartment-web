import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ListingAction from "./ListingAction";
import { Badge } from "@/components/ui/badge";

const getInspectionStatusBadge = (inspectionStatus?: string | null) => {
  switch (inspectionStatus) {
    case "scheduled":
      return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
    case "in_progress":
      return <Badge className="bg-green-500 text-white">In progress</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    case "passed":
      return <Badge className="bg-gray-500 text-white">Passed</Badge>;
    default:
      return <Badge variant="secondary">Not scheduled</Badge>;
  }
};

export const ListingColumns = (
  onApproveApartment: (id: string) => void,
  onAssignInspection: (id: string) => void,
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
      return (
        <Badge variant="secondary">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "inspectionStatus",
    header: "Inspection Status",
    cell: ({ row }) => getInspectionStatusBadge(row.original.inspectionStatus),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const listing = row.original;
      return (
        <ListingAction
          listings={listing}
          onAppvrove={onApproveApartment}
          onAssign={onAssignInspection}
        />
      );
    },
  },
];
