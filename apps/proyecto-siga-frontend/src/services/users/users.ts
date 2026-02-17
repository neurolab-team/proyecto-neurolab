import { CreateUserInput, User } from "@packages/common-types/user.types";
import apiClient from "../../api/interceptors/axiosConfig";

interface RegisterResponse {
  message: string;
  data: User;
}


type PublicRegisterInput = Omit<CreateUserInput, 'role'>;

export const usersService = {

  getAll: async () => {
    const response = await apiClient.get(`/api/users`);
    return response.data;
  },

  create: async (data: CreateUserInput) => {
    const response = await apiClient.post(`/api/users`, data);
    return response.data;
  },

  register: async (data: PublicRegisterInput): Promise<RegisterResponse> => {
    const response = await apiClient.post(`/api/public/users/register`, data);
    return response.data;
  },

  updateRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(`/api/users/${userId}/role`, { role });
    return response.data;
  },
};

      