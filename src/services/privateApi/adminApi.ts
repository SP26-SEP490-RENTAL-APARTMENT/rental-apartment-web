import { apiConfig } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/api";
import type { ParamsProp } from "@/types/params";
import type { User } from "@/types/user";

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
}

export const userManagementApi = {
  getAllUsers: (
    params: ParamsProp,
  ): Promise<ApiResponse<PaginationResponse<User>>> =>
    apiConfig.privateApi.get("/User", { params }),
  createUser: (data: {
    email: string;
    password: string;
    role: "admin" | "tenant" | "landlord" | "staff";
    fullName: string;
    phone: string;
    identityVerified: boolean;
  }): Promise<ApiResponse<null>> => apiConfig.privateApi.post("/User", data),
  updateUser: (
    userId: string,
    data: Partial<User>,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(`/User/${userId}`, data),
  deleteUser: (userId: string): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.delete(`/User/${userId}`),
};

// export const apartmentManagementApi = {
//     getAllUsers: (): Promise<ApiResponse<User>> => apiConfig.privateApi.get('/user'),
// }
