import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarDays, TrendingUp } from "lucide-react";
import type { PriceChange } from "@/types/priceChange";

interface Props {
  open: boolean;
  onClose: () => void;
  priceChanges: PriceChange[];
}

const reasonConfig = {
  base: "bg-slate-100 text-slate-700",
  weekend: "bg-blue-100 text-blue-700",
  holiday: "bg-red-100 text-red-700",
  "peak season": "bg-orange-100 text-orange-700",
  "low season": "bg-green-100 text-green-700",
  "special event": "bg-purple-100 text-purple-700",
  "manual override": "bg-yellow-100 text-yellow-700",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

function PriceChangeDialog({ open, onClose, priceChanges }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Price Changes History
          </DialogTitle>
        </DialogHeader>

        {priceChanges.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No price changes recorded for this apartment.
          </div>
        ) : (
          <div className="max-h-125 space-y-4 overflow-y-auto pr-2">
            {priceChanges.map((change, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-blue-500 transition hover:shadow-md"
              >
                <CardContent className="p-5 space-y-4">
                  {/* top */}
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        reasonConfig[
                          change.reason as keyof typeof reasonConfig
                        ] || "bg-gray-100 text-gray-700"
                      }
                    >
                      {change.reason.charAt(0).toUpperCase() +
                        change.reason.slice(1)}
                    </Badge>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {change.startDate} → {change.endDate}
                    </div>
                  </div>

                  {/* price */}
                  <div className="flex items-center justify-center gap-4 rounded-lg bg-slate-50 p-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Old Price</p>
                      <p className="text-lg font-semibold text-slate-500 line-through">
                        {formatCurrency(change.oldPricePerNight)}
                      </p>
                    </div>

                    <ArrowRight className="h-5 w-5 text-blue-500" />

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">New Price</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(change.newPricePerNight)}
                      </p>
                    </div>
                  </div>

                  {/* diff */}
                  <div className="flex items-center justify-end gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span
                      className={
                        change.newPricePerNight > change.oldPricePerNight
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {change.newPricePerNight > change.oldPricePerNight
                        ? "+"
                        : ""}
                      {formatCurrency(
                        change.newPricePerNight - change.oldPricePerNight,
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PriceChangeDialog;
