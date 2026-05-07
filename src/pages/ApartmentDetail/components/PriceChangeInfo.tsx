import { Badge } from "@/components/ui/badge";
import type { PriceChange } from "@/types/apartment";

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

// label đẹp hơn
const reasonLabel = (reason: PriceChange["reason"]) => {
  switch (reason) {
    case "peak season":
      return "Peak";
    case "low season":
      return "Low";
    case "special event":
      return "Event";
    case "manual override":
      return "Manual";
    default:
      return reason;
  }
};

export default function PriceChangeInfo({
  priceChange,
}: {
  priceChange: PriceChange;
}) {
  const { newPricePerNight, reason, startDate, endDate } = priceChange;

  return (
    <div className="flex items-center gap-5 text-sm px-3 py-2">
      {/* left */}
      <span className="text-muted-foreground">
        {startDate === endDate
          ? formatDate(startDate)
          : `${formatDate(startDate)} - ${formatDate(endDate)}`}
      </span>

      {/* middle */}
      <span className="font-medium">{formatPrice(newPricePerNight)}/night</span>

      {/* right */}
      <Badge variant={reasonVariant(reason)}>{reasonLabel(reason)}</Badge>
    </div>
  );
}
