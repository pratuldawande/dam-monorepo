import API from './axios'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface ExistingUser {
  id: string
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export interface MeResponse {
  success: boolean
  message?: string
  data: AuthUser
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface UsersResponse {
  success: boolean
  data: ExistingUser[]
}

export const loginUser = (data: LoginRequest) =>
  API.post<LoginResponse>('/auth/login', data).then((res) => res.data)

export const registerUser = (data: RegisterRequest) =>
  API.post<RegisterResponse>('/auth/register', data).then((res) => res.data)

export const getMe = () => API.get<MeResponse>('/auth/me').then((res) => res.data)

export const getExistingUsers = (search?: string) =>
  API.get<UsersResponse>('/auth/users', {
    params: search?.trim() ? { search: search.trim() } : undefined,
  }).then((res) => res.data)

export const logoutUser = () => API.post<LogoutResponse>('/auth/logout').then((res) => res.data)
