import { Badge } from "@/components/ui/badge";
import { PAYMENT_TYPE_CONFIG } from "@/config/badge-config";
import type { PaymentHistory } from "@/types/paymentHistory";
import { renderBadge } from "@/utils/renderBadge";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

export const PaymentColumns = (): ColumnDef<PaymentHistory>[] => {
  const { t } = useTranslation("landlord");
  const { t: statusT } = useTranslation("status");

  const formatPaymentPurpose = (purpose: string) => {
    switch (purpose) {
      case "booking_full_payment":
        return t("payment.fullBooking");
      case "booking_deposit":
        return t("payment.depositBooking");
      case "refund_booking":
        return t("payment.refundBooking");
      case "booking_balance":
        return t("payment.balanceBooking");
      default:
        return t("payment.other");
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "momo_wallet":
        return <Badge className="bg-gray-500 text-white">Momo Wallet</Badge>;
      case "stripe":
        return <Badge className="bg-blue-500 text-white">Stripe</Badge>;
      case "payos":
        return <Badge className="bg-green-500 text-white">PayOS</Badge>;
      case "landlord_wallet_penalty":
        return (
          <Badge className="bg-red-500 text-white">
            {t("payment.penalty")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500 text-white">
            {statusT("payment.pending")}
          </Badge>
        );

      case "success":
        return (
          <Badge className="bg-blue-500 text-white">
            {statusT("payment.success")}
          </Badge>
        );

      case "failed":
        return (
          <Badge className="bg-gray-500 text-white">
            {statusT("payment.failed")}
          </Badge>
        );

      case "refunded":
        return (
          <Badge className="bg-black text-white">
            {statusT("payment.refunded")}
          </Badge>
        );

      default:
        return <Badge variant="secondary">{statusT("payment.unknown")}</Badge>;
    }
  };
  return [
    {
      accessorKey: "paymentPurpose",
      header: t("payment.purpose"),
      cell: ({ row }) => {
        return formatPaymentPurpose(row.original.paymentPurpose);
      },
    },
    {
      accessorKey: "paymentType",
      header: t("payment.type"),
      cell: ({ row }) => {
        const type = row.original.paymentType;
        return renderBadge(type, PAYMENT_TYPE_CONFIG, t);
      },
    },

    {
      accessorKey: "method",
      header: t("payment.method"),
      cell: ({ row }) => {
        const method = row.original.method;
        return formatPaymentMethod(method);
      },
    },
    {
      accessorKey: "status",
      header: t("payment.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return getStatusBadge(status);
      },
    },
    {
      accessorKey: "paidAt",
      header: t("payment.paidAt"),
      cell: ({ row }) => {
        const paidAt = row.original.paidAt;
        return new Date(paidAt).toLocaleString();
      },
    },
    {
      accessorKey: "amount",
      header: t("payment.amount"),
      cell: ({ row }) => `${row.original.amount.toLocaleString()} đ`,
    },
  ];
};
