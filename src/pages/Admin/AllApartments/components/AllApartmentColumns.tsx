import { Badge } from "@/components/ui/badge";
import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import AllApartmentAction from "./AllApartmentAction";

const getStatusBadge = (status?: string | null) => {
  switch (status) {
    case "posted":
      return <Badge className="bg-blue-500 text-white">Posted</Badge>;
    case "pending_review":
      return <Badge className="bg-gray-500 text-white">Pending review</Badge>;
    default:
      return <Badge variant="secondary">Draft</Badge>;
  }
};

const getInspectionStatusBadge = (inspectionStatus?: string) => {
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

export const AllApartmentColumns = (
  unPublishApartment: (id: string) => void
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
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "inspectionStatus",
    header: "Inspection Status",
    cell: ({ row }) => {
      const status = row.original.inspectionStatus;
      return getInspectionStatusBadge(status);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const apartments = row.original;
      return <AllApartmentAction apartment={apartments} unPublishApartment={unPublishApartment} />;
    },
  },
];
