# Plan: 登录页面现代化重构

- 状态：已完成
- 对应 spec：`specs/2026-05-08-02.md`
- 日期：2026-05-08

---

## 总体思路

将现有简陋的居中卡片式登录页面，重构为左/右分屏的现代化企业级登录页。左侧为品牌展示区（深色渐变 + CSS 动态几何图形 + 品牌文案），右侧为登录表单区（含完整校验逻辑、密码强度条、用户协议勾选、忘记密码链接、响应式适配）。不写任何 API 请求，只做前端交互。

## 影响范围

- 涉及文件 / 模块：
  - `src/views/login/login-page.vue` —— 完全重写
  - `src/views/login/components/brand-panel.vue` —— 新增（左侧品牌区）
  - `src/views/login/components/login-form.vue` —— 新增（右侧表单区）
  - `src/views/login/components/password-strength.vue` —— 新增（密码强度条）
  - `src/i18n/locales/{zh,en,tw,jp}.ts` —— 扩充登录文案
  - `src/styles/variable.less` —— 新增登录页专用变量
  - `src/styles/transition.less` —— 新增动画
- 是否影响 `architecture/project.md`：否
- 是否产生新的 ADR：否

## 实施步骤

- [x] 1. 扩展 Less 变量与动画
- [x] 2. 扩展 i18n 四语言文件
- [x] 3. 创建 brand-panel.vue
- [x] 4. 创建 password-strength.vue
- [x] 5. 创建 login-form.vue
- [x] 6. 重写 login-page.vue
- [x] 7. 验证：typecheck + lint + build 通过

## 完成后必做（归档与同步）

- [x] 本 plan 移动到 `plans/done/`
- [x] 对应 spec 移动到 `specs/done/`
- [x] 更新 `progress.md`
