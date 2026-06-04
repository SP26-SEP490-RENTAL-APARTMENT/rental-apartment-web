import type { Catalog } from "@/types/catalog";
import type { ColumnDef } from "@tanstack/react-table";
import DashboardAction from "./DashboardAction";

export const DashboardColumns = (
  onRunReport: (report: Catalog) => void,
  onEdit: (report: Catalog) => void,
  onDelete: (report: Catalog) => void,
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
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          Active
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
          Inactive
        </span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const catalog = row.original;
      return (
        <DashboardAction catalog={catalog} onRunReport={onRunReport} onEdit={onEdit} onDelete={onDelete} />
      );
    },
  },
];
