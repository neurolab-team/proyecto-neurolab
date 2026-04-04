import apiClient from "../../api/interceptors/axiosConfig";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { AssignmentWithTestsDataResponse } from "@packages/common-types/assignment.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import {
  PsychologistDashboardStats,
  PsychologistDashboardFeed,
} from "@packages/common-types/psychologist.types";

export const assignmentService = {
  getAllTests: async (
    userId: string,
  ): Promise<AssignmentWithTestsDataResponse[]> => {
    const response = await apiClient.get<
      BaseResponse<AssignmentWithTestsDataResponse[]>
    >(`/api/assignments/by-user/${userId}/tests`);
    return response.data.data;
  },
  getTestForAssignment: async (
    assignmentId: string,
  ): Promise<TestDataResponse> => {
    const response = await apiClient.get<BaseResponse<TestDataResponse>>(
      `/api/assignments/${assignmentId}/test`,
    );
    return response.data.data;
  },
  getDashboardStats: async (): Promise<PsychologistDashboardStats> => {
    const response = await apiClient.get<BaseResponse<PsychologistDashboardStats>>(
      `/api/assignments/psychologist/dashboard/stats`,
    );
    return response.data.data;
  },
  getDashboardFeed: async (): Promise<PsychologistDashboardFeed> => {
    const response = await apiClient.get<BaseResponse<PsychologistDashboardFeed>>(
      `/api/assignments/psychologist/dashboard/feed`,
    );
    return response.data.data;
  },
  markAssignmentAsReviewed: async (assignmentId: string) => {
    const response = await apiClient.patch<BaseResponse<null>>(
      `/api/assignments/${assignmentId}/review`,
    );
    return response.data;
  },
};
