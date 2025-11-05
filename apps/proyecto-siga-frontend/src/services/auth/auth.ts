import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    data,
  );
  return response.data;
};

const changePassword = async ({
  newPassword,
  accessToken,
}: ChangePasswordData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginData>(
    {
      mutationFn: login,
    },
  );
};

export const useChangePasswordMutation = () => {
  return useMutation<
    unknown,
    AxiosError<{ message: string }>,
    ChangePasswordData
  >({
    mutationFn: changePassword,
  });
};