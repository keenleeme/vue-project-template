# DAS Notification 通知提醒框

<cite>
**本文档引用文件**   
- [das-notification.md](file://das-components-folder/docs/das-notification.md)
- [das-notification-details.md](file://das-components-folder/docs/das-notification-details.md)
</cite>

## 目录
1. [组件概述](#组件概述)
2. [核心配置项](#核心配置项)
3. [调用方式与代码示例](#调用方式与代码示例)
4. [自定义内容与按钮](#自定义内容与按钮)
5. [与Alert组件的对比](#与alert组件的对比)
6. [性能优化与内存泄漏规避](#性能优化与内存泄漏规避)

## 组件概述

DAS Notification 通知提醒框是一种用于向用户展示系统通知和消息提醒的非中断式组件。它通过浮层形式在页面右上角展示通知信息，支持多种通知类型和自定义内容，适用于操作反馈、系统提醒等场景。

该组件具备以下核心特性：
- **非中断式提醒**：不影响用户当前操作流程
- **自动关闭机制**：可配置显示时长，支持持续显示
- **灵活定位**：支持自定义距离顶部的位置
- **批量管理**：当通知数量超过3条时自动显示汇总信息
- **插槽扩展**：支持对图标、标题、内容、时间及操作区域进行深度自定义

**中文(中文)**
- **Table of Contents**: 目录
- **Section sources**: 本节引用文件
- **Diagram sources**: 图表引用文件

## 核心配置项

### 显示时长 (duration)
控制通知自动关闭的时间，单位为毫秒。设置为 `0` 时表示不自动关闭。

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| duration | 自动关闭延时，0表示不自动关闭 | `number` | 3000 |

### 定位 (position)
通过 `top` 属性设置通知容器距离页面顶部的距离。

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| top | 通知容器距离顶部的距离 | `string` | 24px |

### 消息类型 (type)
支持四种内置类型，通过 `iconType` 属性指定：

| 类型 | 图标样式 | 使用场景 |
| ---- | -------- | -------- |
| info | 信息图标 | 普通通知、状态提示 |
| success | 成功图标 | 操作成功反馈 |
| warning | 警告图标 | 注意事项提醒 |
| error | 错误图标 | 操作失败提示 |

**本节引用文件**
- [das-notification.md](file://das-components-folder/docs/das-notification.md#L1-L437)

## 调用方式与代码示例

### 基础调用方法

通过组件实例的 `addNotification` 方法添加通知：

```vue
<template>
  <div class="demo-container">
    <a-button type="primary" @click="openBasic">普通通知</a-button>
    <das-notification ref="notificationRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const notificationRef = ref();
  const count = ref(0);

  const openBasic = () => {
    count.value++;
    if (notificationRef.value) {
      notificationRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `通知 (${count.value})`,
        iconType: 'info',
        content: '这是一条普通通知',
        time: new Date().toLocaleTimeString()
      });
    }
  };
</script>
```

### 操作成功场景

```vue
<script lang="ts" setup>
  const openSuccess = () => {
    count.value++;
    if (typeNotificationRef.value) {
      typeNotificationRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `成功 (${count.value})`,
        content: '操作已成功完成',
        iconType: 'success',
        time: '5分钟前'
      });
    }
  };
</script>
```

### 错误提示场景

```vue
<script lang="ts" setup>
  const openError = () => {
    count.value++;
    if (typeNotificationRef.value) {
      typeNotificationRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `错误 (${count.value})`,
        content: '发生了错误，请重试',
        time: '5分钟前',
        iconType: 'error'
      });
    }
  };
</script>
```

**本节引用文件**
- [das-notification.md](file://das-components-folder/docs/das-notification.md#L82-L228)

## 自定义内容与按钮

### 插槽自定义

支持通过插槽对通知的各个部分进行深度定制：

| 插槽名称 | 说明 | 参数 |
| -------- | ---- | ---- |
| icon | 自定义图标 | `{ item }` |
| title | 自定义标题 | `{ item }` |
| content | 自定义内容 | `{ item }` |
| time | 自定义时间 | `{ item }` |
| action | 自定义操作区域 | `{ item, close }` |
| summary-action | 自定义汇总操作 | `{ notifications, closeAll }` |

### 自定义按钮示例

```vue
<template #action="{ item, close }">
  <div class="custom-actions">
    <button @click="handleCustomAction(item)">
      查看详情
    </button>
    <button @click="close(item.key)">
      关闭
    </button>
  </div>
</template>
```

### 自定义汇总操作

```vue
<template #summary-action="{ notifications, closeAll }">
  <div class="custom-summary-action">
    <span>共{{ notifications.length }}条消息</span>
    <button @click="closeAll">全部关闭</button>
  </div>
</template>
```

**本节引用文件**
- [das-notification.md](file://das-components-folder/docs/das-notification.md#L229-L347)

## 与Alert组件的对比

| 特性 | DAS Notification | Alert 组件 |
| ---- | ---------------- | ---------- |
| **展示形式** | 浮层右上角弹出 | 页面内嵌或模态框 |
| **中断性** | 非中断式，用户可继续操作 | 通常为中断式，需用户确认 |
| **生命周期** | 可配置自动关闭或手动关闭 | 通常需用户交互关闭 |
| **使用场景** | 系统通知、操作反馈 | 重要警告、确认对话 |
| **堆叠支持** | 支持多条通知堆叠显示 | 一般单条显示 |
| **位置控制** | 可通过 `top` 属性调整 | 位置相对固定 |

**本节引用文件**
- [das-notification.md](file://das-components-folder/docs/das-notification.md)
- [das-notification-details.md](file://das-components-folder/docs/das-notification-details.md)

## 性能优化与内存泄漏规避

### 通知堆叠管理

当通知数量超过3条时，组件会自动显示汇总信息，避免页面被过多通知占据。

```vue
<template>
  <div class="button-group">
    <a-button @click="addMultiple">添加多条通知</a-button>
    <a-button @click="closeAllNotifications">关闭全部通知</a-button>
  </div>
  <das-notification ref="batchRef" />
</template>
```

### 内存泄漏规避策略

1. **及时清理定时器**：如 `das-notification-details` 中所示，打开和关闭时应启动/停止定时器
2. **合理使用 key**：确保每条通知都有唯一且稳定的 key
3. **避免循环引用**：在自定义组件中注意不要形成闭包循环
4. **手动关闭机制**：提供 `close` 和 `closeAll` 方法供开发者主动管理

```typescript
function stopNotificationTimer() {
  if (timer) {
    clearInterval(timer);
    timer = 0; // 清除后重置
  }
}
```

**本节引用文件**
- [das-notification-details.md](file://das-components-folder/docs/das-notification-details.md#L1-L739)
- [das-notification.md](file://das-components-folder/docs/das-notification.md)