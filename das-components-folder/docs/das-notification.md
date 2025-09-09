<ComponentInfo developer="盛海琦" date="2025-07-16" />

# das-notification 通知提醒

## 组件说明

一种用于向用户展示系统通知和消息提醒的组件。它通过浮层的形式在页面右上角展示通知信息，支持多种通知类型和自定义内容。组件支持以下特性：

- 多种通知类型：支持信息、成功、警告、错误四种类型，满足不同场景需求
- 自动关闭：支持设置自动关闭时间，也可设置为持续显示
- 自定义位置：支持自定义通知容器距离顶部的距离
- 插槽支持：支持自定义图标、标题、内容、时间和操作区域
- 批量管理：支持显示多条通知，超过 3 条时显示汇总信息

## 何时使用

- 需要向用户展示系统通知或消息提醒时
- 操作完成后需要给用户反馈结果时
- 需要在不打断用户当前操作的情况下展示信息时
- 需要展示可交互的通知内容时

## 交互演示

通过编辑 JSON 配置，实时预览组件效果
:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <a-button
      type="primary"
      @click="configNotificationRef.addNotification(config.mockNotifications)"
      style="margin-right: 8px;"
      >信息通知</a-button
    >
    <das-notification ref="configNotificationRef" :top="config.top" :duration="config.duration" />
  </JsonEditor>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { basicConfig as initConfig } from 'Comp/notification/mock/config';

  const configNotificationRef = ref();
</script>
```

:::

### 基础用法

展示不同类型的通知提醒。
:::demo

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

:::

### 不同类型

通过设置 iconType 属性来使用不同类型的通知。
:::demo

```vue
<template>
  <div class="demo-container">
    <div class="button-group">
      <a-button @click="openSuccess" style="margin-right: 8px">成功</a-button>
      <a-button @click="openWarning" style="margin-right: 8px">警告</a-button>
      <a-button @click="openError">错误</a-button>
    </div>
    <das-notification ref="typeNotificationRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const typeNotificationRef = ref();
  const count = ref(0);

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

  const openWarning = () => {
    count.value++;
    if (typeNotificationRef.value) {
      typeNotificationRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `警告 (${count.value})`,
        content: '请注意相关事项',
        time: '5分钟前',
        iconType: 'warning'
      });
    }
  };

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

:::

### 持续展示

通过设置 duration 为 0 来创建不会自动关闭的通知。
:::demo

```vue
<template>
  <div class="demo-container">
    <a-button @click="openPersistent">打开持续通知</a-button>
    <p style="margin-top: 12px; color: #888">点击按钮后，通知不会自动消失，需要手动关闭。</p>
    <das-notification ref="persistentRef" :duration="0" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const persistentRef = ref();
  const count = ref(0);

  const openPersistent = () => {
    count.value++;
    if (persistentRef.value) {
      persistentRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `持续通知 (${count.value})`,
        content: '这条通知会一直显示，直到你手动关闭',
        time: '5分钟前',
        iconType: 'success'
      });
    }
  };
</script>
```

:::

### 自定义位置

通过设置 top 属性来自定义通知容器距离顶部的距离。
:::demo

```vue
<template>
  <div class="demo-container">
    <a-button @click="openTopNotification">打开距离顶部120px的通知</a-button>
    <p style="margin-top: 12px; color: #888">通知会在距离顶部120px处展示</p>
    <das-notification ref="topRef" top="120px" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const topRef = ref();
  const count = ref(0);

  const openTopNotification = () => {
    count.value++;
    if (topRef.value) {
      topRef.value.addNotification({
        key: (Date.now() + Math.random()).toString(),
        title: `自定义Top通知 (${count.value})`,
        content: '通知容器距离顶部120px',
        time: '5分钟前',
        iconType: 'info'
      });
    }
  };
</script>
```

:::

### 自定义内容

通过插槽自定义通知的各个部分内容。
:::demo

```vue
<template>
  <div class="demo-container">
    <a-button @click="showCustomSlot">自定义Slot通知</a-button>

    <das-notification ref="customRef">
      <template #icon="{ item }">
        <div class="custom-icon" :style="{ color: getIconColor(item.iconType) }">🎉</div>
      </template>

      <template #title="{ item }">
        <span class="custom-title" style="font-weight: bold; color: #1890ff">
          {{ item.title }}
        </span>
      </template>

      <template #content="{ item }">
        <div
          class="custom-content"
          :style="{ background: getIconColor(item.iconType) }"
          style="padding: 8px; border-radius: 4px"
        >
          {{ item.content }}
        </div>
      </template>

      <template #time="{ item }">
        <span class="custom-time" style="color: #999; font-style: italic"> ⏰ {{ item.time }} </span>
      </template>

      <template #action="{ item, close }">
        <div class="custom-actions">
          <button
            @click="handleCustomAction(item)"
            style="
              margin-right: 8px;
              background: #52c41a;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            查看详情
          </button>
          <button
            @click="close(item.key)"
            style="
              background: #ff4d4f;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            关闭
          </button>
        </div>
      </template>

      <template #summary-action="{ notifications, closeAll }">
        <div class="custom-summary-action">
          <span style="margin-right: 8px; color: #1890ff">共{{ notifications.length }}条消息</span>
          <button
            @click="closeAll"
            style="
              background: #1890ff;
              color: white;
              border: none;
              padding: 4px 12px;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            全部关闭
          </button>
        </div>
      </template>
    </das-notification>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Notification } from 'Comp/notification/types';

  const customRef = ref();

  const showCustomSlot = () => {
    if (customRef.value) {
      customRef.value.addNotification({
        key: `custom-slot-${Date.now()}`,
        title: '自定义Slot通知',
        content: '这是一个使用slot自定义的通知示例',
        iconType: 'success',
        time: new Date().toLocaleTimeString()
      });
    }
  };

  const handleCustomAction = (item: Notification) => {
    alert(`查看详情: ${item.title}`);
  };

  const getIconColor = (iconType: string) => {
    const colors = {
      success: '#52c41a',
      warning: '#faad14',
      error: '#ff4d4f',
      info: '#1890ff',
      custom: '#722ed1'
    };
    return colors[iconType as keyof typeof colors] || '#1890ff';
  };
</script>
```

:::

### 批量管理

支持关闭所有通知，当通知数量超过 3 条时会显示汇总信息。
:::demo

```vue
<template>
  <div class="demo-container">
    <div class="button-group">
      <a-button @click="addMultiple" style="margin-right: 8px">添加多条通知</a-button>
      <a-button @click="closeAllNotifications">关闭全部通知</a-button>
    </div>
    <p style="margin-top: 12px; color: #888">添加超过3条通知后，会显示汇总信息。</p>
    <das-notification ref="batchRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const batchRef = ref();
  let count = 0;

  const addMultiple = () => {
    for (let i = 0; i < 5; i++) {
      count++;
      if (batchRef.value) {
        batchRef.value.addNotification({
          key: (Date.now() + Math.random()).toString(),
          title: `批量通知 ${count}`,
          content: `这是第 ${count} 条通知`,
          iconType: ['info', 'success', 'warning', 'error'][i % 4],
          time: new Date().toLocaleTimeString()
        });
      }
    }
  };

  const closeAllNotifications = () => {
    if (batchRef.value) {
      batchRef.value.closeAll();
    }
  };
</script>
```

:::

## API

### 属性

| 参数     | 说明                                        | 类型     | 默认值 |
| -------- | ------------------------------------------- | -------- | ------ |
| top      | 通知容器距离顶部的距离                      | `string` | 24px   |
| duration | 自动关闭的延时，单位毫秒，为 0 时不自动关闭 | `number` | 3000   |

### 方法

| 方法名          | 说明         | 参数                                 | 返回值 |
| --------------- | ------------ | ------------------------------------ | ------ |
| addNotification | 添加通知     | (notification: Notification) => void | -      |
| close           | 关闭指定通知 | (key: string) => void                | -      |
| closeAll        | 关闭所有通知 | () => void                           | -      |

### Notification

| 参数     | 说明           | 类型     | 可选值                             | 默认值 |
| -------- | -------------- | -------- | ---------------------------------- | ------ |
| key      | 通知的唯一标识 | `string` | -                                  |
| title    | 通知标题       | `string` | -                                  |
| content  | 通知内容       | `string` | -                                  |
| iconType | 图标类型       | `string` | `info` `success` `warning` `error` | `info` |
| duration | 自动关闭的延时 | `number` |                                    | 3000   |
| time     | 时间文本       | `string` | -                                  |

### 插槽

| 插槽名称       | 说明           |
| -------------- | -------------- |
| icon           | 自定义图标     |
| title          | 自定义标题     |
| content        | 自定义内容     |
| time           | 自定义时间     |
| action         | 自定义操作区域 |
| summary-action | 自定义汇总操作 |
