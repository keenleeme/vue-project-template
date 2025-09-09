<ComponentInfo developer="邵天瑞" date="2025-03-19" />

# das-tool-tip 文字提示
## 组件说明
一个功能丰富的文字提示组件，为用户界面提供即时的信息反馈和交互指引。该组件通过简洁的悬浮提示框，在不占用额外页面空间的情况下，展示补充信息或操作说明。

## 何时使用
- 需要为用户界面元素提供进一步解释说明时
- 展示字段、功能的补充信息或使用提示时
- 操作按钮或图标需要额外说明时

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-tool-tip 
      :placement="config.placement"
      :theme="config.theme"
      :delay="config.delay"
      :show-arrow="config.showArrow"
      :arrow-point-at-center="config.arrowPointAtCenter"
      :custom-class="config.customClass"
    >
      <template #title>
        <span>{{ config.title }}</span>
      </template>
      <a-button>文字提示</a-button>
    </das-tool-tip>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/tool-tip/mock/config';
</script>
```
:::

## 基础用法
:::demo
```vue
<template>
   <das-tool-tip>
    <template #title>
          <span>prompt text</span>
        </template>
    <a-button>基础用法</a-button>
  </das-tool-tip>
</template>
```
:::
## 位置
:::demo
```vue
<template>
   <das-tool-tip placement="topLeft">
    <template #title >
          <span>prompt text</span>
        </template>
    <a-button>TL</a-button>
  </das-tool-tip>
  <das-tool-tip placement="topRight">
    <template #title >
          <span>prompt text</span>
        </template>
    <a-button>TR</a-button>
  </das-tool-tip>
  <das-tool-tip placement="top">
    <template #title >
          <span>prompt text</span>
        </template>
    <a-button>TOP</a-button>
  </das-tool-tip>
</template>
```
:::
## 箭头指向
:::demo
```vue
<template>
   <das-tool-tip placement="topLeft">
    <template #title >
          <span>prompt text</span>
    </template>
    <a-button>Align edge / 边缘对齐</a-button>
  </das-tool-tip>
  <das-tool-tip placement="topLeft" arrow-point-at-center>
    <template #title >
          <span>prompt text</span>
    </template>
    <a-button>Arrow points to center / 箭头指向中心</a-button>
  </das-tool-tip>
</template>
```
:::
## 文字背景
:::demo
```vue
<template>
   <das-tool-tip title="默认黑色提示">
  <a-button>默认提示</a-button>
</das-tool-tip>

<!-- 亮色主题 -->
<das-tool-tip title="亮色提示" theme="light">
  <a-button>亮色提示</a-button>
</das-tool-tip>
<das-tool-tip title="警告提示" theme="warning">
  <a-button>警告提示</a-button>
</das-tool-tip>

<!-- 警告主题 -->
<das-tool-tip title="警告提示" theme="warning">
  <a-button>警告提示</a-button>
</das-tool-tip>

<!-- 危险主题 -->
<das-tool-tip title="危险提示" theme="danger">
  <a-button>危险提示</a-button>
</das-tool-tip>

<!-- 成功主题 -->
<das-tool-tip title="成功提示" theme="success">
  <a-button>成功提示</a-button>
</das-tool-tip>
</template>
```
:::
## 箭头显隐
:::demo
```vue
<template>
   <!-- 不显示箭头 -->
<das-tool-tip title="无箭头提示" :show-arrow="false">
  <a-button>无箭头提示</a-button>
</das-tool-tip>

<!-- 显示箭头（默认） -->
<das-tool-tip title="有箭头提示">
  <a-button>有箭头提示</a-button>
</das-tool-tip>
</template>
```
:::


### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| placement | 弹出位置 | `string` | `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` | `top` |
| theme | 主题样式 | `string` | `default` `light` `warning` `danger` `success` | `default` |
| delay | 延迟显示时间（毫秒） | `number` | - | 300 |
| showArrow | 是否显示箭头 | `boolean` | - | true |
| arrowPointAtCenter | 箭头是否指向目标元素中心 | `boolean` | - | false |
| customClass | 自定义类名 | `string` | - | `das-tooltip` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 触发提示的元素 |
| title | 提示文字内容 |

### 主题说明

- `default`: 黑色背景，白色文字（默认）
- `light`: 白色背景，黑色文字
- `warning`: 橙色警告主题
- `danger`: 红色危险主题
- `success`: 绿色成功主题
## 设计说明

### 适用场景

#### 1. 显示按钮、图标详细名称
当界面上某些UI元素可能对用户来说不够直观时，Tooltips 可以展示该按钮的功能说明：
- 展示按钮名称
- 解释图标含义

#### 2. 提供更多上下文或解释
为用户提供更多辅助说明时：
- 提供关于标签、数据等的更多信息
- 说明超链接的目的
- 说明如何解除禁用

#### 3. 完整显示被截断的标签或文本
常见于列表或限制显示宽度的场景中：
- 列表中被截断的文本
- 卡片中被截断的标题

### 落地实践

#### 1. 文字溢出
当标签太长而超出可用的水平空间时，它会换行形成另一行。
尽量使用简洁明了的文案。

#### 2. 最大宽度
设定最大显示宽度（480px，尺寸是最小的modal对话框）

#### 3. 可发现性
不要过于隐蔽，留有线索，让用户能够预判「这里有提示」。
例如对于需要解释的label，旁边放置info图标。

### 注意事项

#### ❌ 不要遮挡内容
选取合适的展示位置，请勿遮挡周围重要内容。

#### ❌ 不要使用Tooltips来传达关键信息
由于它们默认是隐藏的，并且当用户将鼠标悬停在别处时Tooltips会消失，因此Tooltips应仅用于为显示的消息提供补充背景。对于重要信息，请使用始终可见的帮助文本，横幅等。

#### ❌ 不要加入可交互元素
Tooltips仅在鼠标悬停时显示。它们不应包含按钮或链接。如果需要在补充信息中包含图像、按钮或链接，请使用气泡。
