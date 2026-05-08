import { HRequest } from "@/api/index"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: string
  username: string
}

export function apiAuthLogin(data: LoginRequest): Promise<LoginResponse> {
  return HRequest<LoginResponse>({
    url: "/auth/login",
    method: "POST",
    data,
  })
}

export function apiAuthLogout(): Promise<void> {
  return HRequest<void>({
    url: "/auth/logout",
    method: "POST",
  })
}
