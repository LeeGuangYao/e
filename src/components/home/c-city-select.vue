<template>
  <div class="c-city-select">
    <a-input
      :value="modelValue"
      :placeholder="placeholder"
      class="city-input"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
    >
      <template #prefix>
        <EnvironmentOutlined class="city-input-prefix" />
      </template>
    </a-input>
    <Transition name="dropdown">
      <div v-if="showDropdown && filteredCities.length > 0" class="city-dropdown">
        <div
          v-for="city in filteredCities"
          :key="city.code"
          class="city-option"
          @mousedown.prevent="onSelect(city)"
        >
          <span class="city-option-name">{{ city.name }}</span>
          <span class="city-option-code">{{ city.code }}</span>
        </div>
      </div>
      <div v-else-if="showDropdown && modelValue && filteredCities.length === 0" class="city-dropdown city-dropdown-empty">
        {{ $t("home.noCityResult") }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { EnvironmentOutlined } from "@ant-design/icons-vue"

export interface CityItem {
  name: string
  code: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    cities?: CityItem[]
  }>(),
  {
    placeholder: "",
    cities: () => [],
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "select", city: CityItem): void
}>()

const showDropdown = ref(false)

const filteredCities = computed(() => {
  if (!props.modelValue) return props.cities.slice(0, 10)
  const keyword = props.modelValue.toLowerCase()
  return props.cities.filter(
    (c) => c.name.toLowerCase().includes(keyword) || c.code.toLowerCase().includes(keyword)
  ).slice(0, 10)
})

function onFocus() {
  showDropdown.value = true
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit("update:modelValue", val)
}

function onSelect(city: CityItem) {
  emit("update:modelValue", city.name)
  emit("select", city)
  showDropdown.value = false
}
</script>

<style lang="less" scoped>
.c-city-select {
  position: relative;
  flex: 1;
}

.city-input {
  height: @home-input-height !important;
  border-radius: @home-input-border-radius !important;
  background: @home-input-bg !important;
  border: 1px solid @home-input-border !important;
  font-size: @font-size-base !important;
  transition: all 0.3s ease !important;

  &:hover {
    border-color: @primary-color !important;
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: @home-input-focus-border !important;
    box-shadow: @shadow-input-focus !important;
  }

  :deep(.ant-input) {
    background: transparent !important;
  }
}

.city-input-prefix {
  color: @text-color-secondary;
  font-size: @font-size-lg;
}

.city-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: @home-input-border-radius;
  box-shadow: @shadow-base;
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  padding: @spacing-xs 0;
}

.city-dropdown-empty {
  .flex-center();
  padding: @spacing-xl;
  color: @text-color-secondary;
  font-size: @font-size-sm;
}

.city-option {
  .flex-between();
  .pointer();
  padding: @spacing-md @spacing-lg;
  transition: background 0.2s ease;

  &:hover {
    background: @home-input-bg;
  }
}

.city-option-name {
  color: @text-color;
  font-size: @font-size-base;
}

.city-option-code {
  color: @text-color-secondary;
  font-size: @font-size-sm;
}

.dropdown-enter-active {
  transition: all 0.25s ease;
}

.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
