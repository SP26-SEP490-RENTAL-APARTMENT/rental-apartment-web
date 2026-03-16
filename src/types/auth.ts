export interface Login {
    email: string;
    password: string;
}

export interface Register {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: "tenant" | "landlord";
}

export interface LoginResponse {
    id: string;
    fullName: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    isActive: boolean;
    role: "admin" | "tenant" | "landlord" | "staff"
}