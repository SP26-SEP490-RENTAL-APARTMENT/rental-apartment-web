import { Button } from "@/components/ui/button";
import { priceChangeApi } from "@/services/privateApi/landlordApi";
import type { SmartPricing } from "@/types/smartPricing";
import {
  CalendarDays,
  TrendingUp,
  Percent,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface SmartPricingProps {
  data: SmartPricing;
  onClose?: () => void;
}

export default function SmartPricingCard({ data, onClose }: SmartPricingProps) {
  const formatPrice = (value: number) => value.toLocaleString("vi-VN");

  console.log("SmartPricingCard received data:", data);

  // if (!data) {
  //   return (
  //     <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  //       <p className="text-slate-600">No data available</p>
  //     </div>
  //   );
  // }

  const handleAcceptPricing = async () => {
    try {
      await priceChangeApi.acceptSmartPricing(data.pricingId, {
        overridePrice: data.suggestedPrice,
      });
      onClose?.();
      toast.success("Smart pricing accepted successfully");
    } catch (error) {
      toast.error("Failed to accept smart pricing");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Smart Pricing Suggestion
              </h2>

              <p className="text-sm text-slate-500">
                Auto-generated pricing recommendation
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
            data.acceptedByLandlord
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {data.acceptedByLandlord ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Accepted
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              Pending
            </>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Base Price</p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            {formatPrice(data.basePrice)} đ
          </h3>
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-violet-700">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Suggested Price</span>
          </div>

          <h3 className="mt-2 text-3xl font-bold text-violet-700">
            {formatPrice(data.suggestedPrice)} đ
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Percent className="h-4 w-4" />
            <span className="text-sm font-medium">Multiplier</span>
          </div>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            x{data.multiplier}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarDays className="h-4 w-4" />

            <span className="font-medium">Pricing Period</span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {data.startDate} → {data.endDate}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingUp className="h-4 w-4" />

            <span className="font-medium">Occupancy Rate</span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {(data.occupancyRate * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Reason */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-semibold text-slate-800">Pricing Explanation</h4>

        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
          {data.reason}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>
          Created at: {new Date(data.createdAt).toLocaleString("vi-VN")}
        </span>

        <span>ID: {data.pricingId.slice(0, 8)}...</span>
      </div>

      {!data.acceptedByLandlord && (
        <div className="flex justify-end mt-5">
          <Button onClick={handleAcceptPricing}>Apply Pricing</Button>
        </div>
      )}
    </div>
  );
}
