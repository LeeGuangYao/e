# 移除 request 对象式调用，统一使用 HRequest

- 状态：已完成
- 对应 spec：`specs/done/2026-05-08-04.md`
- 日期：2026-05-08

---

## 总体思路

项目中同时存在 `HRequest` 函数式调用和 `request.get/post/put/delete` 对象式调用两种方式。spec 要求只保留 `HRequest`，移除 `request` 对象。当前 `request` 仅被 `auth/index.ts` 的 `apiAuthLoginV2` 演示函数使用，改动范围很小。

## 影响范围

- 涉及文件：
  - `src/api/index.ts` —— 删除 `request` 对象定义及导出
  - `src/api/auth/index.ts` —— 删除 `apiAuthLoginV2` 函数、移除 `request` import、清理注释
- 影响 `architecture/project.md`：是 → 第六章需移除 `request` 对象式调用文档
- 不产生新 ADR

## 实施步骤

- [x] 1. `src/api/auth/index.ts`：`import { HRequest, request }` → `import { HRequest }`
- [x] 2. `src/api/auth/index.ts`：删除 `apiAuthLoginV2` 函数（第 23-26 行）
- [x] 3. `src/api/auth/index.ts`：清理底部注释中"对象式调用"示例段落
- [x] 4. `src/api/index.ts`：删除 `export const request = { ... }` 整个对象（第 230-247 行）
- [x] 5. `architecture/project.md` 第六章：移除 `request` 对象式调用文档和示例，只保留 `HRequest`
- [x] 6. 运行 `pnpm typecheck` 确认无类型错误（已有错误均为 login-form.vue 的无关问题）
- [x] 7. 运行 `pnpm lint` 确认无 lint 错误（已有错误均为 login-form.vue 的无关问题）

## 风险与回滚

- 无实际风险，`request` 仅在 1 处演示代码中使用
- 回滚方法：git revert

## 完成后必做（归档与同步）

- [x] 本 plan 移动到 `plans/done/`
- [x] 对应 spec 移动到 `specs/done/`
- [x] 更新 `progress.md`
- [x] 更新 `architecture/project.md` 第六章
- [x] 无需新增 ADR
