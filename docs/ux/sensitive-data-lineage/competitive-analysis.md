# 竞品分析 — sensitive-data-lineage

> 数据来源：公开官网/公开产品页检索，适合作为 Stage 2 PRD 输入；细节能力建议在售前演示或产品试用中进一步验证。  
> 分析目标：为“API 风险监测 > 敏感数据流转链路”页面提炼可借鉴的功能模式、信息架构和差异化机会点。

## 分析范围
- 目标功能：围绕单个敏感数据标签，展示从标签命中到账号访问、应用归属、API 接口、请求/返回数量的完整流转链路。
- 对标方向：
  - 数据安全 lineage / traceability：`Cyberhaven`、`Securiti`、`Netskope`
  - API 安全 / 敏感数据暴露：`Salt Security`、`Traceable`
- 关注维度：
  - 是否支持敏感数据视角
  - 是否支持 API/应用/账号上下文串联
  - 是否有图谱/链路/流向可视化
  - 是否支持节点 drill-down 与证据查看
  - 是否支持统计指标与风险处置联动

## 竞品概览

| 产品 | 官方链接 | 公开定位 | 与本需求的相关性 |
|---|---|---|---|
| Cyberhaven | [How data lineage works](https://www.cyberhaven.com/product/how-data-lineage-works) | 以数据 lineage 为核心的数据安全平台 | 强在“事件级路径还原”和“数据飞行记录仪”，适合借鉴完整链路与取证视角 |
| Securiti | [Data Lineage Tool](https://securiti.ai/products/data-lineage/) | 数据治理/数据安全中的 lineage 与依赖分析 | 强在“自动发现、技术 lineage、影响分析”，适合借鉴血缘关系与上下游视角 |
| Netskope | [Data lineage blog](https://www.netskope.com/blog/data-lineage-digital-breadcrumb-trails-for-data-security) | 以云与数据安全为核心，强调数据移动可见性 | 强在“跨渠道数字面包屑”和风险识别，适合借鉴跨系统流动 narrative |
| Salt Security | [API Data Security](https://salt.security/use-cases/extend-data-security-to-apis) | API 安全中的敏感数据发现与暴露治理 | 强在“API 暴露敏感数据”视角，适合借鉴 API 节点和数据标签分析 |
| Traceable | [API Protection](https://www.traceable.ai/api-protection) | 应用与 API 安全，强调上下文关联与 runtime 检测 | 强在“从 API 到数据存储的上下文理解”，适合借鉴 API 风险监测场景的证据串联 |

## 功能对比矩阵

| 能力点 | 我们拟建设页面 | Cyberhaven | Securiti | Netskope | Salt Security | Traceable |
|---|---|---|---|---|---|---|
| 从敏感标签出发筛选 | ✓ 核心入口 | △ 更偏从数据对象/来源出发 | △ 更偏数据资产/数据元素 | △ 更偏数据移动行为 | ✓ 强调敏感数据暴露识别 | ✓ 支持敏感数据目录/类型视角 |
| API 作为一级链路节点 | ✓ 核心节点 | ✗ 非 API 优先 | ✗ 偏数据系统/ETL/BI | ✗ 偏渠道与策略 | ✓ | ✓ |
| 账号 -> 应用 -> API 串联 | ✓ 核心展示 | △ 有用户行为上下文 | △ 有依赖与业务上下文 | △ 有活动上下文 | △ 偏 API/数据，不强调账号链 | △ 有上下文，但公开页不突出账号链 |
| 请求/返回数量指标 | ✓ 页面核心指标 | ✗ 公网页未体现 | ✗ 公网页未体现 | ✗ 公网页未体现 | △ 更偏暴露/风险，不强调双向计数 | △ 更偏 runtime 风险 |
| 完整链路图/流向图 | ✓ 核心展示 | ✓ 强 | ✓ 中 | ✓ 中 | △ 多为 API 暴露分析 | △ 强调上下文关联，但公网页未明确图谱形态 |
| 节点点击查看证据 | ✓ 必需 | ✓ 强 | △ | △ | ✓ 可按 API 查看敏感数据 | ✓ 可按 API / 数据查看 |
| 时序回放 / flight recorder | △ 可选增强 | ✓ 最强 | ✗ | △ | ✗ | △ |
| 风险处置联动 | △ 可选增强 | ✓ | ✓ | ✓ | ✓ | ✓ |

## 竞品拆解

## 1. Cyberhaven

### 公开能力要点
- 官方明确把自己定位为 “original data lineage company”。
- 核心能力是对每一份数据记录完整事件链，包括 move / copy / edit / share。
- 公开页强调 “flight recorder for data”，能够从来源到外发路径完成回溯。
- 能结合来源、处理方式、参与人等上下文做分类与保护，而不仅靠内容识别。

### 可借鉴点
- **链路叙事方式清晰**：不是抽象血缘图，而是“这份数据从哪里来、经过谁、怎么被拷贝/外发”的故事线。
- **证据粒度强**：每个动作都是可追溯事件，适合借鉴到“某标签命中后被哪些账号、在哪些应用、通过哪些 API 触达”。
- **适合加入时间轴**：如果后续扩展详情页，可参考其 “flight recorder” 视角做事件回放。

### 对本页面的启发
- 页面不应只做静态拓扑图，应该同时有 **链路摘要 + 事件明细**。
- 节点点击后的侧边详情建议包含：标签命中来源、账号、应用、API、时间、风险等级、请求/返回样本摘要。

## 2. Securiti

### 公开能力要点
- 强调 lineage 对隐私、安全、治理都重要。
- 能自动连接多类数据源，做 automated lineage discovery。
- 页面提到 technical lineage、business lineage、impact analysis、data system dependencies。

### 可借鉴点
- **上下游依赖视角**：适合作为我们页面中的“上游来源 / 下游触达”分区设计依据。
- **影响分析能力**：适合转化为“某个敏感标签一旦泄露，会影响哪些 API、应用、账号和业务对象”的风险提示模块。
- **业务与技术双视角**：可借鉴为“业务链路卡片 + 技术调用明细表”的双层展示。

### 对本页面的启发
- 在链路图之外增加 **影响面摘要卡**：
  - 触达应用数
  - 触达 API 数
  - 关联账号数
  - 请求量 / 返回量
- 增加“上游来源”和“下游扩散”切换视图会更实用。

## 3. Netskope

### 公开能力要点
- 公开文章将 data lineage 描述为 “digital breadcrumb trails”。
- 强调跨云、Web、AI 等不同渠道的数据移动可见性。
- 更偏数据安全运营和跨渠道流动洞察，而非单一 API 资产视角。

### 可借鉴点
- **面包屑式链路表达**：很适合在页面顶部用文字化摘要快速表达完整路径。
- **跨系统流转 narrative**：适合把“标签 -> 账号 -> 应用 -> API -> 返回数据”写成可扫描的简洁链路条。

### 对本页面的启发
- 页面顶部可以加一条 **可读性强的链路摘要条**：
  - `手机号 -> finance-audit -> 财务结算中心 -> POST /invoice/export -> 返回 138 次`
- 将复杂图谱与简洁摘要并存，兼顾 PM、运营、安全分析师三类角色。

## 4. Salt Security

### 公开能力要点
- 重点强调 API 中的敏感数据暴露识别。
- 公共资料中会围绕 PII / PHI / PCI 等敏感数据类型、API inventory、posture governance 展开。
- 更偏“哪些 API 暴露了哪些敏感数据”和“应如何治理”。

### 可借鉴点
- **敏感标签和 API 的强绑定**：非常契合本次页面中“先选标签，再看经过哪些 API”。
- **字段/数据类型维度重要**：页面中的“标签名称”不应只是标题，应该可映射到标签类别、风险级别、命中字段示例。

### 对本页面的启发
- 敏感标签选择器建议带：
  - 标签类别
  - 风险等级
  - 命中应用数 / API 数
- 链路下方表格建议展示 “标签命中字段” 或 “请求/返回命中方向”。

## 5. Traceable

### 公开能力要点
- 强调 context-aware API security 和 API protection。
- 文档材料中包含 sensitive data 目录、API 与敏感数据关联查看能力。
- 更偏 API runtime、attack path 和数据外泄检测。

### 可借鉴点
- **API-first 的信息组织**：适合在链路中把 API 节点做成一级对象，而不是附属于应用的小字信息。
- **上下文完整性**：从 API 到数据存储、从调用行为到风险判定的一体化视角，适合借鉴风险说明区。

### 对本页面的启发
- 每个 API 节点建议展示：
  - 请求方法 + 路径
  - 所属应用
  - 请求次数 / 返回次数
  - 最近访问账号
  - 风险标签 / 风险状态

## UX 模式对比

| 维度 | Cyberhaven | Securiti | Netskope | Salt / Traceable | 对我们页面的建议 |
|---|---|---|---|---|---|
| 主视角 | 数据对象生命周期 | 数据依赖与治理 | 数据流动路径 | API 风险与敏感数据 | 以“敏感标签”为主视角，链路和 API 为核心对象 |
| 页面组织 | 事件链 + 调查 | 目录/依赖/分析 | narrative + 洞察 | inventory + 风险视图 | 统计卡 + 链路图 + 明细表 + 侧边详情 |
| 首屏信息 | 路径回溯 | 依赖关系 | 流动可见性 | 暴露面/风险 | 标签摘要、触达范围、完整路径概览 |
| 深入查看 | 事件取证 | 依赖钻取 | 风险上下文 | API/数据下钻 | 节点点击抽屉：账号、应用、API、计数、样本 |

## 趋势分析

> 基于公开资料与行业能力观察，建议后续结合最新产品演示继续验证。

### 趋势 1：数据 lineage 正从“治理工具能力”转向“安全运营能力”
- 过去 lineage 更多出现在数据目录、ETL、BI 治理场景。
- 现在越来越多安全产品把 lineage 用于外泄调查、风险研判、AI 数据治理。
- 对本产品的影响：不能只做“数据血缘”，要做“安全可操作的链路调查页”。

### 趋势 2：API 安全产品正在补齐敏感数据上下文，而非只看接口资产
- API inventory 已经不够，用户更关心“哪个接口碰到了什么敏感数据”。
- 对本产品的影响：页面需要把 API、敏感标签、账号、应用放在一个统一视图里。

### 趋势 3：单纯图谱不可用，必须配合指标与证据明细
- 竞品公开材料普遍强调上下文、事件、影响分析，而不是单独一张图。
- 对本产品的影响：链路图只是入口，真正提高可用性的是下方明细表和节点详情。

## 差异化机会点

1. **做“标签驱动”的 API 安全链路页，而不是泛化 data lineage 页**
   - 大多数产品要么偏治理 lineage，要么偏 API 风险暴露。
   - 很少把“敏感标签”本身作为一号入口来组织完整链路。

2. **把“账号 -> 应用 -> API -> 请求/返回数量”串成单页闭环**
   - 竞品普遍有其中一部分能力，但较少在一个页面里同时给出可视化链路、统计卡、明细表和证据详情。

3. **补上双向计数与方向信息**
   - 请求命中、返回命中、请求量、返回量是你这次需求的关键，也是竞品公开页里相对少被直接强调的可视化点。

4. **在 API 风险监测语境下增强“可追溯 + 可解释”**
   - 不只是看见数据流向，还要解释：
     - 谁调了
     - 调了哪个应用
     - 调了哪个接口
     - 请求/返回侧分别命中了哪些标签
     - 是否形成异常扩散链路

## 对 Stage 2 PRD 的直接输入建议

### 页面结构建议
1. 顶部：敏感标签选择器 + 时间范围 + 应用筛选
2. 首屏摘要：标签概况、触达应用数、触达 API 数、关联账号数、请求量、返回量
3. 中部主视图：横向流转链路图
   - 标签节点
   - 账号节点
   - 应用节点
   - API 节点
4. 下部辅助视图：
   - 链路明细表
   - 事件时间线 / 最近调用记录
5. 右侧或抽屉：节点详情与证据样本

### 关键字段建议
- 标签名称
- 标签类别
- 风险等级
- 调用账号
- 所属应用
- API 方法
- API 路径
- 请求命中数量
- 返回命中数量
- 最近访问时间
- 关联风险状态

### 核心交互建议
- 以标签为主入口切换整条链路
- 支持点击任意节点高亮上下游
- 支持链路节点 drill-down 查看明细
- 支持“仅看请求方向 / 仅看返回方向 / 查看完整链路”切换

## 结论与建议

竞品给出的启发很明确：**本次页面不应只做一个 API 列表，也不应只做抽象血缘图，而是要做一个面向安全运营的“可调查链路页”。**  
建议在 PRD 中明确三层价值：`首屏快速判断`、`链路可视化理解`、`节点证据钻取`。这样既能体现 API 风险监测的业务语境，也能在视觉和功能上与通用 data lineage 工具形成差异。

## 跳过说明
- B 类文档解析：本次未执行，原因是未提供投标文档或合规标准原文。
- C 类洞察研究：本次未执行，原因是未提供用户访谈、用户反馈或明确角色研究输入。

## 证据链接
- Cyberhaven: [How data lineage works](https://www.cyberhaven.com/product/how-data-lineage-works)
- Securiti: [Data Lineage Tool](https://securiti.ai/products/data-lineage/)
- Netskope: [Data Lineage: Digital Breadcrumb Trails For Data Security](https://www.netskope.com/blog/data-lineage-digital-breadcrumb-trails-for-data-security)
- Salt Security: [Discover APIs Exposing Sensitive Data](https://salt.security/use-cases/extend-data-security-to-apis)
- Traceable: [Application & API Threat Protection](https://www.traceable.ai/api-protection)
