import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PaymentHistory } from "@/types/paymentHistory";
import { CheckCircle, Clock, CreditCard, Wallet, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const getStatus = (status: PaymentHistory["status"]) => {
  switch (status) {
    case "success":
      return {
        label: "Success",
        icon: <CheckCircle className="w-4 h-4" />,
        className: "bg-green-100 text-green-600",
      };
    case "pending":
      return {
        label: "Pending",
        icon: <Clock className="w-4 h-4" />,
        className: "bg-yellow-100 text-yellow-600",
      };
    case "failed":
      return {
        label: "Failed",
        icon: <XCircle className="w-4 h-4" />,
        className: "bg-red-100 text-red-600",
      };
    default:
      return {
        label: "Unknown",
        icon: null,
        className: "",
      };
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case "stripe":
      return {
        icon: <CreditCard className="w-5 h-5 text-blue-500" />,
        label: "Stripe",
      };

    case "momo_wallet":
      return {
        icon: <Wallet className="w-5 h-5 text-pink-500" />,
        label: "MoMo",
      };

    default:
      return {
        icon: <Wallet className="w-5 h-5 text-gray-400" />,
        label: "Other",
      };
  }
};

function PaymentCard({ payment }: { payment: PaymentHistory }) {
  const { t } = useTranslation("paymentHistory");
  const status = getStatus(payment.status);
  const method = getMethodIcon(payment.method);

  const getPurpose = (purpose: string) => {
    switch (purpose) {
      case "booking_full_payment":
        return <Badge className="bg-blue-500">{t("payment.card.fullBooking")}</Badge>;
      case "booking_deposit":
        return (
          <Badge className="bg-red-500">{t("payment.card.depositBooking")}</Badge>
        );
      default:
        return <Badge variant="outline">{t("payment.card.other")}</Badge>;
    }
  };

  const getMode = (mode: string) => {
    switch (mode) {
      case "upfront":
        return <Badge className="bg-blue-500">{t("payment.card.upfront")}</Badge>;
      case "deposit":
        return (
          <Badge className="bg-red-500">{t("payment.card.deposit")}</Badge>
        );
      default:
        return <Badge variant="outline">{t("payment.card.other")}</Badge>;
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 bg-white overflow-hidden">
      <CardContent className="p-6">
        {/* Header: Status and Method */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200">
              {method.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {method.label}
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {payment.method === "stripe" ? "Credit Card" : "Digital Wallet"}
              </p>
            </div>
          </div>
          <Badge 
            className={`flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-full ${status.className}`}
          >
            {status.icon}
            <span>{status.label}</span>
          </Badge>
        </div>

        {/* Middle: Amount and Purpose */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-slate-900">
              {payment.amount.toLocaleString("vi-VN")}
            </span>
            <span className="text-lg font-semibold text-slate-600">đ</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {getPurpose(payment.paymentPurpose)}
            {getMode(payment.paymentType)}
          </div>
        </div>

        {/* Footer: Date and Transaction ID */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-slate-500 font-medium">
              {payment.paidAt
                ? new Date(payment.paidAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Pending"}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Transaction ID: {payment.transactionId.slice(0, 12)}...
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 font-medium">Reference</p>
            <p className="text-slate-700 font-mono text-xs bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 mt-1">
              #{payment.transactionId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentCard;
