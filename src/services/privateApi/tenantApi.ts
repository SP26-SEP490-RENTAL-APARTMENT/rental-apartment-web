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
