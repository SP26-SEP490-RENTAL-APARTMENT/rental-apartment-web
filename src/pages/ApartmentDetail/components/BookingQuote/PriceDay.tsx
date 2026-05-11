import { format } from "date-fns";
import type { Apartment } from "@/types/apartment";
import { getPriceForDate } from "./booking-utils";

interface Props {
  date: Date;
  apartment: Apartment;
}

export default function PriceDay({ date, apartment }: Props) {
  const price = getPriceForDate(apartment, date);

  const isDynamic = price !== apartment.basePricePerNight;

  return (
    <div className="flex flex-col items-center">
      <span>{format(date, "d")}</span>

      <span
        className={`text-[10px] leading-none ${
          isDynamic ? "text-red-500 font-semibold" : "text-gray-400"
        }`}
      >
        {(price / 1000).toFixed(0)}k
      </span>
    </div>
  );
}
