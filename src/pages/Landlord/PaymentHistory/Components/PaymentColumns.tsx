import { Badge } from "@/components/ui/badge";
import type { PaymentHistory } from "@/types/paymentHistory";
import type { ColumnDef } from "@tanstack/react-table";

const getStatusBadge = (status?: string | null) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500 text-white">Pending</Badge>;

    case "success":
      return <Badge className="bg-blue-500 text-white">Success</Badge>;

    case "failed":
      return <Badge className="bg-gray-500 text-white">Failed</Badge>;

    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const formatPaymentMethod = (method: string) => {
  switch (method) {
    case "momo_wallet":
      return "Momo";
    case "stripe":
      return "Stripe";
    default:
      return "Unknown";
  }
};

const formatPaymentPurpose = (purpose: string) => {
  switch (purpose) {
    case "booking_full_payment":
      return "Full payment";
    case "booking_deposit":
      return "Deposit payment";
    default:
      return "Unknown";
  }
};

export const PaymentColumns = (): ColumnDef<PaymentHistory>[] => [
  {
    accessorKey: "paymentPurpose",
    header: "Payment type",
    cell: ({ row }) => {
      return formatPaymentPurpose(row.original.paymentPurpose);
    },
  },
  {
    accessorKey: "method",
    header: "Payment method",
    cell: ({ row }) => {
      const method = row.original.method;
      return formatPaymentMethod(method);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid at",
    cell: ({ row }) => {
      const paidAt = row.original.paidAt;
      return new Date(paidAt).toLocaleString();
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `${row.original.amount.toLocaleString()} đ`,
  },
];
