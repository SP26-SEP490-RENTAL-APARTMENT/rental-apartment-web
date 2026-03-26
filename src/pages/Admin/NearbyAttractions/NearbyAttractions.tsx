import DataTable from "@/components/ui/dataTable/DataTable";
import { nearbyAttractionManagementApi } from "@/services/privateApi/adminApi";
import type { NearbyAttraction } from "@/types/nearbyAttraction";
import { useCallback, useEffect, useState } from "react";
import { NearbyColumns } from "./components/NearbyColumns";
import { toast } from "sonner";
import type {
  CreateNearbyAttractionFormData,
  UpdateNearbyAttractionFormData,
} from "@/schemas/nearbyAttractionSchema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NearbyAttractionForm from "./components/NearbyAttractionForm";

function NearbyAttractions() {
  const [nearbyAttractions, setNearbyAttractions] = useState<
    NearbyAttraction[]
  >([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortBy] = useState<string>("attractionId");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [search] = useState<string>("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] =
    useState<NearbyAttraction | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const fetchNearby = useCallback(async () => {
    setLoading(true);
    try {
      const response =
        await nearbyAttractionManagementApi.getAllNearbyAttractions({
          page,
          pageSize,
          search,
          sortBy,
          sortOrder,
        });
      setNearbyAttractions(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching nearby attractions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handleDeleteNearby = async (attractionId: string) => {
    try {
      await nearbyAttractionManagementApi.deleteNearbyAttraction(attractionId);
      fetchNearby();
      toast.success("Nearby attraction deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast.error("Failed to delete nearby attraction");
    }
  };

  const handleCreateNearby = async (data: CreateNearbyAttractionFormData) => {
    try {
      await nearbyAttractionManagementApi.createNearbyAttraction(data as any);
      fetchNearby();
      toast.success("Nearby attraction created successfully");
    } catch (error) {
      toast.error("Failed to create nearby attraction");
    }
  };

  const handleUpdateNearby = async (data: UpdateNearbyAttractionFormData) => {
    if (!selectedAttraction) return;
    try {
      await nearbyAttractionManagementApi.updateNearbyAttraction(
        selectedAttraction?.attractionId,
        data as any,
      );
      fetchNearby();
      toast.success("Nearby attraction updated successfully");
    } catch (error) {
      toast.error("Failed to update nearby attraction");
    }
  };

  const handleFormSubmit = async (
    data: CreateNearbyAttractionFormData | UpdateNearbyAttractionFormData,
  ) => {
    if (formMode === "create") {
      await handleCreateNearby(data as CreateNearbyAttractionFormData);
    } else {
      await handleUpdateNearby(data as UpdateNearbyAttractionFormData);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerCreateNearby = () => {
    setSelectedAttraction(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const triggerEditNearby = (attraction: NearbyAttraction) => {
    setSelectedAttraction(attraction);
    setFormMode("update");
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAttraction(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nearby Attractions Management</h1>
        <Button onClick={triggerCreateNearby}>
          <Plus className="mr-2 h-4 w-4" />
          Add Nearby Attraction
        </Button>
      </div>

      <DataTable
        columns={NearbyColumns(handleDeleteNearby, triggerEditNearby)}
        data={nearbyAttractions}
        limit={pageSize}
        loading={loading}
        page={page}
        total={total}
        onPageChange={handlePageChange}
      />

      <NearbyAttractionForm
        attraction={selectedAttraction}
        isOpen={isFormOpen}
        mode={formMode}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default NearbyAttractions;
