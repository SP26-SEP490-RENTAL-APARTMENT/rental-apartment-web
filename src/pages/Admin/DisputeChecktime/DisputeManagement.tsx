import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import {
  disputeManagementApi,
  userManagementApi,
} from "@/services/privateApi/adminApi";
import type { Dispute } from "@/types/checkTime";
import { BadgeAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DisputeColumns } from "./components/DisputeColumn";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import type { Apartment } from "@/types/apartment";
import type { UserProfile } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import UserDetailDialog from "@/components/ui/userDetailDialog/UserDetailDialog";
import ResolveDialog from "./components/ResolveDialog";

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
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentDialogOpen, setApartmentDialogOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

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

  const handleGetApartment = async (id: string) => {
    try {
      const res = await apartmentApi.getApartmentById(id);
      setApartment(res.data.data);
      setApartmentDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUser = async (id: string) => {
    try {
      const res = await userManagementApi.getUserDetail(id);
      setUser(res.data);
      setUserDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const triggerResolveDispute = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setResolveDialogOpen(true);
  };

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
              columns={DisputeColumns(
                handleGetApartment,
                handleGetUser,
                triggerResolveDispute,
              )}
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

      <Dialog
        open={apartmentDialogOpen}
        onOpenChange={() => {
          setApartmentDialogOpen(false);
          setApartment(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{apartment?.title || "Apartment"}</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={userDialogOpen}
        onOpenChange={() => {
          setUserDialogOpen(false);
          setUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user?.fullName || "User"}</DialogTitle>
          </DialogHeader>
          {user && <UserDetailDialog user={user} />}
        </DialogContent>
      </Dialog>

      <ResolveDialog
        onClose={() => setResolveDialogOpen(false)}
        open={resolveDialogOpen}
        bookingId={selectedBookingId!}
        refetch={fetchDisputes}
      />
    </div>
  );
}

export default DisputeManagement;
