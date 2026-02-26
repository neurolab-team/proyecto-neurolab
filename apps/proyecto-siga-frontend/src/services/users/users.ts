import { CreateUserInput,User} from "@packages/common-types/user.types";
import apiClient from "../../api/interceptors/axiosConfig";
import { BaseResponse } from "packages/common-types/baseResponse.types";
import { userResponse } from "@packages/common-types/user.types";
import { RegisterResponse } from "@packages/common-types/auth.types";

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

  
  //No esta implementado en el backend
  updateRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(`/api/users/${userId}/role`, { role });
    return response.data;
  },
};

      