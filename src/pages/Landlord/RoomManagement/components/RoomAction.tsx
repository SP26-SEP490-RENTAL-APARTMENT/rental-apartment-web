import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BED_TYPE_CONFIG, ROOM_TYPE_CONFIG } from "@/config/badge-config";
import type { Room } from "@/types/apartment";
import { renderBadge } from "@/utils/renderBadge";
import { Bath, Bed, Eye, Home, Pen, Ruler, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Props {
  room: Room;
  onDelete: (roomId: string) => void;
  onEdit: (room: Room) => void;
}
function RoomAction({ room, onDelete, onEdit }: Props) {
  const { t: statusT } = useTranslation("status");
  const { t: roomT } = useTranslation("landlord");
  const { t: commonT } = useTranslation("common");
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Eye />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {room.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {roomT("apartment.room.description")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {room.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Ruler size={16} className="text-gray-500" />
                <span>{room.sizeSqm} m²</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Bed size={16} className="text-gray-500" />
                <span>
                  {renderBadge(room.bedType, BED_TYPE_CONFIG, statusT)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Home size={16} className="text-gray-500" />
                <span>
                  {renderBadge(room.roomType, ROOM_TYPE_CONFIG, statusT)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Bath size={16} className="text-gray-500" />
                <span>
                  {room.isPrivateBathroom ? (
                    <Badge className="bg-green-100 text-green-700">
                      {statusT("room.pBathroom")}
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700">
                      {statusT("room.sBathroom")}
                    </Badge>
                  )}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t text-xs text-gray-400">
              {roomT("apartment.infor.createdAt")}:{" "}
              {new Date(room.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="outline" onClick={() => onEdit(room)}>
        <Pen />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{commonT("delete.title")}</DialogTitle>
            <DialogDescription>
              {commonT("delete.description", {
                item: i18n.language === "vi" ? "phòng" : "room",
              })}
            </DialogDescription>
          </DialogHeader>
          <p>
            {commonT("delete.message", {
              item: i18n.language === "vi" ? "phòng" : "room",
            })}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => onDelete(room.roomId)}
              className="cursor-pointer"
              size="sm"
              variant="destructive"
            >
              {commonT("button.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RoomAction;
