import type { Package } from "@/types/package";
import type { ColumnDef } from "@tanstack/react-table";
import PackageAction from "./PackageAction";
import { Button } from "@/components/ui/button";

export const PackageColumns = (
  onDelete: (packageId: string) => void,
  onEdit: (packages: Package) => void,
  onViewApartment: (apartmentId: string) => void,
): ColumnDef<Package>[] => [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `${row.original.price.toLocaleString()} đ`,
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <span>{isActive ? "Yes" : "No"}</span>;
    },
  },
  {
    accessorKey: "maxBookings",
    header: "Max Bookings",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const packages = row.original;
      return (
        <PackageAction
          packages={packages}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );
    },
  },
];
