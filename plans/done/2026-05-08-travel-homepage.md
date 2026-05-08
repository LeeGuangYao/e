# Plan: 差旅首页设计与实现

- 状态：已完成
- 对应 spec：`specs/2026-05-08-06.md`
- 日期：2026-05-08

---

## 方案讨论

制定本 plan 过程中的问答，保留技术决策上下文。

| # | 问题 | 回答 | 影响 |
|---|------|------|------|
| 1 | Tab 样式方案 | 下划线式（类 Linear/Notion） | 自研 Tab 组件，不用 AntDV Tabs |
| 2 | 日期选择器方案 | AntDV DatePicker + 主题定制 | 减少开发量，保持风格统一 |
| 3 | 城市选择方案 | 输入框 + 下拉搜索列表 | 自研城市搜索组件 |

## 总体思路

重构 `home-page.vue` 为全屏差旅预订首页。页面结构：全屏渐变/抽象背景 → 垂直居中大白色毛玻璃卡片 → 卡片内含下划线式 Tab（机票/酒店/火车票）→ 各 Tab 对应表单 → 品牌渐变搜索按钮。城市选择用自定义输入框+下拉搜索，日期用 AntDV DatePicker，城市互换有旋转动画。所有文案走 i18n。

## 影响范围

- 涉及文件 / 模块：
  - `src/views/home/home-page.vue` —— 主要重构目标
  - `src/views/home/components/` —— 新增子组件目录
  - `src/components/home/` —— 新增业务组件
  - `src/styles/variable.less` —— 新增首页相关变量
  - `src/i18n/locales/*.ts` —— 新增首页 i18n 文案
- 是否影响 `architecture/project.md`：否
- 是否产生新的 ADR：否

## 实施步骤

- [x] 1. 在 `styles/variable.less` 中新增首页相关 Less 变量
- [x] 2. 在 `i18n/locales/*.ts` 中新增首页文案
- [x] 3. 创建 `booking-tabs.vue` —— 下划线式 Tab 切换
- [x] 4. 新建 `flight-form.vue` —— 机票表单
- [x] 5. 新建 `hotel-form.vue` —— 酒店表单
- [x] 6. 新建 `train-form.vue` —— 火车票表单
- [x] 7. 新建 `c-city-select.vue` —— 城市搜索组件
- [x] 8. 新建 `c-city-swap.vue` —— 城市互换按钮
- [x] 9. 重构 `home-page.vue` —— 完整布局
- [x] 10. 验证：lint + typecheck + build 通过

## 风险与回滚

- AntDV DatePicker 样式覆盖可能需要额外处理
- 城市下拉定位在卡片内需处理 overflow
- 回滚：git revert，恢复原 `home-page.vue`

## 改动总结

- `src/styles/variable.less`：新增首页背景渐变、卡片、输入框、按钮、Tab 等相关 Less 变量
- `src/i18n/locales/zh.ts`：新增首页 Tab、表单标签、搜索按钮等中文文案
- `src/i18n/locales/en.ts`：新增首页英文文案
- `src/i18n/locales/tw.ts`：新增首页繁体中文文案
- `src/i18n/locales/jp.ts`：新增首页日文文案
- `src/views/home/components/booking-tabs.vue`：新建下划线式 Tab 切换组件（含滑块动画指示器）
- `src/views/home/components/flight-form.vue`：新建机票预订表单（出发城市、到达城市、日期、城市互换）
- `src/views/home/components/hotel-form.vue`：新建酒店预订表单（入住城市、入住日期、离店日期）
- `src/views/home/components/train-form.vue`：新建火车票预订表单（出发城市、到达城市、出发日期、城市互换）
- `src/components/home/c-city-select.vue`：新建城市搜索输入框+下拉搜索组件
- `src/components/home/c-city-swap.vue`：新建城市互换按钮组件（旋转动画）
- `src/views/home/home-page.vue`：完整重构为全屏渐变背景+居中毛玻璃卡片+Tab+表单+渐变搜索按钮

## 完成后必做（归档与同步）

- [x] 本 plan 移动到 `plans/done/`
- [x] 对应 spec 移动到 `specs/done/`
- [x] 更新 `progress.md`
