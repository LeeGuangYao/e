<template>
  <div class="hotel-form">
    <div class="form-row">
      <div class="form-field">
        <label class="form-label">{{ $t("home.checkInCity") }}</label>
        <CCitySelect
          v-model="checkInCity"
          :placeholder="$t('home.checkInCityPlaceholder')"
          :cities="cityList"
          @select="onCitySelect"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-field">
        <label class="form-label">{{ $t("home.checkInDate") }}</label>
        <a-date-picker
          v-model:value="checkInDate"
          :placeholder="$t('home.checkInDatePlaceholder')"
          class="form-date-picker"
          :disabled-date="disabledCheckInDate"
        />
      </div>
      <div class="form-field">
        <label class="form-label">{{ $t("home.checkOutDate") }}</label>
        <a-date-picker
          v-model:value="checkOutDate"
          :placeholder="$t('home.checkOutDatePlaceholder')"
          class="form-date-picker"
          :disabled-date="disabledCheckOutDate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import dayjs, { type Dayjs } from "dayjs"
import CCitySelect from "@/components/home/c-city-select.vue"
import type { CityItem } from "@/components/home/c-city-select.vue"

const checkInCity = ref("")
const checkInDate = ref<Dayjs | null>(null)
const checkOutDate = ref<Dayjs | null>(null)

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

function onCitySelect(city: CityItem) {
  checkInCity.value = city.name
}

function disabledCheckInDate(current: Dayjs) {
  return current && current < dayjs().startOf("day")
}

function disabledCheckOutDate(current: Dayjs) {
  if (!current) return false
  const minDate = checkInDate.value ? checkInDate.value.add(1, "day") : dayjs().add(1, "day")
  return current < minDate.startOf("day")
}

watch(checkInDate, (val) => {
  if (val && checkOutDate.value && !checkOutDate.value.isAfter(val, "day")) {
    checkOutDate.value = val.add(1, "day")
  }
})
</script>

<style lang="less" scoped>
.hotel-form {
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
