# Plan: 机票城市选择重构

- 状态：待执行
- 对应 spec：`specs/2026-05-08-07.md`
- 日期：2026-05-08

---

## 方案讨论

制定本 plan 过程中的问答，保留技术决策上下文。

| # | 问题 | 回答 | 影响 |
|---|------|------|------|
| 1 | 组件适用范围 | 机票/酒店/火车票三个表单统一使用 | 需设计通用接口，CityItem 需兼容不同场景 |
| 2 | 面板形态 | 下拉面板（输入框下方弹出），非弹窗 | 需处理 overflow、定位、H5 适配 |
| 3 | 酒店/火车票数据源 | 暂用机票 API | 后续有各自接口时需切换，接口层需可配置 |

## 总体思路

重构城市选择为高级下拉面板组件，包含：输入搜索框（支持拼音/中文/三字码模糊匹配）、热门城市标签、按字母分组的城市列表。城市数据从后端 API 获取并缓存在 Pinia store 中，搜索走 v2 模糊查询接口（带防抖）。三个表单（机票/酒店/火车票）统一使用重构后的组件，消除硬编码。类型、API、Store、Composable 按项目分层规范拆分到对应目录。

## 影响范围

- 涉及文件 / 模块：
  - `src/components/home/c-city-select.vue` —— 重构核心组件
  - `src/views/home/components/flight-form.vue` —— 移除硬编码，接入新组件
  - `src/views/home/components/hotel-form.vue` —— 移除硬编码，接入新组件
  - `src/views/home/components/train-form.vue` —— 移除硬编码，接入新组件
  - `src/api/flight/index.ts` —— 新增城市接口
  - `src/api/flight/types.ts` —— 新增城市类型
  - `src/stores/useCityStore.ts` —— 新增城市 store
  - `src/composables/useCitySearch.ts` —— 新增搜索 composable
  - `src/types/city.ts` —— 新增城市通用类型
  - `src/i18n/locales/*.ts` —— 新增城市面板文案
  - `src/styles/variable.less` —— 新增城市面板变量
- 是否影响 `architecture/project.md`：否
- 是否产生新的 ADR：否

## 实施步骤

- [ ] 1. 新增 `src/types/city.ts` —— 城市通用类型定义（CityItem 扩展：拼音、国家、热门标记等；CityGroup 按字母分组）
- [ ] 2. 新增 `src/api/flight/types.ts` —— 请求/响应类型定义
- [ ] 3. 新增 `src/api/flight/index.ts` —— 城市列表 + 模糊查询两个接口
- [ ] 4. 新增 `src/stores/useCityStore.ts` —— 城市数据缓存（热门城市、分组列表、选中历史）
- [ ] 5. 新增 `src/composables/useCitySearch.ts` —— 搜索逻辑（防抖、本地优先+远程 fallback、拼音匹配）
- [ ] 6. 新增 Less 变量 —— `styles/variable.less` 中城市面板相关变量
- [ ] 7. 新增 i18n 文案 —— 四语言文件中城市面板相关 key
- [ ] 8. 重构 `c-city-select.vue` —— 下拉面板（搜索框 + 热门城市标签 + 字母索引分组列表 + 搜索结果列表），PC/H5 响应式
- [ ] 9. 重构 `flight-form.vue` —— 移除硬编码城市列表，接入 store + 新组件
- [ ] 10. 重构 `hotel-form.vue` —— 移除硬编码城市列表，接入 store + 新组件
- [ ] 11. 重构 `train-form.vue` —— 移除硬编码城市列表，接入 store + 新组件
- [ ] 12. 验证：lint + typecheck + build 通过

## 风险与回滚

- 后端城市列表接口返回数据结构未确认，需根据实际响应适配类型
- 拼音匹配逻辑需要额外处理（后端 v2 接口可能已支持拼音搜索，需确认）
- 下拉面板在首页毛玻璃卡片中的 z-index 和 overflow 需要特别处理
- 回滚：git revert，恢复原组件与表单

## 改动总结

完成后填写，记录实际改动。与"实施步骤"的区别：步骤是计划，这里是结果。

- `文件路径`：改动说明

## 完成后必做（归档与同步）

按 `AGENTS.md` 第四章自动维护规则执行：

- [ ] 本 plan 移动到 `plans/done/`
- [ ] 对应 spec 移动到 `specs/done/`
- [ ] 更新 `progress.md`（对应模块状态、链接到本 plan）
- [ ] 如有架构改动 → 更新 `architecture/project.md`
- [ ] 如有架构决策 → 新增 `decisions/NNNN-*.md` 并更新 `decisions/README.md`
