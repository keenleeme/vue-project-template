# 档案管理功能说明

> 📁 **文件路径**: `src/views/archive-management/`  
> 🎯 **页面用途**: 数据处理者档案管理系统，实现档案的增删改查和多视图展示  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 主页面 | ✅ | `index.vue` | 页面主入口，包含搜索、操作区、数据展示 |
| 详情弹窗 | ✅ | `components/ArchiveDetailModal.vue` | 档案详情查看弹窗 |
| 文档说明 | ✅ | `README.md` | 页面功能说明文档 |

## 🎯 核心功能详情

### 1. 多条件搜索筛选

**功能描述**: 支持多维度组合搜索，包括区域、组织架构、名称、行业等条件

**实现位置**: 
- 主文件: `src/views/archive-management/index.vue` (第5-55行)
- 组件: 使用 `das-search-bar` 组件

**技术实现**:
```typescript
// 搜索表单状态
const searchForm = reactive({
  region: undefined,           // 区域（多选）
  organization: undefined,     // 组织架构（多选）
  name: '',                   // 名称
  industry: undefined,        // 所属行业
  shortName: '',              // 单位简称
  contact: '',                // 联系人
  recordNumber: '',           // 备案号
  tags: undefined,            // 数据处理者标签（多选）
  isIndependent: undefined    // 独立平台状态
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchArchiveData()
}
```

**交互流程**:
1. 用户选择或输入搜索条件
2. 点击搜索按钮触发 `handleSearch`  
3. 重置页码并重新获取数据
4. 更新表格/卡片视图显示

---

### 2. 双视图模式展示

**功能描述**: 支持表格视图和卡片视图两种数据展示方式，用户可自由切换

**实现位置**: 
- 主文件: `src/views/archive-management/index.vue` (第85-95行 操作区，第120-200行 展示区)
- 视图切换: 右侧操作栏的视图切换按钮

**技术实现**:
```typescript
// 视图状态控制
const viewMode = ref<'table' | 'card'>('table')

// 视图切换处理
const handleViewModeChange = (mode: 'table' | 'card') => {
  viewMode.value = mode
}

// 表格视图配置
const columns = [
  { title: '序号', dataIndex: 'index', width: 80, align: 'center' },
  { title: '名称', dataIndex: 'name', ellipsis: true },
  { title: '所属行业', dataIndex: 'industry' },
  { title: '组织架构', dataIndex: 'organization' },
  // ... 其他列配置
]

// 卡片视图使用 a-row + a-col 布局
```

**API接口**:
- 查询: `/api/archives` (GET)
- 详情: `/api/archives/{id}` (GET)

---

### 3. 档案详情查看

**功能描述**: 点击档案记录可查看完整的档案详情信息，以弹窗形式展示

**实现位置**: 
- 主文件: `src/views/archive-management/index.vue` (详情处理逻辑)
- 组件: `src/views/archive-management/components/ArchiveDetailModal.vue`

**技术实现**:
```typescript
// 详情弹窗状态
const detailModalVisible = ref(false)
const currentArchiveDetail = ref(null)

// 查看详情处理
const handleViewDetail = async (record) => {
  try {
    loading.value = true
    const response = await Http.get(`/api/archives/${record.id}`)
    currentArchiveDetail.value = response.data
    detailModalVisible.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
}
```

**交互流程**:
1. 用户点击表格行或卡片上的"查看详情"
2. 调用详情API获取完整信息
3. 打开详情弹窗展示数据
4. 用户可在弹窗中查看完整档案信息

---

## 🗂️ 文件结构

```
archive-management/
├── index.vue                          # 主页面入口
├── components/                        # 页面组件
│   └── ArchiveDetailModal.vue        # 详情弹窗组件
└── README.md                         # 页面功能说明文档
```

## 🎨 UI/UX 特点

### 布局特色
- 使用标准的页面布局：搜索区 + 操作区 + 数据展示区
- 支持响应式布局，适配不同屏幕尺寸
- 表格和卡片双视图可切换

### 组件使用
- **主要组件**: `das-search-bar` (搜索组件)、`a-table` (表格)、`a-card` (卡片)
- **自定义组件**: `ArchiveDetailModal` (详情弹窗)
- **第三方库**: Ant Design Vue

## 📊 数据流设计

### 状态管理
```typescript
// 主要数据状态
const pageState = reactive({
  searchForm: {/*搜索条件*/},
  archiveData: [],           // 档案列表数据
  total: 0,                  // 总数据量
  currentPage: 1,            // 当前页码
  pageSize: 10,              // 每页条数
  loading: false,            // 加载状态
  viewMode: 'table'          // 视图模式
})
```

### API调用
```typescript
// 主要API调用
import Http from '@/service'

const fetchArchiveData = async () => {
  const params = {
    ...searchForm,
    page: currentPage.value,
    pageSize: pageSize.value
  }
  const response = await Http.get('/api/archives', { params })
  return response
}
```

## 🔧 开发要点

### 技术难点
- **双视图切换**: 表格和卡片视图的数据同步和布局适配
- **多条件搜索**: 复杂搜索条件的状态管理和API参数处理
- **响应式布局**: 卡片视图在不同屏幕尺寸下的自适应

### 注意事项
- ⚠️ 搜索条件重置时要正确处理 undefined 值以显示 placeholder
- ⚠️ 视图切换时保持当前搜索状态和分页状态
- ⚠️ 详情弹窗关闭时要清理数据状态

### 优化建议
- 💡 考虑添加搜索条件的本地存储，提升用户体验
- 💡 表格列可以支持用户自定义显示/隐藏
- 💡 卡片视图可以考虑虚拟滚动优化大数据量性能

## 🔗 相关联的页面/功能

- **组织架构管理**: 提供组织架构选项数据
- **行业分类管理**: 提供行业选项数据  
- **标签管理**: 提供数据处理者标签选项
- **权限管理**: 控制档案的查看和操作权限

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2024-01-10 | 页面基础功能实现 | 开发团队 | 完成搜索、展示、详情查看功能 |
| 2024-01-12 | 双视图模式实现 | 开发团队 | 新增卡片视图切换功能 |

---

*📌 **使用提示**: 
1. 修改搜索条件时，注意更新 searchForm 的字段定义
2. 新增展示字段时，同时更新表格columns和卡片布局
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 