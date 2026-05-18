import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Occupy } from "@/types/occupy";
import OccupyActions from "./OccupyActions";

export const OccupyColumns = (
  onViewApartment: (id: string) => void,
  onViewUser: (id: string) => void,
): ColumnDef<Occupy>[] => [
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
      const occupy = row.original;
      return <OccupyActions occupy={occupy} />;
    },
  },
];
