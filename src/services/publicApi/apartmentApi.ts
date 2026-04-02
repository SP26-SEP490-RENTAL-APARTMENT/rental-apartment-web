import { apiConfig } from "@/config/apiConfig";
import type { ParamsProp } from "@/types/params";

export const apartmentApi = {
  getApartments: (params: ParamsProp) =>
    apiConfig.publicApi.get("/apartments/public", { params }),
  getApartmentById: (id: string) => apiConfig.publicApi.get(`/apartments/${id}`),
};
