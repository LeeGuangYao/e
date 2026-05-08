<template>
  <div class="login-page">
    <BrandPanel />
    <LoginForm @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import BrandPanel from "./components/brand-panel.vue"
import LoginForm from "./components/login-form.vue"

function handleSubmit(values: { account: string; password: string }) {
  console.log("login submit:", values)
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
