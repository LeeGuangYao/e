<template>
  <div class="login-page">
    <BrandPanel />
    <LoginForm :loading="loading" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import BrandPanel from "./components/brand-panel.vue"
import LoginForm from "./components/login-form.vue"
import { apiAuthLogin } from "@/api/auth"
import { hex_sha1 } from "@/composables/login/sha1"
import { useUserStore } from "@/stores/useUserStore"

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

async function handleSubmit(values: { account: string; password: string }) {
  loading.value = true
  try {
    const data = await apiAuthLogin({
      UserName: values.account,
      Password: hex_sha1(values.password),
    })
    userStore.setToken(data.Token)
    const redirect = (router.currentRoute.value.query.redirect as string) || "/home"
    router.push(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.login-page {
  .flex-row();
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 767px) {
  .login-page {
    .flex-center();
  }
}
</style>
