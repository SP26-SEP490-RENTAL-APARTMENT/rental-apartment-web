import type { Apartment } from "@/types/apartment";

export function getDisplayPrice(apartment: Apartment) {
  const base = apartment.basePricePerNight;
  const changes = apartment.priceChanges;

  if (!changes.length) return { min: base, max: base };

  const prices = [base, ...changes.map(c => c.newPricePerNight)];

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}