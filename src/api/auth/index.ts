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

/** 用户登录 */
export function apiAuthLogin(data: LoginRequest): Promise<LoginResponse> {
  return HRequest<LoginResponse>({
    url: "/api/Login/UserLogin/v4",
    method: "POST",
    data,
  })
}

/** 用户登出 */
export function apiAuthLogout(): Promise<void> {
  return HRequest<void>({
    url: "/api/Login/Logout",
    method: "POST",
  })
}

/**
 * 调用示例：
 *
 * // 函数式调用
 * const data = await apiAuthLogin({ username: "admin", password: "123456" })
 * console.log(data.token)   // 直接拿到 ResultData
 *
 * // 带 loading
 * const data = await HRequest<LoginResponse>({
 *   url: "/api/Login/UserLogin/v4",
 *   method: "POST",
 *   data: { username: "admin", password: "123456" },
 *   showLoading: true,
 * })
 *
 * // 参数示例
 * { username: "admin", password: "123456" }
 *
 * // 返回示例（ResultData）
 * { token: "eyJhbGciOiJIUzI1NiIs...", userId: "10001", username: "admin" }
 */
