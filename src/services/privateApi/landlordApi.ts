import { apiConfig } from "@/config/apiConfig";
import type { UpdateApartmentFormData } from "@/schemas/apartmentSchema";
import type { AvailableDateFormData } from "@/schemas/availableDateSchema";
import type { ListingApproveFormData } from "@/schemas/listingApproveSchema";
import type { PricingPolicyFormData } from "@/schemas/pricingPolicy";
import type { UpdateRoomFormData } from "@/schemas/roomSchema";
import type { Apartment, Room } from "@/types/apartment";
import type { ApiResponse } from "@/types/api";
import type { PaginationResponse } from "@/types/paginationResponse";
import type { ParamsProp } from "@/types/params";

export interface LandlordDashboardSummary {
  generatedAt: string;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
}

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
  checkIn: (bookingId: string, data: FormData) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/check-in`, data),
  checkOut: (bookingId: string, data: FormData) =>
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
  addOccupantCCCD: (bookingId: string, data: FormData) =>
    apiConfig.privateApi.post(
      `/Booking/${bookingId}/occupants/ocr-upload`,
      data,
    ),
  editOccupant: (bookingId: string, occupantOrder: number, data: FormData) =>
    apiConfig.privateApi.put(
      `/Booking/${bookingId}/occupants/${occupantOrder}`,
      data,
    ),
};

export const mySubscriptionApi = {
  getSubscription: (params: ParamsProp) =>
    apiConfig.privateApi.get("/SubscriptionPlan/landlord", { params }),
  momoCheckout: (data: {
    planId: string;
    renewalType: string;
    autoRenew: boolean;
  }) => apiConfig.privateApi.post("/landlord/subscription/momo-checkout", data),
  payosCheckout: (data: {
    planId: string;
    renewalType: string;
    autoRenew: boolean;
  }) =>
    apiConfig.privateApi.post("/landlord/subscription/payos-checkout", data),
  getSubscriptionHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/landlord/subscriptions/history", { params }),
};

export const paymentHistoryApi = {
  getPaymentHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/landlord/payments/history", { params }),
};

export const landlordDashboardApi = {
  getSummary: () =>
    apiConfig.privateApi.get<ApiResponse<LandlordDashboardSummary>>(
      "/landlord/dashboard/summary",
    ),
};

export const priceChangeApi = {
  getPriceChanges: (apartmentId: string) =>
    apiConfig.privateApi.get(
      `/landlord/apartments/${apartmentId}/pricing/price-changes`,
    ),
  manualPriceChange: (
    apartmentId: string,
    data: {
      startDate: string;
      endDate: string;
      fixedPricePerNight: number;
      priceType: string;
    },
  ) =>
    apiConfig.privateApi.post(
      `/landlord/apartments/${apartmentId}/pricing/manual`,
      data,
    ),
  bulkPriceChange: (
    apartmentId: string,
    data: {
      fromDate: string;
      toDate: string;
      daysOfWeek: string[];
      fixedPricePerNight: number;
    },
  ) =>
    apiConfig.privateApi.post(
      `/landlord/apartments/${apartmentId}/pricing/manual/bulk-weekdays`,
      data,
    ),
  useSmartPricing: (data: {
    apartmentId: string;
    startDate: string;
    endDate: string;
  }) => apiConfig.privateApi.post(`/smart-pricing/suggest`, data),
  acceptSmartPricing: (
    priceChangeId: string,
    data: { overridePrice: number },
  ) =>
    apiConfig.privateApi.post(`/smart-pricing/${priceChangeId}/accept`, data),
  getSmartPricingHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/smart-pricing/landlord/suggestions", { params }),
};

export const myWalletApi = {
  getMyWallet: () => apiConfig.privateApi.get("/landlord/wallet"),
  getPayoutHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/landlord/payouts", { params }),
  withdraw: (data: {
    amount: number;
    channel: string;
    toBin: string;
    toAccountNumber: string;
    orderInfo: string;
  }) => apiConfig.privateApi.post("/landlord/payouts", data),
};

export const pricingPolicyApi = {
  getAllPricingPolicy: () =>
    apiConfig.privateApi.get("/landlord/pricing/templates"),
  applyPolicy: (apartmentId: string, data: PricingPolicyFormData) =>
    apiConfig.privateApi.post(
      `/landlord/apartments/${apartmentId}/pricing/policies`,
      data,
    ),
  viewAvailablePolicies: (apartmentId: string) =>
    apiConfig.privateApi.get(
      `/landlord/apartments/${apartmentId}/pricing/policies/templates/available`,
    ),
};

export const feeManagementApi = {
  getAllFees: () => apiConfig.privateApi.get("/landlord/penalties"),
  confirmFeePayment: (
    bookingId: string,
    data: { paymentDate: string; notes: string },
  ) =>
    apiConfig.privateApi.post(
      `/Booking/${bookingId}/check-time/payment-confirmation`,
      data,
    ),
};
