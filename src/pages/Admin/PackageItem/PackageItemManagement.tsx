import DataTable from "@/components/ui/dataTable/DataTable";
import { packageItemManagementApi } from "@/services/privateApi/adminApi";
import { useCallback, useEffect, useState } from "react";
import { packageItemColumns } from "./components/PackageItemColumns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import PackageItemForm from "./components/PackageItemForm";
import type {
  CreatePackageItemFormData,
  UpdatePackageItemFormData,
} from "@/schemas/packageItemSchema";
import type { PackageItem } from "@/types/package";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PackageItemManagement() {
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy] = useState<keyof PackageItem>("itemName");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [search] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackageItem, setSelectedPackageItem] =
    useState<PackageItem | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const fetchPackageItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await packageItemManagementApi.getAllPackageItems({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search,
      });
      setPackageItems(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching package items:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, search]);

  const handleDeletePackageItem = async (packageItemId: string) => {
    try {
      await packageItemManagementApi.deletePackageItem(packageItemId);
      toast.success("Package item deleted successfully");
      fetchPackageItems();
    } catch (error) {
      console.error("Error deleting package item:", error);
      toast.error("Failed to delete package item");
    }
  };

  const handleCreatePackageItem = async (data: CreatePackageItemFormData) => {
    try {
      await packageItemManagementApi.createPackageItem(data);
      toast.success("Package item created successfully");
      fetchPackageItems();
    } catch (error) {
      console.error("Error creating package item:", error);
      toast.error("Failed to create package item");
    }
  };

  const handleUpdatePackageItem = async (data: UpdatePackageItemFormData) => {
    if (!selectedPackageItem) return;
    try {
      await packageItemManagementApi.updatePackageItem(
        selectedPackageItem.packageItemId,
        data,
      );
      toast.success("Package item updated successfully");
      fetchPackageItems();
    } catch (error) {
      console.error("Error updating package item:", error);
      toast.error("Failed to update package item");
    }
  };

  const handleFormSubmit = async (
    data: CreatePackageItemFormData | UpdatePackageItemFormData,
  ) => {
    if (formMode === "create") {
      await handleCreatePackageItem(data as CreatePackageItemFormData);
    } else {
      await handleUpdatePackageItem(data as UpdatePackageItemFormData);
    }
  };

  useEffect(() => {
    fetchPackageItems();
  }, [fetchPackageItems]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerUpdatePackageItem = (packageItem: PackageItem) => {
    setSelectedPackageItem(packageItem);
    setFormMode("update");
    setIsFormOpen(true);
  };
  const triggerCreatePackageItem = () => {
    setSelectedPackageItem(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Package Items
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage amenities and package items
                </p>
              </div>
            </div>
            <Button
              onClick={triggerCreatePackageItem}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Items ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={packageItemColumns(
                handleDeletePackageItem,
                triggerUpdatePackageItem,
              )}
              data={packageItems}
              limit={pageSize}
              loading={loading}
              page={page}
              total={total}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Package Item Form Modal */}
      <PackageItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        packageItem={selectedPackageItem}
        mode={formMode}
      />
    </div>
  );
}

export default PackageItemManagement;
