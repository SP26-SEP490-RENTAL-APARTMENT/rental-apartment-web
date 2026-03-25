import { apiConfig } from "@/config/apiConfig";
import type { UpdateApartmentFormData } from "@/schemas/apartmentSchema";
import type { Apartment } from "@/types/apartment";
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