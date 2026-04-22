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
import { Plus, Sparkles } from "lucide-react";
import AmenityForm from "./components/AmenityForm";
import { useTranslation } from "react-i18next";
import useAmenity from "@/hooks/useAmenity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AmenityManagement() {
  const { t: amemityTranslate } = useTranslation("amenity");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
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
    enable: true,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {amemityTranslate("management")}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage property amenities and features
                </p>
              </div>
            </div>
            <Button
              onClick={triggerCreateAmenity}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              {amemityTranslate("add")}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Amenities ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={AmenityColumns(handleDeleteAmenity, triggerEditAmenity)}
              data={amenities}
              total={total}
              page={page}
              limit={pageSize}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Amenity Form Modal */}
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
