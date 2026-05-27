import { tenantPaymentApi } from "@/services/privateApi/tenantApi";
import type { PaymentHistory } from "@/types/paymentHistory";
import { AlertCircle, CreditCard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PaymentCard from "./components/PaymentCard";
import PaginationComponent from "@/components/ui/paginationComponent/PaginationComponent";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

function Payment() {
  const { t } = useTranslation("paymentHistory");
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tenantPaymentApi.getPaymentHistory({
        page,
        pageSize: 10,
        sortBy: "paidAt",
        sortOrder: "desc",
      });
      setPayments(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPage = Math.ceil(totalCount / 10);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("payment.title")}
            </h1>
          </div>
          <p className="text-gray-600">{t("payment.description")}</p>
        </div>

        {payments.length > 0 ? (
          <>
            <div className="space-y-4 mb-10">
              {loading ? (
                <div>Loading...</div>
              ) : (
                payments &&
                payments.map((payment) => (
                  <PaymentCard key={payment.paymentId} payment={payment} />
                ))
              )}
            </div>

            {totalPage > 1 && (
              <div className="flex justify-center">
                <PaginationComponent
                  page={page}
                  totalPages={totalPage}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("payment.noPayment")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("payment.subNoPayment")}
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {t("payment.browseApartments")}
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Payment;
