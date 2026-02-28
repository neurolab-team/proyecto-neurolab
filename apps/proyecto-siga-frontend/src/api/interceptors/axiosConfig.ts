import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { resolveHttpError } from "./resolveHttpError";
import { handleHttpErrorEffects } from "./handleHttpErrorEffects";

const apiClient: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const action = resolveHttpError(error);
    handleHttpErrorEffects(action);

    return Promise.reject(error);
  }
);

export default apiClient;
