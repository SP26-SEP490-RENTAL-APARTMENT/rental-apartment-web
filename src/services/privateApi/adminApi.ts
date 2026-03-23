import { apiConfig } from "@/config/apiConfig";
import type {
  CreateAmenityFormData,
} from "@/schemas/amenitySchema";
import type { Amenity } from "@/types/amenity";
import type { ApiResponse } from "@/types/api";
import type { PaginationResponse } from "@/types/paginationResponse";
import type { ParamsProp } from "@/types/params";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import type { User } from "@/types/user";

export interface responseData<T> {
  data: dataProp<T>;
  totalCount: number;
  pageSize: number;
  page: number;
}
export interface dataProp<T> {
  items: T[];
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

export const subscriptionPlanManagementApi = {
  getAllSubscriptionPlans: (
    params: ParamsProp,
  ): Promise<ApiResponse<PaginationResponse<SubscriptionPlan>>> =>
    apiConfig.privateApi.get("/SubscriptionPlan", { params }),
  deleteSubscriptionPlan: (
    subscriptionPlanId: string,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.delete(`/SubscriptionPlan/${subscriptionPlanId}`),
  createSubscriptionPlan: (
    data: Partial<SubscriptionPlan>,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/SubscriptionPlan", data),
  updateSubscriptionPlan: (
    subscriptionPlanId: string,
    data: Partial<SubscriptionPlan>,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(`/SubscriptionPlan/${subscriptionPlanId}`, data),
};

export const amenityManagementApi = {
  getAllAmenities: (
    params: ParamsProp,
  ): Promise<ApiResponse<responseData<Amenity>>> =>
    apiConfig.privateApi.get("/amenities", { params }),
  deleteAmenity: (amenityId: string): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.delete(`/amenities/${amenityId}`),
  createAmenity: (data: CreateAmenityFormData): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/amenities", data),
  updateAmenity: (
    amenityId: string,
    data: Partial<Amenity>,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(`/amenities/${amenityId}`, data),
};
