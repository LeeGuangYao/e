<template>
  <div class="home-page">
    <div class="home-bg">
      <div class="bg-gradient" />
      <div class="bg-orb bg-orb-1" />
      <div class="bg-orb bg-orb-2" />
      <div class="bg-orb bg-orb-3" />
      <div class="bg-grid" />
    </div>

    <div class="home-content">
      <div class="booking-card fade-in-up">
        <BookingTabs v-model="activeTab" />

        <div class="booking-form-wrapper">
          <Transition name="form-switch" mode="out-in">
            <FlightForm v-if="activeTab === 'flight'" key="flight" />
            <HotelForm v-else-if="activeTab === 'hotel'" key="hotel" />
            <TrainForm v-else-if="activeTab === 'train'" key="train" />
          </Transition>
        </div>

        <button class="search-btn" @click="onSearch">
          <SearchOutlined class="search-btn-icon" />
          <span>{{ $t("home.search") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { SearchOutlined } from "@ant-design/icons-vue"
import BookingTabs from "./components/booking-tabs.vue"
import type { TabKey } from "./components/booking-tabs.vue"
import FlightForm from "./components/flight-form.vue"
import HotelForm from "./components/hotel-form.vue"
import TrainForm from "./components/train-form.vue"

const activeTab = ref<TabKey>("flight")

function onSearch() {
  // TODO: 接入搜索逻辑
}
</script>

<style lang="less" scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.home-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, @home-bg-gradient-start 0%, @home-bg-gradient-mid 50%, @home-bg-gradient-end 100%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.bg-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.3), transparent);
  top: -10%;
  right: -5%;
  animation-delay: 0s;
}

.bg-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(114, 46, 209, 0.25), transparent);
  bottom: -5%;
  left: -5%;
  animation-delay: -7s;
}

.bg-orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.2), transparent);
  top: 40%;
  left: 30%;
  animation-delay: -14s;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.home-content {
  position: relative;
  z-index: 1;
  .flex-center();
  min-height: 100vh;
  padding: @spacing-3xl;
}

.booking-card {
  width: @home-card-width;
  max-width: 100%;
  background: @home-card-bg;
  border-radius: @home-card-border-radius;
  box-shadow: @home-card-shadow;
  padding: @spacing-3xl;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.booking-form-wrapper {
  min-height: 160px;
  position: relative;
}

.search-btn {
  .flex-center();
  .pointer();
  gap: @spacing-sm;
  width: 100%;
  height: @home-btn-height;
  margin-top: @spacing-3xl;
  border: none;
  border-radius: @home-btn-border-radius;
  background: linear-gradient(135deg, @home-btn-gradient-start 0%, @home-btn-gradient-end 100%);
  color: #fff;
  font-size: @font-size-xl;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(24, 144, 255, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
  }
}

.search-btn-icon {
  font-size: @font-size-xl;
}

.form-switch-enter-active {
  transition: all 0.3s ease-out;
}

.form-switch-leave-active {
  transition: all 0.2s ease-in;
}

.form-switch-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.form-switch-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-30px) translateX(10px);
  }
  50% {
    transform: translateY(-15px) translateX(-10px);
  }
  75% {
    transform: translateY(-40px) translateX(5px);
  }
}
</style>
