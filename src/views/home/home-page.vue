<template>
  <div class="home-page">
    <div class="home-header">
      <h2>{{ $t("home.title") }}</h2>
    </div>
    <div class="home-content">
      <p>{{ $t("home.welcome") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.home-page {
  .flex-column();
  min-height: 100vh;
  padding: @spacing-3xl;
}

.home-header {
  margin-bottom: @spacing-xl;

  h2 {
    margin: 0;
    color: @text-color;
    font-size: @font-size-hero;
    font-weight: 700;
  }
}

.home-content {
  p {
    color: @text-color-secondary;
    font-size: @font-size-lg;
  }
}
</style>
