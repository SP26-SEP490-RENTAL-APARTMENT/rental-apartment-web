export interface User {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "tenant" | "landlord" | "staff";
    createdAt: string;
    identityVerified: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  phone: string;
  sex: string | null;
  birthday: string | null;
  nationality: string | null;
  nationalIdCardNumber: string | null;
  identityVerified: boolean;
  createdAt: string;
}

