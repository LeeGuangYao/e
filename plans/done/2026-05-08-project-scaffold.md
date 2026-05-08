# Plan: 商旅系统项目脚手架搭建

- 状态：已完成
- 对应 spec：`specs/done/2026-05-08-01.md`
- 日期：2026-05-08

---

## 总体思路

用 create-vue 生成 Vue 3 + TS + Router + Pinia 基础项目，然后按 project.md 规范改造目录结构、补充 HRequest 完整封装、自研 i18n、Less 样式体系、ESLint/Prettier/Husky/commitlint 配置，最后添加登录模块验证全链路。

## 影响范围

- 涉及文件 / 模块：整个 `src/` 目录、根目录配置文件
- 是否影响 `architecture/project.md`：否
- 是否产生新的 ADR：是（0001-self-i18n）

## 实施步骤

- [x] 1. create-vue 脚手架生成
- [x] 2. 安装额外依赖（axios、antdv、@vueuse/core、dayjs、decimal.js、less、husky、commitlint 等）
- [x] 3. 目录结构改造（按 project.md 创建目录，清理默认示例文件）
- [x] 4. Vite 配置（unplugin-vue-components、auto-import、alias、Less 全局变量+mixin 注入）
- [x] 5. TypeScript 配置（strict:true、路径别名、排除自动生成声明文件）
- [x] 6. ESLint + Prettier（flat/recommended、prettier 规范按 project.md）
- [x] 7. Husky + lint-staged + commitlint（pre-commit、commit-msg hooks）
- [x] 8. Less 样式体系（variable/mixin/reset/base/theme/transition/cover-antdv/index 入口）
- [x] 9. HRequest 完整封装（拦截器、Token 注入、错误码映射、重复请求取消、Toast、重试、alwaysPass）
- [x] 10. 自研 i18n 完整实现（$t 函数、语言切换、4 种语言文件、全局属性注册）
- [x] 11. Pinia Stores（useUserStore、useAppStore）
- [x] 12. 路由配置（loginRoute、userRoute、导航守卫）
- [x] 13. 登录模块示例（auth API、login-page.vue）
- [x] 14. App.vue 和 main.ts 入口
- [x] 15. 环境变量与 .gitignore
- [x] 16. 类型声明补全
- [x] 17. 全链路验证（typecheck ✅、lint ✅、build ✅、dev ✅、test ✅）
- [x] 18. 归档与同步

## 风险与回滚

- create-vue 生成了较新版本（Vite 8、Vue 3.5、Pinia 3、vue-router 5、ESLint 10 flat config），已适配
- Less additionalData 需同时注入 variable.less 和 mixin.less，否则组件内 mixin 调用报错
- eslint flat config 中 `...pluginVue.configs["flat/recommended"]` 展开与 `withVueTs` 类型不兼容，改用直接数组导出

## 完成后必做（归档与同步）

- [x] 本 plan 移动到 `plans/done/`
- [x] 对应 spec 移动到 `specs/done/`
- [x] 更新 `progress.md`
- [x] 新增 `decisions/0001-self-i18n.md` 并更新 `decisions/README.md`
