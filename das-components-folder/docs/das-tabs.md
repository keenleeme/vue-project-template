<ComponentInfo developer="宋浩" date="2025-03-27" />

# das-tabs 组件使用文档

## 组件说明
一个功能丰富的标签页组件，用于在同一区域内组织和切换不同内容。组件支持以下特性：

- 多种样式类型：支持默认、卡片式、胶囊式、圆角等多种外观样式
- 可编辑功能：支持动态添加、删除标签页
- 禁用状态：支持禁用特定的标签页
- 尺寸设置：提供默认和小型两种尺寸选项

## 何时使用
- 需要在同一页面内展示多个相关但独立的内容区域时
- 需要将复杂的内容或功能模块进行分类展示时
- 希望减少页面跳转，提供更流畅的用户体验时


## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果 

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <div>
      <das-tabs 
        v-model="activeValue" 
        :type="config.type" 
        :size="config.size"
        :tab-position="config.tabPosition"
        :closable="config.closable"
        :addable="config.addable"
        :editable="config.editable"
        :stretch="config.stretch"
        @edit="handleEdit"
      >
        <das-tab-pane 
          v-for="item in config.tabItems" 
          :key="item.key" 
          :label="item.label" 
          :name="item.key"
          :disabled="item.disabled"
        >
          <div>{{ item.content }}</div>
        </das-tab-pane>
      </das-tabs>
    </div>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { basicConfig as initConfig } from 'Comp/tabs/mock/config';

const activeValue = ref(initConfig.activeKey);

// 监听配置变化，更新激活的标签页
watch(() => initConfig.activeKey, (newVal) => {
  activeValue.value = newVal;
});

const handleEdit = (targetKey, action) => {
  console.log(targetKey, action);
  // 可以在这里处理标签页的编辑操作
};
</script>
```
:::

## 三、基础用法
### 简单的标签切换
:::demo
```vue
<template>
  <das-tabs v-model="activeName" size="small" @tab-click="handleClick">
      <das-tab-pane label="用户管理" name="first">
        <div>用户管理内容</div>
      </das-tab-pane>
      <das-tab-pane label="配置管理" name="second">
        <div>配置管理内容</div>
      </das-tab-pane>
      <das-tab-pane label="其他管理" :disabled="true" name="third">
        <div>其他管理内容</div>
      </das-tab-pane>
    </das-tabs>
</template>
<script lang="ts" setup>
// 在这里编写组件示例代码
import { ref } from 'vue';
const activeName = ref('first');
const handleClick = (tab: string) => {
  console.log(tab);
};
</script>
```
:::

### 可编辑的标签页（新增与关闭）
:::demo
```vue
<template>
  <DasTabs v-model="activeTabName" type="card" editable @edit="handleTabsEdit">
    <DasTabPane 
      v-for="tab in editableTabs" 
      :key="tab.name" 
      :label="tab.title" 
      :name="tab.name">
      <p>{{ tab.content }}</p>
    </DasTabPane>
  </DasTabs>
</template>

<script setup>
import { ref } from 'vue';

const activeTabName = ref('1');
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: '这是第一个可编辑标签页的内容。'
  },
  {
    title: 'Tab 2',
    name: '2',
    content: '这是第二个可编辑标签页的内容。'
  }
]);

const handleTabsEdit = (targetName, action) => {
  if (action === 'add') {
    // 添加新标签
    const newTabName = (editableTabs.value.length + 1).toString();
    editableTabs.value.push({
      title: '新标签',
      name: newTabName,
      content: `这是新标签${newTabName}的内容`
    });
    activeTabName.value = newTabName;
  } else if (action === 'remove') {
    // 删除标签
    let tabs = editableTabs.value;
    let activeName = activeTabName.value;
    
    // 如果删除的是当前活动标签，需要切换到其他标签
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }
    
    activeTabName.value = activeName;
    editableTabs.value = tabs.filter(tab => tab.name !== targetName);
  }
};
</script>
```
:::

## 四、Props 参数

| 参数名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| `modelValue` | `string` \| `number` | `''` | 当前激活的标签页的标识，可通过 `v-model` 进行双向绑定。 |
| `type` | `string` | - | 标签页的样式类型，可选值有 `'card'`、`'margin-card'`、`'capsule'`、`'radius'`。 |
| `closable` | `boolean` | `false` | 是否允许关闭标签页。 |
| `addable` | `boolean` | `false` | 是否允许新增标签页。 |
| `editable` | `boolean` | `false` | 是否可编辑，开启后支持新增和关闭标签页。 |
| `tabPosition` | `string` | `'top'` | 标签页的位置，可选值为 `'top'`、`'bottom'`、`'left'`、`'right'`。 |
| `beforeLeave` | `function` | - | 切换标签页前的回调函数，若返回 `false` 则阻止切换。 |
| `stretch` | `boolean` | `false` | 标签页是否拉伸以填充容器。 |
| `size` | `string` | `'large'` | 标签页的尺寸，可选值为 `'large'`、`'small'`。`small` 尺寸下字体字号小 2 个像素，高度少 2 个像素。 |

## 五、事件

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| `update:modelValue` | 当激活的标签页发生变化时触发。 | 新激活标签页的标识。 |

## 六、插槽

### 默认插槽
用于放置 `DasTabPane` 组件，每个 `DasTabPane` 代表一个标签页。

### DasTabPane Props

| 参数名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| `label` | `string` | - | 标签页的标题。 |

## 七、样式类型

### 卡片式 (`type="card"`)
:::demo
```vue
<template>
  <DasTabs v-model="activeTab" type="card">
    <DasTabPane label="Card Tab 1">
      <p>这是卡片式标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Card Tab 2">
      <p>这是卡片式标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Card Tab 1');
</script>
```
:::

### 胶囊式 (`type="capsule"`)
:::demo
```vue
<template>
  <DasTabs v-model="activeTab" type="capsule">
    <DasTabPane label="Capsule Tab 1">
      <p>这是胶囊式标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Capsule Tab 2">
      <p>这是胶囊式标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Capsule Tab 1');
</script>
```
:::

### 圆角式 (`type="radius"`)
:::demo
```vue
<template>
  <DasTabs v-model="activeTab" type="radius">
    <DasTabPane label="Radius Tab 1">
      <p>这是圆角式标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Radius Tab 2">
      <p>这是圆角式标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Radius Tab 1');
</script>
```
:::

### 带边距卡片式 (`type="margin-card"`) {style="color:#1890ff"}
:::demo
```vue
<template>
  <DasTabs v-model="activeTab" type="margin-card">
    <DasTabPane label="Margin Card Tab 1">
      <p>这是带边距卡片式标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Margin Card Tab 2">
      <p>这是带边距卡片式标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Margin Card Tab 1');
</script>
```
:::

### 大尺寸 (`size="large"`)
大尺寸是默认样式，无需额外设置 `size` 属性。
:::demo
```vue
<template>
  <DasTabs v-model="activeTab">
    <DasTabPane label="Large Tab 1">
      <p>这是大尺寸标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Large Tab 2">
      <p>这是大尺寸标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Large Tab 1');
</script>
```
:::

### 小尺寸 (`size="small"`)
:::demo
```vue
<template>
  <DasTabs v-model="activeTab" size="small">
    <DasTabPane label="Small Tab 1">
      <p>这是小尺寸标签页 1 的内容。</p>
    </DasTabPane>
    <DasTabPane label="Small Tab 2">
      <p>这是小尺寸标签页 2 的内容。</p>
    </DasTabPane>
  </DasTabs>
</template>
<script setup>
import { ref } from 'vue';
const activeTab = ref('Small Tab 1');
</script>
```
:::

## 九、注意事项
- 当使用 `editable`、`addable` 和 `closable` 属性时，要确保在项目中处理好相应的交互逻辑，例如新增和关闭标签页的事件。
- 若使用 `beforeLeave` 回调函数，注意返回值会影响标签页的切换操作。
- 不同的 `type` 和 `size` 可以组合使用，以满足多样化的设计需求。

以上文档详细介绍了 `DasTabs` 组件的使用方法、参数、事件等信息，你可以根据实际项目需求进行参考和调整。