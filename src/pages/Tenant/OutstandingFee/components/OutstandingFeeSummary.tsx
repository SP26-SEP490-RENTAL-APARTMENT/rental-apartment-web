
import {
  AlertCircle,
  Clock3,
  FileWarning,
  Wallet,
} from "lucide-react";

interface Props {
  data: {
    totalOutstandingFees: number;
    totalOutstandingCount: number;
    overdueCount: number;
    disputedCount: number;
  };
}

const summaryItems = [
  {
    key: "totalOutstandingFees",
    title: "Total Fees",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    key: "totalOutstandingCount",
    title: "Outstanding",
    icon: FileWarning,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    key: "overdueCount",
    title: "Overdue",
    icon: Clock3,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    key: "disputedCount",
    title: "Disputed",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
] as const;

export default function OutstandingFeeSummary({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        const value =
          item.key === "totalOutstandingFees"
            ? `${data[item.key].toLocaleString()} đ`
            : data[item.key];

        return (
          <div
            key={item.key}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}