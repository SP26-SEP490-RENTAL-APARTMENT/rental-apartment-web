import type { Dispute } from "@/types/checkTime";
import type { ColumnDef } from "@tanstack/react-table";
import DisputeActions from "./DisputeActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getStatus = (status: string) => {
  switch (status) {
    case "resolved_in_favor_of_landlord":
      return (
        <Badge className="bg-blue-500">Resolved in Favor of Landlord</Badge>
      );
    case "resolved_in_favor_of_tenant":
      return <Badge>Resolved in Favor of Tenant</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

export const DisputeColumns = (
  onViewApartment: (id: string) => void,
  onViewUser: (id: string) => void,
  onResolveDispute: (bookingId: string) => void,
): ColumnDef<Dispute>[] => [
  {
    accessorKey: "tenantFullName",
    header: "Tenant",
    cell: ({ row }) => {
      const tenantId = row.original.tenantId;
      const tenant = row.original.tenantFullName;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
          onClick={() => onViewUser(tenantId)}
        >
          {tenant}
        </Button>
      );
    },
  },
  {
    accessorKey: "apartmentId",
    header: "Apartment",
    cell: ({ row }) => {
      const apartmentId = row.original.apartmentId;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
          onClick={() => onViewApartment(apartmentId)}
        >
          {apartmentId}
        </Button>
      );
    },
  },
  {
    accessorKey: "landlordFullName",
    header: "Landlord",
    cell: ({ row }) => {
      const landlordId = row.original.landlordId;
      const landlord = row.original.landlordFullName;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
          onClick={() => onViewUser(landlordId)}
        >
          {landlord}
        </Button>
      );
    },
  },
  {
    accessorKey: "disputeReason",
    header: "Dispute Reason",
    cell: ({ row }) => {
      return <span className="line-clamp-1">{row.original.disputeReason}</span>;
    },
  },
  {
    accessorKey: "disputeResolutionStatus",
    header: "Dispute Resolution Status",
    cell: ({ row }) => {
      return getStatus(row.original.disputeResolutionStatus);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt).toLocaleDateString();
      return <span>{createdAt}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const dispute = row.original;
      return <DisputeActions data={dispute} onResolve={onResolveDispute} />;
    },
  },
];
