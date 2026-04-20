import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import type { ColumnDef } from "@tanstack/react-table";
import SubscriptionPlanAction from "./SubscriptionPlanAction";
import { useTranslation } from "react-i18next";

export const SubscriptionPlanColumns = (
  onDelete: (planId: string) => void,
  onEdit: (subscriptionPlan: SubscriptionPlan) => void,
): ColumnDef<SubscriptionPlan>[] => {
  const { t } = useTranslation("subscriptionPlan");
  const { t: commonTranslation } = useTranslation("common");

  return [
    {
      accessorKey: "name",
      header: t("subscriptionName") || "Name",
    },
    {
      accessorKey: "priceMonthly",
      header: t("subscriptionPriceMonthly") || "Monthly Price",
      cell: ({ row }) => {
        const priceMonthly = row.original.priceMonthly;
        return priceMonthly ? priceMonthly.toLocaleString('vi-VN') : "N/A";
      }
    },
    {
      accessorKey: "priceAnnual",
      header: t("subscriptionPriceAnnual") || "Annual Price",
      cell: ({ row }) => {
        const priceAnnual = row.original.priceAnnual;
        return priceAnnual ? priceAnnual.toLocaleString('vi-VN') : "N/A";
      }
    },
    {
      accessorKey: "maxApartments",
      header: t("maxApartments") || "Max Apartments",
    },
    // {
    //   accessorKey: "maxApartmentsPerApartment",
    //   header: t("maxApartmentsPerApartment") || "Max Apartments Per Apartment",
    // },
    // {
    //   accessorKey: "identityVerified",
    //   header: "Verified",
    //   cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    // },
    {
      id: "actions",
      header: commonTranslation("actions") || "Actions",
      cell: ({ row }) => {
        const subscriptionPlan = row.original;
        return <SubscriptionPlanAction subscriptionPlan={subscriptionPlan} onDelete={onDelete} onEdit={onEdit} />;
      },
    },
  ];
};
