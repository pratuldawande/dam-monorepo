import API from "./axios";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

export interface MeResponse {
  success: boolean;
  message?: string;
  data: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const loginUser = (data: LoginRequest) =>
  API.post<LoginResponse>("/auth/login", data).then((res) => res.data);

export const getMe = () =>
  API.get<MeResponse>("/auth/me").then((res) => res.data);

export const logoutUser = () =>
  API.post<LogoutResponse>("/auth/logout").then((res) => res.data);
