import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PaymentHistory } from "@/types/paymentHistory";
import { CheckCircle, Clock, CreditCard, Wallet, XCircle } from "lucide-react";

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
  const status = getStatus(payment.status);
  const method = getMethodIcon(payment.method);

  return (
    <Card className="w-full hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="flex items-center justify-between p-4 gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-5 min-w-55">
          <div className="flex items-center gap-3 min-w-55">
  <div className="p-2 rounded-xl bg-muted">
    {method.icon}
  </div>

  <div>
    
    <p className="text-xs text-muted-foreground">
      {method.label}
    </p>
  </div>
</div>
          <div>
            <p className="font-semibold text-base text-blue-500">
              {payment.amount.toLocaleString("vi-VN")} đ
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {payment.paymentPurpose.replaceAll("_", " ")}
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex flex-col gap-1 text-sm flex-1">
          <span className="capitalize font-medium">{payment.method}</span>

          <span className="text-muted-foreground capitalize text-xs">
            {payment.paymentType}
          </span>

          <span className="text-xs text-gray-400">
            {payment.paidAt
              ? new Date(payment.paidAt).toLocaleDateString()
              : "Not paid yet"}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-2">
          <Badge className={`flex items-center gap-1 ${status.className}`}>
            {status.icon}
            {status.label}
          </Badge>

          <span className="text-xs text-gray-400">
            #{payment.transactionId.slice(0, 10)}...
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentCard;
