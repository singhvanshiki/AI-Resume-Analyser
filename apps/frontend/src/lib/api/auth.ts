import { apiClient, rawClient } from "@/lib/api/client";
import type {
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/lib/types";

export const authApi = {
  async login(payload: LoginRequest) {
    const response = await rawClient.post<TokenResponse>(
      "/auth/login",
      payload,
    );
    return response.data;
  },
  async register(payload: RegisterRequest) {
    const response = await rawClient.post<TokenResponse>(
      "/auth/register",
      payload,
    );
    return response.data;
  },
  async refresh(payload: RefreshRequest) {
    const response = await rawClient.post<TokenResponse>(
      "/auth/refresh",
      payload,
    );
    return response.data;
  },
  async logout(payload: LogoutRequest) {
    await rawClient.post("/auth/logout", payload);
  },
  async me() {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};
