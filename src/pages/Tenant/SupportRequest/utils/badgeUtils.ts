// Badge color and label mappings for support tickets

export const categoryConfig = {
  booking_issue: {
    label: "Booking Issue",
    variant: "default" as const,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  payment_problem: {
    label: "Payment Problem",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  listing_problem: {
    label: "Listing Problem",
    variant: "secondary" as const,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  account_verification: {
    label: "Account Verification",
    variant: "outline" as const,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  cancellation: {
    label: "Cancellation",
    variant: "secondary" as const,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  dispute: {
    label: "Dispute",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  property_quality: {
    label: "Property Quality",
    variant: "default" as const,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  other: {
    label: "Other",
    variant: "outline" as const,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export const priorityConfig = {
  low: {
    label: "Low",
    variant: "secondary" as const,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  medium: {
    label: "Medium",
    variant: "default" as const,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  high: {
    label: "High",
    variant: "destructive" as const,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  urgent: {
    label: "Urgent",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
  },
};

export const statusConfig = {
  open: {
    label: "Open",
    variant: "default" as const,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "CircleDot",
  },
  in_progress: {
    label: "In Progress",
    variant: "default" as const,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "Clock",
  },
  resolved: {
    label: "Resolved",
    variant: "secondary" as const,
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle2",
  },
  closed: {
    label: "Closed",
    variant: "outline" as const,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "X",
  },
  escalated: {
    label: "Escalated",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "AlertCircle",
  },
};
