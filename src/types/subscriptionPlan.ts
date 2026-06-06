export interface SubscriptionPlan {
  planId: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  priceMonthly: number;
  priceAnnual: number;
  maxApartments: number;
  maxApartmentsPerApartment: number;
  features: string;
  featuresVi: string;
  isActive: boolean;
  createdAt: string;
}