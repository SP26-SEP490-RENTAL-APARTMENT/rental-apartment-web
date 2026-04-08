import type { Document } from "@/types/document";
import type { ColumnDef } from "@tanstack/react-table";
import DocumentAction from "./DocumentAction";
import { Button } from "@/components/ui/button";

export const DocumentColumns = (
  onApprove: (id: string) => void,
  onViewUser: (id: string) => void,
): ColumnDef<Document>[] => [
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => {
      const userId = row.original.userId;
      return (
        <Button
          variant="secondary"
          className="max-w-20 truncate cursor-pointer"
          onClick={() => onViewUser(userId)}
        >
          {userId}
        </Button>
      );
    },
  },
  {
    accessorKey: "verificationStatus",
    header: "Verification Status",
  },
  {
    accessorKey: "verifiedAt",
    header: "Verified At",
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <DocumentAction document={document} onApprove={onApprove} />
      );
    },
  },
];