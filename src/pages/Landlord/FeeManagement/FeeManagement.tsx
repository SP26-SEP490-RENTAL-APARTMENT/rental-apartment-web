import { feeManagementApi } from "@/services/privateApi/landlordApi";
import { BanknoteX, Wallet, AlertCircle, XCircle, Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SummaryCard from "./components/SummaryCard";
import type { OutstandingFee, WalletPenalty } from "@/types/outstandingFee";
import FeeManagementTabs from "./components/FeeManagementTabs";
import { useTranslation } from "react-i18next";

function FeeManagement() {
  const { t } = useTranslation("landlord");
  const [summary, setSummary] = useState({
    outStandingFee: 0,
    totalOutStandingFee: 0,
    walletPenalty: 0,
    totalWalletPenalty: 0,
    totalTenant: 0,
    totalOverdue: 0,
    totalDisputed: 0,
  });
  const [outstandingFees, setOutstandingFees] = useState<OutstandingFee[]>([]);
  const [walletPenalties, setWalletPenalties] = useState<WalletPenalty[]>([]);

  const fetchAllFees = useCallback(async () => {
    try {
      const response = await feeManagementApi.getAllFees();
      const data = response.data.data;
      setSummary({
        outStandingFee: data.totalOutstandingFees,
        totalOutStandingFee: data.totalOutstandingCount,
        walletPenalty: data.walletPenaltyTotalAmount,
        totalWalletPenalty: data.walletPenaltyCount,
        totalTenant: data.uniqueTenantCount,
        totalOverdue: data.overdueCount,
        totalDisputed: data.disputedCount,
      });
      setOutstandingFees(data.outstandingFees);
      setWalletPenalties(data.walletPenaltyTransactions);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllFees();
  }, [fetchAllFees]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BanknoteX className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("fee.title")}
              </h1>
              <p className="text-gray-600 mt-1">{t("fee.description")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={Wallet}
            title={t("fee.outstandingFees")}
            value={summary.outStandingFee.toLocaleString() + " đ"}
            subtitle={"Total: " + summary.totalOutStandingFee}
            color="blue"
          />
          <SummaryCard
            icon={AlertCircle}
            title={t("fee.walletPenalties")}
            value={summary.walletPenalty.toLocaleString() + " đ"}
            subtitle={"Total: " + summary.totalWalletPenalty}
            color="yellow"
          />
          <SummaryCard
            icon={Clock}
            title={t("fee.totalOverdue")}
            value={summary.totalOverdue.toString()}
            subtitle={t("fee.overdue")}
            color="red"
          />
          <SummaryCard
            icon={XCircle}
            title={t("fee.totalDisputed")}
            value={summary.totalDisputed.toString()}
            subtitle={t("fee.disputed")}
            color="red"
          />
        </div>
      </div>

      {/* Fee Management Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <FeeManagementTabs
          outstandingFees={outstandingFees}
          walletPenalties={walletPenalties}
        />
      </div>
    </div>
  );
}

export default FeeManagement;
