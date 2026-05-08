<template>
  <div class="password-strength">
    <div class="strength-bars">
      <div
        class="strength-bar"
        :class="{
          active: level >= 1,
          weak: level === 1,
          medium: level === 2,
          strong: level === 3,
        }"
      ></div>
      <div
        class="strength-bar"
        :class="{
          active: level >= 2,
          medium: level === 2,
          strong: level === 3,
        }"
      ></div>
      <div
        class="strength-bar"
        :class="{
          active: level >= 3,
          strong: level === 3,
        }"
      ></div>
    </div>
    <span v-if="level > 0" class="strength-label" :class="{ weak: level === 1, medium: level === 2, strong: level === 3 }">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { $t } from "@/i18n"

const props = defineProps<{
  password: string
}>()

const WEAK_PASSWORDS = [
  "password",
  "12345678",
  "qwerty12",
  "abc12345",
  "password1",
  "iloveyou",
  "admin123",
  "qwertyui",
  "11111111",
  "00000000",
]

const level = computed(() => {
  const pwd = props.password
  if (!pwd) return 0

  const hasLower = /[a-z]/.test(pwd)
  const hasDigit = /\d/.test(pwd)
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd)
  const isLong = pwd.length >= 12
  const isWeak = WEAK_PASSWORDS.includes(pwd.toLowerCase())

  if (isWeak) return 1
  if (hasLower && hasDigit && hasSpecial && isLong) return 3
  if (hasLower && hasDigit && (hasSpecial || isLong)) return 2
  return 1
})

const label = computed(() => {
  if (level.value === 1) return $t("login.passwordStrengthWeak")
  if (level.value === 2) return $t("login.passwordStrengthMedium")
  if (level.value === 3) return $t("login.passwordStrengthStrong")
  return ""
})
</script>

<style lang="less" scoped>
.password-strength {
  .flex-row();
  align-items: center;
  gap: @spacing-sm;
  margin-top: @spacing-xs;
}

.strength-bars {
  .flex-row();
  gap: 4px;
}

.strength-bar {
  width: 32px;
  height: 3px;
  border-radius: 2px;
  background: @border-color-light;
  transition: all 0.3s ease;

  &.active {
    &.weak {
      background: @login-strength-weak;
    }
    &.medium {
      background: @login-strength-medium;
    }
    &.strong {
      background: @login-strength-strong;
    }
  }
}

.strength-label {
  font-size: @font-size-xs;
  transition: color 0.3s ease;

  &.weak {
    color: @login-strength-weak;
  }
  &.medium {
    color: @login-strength-medium;
  }
  &.strong {
    color: @login-strength-strong;
  }
}
</style>
