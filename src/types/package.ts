export interface Package {
  packageId: string;
  apartmentId: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  price: number;
  currency: string;
  isActive: boolean;
  maxBookings: number;
  createdAt: string;
  items: PackageItem[];
}

export interface PackageItem {
  packageItemId: string;
  itemName: string;
  itemNameVi: string;
  itemDescription: string;
  itemDescriptionVi: string;
  quantity: number;
  estimatedValue: number;
  sortOrder: number;
}
