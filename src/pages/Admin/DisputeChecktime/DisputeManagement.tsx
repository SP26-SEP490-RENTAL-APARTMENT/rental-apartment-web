import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import { disputeManagementApi } from "@/services/privateApi/adminApi";
import type { Dispute } from "@/types/checkTime";
import { BadgeAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DisputeColumns } from "./components/DisputeColumn";

function DisputeManagement() {
  const [disputeList, setDisputeList] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters] = useState<Filter>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disputeManagementApi.getAllDisputes({
        page,
        pageSize: 10,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setDisputeList(response.data.data);
      setTotal(response.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <BadgeAlert className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dispute Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and resolve disputes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Card */}
        {/* <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filters}
              setFilter={setFilters}
              sortByList={occupySortByList}
            />

            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card> */}

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Disputes ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={DisputeColumns()}
              data={disputeList}
              limit={10}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={total}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DisputeManagement;
