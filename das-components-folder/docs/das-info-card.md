<ComponentInfo developer="李策" date="2025-06-25" />

# das-info-card 信息卡片
## 组件说明

信息卡片用于展示结构化的信息内容，支持多种布局方式和展示形式。它可以清晰地呈现标题、副标题、内容、图片和操作按钮，适用于信息展示、产品列表、用户卡片等场景。

## 何时使用

- 需要展示结构化的信息内容时
- 展示带有图片、标题和描述的卡片列表时
- 需要在卡片中提供操作按钮或交互功能时
- 需要灵活的布局方式来适应不同的展示需求时
- 需要支持选中状态的卡片选择场景时

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果
:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-info-card
      :title="config.title"
      :subtitle="config.subtitle"
      :content="config.content"
      :image="config.image"
      :background="config.background"
      :layout="config.layout"
      :size="config.size"
      :bordered="config.bordered"
      :shadow="config.shadow"
      :hoverable="config.hoverable"
      :selected="config.selected"
      :multiple="config.multiple"
      :hover-button-group="config.hoverButtonGroup"
    />
  </JsonEditor>
</template>

<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/info-card/mock/config';
</script>
```
:::

## 基础用法

### 基础示例

展示最基本的信息卡片用法。

:::demo
```vue
<template>
  <div class="card-row">
    <das-info-card
      title="标题"
      subtitle="副标题"
      content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容......"
    >
      <template #actions>
        <a-tag color="blue" style="margin: 0">默认标签</a-tag>
      </template>
    </das-info-card>

    <das-info-card
      title="标题"
      content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容......"
    >
      <template #image>
        <img :src="demoImg" style="width: 100%; height: 100%;" />
      </template>
      
      <template #actions>
        <a-tag color="blue" style="margin: 0">默认标签</a-tag>
      </template>
    </das-info-card>
  </div>
</template>

<script setup lang="ts">
  import { Tag as ATag } from 'ant-design-vue';
  import demoImg from '../../../components/info-card/imgs/40_40.png';
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 不同布局

支持默认、右侧图片、顶部居中图片、顶部全宽图片四种布局方式。

:::demo
```vue
<template>
  <div class="card-row">
    <!-- 默认布局 -->
    <das-info-card
      title="默认布局"
      subtitle="副标题"
      content="这是一段内容文案"
      :image="demoImg"
    />

    <!-- 右侧图片布局 -->
    <das-info-card
      layout="right"
      title="右侧图片布局"
      subtitle="副标题"
      content="这是一段内容文案 这是一段很长很长很长很长很长很长很长很长很长很长很长的内容文案"
      :image="demoRightImg"
    />
  </div>

  <div class="card-row">
    <!-- 顶部居中图片布局 -->
    <das-info-card
      layout="top-center"
      title="顶部居中布局"
      subtitle="副标题"
      content="这是一段内容文案"
      :image="demoTopCenterImg"
    />

    <!-- 顶部全宽图片布局 -->
    <das-info-card
      layout="top-full"
      title="顶部全宽布局"
      subtitle="副标题"
      content="这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的内容文案"
      :image="demoTopFullImg"
    >
      <template #actions>
        <a-tag color="blue" style="margin: 0">默认标签</a-tag>
      </template>
    </das-info-card>
  </div>
</template>

<script setup lang="ts">
  import { Tag as ATag } from 'ant-design-vue';
  import demoImg from '../../../components/info-card/imgs/40_40.png';
  import demoRightImg from '../../../components/info-card/imgs/205_174.png';
  import demoTopCenterImg from '../../../components/info-card/imgs/88_88.png';
  import demoTopFullImg from '../../../components/info-card/imgs/bg_full.png';
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 不同尺寸

支持小、中、大三种尺寸，默认为大。

:::demo
```vue
<template>
  <div class="card-row">
    <das-info-card
      size="small"
      title="小尺寸"
      subtitle="副标题"
      content="内容文案"
      :image="demoSmallImg"
    />

    <das-info-card
      size="medium"
      title="中尺寸"
      subtitle="副标题"
      content="内容文案"
      :image="demoImg"
    />

    <das-info-card
      size="large"
      title="大尺寸"
      subtitle="副标题"
      content="内容文案"
      :image="demoLargeImg"
    />
  </div>
</template>

<script setup lang="ts">
  import demoImg from '../../../components/info-card/imgs/40_40.png';
  import demoSmallImg from '../../../components/info-card/imgs/24_24.png'
  import demoLargeImg from '../../../components/info-card/imgs/56_56.png'
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 可操作卡片

卡片可以包含各种操作按钮和交互元素。

:::demo
```vue
<template>
  <div class="card-row">
    <das-info-card
      title="标题"
      subtitle="副标题"
      content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容......"
    >
      <template #actions>
        <a-button size="small">操作</a-button>
      </template>
    </das-info-card>

    <das-info-card
      title="标题"
      :image="demoImg"
    >
      <template #actions>
        <a-dropdown>
          <a-button type="text" style="padding: 0;">
            <EllipsisOutlined />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">一级选项</a-menu-item>
              <a-menu-item key="2">一级选项</a-menu-item>
              <a-menu-item key="3">一级选项</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>

      <a-tag color="blue">默认标签</a-tag>
      <a-tag color="blue">默认标签</a-tag>
      <p class="das-info-card__content-text" style="margin-top: 8px;">内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容......</p>
    </das-info-card>
  </div>
</template>

<script setup lang="ts">
  import { EllipsisOutlined } from '@ant-design/icons-vue';
  import { Button as AButton, Dropdown as ADropdown, Menu as AMenu, Tag as ATag } from 'ant-design-vue';
  import demoImg from '../../../components/info-card/imgs/40_40.png';

  // 注册 Menu.Item 组件
  const AMenuItem = AMenu.Item;
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 按钮组

卡片可以配置按钮组，支持悬停显示。

:::demo
```vue
<template>
  <div class="card-row">
    <das-info-card
      title="标题"
      subtitle="副标题"
      content="这是一段内容文案"
      :image="demoImg"
      :button-group="[
        { label: '详情', type: 'default', onClick: () => console.log('详情') },
        { label: '编辑', type: 'default', onClick: () => console.log('编辑') },
        { label: '删除', type: 'danger', onClick: () => console.log('删除') }
      ]"
    />

    <das-info-card
      title="标题"
      subtitle="副标题"
      content="这是一段内容文案这是一段内容文案"
      :image="demoImg"
      :button-group="[
        { label: '详情', type: 'default', onClick: () => console.log('详情') },
        { label: '编辑', type: 'default', onClick: () => console.log('编辑') },
        { label: '删除', type: 'danger', onClick: () => console.log('删除') }
      ]"
      :hover-button-group="true"
    />
  </div>
</template>

<script setup lang="ts">
  import demoImg from '../../../components/info-card/imgs/40_40.png';
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 选中状态

卡片支持选中状态，包括单选和多选模式。

:::demo
```vue
<template>
  <div class="card-row">
    <!-- 单选模式 -->
    <das-info-card
      title="单选卡片"
      subtitle="未选中状态"
      content="点击可选中"
      :image="demoImg"
      :selected="selected"
      @click="selected = !selected"
    />

    <das-info-card
      title="单选卡片"
      subtitle="选中状态"
      content="已选中"
      :image="demoImg"
      :selected="selected1"
      @click="selected1 = !selected1"
    />
  </div>

  <div class="card-row">
    <!-- 多选模式 -->
    <das-info-card
      title="多选卡片"
      subtitle="未选中状态"
      content="点击可选中"
      :image="demoImg"
      :selected="selected2"
      @click="selected2 = !selected2"
      :multiple="true"
    />

    <das-info-card
      title="多选卡片"
      subtitle="选中状态"
      content="已选中"
      :image="demoImg"
      :selected="selected3"
      @click="selected3 = !selected3"
      :multiple="true"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import demoImg from '../../../components/info-card/imgs/40_40.png';

  const selected = ref(false);
  const selected1 = ref(true);
  const selected2 = ref(false);
  const selected3 = ref(true);
</script>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

### 自定义样式

可以自定义卡片的背景、边框、阴影等样式。

:::demo
```vue
<template>
  <div class="card-row">
    <das-info-card
      title="自定义背景"
      subtitle="渐变背景"
      content="这是一段内容文案"
      background="linear-gradient(180deg, #F0F6FF 7%, #FFFFFF 100%)"
    />

    <das-info-card
      title="无边框卡片"
      subtitle="副标题"
      content="这是一段内容文案"
      :bordered="false"
    />

    <das-info-card
      title="可悬停卡片"
      subtitle="副标题"
      content="这是一段内容文案"
      :hoverable="true"
    />
  </div>
</template>

<style lang="less" scoped>
  .card-row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```
:::

## API

### Props

| 参数             | 说明                                                                                  | 类型            | 默认值     |
| ---------------- | ------------------------------------------------------------------------------------ | --------------- | ---------- |
| title            | 卡片标题                                                                             | string           | ''         |
| subtitle         | 卡片副标题                                                                           | string           | ''         |
| content          | 卡片内容                                                                             | string           | ''         |
| image            | 图片地址                                                                             | string           | ''         |
| background       | 背景设置 - 可以是图片URL、颜色值或渐变色                                                | string           | ''         |
| layout           | 布局模式，可选值：'default' \\| 'right' \\| 'top-center' \\| 'top-full'                  | string           | 'default'  |
| size             | 卡片尺寸，可选值：'small' \\| 'medium' \\| 'large'                                      | string           | 'large'    |
| bordered         | 是否显示边框                                                                         | boolean          | true       |
| shadow           | 是否显示阴影                                                                         | boolean          | true       |
| hoverable        | 是否可悬停                                                                           | boolean          | false      |
| selected         | 是否选中                                                                             | boolean          | -          |
| multiple         | 是否多选模式                                                                         | boolean           | false      |
| buttonGroup      | 按钮组配置                                                                           | Array<{ label: VueNode, type?: string; onClick?: () => void }>          | []        |
| hoverButtonGroup | 是否启用悬停显示按钮组                                                                | boolean           | false      |

### Slots

| 名称        | 说明                |
| ----------- | ------------------ |
| title       | 自定义标题内容       |
| subtitle    | 自定义副标题内容     |
| default     | 自定义主体内容       |
| image       | 自定义图片内容       |
| actions     | 自定义操作区域内容    |
| badge       | 自定义左上角徽章内容  |
| footer      | 自定义底部内容       |

## 常见问题

### 1. 如何实现卡片的选中功能？

卡片支持选中状态，可以通过以下方式使用：

- 设置 selected 属性控制选中状态
- 设置 multiple 属性启用多选模式
- 传入 selected 属性时， hoverable 会自动开启