export interface SmartPricing {
  pricingId: string;
  apartmentId: string;
  date: string;
  startDate: string;
  endDate: string;
  basePrice: number;
  occupancyRate: number;
  multiplier: number;
  suggestedPrice: number;
  reason: string;
  acceptedByLandlord: boolean;
  createdAt: string;
}
