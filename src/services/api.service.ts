import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuthStore } from "@/store/auth.store";

const $baseApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

$baseApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

$baseApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.log("Session expired. Please sign in again.");
        useAuthStore.getState().clearAuth();
      }

      if (status === 500) {
        console.log("Failed! An error occured");
      }
    }

    return Promise.reject(error);
  }
);

export { $baseApi };
