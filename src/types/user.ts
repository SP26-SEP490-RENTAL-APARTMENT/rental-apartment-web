export interface User {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "tenant" | "landlord" | "staff";
    createdAt: string;
    identityVerified: boolean;
}