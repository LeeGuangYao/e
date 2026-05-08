# ADR-0002: 使用 standard-version 实现一键发布流程

- 状态：已生效
- 日期：2026-05-08

---

## 背景

项目已有 Husky + commitlint + lint-staged 的 Git 规范体系，所有 commit message 遵循 conventional commits 格式。需要一个一键触发式发布流程，自动完成：提交前校验 → 版本号 bump → CHANGELOG 生成 → git commit + tag → 推送远程。手动操作容易遗漏步骤或校验。

## 决策

使用 `standard-version` 作为发布自动化工具，配合 `scripts/release.sh` 脚本封装前置校验和后置推送逻辑。

## 备选方案

- **conventional-changelog-cli + 手动编排**：只生成 CHANGELOG，版本号 bump 和 git 操作需自己写脚本，步骤多且易出错。不选原因：standard-version 已封装这些逻辑。
- **standard-version**：一站式完成 bump + CHANGELOG + commit + tag，与 conventional commits 天然契合。选中。
- **release-it**：功能更全（支持 npm publish、GitHub Release），但配置较重，且项目是 private 不发 npm。不选原因：过重，有不需要的功能。
- **semantic-release**：全自动化 CI 发布，需要 CI 环境和插件体系。不选原因：项目目前没有 CI 流水线，本地发布更合适。

## 影响

- 正面：一键 `pnpm release` 完成全流程，校验、bump、CHANGELOG、推送一步到位；CHANGELOG 与 commit 规范自动对齐，无需手动维护
- 代价：新增 `standard-version` 依赖；发布流程绑定 conventional commits 规范，非规范 commit 不会出现在 CHANGELOG 中
- 后续注意：如果未来需要 npm publish 或 GitHub Release API，可考虑迁移到 release-it；standard-version 已归档不活跃维护，如有重大 bug 需评估替代方案
