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
import { Plus, MapPin } from "lucide-react";
import NearbyAttractionForm from "./components/NearbyAttractionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import ManagementFilter from "@/components/ui/managementFilter/ManagementFilter";
import { nearbySortByList, nearbyTypeList } from "@/constants/sortByList";
import NearbyFilter from "./components/NearbyFilter";

function NearbyAttractions() {
  const [nearbyAttractions, setNearbyAttractions] = useState<
    NearbyAttraction[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] =
    useState<NearbyAttraction | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [filters, setFilters] = useState<Filter>({
    sortBy: nearbySortByList[0]?.value || "",
    sortOrder: "asc",
    search: "",
  });
  const [type, setType] = useState("all");

  const fetchNearby = useCallback(async () => {
    setLoading(true);
    try {
      const response =
        await nearbyAttractionManagementApi.getAllNearbyAttractions({
          page,
          pageSize: 10,
          search: filters.search,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          type: type === "all" ? "" : type,
        });
      setNearbyAttractions(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching nearby attractions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, type]);

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

  const handleResetFilters = () => {
    setFilters({
      search: "",
      sortBy: nearbySortByList[0]?.value || "",
      sortOrder: "asc",
    });
    setType("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <MapPin className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Nearby Attractions
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage attractions near properties
                </p>
              </div>
            </div>
            <Button
              onClick={triggerCreateNearby}
              className="bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Attraction
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filters}
              setFilter={setFilters}
              sortByList={nearbySortByList}
            />
            <NearbyFilter
              setType={setType}
              type={type}
              typeList={nearbyTypeList}
            />
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Attractions ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={NearbyColumns(handleDeleteNearby, triggerEditNearby)}
              data={nearbyAttractions}
              limit={10}
              loading={loading}
              page={page}
              total={total}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Nearby Attraction Form Modal */}
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
