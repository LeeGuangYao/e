<template>
  <div ref="selectRef" class="c-city-select">
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
      <div v-if="showPanel" class="city-panel">
        <div v-if="modelValue" class="city-panel-search-results">
          <div v-if="searching" class="city-panel-empty">
            <LoadingOutlined class="city-search-loading" />
            <span>{{ $t("home.citySearchLoading") }}</span>
          </div>
          <template v-else-if="searchResults.length > 0">
            <div
              v-for="city in searchResults"
              :key="city.code"
              class="city-option"
              @mousedown.prevent="onSelect(city)"
            >
              <span class="city-option-name">{{ city.name }}</span>
              <span class="city-option-code">{{ city.code }}</span>
            </div>
          </template>
          <div v-else class="city-panel-empty">{{ $t("home.noCityResult") }}</div>
        </div>
        <template v-else>
          <div v-if="cityStore.recentCities.length > 0" class="city-panel-section">
            <div class="city-section-title">{{ $t("home.recentCities") }}</div>
            <div class="city-hot-tags">
              <span
                v-for="city in cityStore.recentCities"
                :key="city.code"
                class="city-hot-tag"
                @mousedown.prevent="onSelect(city)"
              >
                {{ city.name }}
              </span>
            </div>
          </div>
          <div v-if="cityStore.hotCities.length > 0" class="city-panel-section">
            <div class="city-section-title">{{ $t("home.hotCities") }}</div>
            <div class="city-hot-tags">
              <span
                v-for="city in cityStore.hotCities"
                :key="city.code"
                class="city-hot-tag"
                @mousedown.prevent="onSelect(city)"
              >
                {{ city.name }}
              </span>
            </div>
          </div>
          <div class="city-panel-section city-panel-groups">
            <div v-for="group in cityStore.cityGroups" :key="group.letter" :data-letter="group.letter" class="city-group">
              <div class="city-group-letter">{{ group.letter }}</div>
              <div class="city-group-list">
                <div
                  v-for="city in group.cities"
                  :key="city.code"
                  class="city-option"
                  @mousedown.prevent="onSelect(city)"
                >
                  <span class="city-option-name">{{ city.name }}</span>
                  <span class="city-option-code">{{ city.code }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="city-letter-index">
            <span
              v-for="group in cityStore.cityGroups"
              :key="group.letter"
              class="city-letter-item"
              @mousedown.prevent="scrollToLetter(group.letter)"
            >
              {{ group.letter }}
            </span>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { EnvironmentOutlined, LoadingOutlined } from "@ant-design/icons-vue"
import { useCityStore } from "@/stores/useCityStore"
import { useCitySearch } from "@/composables/useCitySearch"
import type { CityItem } from "@/types/city"

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    countryType?: number
  }>(),
  {
    placeholder: "",
    countryType: 1,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "select", city: CityItem): void
}>()

const cityStore = useCityStore()
const keyword = ref("")
const { results: searchResults, searching } = useCitySearch(keyword, props.countryType)

const showPanel = ref(false)
const selectRef = ref<HTMLElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val
  }
)

function onFocus() {
  showPanel.value = true
  cityStore.fetchCityList()
}

function onBlur() {
  setTimeout(() => {
    showPanel.value = false
  }, 150)
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit("update:modelValue", val)
  keyword.value = val
}

function onSelect(city: CityItem) {
  emit("update:modelValue", city.name)
  emit("select", city)
  cityStore.addRecentCity(city)
  showPanel.value = false
}

function scrollToLetter(letter: string) {
  const panel = selectRef.value?.querySelector(".city-panel-groups")
  if (!panel) return
  const target = panel.querySelector(`[data-letter="${letter}"]`) as HTMLElement | null
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }
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

.city-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: @city-panel-width;
  background: @city-panel-bg;
  border-radius: @city-panel-border-radius;
  box-shadow: @city-panel-shadow;
  z-index: 100;
  max-height: @city-panel-max-height;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.city-panel-search-results {
  overflow-y: auto;
  max-height: @city-panel-max-height;
  padding: @spacing-xs 0;
}

.city-panel-section {
  padding: 0 @city-panel-padding;
  margin-bottom: @city-section-gap;

  &:last-child {
    margin-bottom: 0;
  }
}

.city-section-title {
  font-size: @city-section-title-font-size;
  color: @city-group-letter-color;
  font-weight: 500;
  margin-bottom: @spacing-sm;
}

.city-hot-tags {
  .flex-row();
  flex-wrap: wrap;
  gap: @spacing-sm;
}

.city-hot-tag {
  .pointer();
  display: inline-block;
  padding: @city-hot-tag-padding;
  background: @city-hot-tag-bg;
  color: @city-hot-tag-color;
  border-radius: @city-hot-tag-border-radius;
  font-size: @city-hot-tag-font-size;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: darken(@city-hot-tag-bg, 5%);
  }
}

.city-panel-groups {
  overflow-y: auto;
  flex: 1;
  padding-bottom: @spacing-md;
  position: relative;
}

.city-group {
  margin-bottom: @spacing-md;

  &:last-child {
    margin-bottom: 0;
  }
}

.city-group-letter {
  font-size: @city-group-letter-font-size;
  color: @city-group-letter-color;
  font-weight: 600;
  padding: @spacing-xs 0;
  position: sticky;
  top: 0;
  background: @city-panel-bg;
  z-index: 1;
}

.city-group-list {
  .flex-column();
}

.city-option {
  .flex-between();
  .pointer();
  padding: @spacing-sm @spacing-lg;
  margin: 0 -@city-panel-padding;
  padding-left: @city-panel-padding;
  padding-right: @city-panel-padding;
  transition: background 0.2s ease;

  &:hover {
    background: @city-option-hover-bg;
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

.city-letter-index {
  position: absolute;
  right: 2px;
  top: 0;
  bottom: 0;
  width: @city-letter-index-width;
  .flex-column();
  .flex-center();
  gap: 1px;
  padding: @spacing-xs 0;
  z-index: 2;
}

.city-letter-item {
  .pointer();
  font-size: @city-letter-index-font-size;
  color: @city-group-letter-color;
  text-align: center;
  line-height: 1.4;
  transition: color 0.2s ease;

  &:hover {
    color: @city-option-active-color;
    font-weight: 600;
  }
}

.city-panel-empty {
  .flex-center();
  .flex-row();
  gap: @spacing-sm;
  padding: @spacing-xl;
  color: @text-color-secondary;
  font-size: @font-size-sm;
}

.city-search-loading {
  font-size: @city-search-loading-size;
  color: @primary-color;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

@media (max-width: 768px) {
  .city-panel {
    width: calc(100vw - 32px);
    left: -8px;
    max-height: 320px;
  }

  .city-letter-index {
    display: none;
  }
}
</style>
