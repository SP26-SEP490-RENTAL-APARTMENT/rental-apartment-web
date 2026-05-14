import type { Room } from "@/types/apartment";
import type { ColumnDef } from "@tanstack/react-table";
import RoomAction from "./RoomAction";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { renderBadge } from "@/utils/renderBadge";
import { ROOM_TYPE_CONFIG } from "@/config/badge-config";

export const useRoomColumns = (
  onDelete: (roomId: string) => void,
  onViewApartment: (apartmentId: string) => void,
  onEdit: (room: Room) => void,
): ColumnDef<Room>[] => {
  const { t } = useTranslation("landlord");
  const { t: statusT } = useTranslation("status");
  return [
    {
      accessorKey: "apartmentId",
      header: t("apartment.room.apartment"),
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
      header: t("apartment.room.title"),
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
      header: t("apartment.room.type"),
      cell: ({ row }) => {
        const roomType = row.getValue<string | null>("roomType");
        return renderBadge(roomType, ROOM_TYPE_CONFIG, statusT);
      },
    },
    {
      accessorKey: "sizeSqm",
      header: t("apartment.room.size"),
    },
    //   {
    //     accessorKey: "isPrivateBathroom",
    //     header: "Private Bathroom",
    //     cell: ({ row }) => (row.getValue("isPrivateBathroom") ? "Yes" : "No"),
    //   },
    {
      id: "actions",
      header: t("apartment.actions"),
      cell: ({ row }) => {
        const room = row.original;
        return <RoomAction room={room} onDelete={onDelete} onEdit={onEdit} />;
      },
    },
  ];
};

export const roomColumns = useRoomColumns;
