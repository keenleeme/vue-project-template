# DAS Select 选择器

<cite>
**本文档引用文件**   
- [das-select.md](file://das-components-folder/docs/das-select.md)
</cite>

## 目录
1. [DAS Select 选择器](#das-select-选择器)
2. [组件说明](#组件说明)
3. [何时使用](#何时使用)
4. [基础功能与模式](#基础功能与模式)
   - [基础选择器](#基础选择器)
   - [分组选择器](#分组选择器)
   - [树形选择器](#树形选择器)
5. [高级特性](#高级特性)
   - [下拉搜索](#下拉搜索)
   - [最大选择数量](#最大选择数量)
   - [快捷全选](#快捷全选)
   - [添加标签](#添加标签)
   - [横向拉伸](#横向拉伸)
   - [自适应收缩](#自适应收缩)
   - [描述文字](#描述文字)
6. [数据源绑定与v-model双向绑定](#数据源绑定与v-model双向绑定)
7. [远程搜索模式](#远程搜索模式)
8. [复杂场景应用](#复杂场景应用)
   - [级联选择](#级联选择)
   - [标签选择](#标签选择)
9. [自定义选项渲染](#自定义选项渲染)
10. [表单集成与校验](#表单集成与校验)
11. [性能优化](#性能优化)
12. [常见问题排查](#常见问题排查)

## 组件说明

DAS Select 是一个功能强大的下拉选择器组件，支持基础选择、分组选择和树形选择等多种模式。该组件提供了丰富的交互功能和高度的可定制性，能够满足各种复杂的用户选择需求。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L4-L6)

## 何时使用

DAS Select 组件适用于以下场景：
- 需要用户从多个选项中选择一个或多个选项时
- 选项内容较多，需要通过分组或树形结构进行组织和展示时
- 需要支持搜索过滤功能，以便用户能快速定位到目标选项

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L8-L11)

## 基础功能与模式

### 基础选择器

基础选择器展示了 DAS Select 的核心功能，包括单选/多选模式、搜索过滤、一键清除、选项禁用以及对大数据量的支持（内置虚拟滚动）。

```vue
<template>
  <das-select
    style="width: 400px"
    placeholder="请选择选项"
    v-model:value="value"
    :is-tree="false"
    allow-clear
    show-search
    :options="options"
  >
  </das-select>
</template>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L25-L49)

### 分组选择器

分组选择器允许将选项进行分组展示。通过 `options` 属性的嵌套结构来配置分组，分组之间会自动添加分隔线，分组标题以灰色显示以区别于普通选项。

```vue
<template>
  <das-select
    style="width: 400px"
    show-search
    :is-tree="false"
    placeholder="请选择分组选项"
    v-model:value="value"
    :options="groupOptions"
  />
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  const groupOptions = ref([
    {
      label: 'Manager',
      options: [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' }
      ]
    },
    {
      label: 'Engineer',
      options: [
        { value: 'yiminghe', label: 'Yiminghe' }
      ]
    }
  ]);
</script>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L51-L75)

### 树形选择器

树形选择器支持多层级数据的展示和选择，允许节点展开/收起，并支持节点搜索过滤（命中节点会自动展开）。同时支持节点禁用和自定义节点内容渲染。

```vue
<template>
  <das-select
    style="width: 400px"
    show-search
    placeholder="请选择树形选项"
    allow-clear
    :is-tree="true"
    v-model:value="treeValue"
    :tree-data="treeOptions"
    is-dropdown-search
    @select="onSelect"
  >
  </das-select>
</template>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L77-L101)

## 高级特性

### 下拉搜索

在下拉面板中显示独立的搜索框，此功能仅在多选模式下可用。搜索框固定在下拉面板顶部，支持大数据量场景的搜索，并在搜索时自动高亮匹配文本。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  is-dropdown-search
  mode="multiple"
  :options="options"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L103-L127)

### 最大选择数量

通过 `selectMaxCount` 属性限制多选模式下的最大可选数量。当达到上限后，未选项将自动禁用，并在选择器右侧显示已选数量/最大数量。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  show-search
  mode="multiple"
  :options="options"
  :select-max-count="3"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L129-L153)

### 快捷全选

在下拉面板顶部提供快捷的全选/取消全选操作按钮，显示当前已选择的数量。此功能仅在多选模式下可用。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  is-dropdown-search
  mode="multiple"
  quick-select
  :options="options"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L155-L179)

### 添加标签

使用 `mode="tags"` 启用标签模式，允许用户手动输入并创建新的选项标签。输入内容按回车键后会自动创建新标签，并加入选项列表中。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  mode="tags"
  :options="options"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L181-L205)

### 横向拉伸

通过 `is-dropdown-resize` 属性支持调整下拉面板的宽度。用户可以通过拖拽右下角来调整下拉框大小，当选项内容过长时支持横向滚动。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  show-search
  :virtual="false"
  mode="multiple"
  is-dropdown-search
  is-dropdown-resize
  :options="options"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L207-L231)

### 自适应收缩

在多选模式下，选中项可以在输入框中自适应收缩。通过 `render-list` 属性，可以将收缩的选项展示成列表形式。

```vue
<das-select
  style="width: 400px"
  placeholder="请选择选项"
  v-model:value="value"
  :is-tree="false"
  allow-clear
  mode="multiple"
  render-list
  quick-select
  :options="options"
>
</das-select>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L233-L257)

### 描述文字

该组件支持为选项添加描述文字，以提供更丰富的信息。描述文字通常显示在选项标签的下方，帮助用户更好地理解选项的含义。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L259-L260)

## 数据源绑定与v-model双向绑定

DAS Select 组件通过 `options` 属性绑定数据源，数据源可以是简单的值-标签对数组，也可以是包含分组或树形结构的复杂对象。组件通过 `v-model:value` 实现与父组件的数据双向绑定，当选中项发生变化时，绑定的值会自动更新。

对于基础和分组选择器，使用 `options` 属性：
```vue
<das-select :options="options" v-model:value="selectedValue" />
```

对于树形选择器，使用 `tree-data` 属性：
```vue
<das-select :tree-data="treeOptions" v-model:value="treeValue" :is-tree="true" />
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L25-L257)

## 远程搜索模式

DAS Select 支持远程搜索模式，允许在用户输入时动态加载选项数据。通过监听 `@search` 事件，可以在用户输入搜索关键字时触发远程 API 调用，获取匹配的选项数据并更新 `options`。

```vue
<template>
  <das-select
    show-search
    @search="onSearch"
    :options="options"
    v-model:value="value"
  />
</template>
<script setup lang="ts">
  const options = ref([]);
  const onSearch = async (value: string) => {
    // 模拟远程搜索
    const result = await fetchRemoteData(value);
    options.value = result;
  };
</script>
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L17-L21)

## 复杂场景应用

### 级联选择

虽然文档中未直接提供级联选择的示例，但可以通过监听 `@select` 事件，根据已选择的父级选项动态加载子级选项数据，从而实现级联选择的效果。

### 标签选择

通过设置 `mode="tags"`，DAS Select 可以作为标签选择器使用。用户不仅可以从预设选项中选择，还可以通过输入创建新的标签，非常适合需要灵活添加标签的场景。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L181-L205)

## 自定义选项渲染

DAS Select 支持通过插槽（slot）来自定义选项的渲染内容。这允许开发者在选项中添加图标、描述文字或其他自定义元素，以满足特定的UI需求。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L90-L92)

## 表单集成与校验

DAS Select 组件可以轻松集成到表单中，并支持与表单校验规则的配合使用。通过 `v-model` 绑定表单数据，并利用表单框架（如 DAS Form）的校验功能，可以实现对选择器值的有效性校验。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L25-L257)

## 性能优化

对于大数据量的场景，DAS Select 内置了虚拟滚动（virtual scrolling）功能，通过 `:virtual="true"`（默认）来启用。这可以显著提升渲染性能，避免因渲染大量DOM节点而导致的页面卡顿。

```vue
<das-select :options="largeOptions" :virtual="true" />
```

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L31-L35)

## 常见问题排查

- **搜索无结果**：检查 `@search` 事件处理函数是否正确实现了数据过滤逻辑，或远程API是否返回了预期数据。
- **选项无法选中**：检查选项对象的 `disabled` 属性是否被设置为 `true`，或 `selectMaxCount` 是否已达到上限。
- **数据未更新**：确保 `options` 或 `tree-data` 是响应式的（使用 `ref` 或 `reactive` 定义），以便在数据变化时视图能正确更新。

**Section sources**
- [das-select.md](file://das-components-folder/docs/das-select.md#L25-L257)