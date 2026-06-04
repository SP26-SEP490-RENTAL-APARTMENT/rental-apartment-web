import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AvailablePolicy } from "@/types/pricingTemplate";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Tag,
  Settings,
} from "lucide-react";
interface Props {
  open: boolean;
  onClose: () => void;
  template: AvailablePolicy | null;
}
function ViewAvailablePolicy({ open, onClose, template }: Props) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold">
            Pricing Policy Overview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Base price - Enhanced */}
          <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute -right-8 -top-8 opacity-10">
              <DollarSign className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <DollarSign size={20} />
                </div>
                <p className="text-sm font-medium text-blue-100">
                  Apartment Base Price
                </p>
              </div>
              <p className="text-4xl font-bold">
                {formatCurrency(template?.apartmentBasePrice || 0)}
              </p>
            </div>
          </div>

          {/* policies */}
          <div className="space-y-4">
            {template?.templates?.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-8 flex flex-col items-center justify-center">
                  <Tag className="w-10 h-10 text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">
                    No pricing policies available
                  </p>
                </CardContent>
              </Card>
            ) : (
              template?.templates?.map((item: any, index: number) => (
                <Card
                  key={item.templateId}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground ml-11">
                          {item.description}
                        </p>
                      </div>

                      <Badge
                        variant={item.isActive ? "default" : "secondary"}
                        className="whitespace-nowrap"
                      >
                        {item.isActive ? "🟢 Active" : "⚫ Inactive"}
                      </Badge>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-3">
                      {/* Date Range */}
                      <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-900 mb-2">
                          <CalendarDays size={16} className="text-orange-600" />
                          Date Range
                        </div>
                        <p className="font-bold text-orange-700">
                          {item.startDate}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          to {item.endDate}
                        </p>
                      </div>

                      {/* Multiplier */}
                      <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-900 mb-2">
                          <TrendingUp size={16} className="text-purple-600" />
                          Price Multiplier
                        </div>
                        <p className="font-bold text-purple-700 text-xl">
                          x{item.previewMultiplier}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Adjustment factor
                        </p>
                      </div>

                      {/* Final Price */}
                      <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-sm font-medium text-green-900 mb-2">
                          <DollarSign size={16} className="text-green-600" />
                          Final Price/Night
                        </div>
                        <p className="font-bold text-green-700 text-lg">
                          {formatCurrency(item.previewPricePerNight)}
                        </p>
                      </div>
                    </div>

                    {/* parameters */}
                    {item.parameters && item.parameters.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Settings
                            size={18}
                            className="text-muted-foreground"
                          />
                          <p className="font-semibold">
                            Configuration Parameters
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          {item.parameters.map((param: any) => (
                            <div
                              key={param.parameterId}
                              className="rounded-lg border bg-gradient-to-r from-slate-50 to-slate-100/50 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">
                                    {param.displayName}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono mt-1">
                                    {param.parameterKey}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="font-bold text-blue-600 text-lg">
                                    {param.defaultValue}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-200/50">
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium">Range:</span>{" "}
                                  {param.minValue} − {param.maxValue}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewAvailablePolicy;
