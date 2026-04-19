import type { Catalog } from "@/types/catalog";
import type { ColumnDef } from "@tanstack/react-table";
import DashboardAction from "./DashboardAction";

export const DashboardColumns = (
  onRunReport: (report: Catalog) => void
): ColumnDef<Catalog>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const catalog = row.original;
      return (
        <DashboardAction catalog={catalog} onRunReport={onRunReport} />
      );
    },
  },
];
