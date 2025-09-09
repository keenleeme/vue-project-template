# 数据库资产管理功能说明

> 📁 **文件路径**: `src/views/databaseAssets/`  
> 🎯 **页面用途**: 数据库资产信息统一管理，包括数据库实例管理、连接配置、资产状态跟踪  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 主页面 | ✅ | `index.vue` | 页面主入口(39KB大型页面) |
| 详情弹窗 | ✅ | `components/DatabaseDetailModal.vue` | 数据库详情查看弹窗 |
| 表单弹窗 | ✅ | `components/DatabaseFormModal.vue` | 新增/编辑数据库信息弹窗 |
| 导入弹窗 | ✅ | `components/ImportModal.vue` | 批量导入数据库资产弹窗 |
| 修改文档 | ✅ | `修改数据库资产.md` | 修改操作文档(13KB) |
| 说明文档 | ✅ | `README.md` | 页面功能说明文档 |

## 🎯 核心功能详情

### 1. 数据库资产信息管理

**功能描述**: 管理数据库实例的基本信息，包括数据库名称、类型、版本、连接配置等

**实现位置**: 
- 主文件: `src/views/databaseAssets/index.vue` (主要CRUD逻辑)
- 表单弹窗: `components/DatabaseFormModal.vue`

**技术实现**:
```typescript
// 数据库资产数据结构
interface DatabaseAsset {
  id: string
  databaseName: string       // 数据库名称
  databaseType: string       // 数据库类型(MySQL, PostgreSQL, Oracle等)
  version: string            // 数据库版本
  hostAddress: string        // 主机地址
  port: number               // 端口号
  username: string           // 用户名
  password: string           // 密码(加密存储)
  connectionString: string   // 连接字符串
  description: string        // 描述信息
  status: string             // 状态(在线/离线/维护中)
  environment: string        // 环境(开发/测试/生产)
  owner: string              // 负责人
  createTime: string         // 创建时间
  updateTime: string         // 更新时间
  lastConnectTime: string    // 最后连接时间
}

// 数据库资产操作方法
const handleDatabaseSave = async (formData: DatabaseAsset) => {
  const isEdit = !!formData.id
  const url = isEdit ? `/api/database-assets/${formData.id}` : '/api/database-assets'
  const method = isEdit ? 'put' : 'post'
  
  await Http[method](url, formData)
  message.success(`${isEdit ? '编辑' : '新增'}成功`)
  fetchDatabaseAssets()
}
```

**交互流程**:
1. 用户点击新增/编辑按钮打开表单弹窗
2. 填写数据库连接信息和基本属性
3. 可选择测试连接验证配置正确性
4. 保存后更新列表并显示连接状态

---

### 2. 数据库连接测试

**功能描述**: 验证数据库连接配置的正确性，确保能够正常连接到数据库实例

**实现位置**: 
- 主文件: `src/views/databaseAssets/index.vue` (连接测试逻辑)
- 表单弹窗: `components/DatabaseFormModal.vue` (测试连接按钮)

**技术实现**:
```typescript
// 连接测试方法
const testDatabaseConnection = async (connectionConfig: DatabaseAsset) => {
  try {
    loading.value = true
    const response = await Http.post('/api/database-assets/test-connection', {
      host: connectionConfig.hostAddress,
      port: connectionConfig.port,
      database: connectionConfig.databaseName,
      username: connectionConfig.username,
      password: connectionConfig.password,
      type: connectionConfig.databaseType
    })
    
    if (response.data.success) {
      message.success('数据库连接测试成功')
      return true
    } else {
      message.error(`连接失败: ${response.data.message}`)
      return false
    }
  } catch (error) {
    message.error('连接测试失败，请检查配置信息')
    return false
  } finally {
    loading.value = false
  }
}

// 批量连接状态检查
const batchCheckConnectionStatus = async (databaseIds: string[]) => {
  const response = await Http.post('/api/database-assets/batch-check-status', {
    ids: databaseIds
  })
  
  // 更新数据库状态
  updateDatabaseStatuses(response.data)
}
```

**API接口**:
- 测试连接: `/api/database-assets/test-connection` (POST)
- 批量状态检查: `/api/database-assets/batch-check-status` (POST)

---

### 3. 数据库资产搜索筛选

**功能描述**: 支持按数据库名称、类型、状态、环境等多维度搜索和筛选

**实现位置**: 
- 主文件: `src/views/databaseAssets/index.vue` (搜索筛选逻辑)
- 搜索表单区域

**技术实现**:
```typescript
// 搜索表单数据
const searchForm = reactive({
  databaseName: '',          // 数据库名称
  databaseType: undefined,   // 数据库类型
  status: undefined,         // 连接状态
  environment: undefined,    // 环境类型
  owner: '',                 // 负责人
  createTimeRange: [],       // 创建时间范围
  lastConnectTimeRange: []   // 最后连接时间范围
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchDatabaseAssets()
}

// 高级筛选
const handleAdvancedFilter = (filters: any) => {
  Object.assign(searchForm, filters)
  handleSearch()
}
```

**交互流程**:
1. 用户在搜索表单中输入筛选条件
2. 支持单个或多个条件组合搜索
3. 实时显示搜索结果
4. 支持重置搜索条件

---

### 4. 批量导入功能

**功能描述**: 支持Excel文件批量导入数据库资产信息，提供模板下载和数据验证

**实现位置**: 
- 主文件: `src/views/databaseAssets/index.vue` (导入按钮)
- 导入弹窗: `components/ImportModal.vue`

**技术实现**:
```typescript
// 文件上传处理
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await Http.post('/api/database-assets/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (response.data.success) {
      message.success(`导入成功，新增 ${response.data.successCount} 条记录`)
      if (response.data.failedCount > 0) {
        message.warning(`${response.data.failedCount} 条记录导入失败`)
      }
      fetchDatabaseAssets()
    }
  } catch (error) {
    message.error('文件导入失败')
  }
}

// 模板下载
const downloadTemplate = async () => {
  const response = await Http.get('/api/database-assets/import-template', {
    responseType: 'blob'
  })
  downloadFile(response.data, 'database-assets-template.xlsx')
}
```

**API接口**:
- 批量导入: `/api/database-assets/import` (POST)
- 模板下载: `/api/database-assets/import-template` (GET)

---

### 5. 数据库资产监控

**功能描述**: 监控数据库的连接状态、性能指标、存储使用情况等关键信息

**实现位置**: 
- 主文件: `src/views/databaseAssets/index.vue` (监控功能)
- 详情弹窗: `components/DatabaseDetailModal.vue` (详细监控信息)

**技术实现**:
```typescript
// 监控数据结构
interface DatabaseMonitorInfo {
  connectionStatus: string   // 连接状态
  responseTime: number       // 响应时间(ms)
  cpuUsage: number          // CPU使用率
  memoryUsage: number       // 内存使用率
  diskUsage: number         // 磁盘使用率
  activeConnections: number  // 活跃连接数
  maxConnections: number     // 最大连接数
  queryPerSecond: number     // 每秒查询数
  lastUpdateTime: string     // 最后更新时间
}

// 获取监控信息
const fetchMonitorInfo = async (databaseId: string) => {
  const response = await Http.get(`/api/database-assets/${databaseId}/monitor`)
  return response.data
}

// 实时监控数据刷新
const startMonitoring = (databaseId: string) => {
  const timer = setInterval(async () => {
    const monitorData = await fetchMonitorInfo(databaseId)
    updateMonitorDisplay(monitorData)
  }, 30000) // 30秒刷新一次
  
  return timer
}
```

**API接口**:
- 获取监控信息: `/api/database-assets/{id}/monitor` (GET)
- 获取历史监控: `/api/database-assets/{id}/monitor/history` (GET)

---

## 🗂️ 文件结构

```
databaseAssets/
├── index.vue                          # 主页面入口(39KB大型文件)
├── components/                        # 页面组件
│   ├── DatabaseDetailModal.vue       # 数据库详情弹窗
│   ├── DatabaseFormModal.vue         # 数据库表单弹窗
│   └── ImportModal.vue               # 批量导入弹窗
├── 修改数据库资产.md                   # 修改操作文档(13KB)
└── README.md                         # 页面功能说明文档
```

## 🎨 UI/UX 特点

### 布局特色
- 标准的列表管理页面布局：搜索区 + 操作区 + 数据表格
- 支持数据库连接状态的实时显示
- 详情弹窗展示完整的监控信息和配置详情

### 组件使用
- **主要组件**: `das-search-bar`, `a-table`, `a-modal`, `a-form`
- **自定义组件**: 3个功能弹窗组件
- **第三方库**: 可能使用图表库展示监控数据

## 📊 数据流设计

### 状态管理
```typescript
// 主要数据状态
const pageState = reactive({
  databaseAssets: [],        // 数据库资产列表
  searchForm: {/*搜索条件*/},
  loading: false,            // 加载状态
  selectedRowKeys: [],       // 选中的行
  modalVisible: {            // 弹窗状态
    form: false,
    detail: false,
    import: false
  },
  monitorData: new Map()     // 监控数据缓存
})
```

### API调用
```typescript
// 主要API调用
import Http from '@/service'

// 获取数据库资产列表
const fetchDatabaseAssets = async () => {
  const response = await Http.get('/api/database-assets', {
    params: { ...searchForm, page: currentPage.value, pageSize: pageSize.value }
  })
  databaseAssets.value = response.data.list
}

// 获取详细信息
const fetchDatabaseDetail = async (id: string) => {
  const response = await Http.get(`/api/database-assets/${id}`)
  return response.data
}
```

## 🔧 开发要点

### 技术难点
- **连接管理**: 多种数据库类型的连接配置和测试
- **安全性**: 数据库密码的加密存储和传输
- **监控集成**: 实时监控数据的获取和展示
- **批量操作**: 大量数据库资产的批量导入和操作

### 注意事项
- ⚠️ 数据库密码等敏感信息需要加密处理
- ⚠️ 连接测试可能耗时较长，需要合理的超时设置
- ⚠️ 监控数据较大，需要考虑缓存和性能优化

### 优化建议
- 💡 添加数据库资产的分组管理功能
- 💡 支持数据库连接池配置和管理
- 💡 考虑添加数据库备份和恢复功能
- 💡 优化监控数据的实时刷新机制

## 🔗 相关联的页面/功能

- **表资产管理**: 管理数据库下的表资源
- **数据库账号管理**: 管理数据库的访问账号
- **系统监控**: 整体系统的监控和告警
- **应用系统管理**: 关联使用数据库的应用系统

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2023-12-15 | 基础功能实现 | 开发团队 | 完成数据库资产的基本管理功能 |
| 2024-01-01 | 连接测试功能 | 开发团队 | 新增数据库连接测试和状态检查 |
| 2024-01-08 | 监控功能 | 开发团队 | 新增数据库性能监控功能 |

---

*📌 **使用提示**: 
1. 配置数据库连接时，注意测试连接确保配置正确
2. 敏感信息如密码需要妥善保管，避免明文存储
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 