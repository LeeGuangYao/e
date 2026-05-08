import { HRequest } from "@/api/index"

export interface LoginRequest {
  UserName: string
  Password: string
}

export interface LoginResponse {
  Token: string
}

/** 用户登录 */
export function apiAuthLogin(data: LoginRequest): Promise<LoginResponse> {
  return HRequest<LoginResponse>({
    url: "/api/Login/UserLogin/v4",
    method: "POST",
    data,
    showLoading: true,
  })
}

/** 用户登出 */
export function apiAuthLogout(): Promise<void> {
  return HRequest<void>({
    url: "/api/Login/Logout",
    method: "POST",
  })
}
