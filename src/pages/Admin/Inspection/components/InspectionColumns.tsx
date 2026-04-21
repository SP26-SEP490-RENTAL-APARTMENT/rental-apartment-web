import { Button } from "@/components/ui/button";
import type { Inspection } from "@/types/inspection";
import type { ColumnDef } from "@tanstack/react-table";
import InspectionAction from "./InspectionAction";

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
      return status.charAt(0).toUpperCase() + status.slice(1);
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
