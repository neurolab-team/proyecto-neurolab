import { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { User } from "@packages/common-types/user.types";
import apiClient from "../../api/interceptors/axiosConfig";

export const authService = {
  async login(payload: any): Promise<User> {
    const response = await apiClient.post<BaseResponse<User>>(
      "/api/auth/login",
      payload,
    );
    return response.data.data;
  },

  async me(): Promise<User> {
    const response = await apiClient.get<BaseResponse<User>>("/api/auth/me");
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  },

    async changePassword(payload: any): Promise<void> {
      await apiClient.post("/api/auth/change-password", payload);
    },
};
