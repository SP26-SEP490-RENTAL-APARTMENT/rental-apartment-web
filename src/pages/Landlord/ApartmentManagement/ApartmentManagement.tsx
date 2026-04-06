import DataTable from "@/components/ui/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import {
  apartmentManagementApi,
  roomManagementApi,
} from "@/services/privateApi/landlordApi";
import type { Apartment } from "@/types/apartment";
import {
  type CreateApartmentFormData,
  type UpdateApartmentFormData,
} from "@/schemas/apartmentSchema";
import { useCallback, useEffect, useState } from "react";
import { ApartmentColumns } from "./components/ApartmentColumns";
import ApartmentForm from "./components/ApartmentForm";
import { toast } from "sonner";
import type {
  CreatePackageFormData,
  UpdatePackageFormData,
} from "@/schemas/packageSchema";
import { packageManagementApi } from "@/services/privateApi/adminApi";
import PackageForm from "@/pages/Admin/PackageManagement/components/PackageForm";
import RoomForm from "../RoomManagement/components/RoomForm";
import type {
  CreateRoomFormData,
  UpdateRoomFormData,
} from "@/schemas/roomSchema";
import AvailableDateForm from "./components/AvailableDateForm";
import type { AddAvailableDateFormData } from "@/schemas/availableDateSchema";
import type { Package } from "@/types/package";
import PackageDialog from "./components/PackageDialog";

function ApartmentManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [apartmentList, setApartmentList] = useState<Apartment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [search] = useState<string>("");
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [roomFormMode, setRoomFormMode] = useState<"create" | "update">(
    "create",
  );
  const [packageFormMode, setPackageFormMode] = useState<"create" | "update">(
    "create",
  );
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null,
  );
  const [selectedApartmentForPackage, setSelectedApartmentForPackage] =
    useState<Apartment | null>(null);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>("");
  const [isOpen, setIsOpen] = useState({
    apartmentForm: false,
    packageForm: false,
    roomForm: false,
    availabilityForm: false,
    packageDialog: false,
  });

  const fetchApartmentList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apartmentManagementApi.getApartments({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      });
      setApartmentList(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed to fetch apartments");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handleCreateApartment = async (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => {
    try {
      await apartmentManagementApi.createApartment(data as unknown as FormData);
      console.log(data);

      toast.success("Apartment created successfully");
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create apartment";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleUpdateApartment = async (
    data: CreateApartmentFormData | UpdateApartmentFormData,
  ) => {
    if (!selectedApartment) return;

    try {
      await apartmentManagementApi.updateApartment(
        data,
        selectedApartment.apartmentId,
      );
      toast.success("Apartment updated successfully");
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update apartment";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDeleteApartment = async (apartmentId: string) => {
    try {
      await apartmentManagementApi.deleteApartment(apartmentId);
      toast.success("Apartment deleted successfully");
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete apartment";
      toast.error(errorMessage);
    }
  };

  const handleAddAmenity = async (
    apartmentId: string,
    selectedAmenities: string[],
  ) => {
    try {
      await apartmentManagementApi.addAmenityToApartment(
        apartmentId,
        selectedAmenities,
      );
      toast.success("Amenities added successfully");
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add amenities";
      toast.error(errorMessage);
      throw error;
    }
  };
  const handleAddPackage = async (
    data: CreatePackageFormData | UpdatePackageFormData,
  ) => {
    try {
      const packageData = {
        ...data,
        apartmentId: selectedApartmentForPackage?.apartmentId,
      };
      await packageManagementApi.createPackage(packageData);
      toast.success("Package created successfully");
      setIsOpen((prev) => ({ ...prev, packageForm: false }));
      setSelectedApartmentForPackage(null);
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create package";
      toast.error(errorMessage);
    }
  };
  const handleCreateRoom = async (
    data: CreateRoomFormData | UpdateRoomFormData,
  ) => {
    try {
      const roomData = {
        ...data,
        apartmentId: selectedApartmentForPackage?.apartmentId,
      };
      await roomManagementApi.createRoom(roomData);
      toast.success("Room created successfully");
      setIsOpen((prev) => ({ ...prev, roomForm: false }));
      setSelectedApartmentForPackage(null);
      fetchApartmentList();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create room";
      toast.error(errorMessage);
    }
  };

  const handleAddAvailability = async (data: AddAvailableDateFormData) => {
    try {
      await apartmentManagementApi.addAvailableDateToApartment(
        selectedApartmentId,
        data.ranges,
      );
      toast.success("Available dates added successfully");
      setIsOpen((prev) => ({ ...prev, availabilityForm: false }));
      setSelectedApartmentId("");
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add available dates";
      toast.error(errorMessage);
      throw error;
    }
  };

  const fetchPackageDetail = async (apartmentId: string) => {
    if (!apartmentId) return;
    try {
      const response = await packageManagementApi.getPackageByApartment(
        apartmentId,
        {
          page: 1,
          pageSize: 30,
          search: "",
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      );
      // Handle case when no packages found
      setPackages(response.data?.items || []);
    } catch (error) {
      console.log(error);
      // Set to empty array on error to avoid stale data
      setPackages([]);
    }
  };

  useEffect(() => {
    fetchApartmentList();
  }, [fetchApartmentList]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handleAddNew = () => {
    setFormMode("create");
    setSelectedApartment(null);
    setIsOpen((prev) => ({ ...prev, apartmentForm: true }));
  };

  const handleEdit = (apartment: Apartment) => {
    setFormMode("update");
    setSelectedApartment(apartment);
    setIsOpen((prev) => ({ ...prev, apartmentForm: true }));
  };
  const triggerAddPackage = (apartment: Apartment) => {
    setPackageFormMode("create");
    setSelectedApartmentForPackage(apartment);
    setIsOpen((prev) => ({ ...prev, packageForm: true }));
  };
  const triggerCreateRoom = (apartment: Apartment) => {
    setRoomFormMode("create");
    setSelectedApartmentForPackage(apartment);
    setIsOpen((prev) => ({ ...prev, roomForm: true }));
  };

  const triggerAddAvailability = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId);
    setIsOpen((prev) => ({ ...prev, availabilityForm: true }));
  };

  const triggerViewPackage = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId);
    setPackages([]); // Reset packages for new apartment
    setIsOpen((prev) => ({ ...prev, packageDialog: true }));
    fetchPackageDetail(apartmentId);
  };

  const handlePackageItemAdded = async (packageId: string) => {
    console.log(packageId);

    if (selectedApartmentId) {
      await fetchPackageDetail(selectedApartmentId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew} className="cursor-pointer">
          Add New Apartment
        </Button>
      </div>

      <DataTable
        columns={ApartmentColumns(
          handleDeleteApartment,
          handleEdit,
          handleAddAmenity,
          triggerAddPackage,
          triggerCreateRoom,
          triggerAddAvailability,
          triggerViewPackage,
        )}
        data={apartmentList}
        limit={pageSize}
        loading={loading}
        page={page}
        total={total}
        onPageChange={handlePageChange}
      />

      <ApartmentForm
        isOpen={isOpen.apartmentForm}
        onClose={() => setIsOpen((prev) => ({ ...prev, apartmentForm: false }))}
        onSubmit={
          formMode === "create" ? handleCreateApartment : handleUpdateApartment
        }
        apartment={selectedApartment}
        mode={formMode}
      />

      <PackageForm
        isOpen={isOpen.packageForm}
        onClose={() => {
          setIsOpen((prev) => ({ ...prev, packageForm: false }));
          setSelectedApartmentForPackage(null);
        }}
        mode={packageFormMode}
        packages={
          packageFormMode === "create"
            ? { apartmentId: selectedApartmentForPackage?.apartmentId }
            : null
        }
        onSubmit={handleAddPackage}
        apartment={selectedApartmentForPackage}
      />

      <RoomForm
        isOpen={isOpen.roomForm}
        mode={roomFormMode}
        onClose={() => {
          setIsOpen((prev) => ({ ...prev, roomForm: false }));
          setSelectedApartmentForPackage(null);
        }}
        room={
          roomFormMode === "create"
            ? { apartmentId: selectedApartmentForPackage?.apartmentId }
            : null
        }
        apartment={selectedApartmentForPackage}
        onSubmit={handleCreateRoom}
      />

      <AvailableDateForm
        isOpen={isOpen.availabilityForm}
        onClose={() => {
          setIsOpen((prev) => ({ ...prev, availabilityForm: false }));
          setSelectedApartmentId("");
        }}
        onSubmit={handleAddAvailability}
        // apartmentId={selectedApartmentId}
      />

      <PackageDialog
        isOpen={isOpen.packageDialog}
        onClose={() => {
          setIsOpen((prev) => ({ ...prev, packageDialog: false }));
          setSelectedApartmentId("");
          setPackages([]);
        }}
        packages={packages}
        onAddSuccess={handlePackageItemAdded}
      />
    </div>
  );
}

export default ApartmentManagement;
