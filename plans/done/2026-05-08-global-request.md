# Plan: 封装全局接口请求

- 状态：已完成
- 对应 spec：`specs/2026-05-08-03.md`
- 日期：2026-05-08

---

## 总体思路

现有 `src/api/index.ts` 已有基础 HRequest 封装，但与 spec 存在多处不一致。修正响应类型结构（`Data` → `ResultData`、`ErrorMessage` → `ErrMsg`）、Token 注入改为 `Authorization: Bearer`、新增 `request.get/post/put/delete` 简洁调用、实现 loading 自动处理、更新登录接口路径与域名、同步更新 `architecture/project.md`。

## 影响范围

- 涉及文件 / 模块：
  - `src/api/index.ts` —— 核心改动
  - `src/api/auth/index.ts` —— 登录接口修正
  - `.env.development` / `.env.production` —— baseURL 配置
  - `architecture/project.md` —— 第六章 API 规则更新
- 是否影响 `architecture/project.md`：是 → 第六章（响应结构、Token 注入方式、调用方式）
- 是否产生新的 ADR：否

## 实施步骤

- [x] 1. 修正 `ApiResponse` 类型：`Data` → `ResultData`、`ErrorMessage` → `ErrMsg`、新增 `RedirectUrl`、`Version` 字段
- [x] 2. Token 注入方式从 `Token` header 改为 `Authorization: Bearer token`
- [x] 3. 响应拦截器：成功时 `return data.ResultData`，失败时 `message.error(data.ErrMsg)` + `Promise.reject`
- [x] 4. 新增 `request` 对象，提供 `get` / `post` / `put` / `delete` 简洁调用方法
- [x] 5. 实现 loading 自动处理：`showLoading` 参数 + 引用计数式 `message.loading`
- [x] 6. 更新 `.env.development` / `.env.production` 的 `VITE_API_BASE_URL` 为 `https://waptest.homsom.com`
- [x] 7. 更新 `src/api/auth/index.ts`：登录接口路径改为 `/api/Login/UserLogin/v4`，适配新 ApiResponse，加调用示例注释
- [x] 8. 更新 `architecture/project.md` 第六章：响应结构、Token 方式、request 对象说明
- [x] 9. typecheck + lint 验证通过

## 风险与回滚

- `Authorization: Bearer` 与后端兼容性需确认
- baseURL 改外部域名可能跨域，需 Vite proxy 或后端 CORS

## 完成后必做（归档与同步）

- [x] 本 plan 移动到 `plans/done/`
- [x] 对应 spec 移动到 `specs/done/`
- [x] 更新 `progress.md`
- [x] 更新 `architecture/project.md`
- [ ] 无新 ADR
