import DataTable from "@/components/ui/dataTable/DataTable";
import { packageItemManagementApi } from "@/services/privateApi/adminApi";
import { useCallback, useEffect, useState } from "react";
import { packageItemColumns } from "./components/PackageItemColumns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PackageItemForm from "./components/PackageItemForm";
import type {
  CreatePackageItemFormData,
  UpdatePackageItemFormData,
} from "@/schemas/packageItemSchema";
import type { PackageItem } from "@/types/package";

function PackageItemManagement() {
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Package items</h1>
        <Button onClick={triggerCreatePackageItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      <DataTable
        columns={packageItemColumns(handleDeletePackageItem, triggerUpdatePackageItem)}
        data={packageItems}
        limit={pageSize}
        loading={loading}
        page={page}
        total={total}
        onPageChange={handlePageChange}
      />

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
