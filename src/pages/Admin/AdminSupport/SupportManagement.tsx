import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import { supportManagementApi } from "@/services/privateApi/adminApi";
import type { SupportTicket } from "@/types/supportTicket";
import { Ticket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SupportColumns } from "./components/SupportColumns";
import ManagementFilter from "@/components/ui/managementFilter/ManagementFilter";
import {
  supportCategoryOptions,
  supportPriorityOptions,
  supportStatusList,
  supportTicketSortByList,
} from "@/constants/sortByList";
import { Button } from "@/components/ui/button";
import SupportFilter from "./components/SupportFilter";
import ResolveForm from "./components/ResolveForm";

function SupportManagement() {
  const [supports, setSupports] = useState<SupportTicket[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    sortBy: "createdAt",
    sortOrder: "asc",
    search: "",
  });
  const [addFilters, setAddFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [resolveDialog, setResolveDialog] = useState(false);
  const [selectedSupportId, setSelectedSupportId] = useState("");

  const fetchSupports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await supportManagementApi.getAllRequests({
        page,
        pageSize: 10,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: addFilters.status === "all" ? "" : addFilters.status,
        priority: addFilters.priority === "all" ? "" : addFilters.priority,
        category: addFilters.category === "all" ? "" : addFilters.category,
      });
      setSupports(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, addFilters]);

  useEffect(() => {
    fetchSupports();
  }, [fetchSupports]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      sortBy: "createdAt",
      sortOrder: "asc",
      search: "",
    });
    setAddFilters({
      status: "",
      priority: "",
      category: "",
    });
  };

  const triggerResolveDialog = (supportId: string) => {
    setSelectedSupportId(supportId);
    setResolveDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Ticket className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Support Tickets
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and respond to support tickets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filters}
              setFilter={setFilters}
              sortByList={supportTicketSortByList}
            />
            <SupportFilter
              addFilters={addFilters}
              setAddFilters={setAddFilters}
              statusList={supportStatusList}
              priorityList={supportPriorityOptions}
              categoryList={supportCategoryOptions}
            />
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Support Tickets ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={SupportColumns(triggerResolveDialog)}
              data={supports}
              limit={10}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={totalCount}
            />
          </CardContent>
        </Card>
      </div>

      <ResolveForm
        onClose={() => setResolveDialog(false)}
        open={resolveDialog}
        refetch={fetchSupports}
        supportId={selectedSupportId}
      />
    </div>
  );
}

export default SupportManagement;
