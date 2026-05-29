import { outstandingFee } from "@/services/privateApi/tenantApi";
import { useAuthStore } from "@/store/authStore";
import type { OutstandingFee } from "@/types/outstandingFee";
import { AlertCircle, ClockAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OutstandingFeeCard from "./components/OutstandingFeeCard";
import OutstandingFeeSummary from "./components/OutstandingFeeSummary";
import { Card, CardContent } from "@/components/ui/card";

function OutstandingFees() {
  const { t } = useTranslation("outstandingFee");
  const { user } = useAuthStore();
  const userId = user?.id;
  const [fees, setFees] = useState<OutstandingFee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    totalOutstandingFees: 0,
    totalOutstandingCount: 0,
    overdueCount: 0,
    disputedCount: 0,
  });

  const fetchOutstandingFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await outstandingFee.getMyFee(userId!);
      const data = response.data.data;
      setFees(data.outstandingFees);
      setSummary({
        totalOutstandingFees: data.totalOutstandingFees,
        totalOutstandingCount: data.totalOutstandingCount,
        overdueCount: data.overdueCount,
        disputedCount: data.disputedCount,
      });
    } catch (err) {
      console.error("Failed to fetch outstanding fees:", err);
      setError("Failed to load outstanding fees");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOutstandingFees();
    }
  }, [fetchOutstandingFees, userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <ClockAlert className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t("fee.title")}</h1>
        </div>
        <p className="text-gray-600">{t("fee.description")}</p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {/* Summary Skeleton */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>

            {/* Card Skeleton */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse h-64 mb-4"
              ></div>
            ))}
          </div>
        ) : fees.length > 0 ? (
          <>
            {/* Summary */}
            <div className="mb-8">
              <OutstandingFeeSummary data={summary} />
            </div>

            {/* Fee Cards */}
            <div className="space-y-4">
              {fees.map((fee) => (
                <OutstandingFeeCard key={fee.bookingId} data={fee} />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-50 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("fee.noFees")}
              </h2>
              <p className="text-gray-600 mb-6">{t("fee.subNoFees")}</p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {t("fee.browseApartments")}
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default OutstandingFees;
