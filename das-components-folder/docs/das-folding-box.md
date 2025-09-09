<ComponentInfo developer="宋浩" date="2025-03-27" />
# das-folding-box 折叠盒

## 组件说明
一个功能强大的折叠盒组件，用于创建可折叠和可调整大小的内容区域。它提供了灵活的布局控制和丰富的交互功能。组件具备以下特性：
- 支持左中右三区域布局，每个区域可独立配置内容
- 提供可拖拽的分隔线，实现区域大小的灵活调整
- 支持区域最小/最大宽度限制，确保良好的布局效果

## 何时使用
- 复杂界面布局：需要将界面划分为多个可调整大小的区域时，如IDE编辑器、设计工具等
- 多面板布局：需要同时展示多个相关联的内容面板，并能够灵活调整各个面板大小时
- 工具面板：需要在工作区域旁边放置可收起的工具面板时
- 详情展示：需要在列表旁边显示详情信息，且详情面板宽度可调节时
- 分屏显示：需要实现可调节比例的分屏显示功能时

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <div style="height: 300px; border: 1px solid #eee; position: relative;">
      <DasFoldingBox
        :draggable="config.draggable"
        :customized="config.customized"
        :defaultHide="config.defaultHide"
        :style="{ '--left-width': config.leftWidth, '--right-width': config.rightWidth }"
      >
        <template v-slot:left>
          <div style="padding: 16px; height: 100%;">
            <h3>左侧内容区域</h3>
            <p>这是左侧的自定义内容</p>
            <p>可以在这里放置任何内容</p>
            <p>例如导航菜单、属性面板等</p>
          </div>
        </template>
        <template v-slot:right>
          <div style="padding: 16px; height: 100%;" >
            <h3>右侧内容区域</h3>
            <p>这是右侧的自定义内容</p>
            <p>可以在这里放置任何内容</p>
            <p>例如详情面板、属性编辑器等</p>
          </div>
        </template>
        <!--<div style="padding: 16px; height: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: center;" >
          <div style="text-align: center;">
            <h2>主内容区域</h2>
            <p>这是折叠盒的主要内容区域</p>
            <p>当前状态：{{ getStatus(config) }}</p>
            <p>拖动左右两侧的分隔线可以调整区域大小</p>
          </div>
        </div>-->
      </DasFoldingBox>
    </div>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { basicConfig as initConfig } from 'Comp/folding-box/mock/config';

const getStatus = (config) => {
  let status = [];
  
  if (config.draggable) {
    status.push('可拖动');
  }
  
  if (config.customized) {
    status.push('自定义样式');
  }
  
  if (config.defaultHide) {
    status.push('默认隐藏');
  }
  
  return status.length ? status.join('、') : '标准模式';
};
</script>
```
:::

## 二、安装与引入
确保该组件已经正确集成到你的项目中，在需要使用的 Vue 组件里引入：
```vue
import DasFoldingBox from 'path/to/DasFoldingBox';

export default {
  components: {
    DasFoldingBox
  }
}
```

## 三、基础用法

### 简单使用
:::demo
```vue
<template>
  <DasFoldingBox draggable>
    <template v-slot:left>
      <p>我是左侧的内容</p>
    </template>
    <template v-slot:right>
      <p>我是右侧的内容</p>
    </template>
    <p>默认内容</p>
  </DasFoldingBox>
</template>
```
:::

### 可拖动的折叠盒
:::demo
```vue
<template>
  <DasFoldingBox draggable>
    <template v-slot:left>
      <p>我是左侧的内容</p>
    </template>
    <template v-slot:right>
      <p>我是右侧的内容</p>
    </template>
    <p>默认内容</p>
  </DasFoldingBox>
</template>
```
:::

### 自定义样式的可拖动折叠盒
:::demo
```vue
<template>
  <DasFoldingBox draggable customized>
    <template v-slot:left>
      <p>我是左侧的内容</p>
    </template>
    <template v-slot:right>
      <p>我是右侧的内容</p>
    </template>
    <p>默认内容</p>
  </DasFoldingBox>
</template>
```
:::

### 默认隐藏的折叠盒
:::demo
```vue
<template>
  <DasFoldingBox defaultHide>
    <template v-slot:left>
      <p>我是左侧的内容</p>
    </template>
    <template v-slot:right>
      <p>我是右侧的内容</p>
    </template>
    <p>默认内容</p>
  </DasFoldingBox>
</template>
```
:::

## 四、Props 参数

| 参数名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| `draggable` | `boolean` | `false` | 是否允许折叠盒可拖动。 |
| `customized` | `boolean` | `false` | 是否使用自定义样式。 |
| `defaultHide` | `boolean` | `false` | 是否默认隐藏折叠盒。 |

## 五、插槽

### `left` 插槽
用于放置折叠盒左侧的内容。
```vue
<template>
  <DasFoldingBox>
    <template v-slot:left>
      <!-- 左侧内容 -->
      <p>这是左侧的自定义内容</p>
    </template>
    <!-- 其他内容 -->
  </DasFoldingBox>
</template>
```

### `right` 插槽
用于放置折叠盒右侧的内容。
```vue
<template>
  <DasFoldingBox>
    <template v-slot:right>
      <!-- 右侧内容 -->
      <p>这是右侧的自定义内容</p>
    </template>
    <!-- 其他内容 -->
  </DasFoldingBox>
</template>
```

### 默认插槽
用于放置折叠盒的默认内容。
```vue
<template>
  <DasFoldingBox>
    <!-- 默认内容 -->
    <p>这是折叠盒的默认内容</p>
  </DasFoldingBox>
</template>
```

## 六、注意事项
- 当使用 `draggable` 属性时，要确保在项目中处理好拖动相关的交互逻辑。
- `customized` 属性需要配合相应的 CSS 样式来实现自定义效果。
- `defaultHide` 属性可用于在页面加载时隐藏折叠盒，后续可通过 JavaScript 控制显示。

以上文档详细介绍了 `DasFoldingBox` 组件的使用方法、参数、插槽等信息，你可以根据实际项目需求进行参考和调整。