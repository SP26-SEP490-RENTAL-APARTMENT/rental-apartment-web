import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ApartmentAction from "./ApartmentAction";

export const ApartmentColumns = (
  onDelete: (id: string) => void,
  onEdit: (apartment: Apartment) => void,
  onAddAmenity: (apartmentId: string, amenities: string[]) => Promise<void>,
  onAddPackage: (apartment: Apartment) => void,
  onCreateRoom: (apartment: Apartment) => void,
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
    accessorKey: "maxOccupants",
    header: "Max occupants",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const apartment = row.original;
      return (
        <ApartmentAction
          apartment={apartment}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddAmenity={onAddAmenity}
          onAddPackage={onAddPackage}
          onCreateRoom={onCreateRoom}
        />
      );
    },
  },
];
