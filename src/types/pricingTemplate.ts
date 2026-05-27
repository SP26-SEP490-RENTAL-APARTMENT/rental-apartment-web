export interface PricingTemplate {
  templateId: string;
  createdByAdminId?: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  parameters: PricingParameter[];
}

export interface PricingParameter {
  parameterId: string;
  templateId: string;
  parameterKey: string;
  displayName: string;
  defaultValue: number;
  minValue: number;
  maxValue: number;
  isAdjustable: boolean;
}

export interface AvailablePolicy {
  apartmentId: string;
  apartmentBasePrice: number;
  templates: PricingTemplate[]
}