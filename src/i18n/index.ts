import { ref, computed, type App } from "vue"
import zh from "./locales/zh"
import en from "./locales/en"
import tw from "./locales/tw"
import jp from "./locales/jp"
import type { LocaleMessages } from "./locales/zh"

export type LanguageType = "zh" | "en" | "tw" | "jp"

const LOCALE_MAP: Record<LanguageType, LocaleMessages> = { zh, en, tw, jp }

const currentLanguage = ref<LanguageType>("zh")

function getInitialLanguage(): LanguageType {
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get("LanguageType") as LanguageType | null
  if (urlLang && LOCALE_MAP[urlLang]) {
    return urlLang
  }

  const storedLang = localStorage.getItem("CurrentLanguage") as LanguageType | null
  if (storedLang && LOCALE_MAP[storedLang]) {
    return storedLang
  }

  return "zh"
}

function flattenMessages(messages: LocaleMessages, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {}

  for (const key in messages) {
    const value = messages[key as keyof LocaleMessages]
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenMessages(value as unknown as LocaleMessages, fullKey))
    } else {
      result[fullKey] = value as unknown as string
    }
  }

  return result
}

const flattenedMessages = computed(() => {
  return flattenMessages(LOCALE_MAP[currentLanguage.value])
})

export function $t(key: string, params?: Record<string, string | number>): string {
  let text = flattenedMessages.value[key] || key

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v))
    }
  }

  return text
}

export function setLanguage(lang: LanguageType): void {
  if (LOCALE_MAP[lang]) {
    currentLanguage.value = lang
    localStorage.setItem("CurrentLanguage", lang)
    document.documentElement.lang = lang
  }
}

export function getCurrentLanguage(): LanguageType {
  return currentLanguage.value
}

export function useI18n() {
  return {
    $t,
    setLanguage,
    getCurrentLanguage,
    currentLanguage: computed(() => currentLanguage.value),
  }
}

export function installI18n(app: App): void {
  currentLanguage.value = getInitialLanguage()

  app.config.globalProperties.$t = $t

  app.provide("i18n", { $t, setLanguage, getCurrentLanguage, currentLanguage })
}

export default { install: installI18n }
