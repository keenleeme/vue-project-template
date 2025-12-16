# DAS ButtonGroup 按钮组

<cite>
**本文档中引用的文件**   
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md)
</cite>

## 目录
1. [组件说明](#组件说明)
2. [何时使用](#何时使用)
3. [基础用法](#基础用法)
4. [API](#api)
5. [常见问题](#常见问题)

## 组件说明

DAS ButtonGroup 是一个灵活的按钮组组件，用于展示一组相关的操作按钮。它支持多种布局方式和使用场景，能够满足不同业务场景下的按钮操作需求。该组件提供了丰富的配置选项和事件，可以轻松实现各种复杂的按钮交互。

### 主要特性
- 支持多种按钮组类型：表单、步骤、树形、筛选、表格、行内等
- 可自定义按钮文本、图标和排列方式
- 提供丰富的交互事件和状态管理
- 支持响应式布局和灵活的对齐方式
- 内置多种常用的按钮组合和布局
- 支持按钮的禁用状态和加载状态
- 支持按钮的分组和更多操作下拉菜单

**Section sources**
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md#L1-L29)

## 何时使用

DAS ButtonGroup 组件适用于以下多种场景：

- **表单操作**：用于表单的提交、重置、取消等操作，支持新增和编辑两种场景
- **分步表单**：用于分步操作的上一步、下一步、提交等操作，支持步骤切换和状态管理
- **树结构操作**：用于树形结构的新增、编辑、删除等操作，支持图标按钮和更多操作
- **筛选操作**：用于搜索条件的查询、重置等操作，支持基础查询和高级筛选
- **表格操作**：用于表格的批量操作和主要操作，支持按钮权限和选中状态
- **行内操作**：用于表格行的快捷操作，支持按钮分组和更多操作
- **列设置**：用于表格列的保存、重置等操作
- **提示操作**：用于确认框的确定、取消等操作
- **空状态**：用于空状态下的主要操作和次要操作

**Section sources**
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md#L29-L52)

## 基础用法

### 表单操作

展示表单场景下的按钮组用法，包括新增和编辑两种场景。

:::demo
```vue
<template>
  <div>
    <h4>新增场景</h4>
    <DasButtonGroup type="form" />

    <h4>编辑场景</h4>
    <DasButtonGroup type="form" form-type="edit" />

    <h4>左对齐</h4>
    <DasButtonGroup type="form" align="left" />
  </div>
</template>
```
:::

### 分步表单

展示分步表单场景下的按钮组用法。

:::demo
```vue
<template>
  <DasButtonGroup
    type="step"
    v-model:current-step="currentStep"
    :total-steps="totalSteps"
    @prev="handleStepChange(currentStep - 1)"
    @next="handleStepChange(currentStep + 1)"
  />
</template>

<script setup>
import { ref } from 'vue';

const currentStep = ref(0);
const totalSteps = 3;

const handleStepChange = (step) => {
  currentStep.value = step;
};
</script>
```
:::

### 树结构操作

展示树结构场景下的按钮组用法，支持纯图标模式和图标+文字模式。

:::demo
```vue
<template>
  <h4>纯图标模式</h4>
  <DasButtonGroup
    type="tree"
    :tree-buttons="treeButtons"
    :more-actions="moreActions"
    @tree-action="handleTreeAction"
  />

  <h4>图标+文字模式</h4>
  <DasButtonGroup
    type="tree"
    :tree-buttons="treeButtons"
    :more-actions="moreActions"
    :show-text="true"
    @tree-action="handleTreeAction"
  />
</template>

<script setup>
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const treeButtons = [
  {
    icon: PlusOutlined,
    tooltip: '新增',
    action: 'add',
    text: '新增'
  },
  {
    icon: EditOutlined,
    tooltip: '编辑',
    action: 'edit',
    text: '编辑'
  },
  {
    icon: DeleteOutlined,
    tooltip: '删除',
    action: 'delete',
    text: '删除'
  }
];

const moreActions = [
  {
    label: '导入',
    value: 'import'
  },
  {
    label: '导出',
    value: 'export'
  }
];

const handleTreeAction = (action) => {
  console.log('Tree action:', action);
};
</script>
```
:::

### 筛选操作

展示筛选场景下的按钮组用法，支持基础查询和高级筛选两种模式。

:::demo
```vue
<template>
  <h4>基础查询</h4>
  <DasButtonGroup
    type="filter"
    :is-advanced="false"
    :is-expanded="isExpanded"
    @search="handleSearch"
    @reset="handleReset"
    @toggle-advanced="handleToggleAdvanced"
  />

  <h4>高级筛选</h4>
  <DasButtonGroup
    type="filter"
    :is-advanced="true"
    :is-expanded="isExpanded"
    :show-save-template="true"
    @search="handleSearch"
    @reset="handleReset"
    @toggle-advanced="handleToggleAdvanced"
  />
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);

const handleSearch = () => {
  console.log('Search clicked');
};

const handleReset = () => {
  console.log('Reset clicked');
};

const handleToggleAdvanced = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
```
:::

### 表格操作

展示表格场景下的按钮组用法，支持主操作和批量操作。主要按钮会自动显示在前面，超过4个按钮会自动折叠到更多菜单中。

:::demo
```vue
<template>
  <DasButtonGroup
    type="table"
    :actions="mainActions"
    :has-selection="hasSelection"
    @table-action="handleTableAction"
  />
</template>

<script setup>
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const hasSelection = ref(false);

const mainActions = [
  {
    label: '新增',
    action: 'add',
    primary: true,
    icon: PlusOutlined
  },
  {
    label: '编辑',
    action: 'edit',
    needSelection: true,
  },
  {
    label: '删除',
    action: 'delete',
    needSelection: true,
  },
  {
    label: '批量删除',
    action: 'batchDelete'
  },
  {
    label: '批量导出',
    action: 'batchExport'
  }
];

const handleTableAction = (action) => {
  console.log('Table action:', action);
};
</script>
```
:::

### 表格行操作

展示表格行操作场景下的按钮组用法，支持纯文字按钮、带外链按钮以及按钮分组功能。

:::demo
```vue
<template>
  <DasButtonGroup
    type="row"
    :actions="rowActions"
    @table-action="handleTableAction"
  />
</template>

<script setup>
const rowActions = [
  {
    label: '编辑',
    action: 'edit'
  },
  {
    label: '删除',
    action: 'delete'
  },
  {
    label: '查看详情',
    action: 'view',
    isExternal: true
  },
  {
    label: '导出',
    action: 'export'
  },
  {
    label: '导入',
    action: 'import'
  },
  {
    label: '加白',
    action: 'whitelist',
    group: '权限操作'
  },
  {
    label: '加黑',
    action: 'blacklist',
    group: '权限操作'
  },
];

const handleTableAction = (action) => {
  console.log('Table action:', action);
};
</script>
```
:::

**Section sources**
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md#L31-L301)

## API

### ButtonGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮组类型 | `'form' \| 'step' \| 'tree' \| 'filter' \| 'table' \| 'column' \| 'tip' \| 'empty' \| 'row'` | `'form'` |
| formType | 表单类型，仅在 type="form" 时有效 | `'add' \| 'edit'` | `'add'` |
| showText | 是否显示文字，仅在 type="tree" 时有效 | `boolean` | `false` |
| align | 按钮对齐方式 | `'left' \| 'right'` | `'right'` |
| size | 按钮尺寸 | `'default' \| 'small'` | `'default'` |
| buttonType | 按钮样式类型 | `'default' \| 'primary' \| 'link' \| 'text'` | `'default'` |
| isAdvanced | 是否为高级筛选，仅在 type="filter" 时有效 | `boolean` | `false` |
| isExpanded | 是否展开，仅在 type="filter" 时有效 | `boolean` | `false` |
| showSaveTemplate | 是否显示保存模板按钮，仅在 type="filter" 时有效 | `boolean` | `false` |
| actions | 按钮配置，仅在 type="table" 或 type="row" 时有效 | `TableButton[]` | `[]` |
| hasSelection | 是否有选中项，仅在 type="table" 时有效 | `boolean` | `false` |
| currentStep | 当前步骤，仅在 type="step" 时有效 | `number` | `0` |
| totalSteps | 总步骤数，仅在 type="step" 时有效 | `number` | `1` |
| treeButtons | 树结构按钮配置，仅在 type="tree" 时有效 | `TreeButton[]` | `[]` |
| moreActions | 更多操作配置，仅在 type="tree" 时有效 | `Action[]` | `[]` |
| showSecondary | 是否显示次按钮，仅在 type="tip" 或 type="empty" 时有效 | `boolean` | `false` |
| primaryText | 主按钮文字，仅在 type="tip" 或 type="empty" 时有效 | `string` | `'确定'` |
| secondaryText | 次按钮文字，仅在 type="tip" 或 type="empty" 时有效 | `string` | `'取消'` |
| moreText | 按钮下拉文字 | `string` | `'更多'` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |

### TreeButton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标组件 | `Component` | - |
| tooltip | 提示文字 | `string` | - |
| action | 操作标识 | `string` | - |
| text | 按钮文字 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |

### Action

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 显示文字 | `string` | - |
| value | 操作值 | `string` | - |

### TableButton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 显示文字 | `string` | - |
| action | 操作标识 | `string` | - |
| icon | 图标组件 | `Component` | - |
| needSelection | 是否需要选中项 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| isExternal | 是否为外部链接，仅在 type="row" 时有效 | `boolean` | `false` |
| group | 按钮分组，仅在 type="row" 时有效 | `string` | - |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| update:currentStep | 更新当前步骤 | `(step: number)` |
| cancel | 点击取消按钮时触发 | - |
| confirm | 点击确定按钮时触发 | - |
| reset | 点击重置按钮时触发 | - |
| prev | 点击上一步按钮时触发 | - |
| next | 点击下一步按钮时触发 | - |
| treeAction | 点击树结构按钮时触发 | `(action: string)` |
| primary | 点击主按钮时触发 | - |
| secondary | 点击次按钮时触发 | - |
| search | 点击查询按钮时触发 | - |
| saveTemplate | 点击保存模板按钮时触发 | - |
| toggleAdvanced | 点击展开/收起按钮时触发 | - |
| tableAction | 点击表格操作按钮时触发 | `(action: string)` |
| save | 点击保存按钮时触发 | - |

**Section sources**
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md#L303-L383)

## 常见问题

### 1. 如何自定义按钮样式？

可以通过 `buttonType` 属性设置按钮的样式类型，支持 default、primary、link、text 四种类型。同时，组件也提供了 size 属性来控制按钮的大小，支持 default 和 small 两种尺寸。

### 2. 如何控制按钮的显示顺序？

对于表单操作类型（type="form"），按钮的显示顺序是固定的，但可以通过 align 属性控制按钮组的对齐方式。对于表格操作和行内操作，可以通过调整 actions 数组中元素的顺序来控制按钮的显示顺序，前4个按钮会直接显示，超过的部分会自动折叠到更多菜单中。

### 3. 如何使用按钮分组功能？

在行内操作（type="row"）场景下，可以通过 TableButton 的 group 属性对按钮进行分组。同一分组的按钮会被收集到一个下拉菜单中，以节省空间并保持界面整洁。分组的按钮会显示在普通按钮之后，每个分组都会有自己的下拉菜单。

**Section sources**
- [das-button-group.md](file://das-components-folder/docs/das-button-group.md#L358-L397)