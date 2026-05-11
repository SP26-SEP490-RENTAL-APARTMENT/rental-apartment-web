import { format } from "date-fns";
import type { Apartment } from "@/types/apartment";

export const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

export const getPriceForDate = (
  apartment: Apartment,
  date: Date,
) => {
  const dateStr = format(date, "yyyy-MM-dd");

  const priceChange = apartment.priceChanges?.find(
    (item) =>
      dateStr >= item.startDate &&
      dateStr <= item.endDate,
  );

  return (
    priceChange?.newPricePerNight ??
    apartment.basePricePerNight
  );
};

export const calculateTotal = (
  apartment: Apartment,
  from?: Date,
  to?: Date,
) => {
  if (!from || !to) return 0;

  let total = 0;
  const current = new Date(from);

  while (current < to) {
    total += getPriceForDate(apartment, current);
    current.setDate(current.getDate() + 1);
  }

  return total;
};