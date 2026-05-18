import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import ManagementFilter, { type Filter } from "@/components/ui/managementFilter/ManagementFilter";
import {
  adminOccupyApi,
  userManagementApi,
} from "@/services/privateApi/adminApi";
import type { Occupy } from "@/types/occupy";
import { MessageSquareWarning } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OccupyColumns } from "./components/OccupyColumns";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import type { Apartment } from "@/types/apartment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import type { UserProfile } from "@/types/user";
import UserDetailDialog from "@/components/ui/userDetailDialog/UserDetailDialog";
import { occupySortByList } from "@/constants/sortByList";

function OccupiedManagement() {
  const [occupies, setOccupies] = useState<Occupy[]>([]);
  const [apartment, setApartment] = useState<Apartment | undefined>();
  const [user, setUser] = useState<UserProfile | undefined>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [apartmentDialogOpen, setApartmentDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchOccupies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminOccupyApi.getAllOccupies({
        page,
        pageSize: 10,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setOccupies(response.data.data);
      setTotal(response.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching occupies:", error);
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
      console.log(res.data);
      
      setUser(res.data);
      setUserDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOccupies();
  }, [fetchOccupies]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquareWarning className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Occupied Incident Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and respond to occupied incidents
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
              sortByList={occupySortByList}
            />
            
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Occupied Incidents ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={OccupyColumns(handleGetApartment, handleGetUser)}
              data={occupies}
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
          setApartment(undefined);
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
          setUser(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{user?.fullName || "User"}</DialogTitle>
          </DialogHeader>
          {user && <UserDetailDialog user={user} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OccupiedManagement;
