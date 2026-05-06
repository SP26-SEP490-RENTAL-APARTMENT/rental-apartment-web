import type { SupportTicket } from "@/types/supportTicket";
import type { ColumnDef } from "@tanstack/react-table";
import SupportAction from "./SupportAction";
import { Button } from "@/components/ui/button";

// const getInspectionStatusBadge = (inspectionStatus: string) => {
//   switch (inspectionStatus) {
//     case "scheduled":
//       return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
//     case "in_progress":
//       return <Badge className="bg-green-500 text-white">In progress</Badge>;
//     case "pending":
//       return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
//     case "passed":
//       return <Badge className="bg-gray-500 text-white">Passed</Badge>;
//     default:
//       return <Badge variant="secondary">Not scheduled</Badge>;
//   }
// };

export const SupportColumns = (): ColumnDef<SupportTicket>[] => [
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => {
      const userId = row.original.userId;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
        >
          {userId}
        </Button>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status;
    },
  },
  {
    accessorKey: "resolvedAt",
    header: "Resolved At",
    cell: ({ row }) => {
      const resolvedAt = row.original.resolvedAt;
      return resolvedAt ? new Date(resolvedAt).toLocaleString() : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const support = row.original;
      return <SupportAction support={support} />;
    },
  },
];
