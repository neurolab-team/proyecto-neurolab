import apiClient from "../../api/interceptors/axiosConfig";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import {
  AssignmentWithTestsDataResponse,
  BulkAssignPsychologistTestInput,
  BulkAssignPsychologistTestResult,
  PsychologistAssignableTest,
} from "@packages/common-types/assignment.types";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import {
  PsychologistDashboardStats,
  PsychologistDashboardFeed,
} from "@packages/common-types/psychologist.types";
import type { StudyConsentDecision } from "@packages/common-types/consent.types";

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
  getPsychologistAssignableTests: async (): Promise<PsychologistAssignableTest[]> => {
    const response = await apiClient.get<BaseResponse<PsychologistAssignableTest[]>>(
      `/api/assignments/psychologist/tests`,
    );
    return response.data.data;
  },
  bulkAssignPsychologistTest: async (
    payload: BulkAssignPsychologistTestInput,
  ): Promise<BulkAssignPsychologistTestResult> => {
    const response = await apiClient.post<BaseResponse<BulkAssignPsychologistTestResult>>(
      `/api/assignments/psychologist/bulk`,
      payload,
    );
    return response.data.data;
  },
  markAssignmentAsReviewed: async (assignmentId: string) => {
    const response = await apiClient.patch<BaseResponse<null>>(
      `/api/assignments/${assignmentId}/review`,
    );
    return response.data;
  },
  /**
   * Registra la decisión de consentimiento del estudio al que pertenece la
   * prueba de la asignación (aplica a todas las pruebas del estudio).
   */
  submitConsent: async (
    assignmentId: string,
    decision: {
      accepted: boolean;
      allowsSleepTips?: boolean;
      allowsStudyInvites?: boolean;
    },
  ) => {
    const response = await apiClient.patch<BaseResponse<StudyConsentDecision>>(
      `/api/assignments/${assignmentId}/consent`,
      decision,
    );
    return response.data;
  },
};
