# DAS Drawer 抽屉

<cite>
**本文档中引用的文件**  
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md)
</cite>

## 目录
1. [简介](#简介)
2. [核心属性详解](#核心属性详解)
3. [使用场景与示例](#使用场景与示例)
4. [移动端友好性与选型建议](#移动端友好性与选型建议)
5. [常见问题与解决方案](#常见问题与解决方案)

## 简介

DAS Drawer 抽屉组件是一种从屏幕边缘滑出的模态容器，用于展示或处理信息。它提供了一种比传统对话框更轻量、更灵活的交互方式，特别适用于需要临时展示内容而不打断主流程的场景。

该组件基于 Ant Design Vue 的 Drawer 组件进行封装，继承了其核心功能并进行了定制化扩展，以满足项目特定的设计和交互需求。

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L0-L47)

## 核心属性详解

### 显隐控制 (visible / v-model)

抽屉的显示与隐藏通过 `visible` 属性或 `v-model` 指令进行控制。`v-model` 是 `visible` 的语法糖，提供了双向数据绑定。

- **visible**: 接收一个布尔值，`true` 时抽屉打开，`false` 时关闭。
- **v-model**: 双向绑定一个布尔值变量，通过修改该变量的值来控制抽屉的显隐。

```vue
<template>
  <a-button @click="openDrawer">打开抽屉</a-button>
  <das-drawer v-model="drawerVisible" title="示例抽屉">
    <p>抽屉内容</p>
  </das-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const drawerVisible = ref(false);
const openDrawer = () => {
  drawerVisible.value = true;
};
</script>
```

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L49-L65)

### 位置配置 (placement)

`placement` 属性用于定义抽屉从哪个方向滑出。DAS Drawer 支持以下四个方向：

- **top**: 从屏幕顶部滑出。
- **right**: 从屏幕右侧滑出（默认值）。
- **bottom**: 从屏幕底部滑出。
- **left**: 从屏幕左侧滑出。

此属性允许开发者根据不同的使用场景选择最合适的弹出方向，例如，侧边导航通常使用 `left` 或 `right`，而设置面板可能使用 `bottom`。

```vue
<das-drawer placement="left" v-model="visible" title="左侧抽屉">
  <!-- 内容 -->
</das-drawer>
```

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L0-L47)

### 销毁策略 (destroyOnClose)

`destroyOnClose` 是一个重要的性能和状态管理属性。当设置为 `true` 时，抽屉在关闭后会销毁其内部的所有子组件和DOM节点。

- **false (默认)**: 抽屉关闭后，其内容仍保留在内存中，再次打开时能快速恢复之前的状态，适合内容初始化成本低或需要保持状态的场景。
- **true**: 抽屉关闭后，其内容被完全销毁。再次打开时会重新初始化，适合内容复杂、包含大量数据或需要每次打开都重置状态的场景。

采用 `destroyOnClose` 策略可以有效避免“关闭后内容残留”等常见问题，确保每次打开抽屉都是一个“干净”的状态。

```vue
<das-drawer :destroyOnClose="true" v-model="visible" title="销毁型抽屉">
  <!-- 表单或其他需要重置的内容 -->
</das-drawer>
```

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L0-L47)

### 尺寸与样式

抽屉的尺寸可以通过 `size` 和 `width` 属性进行配置。

- **size**: 预设尺寸，包括 `large`、`medium`、`small`、`mini`。其宽度基于视口宽度的百分比计算，并设有最小宽度（480px）。
- **width**: 自定义宽度，可以覆盖 `size` 属性的设置。

此外，`outer` 属性用于嵌套抽屉场景，当为 `true` 时，抽屉的宽度会额外增加100px，以避免内外层抽屉内容重叠。

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L139-L148)

## 使用场景与示例

### 侧边配置面板

在系统设置或用户偏好设置中，使用抽屉可以提供一个不跳转页面的配置入口。

```vue
<template>
  <a-button @click="showSettings = true">设置</a-button>
  <das-drawer v-model="showSettings" title="系统设置" placement="right" :destroyOnClose="true">
    <das-form>
      <!-- 各种配置表单项 -->
    </das-form>
  </das-drawer>
</template>
```

### 详情查看

在列表页中，点击某一项时，通过抽屉展示其详细信息，避免页面跳转带来的上下文丢失。

```vue
<template>
  <a-table :dataSource="listData" :columns="columns">
    <template #action="{ record }">
      <a @click="viewDetail(record)">查看详情</a>
    </template>
  </a-table>
  <das-drawer v-model="detailVisible" title="详情信息" placement="right">
    <p>名称: {{ currentDetail.name }}</p>
    <p>描述: {{ currentDetail.desc }}</p>
    <!-- 更多详情 -->
  </das-drawer>
</template>
```

### 与按钮、表单的组合用法

抽屉常与按钮配合使用作为触发器，并在其内部放置表单以收集用户输入。

```vue
<template>
  <a-button type="primary" @click="openForm">新建项目</a-button>
  <das-drawer v-model="formVisible" title="新建项目" placement="right" :destroyOnClose="true">
    <das-form :model="form" @submit="handleSubmit">
      <das-form-item label="项目名称">
        <a-input v-model:value="form.name" />
      </das-form-item>
      <das-form-item label="项目描述">
        <a-textarea v-model:value="form.desc" />
      </das-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </das-form>
  </das-drawer>
</template>
```

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L49-L105)

## 移动端友好性与选型建议

### 移动端友好性

DAS Drawer 组件在移动端表现出色：
- **手势支持**: 通常支持从边缘滑动以打开或关闭抽屉，符合移动端用户的操作习惯。
- **全屏适配**: 在小屏幕上，抽屉可以自动调整为全屏模式，最大化利用有限的屏幕空间。
- **遮罩层**: 背景遮罩层 (`mask`) 可以防止用户与背后的内容交互，确保操作的专注性。

### 与 Dialog 组件的选型差异

| 特性 | Drawer 抽屉 | Dialog 对话框 |
| :--- | :--- | :--- |
| **交互方式** | 从边缘滑入，常用于临时、辅助性操作 | 居中弹出，常用于核心、阻塞性操作 |
| **视觉层级** | 较低，用户能感知到背后的内容 | 较高，完全遮挡背景，强调当前任务 |
| **适用场景** | 侧边栏、详情查看、快速设置 | 确认操作、表单提交、警告提示 |
| **移动端体验** | 更符合滑动手势，空间利用率高 | 可能感觉突兀，占用中心区域 |

**选择建议**:
- 当需要**保持上下文**或进行**辅助性操作**时，优先选择 **Drawer**。
- 当需要**强提醒**或进行**关键决策**时，优先选择 **Dialog**。

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L0-L47)

## 常见问题与解决方案

### 问题1: 抽屉内容初始化失败

**现象**: 抽屉打开时，内部组件（如表格、图表）未能正确加载数据。

**原因**: 数据请求逻辑可能写在了组件的 `created` 或 `mounted` 钩子中，但当 `destroyOnClose` 为 `false` 时，这些钩子只在第一次打开时执行。

**解决方案**:
1.  **使用 `@open` 事件**: 监听抽屉的 `open` 事件，在每次打开时重新触发数据加载。
    ```vue
    <das-drawer @open="loadData" ...>
    ```
2.  **结合 `v-if`**: 将 `v-model` 和 `v-if` 结合使用，确保每次打开都重新创建组件。
    ```vue
    <das-drawer v-if="drawerVisible" v-model="drawerVisible" ...>
    ```

### 问题2: 关闭后内容残留

**现象**: 关闭抽屉后，再次打开时，表单仍保留上次输入的内容或状态。

**原因**: `destroyOnClose` 属性未设置为 `true`，导致组件实例未被销毁。

**解决方案**:
- **方案一 (推荐)**: 设置 `:destroyOnClose="true"`，确保每次关闭后组件被销毁，重新打开时为初始状态。
- **方案二**: 在抽屉的 `@close` 事件中手动重置表单数据。
    ```vue
    <das-drawer @close="resetForm" ...>
    ```
    ```ts
    const resetForm = () => {
      form.value = { name: '', desc: '' };
    };
    ```

**Section sources**
- [das-drawer.md](file://das-components-folder/docs/das-drawer.md#L49-L105)