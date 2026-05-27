import { PAYOUT_STATUS_CONFIG } from "@/config/badge-config";
import type { LandlordPayout } from "@/types/landlordWallet";
import { renderBadge } from "@/utils/renderBadge";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

export const PayoutColumns = (): ColumnDef<LandlordPayout>[] => {
  const { t } = useTranslation("landlord");
  return [
    {
      accessorKey: "amount",
      header: t("payout.amount"),
      cell: ({ row }) => {
        return row.original.amount.toLocaleString() + " đ";
      },
    },
    {
      accessorKey: "status",
      header: t("payout.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return renderBadge(status, PAYOUT_STATUS_CONFIG, t);
      },
    },
    {
      accessorKey: "message",
      header: t("payout.message"),
    },
    {
      accessorKey: "createdAt",
      header: t("payout.date"),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      },
    },
  ];
};
