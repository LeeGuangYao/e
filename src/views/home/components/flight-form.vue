<template>
  <div class="flight-form">
    <div class="form-row">
      <div class="form-field">
        <label class="form-label">{{ $t("home.departureCity") }}</label>
        <CCitySelect
          v-model="departureCity"
          :placeholder="$t('home.departureCityPlaceholder')"
          :cities="cityList"
          @select="onDepartureSelect"
        />
      </div>
      <CCitySwap @swap="onSwap" />
      <div class="form-field">
        <label class="form-label">{{ $t("home.arrivalCity") }}</label>
        <CCitySelect
          v-model="arrivalCity"
          :placeholder="$t('home.arrivalCityPlaceholder')"
          :cities="cityList"
          @select="onArrivalSelect"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label class="form-label">{{ $t("home.departureDate") }}</label>
        <a-date-picker
          v-model:value="departureDate"
          :placeholder="$t('home.departureDatePlaceholder')"
          class="form-date-picker"
          :disabled-date="disabledDate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import dayjs, { type Dayjs } from "dayjs"
import CCitySelect from "@/components/home/c-city-select.vue"
import type { CityItem } from "@/components/home/c-city-select.vue"
import CCitySwap from "@/components/home/c-city-swap.vue"

const departureCity = ref("")
const arrivalCity = ref("")
const departureDate = ref<Dayjs | null>(null)

const cityList = ref<CityItem[]>([
  { name: "北京", code: "PEK" },
  { name: "上海", code: "SHA" },
  { name: "广州", code: "CAN" },
  { name: "深圳", code: "SZX" },
  { name: "成都", code: "CTU" },
  { name: "杭州", code: "HGH" },
  { name: "武汉", code: "WUH" },
  { name: "西安", code: "XIY" },
  { name: "重庆", code: "CKG" },
  { name: "南京", code: "NKG" },
  { name: "长沙", code: "CSX" },
  { name: "青岛", code: "TAO" },
  { name: "厦门", code: "XMN" },
  { name: "昆明", code: "KMG" },
  { name: "大连", code: "DLC" },
  { name: "天津", code: "TSN" },
  { name: "郑州", code: "CGO" },
  { name: "三亚", code: "SYX" },
  { name: "哈尔滨", code: "HRB" },
  { name: "贵阳", code: "KWE" },
])

function onSwap() {
  const temp = departureCity.value
  departureCity.value = arrivalCity.value
  arrivalCity.value = temp
}

function onDepartureSelect(city: CityItem) {
  departureCity.value = city.name
}

function onArrivalSelect(city: CityItem) {
  arrivalCity.value = city.name
}

function disabledDate(current: Dayjs) {
  return current && current < dayjs().startOf("day")
}
</script>

<style lang="less" scoped>
.flight-form {
  .flex-column();
  gap: @spacing-xl;
}

.form-row {
  .flex-row();
  .flex-center();
  gap: @spacing-md;
}

.form-field {
  .flex-column();
  flex: 1;
  gap: @spacing-sm;
}

.form-label {
  font-size: @font-size-sm;
  font-weight: 500;
  color: @text-color-secondary;
}

.form-date-picker {
  width: 100%;
  height: @home-input-height !important;

  :deep(.ant-input) {
    height: @home-input-height !important;
    border-radius: @home-input-border-radius !important;
    background: @home-input-bg !important;
    border: 1px solid @home-input-border !important;
    font-size: @font-size-base !important;
  }

  :deep(.ant-picker) {
    height: @home-input-height !important;
    border-radius: @home-input-border-radius !important;
    background: @home-input-bg !important;
    border: 1px solid @home-input-border !important;
    width: 100%;
    transition: all 0.3s ease;

    &:hover {
      border-color: @primary-color !important;
    }

    &.ant-picker-focused {
      border-color: @home-input-focus-border !important;
      box-shadow: @shadow-input-focus !important;
    }
  }
}
</style>
