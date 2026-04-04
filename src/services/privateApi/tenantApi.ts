import { apiConfig } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/api";
import type { ParamsProp } from "@/types/params";

export const collectionsApi = {
  getAllCollections: (params: ParamsProp) =>
    apiConfig.privateApi.get("/tenant/wishlist/collections", { params }),
  createCollection: (data: {
    name: string;
    description: string;
  }): Promise<ApiResponse<null>> =>
    apiConfig.privateApi.post("/tenant/collections", data),
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
};

export const indentityApi = {
  getMyIdentity: (params: ParamsProp) =>
    apiConfig.privateApi.get("/identity/my-documents", { params }),
};
