import type { LanguageType } from "@/i18n"

declare module "vue" {
  interface ComponentCustomProperties {
    $t: (key: string, params?: Record<string, string | number>) => string
  }
}

export type { LanguageType }
