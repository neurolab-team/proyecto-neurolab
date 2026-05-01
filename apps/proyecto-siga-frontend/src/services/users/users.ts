import {
  AssignPsychologistInput,
  CreateUserInput,
  UpdateUserRoleInput,
  User,
} from "@packages/common-types/user.types";
import apiClient from "../../api/interceptors/axiosConfig";
import { BaseResponse } from "@packages/common-types/baseResponse.types";
import { userResponse } from "@packages/common-types/user.types";
import { RegisterResponse } from "@packages/common-types/auth.types";
import {
  PsychologistStudentResultsFilters,
  PsychologistStudentResultsResponse,
  PsychologistStudentProfile,
  PsychologistStudentSummary,
} from "@packages/common-types/psychologist.types";

type PublicRegisterInput = Omit<CreateUserInput, 'role'>;

export const usersService = {

  getAll: async (): Promise<BaseResponse<User[]>> => {
    const response = await apiClient.get<BaseResponse<User[]>>(`/api/users`);
    return response.data;
  },

  create: async (data: CreateUserInput):Promise<BaseResponse<userResponse>> => {
    const response = await apiClient.post<BaseResponse<userResponse>>(`/api/users`, data);
    return response.data;
  },

  register: async (data: PublicRegisterInput): Promise<BaseResponse<RegisterResponse>> => {
    const response = await apiClient.post<BaseResponse<RegisterResponse>>(`/api/public/users/register`, data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      `/api/public/users/verify-email`,
      { token },
    );
    return response.data;
  },

  resendVerificationEmail: async (email: string): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      `/api/public/users/resend-verification`,
      { email },
    );
    return response.data;
  },

  
  updateRole: async (userId: string, role: UpdateUserRoleInput["role"]) => {
    const response = await apiClient.patch<BaseResponse<User>>(
      `/api/users/${userId}/role`,
      { role },
    );
    return response.data;
  },

  assignPsychologist: async (
    userId: string,
    input: AssignPsychologistInput,
  ) => {
    const response = await apiClient.patch<BaseResponse<User>>(
      `/api/users/${userId}/psychologist`,
      input,
    );
    return response.data;
  },

  getPsychologistStudents: async (): Promise<PsychologistStudentSummary[]> => {
    const response = await apiClient.get<
      BaseResponse<PsychologistStudentSummary[]>
    >(`/api/users/psychologist/students`);
    return response.data.data;
  },

  getPsychologistStudentById: async (
    studentId: string,
  ): Promise<PsychologistStudentProfile> => {
    const response = await apiClient.get<
      BaseResponse<PsychologistStudentProfile>
    >(`/api/users/psychologist/students/${studentId}`);
    return response.data.data;
  },

  getPsychologistStudentResults: async (
    filters: PsychologistStudentResultsFilters,
  ): Promise<PsychologistStudentResultsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    });

    const response = await apiClient.get<
      BaseResponse<PsychologistStudentResultsResponse>
    >(`/api/users/psychologist/students/results?${params.toString()}`);

    return response.data.data;
  },
};
