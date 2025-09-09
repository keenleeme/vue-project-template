<ComponentInfo developer="盛海琦" date="2025-07-16" />

# das-notification-details 通知详情

## 组件说明

一种用于展示通知详情的抽屉组件。它以抽屉的形式展示通知列表，支持按时间和按类型两种展示方式，并提供丰富的自定义功能。组件支持以下特性：

- 双视图模式：支持按时间和按类型两种展示方式
- 分页加载：支持分页加载更多通知，提升性能
- 自定义插槽：支持自定义标签页、操作栏、图标、内容等
- 实时更新：支持实时显示新通知数量并提供更新提示
- 批量操作：支持清除指定通知、清空所有通知等操作

## 何时使用

- 需要展示大量通知信息时
- 需要对通知进行分类管理时
- 需要提供通知的详细操作功能时
- 需要自定义通知展示样式和交互时

## 交互演示

通过编辑 JSON 配置，实时预览组件效果
:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <a-button @click="config.visible = true" style="margin-right: 8px;">打开通知详情</a-button>
    <das-notification-details
      :visible="config.visible"
      :notifications="config.mockNotifications"
      @close="config.visible = false"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/notification-details/mock/config';
</script>
```

:::

### 基础用法

展示通知详情抽屉的基本功能。
:::demo

```vue
<template>
  <div style="margin-bottom: 16px">
    <a-button @click="openDetails" style="margin-right: 8px">打开通知详情</a-button>
  </div>

  <das-notification-details
    :visible="visible"
    :notifications="notifications"
    :enabledNotice="enabledNotice"
    @close="closeDetails"
    @clear="clear"
    @clearAll="clearAll"
    @toggleSwitch="toggleSwitch"
    @subscribe="subscribe"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { NotificationDetailItem } from 'Comp/notification/types';

  const visible = ref(false);
  const enabledNotice = ref(true);
  const notifications = ref<NotificationDetailItem[]>([
    {
      key: '1',
      title: '系统更新',
      content: '系统将在今晚12点进行维护，请注意保存工作。',
      iconType: 'warning',
      time: '5分钟前'
    },
    {
      key: '2',
      title: '新功能上线',
      content: '我们上线了新的数据分析功能，欢迎体验使用！',
      iconType: 'success',
      time: '10分钟前'
    },
    {
      key: '3',
      title: '安全提醒',
      content: '检测到您的账户存在潜在安全风险，建议立即修改密码。',
      iconType: 'error',
      time: '15分钟前'
    }
  ]);

  function openDetails() {
    visible.value = true;
  }

  function closeDetails() {
    visible.value = false;
  }

  function clear(keys: string) {
    notifications.value = notifications.value.filter((item: NotificationDetailItem) => keys.indexOf(item.key) === -1);
  }

  function clearAll() {
    notifications.value = [];
  }

  function toggleSwitch() {
    enabledNotice.value = !enabledNotice.value;
  }

  function subscribe() {
    console.log('订阅通知');
  }
</script>
```

:::

### 基础用法-更新数据

展示通知详情抽屉的基本功能。
:::demo

```vue
<template>
  <div style="margin-bottom: 16px">
    <a-button @click="openDetails" style="margin-right: 8px">打开通知详情</a-button>
  </div>

  <das-notification-details
    :visible="visible"
    :notifications="notifications"
    :enabledNotice="enabledNotice"
    @close="closeDetails"
    @clear="clear"
    @clearAll="clearAll"
    @toggleSwitch="toggleSwitch"
    @subscribe="subscribe"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { NotificationDetailItem } from 'Comp/notification/types';

  const visible = ref(false);
  const enabledNotice = ref(true);
  const notifications = ref<NotificationDetailItem[]>([
    {
      key: '1',
      title: '系统更新',
      content: '系统将在今晚12点进行维护，请注意保存工作。',
      iconType: 'warning',
      time: '5分钟前'
    },
    {
      key: '2',
      title: '新功能上线',
      content: '我们上线了新的数据分析功能，欢迎体验使用！',
      iconType: 'success',
      time: '10分钟前'
    },
    {
      key: '3',
      title: '安全提醒',
      content: '检测到您的账户存在潜在安全风险，建议立即修改密码。',
      iconType: 'error',
      time: '15分钟前'
    }
  ]);
  /**
   * @description 定时器引用，用于控制通知的自动生成
   */
  let timer: ReturnType<typeof setInterval> | number = 0;

  function openDetails() {
    visible.value = true;
    // 只有在通知功能开启时才启动定时器
    if (enabledNotice.value) {
      startNotificationTimer();
    }
  }

  function closeDetails() {
    visible.value = false;
    // 关闭抽屉时停止定时器
    stopNotificationTimer();
  }

  function clear(keys: string) {
    notifications.value = notifications.value.filter((item: NotificationDetailItem) => keys.indexOf(item.key) === -1);
  }

  function clearAll() {
    notifications.value = [];
  }

  /**
   * @description 启动通知定时器
   */
  function startNotificationTimer() {
    if (!timer) {
      timer = setInterval(() => {
        notifications.value.unshift({
          key: (Date.now() + Math.random()).toString(), // 使用更可靠的唯一键
          title: `新功能上线${notifications.value.length}`,
          content: '我们上线了新的数据分析功能，欢迎使用！',
          iconType: 'success',
          time: new Date().toLocaleTimeString(),
          customAction: '',
          customHoverAction: ''
        });
      }, 1000);
    }
  }

  /**
   * @description 停止通知定时器
   */
  function stopNotificationTimer() {
    if (timer) {
      clearInterval(timer);
      timer = 0; // 重要：清除后重置为 null
    }
  }

  function toggleSwitch() {
    if (enabledNotice.value) {
      // 当前是开启状态，点击后关闭
      enabledNotice.value = false;
      stopNotificationTimer();
    } else {
      // 当前是关闭状态，点击后开启
      enabledNotice.value = true;
      startNotificationTimer();
    }
  }

  function subscribe() {
    console.log('订阅通知');
  }
</script>
```

:::

### 自定义插槽

通过插槽自定义标签页和操作栏。
:::demo

```vue
<template>
  <div style="margin-bottom: 16px">
    <a-button @click="openSlotDetails">打开自定义插槽通知详情</a-button>
  </div>

  <das-notification-details
    :visible="slotVisible"
    :notifications="notifications"
    :enabledNotice="enabledNotice"
    @close="closeSlotDetails"
    @clear="clear"
    @clearAll="clearAll"
    @toggleSwitch="toggleSwitch"
    @subscribe="subscribe"
  >
    <!-- 自定义标签页插槽 -->
    <template #tabs>
      <button
        class="das-notification-details__tab-btn custom-tab"
        :class="{ active: customActiveTab === 'all' }"
        @click="handleCustomTabChange('all')"
      >
        <span style="margin-right: 4px">📋</span>
        全部消息
      </button>
      <button
        class="das-notification-details__tab-btn custom-tab"
        :class="{ active: customActiveTab === 'important' }"
        @click="handleCustomTabChange('important')"
      >
        <span style="margin-right: 4px">⭐</span>
        重要消息
      </button>
    </template>

    <!-- 自定义操作栏插槽 -->
    <template #actions>
      <a-tooltip content="标记全部已读">
        <span class="das-notification-details__icon-btn custom-action" @click="markAllAsRead">
          <span style="font-size: 16px">✓</span>
        </span>
      </a-tooltip>
      <a-tooltip content="设置">
        <span class="das-notification-details__icon-btn custom-action" @click="openSettings">
          <span style="font-size: 16px">⚙️</span>
        </span>
      </a-tooltip>
    </template>
  </das-notification-details>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { NotificationDetailItem } from 'Comp/notification/types';

  const slotVisible = ref(false);
  const enabledNotice = ref(true);
  const customActiveTab = ref('all');
  const notifications = ref<NotificationDetailItem[]>([
    {
      key: '1',
      title: '系统更新',
      content: '系统将在今晚12点进行维护，请注意保存工作。',
      iconType: 'warning',
      time: '5分钟前'
    },
    {
      key: '2',
      title: '新功能上线',
      content: '我们上线了新的数据分析功能，欢迎体验使用！',
      iconType: 'success',
      time: '10分钟前'
    }
  ]);

  function openSlotDetails() {
    slotVisible.value = true;
  }

  function closeSlotDetails() {
    slotVisible.value = false;
  }

  function clear(keys: string) {
    notifications.value = notifications.value.filter((item: NotificationDetailItem) => keys.indexOf(item.key) === -1);
  }

  function clearAll() {
    notifications.value = [];
  }

  function toggleSwitch() {
    enabledNotice.value = !enabledNotice.value;
  }

  function subscribe() {
    console.log('订阅通知');
  }

  function handleCustomTabChange(tab: string) {
    customActiveTab.value = tab;
    console.log('切换到标签页:', tab);
  }

  function markAllAsRead() {
    console.log('标记全部已读');
  }

  function openSettings() {
    console.log('打开设置');
  }
</script>

<style scoped>
  .custom-tab {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    margin-right: 8px;
    transition: all 0.3s ease;
  }
  .custom-tab.active {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
  }

  .custom-action {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
</style>
```

:::

### 自定义通知内容

通过 NotificationDetailItem 的自定义属性来实现个性化通知。
:::demo

```vue
<template>
  <div style="margin-bottom: 16px">
    <a-button @click="openCustomDetails">打开自定义内容通知详情</a-button>
  </div>

  <das-notification-details
    :visible="customVisible"
    :notifications="customNotifications"
    @close="closeCustomDetails"
    @clear="clearCustom"
    @clearAll="clearAllCustom"
  />
</template>

<script setup lang="ts">
  import { ref, h } from 'vue';
  import type { NotificationDetailItem } from 'Comp/notification/types';

  const customVisible = ref(false);
  const customNotifications = ref<NotificationDetailItem[]>([
    {
      key: '1',
      title: h('span', { style: 'color: #1890ff; font-weight: bold;' }, '自定义标题'),
      content: '这是一个带有自定义背景色的通知',
      iconType: 'info',
      time: '刚刚',
      backgroundColor: '#f0f8ff'
    },
    {
      key: '2',
      title: '带有自定义悬停操作的通知',
      content: '鼠标悬停在时间区域查看更多操作',
      iconType: 'success',
      time: '2分钟前',
      customHoverAction: '点击查看详情'
    }
  ]);

  function openCustomDetails() {
    customVisible.value = true;
  }

  function closeCustomDetails() {
    customVisible.value = false;
  }

  function clearCustom(keys: string) {
    customNotifications.value = customNotifications.value.filter(
      (item: NotificationDetailItem) => keys.indexOf(item.key) === -1
    );
  }

  function clearAllCustom() {
    customNotifications.value = [];
  }
</script>
```

:::

### 自定义通知内容 -- 自定义操作区

通过 NotificationDetailItem 的自定义属性来实现个性化通知，这里实现一个自定义操作区的 demo。
:::demo

```vue
<template>
  <div style="margin-bottom: 16px">
    <a-button @click="openCustomDetails">打开自定义内容通知详情</a-button>
  </div>

  <das-notification-details
    :visible="customVisible"
    :notifications="customNotifications"
    @close="closeCustomDetails"
    @clear="clearCustom"
    @clearAll="clearAllCustom"
  />
</template>

<script setup lang="ts">
  import { ref, h, defineComponent } from 'vue';
  import type { NotificationDetailItem } from 'Comp/notification/types';

  // 自定义操作组件
  const CustomActionComponent = defineComponent({
    props: {
      item: Object,
      notifications: Array,
      clear: Function
    },
    emits: ['viewDetails', 'ignore'],
    setup(props, { emit }) {
      const handleViewDetails = () => {
        console.log('查看详情被点击，通知项：', props.item);
        emit('viewDetails', props.item);
        if (props.item) {
          alert(`查看详情：${props.item.title}`);
        }
      };

      const handleIgnore = () => {
        if (props.item && props.clear) {
          emit('ignore', props.item.key);
          props.clear(props.item.key);
        }
      };

      return () =>
        h('div', { class: 'custom-action' }, [
          h(
            'a-button',
            {
              type: 'outline',
              size: 'small',
              onClick: handleViewDetails,
              style: 'cursor:pointer;font-size:12px'
            },
            '查看详情'
          ),
          h(
            'a-button',
            {
              type: 'outline',
              size: 'small',
              style: 'margin-left: 4px;cursor:pointer;font-size:12px',
              onClick: handleIgnore
            },
            '忽略'
          )
        ]);
    }
  });

  const customVisible = ref(false);
  const customNotifications = ref<NotificationDetailItem[]>([
    {
      key: '1',
      title: h('span', { style: 'color: #1890ff; font-weight: bold;' }, '自定义标题'),
      content: '这是一个带有自定义背景色的通知',
      iconType: 'info',
      time: '刚刚',
      backgroundColor: '#f0f8ff'
    },
    {
      key: '2',
      title: '带有自定义操作按钮的通知',
      content: '这个通知包含自定义的操作按钮，可以查看详情或忽略通知',
      iconType: 'success',
      time: '2分钟前',
      customAction: CustomActionComponent, // 使用自定义操作组件
      customHoverAction: '点击操作按钮进行相关操作'
    },
    {
      key: '3',
      title: '重要系统通知',
      content: '系统检测到异常活动，建议立即处理。点击右侧操作按钮查看详情或忽略此通知。',
      iconType: 'warning',
      time: '5分钟前',
      customAction: CustomActionComponent // 使用自定义操作组件
    }
  ]);

  function openCustomDetails() {
    customVisible.value = true;
  }

  function closeCustomDetails() {
    customVisible.value = false;
  }

  function clearCustom(keys: string) {
    customNotifications.value = customNotifications.value.filter(
      (item: NotificationDetailItem) => keys.indexOf(item.key) === -1
    );
  }

  function clearAllCustom() {
    customNotifications.value = [];
  }
</script>

<style scoped>
  .custom-action {
    display: flex;
    gap: 8px;
  }
</style>
```

:::

## API

### 属性

| 参数          | 说明             | 类型                       | 可选值         | 默认值  |
| ------------- | ---------------- | -------------------------- | -------------- | ------- |
| visible       | 是否显示抽屉     | `boolean`                  | `true` `false` | `false` |
| notifications | 通知数据列表     | `NotificationDetailItem[]` |                | []      |
| enabledNotice | 是否启用通知功能 | `boolean`                  | `true` `false` | `true`  |
| activeTab     | 默认激活的标签页 | `string`                   | `time` `type`  | `time`  |

### 事件

| 事件名称     | 说明                   | 回调参数               |
| ------------ | ---------------------- | ---------------------- |
| close        | 关闭抽屉时触发         | () => void             |
| clear        | 清除指定通知时触发     | (keys: string) => void |
| clearAll     | 清空所有通知时触发     | () => void             |
| toggleSwitch | 切换通知开关时触发     | () => void             |
| subscribe    | 点击消息订阅按钮时触发 | () => void             |

### NotificationDetailItem

| 参数              | 说明                                  | 类型               | 可选值                             | 默认值 |
| ----------------- | ------------------------------------- | ------------------ | ---------------------------------- | ------ |
| key               | 通知的唯一标识                        | `string`           | -                                  |
| title             | 通知标题                              | `string \|  VNode` | -                                  |
| content           | 通知内容                              | `string \|  VNode` | -                                  |
| iconType          | 图标类型                              | `string`           | `info` `success` `warning` `error` | `info` |
| time              | 时间文本                              | `string \|  VNode` | -                                  | -      |
| backgroundColor   | 自定义背景色                          | `string`           | -                                  |
| customHoverAction | 时间区域悬停后显示的自定义操作        | `VNode`            | -                                  |
| customIcon        | 自定义图标，优先级高于内置的 iconType | `VNode`            | -                                  |
| customAction      | 自定义操作区                          | `VNode`            | -                                  |

### title 作为 VNode 时

| 参数          | 说明         | 类型                       | 可选值 | 默认值 |
| ------------- | ------------ | -------------------------- | ------ | ------ |
| item          | 通知数据     | `NotificationDetailItem`   | -      | -      |
| notifications | 通知数据列表 | `NotificationDetailItem[]` | -      | -      |

### content 作为 VNode 时

| 参数          | 说明               | 类型                       | 可选值 | 默认值 |
| ------------- | ------------------ | -------------------------- | ------ | ------ |
| item          | 通知数据           | `NotificationDetailItem`   | -      | -      |
| notifications | 通知数据列表       | `NotificationDetailItem[]` | -      | -      |
| clear         | 清除指定通知时触发 | `(keys: string) => void `  | -      | -      |

### time 作为 VNode 时

| 参数          | 说明         | 类型                       | 可选值 | 默认值 |
| ------------- | ------------ | -------------------------- | ------ | ------ |
| item          | 通知数据     | `NotificationDetailItem`   | -      | -      |
| notifications | 通知数据列表 | `NotificationDetailItem[]` | -      | -      |

### customHoverAction

| 参数          | 说明               | 类型                       | 可选值 | 默认值 |
| ------------- | ------------------ | -------------------------- | ------ | ------ |
| item          | 通知数据           | `NotificationDetailItem`   | -      | -      |
| notifications | 通知数据列表       | `NotificationDetailItem[]` | -      | -      |
| clear         | 清除指定通知时触发 | `(keys: string) => void`   | -      | -      |

### customIcon

| 参数 | 说明     | 类型                     | 可选值 | 默认值 |
| ---- | -------- | ------------------------ | ------ | ------ |
| item | 通知数据 | `NotificationDetailItem` | -      | -      |

### customAction

| 参数          | 说明               | 类型                       | 可选值 | 默认值 |
| ------------- | ------------------ | -------------------------- | ------ | ------ |
| item          | 通知数据           | `NotificationDetailItem`   | -      | -      |
| notifications | 通知数据列表       | `NotificationDetailItem[]` | -      | -      |
| clear         | 清除指定通知时触发 | `(keys: string) => void`   | -      | -      |

### 插槽

| 插槽名称 | 说明         | 参数 |
| -------- | ------------ | ---- |
| tabs     | 自定义标签页 | -    |
| actions  | 自定义操作栏 | -    |

# das-notification-details 通知详情（补充设计指导）

## 🎬 适用场景

### 1、通知管理：

集中管理和展示系统通知，提供良好的用户体验。

##### 1.1、大量通知展示

当系统有大量通知需要展示时，使用抽屉形式可以避免占用过多页面空间。例如：

- 系统消息中心
- 工作流通知列表
- 实时消息推送

##### 1.2、分类管理

支持按时间和按类型两种方式展示通知，方便用户快速找到所需信息。例如：

- 按时间查看最新消息
- 按类型查看特定类别的通知
- 分组管理不同来源的消息

### 2、自定义扩展：

通过丰富的插槽和自定义属性，满足不同业务场景的需求。

##### 2.1、个性化展示

支持自定义图标、内容、操作等，实现个性化的通知展示。例如：

- 自定义通知图标和样式
- 添加特殊的操作按钮
- 实现富文本内容展示

## ⭐️ 落地实践

##### 性能优化

组件内置分页加载机制，默认每次加载 20 条数据，避免一次性渲染大量 DOM 导致的性能问题。

##### 交互体验

- 支持实时显示新通知数量
- 提供消息更新提示条
- 支持批量操作和快速清除

##### 扩展性

通过插槽和自定义属性，可以灵活扩展组件功能，满足复杂业务场景的需求。
