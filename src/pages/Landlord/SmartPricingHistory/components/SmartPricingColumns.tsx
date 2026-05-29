import { Button } from "@/components/ui/button";
import type { SmartPricing } from "@/types/smartPricing";
import type { ColumnDef } from "@tanstack/react-table";
import SmartPricingActions from "./SmartPricingActions";

export const SmartPricingColumns = (): ColumnDef<SmartPricing>[] => {
  return [
    {
      accessorKey: "apartmentId",
      header: "Apartment",
      cell: ({ row }) => {
        const apartmentId = row.original.apartmentId;
        return (
          <Button
            variant="secondary"
            className="max-w-20 truncate cursor-pointer"
          >
            {apartmentId}
          </Button>
        );
      },
    },
    {
      accessorKey: "basePrice",
      header: "Base Price",
      cell: ({ row }) => {
        const basePrice = row.original.basePrice;
        return basePrice.toLocaleString() + " đ";
      },
    },
    {
      accessorKey: "suggestedPrice",
      header: "Suggested Price",
      cell: ({ row }) => {
        const suggestedPrice = row.original.suggestedPrice;
        return suggestedPrice.toLocaleString() + " đ";
      },
    },
    {
      accessorKey: "acceptedByLandlord",
      header: "In Use",
      cell: ({ row }) => {
        const acceptedByLandlord = row.original.acceptedByLandlord;
        return acceptedByLandlord ? "Yes" : "No";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const smartPricing = row.original;
        return <SmartPricingActions smartPricing={smartPricing} />;
      },
    },
  ];
};
