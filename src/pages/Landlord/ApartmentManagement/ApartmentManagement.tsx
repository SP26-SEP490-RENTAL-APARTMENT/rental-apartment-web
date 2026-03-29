import DataTable from "@/components/ui/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import type { Apartment } from "@/types/apartment";
import {
  type CreateApartmentFormData,
  type UpdateApartmentFormData,
} from "@/schemas/apartmentSchema";
import { useCallback, useEffect, useState } from "react";
import { ApartmentColumns } from "./components/ApartmentColumns";
import ApartmentForm from "./components/ApartmentForm";
import { toast } from "sonner";
import type { CreatePackageFormData, UpdatePackageFormData } from "@/schemas/packageSchema";
import { packageManagementApi } from "@/services/privateApi/adminApi";
import PackageForm from "@/pages/Admin/PackageManagement/components/PackageForm";

function ApartmentManagement() {
  const [apartmentList, setApartmentList] = useState<Apartment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [search] = useState<string>("");
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null,
  );

  const [isPackageFormOpen, setIsPackageFormOpen] = useState<boolean>(false);
  const [packageFormMode, setPackageFormMode] = useState<"create" | "update">(
    "create",
  );
  const [selectedApartmentForPackage, setSelectedApartmentForPackage] =
    useState<Apartment | null>(null);

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
  const handleAddPackage = async (data: CreatePackageFormData | UpdatePackageFormData) => {
    try {
      const packageData = {
        ...data,
        apartmentId: selectedApartmentForPackage?.apartmentId,
      };
      await packageManagementApi.createPackage(packageData);
      toast.success("Package created successfully");
      setIsPackageFormOpen(false);
      setSelectedApartmentForPackage(null);
      fetchApartmentList();
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create package";
      toast.error(errorMessage);
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
    setIsFormOpen(true);
  };

  const handleEdit = (apartment: Apartment) => {
    setFormMode("update");
    setSelectedApartment(apartment);
    setIsFormOpen(true);
  };
  const triggerAddPackage = (apartment: Apartment) => {
    setPackageFormMode("create");
    setSelectedApartmentForPackage(apartment);
    setIsPackageFormOpen(true);
    console.log(apartment.apartmentId);
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
        )}
        data={apartmentList}
        limit={pageSize}
        loading={loading}
        page={page}
        total={total}
        onPageChange={handlePageChange}
      />

      <ApartmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={
          formMode === "create" ? handleCreateApartment : handleUpdateApartment
        }
        apartment={selectedApartment}
        mode={formMode}
      />

      <PackageForm
        isOpen={isPackageFormOpen}
        onClose={() => {
          setIsPackageFormOpen(false);
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
    </div>
  );
}

export default ApartmentManagement;
