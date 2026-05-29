import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { WalletPenalty } from "@/types/outstandingFee";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Receipt,
  User,
  Wallet,
} from "lucide-react";

interface Props {
  payment: WalletPenalty;
}

export default function WalletPenaltyCard({ payment }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const formatDate = (date: string) => new Date(date).toLocaleString("vi-VN");

  const getStatusBadge = () => {
    switch (payment.status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const isRefund = payment.paymentType === "refund";

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition py-0">
      <CardContent className="p-5 space-y-4">
        {/* header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isRefund
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isRefund ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : (
                <ArrowUpRight className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {isRefund ? "Refund" : "Penalty"}
              </p>
              <h3 className="font-bold text-lg">
                {formatCurrency(payment.amount)}
              </h3>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* tenant */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span>{payment.tenantName}</span>
        </div>

        {/* apartment */}
        <div className="flex items-start gap-2 text-sm">
          <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <span>{payment.apartmentAddress}</span>
        </div>

        {/* info */}
        <div className="grid grid-cols-2 gap-4 text-sm border rounded-xl p-3 bg-muted/30">
          <div>
            <p className="text-muted-foreground">Purpose</p>
            <p className="font-medium capitalize">{payment.paymentPurpose}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Method</p>
            <p className="font-medium">Wallet Penalty</p>
          </div>
        </div>

        {/* transaction */}
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{payment.transactionId}</span>
          </div>

          <div className="flex gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(payment.paidAt)}</span>
          </div>

          <div className="flex gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span>{payment.method}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
