# Plan: 一键发布流程（校验 + 版本bump + CHANGELOG + 提交推送）

- 状态：已完成
- 对应 spec：无（用户直接提需求）
- 日期：2026-05-08

---

## 总体思路

添加 `pnpm release` 命令，一键完成：提交前校验 → 自动 bump 版本号 → 生成/更新 CHANGELOG.md → 自动 git commit + tag → 推送到远程。核心工具使用 `standard-version`，它基于 conventional commits 自动完成版本号 bump 和 CHANGELOG 生成，与项目已有的 commitlint 规范天然契合。

## 实施步骤

- [x] 1. 安装 `standard-version`：`pnpm add -D standard-version`
- [x] 2. 创建 `.versionrc.json`（中文段落标题、GitHub 链接格式）
- [x] 3. 创建 `scripts/release.sh`（前置校验 + standard-version + 推送）
- [x] 4. package.json 添加 release / release:dry / release:first 脚本
- [x] 5. 创建初始 `CHANGELOG.md`
- [x] 6. 更新 `architecture/project.md`（命令章节 + 发布流程章节）
- [x] 7. 新增 ADR `decisions/0002-standard-version-release.md`
- [x] 8. 更新 `decisions/README.md` 索引
- [x] 9. 更新 `progress.md`
