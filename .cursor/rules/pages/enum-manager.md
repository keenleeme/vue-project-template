# 枚举管理功能说明

> 📁 **文件路径**: `src/views/enum/`  
> 🎯 **页面用途**: 系统枚举值统一管理，包括枚举组和枚举值的增删改查，支持系统内置保护  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 主页面 | ✅ | `EnumManager.vue` | 页面主入口，左右分栏布局 |
| 枚举组编辑弹窗 | ✅ | `components/EnumGroupEditDialog.vue` | 新增/编辑枚举组弹窗 |
| 枚举组查看弹窗 | ✅ | `components/EnumGroupViewDialog.vue` | 查看枚举组详情弹窗 |
| 枚举值编辑弹窗 | ✅ | `components/EnumValueEditDialog.vue` | 新增/编辑枚举值弹窗 |

## 🎯 核心功能详情

### 1. 左右分栏布局管理

**功能描述**: 左侧展示枚举组列表，右侧展示选中枚举组的枚举值列表

**实现位置**: 
- 主文件: `src/views/enum/EnumManager.vue` (整体布局)
- 左侧: 枚举组列表区域
- 右侧: 枚举值列表区域

**技术实现**:
```typescript
// 布局状态管理
const layoutState = reactive({
  selectedGroupId: null,        // 当前选中的枚举组ID
  leftPanelWidth: '30%',       // 左侧面板宽度
  rightPanelWidth: '70%'       // 右侧面板宽度
})

// 枚举组选择处理
const handleGroupSelect = (groupId: string) => {
  layoutState.selectedGroupId = groupId
  fetchEnumValues(groupId)
}
```

**交互流程**:
1. 页面加载时获取枚举组列表
2. 用户点击左侧枚举组
3. 右侧自动加载对应的枚举值列表
4. 支持左右面板宽度调整

---

### 2. 枚举组管理

**功能描述**: 管理枚举组的创建、编辑、删除和查看，支持系统内置组保护

**实现位置**: 
- 主文件: `src/views/enum/EnumManager.vue` (左侧枚举组区域)
- 编辑弹窗: `components/EnumGroupEditDialog.vue`
- 查看弹窗: `components/EnumGroupViewDialog.vue`

**技术实现**:
```typescript
// 枚举组数据
const enumGroups = reactive({
  list: [],                    // 枚举组列表
  loading: false,              // 加载状态
  total: 0                     // 总数
})

// 枚举组数据结构
interface EnumGroup {
  id: string
  groupCode: string            // 组编码
  groupName: string           // 组名称
  description?: string        // 描述
  isBuiltin: boolean          // 是否系统内置
  createTime: string          // 创建时间
  updateTime: string          // 更新时间
}

// 新增/编辑枚举组
const handleGroupSave = async (groupData: EnumGroup) => {
  const isEdit = !!groupData.id
  const url = isEdit ? `/api/enum-groups/${groupData.id}` : '/api/enum-groups'
  const method = isEdit ? 'put' : 'post'
  
  await Http[method](url, groupData)
  message.success(`${isEdit ? '编辑' : '新增'}成功`)
  fetchEnumGroups()
}
```

**API接口**:
- 查询组列表: `/api/enum-groups` (GET)
- 新增组: `/api/enum-groups` (POST)
- 编辑组: `/api/enum-groups/{id}` (PUT)
- 删除组: `/api/enum-groups/{id}` (DELETE)
- 查看组详情: `/api/enum-groups/{id}` (GET)

---

### 3. 枚举值管理

**功能描述**: 管理选中枚举组下的枚举值，支持增删改查和排序

**实现位置**: 
- 主文件: `src/views/enum/EnumManager.vue` (右侧枚举值区域)
- 编辑弹窗: `components/EnumValueEditDialog.vue`

**技术实现**:
```typescript
// 枚举值数据
const enumValues = reactive({
  list: [],                    // 枚举值列表
  loading: false,              // 加载状态
  groupId: null               // 所属枚举组ID
})

// 枚举值数据结构
interface EnumValue {
  id: string
  valueName: string           // 值名称
  valueCode: string          // 值编码  
  description?: string       // 描述
  sortOrder: number          // 排序
  isBuiltin: boolean         // 是否系统内置
  groupId: string           // 所属组ID
}

// 枚举值排序处理
const handleValueSort = async (values: EnumValue[]) => {
  const sortData = values.map((item, index) => ({
    id: item.id,
    sortOrder: index + 1
  }))
  
  await Http.post('/api/enum-values/sort', { values: sortData })
  message.success('排序保存成功')
}
```

**API接口**:
- 查询值列表: `/api/enum-values?groupId={groupId}` (GET)
- 新增值: `/api/enum-values` (POST)
- 编辑值: `/api/enum-values/{id}` (PUT)
- 删除值: `/api/enum-values/{id}` (DELETE)
- 批量排序: `/api/enum-values/sort` (POST)

---

### 4. 系统内置保护机制

**功能描述**: 系统内置的枚举组和枚举值不允许编辑和删除，只能查看

**实现位置**: 
- 主文件: `src/views/enum/EnumManager.vue` (操作按钮控制)
- 所有弹窗组件: 根据 `isBuiltin` 字段控制

**技术实现**:
```typescript
// 操作权限判断
const canEdit = computed(() => (item: EnumGroup | EnumValue) => {
  return !item.isBuiltin
})

const canDelete = computed(() => (item: EnumGroup | EnumValue) => {
  return !item.isBuiltin
})

// 操作按钮渲染
const renderActionButtons = (record: EnumGroup | EnumValue) => {
  return [
    <a-button size="small" onClick={() => handleView(record)}>查看</a-button>,
    canEdit.value(record) && <a-button size="small" type="primary" onClick={() => handleEdit(record)}>编辑</a-button>,
    canDelete.value(record) && <a-button size="small" danger onClick={() => handleDelete(record)}>删除</a-button>
  ].filter(Boolean)
}
```

---

### 5. 数据验证和约束

**功能描述**: 确保枚举编码的唯一性，验证数据格式，防止重复和冲突

**实现位置**: 
- 编辑弹窗: `components/EnumGroupEditDialog.vue`, `components/EnumValueEditDialog.vue`
- 表单验证规则

**技术实现**:
```typescript
// 表单验证规则
const groupFormRules = {
  groupCode: [
    { required: true, message: '请输入组编码' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '编码必须以字母开头，只能包含字母、数字和下划线' },
    { validator: validateGroupCodeUnique, trigger: 'blur' }
  ],
  groupName: [
    { required: true, message: '请输入组名称' },
    { max: 50, message: '组名称不能超过50个字符' }
  ]
}

// 编码唯一性验证
const validateGroupCodeUnique = async (rule: any, value: string) => {
  if (!value) return true
  
  const response = await Http.get('/api/enum-groups/check-code', {
    params: { code: value, excludeId: editForm.id }
  })
  
  if (response.data.exists) {
    throw new Error('编码已存在')
  }
}
```

---

## 🗂️ 文件结构

```
enum/
├── EnumManager.vue                    # 主页面入口
└── components/                        # 页面组件
    ├── EnumGroupEditDialog.vue       # 枚举组编辑弹窗
    ├── EnumGroupViewDialog.vue       # 枚举组查看弹窗
    └── EnumValueEditDialog.vue       # 枚举值编辑弹窗
```

## 🎨 UI/UX 特点

### 布局特色
- 左右分栏设计，左侧枚举组，右侧枚举值
- 支持拖拽调整左右面板宽度
- 表格支持拖拽排序（枚举值）

### 组件使用
- **主要组件**: `a-table`, `a-modal`, `a-form`, `a-split`
- **自定义组件**: 3个功能弹窗组件
- **第三方库**: 可能使用拖拽排序库

## 📊 数据流设计

### 状态管理
```typescript
// 主要数据状态
const pageState = reactive({
  enumGroups: {/*枚举组数据*/},
  enumValues: {/*枚举值数据*/},
  selectedGroupId: null,     // 当前选中的组
  modalVisible: {            // 各弹窗显示状态
    groupEdit: false,
    groupView: false,
    valueEdit: false
  },
  editingItem: null          // 正在编辑的项目
})
```

### API调用
```typescript
// 主要API调用
import Http from '@/service'

// 获取枚举组列表
const fetchEnumGroups = async () => {
  const response = await Http.get('/api/enum-groups')
  enumGroups.list = response.data
}

// 获取枚举值列表
const fetchEnumValues = async (groupId: string) => {
  const response = await Http.get('/api/enum-values', {
    params: { groupId }
  })
  enumValues.list = response.data
}
```

## 🔧 开发要点

### 技术难点
- **数据关联**: 枚举组和枚举值的关联关系管理
- **权限控制**: 系统内置项的编辑权限控制
- **数据验证**: 编码唯一性和格式验证

### 注意事项
- ⚠️ 删除枚举组前需检查是否有关联的枚举值
- ⚠️ 系统内置枚举不允许修改，需要明确的UI提示
- ⚠️ 枚举编码修改可能影响系统其他功能，需要谨慎处理

### 优化建议
- 💡 可以添加枚举使用情况统计功能
- 💡 支持枚举的导入导出功能
- 💡 考虑添加枚举值的批量编辑功能

## 🔗 相关联的页面/功能

- **所有业务页面**: 都可能使用到枚举数据作为下拉选项
- **系统配置**: 枚举配置影响整个系统的选项数据
- **数据字典**: 与数据字典功能关联
- **权限管理**: 控制枚举管理的操作权限

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2024-01-05 | 基础功能实现 | 开发团队 | 完成枚举组和枚举值的基本增删改查 |
| 2024-01-08 | 内置保护机制 | 开发团队 | 新增系统内置枚举的保护功能 |
| 2024-01-10 | 排序功能 | 开发团队 | 新增枚举值拖拽排序功能 |

---

*📌 **使用提示**: 
1. 修改枚举结构时，需要考虑对现有业务功能的影响
2. 新增系统级枚举时，建议设置为内置保护
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 