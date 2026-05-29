
import {
  AlertTriangle,
  Calendar,
  Clock3,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OutstandingFee } from "@/types/outstandingFee";

interface Props {
  data: OutstandingFee;
}

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  due: {
    label: "Due",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  payment_submitted_pending_veri: {
    label: "Pending Verification",
    className:
      "bg-blue-100 text-blue-700 border-blue-200",
  },
  settled: {
    label: "Settled",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

export default function OutstandingFeeCard({ data }: Props) {
  const status =
    statusConfig[data.feeSettlementStatus] ||
    statusConfig.due;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              {data.apartmentAddress}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className={status.className}>
                {status.label}
              </Badge>

              {data.isOverdue && (
                <Badge className="border-red-200 bg-red-100 text-red-700">
                  Overdue
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Check-in:
              <span className="font-medium text-black">
                {new Date(
                  data.scheduledCheckIn
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Check-out:
              <span className="font-medium text-black">
                {new Date(
                  data.scheduledCheckOut
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Due:
              <span className="font-medium text-black">
                {new Date(data.feeDueAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {data.earlyCheckInFee > 0 && (
              <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm">
                Early Check-in Fee:
                <span className="ml-2 font-semibold text-blue-600">
                  {data.earlyCheckInFee.toLocaleString()} đ
                </span>
              </div>
            )}

            {data.lateCheckOutFee > 0 && (
              <div className="rounded-xl bg-orange-50 px-4 py-2 text-sm">
                Late Check-out Fee:
                <span className="ml-2 font-semibold text-orange-600">
                  {data.lateCheckOutFee.toLocaleString()} đ
                </span>
              </div>
            )}
          </div>

          {data.tenantDisputeReason && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4" />

              <div>
                <p className="font-medium">
                  Tenant Dispute
                </p>

                <p>{data.tenantDisputeReason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-[220px] rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Total Fee
          </div>

          <h2 className="mt-2 text-3xl font-bold">
            {data.totalFee.toLocaleString()} đ
          </h2>

          <div className="mt-4 flex flex-col gap-2">
            <Button className="w-full">
              Pay Now
            </Button>

            <Button
              variant="outline"
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}