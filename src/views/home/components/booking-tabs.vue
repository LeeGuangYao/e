<template>
  <div class="booking-tabs">
    <div
      v-for="(tab, idx) in tabs"
      :key="tab.key"
      :ref="(el) => setTabRef(idx, el as HTMLElement)"
      class="booking-tab"
      :class="{ active: modelValue === tab.key }"
      @click="onSelect(tab.key)"
    >
      <component :is="tab.icon" v-if="tab.icon" class="booking-tab-icon" />
      <span class="booking-tab-label">{{ tab.label }}</span>
    </div>
    <div class="booking-tab-indicator" :style="indicatorStyle" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue"
import { useI18n } from "@/i18n"

export type TabKey = "flight" | "hotel" | "train"

const props = defineProps<{
  modelValue: TabKey
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: TabKey): void
}>()

const { $t } = useI18n()

const tabs = computed(() => [
  { key: "flight" as TabKey, label: $t("home.tabFlight"), icon: null },
  { key: "hotel" as TabKey, label: $t("home.tabHotel"), icon: null },
  { key: "train" as TabKey, label: $t("home.tabTrain"), icon: null },
])

const tabElMap = ref<Map<number, HTMLElement>>(new Map())
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

function setTabRef(idx: number, el: HTMLElement | null) {
  if (el) {
    tabElMap.value.set(idx, el)
  }
}

function onSelect(key: TabKey) {
  emit("update:modelValue", key)
}

const indicatorStyle = computed(() => ({
  left: `${indicatorLeft.value}px`,
  width: `${indicatorWidth.value}px`,
}))

function updateIndicator() {
  const idx = tabs.value.findIndex((t) => t.key === props.modelValue)
  const el = tabElMap.value.get(idx)
  if (el) {
    indicatorLeft.value = el.offsetLeft
    indicatorWidth.value = el.offsetWidth
  }
}

watch(() => props.modelValue, () => nextTick(updateIndicator))
onMounted(() => nextTick(updateIndicator))
</script>

<style lang="less" scoped>
.booking-tabs {
  position: relative;
  display: flex;
  gap: @spacing-xxl;
  border-bottom: 1px solid @border-color-light;
  padding-bottom: 0;
  margin-bottom: @spacing-xxl;
}

.booking-tab {
  .flex-center();
  .pointer();
  gap: @spacing-sm;
  padding: @spacing-md 0;
  color: @text-color-secondary;
  font-size: @font-size-lg;
  font-weight: 500;
  transition: color 0.3s ease;
  user-select: none;

  &:hover {
    color: @text-color;
  }

  &.active {
    color: @home-tab-active-color;
    font-weight: 600;
  }
}

.booking-tab-icon {
  font-size: @font-size-lg;
}

.booking-tab-label {
  white-space: nowrap;
}

.booking-tab-indicator {
  position: absolute;
  bottom: -1px;
  height: @home-tab-underline-height;
  background: @home-tab-active-color;
  border-radius: 2px;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
