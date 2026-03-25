import DataTable from "@/components/ui/dataTable/DataTable";
import { amenityManagementApi } from "@/services/privateApi/adminApi";
import type { Amenity } from "@/types/amenity";
import { useState } from "react";
import { AmenityColumns } from "./components/AmenityColumns";
import { toast } from "sonner";
import type {
  CreateAmenityFormData,
  UpdateAmenityFormData,
} from "@/schemas/amenitySchema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AmenityForm from "./components/AmenityForm";
import { useTranslation } from "react-i18next";
import useAmenity from "@/hooks/useAmenity";

function AmenityManagement() {
  const { t: amemityTranslate } = useTranslation("amenity");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortBy] = useState<keyof Amenity>("amenityId");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [search] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const { amenities, total, loading, refetch } = useAmenity({
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
  });

  const handleDeleteAmenity = async (amenityId: string) => {
    try {
      await amenityManagementApi.deleteAmenity(amenityId);
      refetch();
      toast.success("Amenity deleted successfully");
    } catch (error) {
      toast.error("Failed to delete amenity");
    }
  };

  const handleCreateAmenity = async (data: CreateAmenityFormData) => {
    try {
      await amenityManagementApi.createAmenity(data);
      refetch();
      toast.success("Amenity created successfully");
    } catch (error) {
      toast.error("Failed to create amenity");
    }
  };

  const handleUpdateAmenity = async (data: UpdateAmenityFormData) => {
    if (!selectedAmenity) return;
    try {
      await amenityManagementApi.updateAmenity(
        selectedAmenity?.amenityId,
        data,
      );
      refetch();
      toast.success("Amenity update successfully");
    } catch (error) {
      toast.error("Failed to update amenity");
    }
  };

  const handleFormSubmit = async (
    data: CreateAmenityFormData | UpdateAmenityFormData,
  ) => {
    if (formMode === "create") {
      await handleCreateAmenity(data as CreateAmenityFormData);
    } else {
      await handleUpdateAmenity(data as UpdateAmenityFormData);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerCreateAmenity = () => {
    setSelectedAmenity(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const triggerEditAmenity = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setFormMode("update");
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAmenity(null);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{amemityTranslate("management")}</h1>
        <Button onClick={triggerCreateAmenity}>
          <Plus className="mr-2 h-4 w-4" />
          {amemityTranslate("add")}
        </Button>
      </div>

      <DataTable
        columns={AmenityColumns(handleDeleteAmenity, triggerEditAmenity)}
        data={amenities}
        total={total}
        page={page}
        limit={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <AmenityForm
        amenity={selectedAmenity}
        isOpen={isFormOpen}
        mode={formMode}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default AmenityManagement;
