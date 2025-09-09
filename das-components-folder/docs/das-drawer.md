<ComponentInfo developer="宋建业" date="2025-03-24" />

# das-drawer 抽屉组件

## 组件说明
抽屉组件用于从屏幕边缘滑出的浮层面板，可以替代传统的模态框，用于展示或者处理信息。

## 何时使用

- **侧边导航场景**：当需要展示系统导航菜单或功能列表时
- **设置面板场景**：需要临时展示配置选项或表单内容时
- **详情展示场景**：需要查看或编辑对象详细信息而不跳转页面时
- **多步骤操作场景**：需要引导用户完成多步骤操作流程时
- **大屏适配场景**：在宽屏设备上需要充分利用屏幕空间时

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <a-button @click="config.visible = true">打开抽屉</a-button>
    <das-drawer
      v-model="config.visible"
      :width="config.width"
      :outer="config.outer"
      :size="config.size"
      :mask="config.mask"
      :mask-closable="config.maskClosable"
      :closable="config.closable"
      :z-index="config.zIndex"
      :title="config.title"
      :theme="config.theme"
      @close="config.visible = false"
    >
      <p>这是一个基础抽屉示例</p>
      <p>你可以在这里放置任何内容</p>
    </das-drawer>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/drawer/mock/config';
</script>
```
:::

## 基础用法

:::demo
```vue
<template>
  <div class="demo-container">
    <a-button @click="visible = true">打开抽屉</a-button>
    <das-drawer
      v-model="visible"
      title="基础抽屉"
      @close="visible = false"
    >
      <p>这是一个基础抽屉示例</p>
      <p>你可以在这里放置任何内容</p>
    </das-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
</script>
```
:::

## 嵌套抽屉

:::demo
```vue
<template>
  <div class="demo-container">
    <a-button @click="visible = true">打开抽屉</a-button>
    <das-drawer
      v-model="visible"
      :outer="true"
      title="外层抽屉"
      @close="visible = false"
    >
      <p>这是外层抽屉内容</p>
      <a-button @click="innerVisible = true">打开内层抽屉</a-button>
      <das-drawer
        v-model="innerVisible"
        title="内层抽屉"
        @close="innerVisible = false"
      >
        <p>这是内层抽屉内容</p>
      </das-drawer>
    </das-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const innerVisible = ref(false);
</script>
```
:::

## API

### Props

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否显示抽屉 | boolean | false |
| width | 抽屉的宽度（优先于size生效） | string/number | 480 |
| outer | 是否为外层抽屉（用于嵌套抽屉场景） | boolean | false |
| size | 抽屉的尺寸，可选值：large, medium, small, mini | string | mini
| mask | 是否显示遮罩层 | boolean | true |
| maskClosable | 点击遮罩层是否可以关闭抽屉 | boolean | true |
| closable | 是否显示关闭按钮 | boolean | true |
| zIndex | 抽屉的层级 | number | 1000 |
| title | 抽屉的标题 | string | '' |
| theme | 抽屉的主题，可选值：light, dark | string | light |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 抽屉显示状态改变时触发 | (modelValue: boolean) |
| close | 点击遮罩层或关闭按钮时触发 | - |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 抽屉的内容 |
| footer | 抽屉的底部内容 |

### 尺寸说明

抽屉的宽度根据`size`属性自动计算：

- large: 视口宽度的80%（最小480px）
- medium: 视口宽度的60%（最小480px）
- small: 视口宽度的40%（最小480px）
- mini: 视口宽度的20%（最小480px）

当设置了`outer`属性为`true`时，抽屉的宽度会在上述基础上增加100px，以适应嵌套抽屉的场景。