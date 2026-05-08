# AGENTS.md

> 这是与本项目协作的 AI 必读文件。所有 .md 文档使用中文，AI 与用户的交流也使用中文。
> 本文件只规定"如何与项目协作"。项目本身的技术栈、规则、约束写在 `architecture/project.md`。

---

## 一、启动协议（每次会话第一件事）

进入会话后，在做任何实质性工作之前，AI 必须按顺序读取以下文件：

1. `AGENTS.md`（本文件）
2. `architecture/project.md` —— 项目世界观（技术栈、目录、规则）
3. `decisions/README.md` —— 架构决策索引
4. `progress.md` —— 当前项目进度

读完后，必须用一句话向用户确认，格式如下：

> 已加载世界观：技术栈 [一句话简述]，已知决策 N 条，待办任务 [一句话简述待做未完成的任务或计划]。

**未输出此确认句，不得开始任何编码、规划或讨论实现细节的工作。**

---

## 二、文件分层

整个项目的"AI 协作上下文"按生命周期分为两层：

**长期稳定层（世界观）—— 每次必读**

| 文件 | 职责 |
|---|---|
| `AGENTS.md` | 协作 SOP，AI 怎么干活 |
| `architecture/project.md` | 项目世界观：技术栈、目录、路由/状态/请求/组件/命名等所有硬规则 |
| `decisions/README.md` | 架构决策索引（一行一条），让 AI 知道"做过哪些决策" |
| `progress.md` | 项目当前进度（功能模块层面） |

**中短期任务层 —— 按需读**

| 文件 | 何时读 |
|---|---|
| `decisions/NNNN-*.md`（详情） | 触及对应主题时读 |
| `specs/*.md` | 用户明确指定时读 |
| `plans/*.md` | 执行该 plan 时读 |

---

## 三、工作流

### 1. 接到新需求

用户会指定一个 spec 文件，例如："读 `specs/2026-05-08-login.md` 并实现"。

执行步骤：

1. 读取该 spec
2. **进入 plan mode，禁止直接动手写代码**
3. 输出一份执行计划，写入 `plans/YYYY-MM-DD-<topic>.md`（参考 `plans/_template.md`）
4. 等待用户批准
5. 用户批准后才开始实施
6. 实施过程按 plan 中的 checkbox 逐项推进

### 2. 执行完成时（必做的归档动作）

完成一个 plan 后，AI **必须自动**完成以下动作，**不需要用户提醒**：

- 将 plan 文件移动到 `plans/done/`
- 将对应 spec 移动到 `specs/done/`
- 更新 `progress.md`：把对应模块从 🚧 移到 ✅，并标注 plan 路径

### 3. 架构 / 规则修改时

任何会影响**未来代码风格、目录结构、依赖、命名、规范**的改动，AI 必须：

- 同步修改 `architecture/project.md` 的对应章节
- **先改 project.md，再改代码**（让规则先变，避免代码和文档脱节）

### 4. 技术选型 / 架构方案决策时

任何"为什么用 A 不用 B"的决策，AI 必须：

- 在 `decisions/` 下新建 `NNNN-<topic>.md`（NNNN 为递增四位数字）
- 在 `decisions/README.md` 索引中追加一行摘要
- 沿用 `decisions/_template.md` 模板

---

## 四、自动维护规则（核心）

**所有更新都由 AI 主动完成，不依赖用户提醒。** 一次会话中如果触发了多个事件，所有相关文件都要更新。

| 触发事件 | 必须更新 |
|---|---|
| 完成一个 plan | `plans/<plan>` → `plans/done/`；`specs/<spec>` → `specs/done/`；更新 `progress.md`；在 plan 中填写 `## 改动总结`（列出实际改动的文件及说明） |
| 修改架构 / 规则 / 目录 / 依赖 / 命名约定 | `architecture/project.md` 对应章节 |
| 做出技术选型或架构方案决策 | 新建 `decisions/NNNN-*.md`；更新 `decisions/README.md` |
| 新增 / 废弃功能模块 | `progress.md` |

执行完任务但忘记归档/更新 progress.md，等同于任务**未完成**。

---

## 五、文档命名与格式

- 所有 .md 文档使用中文
- spec / plan 文件名：`YYYY-MM-DD-<kebab-case-topic>.md`
- ADR 文件名：`NNNN-<kebab-case-topic>.md`（四位递增数字，0001 起）
- 模板：每个目录下的 `_template.md`

---

## 六、明令禁止

- ❌ 跳过启动协议直接进入工作
- ❌ 跳过 plan mode 直接写代码
- ❌ 完成任务后不归档、不更新 `progress.md`
- ❌ 修改架构却不同步 `architecture/project.md`
- ❌ 把硬性编码规则写进 AGENTS.md（那是 `architecture/project.md` 的事）
- ❌ 反复询问"用什么技术栈 / 以前怎么做的"—— 答案在 `architecture/` 和 `decisions/`
- ❌ 在没读完世界观文件前，凭印象写代码
