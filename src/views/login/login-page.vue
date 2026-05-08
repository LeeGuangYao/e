<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">{{ $t("login.title") }}</h2>
      <a-form :model="formState" layout="vertical" @finish="handleLogin">
        <a-form-item :label="$t('login.username')" name="username" :rules="[{ required: true, message: $t('login.usernameRequired') }]">
          <a-input v-model:value="formState.username" :placeholder="$t('login.usernamePlaceholder')" size="large" />
        </a-form-item>
        <a-form-item :label="$t('login.password')" name="password" :rules="[{ required: true, message: $t('login.passwordRequired') }]">
          <a-input-password v-model:value="formState.password" :placeholder="$t('login.passwordPlaceholder')" size="large" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            {{ $t("login.submit") }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter, useRoute } from "vue-router"
import { message } from "ant-design-vue"
import { useUserStore } from "@/stores/useUserStore"
import { apiAuthLogin } from "@/api/auth/index"
import { $t } from "@/i18n"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const formState = reactive({
  username: "",
  password: "",
})

async function handleLogin(): Promise<void> {
  loading.value = true
  try {
    const res = await apiAuthLogin({
      username: formState.username,
      password: formState.password,
    })
    userStore.setToken(res.token)
    userStore.setUser({
      userId: res.userId,
      username: res.username,
      email: "",
      avatar: "",
      permissions: [],
    })
    message.success($t("login.loginSuccess"))
    const redirect = (route.query.redirect as string) || "/"
    router.push(redirect)
  } catch {
    message.error($t("login.loginFailed"))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-page {
  .flex-center();
  width: 100%;
  height: 100vh;
  background-color: @bg-color-grey;
}

.login-card {
  width: 400px;
  padding: @spacing-xxl;
  background: @bg-color;
  border-radius: @border-radius-lg;
  box-shadow: @shadow-card;
}

.login-title {
  text-align: center;
  margin-bottom: @spacing-xl;
  color: @text-color;
  font-size: @font-size-xxl;
}
</style>
