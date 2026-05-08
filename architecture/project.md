# 项目世界观

> 本文件是 AI 写代码时的硬约束。任何修改架构、规则、依赖、目录、命名的操作都要**先**同步更新本文件，再改代码。
> 项目（Vue 3 + Vite + Pinia + Ant Design Vue + axios + Less）的工程实践，但形态精简为**单应用 + TypeScript**。

---

## 一、项目简介

> 项目面向B端用户，简称商旅系统，为商务出行的客户，预订机票、酒店、火车票。

---

## 二、技术栈

| 类别        | 选型                              | 备注                                                 |
| ----------- | --------------------------------- | ---------------------------------------------------- |
| 框架        | Vue 3.4+                          | 强制 `<script setup>` + Composition API              |
| 语言        | TypeScript 5.x                    | `strict: true` 严格模式                              |
| 构建工具    | Vite 5.x                          | 含 `vite-plugin-eslint` 开发期检查                   |
| 包管理器    | pnpm 9+                           | `package.json` 用 `packageManager` 字段锁定版本      |
| 路由        | vue-router 4.x                    | history 模式                                         |
| 状态管理    | Pinia 2.x                         | 组合式风格 `defineStore('name', () => {...})`        |
| HTTP        | axios 1.x                         | 自研 `HRequest` 函数封装（见第六章）                 |
| UI 组件库   | Ant Design Vue 4.x                | `unplugin-vue-components` 自动导入                   |
| 自动导入    | unplugin-auto-import              | 可选，自动导入 Vue / Pinia API                       |
| 图标        | @ant-design/icons-vue             | 与 AntDV 配套                                        |
| CSS 方案    | Less 4.x                          | `<style lang="less" scoped>`，禁止行内样式硬编码颜色 |
| 国际化      | 自研 i18N                         | 详见第十一章                                         |
| 工具库      | @vueuse/core、dayjs、decimal.js   | 按需引入                                             |
| 代码规范    | ESLint 8 + Prettier 3             | 见第十章                                             |
| 测试        | Vitest                            | utils / composables / store 必须有单测               |
| Git Hooks   | Husky + lint-staged               | pre-commit 跑 lint-staged                            |
| Commit 规范 | commitlint + conventional commits | commit-msg hook 强制校验                             |

---

## 三、目录结构

```
src/
  api/             # API 接口（按业务模块分目录），见第六章
  router/          # 路由（按业务模块分文件，index.ts 集中组装），见第四章
  stores/          # Pinia stores，见第五章
  views/           # 页面级组件（按业务模块分目录）
  components/      # 业务组件（c- 前缀）
  base/            # 基础 UI 组件库（hs- 前缀，自研封装）
  composables/     # Composition API 复用逻辑（use 前缀）
  utils/           # 纯函数工具
  constants/       # 常量
  types/           # 全局 TypeScript 类型
  styles/          # 全局样式（variable / base / mixin / reset / theme / cover-antdv）
  plugins/         # Vue 插件（toast、alert 等）
  i18n/            # 国际化（locales/zh.ts、en.ts、tw.ts、jp.ts + 工具函数）
  assets/          # 静态资源（图片、字体）
  main.ts          # 应用入口
  App.vue          # 根组件
```

**约束**：

- 所有跨组件复用逻辑一律走 `composables/`
- 业务页面放在 `views/<module>/`，对应组件放在 `components/<module>/` 或 `views/<module>/components/`
- `base/` 下的基础组件不依赖业务、不依赖 store

---

## 四、路由规则

- **模式**：`createWebHistory`（HTML5 history 模式）
- **路由表**：前端静态定义，**不做前端动态路由生成**
- **权限**：后端下发权限码，存储于 `useUserStore.permissions`，路由 `meta.permission` 中声明所需权限码，导航守卫中校验
- **组织方式**：模块化
  - 每个业务模块一个文件：`router/<module>Route.ts`（如 `userRoute.ts`、`orderRoute.ts`）
  - 由 `router/index.ts` 集中导入并组装到 `routes` 数组
- **懒加载**：所有页面组件用 `() => import('@/views/...')`
- **命名约定**：
  - `path`：kebab-case（如 `/user/profile`）
  - `name`：PascalCase（如 `UserProfile`）
- **meta 字段约定**：
  - `title: string` —— 页面标题（用于 `document.title`，可走 i18n key）
  - `requiresAuth: boolean` —— 是否需要登录
  - `permission: string | string[]` —— 所需权限码
  - `keepAlive: boolean` —— 是否缓存

---

## 五、状态管理规则

- **统一用 Pinia 组合式风格**：

  ```ts
  export const useUserStore = defineStore("user", () => {
    const profile = ref<User | null>(null);
    const isLoggedIn = computed(() => !!profile.value);
    async function fetchProfile() {
      /* ... */
    }
    return { profile, isLoggedIn, fetchProfile };
  });
  ```

- **划分原则**：按**业务域**划分（`user`、`auth`、`app`、`order`），**不按页面划分**
- **异步逻辑**：必须放在 store 内的函数中，**组件不直接发起 API 调用**（除非纯展示页一次性请求）
- **持久化**：在 store 内部显式从 `localStorage` 读写，**不使用 pinia-plugin-persistedstate** 等黑盒插件
- **localStorage 访问**：**严禁**组件 / 组合式 / utils 直接读写 `localStorage`，必须经过对应 store 提供的 getter / setter

---

## 六、API 请求规则

- **统一封装**：`src/api/index.ts` 导出 `HRequest` 函数

  ```ts
  HRequest({
    url: '/api/user/profile',
    method: 'GET',
    query?: object,
    data?: object,
    headers?: object,
    showLoading?: boolean,
    onlyAcceptTheLatest?: boolean,  // 自动取消同 url 旧请求
    tryTimes?: number,              // 自动重试次数
    alwaysPass?: boolean,           // 即使业务失败也 resolve
  })
  ```

- **拦截器职责**：
  - **请求**：注入 `Token`、`LanguageType`、`CurrencyType`、`SoftwareVersion`、`RequestSource`、`BrowserUrl`
  - **响应**：判断 `IsSuccess`、统一错误码映射（如 101/102 → 登出、107 → 强制刷新、113 → 强制改密）、Toast 提示
  - **错误**：取消重复请求时静默；网络错误统一上报

- **接口组织**：按业务模块分目录

  ```
  api/
    index.ts             # HRequest 与拦截器
    auth/index.ts        # 登录注册
    user/index.ts        # 用户信息
    order/index.ts       # 订单
    ...
  ```

- **函数命名**：`api<Module><Action>`，如 `apiUserGetProfile`、`apiOrderCancel`
- **类型定义**：每个接口必须定义请求与响应类型，与接口函数同文件（小模块）或同目录 `types.ts`（大模块）

---

## 七、组件规则

- **写法**：一律 `<script setup lang="ts">`，**不允许 Options API**
- **文件命名**：kebab-case（`user-card.vue`）
- **导入命名**：PascalCase（`<UserCard />`）
- **前缀约定**：
  - `c-*`：业务组件（`<CPassenger />`、`<CAddress />`）
  - `hs-*`：基础 UI 组件（`<HsButton />`、`<HsDialog />`、`<HsTable />`）
- **Props**：`defineProps<{ ... }>()` 写法，必须有 TS 类型；含默认值用 `withDefaults`
- **Emits**：`defineEmits<{ ... }>()` 写法，必须有签名类型
- **暴露**：需要父组件调用时用 `defineExpose`
- **SFC 块顺序**：`<template>` → `<script setup>` → `<style>`
- **样式作用域**：默认 `scoped`，需要穿透时用 `:deep()`，**禁止用 `>>>` 或 `/deep/`**

---

## 八、样式规则

- **Less + scoped**
- **变量集中**：`styles/variable.less` 定义主色、辅色、灰度、字色、间距、圆角、字号
  - **禁止在组件内直接写颜色码**，必须引用变量
- **全局 mixin**：`styles/base.less` 提供 `.flex-row`、`.flex-column`、`.flex-center`、`.flex-between`、`.pointer`、`.ellipsis` 等
- **样式入口**：`styles/index.less` 集中 `@import` 子文件，由 `main.ts` 引入
- **AntDV 主题**：通过 `<a-config-provider :theme="{ token: { ... } }">` 配置
- **AntDV 样式覆盖**：统一写在 `styles/cover-ant-design-vue.less`
- **样式文件结构**：
  ```
  styles/
    index.less                   # 入口
    variable.less                # 变量
    base.less                    # 全局 mixin
    mixin.less                   # less mixin 定义
    reset.less                   # 浏览器样式重置
    theme.less                   # 主题定义
    transition.less              # 过渡动画
    cover-ant-design-vue.less    # AntDV 样式覆盖
  ```

---

## 九、命名约定

| 对象           | 约定                         | 示例                             |
| -------------- | ---------------------------- | -------------------------------- |
| 文件 / 目录    | kebab-case                   | `user-card.vue`、`user-route.ts` |
| 组件标签       | PascalCase                   | `<UserCard />`、`<HsDialog />`   |
| Pinia store id | camelCase                    | `defineStore('user', ...)`       |
| Pinia hook     | `useXxxStore`                | `useUserStore`                   |
| Store 文件     | `useXxxStore.ts`             | `useUserStore.ts`                |
| 变量 / 函数    | camelCase                    | `currentUser`、`getUserInfo`     |
| 常量           | UPPER_SNAKE_CASE             | `AES_KEY`、`MAX_RETRY`           |
| 类型 / 接口    | PascalCase                   | `User`、`OrderDetail`            |
| 枚举           | PascalCase + 成员 PascalCase | `OrderStatus.Paid`               |
| API 函数       | `api` + Module + Action      | `apiUserGetProfile`              |
| Composable     | `use` + 功能                 | `useAuth`、`useTheme`            |
| 事件           | camelCase                    | `@update`、`@change`             |

---

## 十、代码规范与开发流程

### Lint 与格式化

- **ESLint**：`.eslintrc.cjs`，扩展 `plugin:vue/vue3-recommended`、`@vue/eslint-config-typescript`、`@vue/eslint-config-prettier/skip-formatting`
- **Prettier**：`.prettierrc.json`，约定：
  - `semi: true`、`singleQuote: false`、`tabWidth: 2`、`printWidth: 120`、`trailingComma: "none"`
- **Stylelint**（可选）：约束 less 写法

### 命令（package.json scripts）

- `pnpm dev`：启动开发服务器
- `pnpm build`：生产构建
- `pnpm preview`：本地预览构建产物
- `pnpm lint`：ESLint 检查并修复
- `pnpm format`：Prettier 格式化
- `pnpm typecheck`：`vue-tsc --noEmit` 类型检查
- `pnpm test`：Vitest 单测
- `pnpm test:ui`：Vitest UI 模式
- `pnpm release`：一键发布（前置校验 → 版本 bump → CHANGELOG → commit + tag → push）
- `pnpm release:dry`：预览发布流程（dry-run，不实际执行）
- `pnpm release:first`：首次发布（不 bump 版本号，只生成 CHANGELOG）

### Git Hooks

- **Husky** 安装在 `prepare` 钩子中
- **pre-commit**：`lint-staged` —— 只检查改动文件，自动修复
- **commit-msg**：`commitlint` —— 强制 conventional commits（`feat`、`fix`、`docs`、`refactor`、`test`、`chore` 等）

### 发布流程

- **工具**：`standard-version`（基于 conventional commits 自动 bump 版本号 + 生成 CHANGELOG）
- **配置**：`.versionrc.json`（中文段落标题、GitHub 链接格式）
- **入口脚本**：`scripts/release.sh`
- **流程**：`pnpm release` 触发 → typecheck → lint → test → standard-version（bump + CHANGELOG + commit + tag） → git push --follow-tags
- **CHANGELOG**：`CHANGELOG.md`，由 standard-version 根据 git commit 历史自动生成

### 分支策略

> 待团队约定后填入。

### 代码注释规范

**总原则**：默认不写注释，只在「为什么」不明显或对协作有价值时才写。语言统一中文。

**必须写注释的场景**

- 公共 API：所有 `export` 的函数 / composable / store action 加一行 JSDoc 描述
- 组件 Props / Emits：每个字段加一行说明（写在类型定义内或 `/** */` 上方）
- 业务错误码 / 魔法数字 / 状态码映射：必须解释含义（如错误码 101/102 → 登出）
- 复杂业务逻辑、非显而易见的算法、性能权衡
- 临时方案、绕过、坑点：用 `// NOTE:` 或 `// HACK:` 标注

**不要写注释的场景**

- 简单的 getter / setter / 一行计算函数
- 命名 + TS 类型已经说明意图的代码
- 单纯重复代码字面意思的注释（如 `// 计算总价` 配 `calcTotalPrice`）
- 纯类型声明（TS 类型本身即文档）

**注释格式**

- 公共 API：JSDoc 单行 `/** 描述 */`，**仅写描述**，不强制 `@param` / `@returns`（TS 类型已自带）
- 内部说明：单行 `//`
- 多行块：`/* ... */`
- 不写文件头注释（除非该文件包含整体架构说明，如 `src/api/index.ts` 拦截器流程，可在顶部写 1-3 行模块概述）

**标签约定**

- `// TODO: 描述` —— 待实现的功能
- `// FIXME: 描述` —— 已知缺陷或 bug
- `// NOTE: 描述` —— 重要细节、为什么这样写、踩过的坑
- `// HACK: 描述` —— 临时绕过，需后续优化

**禁止**

- 注释掉的代码（直接删除，历史查 git）
- 自动生成的 JSDoc 占位模板（`@param xxx - xxx`）
- 与代码不一致的过期注释（修改代码时同步更新或删除注释）
- 行尾长注释（极短的 `// 必填` 可以，超过即换行写在上方）

**示例**

```ts
// ✅ 公共 API：JSDoc 描述
/** 取消同一 url 的旧请求并发起新请求 */
export function cancelDuplicate(url: string) {
  /* ... */
}

/** 获取当前用户资料，未登录返回 null */
async function fetchProfile(): Promise<User | null> {
  /* ... */
}

// ✅ 业务错误码必须说明
// NOTE: 101=Token 失效, 102=登录被踢, 107=客户端版本过期需强刷
const LOGOUT_CODES = [101, 102];

// ✅ TODO 标签
// TODO: 支持自定义 retry 间隔
HRequest({ tryTimes: 3 });

// ❌ 自解释代码不写注释
// 计算总价  <-- 多余
function calcTotalPrice(qty: number, unit: number) {
  return qty * unit;
}
```

---

## 十一、国际化（i18N）

自研方案（不使用 vue-i18n）。

- **位置**：`src/i18n/`
- **结构**：
  ```
  i18n/
    index.ts            # 工具类入口（提供 $t 函数与语言切换）
    locales/
      zh.ts             # 中文
      en.ts             # 英文
      tw.ts             # 繁体
      jp.ts             # 日文
  ```
- **挂载**：在 `main.ts` 中将 `$t` 注册为全局属性
- **使用**：
  - 模板内：`{{ $t('user.profile.title') }}`
  - 脚本内：`import { $t } from '@/i18n'`，调用 `$t('key')`
- **语言切换**：从 `localStorage.CurrentLanguage` 与 URL query `LanguageType` 读取，存入 `useAppStore.language`
- **新增字符串**：所有用户可见文案必须走 `$t()`，**禁止硬编码中文 / 英文字面量**

---
