import { apiConfig } from "@/config/apiConfig";
import type { UpdateApartmentFormData } from "@/schemas/apartmentSchema";
import type { AvailableDateFormData } from "@/schemas/availableDateSchema";
import type { ListingApproveFormData } from "@/schemas/listingApproveSchema";
import type { UpdateRoomFormData } from "@/schemas/roomSchema";
import type { Apartment, Room } from "@/types/apartment";
import type { ApiResponse } from "@/types/api";
import type { PaginationResponse } from "@/types/paginationResponse";
import type { ParamsProp } from "@/types/params";

export const apartmentManagementApi = {
  getApartments: (
    params: ParamsProp,
  ): Promise<ApiResponse<PaginationResponse<Apartment>>> =>
    apiConfig.privateApi.get("/landlord/apartments", { params }),
  createApartment: (data: FormData): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/apartments", data),
  updateApartment: (
    data: UpdateApartmentFormData,
    id: string,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(`/apartments/${id}`, data),
  deleteApartment: (id: string): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.delete(`/apartments/${id}`),
  addAmenityToApartment: (
    apartmentId: string,
    amenityIds: string[],
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post(
      `/apartments/${apartmentId}/amenities`,
      amenityIds,
    ),
  addAvailableDateToApartment: (
    apartmentId: string,
    availableDate: AvailableDateFormData[],
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post(`/apartments/${apartmentId}/availability`, {
      ranges: availableDate,
    }),
  sendToApprove: (
    apartmentId: string,
    { submissionNotes }: { submissionNotes: string },
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post(`/apartments/${apartmentId}/submit-for-review`, {
      submissionNotes,
    }),
  putPhotosForApartment: (apartmentId: string, data: FormData) =>
    apiConfig.privateApi.put(`/apartments/${apartmentId}/photos`, data),
  getApproveListings: (params: ParamsProp) =>
    apiConfig.privateApi.get("/apartments/pending-review", { params }),
  approveListing: (
    apartmentId: string,
    data: ListingApproveFormData,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post(`/apartments/${apartmentId}/approve`, data),
};

export const roomManagementApi = {
  getRooms: (
    landlordId: string,
    params: ParamsProp,
  ): Promise<ApiResponse<PaginationResponse<Room>>> =>
    apiConfig.privateApi.get(`/rooms/by-landlord/${landlordId}`, { params }),
  createRoom: (data: Partial<Room>): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/rooms", data),
  updateRoom: (
    data: UpdateRoomFormData,
    id: string,
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(`/rooms/${id}`, data),
  deleteRoom: (id: string): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.delete(`/rooms/${id}`),
};
