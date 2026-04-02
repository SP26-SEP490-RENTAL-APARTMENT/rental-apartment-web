import { apiConfig } from "@/config/apiConfig";
import type { UpdateApartmentFormData } from "@/schemas/apartmentSchema";
import type { UpdateRoomFormData } from "@/schemas/roomSchema";
import type { Apartment, Room } from "@/types/apartment";
import type { ApiResponse } from "@/types/api";
import type { PaginationResponse } from "@/types/paginationResponse";
import type { ParamsProp } from "@/types/params";

export const apartmentManagementApi = {
    getApartments: (params: ParamsProp): Promise<ApiResponse<PaginationResponse<Apartment>>> =>
        apiConfig.privateApi.get("/landlord/apartments", { params }),
    createApartment: (data: FormData): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.post("/apartments", data),
    updateApartment: (data: UpdateApartmentFormData, id: string): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.put(`/apartments/${id}`, data),
    deleteApartment: (id: string): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.delete(`/apartments/${id}`),
    addAmenityToApartment: (apartmentId: string, amenityIds: string[]): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.post(`/apartments/${apartmentId}/amenities`, amenityIds)
}

export const roomManagementApi = {
    getRooms: (landlordId: string, params: ParamsProp): Promise<ApiResponse<PaginationResponse<Room>>> =>
        apiConfig.privateApi.get(`/rooms/by-landlord/${landlordId}`, { params }),
    createRoom: (data: Partial<Room>): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.post("/rooms", data),
    updateRoom: (data: UpdateRoomFormData, id: string): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.put(`/rooms/${id}`, data),
    deleteRoom: (id: string): Promise<ApiResponse<null>> =>
        apiConfig.privateApi.delete(`/rooms/${id}`)
}