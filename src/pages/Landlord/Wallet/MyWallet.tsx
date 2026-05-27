import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/dataTable/DataTable";
import ManagementFilter, {
  type Filter,
} from "@/components/ui/managementFilter/ManagementFilter";
import { myWalletApi } from "@/services/privateApi/landlordApi";
import type { LandlordPayout, LandlordWallet } from "@/types/landlordWallet";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { PayoutColumns } from "./components/PayoutColumns";
import { PayoutSortByList } from "@/constants/sortByList";
import WalletCard from "./components/WalletCard";
import WithdrawForm from "./components/WithdrawForm";
import { useTranslation } from "react-i18next";

function MyWallet() {
  const { t } = useTranslation("landlord");
  const [payout, setPayout] = useState<LandlordPayout[]>([]);
  const [wallet, setWallet] = useState<LandlordWallet | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const fetchWallet = async () => {
    try {
      const response = await myWalletApi.getMyWallet();
      setWallet(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const response = await myWalletApi.getPayoutHistory({
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page,
        pageSize: 10,
      });
      setPayout(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchPayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

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
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("payout.title")}
                </h1>
                <p className="text-gray-600 mt-1">{t("payout.subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <WalletCard wallet={wallet} onWithdraw={() => setWithdrawOpen(true)} />
        <Card className="border-0 shadow-sm">
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
        </Card>
        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              {t("payout.total")} ({total})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={PayoutColumns()}
              data={payout}
              limit={10}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={total}
            />
          </CardContent>
        </Card>
      </div>
      <WithdrawForm
        onClose={() => setWithdrawOpen(false)}
        open={withdrawOpen}
        refetchPayouts={fetchPayouts}
        refetchWallet={fetchWallet}
      />
    </div>
  );
}

export default MyWallet;
