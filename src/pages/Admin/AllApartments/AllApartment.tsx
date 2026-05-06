import DataTable from "@/components/ui/dataTable/DataTable";
import { adminApartmentApi } from "@/services/privateApi/adminApi";
import type { Apartment } from "@/types/apartment";
import { Building2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AllApartmentColumns } from "./components/AllApartmentColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UnpublishDialog from "./components/UnpublishDialog";
import { Button } from "@/components/ui/button";
import ManagementFilter, {
  type Filter,
} from "@/components/ui/managementFilter/ManagementFilter";
import {
  apartmentSortByList,
  apartmentStatusList,
} from "@/constants/sortByList";
import ApartmentFilter from "@/pages/Landlord/ApartmentManagement/components/ApartmentFilter";

function AllApartment() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    sortBy: "createdAt",
    search: "",
    sortOrder: "desc",
  });
  const [status, setStatus] = useState<string>("");

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApartmentApi.getApartments({
        page,
        pageSize: 10,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search,
        status: status === "all" ? "" : status,
      });
      setApartments(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, status]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      sortBy: "createdAt",
      search: "",
      sortOrder: "desc",
    });
    setStatus("");
  };

  const triggerUnPublish = (id: string) => {
    setSelectedApartmentId(id);
    setIsOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Property Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all apartments and properties on your platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filters}
              setFilter={setFilters}
              sortByList={apartmentSortByList}
            />
            <ApartmentFilter
              setStatus={setStatus}
              status={status}
              statusList={apartmentStatusList}
            />
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>All Properties ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={AllApartmentColumns(triggerUnPublish)}
              data={apartments}
              limit={10}
              loading={loading}
              page={page}
              total={totalCount}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>

      <UnpublishDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        refetch={fetchApartments}
        apartmentId={selectedApartmentId}
      />
    </div>
  );
}

export default AllApartment;
