import { useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface QuoteData {
  basePricePerNight: number;
  baseAmount: number;
  packageAmount: number;
  totalPrice: number;
  nights: number;
}

interface PricingSectionProps {
  quoteData: QuoteData;
}

const PriceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default function PricingSection({ quoteData }: PricingSectionProps) {
  const { t } = useTranslation("book");

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 border-b border-green-200">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
          {t("confirm.price.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <PriceRow
            label={t("confirm.price.nightlyRate")}
            value={`${quoteData.basePricePerNight.toLocaleString("vi-VN")} đ`}
          />
          <PriceRow
            label={`${t("confirm.price.baseAmount")} (${quoteData.nights} ${t(
              "confirm.price.nights"
            )})`}
            value={`${quoteData.baseAmount.toLocaleString("vi-VN")} đ`}
          />
          {quoteData.packageAmount > 0 && (
            <PriceRow
              label={t("confirm.price.package")}
              value={`${quoteData.packageAmount.toLocaleString("vi-VN")} đ`}
            />
          )}

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between items-center py-3 bg-green-50 px-3 rounded-lg">
            <span className="font-semibold text-gray-900">
              {t("confirm.price.total")}
            </span>
            <span className="text-xl font-bold text-green-600">
              {quoteData.totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
