import axios from "axios";
import { CreateUserInput, User } from "@packages/common-types/user.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterResponse {
  message: string;
  data: User;
}


type PublicRegisterInput = Omit<CreateUserInput, 'role'>;

export const usersService = {
  
  getAll: async (token: string) => {
    const response = await axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (token: string, data: CreateUserInput) => {
    const response = await axios.post(`${API_URL}/api/users`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  register: async (data: PublicRegisterInput): Promise<RegisterResponse> => {
    const response = await axios.post(`${API_URL}/api/public/users/register`, data);
    return response.data;
  },

  updateRole: async (token: string, userId: string, role: string) => {
    const response = await axios.patch(
      `${API_URL}/api/users/${userId}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
