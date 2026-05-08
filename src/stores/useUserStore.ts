import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { LanguageType } from "@/i18n"

export interface UserInfo {
  userId: string
  username: string
  email: string
  avatar: string
  permissions: string[]
}

const TOKEN_KEY = "token"
const USER_INFO_KEY = "userInfo"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) || "")
  const profile = ref<UserInfo | null>(null)
  const isLoggedIn = computed(() => !!token.value)
  const permissions = computed(() => profile.value?.permissions || [])
  const language = ref<LanguageType>((localStorage.getItem("CurrentLanguage") as LanguageType) || "zh")
  const currency = ref<string>(localStorage.getItem("CurrentCurrency") || "CNY")

  function setToken(newToken: string): void {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function setUser(user: UserInfo): void {
    profile.value = user
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
  }

  function clearUser(): void {
    token.value = ""
    profile.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_INFO_KEY)
  }

  function hasPermission(permission: string | string[]): boolean {
    if (!permission) return true
    const required = Array.isArray(permission) ? permission : [permission]
    return required.some((p) => permissions.value.includes(p))
  }

  function restoreUser(): void {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) {
      token.value = storedToken
    }

    const storedUser = localStorage.getItem(USER_INFO_KEY)
    if (storedUser) {
      try {
        profile.value = JSON.parse(storedUser)
      } catch {
        localStorage.removeItem(USER_INFO_KEY)
      }
    }
  }

  restoreUser()

  return {
    token,
    profile,
    isLoggedIn,
    permissions,
    language,
    currency,
    setToken,
    setUser,
    clearUser,
    hasPermission,
    restoreUser,
  }
})
