import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import { paymentHistoryApi } from "@/services/privateApi/landlordApi";
import type { PaymentHistory } from "@/types/paymentHistory";
import { CreditCard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PaymentColumns } from "./Components/PaymentColumns";
import type { Filter } from "@/components/ui/managementFilter/ManagementFilter";
import ManagementFilter from "@/components/ui/managementFilter/ManagementFilter";
import { Button } from "@/components/ui/button";
import {
  paymentMethodList,
  paymentPurposeList,
  paymentSortByList,
  paymentStatusList,
} from "@/constants/sortByList";
import PaymentFilter from "./Components/PaymentFilter";

function PaymentHistories() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Filter>({
    search: "",
    sortBy: "paidAt",
    sortOrder: "desc",
  });
  const [addFilters, setAddFilters] = useState({
    method: "",
    status: "",
    paymentPurpose: "",
  });

  const fetchPaymentHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paymentHistoryApi.getPaymentHistory({
        page,
        pageSize: 10,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: addFilters.status === "all" ? "" : addFilters.status,
        method: addFilters.method === "all" ? "" : addFilters.method,
        paymentPurpose:
          addFilters.paymentPurpose === "all" ? "" : addFilters.paymentPurpose,
      });
      setPaymentHistory(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, addFilters]);
  useEffect(() => {
    fetchPaymentHistory();
  }, [fetchPaymentHistory]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      sortBy: "paidAt",
      sortOrder: "desc",
    });
    setAddFilters({
      method: "all",
      status: "all",
      paymentPurpose: "all",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage payment transactions
              </p>
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
              sortByList={paymentSortByList}
            />
            <PaymentFilter
              addFilters={addFilters}
              setAddFilters={setAddFilters}
              methodList={paymentMethodList}
              statusList={paymentStatusList}
              paymentPurposeList={paymentPurposeList}
            />
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Payment histories ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={PaymentColumns()}
              data={paymentHistory}
              limit={10}
              loading={loading}
              total={totalCount}
              page={page}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentHistories;
