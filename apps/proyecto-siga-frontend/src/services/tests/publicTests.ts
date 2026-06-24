import apiClient from "../../api/interceptors/axiosConfig";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { PublicTestCard } from "@packages/common-types/test.types";

export const publicTestsService = {
  getLandingTests: async (): Promise<PublicTestCard[]> => {
    const response = await apiClient.get<BaseResponse<PublicTestCard[]>>(
      `/api/public/tests`,
    );
    return response.data.data;
  },
};
