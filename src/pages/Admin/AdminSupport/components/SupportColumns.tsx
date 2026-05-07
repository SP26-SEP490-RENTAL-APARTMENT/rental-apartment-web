import type { SupportTicket } from "@/types/supportTicket";
import type { ColumnDef } from "@tanstack/react-table";
import SupportAction from "./SupportAction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "booking_issue":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Booking issue
        </Badge>
      );

    case "payment_problem":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Payment problem
        </Badge>
      );

    case "listing_problem":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          Listing problem
        </Badge>
      );

    case "account_verification":
      return (
        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">
          Account verification
        </Badge>
      );

    case "cancellation":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Cancellation
        </Badge>
      );

    case "dispute":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Dispute
        </Badge>
      );

    case "property_quality":
      return (
        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
          Property quality
        </Badge>
      );

    case "other":
      return <Badge variant="secondary">Other</Badge>;

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "low":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low</Badge>
      );

    case "medium":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Medium
        </Badge>
      );

    case "high":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          High
        </Badge>
      );

    case "urgent":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">Urgent</Badge>
      );

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Open
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          In progress
        </Badge>
      );

    case "resolved":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Resolved
        </Badge>
      );

    case "closed":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Closed
        </Badge>
      );

    case "escalated":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Escalated
        </Badge>
      );

    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const SupportColumns = (
  onResolve: (supportId: string) => void,
): ColumnDef<SupportTicket>[] => [
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
    cell: ({ row }) => {
      const category = row.original.category;
      return getCategoryBadge(category);
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.priority;
      return getPriorityBadge(priority);
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const support = row.original;
      return <SupportAction support={support} onResolve={onResolve} />;
    },
  },
];
