import { apiConfig } from "@/config/apiConfig";
import type { ParamsProp } from "@/types/params";

export const apartmentApi = {
  getApartments: (params: ParamsProp) =>
    apiConfig.publicApi.get("/Apartments", { params }),
  getApartmentById: (id: string) => apiConfig.publicApi.get(`/Apartments/${id}`),
};
