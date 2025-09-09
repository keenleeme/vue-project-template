# 应用系统管理功能说明

> 📁 **文件路径**: `src/views/applicationSystem/`  
> 🎯 **页面用途**: 应用系统信息统一管理，包括系统注册、详情管理、风险评估和统计分析  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 主页面 | ✅ | `index.vue` | 页面主入口，包含搜索、统计、双视图 |
| 新增/编辑页面 | ✅ | `addOrEditSystem.vue` | 系统信息录入和编辑页面 |
| 详情页面 | ✅ | `ApplicationSystemDetail.vue` | 系统详情查看页面 |
| 搜索表单组件 | ✅ | `components/SystemSearchForm.vue` | 多条件搜索组件 |
| 系统卡片组件 | ✅ | `components/SystemCard.vue` | 系统信息卡片展示 |
| 卡片列表组件 | ✅ | `components/SystemCardList.vue` | 卡片视图容器 |
| 风险概况组件 | ✅ | `components/RiskOverview.vue` | 风险统计图表 |
| 系统类型图表 | ✅ | `components/SystemTypeChart.vue` | 系统类型分布图 |
| 等级分布图表 | ✅ | `components/LevelChart.vue` | 系统等级分布统计 |
| 表格工具栏 | ✅ | `components/TableToolbar.vue` | 批量操作工具栏 |
| 组织树组件 | ✅ | `components/OrgTree.vue` | 组织架构树形选择 |

## 🎯 核心功能详情

### 1. 多维度搜索筛选

**功能描述**: 支持按系统名称、类型、等级、组织架构等多个维度进行组合搜索

**实现位置**: 
- 主文件: `src/views/applicationSystem/index.vue`
- 组件: `components/SystemSearchForm.vue`

**技术实现**:
```typescript
// 搜索表单数据结构
const searchForm = reactive({
  systemName: '',           // 系统名称
  systemType: undefined,    // 系统类型
  riskLevel: undefined,     // 风险等级
  organization: undefined,  // 组织架构
  status: undefined,        // 系统状态
  dateRange: []            // 创建时间范围
})

// 搜索处理逻辑
const handleSearch = () => {
  currentPage.value = 1
  fetchSystemData()
}
```

**交互流程**:
1. 用户在搜索表单中输入筛选条件
2. 点击搜索按钮触发 `handleSearch`
3. 重置分页并调用数据获取接口
4. 更新卡片和表格视图显示

---

### 2. 数据统计可视化

**功能描述**: 顶部展示风险概况、系统类型分布、等级分布三个维度的统计图表

**实现位置**: 
- 主文件: `src/views/applicationSystem/index.vue` (统计区域)
- 组件: `components/RiskOverview.vue`, `components/SystemTypeChart.vue`, `components/LevelChart.vue`

**技术实现**:
```typescript
// 统计数据状态
const statisticsData = reactive({
  riskStats: {             // 风险统计
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  },
  systemTypeData: [],      // 系统类型分布
  levelDistributionData: [] // 等级分布数据
})

// 获取统计数据
const fetchStatisticsData = async () => {
  const [riskResponse, typeResponse, levelResponse] = await Promise.all([
    Http.get('/api/application-systems/risk-stats'),
    Http.get('/api/application-systems/type-distribution'),
    Http.get('/api/application-systems/level-distribution')
  ])
  
  statisticsData.riskStats = riskResponse.data
  statisticsData.systemTypeData = typeResponse.data
  statisticsData.levelDistributionData = levelResponse.data
}
```

**API接口**:
- 风险统计: `/api/application-systems/risk-stats` (GET)
- 类型分布: `/api/application-systems/type-distribution` (GET)
- 等级分布: `/api/application-systems/level-distribution` (GET)

---

### 3. 双视图模式展示

**功能描述**: 支持系统卡片视图和系统管理表格视图两种展示方式，通过Tab切换

**实现位置**: 
- 主文件: `src/views/applicationSystem/index.vue` (Tab区域)
- 卡片视图: `components/SystemCardList.vue`
- 表格视图: 内置a-table组件

**技术实现**:
```typescript
// Tab状态管理
const activeTab = ref('cards')

// 系统数据
const systems = ref([])
const selectedRowKeys = ref([])
const selectedSystems = computed(() => 
  systems.value.filter(item => selectedRowKeys.value.includes(item.id))
)

// 表格列配置
const tableColumns = [
  { title: '系统名称', dataIndex: 'systemName', key: 'systemName' },
  { title: '系统类型', dataIndex: 'systemType', key: 'systemType' },
  { title: '风险等级', dataIndex: 'riskLevel', key: 'riskLevel' },
  { title: '负责人', dataIndex: 'owner', key: 'owner' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', fixed: 'right', width: 200 }
]
```

**交互流程**:
1. 默认显示卡片视图，以卡片形式展示系统信息
2. 用户可切换到管理视图，以表格形式显示
3. 管理视图支持批量选择和操作
4. 两个视图共享相同的数据源和搜索条件

---

### 4. 系统信息管理

**功能描述**: 系统的新增、编辑、删除、查看详情等基本CRUD操作

**实现位置**: 
- 新增/编辑: `src/views/applicationSystem/addOrEditSystem.vue`
- 详情查看: `src/views/applicationSystem/ApplicationSystemDetail.vue`
- 操作触发: 主页面的操作按钮

**技术实现**:
```typescript
// 系统操作方法
const addSystem = () => {
  router.push('/application-system/add')
}

const editSystem = (record) => {
  router.push(`/application-system/edit/${record.id}`)
}

const viewDetails = (record) => {
  router.push(`/application-system/detail/${record.id}`)
}

const deleteSystem = async (record) => {
  await Http.delete(`/api/application-systems/${record.id}`)
  message.success('删除成功')
  fetchSystemData()
}
```

**API接口**:
- 查询列表: `/api/application-systems` (GET)
- 新增系统: `/api/application-systems` (POST)
- 编辑系统: `/api/application-systems/{id}` (PUT)
- 删除系统: `/api/application-systems/{id}` (DELETE)
- 查看详情: `/api/application-systems/{id}` (GET)

---

### 5. 批量操作功能

**功能描述**: 支持批量导出、批量扫描、批量删除等操作

**实现位置**: 
- 主文件: `src/views/applicationSystem/index.vue` (表格视图)
- 组件: `components/TableToolbar.vue`

**技术实现**:
```typescript
// 批量操作方法
const exportSystems = async () => {
  const selectedIds = selectedRowKeys.value
  const response = await Http.post('/api/application-systems/export', {
    ids: selectedIds
  }, { responseType: 'blob' })
  
  // 下载导出文件
  downloadFile(response.data, 'systems.xlsx')
}

const scanTask = async () => {
  const selectedIds = selectedRowKeys.value
  await Http.post('/api/application-systems/scan', { ids: selectedIds })
  message.success('扫描任务已启动')
}

const deleteSelected = async () => {
  const selectedIds = selectedRowKeys.value
  await Http.delete('/api/application-systems/batch', { 
    data: { ids: selectedIds } 
  })
  message.success('批量删除成功')
  fetchSystemData()
}
```

---

## 🗂️ 文件结构

```
applicationSystem/
├── index.vue                         # 主页面入口
├── addOrEditSystem.vue              # 新增/编辑页面
├── ApplicationSystemDetail.vue      # 详情页面
├── components/                      # 页面组件
│   ├── form/                       # 表单相关组件
│   ├── common/                     # 通用组件
│   ├── SystemSearchForm.vue       # 搜索表单
│   ├── SystemCard.vue             # 系统卡片
│   ├── SystemCardList.vue         # 卡片列表
│   ├── RiskOverview.vue           # 风险概况
│   ├── SystemTypeChart.vue        # 类型分布图
│   ├── LevelChart.vue             # 等级分布图
│   ├── TableToolbar.vue           # 表格工具栏
│   └── OrgTree.vue                # 组织树
├── composables/                    # 逻辑复用
└── detail/                        # 详情相关组件
```

## 🎨 UI/UX 特点

### 布局特色
- 顶部搜索区 + 中间统计图表区 + 底部双视图展示区的三段式布局
- 统计图表使用3个等宽的图表并排展示
- Tab切换实现卡片视图和表格视图

### 组件使用
- **主要组件**: `das-search-bar`, `a-table`, `a-tabs`, `a-card`, 图表组件
- **自定义组件**: 8个功能组件，高度组件化
- **第三方库**: ECharts (图表)、Ant Design Vue

## 📊 数据流设计

### 状态管理
```typescript
// 主要数据状态
const pageState = reactive({
  searchForm: {/*搜索条件*/},
  systems: [],              // 系统列表数据
  statisticsData: {/*统计数据*/},
  loading: false,           // 加载状态
  activeTab: 'cards',       // 当前视图
  selectedRowKeys: [],      // 选中的行
  currentPage: 1,           // 当前页码
  pageSize: 10              // 每页条数
})
```

### API调用
```typescript
// 主要API调用
import Http from '@/service'

// 获取系统列表
const fetchSystemData = async () => {
  const response = await Http.get('/api/application-systems', {
    params: { ...searchForm, page: currentPage.value, pageSize: pageSize.value }
  })
  systems.value = response.data.list
}

// 获取统计数据
const fetchStatistics = async () => {
  // 并行获取多个统计接口
}
```

## 🔧 开发要点

### 技术难点
- **组件化拆分**: 复杂页面的合理组件化拆分
- **图表联动**: 多个统计图表的数据关联和交互
- **路由管理**: 列表、新增、编辑、详情页面的路由跳转

### 注意事项
- ⚠️ 批量操作前需要检查是否有选中数据
- ⚠️ 统计图表数据更新要与列表数据保持同步
- ⚠️ 页面路由跳转时要处理好数据状态

### 优化建议
- 💡 可以考虑添加系统拓扑图展示功能
- 💡 统计图表可以支持钻取查看详细数据
- 💡 考虑添加系统健康状态监控功能

## 🔗 相关联的页面/功能

- **组织架构管理**: 提供组织架构选项数据
- **数据库资产管理**: 关联系统的数据库资源
- **用户权限管理**: 控制系统访问权限
- **系统监控**: 系统运行状态监控

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2024-01-01 | 基础功能实现 | 开发团队 | 完成系统列表、搜索、基本操作 |
| 2024-01-05 | 统计图表功能 | 开发团队 | 新增风险概况、类型分布等统计 |
| 2024-01-10 | 双视图模式 | 开发团队 | 新增卡片视图和管理视图切换 |

---

*📌 **使用提示**: 
1. 修改搜索条件时，注意同步更新 SystemSearchForm 组件
2. 新增统计维度时，需要创建对应的图表组件
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 