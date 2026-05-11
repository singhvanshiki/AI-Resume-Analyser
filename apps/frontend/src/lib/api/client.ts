import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";

import { API_BASE_URL } from "@/lib/env";
import type { TokenResponse } from "@/lib/types";
import { useAuthStore } from "@/stores/auth-store";

export const rawClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const { refreshToken, setTokens, setUser, clearAuth } =
    useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return null;
  }

  refreshPromise = rawClient
    .post<TokenResponse>("/auth/refresh", { refresh_token: refreshToken })
    .then((response) => {
      setTokens(response.data.access_token, response.data.refresh_token);
      setUser(response.data.user);
      return response.data.access_token;
    })
    .catch(() => {
      clearAuth();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    if (!originalRequest || originalRequest._retry || status !== 401) {
      return Promise.reject(error);
    }

    if (url.includes("/auth/")) {
      return Promise.reject(error);
    }

    const newToken = await refreshAccessToken();
    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    originalRequest.headers = {
      ...(originalRequest.headers ?? {}),
      Authorization: `Bearer ${newToken}`,
    } as AxiosRequestHeaders;

    return apiClient(originalRequest);
  },
);
