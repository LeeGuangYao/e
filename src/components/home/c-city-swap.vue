<template>
  <div class="c-city-swap" :class="{ rotating: isRotating }" @click="handleSwap">
    <SwapOutlined class="swap-icon" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { SwapOutlined } from "@ant-design/icons-vue"

const emit = defineEmits<{
  (e: "swap"): void
}>()

const isRotating = ref(false)

function handleSwap() {
  if (isRotating.value) return
  isRotating.value = true
  emit("swap")
  setTimeout(() => {
    isRotating.value = false
  }, 400)
}
</script>

<style lang="less" scoped>
.c-city-swap {
  .flex-center();
  .pointer();
  width: @home-swap-btn-size;
  height: @home-swap-btn-size;
  border-radius: 50%;
  border: 1px solid @home-input-border;
  background: #fff;
  flex-shrink: 0;
  transition: all 0.3s ease;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }

  &.rotating .swap-icon {
    transform: rotate(180deg);
  }
}

.swap-icon {
  font-size: 16px;
  color: @text-color-secondary;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
