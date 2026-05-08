import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"
import { message } from "ant-design-vue"
import { useUserStore } from "@/stores/useUserStore"
import router from "@/router"

/** 接口统一返回结构 */
interface ApiResponse<T = unknown> {
  ResultData: T
  IsSuccess: boolean
  ErrorCode: number
  ErrMsg: string | null
  RedirectUrl: string | null
  Version: string | null
}

interface HRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  onlyAcceptTheLatest?: boolean
  tryTimes?: number
  alwaysPass?: boolean
}

interface CustomInternalConfig extends InternalAxiosRequestConfig {
  onlyAcceptTheLatest?: boolean
  showLoading?: boolean
  tryTimes?: number
  alwaysPass?: boolean
}

const pendingRequests = new Map<string, AbortController>()

let loadingCount = 0
let loadingHide: (() => void) | null = null

function getRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url } = config
  return `${method}-${url}`
}

function addPendingRequest(config: InternalAxiosRequestConfig): void {
  const key = getRequestKey(config)
  if (pendingRequests.has(key)) {
    pendingRequests.get(key)?.abort()
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(key, controller)
}

function removePendingRequest(config: InternalAxiosRequestConfig): void {
  const key = getRequestKey(config)
  pendingRequests.delete(key)
}

function showLoadingToast(): void {
  loadingCount++
  if (loadingCount === 1) {
    loadingHide = message.loading("加载中...", 0)
  }
}

function hideLoadingToast(): void {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    loadingHide?.()
    loadingHide = null
  }
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomInternalConfig
    if (customConfig.onlyAcceptTheLatest !== false) {
      addPendingRequest(config)
    }

    if (customConfig.showLoading) {
      showLoadingToast()
    }

    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.set("Authorization", `Bearer ${userStore.token}`)
    }

    config.headers.set("LanguageType", String(userStore.language || "zh"))
    config.headers.set("CurrencyType", userStore.currency || "CNY")
    config.headers.set("SoftwareVersion", import.meta.env.VITE_APP_VERSION || "1.0.0")
    config.headers.set("RequestSource", "WEB")
    config.headers.set("BrowserUrl", window.location.href)

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const customConfig = response.config as CustomInternalConfig
    if (customConfig.showLoading) {
      hideLoadingToast()
    }

    removePendingRequest(response.config as InternalAxiosRequestConfig)

    const { data } = response

    if (data.IsSuccess) {
      return data.ResultData as unknown as AxiosResponse
    }

    handleBusinessError(data.ErrorCode, data.ErrMsg || undefined)

    if (customConfig.alwaysPass) {
      return data as unknown as AxiosResponse
    }

    return Promise.reject(data)
  },
  (error) => {
    const config = error.config as CustomInternalConfig | undefined
    if (config?.showLoading) {
      hideLoadingToast()
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    if (config) {
      removePendingRequest(config as InternalAxiosRequestConfig)
    }

    if (error.message === "Network Error") {
      message.error("网络异常，请检查网络连接")
    } else if (error.code === "ECONNABORTED") {
      message.error("请求超时，请稍后重试")
    } else if (error.response?.status === 401) {
      handleLogout()
    } else if (error.response?.status === 403) {
      message.error("没有权限访问该资源")
    } else if (error.response?.status) {
      message.error(`请求异常（${error.response.status}）`)
    } else {
      message.error(error.message || "请求失败")
    }

    if (config?.alwaysPass) {
      return Promise.resolve(null)
    }

    return Promise.reject(error)
  },
)

// NOTE: 101=Token 失效, 102=登录被踢, 107=客户端版本过期需强刷, 113=强制改密
function handleBusinessError(errorCode: number, errMsg?: string): void {
  switch (errorCode) {
    case 101:
    case 102:
      handleLogout()
      break
    case 107:
      message.warning("版本过期，请刷新页面")
      window.location.reload()
      break
    case 113:
      message.warning("请修改密码")
      router.push("/user/change-password")
      break
    default:
      message.error(errMsg || "操作失败")
      break
  }
}

function handleLogout(): void {
  const userStore = useUserStore()
  userStore.clearUser()
  router.push("/login")
}

async function retryRequest<T>(config: HRequestConfig, resolve: (value: T) => void, reject: (reason: unknown) => void): Promise<void> {
  const maxRetry = config.tryTimes || 0
  let lastError: unknown

  for (let i = 0; i <= maxRetry; i++) {
    try {
      const result = await service(config)
      resolve(result as T)
      return
    } catch (error) {
      lastError = error
      if (i < maxRetry) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
      }
    }
  }

  reject(lastError)
}

/** 函数式调用，支持全部配置项 */
export function HRequest<T = unknown>(config: HRequestConfig): Promise<T> {
  if (config.tryTimes && config.tryTimes > 0) {
    return new Promise<T>((resolve, reject) => {
      retryRequest<T>(config, resolve, reject)
    })
  }

  return service(config) as Promise<T>
}



export default service
