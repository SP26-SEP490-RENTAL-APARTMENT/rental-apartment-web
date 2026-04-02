import DataTable from "@/components/ui/dataTable/DataTable";
import { roomManagementApi } from "@/services/privateApi/landlordApi";
import { useAuthStore } from "@/store/authStore";
import type { Apartment, Room } from "@/types/apartment";
import { useCallback, useEffect, useState } from "react";
import { roomColumns } from "./components/RoomColumns";
import { toast } from "sonner";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import RoomForm from "./components/RoomForm";
import type { CreateRoomFormData, UpdateRoomFormData } from "@/schemas/roomSchema";

function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [apartment, setApartment] = useState<Apartment>();
  const [apartmentDetailDialogOpen, setApartmentDetailDialogOpen] =
    useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { user } = useAuthStore();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const response = await roomManagementApi.getRooms(user?.id, {
        page,
        pageSize: 10,
        search,
        sortBy,
        sortOrder,
      });
      setRooms(response.data.items);
      setTotalPages(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder, user]);

  const fetchApartmentDetail = async (apartmentId: string) => {
    setApartmentDetailDialogOpen(true);
    try {
      const response = await apartmentApi.getApartmentById(apartmentId);
      const data = response.data.data;
      setApartment(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await roomManagementApi.deleteRoom(roomId);
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room");
      console.error("Error deleting room:", error);
    }
  };

  const handleUpdateRoom = async (data: CreateRoomFormData | UpdateRoomFormData) => {
    try {
      await roomManagementApi.updateRoom(data, selectedRoom!.roomId);
      toast.success("Room updated successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to update room");
      console.error("Error updating room:", error);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerUpdate = (room: Room) => {
    setSelectedRoom(room);
    setFormMode("update");
    setIsFormOpen(true);
  };
  return (
    <div>
      <DataTable
        columns={roomColumns(
          handleDeleteRoom,
          fetchApartmentDetail,
          triggerUpdate,
        )}
        data={rooms}
        limit={5}
        loading={loading}
        onPageChange={handlePageChange}
        page={1}
        total={totalPages}
      />

      <RoomForm
        isOpen={isFormOpen}
        mode={formMode}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdateRoom}
        room={selectedRoom}
        apartment={null}
      />

      <Dialog
        open={apartmentDetailDialogOpen}
        onOpenChange={() => setApartmentDetailDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RoomManagement;
