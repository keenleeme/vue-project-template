---
name: git-commit
description: 分析 git diff 变更内容，按模块分组生成结构化的 commit message。当用户输入 /git-commit、git -m 或需要编写 commit message 时触发。
---

# Git Commit Message 生成器

根据当前工作区的代码变更，自动分析并按模块生成结构化的 commit message。

## 触发条件

用户输入以下任意一种：
- `/git-commit`
- `git -m`
- "帮我写 commit message"
- "提交代码"

## 工作流程

### 第一步：获取变更

执行以下命令获取变更范围：

```bash
# 查看已暂存的变更（优先）
git diff --cached --stat
git diff --cached

# 若无暂存变更，查看未暂存变更
git diff --stat
git diff
```

### 第二步：模块划分

根据文件路径和变更内容，将改动按模块分组：

| 路径特征 | 模块 scope |
|---------|-----------|
| `module/risk/**` | `risk-behavior` 或 `risk-fragility` |
| `module/resources/**` | `resources` |
| `module/policy/**` | `policy` |
| `module/audit/**` | `audit-log` |
| `module/disruptor/**` | `disruptor` |
| `module/res/**` | `res-api` / `res-app` / `res-account` |
| `config/**` | `config` |
| `mapper/*.xml` | `mapper` |
| 多模块混合 | `core` |

### 第三步：生成 Message

采用 **Conventional Commits** 规范：

```
<type>(<scope>): <subject>

<body>
```

#### Type 选择规则

| type | 使用场景 |
|------|---------|
| `feat` | 新增功能 |
| `fix` | 修复 bug |
| `perf` | 性能优化 |
| `refactor` | 重构（非新功能、非修复） |
| `docs` | 文档变更 |
| `test` | 测试相关 |
| `chore` | 构建/工具/配置 |

#### Subject 规则

- 中英文均可，优先中文
- 不超过 50 字符
- 不以句号结尾
- 使用祈使语气（"增加"而非"增加了"）

#### Body 规则

- 按模块分段，每段一个小标题
- 每行不超过 72 字符
- 说明 **为什么** 而不仅仅是 **做了什么**
- 如有性能数据，附上预期提升

## 输出格式

### 单模块变更

```
perf(risk-behavior): 关联关系入库异步批量化改造

将 IP/Port、API 关联关系由同步单条 insert 改为
ArrayBlockingQueue + 独立线程批量落盘，DB 插入成功后
再更新 Roaring64LongSet 缓存，避免脏数据。

- IpPortRelationService：队列容量 20000，批量 1000 条
- ResApiRelationService：同上模式，独立持久化线程
- RelatedInfoConsumer：增加 riskId 非空及 DB 存在性校验
- 全量缓存初始化增加 @Transactional(readOnly=true)

预期吞吐提升 5-10 倍，单次耗时从 10-20ms 降至 0.3-1ms。
```

### 多模块变更

```
feat(core): API 参数化冲突检测与自动合并

res-api:
- 新增 findExistingParameterizedApi 冲突预检测方法
- updateApiParamConfig 同步阶段命中冲突时直接合并
- 合并后标记参数化任务为已完成，避免异步重复执行

risk-behavior:
- 行为风险关联关系异步批量化入库
- 优雅关闭时刷空队列保证数据不丢失

mapper:
- 新增 streamAllRiskBehaviorId 流式查询用于缓存预热
```

## 多提交建议

当变更涉及多个不相关主题时，建议用户拆分为多次提交：

```
建议拆分为以下提交：
1. perf(risk-behavior): 关联关系异步批量化改造（3 个文件）
2. feat(res-api): API 参数化冲突检测（2 个文件）
3. refactor(dispatch): 状态过滤逻辑精简（1 个文件）

是否按此拆分？或生成一条合并的 commit message？
```

## 注意事项

- 不要生成无意义的 message（如 "update code"、"fix bug"）
- 敏感信息（密码、token、内部地址）**绝不**出现在 message 中
- 若 diff 过大，仅分析 `--stat` 和关键文件的 diff 片段
- 优先使用 `git diff --cached`，其次 `git diff`
