export interface SubscriptionPlan {
  planId: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  maxApartments: number;
  maxApartmentsPerApartment: number;
  features: string;
  isActive: boolean;
  createdAt: string;
}