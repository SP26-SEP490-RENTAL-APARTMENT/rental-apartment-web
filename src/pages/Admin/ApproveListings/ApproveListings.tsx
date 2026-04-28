import DataTable from "@/components/ui/dataTable/DataTable";
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import type { Apartment } from "@/types/apartment";
import { useCallback, useEffect, useState } from "react";
import { ListingColumns } from "./components/ListingColumns";
import type { ListingApproveFormData } from "@/schemas/listingApproveSchema";
import { toast } from "sonner";
import ListingApproveForm from "./components/ListingApproveForm";
import AssignInspectionForm from "./components/AssignInspectionForm";
import type { AssignInspectionFormData } from "@/schemas/assignInspection";
import { inspectionApi } from "@/services/privateApi/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  inspectionStatusList,
  listingSortByList,
} from "@/constants/sortByList";
import ManagementFilter, {
  type Filter,
} from "@/components/ui/managementFilter/ManagementFilter";
import ApproveListingFilter from "./components/ApproveListingFilter";

function ApproveListings() {
  const [approveListings, setApproveListings] = useState<Apartment[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inspectionForm, setInspectionForm] = useState(false);
  const [filter, setFilter] = useState<Filter>({
    search: "",
    sortOrder: "asc",
    sortBy: listingSortByList[0]?.value || "",
  });
  const [inspectionStatus, setInspectionStatus] = useState<string>("all");

  const fetchApproveListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apartmentManagementApi.getApproveListings({
        page,
        pageSize: 10,
        search: filter.search,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        inspectionStatus: inspectionStatus === "all" ? "" : inspectionStatus,
      });
      setApproveListings(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, inspectionStatus]);

  const handleApprove = async (data: ListingApproveFormData) => {
    try {
      await apartmentManagementApi.approveListing(selectedListingId, data);
      setSelectedListingId("");
      toast.success("Listing approved successfully");
      fetchApproveListings();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to approve listing");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApproveListings();
  }, [fetchApproveListings]);

  const handleAssign = async (data: AssignInspectionFormData) => {
    try {
      await inspectionApi.assignInspection(data);
      toast.success("Assign successfully");
      setInspectionForm(false);
    } catch (error) {
      toast.error("Fail");
    }
  };

  const triggerApprove = async (id: string) => {
    setSelectedListingId(id);
    setIsOpen(true);
  };

  const triggerAssignInspection = async (id: string) => {
    setSelectedListingId(id);
    setInspectionForm(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setFilter({
      search: "",
      sortOrder: "asc",
      sortBy: listingSortByList[0]?.value || "",
    });
    setInspectionStatus("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Approve Listings
              </h1>
              <p className="text-gray-600 mt-1">
                Review and approve new property listings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filter}
              setFilter={setFilter}
              sortByList={listingSortByList}
            />
            <ApproveListingFilter
              setStatus={setInspectionStatus}
              status={inspectionStatus}
              statusList={inspectionStatusList}
            />
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Pending Approvals ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              data={approveListings}
              limit={10}
              loading={loading}
              onPageChange={handlePageChange}
              columns={ListingColumns(triggerApprove, triggerAssignInspection)}
              page={page}
              total={totalCount}
            />
          </CardContent>
        </Card>
      </div>

      {/* Listing Approve Form Modal */}
      <ListingApproveForm
        apartmentId={selectedListingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleApprove}
      />

      {/* Assign Inspection Form Modal */}
      <AssignInspectionForm
        apartmentId={selectedListingId}
        isOpen={inspectionForm}
        onClose={() => setInspectionForm(false)}
        onSubmit={handleAssign}
      />
    </div>
  );
}

export default ApproveListings;
