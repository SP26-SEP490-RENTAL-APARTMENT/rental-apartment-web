import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import { priceChangeApi } from "@/services/privateApi/landlordApi";
import type { SmartPricing } from "@/types/smartPricing";
import { BadgePercent } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SmartPricingColumns } from "./components/SmartPricingColumns";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import type { Apartment } from "@/types/apartment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";

function SmartPricingHistory() {
  const [smartPricing, setSmartPricing] = useState<SmartPricing[]>([]);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters] = useState<Filter>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchSmartPricingHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await priceChangeApi.getSmartPricingHistory({
        page,
        pageSize: 10,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setSmartPricing(response.data.data.items);
      setTotal(response.data.data.totalCount);
    } catch (error) {
      console.error("Error fetching smart pricing history:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchApartmentDetails = async (id: string) => {
    try {
      const response = await apartmentApi.getApartmentById(id);
      setApartment(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSmartPricingHistory();
  }, [fetchSmartPricingHistory]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BadgePercent className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Smart Pricing History
                </h1>
                <p className="text-gray-600 mt-1">
                  Review your past smart pricing suggestions and their outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-3 items-center">
            <ManagementFilter
              filter={filters}
              setFilter={setFilters}
              sortByList={PayoutSortByList()}
            />

            <Button variant="outline" onClick={handleResetFilters}>
              {t("payout.resetFilters")}
            </Button>
          </CardContent>
        </Card> */}
        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Total ({total})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={SmartPricingColumns(fetchApartmentDetails)}
              data={smartPricing}
              limit={10}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={total}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!apartment} onOpenChange={() => setApartment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{apartment?.title || "Apartment"}</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SmartPricingHistory;
