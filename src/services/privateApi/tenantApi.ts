import { apiConfig } from "@/config/apiConfig";
import type { BookingConfirmFormData } from "@/schemas/bookingSchema";
import type { UserProfileFormData } from "@/schemas/userProfileSchema";
import type { ApiResponse } from "@/types/api";
import type { ParamsProp } from "@/types/params";

export const collectionsApi = {
  getAllCollections: (params: ParamsProp) =>
    apiConfig.privateApi.get("/tenant/wishlist/collections", { params }),
  createCollection: (data: {
    name: string;
    description: string;
  }): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/tenant/wishlist/collections", data),
  updateCollection: (
    collectionId: string,
    data: {
      name: string;
      description: string;
    },
  ): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.put(
      `/tenant/wishlist/collections/${collectionId}`,
      data,
    ),
  deleteCollection: (collectionId: string) =>
    apiConfig.privateApi.delete(`/tenant/wishlist/collections/${collectionId}`),
  addWishlistToCollection: (data: {
    collectionId: string;
    apartmentId: string;
    note: string;
  }): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/tenant/wishlist", data),
  getWishlists: (collectionId: string, params: ParamsProp) =>
    apiConfig.privateApi.get(
      `/tenant/wishlist/collections/${collectionId}/items`,
      { params },
    ),

  // deleteWishlistItem: (wishlistId: string) =>
  //   apiConfig.privateApi.delete(`/tenant/wishlist/${wishlistId}`),
};

export const indentityApi = {
  getMyIdentity: (params: ParamsProp) =>
    apiConfig.privateApi.get("/identity/my-documents", { params }),
  createIdentity: (data: FormData) =>
    apiConfig.privateApi.post("/identity/documents", data),
  uploadCCCD: (data: FormData) =>
    apiConfig.privateApi.post("/id-recognition/upload", data),
  addBankAcc: (data: { bankAccountNumber: string; bankBin: string }) =>
    apiConfig.privateApi.put("/User/me/bank-profile", data),
};

export const packageApi = {
  getPackageByApartment: (apartmentId: string, params: ParamsProp) =>
    apiConfig.privateApi.get(`/Package/by-apartment/${apartmentId}`, {
      params,
    }),
};

export const bookingApi = {
  createBookingQuote: (data: any) =>
    apiConfig.privateApi.post("/Booking/quote", data),
  confirmBooking: (data: BookingConfirmFormData) =>
    apiConfig.privateApi.post("/Booking", data),
  getBookingHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/tenant/bookings/history", { params }),
  payBalance: (
    bookingId: string,
    paymentProvider: string,
    devicePlatform: string,
  ) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/pay-balance`, null, {
      params: {
        paymentProvider,
        devicePlatform,
      },
    }),
  getRefund: (
    bookingId: string,
    data: {
      reason: string;
      notes: string;
      payOsReceiverName: string;
      payOsBankCode: string;
      payOsAccountNumber: string;
    },
  ) => apiConfig.privateApi.post(`/Booking/${bookingId}/refund`, data),
  getChecktime: (bookingId: string) =>
    apiConfig.privateApi.get(`/Booking/${bookingId}/check-time`),
  respondToCheckTime: (
    bookingId: string,
    data: { action: string; disputeReason: string; notes: string },
  ) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/check-time/respond`, data),
  payOutstandingFee: (
    bookingId: string,
    data: { paymentMethod: string; devicePlatform: string },
  ) =>
    apiConfig.privateApi.post(
      `/Booking/${bookingId}/check-time/claim/pay`,
      data,
    ),
  submitOfflinePayment: (bookingId: string, data: FormData) =>
    apiConfig.privateApi.post(
      `/Booking/${bookingId}/submit-offline-payment`,
      data,
    ),
  cancelWithRefund: (
    bookingId: string,
    data: {
      reason: string;
      notes: string;
      payOsBankCode: string;
      payOsAccountNumber: string;
    },
  ) => apiConfig.privateApi.post(`/Booking/${bookingId}/refund/payos`, data),
};

export const reviewApi = {
  postReview: (data: { bookingId: string; rating: number; comment: string }) =>
    apiConfig.privateApi.post("/Review", data),
  getAverageRating: (apartmentId: string) =>
    apiConfig.privateApi.get(`/Review/apartment/${apartmentId}/average-rating`),
  getAllReviews: (apartmentId: string) =>
    apiConfig.privateApi.get(`/Review/apartment/${apartmentId}`),
};

export const profileApi = {
  getProfile: () => apiConfig.privateApi.get("/User/me"),
  updateProfile: (data: UserProfileFormData) =>
    apiConfig.privateApi.put("/User/me", data),
};

export const supportTicketApi = {
  createTicket: (data: FormData) =>
    apiConfig.privateApi.post("/SupportTicket", data),
  getMyTickets: (params: ParamsProp) =>
    apiConfig.privateApi.get("/SupportTicket/my", { params }),
  getTicketDetail: (ticketId: string) =>
    apiConfig.privateApi.get(`/SupportTicket/${ticketId}`),
  respondToSolution: (
    ticketId: string,
    data: { newStatus: string; statusChangeNotes: string },
  ) => apiConfig.privateApi.patch(`/SupportTicket/${ticketId}/status`, data),
  getAlternativeApartments: (bookingId: string, params: ParamsProp) =>
    apiConfig.privateApi.get(
      `/Booking/${bookingId}/occupied-alternatives/assessment`,
      { params },
    ),
};

export const tenantPaymentApi = {
  getPaymentHistory: (params: ParamsProp) =>
    apiConfig.privateApi.get("/tenant/payments/history", { params }),
};

export const occupiedIncident = {
  reportIncident: (bookingId: string, data: FormData) =>
    apiConfig.privateApi.post(`/Booking/${bookingId}/occupied-incident`, data),
  getMyIncidents: (params: ParamsProp) =>
    apiConfig.privateApi.get("/tenant/incidents/my", { params }),
};

export const outstandingFee = {
  getMyFee: (userId: string) =>
    apiConfig.privateApi.get(`/Booking/outstanding-fees/${userId}`),
};

export const notificationApi = {
  getNotifications: (params: ParamsProp) =>
    apiConfig.privateApi.get("/Notification/my", { params }),
  markAsRead: (notificationId: string) =>
    apiConfig.privateApi.post(`/Notification/${notificationId}/read`),
  markAllAsRead: () => apiConfig.privateApi.post("/Notification/read-all"),
};
