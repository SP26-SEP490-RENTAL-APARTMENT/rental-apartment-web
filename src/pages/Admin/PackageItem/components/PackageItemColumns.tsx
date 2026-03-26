import type { PackageItem } from "@/types/package";
import type { ColumnDef } from "@tanstack/react-table";
import PackageItemAction from "./PackageItemAction";

export const packageItemColumns = (
  onDelete: (packageItemId: string) => void,
  onEdit: (packageItem: PackageItem) => void,
): ColumnDef<PackageItem>[] => [
  {
    accessorKey: "itemName",
    header: "Name",
  },
  {
    accessorKey: "itemDescription",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "estimatedValue",
    header: "Estimated Value",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const packageItem = row.original;
      return <PackageItemAction packageItem={packageItem} onDelete={onDelete} onEdit={onEdit}  />
    },
  },
];