import { defineStore } from "pinia"
import { ref } from "vue"
import type { LanguageType } from "@/i18n"

const LANGUAGE_KEY = "CurrentLanguage"
const CURRENCY_KEY = "CurrentCurrency"

export const useAppStore = defineStore("app", () => {
  const language = ref<LanguageType>((localStorage.getItem(LANGUAGE_KEY) as LanguageType) || "zh")
  const currency = ref<string>(localStorage.getItem(CURRENCY_KEY) || "CNY")
  const loading = ref(false)
  const sidebarCollapsed = ref(false)

  function setLanguage(lang: LanguageType): void {
    language.value = lang
    localStorage.setItem(LANGUAGE_KEY, lang)
  }

  function setCurrency(cur: string): void {
    currency.value = cur
    localStorage.setItem(CURRENCY_KEY, cur)
  }

  function setLoading(val: boolean): void {
    loading.value = val
  }

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    language,
    currency,
    loading,
    sidebarCollapsed,
    setLanguage,
    setCurrency,
    setLoading,
    toggleSidebar,
  }
})
