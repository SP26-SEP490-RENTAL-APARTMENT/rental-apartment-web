import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Room } from "@/types/apartment";
import { Bath, Bed, Eye, Home, Ruler, Trash2, UserRoundPen } from "lucide-react";

export interface Props {
  room: Room;
  onDelete: (roomId: string) => void;
  onEdit: (room: Room) => void;
}
function RoomAction({ room, onDelete, onEdit }: Props) {
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
            <p className="text-sm text-gray-500">
              {room.roomType.replace("_", " ")} • {room.bedType}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Description
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
                <span className="capitalize">{room.bedType}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Home size={16} className="text-gray-500" />
                <span className="capitalize">
                  {room.roomType.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Bath size={16} className="text-gray-500" />
                {room.isPrivateBathroom ? (
                  <span className="text-green-600 font-medium">
                    Private bathroom
                  </span>
                ) : (
                  <span className="text-orange-500 font-medium">
                    Shared bathroom
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t text-xs text-gray-400">
              Created at: {new Date(room.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="outline" onClick={() => onEdit(room)}>
        <UserRoundPen />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" size="sm" variant="destructive">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action will permanently remove the room from the system.
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure you want to delete this room?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => onDelete(room.roomId)}
              className="cursor-pointer"
              size="sm"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RoomAction;
