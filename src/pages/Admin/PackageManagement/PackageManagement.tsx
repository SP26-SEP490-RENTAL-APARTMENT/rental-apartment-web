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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";

function PackageManagement() {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy] = useState<keyof Package>("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [search] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [apartmentDetailDialogOpen, setApartmentDetailDialogOpen] =
    useState(false);

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
  return (
    <div>
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
      />
      <PackageForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdatePackage}
        packages={selectedPackage}
        mode={formMode}
        apartment={null}
      />
      <Dialog
        open={apartmentDetailDialogOpen}
        onOpenChange={() => setApartmentDetailDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PackageManagement;
