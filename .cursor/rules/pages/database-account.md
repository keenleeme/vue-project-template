# 数据库账号管理功能说明

> 📁 **文件路径**: `src/views/databaseAccount/`  
> 🎯 **页面用途**: 数据库账号全生命周期管理，包括账号信息展示、统计分析、审计管理  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 主页面 | ✅ | `index.vue` | 页面主入口，包含统计、搜索、表格展示 |
| 账号表单弹窗 | ✅ | `components/AccountFormModal.vue` | 新增/编辑账号信息弹窗 |
| 生命周期管理 | ✅ | `components/LifecycleModal.vue` | 账号生命周期操作弹窗 |
| 审计日志查看 | ✅ | `components/AuditLogModal.vue` | 账号审计日志展示弹窗 |
| 批量导入 | ✅ | `components/ImportModal.vue` | 账号批量导入功能弹窗 |
| 需求文档 | ✅ | `数据库账号管理.md` | 详细需求设计文档 |

## 🎯 核心功能详情

### 1. 统计概览展示

**功能描述**: 顶部展示账号组织架构TOP10和应用账号统计TOP10的数据可视化

**实现位置**: 
- 主文件: `src/views/databaseAccount/index.vue` (统计图表区域)
- 图表组件: 使用 ECharts 或 das-simple-chart

**技术实现**:
```typescript
// 统计数据状态
const statisticsData = reactive({
  organizationTop10: [],    // 组织架构TOP10数据
  applicationTop10: []      // 应用账号统计TOP10数据
})

// 获取统计数据
const fetchStatisticsData = async () => {
  const orgResponse = await Http.get('/api/database-accounts/organization-stats')
  const appResponse = await Http.get('/api/database-accounts/application-stats')
  statisticsData.organizationTop10 = orgResponse.data
  statisticsData.applicationTop10 = appResponse.data
}
```

**交互流程**:
1. 页面加载时自动获取统计数据
2. 渲染柱状图和饼图展示
3. 支持图表交互（点击、悬停等）

---

### 2. 全量账号信息管理

**功能描述**: 以表格形式展示全量数据库账号信息，支持搜索、排序、分页等操作

**实现位置**: 
- 主文件: `src/views/databaseAccount/index.vue` (表格区域)
- 表单弹窗: `components/AccountFormModal.vue`

**技术实现**:
```typescript
// 账号列表数据
const accountData = reactive({
  list: [],                 // 账号列表
  total: 0,                 // 总数
  loading: false,           // 加载状态
  currentPage: 1,           // 当前页
  pageSize: 10              // 每页条数
})

// 表格列定义
const columns = [
  { title: '账号名称', dataIndex: 'accountName', key: 'accountName' },
  { title: '账号类型', dataIndex: 'accountType', key: 'accountType' },
  { title: '所属应用', dataIndex: 'application', key: 'application' },
  { title: '组织架构', dataIndex: 'organization', key: 'organization' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', fixed: 'right', width: 200 }
]
```

**API接口**:
- 查询列表: `/api/database-accounts` (GET)
- 新增账号: `/api/database-accounts` (POST)
- 编辑账号: `/api/database-accounts/{id}` (PUT)
- 删除账号: `/api/database-accounts/{id}` (DELETE)

---

### 3. 账号生命周期管理

**功能描述**: 管理账号的完整生命周期，包括创建、激活、禁用、删除等状态变更

**实现位置**: 
- 主文件: `src/views/databaseAccount/index.vue` (操作按钮)
- 组件: `components/LifecycleModal.vue`

**技术实现**:
```typescript
// 生命周期操作
const handleLifecycleOperation = async (accountId: string, operation: string) => {
  try {
    await Http.post(`/api/database-accounts/${accountId}/lifecycle`, {
      operation,
      reason: operationReason.value
    })
    message.success('操作成功')
    fetchAccountData()
  } catch (error) {
    message.error('操作失败')
  }
}

// 支持的生命周期操作
enum LifecycleOperation {
  ACTIVATE = 'activate',     // 激活
  DISABLE = 'disable',       // 禁用
  RESET = 'reset',          // 重置
  DELETE = 'delete'         // 删除
}
```

**交互流程**:
1. 用户选择账号并点击生命周期操作按钮
2. 弹出操作确认弹窗
3. 用户填写操作原因并确认
4. 调用API执行操作并更新列表

---

### 4. 审计日志管理

**功能描述**: 记录和查看所有账号相关的操作日志，支持审计追踪

**实现位置**: 
- 主文件: `src/views/databaseAccount/index.vue` (审计按钮)
- 组件: `components/AuditLogModal.vue`

**技术实现**:
```typescript
// 审计日志数据
const auditLogs = reactive({
  list: [],
  loading: false,
  total: 0
})

// 获取审计日志
const fetchAuditLogs = async (accountId: string) => {
  const response = await Http.get(`/api/database-accounts/${accountId}/audit-logs`)
  auditLogs.list = response.data.list
  auditLogs.total = response.data.total
}
```

---

### 5. 批量导入功能

**功能描述**: 支持Excel文件批量导入账号信息，提供模板下载和数据验证

**实现位置**: 
- 主文件: `src/views/databaseAccount/index.vue` (导入按钮)
- 组件: `components/ImportModal.vue`

**技术实现**:
```typescript
// 文件上传处理
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await Http.post('/api/database-accounts/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  return response.data
}
```

---

## 🗂️ 文件结构

```
databaseAccount/
├── index.vue                          # 主页面入口
├── components/                        # 页面组件
│   ├── AccountFormModal.vue          # 账号表单弹窗
│   ├── LifecycleModal.vue           # 生命周期管理弹窗
│   ├── AuditLogModal.vue            # 审计日志弹窗
│   └── ImportModal.vue              # 批量导入弹窗
├── 数据库账号管理.md                  # 需求设计文档
└── 数据资源账号管理.md                # 扩展需求文档
```

## 🎨 UI/UX 特点

### 布局特色
- 顶部统计图表 + 中间搜索操作区 + 底部数据表格的三段式布局
- 统计图表使用柱状图和饼图直观展示数据分布
- 表格支持固定列和自适应宽度

### 组件使用
- **主要组件**: `das-search-bar`, `a-table`, `a-modal`, 图表组件
- **自定义组件**: 4个功能弹窗组件
- **第三方库**: ECharts (图表)、Ant Design Vue

## 📊 数据流设计

### 状态管理
```typescript
// 主要数据状态
const pageState = reactive({
  statisticsData: {/*统计数据*/},
  accountData: {/*账号列表数据*/},
  searchForm: {/*搜索条件*/},
  selectedRows: [],          // 选中的行
  loading: false,            // 全局加载状态
  modalVisible: {            // 各弹窗显示状态
    form: false,
    lifecycle: false,
    audit: false,
    import: false
  }
})
```

### API调用
```typescript
// 主要API调用
import Http from '@/service'

// 获取账号列表
const fetchAccountData = async () => {
  const response = await Http.get('/api/database-accounts', {
    params: { ...searchForm, page: currentPage.value, pageSize: pageSize.value }
  })
}

// 获取统计数据
const fetchStatistics = async () => {
  const [orgStats, appStats] = await Promise.all([
    Http.get('/api/database-accounts/organization-stats'),
    Http.get('/api/database-accounts/application-stats')
  ])
}
```

## 🔧 开发要点

### 技术难点
- **数据可视化**: 统计图表的数据处理和展示效果
- **批量操作**: 大量数据的导入处理和进度反馈
- **状态同步**: 多个弹窗间的数据状态同步

### 注意事项
- ⚠️ 生命周期操作需要确认机制，防止误操作
- ⚠️ 审计日志数据量可能很大，需要分页和性能优化
- ⚠️ 导入功能需要详细的错误提示和数据验证

### 优化建议
- 💡 统计图表可以增加时间范围筛选功能
- 💡 表格可以支持列的显示/隐藏配置
- 💡 考虑添加账号到期提醒功能

## 🔗 相关联的页面/功能

- **应用系统管理**: 提供应用选项数据
- **组织架构管理**: 提供组织架构选项数据
- **权限管理**: 控制账号管理的操作权限
- **系统日志**: 与审计日志功能关联

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2024-01-08 | 基础功能实现 | 开发团队 | 完成账号列表、搜索、基本操作 |
| 2024-01-10 | 统计图表功能 | 开发团队 | 新增TOP10统计图表展示 |
| 2024-01-12 | 生命周期管理 | 开发团队 | 完善账号生命周期操作功能 |

---

*📌 **使用提示**: 
1. 修改表格字段时，注意同步更新表单弹窗的字段
2. 新增生命周期操作时，需要同时更新API和前端枚举定义
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 