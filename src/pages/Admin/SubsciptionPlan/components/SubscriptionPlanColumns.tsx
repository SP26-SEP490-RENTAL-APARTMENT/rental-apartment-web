import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import type { ColumnDef } from "@tanstack/react-table";
import SubscriptionPlanAction from "./SubscriptionPlanAction";

export const SubscriptionPlanColumns = (
  onDelete: (planId: string) => void,
  onEdit: (subscriptionPlan: SubscriptionPlan) => void,
): ColumnDef<SubscriptionPlan>[] => {

  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "priceMonthly",
      header: "Monthly Price",
      cell: ({ row }) => {
        const priceMonthly = row.original.priceMonthly;
        return priceMonthly ? priceMonthly.toLocaleString('vi-VN') : "N/A";
      }
    },
    {
      accessorKey: "priceAnnual",
      header: "Annual Price",
      cell: ({ row }) => {
        const priceAnnual = row.original.priceAnnual;
        return priceAnnual ? priceAnnual.toLocaleString('vi-VN') : "N/A";
      }
    },
    {
      accessorKey: "maxApartments",
      header: "Max Apartments",
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
      header: "Actions",
      cell: ({ row }) => {
        const subscriptionPlan = row.original;
        return <SubscriptionPlanAction subscriptionPlan={subscriptionPlan} onDelete={onDelete} onEdit={onEdit} />;
      },
    },
  ];
};
