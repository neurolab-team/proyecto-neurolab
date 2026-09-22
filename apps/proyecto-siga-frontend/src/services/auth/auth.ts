import { BaseResponse } from "@packages/common-types/baseResponse.types";
import type { User } from "@packages/common-types/user.types";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@packages/common-types/passwordReset.types";
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
    await apiClient.put("/api/auth/change-password", payload);
  },

  async markUsabilitySurveyClicked(): Promise<void> {
    await apiClient.patch("/api/auth/usability-survey/click");
  },

  async forgotPassword(payload: ForgotPasswordInput): Promise<BaseResponse<null>> {
    const response = await apiClient.post<BaseResponse<null>>(
      "/api/auth/forgot-password",
      payload,
    );
    return response.data;
  },

  async resetPassword(payload: ResetPasswordInput): Promise<BaseResponse<null>> {
    const response = await apiClient.post<BaseResponse<null>>(
      "/api/auth/reset-password",
      payload,
    );
    return response.data;
  },
};
