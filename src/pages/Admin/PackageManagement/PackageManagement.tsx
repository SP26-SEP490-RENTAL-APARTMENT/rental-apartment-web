import DataTable from "@/components/ui/dataTable/DataTable";
import { packageManagementApi } from "@/services/privateApi/adminApi";
import type { Package } from "@/types/package";
import { useCallback, useEffect, useState } from "react";
import { PackageColumns } from "./components/PackageColumns";
import { toast } from "sonner";
import type { UpdatePackageFormData } from "@/schemas/packageSchema";
import PackageForm from "./components/PackageForm";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import type { Apartment } from "@/types/apartment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package as PackageIcon } from "lucide-react";

function PackageManagement() {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy] = useState<keyof Package>("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [search] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [apartmentDetailDialogOpen, setApartmentDetailDialogOpen] = useState(false);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await packageManagementApi.getAllPackages({
        page,
        pageSize,
        sortBy,
        sortOrder,
        search,
      });
      setPackages(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, search]);

  const handleDeletePackage = async (packageId: string) => {
    try {
      await packageManagementApi.deletePackage(packageId);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete package");
    }
  };

  const handleUpdatePackage = async (data: UpdatePackageFormData) => {
    if (!selectedPackage) return;
    try {
      await packageManagementApi.updatePackage(selectedPackage.packageId, data);
      toast.success("Package updated successfully");
      fetchPackages();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update package");
    }
  };

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

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const triggerUpdatePackage = (packages: Package) => {
    console.log(packages);
    setSelectedPackage(packages);
    setFormMode("update");
    setIsFormOpen(true);
  };

  const handleAddPackage = () => {
    setSelectedPackage(null);
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <PackageIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage all booking packages
                </p>
              </div>
            </div>
            <Button
              onClick={handleAddPackage}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              Packages ({totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={PackageColumns(
                handleDeletePackage,
                triggerUpdatePackage,
                fetchApartmentDetail,
              )}
              data={packages}
              limit={pageSize}
              loading={loading}
              total={totalCount}
              onPageChange={handlePageChange}
              page={page}
            />
          </CardContent>
        </Card>
      </div>

      {/* Package Form Modal */}
      <PackageForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdatePackage}
        packages={selectedPackage}
        mode={formMode}
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
    </div>
  );
}

export default PackageManagement;
  
