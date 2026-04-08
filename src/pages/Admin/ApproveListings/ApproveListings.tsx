import DataTable from "@/components/ui/dataTable/DataTable";
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import type { Apartment } from "@/types/apartment";
import { useCallback, useEffect, useState } from "react";
import { ListingColumns } from "./components/ListingColumns";
import type { ListingApproveFormData } from "@/schemas/listingApproveSchema";
import { toast } from "sonner";
import ListingApproveForm from "./components/ListingApproveForm";

function ApproveListings() {
  const [approveListings, setApproveListings] = useState<Apartment[]>([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchApproveListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apartmentManagementApi.getApproveListings({
        page,
        pageSize: 5,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setApproveListings(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleApprove = async (data: ListingApproveFormData) => {
    try {
      await apartmentManagementApi.approveListing(selectedListingId, data);
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

  const triggerApprove = async (id: string) => {
    setSelectedListingId(id);
    setIsOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div>
      <DataTable
        data={approveListings}
        limit={5}
        loading={loading}
        onPageChange={handlePageChange}
        columns={ListingColumns(triggerApprove)}
        page={page}
        total={totalCount}
      />

      <ListingApproveForm
        apartmentId={selectedListingId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleApprove}
      />
    </div>
  );
}

export default ApproveListings;
