import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  LoginCredentials,
  LoginResult,
  ChangePasswordData,
} from "@packages/common-types/auth.types";

const login = async (data: LoginCredentials): Promise<LoginResult> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    data,
  );
  return response.data;
};

const changePassword = async ({
  currentPassword,
  newPassword,
  accessToken,
}: ChangePasswordData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation<LoginResult, AxiosError<{ message: string }>, LoginCredentials>(
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
