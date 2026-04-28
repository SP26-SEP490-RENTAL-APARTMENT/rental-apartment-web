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
import type {
  CreateRoomFormData,
  UpdateRoomFormData,
} from "@/schemas/roomSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen } from "lucide-react";

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
        pageSize: 8,
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

  const handleUpdateRoom = async (
    data: CreateRoomFormData | UpdateRoomFormData,
  ) => {
    try {
      await roomManagementApi.updateRoom(data, selectedRoom!.roomId);
      toast.success("Room updated successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to update room");
      console.error("Error updating room:", error);
    }
  };

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

  // const handleAddRoom = () => {
  //   setSelectedRoom(null);
  //   setFormMode("create");
  //   setIsFormOpen(true);
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DoorOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Room Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all rooms across your properties
                </p>
              </div>
            </div>
            {/* <Button
              onClick={handleAddRoom}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </Button> */}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <RoomForm
        isOpen={isFormOpen}
        mode={formMode}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdateRoom}
        room={selectedRoom}
        apartment={null}
      />

      {/* Apartment Detail Modal */}
      <Dialog
        open={apartmentDetailDialogOpen}
        onOpenChange={() => setApartmentDetailDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apartment Details</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Rooms ({totalPages})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={roomColumns(
                handleDeleteRoom,
                fetchApartmentDetail,
                triggerUpdate,
              )}
              data={rooms}
              limit={8}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={totalPages}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RoomManagement;
