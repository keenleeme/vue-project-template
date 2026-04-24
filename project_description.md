# Project Memory

## Executive Snapshot
- 项目一句话定位：基于 Vue 3 + TypeScript + Vite 的企业级后台前端模板，内置主题、菜单、权限、国际化与通用典型页面示例。
- 当前阶段：模板工程持续扩展示例与业务原型。
- 近期里程碑：在“通用典型页面”二级菜单下扩展 API 风险监测相关的敏感数据溯源页面，并补齐调研、PRD、设计与前端实现。

## Project Paths
- 项目根目录：`c:\cjtest\vue-project-template`
- 路由注册文件：`src/router/routes.ts`
- 页面输出目录：`src/views`

## Design Context
- 品牌主色：`#134BEA`
- 功能色：
  - success: `#2BB668`
  - warning: `#F3A700`
  - danger: `#F53C3C`
  - info: `#134BEA`

## Delivery Defaults
- 包管理器：`npm`
- 启动命令：`npm run dev`
- 构建命令：`npm run build`

## Architecture Baseline
- 核心模块：`src/router` 路由层、`src/views` 页面层、`src/store` 主题与状态层、`src/api` 接口封装层。
- 关键依赖：`vue`、`vue-router`、`pinia`、`ant-design-vue`、`das-component-vue`、`echarts`。
- 主要数据流：菜单 mock 提供导航结构，`routes.ts` 提供页面映射，页面使用本地 mock / store / HTTP 客户端组织展示数据。

## Delivery Workflow
- 开发流程：新增页面目录 -> 注册路由 -> 接入菜单 mock / 国际化文案 -> 本地运行验证。
- 测试/发布门槛：当前仓库以本地运行和 lint 为主，提交前受 `lint-staged` 与 husky 钩子约束。
- 常用命令：
  - `npm run dev`
  - `npm run build`
  - `npm run lint-fix`

## Collaboration Contract
- 代码约定：新页面放在 `src/views` 下独立目录，主文件命名为 `index.vue`，容器类名使用 `{page-name}-container`。
- 路由约定：在 `src/router/routes.ts` 中维护，组件使用懒加载或显式导入，`meta` 中包含标题与权限标识。
- 菜单约定：当前演示导航由 `src/api/menuMock.ts` 提供，“通用典型页面”作为一级菜单，子页面挂在其 `children` 下。

## Risk & Constraints
- 技术风险：项目级 design-system skill 未落地，设计与代码阶段主要依赖现有主题 Token、组件库和 Pencil 组件库副本。
- 业务风险：当前仓库更偏模板与典型页面演示，真实 API 风险监测业务数据需要以 mock / 示例数据驱动。
- 明确限制：国际化文案文件当前已有未提交改动，后续编辑必须在保留现有变更的前提下增量追加。

## 布局规范（Pencil 设计稿）
- 画布尺寸：待确认，当前代码侧以后台内容区自适应布局为主。
- 侧边栏宽度：待确认，当前主题默认 `layout: top`。
- 内容区规格：页面普遍使用 `a-card` 包裹主内容，高度 `100%`，内容区留白跟随组件默认间距。
- 来源：代码扫描 + 待确认

## Pencil Token Values
> 该节供 Pencil Token 刷新规则读取。列头必须为：| Pencil Variable | 值 | 来源 |

### 品牌色
| Pencil Variable | 值 | 来源 |
|---|---|---|
| `color/brand/normal` | `#134BEA` | `src/store/uedModule/theme/defaultConfig.ts` `primaryColor` |
| `color/brand/hover` | `#3B71EE` | `src/theme/theme.css` `--brand-50` |
| `color/brand/active` | `#0639C3` | `src/theme/theme.css` `--brand-70` |
| `color/brand/light` | `#E8F2FF` | `src/theme/theme.css` `--brand-10` |

### 状态色
| Pencil Variable | 值 | 来源 |
|---|---|---|
| `color/status/success` | `#2BB668` | `src/theme/theme.css` `--success-60` |
| `color/status/success-light` | `#E8FAED` | `src/theme/theme.css` `--success-10` |
| `color/status/warning` | `#F3A700` | `src/theme/theme.css` `--warning-60` |
| `color/status/warning-light` | `#FFF2BA` | `src/theme/theme.css` `--warning-10` |
| `color/status/error` | `#F53C3C` | `src/theme/theme.css` `--error-60` |
| `color/status/error-light` | `#FFE8E8` | `src/theme/theme.css` `--error-10` |

### 风险色
| Pencil Variable | 值 | 来源 |
|---|---|---|
| `color/risk/fall/normal` | `#A74748` | `src/theme/theme.css` `--fall-60` |
| `color/risk/fall/light` | `#F6E3E0` | `src/theme/theme.css` `--fall-10` |
| `color/risk/high/normal` | `#F53C3C` | `src/theme/theme.css` `--error-60` |
| `color/risk/high/light` | `#FFE8E8` | `src/theme/theme.css` `--error-10` |
| `color/risk/medium/normal` | `#F5731C` | `src/theme/theme.css` `--warningm-60` |
| `color/risk/medium/light` | `#FFE7C8` | `src/theme/theme.css` `--warningm-10` |
| `color/risk/low/normal` | `#F3A700` | `src/theme/theme.css` `--warning-60` |
| `color/risk/low/light` | `#FFF2BA` | `src/theme/theme.css` `--warning-10` |
| `color/risk/no/normal` | `#7E8494` | `src/theme/theme.css` `--gray-60` |
| `color/risk/no/light` | `#F6F7FB` | `src/theme/theme.css` `--gray-10` |

### 圆角
| Pencil Variable | 值 | 来源 |
|---|---|---|
| `radius/3xs` | `4` | `src/theme/theme.css` `--radius-3xs` |
| `radius/xs` | `8` | `src/theme/theme.css` `--radius-xs` |
| `radius/lg` | `16` | `src/theme/theme.css` `--radius-lg` |

### 字体
| Pencil Variable | 值 | 来源 |
|---|---|---|
| `font/size/base` | `12` | `src/store/uedModule/theme/defaultConfig.ts` `fontSize` |

## Facts
- 项目脚本中 `dev` 为并行启动前端与 mock 服务，适合原型与示例页面联调。
- 现有“通用典型页面”菜单下已包含 `溯源任务`，且数据层已定义 `敏感数据溯源`、`源IP溯源`、`账号溯源` 三类任务。
- 现有 `trace-task` 页面已经沉淀了 API 风险监测场景下的卡片、表格、详情分析与 ECharts 使用方式，可作为新页面视觉和交互参考。

## Inferences
- “敏感数据溯源”新页适合落在 `src/views/uedTypical/sensitive-data-lineage/`，并接入 `src/api/menuMock.ts` 与 `src/router/routes.ts`。
- 本次需求更偏高保真业务原型，适合使用静态 mock 数据先完成链路、统计与交互展示。

## Open Questions
- “敏感数据溯源”是否需要同时新增详情页，还是以单页完成筛选与链路展示为主。
- 后续若进入真实联调，链路节点的唯一标识应采用接口 ID、路径还是调用事件 ID。
- Pencil 设计稿画布尺寸与布局栅格当前未在项目级规则中显式定义，设计阶段需要按现有组件库骨架落位。

## Evidence Index
- 路由入口与现有溯源页面：`src/router/routes.ts`
- 菜单结构：`src/api/menuMock.ts`
- 页面开发规范：`.cursor/rules/vue-page-development.mdc`
- 路由规范：`.cursor/rules/route-configuration.mdc`
- 主题与风险色：`src/theme/theme.css`
- 默认品牌色与字号：`src/store/uedModule/theme/defaultConfig.ts`
- 现有敏感数据溯源任务模型：`src/views/uedTypical/trace-task/task-store.ts`

## Last Updated
- 日期：2026-04-23
- 来源：`opt-pro-ux-code-init`

## 下一步建议
- 从 Stage 0 开始做 API 风险监测场景下的敏感数据流转链路竞品调研，沉淀页面结构差异点。
- 直接跳过 Stage 1，进入 Stage 2 输出结构化 PRD，把 IA / 流程图内嵌到 PRD 中。
- 在 Stage 3/4 复用现有 `trace-task` 的视觉语言和 mock 数据组织方式，降低实现成本。
