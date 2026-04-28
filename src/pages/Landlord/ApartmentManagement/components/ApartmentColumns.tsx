import type { Apartment } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import ApartmentAction from "./ApartmentAction";
import { Badge } from "@/components/ui/badge";

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

export const ApartmentColumns = (
  onDelete: (id: string) => void,
  onEdit: (apartment: Apartment) => void,
  onAddAmenity: (apartmentId: string, amenities: string[]) => Promise<void>,
  onAddPackage: (apartment: Apartment) => void,
  onCreateRoom: (apartment: Apartment) => void,
  onAddAvailability: (apartmentId: string) => void,
  onViewPackage: (apartmentId: string) => void,
  onSendApprove: (apartmentId: string) => void,
  onAddPhotos: (apartmentId: string, files: File[]) => Promise<void>,
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
          onAddAvailability={onAddAvailability}
          onViewPackage={onViewPackage}
          onSendApprove={onSendApprove}
          onAddPhotos={onAddPhotos}
        />
      );
    },
  },
];
