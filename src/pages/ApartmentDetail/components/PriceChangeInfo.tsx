import { Badge } from "@/components/ui/badge";
import type { PriceChange } from "@/types/apartment";
import { useTranslation } from "react-i18next";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "₫";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

// map màu badge
const reasonVariant = (reason: PriceChange["reason"]) => {
  switch (reason) {
    case "holiday":
    case "special event":
      return "destructive"; // đỏ
    case "peak season":
      return "default"; // xanh
    case "weekend":
      return "secondary"; // xám
    case "low season":
      return "outline"; // nhẹ
    case "manual override":
      return "secondary";
    default:
      return "outline";
  }
};

export default function PriceChangeInfo({
  priceChange,
}: {
  priceChange: PriceChange;
}) {
  const { t } = useTranslation("status");
  const { t: tBook } = useTranslation("book");
  const { newPricePerNight, reason, startDate, endDate } = priceChange;

  const reasonLabel = (reason: PriceChange["reason"]) => {
    switch (reason) {
      case "peak season":
        return t("priceReason.peak");
      case "low season":
        return t("priceReason.low");
      case "special event":
        return t("priceReason.special");
      case "manual override":
        return t("priceReason.manual");
      case "other":
        return t("priceReason.other");
      default:
        return reason;
    }
  };

  return (
    <div className="flex items-center gap-5 text-sm px-3 py-2">
      {/* left */}
      <span className="text-muted-foreground">
        {startDate === endDate
          ? formatDate(startDate)
          : `${formatDate(startDate)} - ${formatDate(endDate)}`}
      </span>

      {/* middle */}
      <span className="font-medium">
        {formatPrice(newPricePerNight)}/{tBook("apartment.night")}
      </span>

      {/* right */}
      <Badge variant={reasonVariant(reason)}>{reasonLabel(reason)}</Badge>
    </div>
  );
}
