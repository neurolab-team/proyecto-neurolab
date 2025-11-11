import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

<<<<<<< HEAD
const login = async (data: LoginData): Promise<LoginResponse> => {
=======
import {
  LoginCredentials,
  LoginResult,
  ChangePasswordData,
} from "@packages/common-types/auth.types";

const login = async (data: LoginCredentials): Promise<LoginResult> => {
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    data,
  );
  return response.data;
};

const changePassword = async ({
<<<<<<< HEAD
=======
  currentPassword,
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
  newPassword,
  accessToken,
}: ChangePasswordData) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
<<<<<<< HEAD
    { newPassword },
=======
    { currentPassword, newPassword },
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const useLoginMutation = () => {
<<<<<<< HEAD
  return useMutation<LoginResponse, AxiosError<{ message: string }>, LoginData>(
=======
  return useMutation<LoginResult, AxiosError<{ message: string }>, LoginCredentials>(
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
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
<<<<<<< HEAD
};
=======
};
>>>>>>> remotes/origin/jhonzabala/refactoringWeb
