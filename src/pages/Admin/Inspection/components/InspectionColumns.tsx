import { Button } from "@/components/ui/button";
import type { Inspection } from "@/types/inspection";
import type { ColumnDef } from "@tanstack/react-table";
import InspectionAction from "./InspectionAction";
import { Badge } from "@/components/ui/badge";

const getInspectionStatusBadge = (inspectionStatus: string) => {
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

export const InspectionColumns = (
  onStartInspection: (id: string) => void,
  onInspectionForm: (id: string) => void,
  onReviewInspection: (id: string) => void,
  onGetApartment: (id: string) => void,
): ColumnDef<Inspection>[] => [
  {
    accessorKey: "apartmentId",
    header: "Apartment",
    cell: ({ row }) => {
      const apartmentId = row.original.apartmentId;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
          onClick={() => onGetApartment(apartmentId)}
        >
          {apartmentId}
        </Button>
      );
    },
  },
  {
    accessorKey: "apartmentName",
    header: "Apartment Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return getInspectionStatusBadge(status);
    },
  },
  {
    accessorKey: "approvedForListing",
    header: "Listing approve",
    cell: ({ row }) => {
      const approvedForListing = row.original.approvedForListing;
      return approvedForListing ? "Yes" : "No";
    },
  },
  {
    accessorKey: "approvedAt",
    header: "Approve at",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const inspections = row.original;
      return (
        <InspectionAction
          inspections={inspections}
          onStartInspection={onStartInspection}
          onInspectionForm={onInspectionForm}
          onReviewInspection={onReviewInspection}
        />
      );
    },
  },
];
