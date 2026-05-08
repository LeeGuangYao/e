<template>
  <div class="login-form-wrapper">
    <div class="login-form-container fade-in-up">
      <div class="form-header">
        <div class="form-logo">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="rgba(24,144,255,0.08)" />
            <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" stroke="#1890ff" stroke-width="2" fill="rgba(24,144,255,0.06)" />
            <circle cx="24" cy="24" r="4" fill="#1890ff" />
          </svg>
        </div>
        <h2 class="form-welcome">{{ $t("login.welcome") }}</h2>
        <p class="form-description">{{ $t("login.description") }}</p>
      </div>

      <a-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        class="login-form"
        @finish="handleFinish"
      >
        <a-form-item
          :label="$t('login.account')"
          name="account"
          :rules="accountRules"
          class="form-item"
        >
          <a-input
            v-model:value="formState.account"
            :placeholder="$t('login.accountPlaceholder')"
            size="large"
            @press-enter="handleAccountEnter"
          >
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          :label="$t('login.password')"
          name="password"
          :rules="passwordRules"
          class="form-item"
        >
          <div class="password-field">
            <a-input-password
              v-if="!passwordVisible"
              ref="passwordInputRef"
              v-model:value="formState.password"
              :placeholder="$t('login.passwordPlaceholder')"
              size="large"
              @press-enter="handlePasswordEnter"
            >
              <template #prefix>
                <LockOutlined class="input-icon" />
              </template>
            </a-input-password>
            <a-input
              v-else
              ref="passwordInputRef"
              v-model:value="formState.password"
              :placeholder="$t('login.passwordPlaceholder')"
              size="large"
              type="text"
              @press-enter="handlePasswordEnter"
            >
              <template #prefix>
                <LockOutlined class="input-icon" />
              </template>
            </a-input>
            <span class="password-toggle" @click="togglePassword">
              <EyeOutlined v-if="passwordVisible" />
              <EyeInvisibleOutlined v-else />
            </span>
          </div>
          <PasswordStrength :password="formState.password" />
        </a-form-item>

        <div class="form-row-between">
          <a-checkbox v-model:checked="agreed" class="agreement-checkbox">
            <span class="agreement-text">
              {{ $t("login.agreePrefix") }}
              <a class="agreement-link" @click.stop>{{ $t("login.userAgreement") }}</a>
              {{ $t("login.agreeAnd") }}
              <a class="agreement-link" @click.stop>{{ $t("login.privacyPolicy") }}</a>
            </span>
          </a-checkbox>
          <a class="forgot-link" @click="handleForgotPassword">{{ $t("login.forgotPassword") }}</a>
        </div>

        <a-form-item class="form-item form-submit-item">
          <a-button
            type="primary"
            html-type="submit"
            :loading="props.loading"
            :disabled="!agreed"
            block
            size="large"
            class="login-btn"
          >
            {{ $t("login.submit") }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import type { Rule } from "ant-design-vue/es/form"
import type { FormInstance } from "ant-design-vue"
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons-vue"
import { $t } from "@/i18n"
import PasswordStrength from "./password-strength.vue"

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [values: { account: string; password: string }]
}>()

const formRef = ref<FormInstance>()
const passwordInputRef = ref()
const passwordVisible = ref(false)
const agreed = ref(false)

const formState = reactive({
  account: "",
  password: "",
})

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

const validateAccount = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject($t("login.accountRequired"))
  if (value.length < 2) return Promise.reject($t("login.accountFormatError"))
  return Promise.resolve()
}

const validatePassword = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject($t("login.passwordRequired"))
  if (value.length < 8) return Promise.reject($t("login.passwordMinLength"))
  if (!/[a-z]/.test(value) || !/\d/.test(value)) {
    return Promise.reject($t("login.passwordComplexity"))
  }
  if (WEAK_PASSWORDS.includes(value.toLowerCase())) {
    return Promise.reject($t("login.passwordWeak"))
  }
  return Promise.resolve()
}

const accountRules: Rule[] = [
  { required: true, validator: validateAccount, trigger: ["blur", "change"] },
]

const passwordRules: Rule[] = [
  { required: true, validator: validatePassword, trigger: ["blur", "change"] },
]

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
}

function handleAccountEnter() {
  passwordInputRef.value?.$el?.querySelector("input")?.focus()
}

function handlePasswordEnter() {
  if (agreed.value) {
    formRef.value?.validate().then(() => {
      handleFinish({ account: formState.account, password: formState.password })
    })
  }
}

function handleForgotPassword() {}

async function handleFinish(values: { account: string; password: string }) {
  if (!agreed.value) return
  emit("submit", values)
}
</script>

<style lang="less" scoped>
.login-form-wrapper {
  .flex-center();
  .flex-column();
  width: 45%;
  height: 100%;
  padding: @spacing-3xl;
  background: @login-form-bg;
}

.login-form-container {
  width: 100%;
  max-width: @login-form-width;
}

.form-header {
  margin-bottom: @spacing-3xl;
}

.form-logo {
  margin-bottom: @spacing-xl;
}

.form-welcome {
  color: @text-color;
  font-size: @font-size-hero;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0 0 @spacing-sm;
}

.form-description {
  color: @text-color-secondary;
  font-size: @font-size-base;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  :deep(.ant-form-item-label > label) {
    font-weight: 500;
    color: @text-color;
  }

  :deep(.ant-input-affix-wrapper) {
    padding: 8px 12px;
    border-radius: @border-radius-lg;
    border: 1px solid @border-color;
    transition: all 0.3s ease;

    &:hover {
      border-color: @primary-color;
    }

    &.ant-input-affix-wrapper-focused {
      border-color: @primary-color;
      box-shadow: @shadow-input-focus;
    }
  }

  :deep(.ant-input) {
    font-size: @font-size-base;

    &::placeholder {
      color: @text-color-disabled;
    }
  }

  :deep(.ant-form-item-explain-error) {
    font-size: @font-size-sm;
    margin-top: 4px;
  }

  :deep(.ant-form-item-with-help) {
    margin-bottom: @spacing-lg;
  }
}

.input-icon {
  color: @text-color-disabled;
  font-size: @font-size-lg;
}

.form-item {
  margin-bottom: @spacing-lg;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  .pointer();
  color: @text-color-disabled;
  font-size: @font-size-lg;
  z-index: 10;
  transition: color 0.3s ease;

  &:hover {
    color: @text-color-secondary;
  }
}

.form-row-between {
  .flex-between();
  margin-bottom: @spacing-xl;
}

.agreement-checkbox {
  :deep(.ant-checkbox) {
    margin-top: -1px;
  }
}

.agreement-text {
  font-size: @font-size-sm;
  color: @text-color-secondary;
}

.agreement-link {
  color: @primary-color;
  .pointer();

  &:hover {
    text-decoration: underline;
  }
}

.forgot-link {
  font-size: @font-size-sm;
  color: @primary-color;
  .pointer();
  white-space: nowrap;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.form-submit-item {
  margin-bottom: 0;
}

.login-btn {
  height: 44px;
  font-size: @font-size-lg;
  font-weight: 600;
  border-radius: @border-radius-lg;
  border: none;
  background: linear-gradient(135deg, @login-btn-gradient-start, @login-btn-gradient-end);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(24, 144, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    background: linear-gradient(135deg, @login-btn-gradient-start, @login-btn-gradient-end);
  }
}

@media (max-width: 991px) {
  .login-form-wrapper {
    width: 60%;
    padding: @spacing-xl;
  }
}

@media (max-width: 767px) {
  .login-form-wrapper {
    width: 100%;
    padding: @spacing-xl @spacing-lg;
  }

  .login-form-container {
    max-width: 400px;
  }
}
</style>
