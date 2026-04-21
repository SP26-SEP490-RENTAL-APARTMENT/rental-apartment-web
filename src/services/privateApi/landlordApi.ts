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

export const bookingManagementApi = {
  getBookings: (params: ParamsProp) =>
    apiConfig.privateApi.get("/landlord/bookings/history", { params }),
  checkIn: (bookingId: string, data: { actualCheckIn: Date; note: string }) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/check-in`, data),
  checkOut: (bookingId: string, data: { actualCheckOut: Date; note: string }) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/check-out`, data),
  submitResidenceReport: (
    bookingId: string,
    data: {
      reportedToPolice: boolean;
      reportDate: Date | string;
      reportNumber: string;
      actualCheckIn: Date | string;
    },
  ) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/residence-report`, data),
  getPDFFile: (bookingId: string) =>
    apiConfig.privateApi.get(`/Booking/${bookingId}/residence-report/pdf`, {
      responseType: "blob",
    }),
  getDOCFile: (bookingId: string) =>
    apiConfig.privateApi.get(`/Booking/${bookingId}/residence-report/docx`, {
      responseType: "blob",
    }),
  getOccupantList: (bookingId: string) =>
    apiConfig.privateApi.get(`/Booking/${bookingId}/occupants`),
  addOccupant: (bookingId: string, data: FormData) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/occupants`, data),
};

export const mySubscriptionApi = {
  getSubscription: (params: ParamsProp) =>
    apiConfig.privateApi.get("/SubscriptionPlan/landlord", { params }),
  momoCheckout: (data: {
    planId: string;
    renewalType: string;
    autoRenew: boolean;
  }) => apiConfig.privateApi.post("/landlord/subscription/momo-checkout", data),
  getSubscriptionHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/landlord/subscriptions/history", { params }),
};
