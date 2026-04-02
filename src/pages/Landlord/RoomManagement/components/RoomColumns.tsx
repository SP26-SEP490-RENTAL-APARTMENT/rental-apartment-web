import type { Room } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import RoomAction from "./RoomAction";
import { Button } from "@/components/ui/button";

export const roomColumns = (
  onDelete: (roomId: string) => void,
  onViewApartment: (apartmentId: string) => void,
  onEdit: (room: Room) => void,
): ColumnDef<Room>[] => [
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
    accessorKey: "title",
    header: "Title",
  },
//   {
//     accessorKey: "description",
//     header: "Description",
//   },
//   {
//     accessorKey: "bedType",
//     header: "Bed Type",
//   },
  {
    accessorKey: "roomType",
    header: "Room Type",
  },
  {
    accessorKey: "sizeSqm",
    header: "Size (sqm)",
  },
//   {
//     accessorKey: "isPrivateBathroom",
//     header: "Private Bathroom",
//     cell: ({ row }) => (row.getValue("isPrivateBathroom") ? "Yes" : "No"),
//   },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const room = row.original;
      return <RoomAction room={room} onDelete={onDelete} onEdit={onEdit} />;
    },
  },
];