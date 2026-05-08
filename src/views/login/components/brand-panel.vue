<template>
  <div class="brand-panel">
    <div class="brand-bg-shapes">
      <div class="shape shape-circle-1"></div>
      <div class="shape shape-circle-2"></div>
      <div class="shape shape-hex-1"></div>
      <div class="shape shape-line-1"></div>
      <div class="shape shape-line-2"></div>
      <div class="shape shape-dot-1"></div>
      <div class="shape shape-dot-2"></div>
    </div>
    <div class="brand-content">
      <div class="brand-logo-area fade-in-up">
        <div class="brand-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.15)" />
            <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.1)" />
            <circle cx="24" cy="24" r="4" fill="white" />
          </svg>
        </div>
        <h1 class="brand-name">{{ $t("login.title") }}</h1>
      </div>
      <h2 class="brand-slogan fade-in-up-delay-1">{{ $t("login.brandSlogan") }}</h2>
      <p class="brand-desc fade-in-up-delay-2">{{ $t("login.brandDescription") }}</p>
      <div class="brand-features fade-in-up-delay-3">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span class="feature-text">机票预订</span>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          </div>
          <span class="feature-text">酒店预订</span>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 12h4M14 12h4" />
            </svg>
          </div>
          <span class="feature-text">火车票</span>
        </div>
      </div>
    </div>
    <div class="brand-footer fade-in-up-delay-3">
      <span>&copy; 2026 商旅管理系统</span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.brand-panel {
  .flex-column();
  position: relative;
  width: 55%;
  height: 100%;
  padding: @spacing-3xl;
  background: linear-gradient(135deg, @login-brand-gradient-start 0%, @login-brand-gradient-mid 50%, @login-brand-gradient-end 100%);
  overflow: hidden;
}

.brand-bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
}

.shape-circle-1 {
  width: 300px;
  height: 300px;
  top: -80px;
  right: -60px;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.15) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite;
}

.shape-circle-2 {
  width: 200px;
  height: 200px;
  bottom: 60px;
  left: -40px;
  background: radial-gradient(circle, rgba(114, 46, 209, 0.2) 0%, transparent 70%);
  animation: floatReverse 10s ease-in-out infinite;
}

.shape-hex-1 {
  width: 120px;
  height: 120px;
  top: 40%;
  right: 15%;
  border-radius: 0;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transform: rotate(30deg);
  animation: float 12s ease-in-out infinite;

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.shape-line-1 {
  width: 160px;
  height: 1px;
  top: 25%;
  left: 10%;
  border-radius: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: pulse 6s ease-in-out infinite;
}

.shape-line-2 {
  width: 120px;
  height: 1px;
  bottom: 30%;
  right: 20%;
  border-radius: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: pulse 8s ease-in-out 2s infinite;
}

.shape-dot-1 {
  width: 6px;
  height: 6px;
  top: 20%;
  right: 30%;
  background: rgba(255, 255, 255, 0.2);
  animation: pulse 4s ease-in-out infinite;
}

.shape-dot-2 {
  width: 4px;
  height: 4px;
  bottom: 40%;
  left: 25%;
  background: rgba(255, 255, 255, 0.15);
  animation: pulse 5s ease-in-out 1s infinite;
}

.brand-content {
  .flex-column();
  position: relative;
  z-index: 1;
  flex: 1;
  justify-content: center;
}

.brand-logo-area {
  .flex-row();
  align-items: center;
  gap: @spacing-lg;
  margin-bottom: @spacing-xl;
}

.brand-logo {
  .flex-center();
  width: 56px;
  height: 56px;
  border-radius: @border-radius-xl;
  background: @login-brand-card-bg;
  backdrop-filter: blur(12px);
}

.brand-name {
  color: @login-brand-text-color;
  font-size: @font-size-hero;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
}

.brand-slogan {
  color: @login-brand-text-color;
  font-size: @font-size-3xl;
  font-weight: 600;
  margin: 0 0 @spacing-md;
  line-height: 1.3;
}

.brand-desc {
  color: @login-brand-text-secondary;
  font-size: @font-size-base;
  line-height: 1.6;
  margin: 0 0 @spacing-3xl;
  max-width: 380px;
}

.brand-features {
  .flex-row();
  gap: @spacing-lg;
}

.feature-card {
  .flex-column();
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-lg @spacing-xl;
  background: @login-brand-card-bg;
  backdrop-filter: blur(12px);
  border-radius: @border-radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
}

.feature-icon {
  .flex-center();
  color: @login-brand-text-secondary;
}

.feature-text {
  color: @login-brand-text-secondary;
  font-size: @font-size-sm;
  white-space: nowrap;
}

.brand-footer {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.3);
  font-size: @font-size-xs;
}

@media (max-width: 991px) {
  .brand-panel {
    width: 40%;
    padding: @spacing-xl;
  }

  .brand-slogan {
    font-size: @font-size-xxl;
  }

  .brand-features {
    .flex-column();
    gap: @spacing-sm;
  }

  .feature-card {
    .flex-row();
    padding: @spacing-sm @spacing-lg;
  }
}

@media (max-width: 767px) {
  .brand-panel {
    display: none;
  }
}
</style>
