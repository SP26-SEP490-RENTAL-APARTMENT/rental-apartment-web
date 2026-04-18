export interface Catalog {
  reportId: string;
  name: string;
  description: string;
  type: "standard" | "custom" | "scheduled" | "real_time";
  category: string;
  isActive: boolean;
}
