import { apiConfig } from "@/config/apiConfig";
import type { ApiResponse } from "@/types/api";
import type { Login, LoginResponse, Register } from "@/types/auth";

export const authApi = {
  login: (loginData: Login): Promise<ApiResponse<LoginResponse>> =>
    apiConfig.publicApi.post("/auth/login", loginData),
  register: (registerData: Register) =>
    apiConfig.publicApi.post("/auth/register", registerData),
  // refreshToken: (refreshToken: string) => apiConfig.publicApi.post("/auth/refresh-token", { refreshToken }),
  addRole: (data: { targetRole: string }) =>
    apiConfig.privateApi.post("/auth/roles", data),
};
