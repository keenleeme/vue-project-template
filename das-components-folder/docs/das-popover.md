<ComponentInfo developer="宋建业" date="2025-03-26" />

# das-popover 气泡提示

## 组件说明

一个轻量级的弹出层交互组件，用于在用户与特定元素交互时显示额外的信息或操作选项。

## 何时使用

- **信息提示场景**：当需要为用户提供某个元素的补充说明或帮助信息时
- **操作确认场景**：需要用户进行二次确认的危险或重要操作时
- **功能引导场景**：在新功能上线或用户首次使用时，提供功能引导和说明
- **详细信息展示**：当页面空间有限，需要显示更多详细信息时
- **交互反馈场景**：需要为用户操作提供即时反馈或提示时

## 交互演示  {style="color:#ff47a3"}

通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-popover
      :title="config.title"
      :content="config.content"
      :placement="config.placement"
      :trigger="config.trigger"
      :theme="config.theme"
      :closeable="config.closeable"
      :confirm="config.confirm"
      :ok-text="config.okText"
      :cancel-text="config.cancelText"
    >
      <a-button>点击预览</a-button>
    </das-popover>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/popover/mock/config';
</script>
```
:::

## 基础用法

### 不同的触发方式

通过设置 `trigger` 属性可以改变触发方式，支持 `hover` 和 `click` 两种方式。
:::demo
```vue
<template>
  <das-popover title="Hover触发" content="这是一个简单的提示内容" placement="top" trigger="hover">
    <a-button>Hover触发</a-button>
  </das-popover>

  <das-popover
    v-model="modelValue"
    title="Click触发"
    placement="top"
    trigger="click"
    :closeable="true"
    @visible-change="handleVisibleChange"
  >
    <template #content>
      <div class="custom-content">
        <p>这是自定义内容区域</p>
      </div>
    </template>
    <a-button>Click触发</a-button>
  </das-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const modelValue = ref(false);
const handleVisibleChange = (visible: boolean) => {
  console.log('visible change:', visible);
};
</script>
```
:::

### 不同的弹出位置

通过设置 `placement` 属性可以改变弹出位置，支持 `top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`、`right`、`right-start`、`right-end` 十二个方向。
:::demo
```vue
<template>

<das-popover title="top" content="这是top的内容" placement="top" trigger="hover">
  <a-button>top</a-button>
</das-popover>

<das-popover title="top-start" content="这是top-start的内容" placement="top-start" trigger="hover">
  <a-button>top-start</a-button>
</das-popover>

<das-popover title="top-end" content="这是top-end的内容" placement="top-end" trigger="hover">
  <a-button>top-end</a-button>
</das-popover>

<das-popover title="bottom" content="这是bottom的内容" placement="bottom" trigger="hover">
  <a-button>bottom</a-button>
</das-popover>

<das-popover title="bottom-start" content="这是bottom-start的内容" placement="bottom-start" trigger="hover">
  <a-button>bottom-start</a-button>
</das-popover>

<das-popover title="bottom-end" content="这是bottom-end的内容" placement="bottom-end" trigger="hover">
  <a-button>bottom-end</a-button>
</das-popover>

<das-popover title="left" content="这是left的内容" placement="left" trigger="hover">
  <a-button>left</a-button>
</das-popover>

<das-popover title="left-start" content="这是left-start的内容" placement="left-start" trigger="hover">
  <a-button>left-start</a-button>
</das-popover>

<das-popover title="left-end" content="这是left-end的内容" placement="left-end" trigger="hover">
  <a-button>left-end</a-button>
</das-popover>

<das-popover title="right" content="这是right的内容" placement="right" trigger="hover">
  <a-button>right</a-button>
</das-popover>

<das-popover title="right-start" content="这是right-start的内容" placement="right-start" trigger="hover">
  <a-button>right-start</a-button>
</das-popover>

<das-popover title="right-end" content="这是right-end的内容" placement="right-end" trigger="hover">
  <a-button>right-end</a-button>
</das-popover>
</template>
```
:::

### 带图标和确认框

可以通过 `icon` 插槽添加图标，通过 `confirm` 属性添加确认框功能，通过配置theme=`dark`适配暗色系。
:::demo
```vue
<template>
<das-popover title="提示" content="确认是否要执行此操作" placement="top" trigger="click" :closeable="true">
  <template #icon>
    <svg
      t="1742972970328"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4389"
      width="32"
      height="32"
    >
      <path
        d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0z m44 256v339.492c0 24.301-19.7 44-44 44s-44-19.699-44-44V256c0-24.3 19.7-44 44-44s44 19.7 44 44z m-44 428c35.346 0 64 28.654 64 64 0 35.346-28.654 64-64 64-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64z"
        fill="#ffad33"
        p-id="4390"
      ></path>
    </svg>
  </template>
  <a-button>带icon</a-button>
</das-popover>
<das-popover
  title="提示"
  content="确认是否要执行此操作"
  placement="top"
  trigger="click"
  :confirm="true"
  @confirm="handleConfirm"
  @cancel="handleCancel"
>
  <a-button>带确认框</a-button>
</das-popover>
<das-popover
  title="提示"
  content="确认是否要执行此操作"
  placement="top"
  trigger="click"
  :confirm="true"
  @confirm="handleConfirm"
  @cancel="handleCancel"
>
  <template #icon>
    <svg
      t="1742972970328"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4389"
      width="32"
      height="32"
    >
      <path
        d="M512 0C229.23 0 0 229.23 0 512s229.23 512 512 512 512-229.23 512-512S794.77 0 512 0z m44 256v339.492c0 24.301-19.7 44-44 44s-44-19.699-44-44V256c0-24.3 19.7-44 44-44s44 19.7 44 44z m-44 428c35.346 0 64 28.654 64 64 0 35.346-28.654 64-64 64-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64z"
        fill="#ffad33"
        p-id="4390"
      ></path>
    </svg>
  </template>
  <a-button>带icon确认框</a-button>
</das-popover>
<das-popover title="少年闰土" placement="top" trigger="click" :closeable="true">
  <template #content>
    <p>
      深蓝的天空中挂着一轮金黄的圆月，下面是海边的沙地，都种着一望无际的、碧绿的西瓜。其间有一个十一、二岁的少年，项带银圈，手捏一柄钢叉，向一匹猹尽力地刺去。那猹却将身一扭，反从他的胯下逃走了。
    </p>
    <p>
      这少年便是闰土。我认识他时，也不过十多岁，离现在将有三十年了；那时我的父亲还在世，家景也好，我正是一个少爷。那一年，我家是一件大祭祀的值年。这祭祀，说是三十多年才能轮到一回，所以很郑重。正（zhēng）月里供像，供品很多，祭器很讲究，拜的人也很多，祭器也很要防偷去。我家只有一个忙月（我们这里给人做工的分三种：整年给一定人家做工的叫长年;按日给人做工的叫短工；自己也种地，只在过年过节以及收租时候来给一定的人家做工的称忙月），忙不过来，他便对父亲说，可以叫他的儿子闰土来管祭器的。
    </p>
    <p>
      我的父亲允许了；我也很高兴，因为我早听到闰土这名字，而且知道他和我仿佛年纪，闰月生的，五行（xíng）缺土，所以他的父亲叫他闰土。他是能装弶（jiàng）捉小鸟雀的。
    </p>
    <p>
      我于是日日盼望新年，新年到，闰土也就到了。好容易到了年末，有一日，母亲告诉我，闰土来了，我便飞跑地去看。他正在厨房里，紫色的圆脸，头戴一顶小毡（zhān）帽，颈（jǐng）上套一个明晃晃的银项圈（quān），这可见他的父亲十分爱他，怕他死去，所以在神佛面前许下愿心，用圈子将他套住了。他见人很怕羞，只是不怕我，没有旁人的时候，便和我说话，于是不到半日，我们便熟识了。
    </p>
  </template>
  <a-button>长文本</a-button>
</das-popover>
<das-popover theme="dark" title="dark" content="dark content" placement="top" trigger="click" :closeable="true">
  <a-button>暗色</a-button>
</das-popover>
</template>

<script lang="ts" setup>
const handleConfirm = () => {
  console.log('确认操作');
};

const handleCancel = () => {
  console.log('取消操作');
};
</script>
```
:::

## API

### 属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | string | - |
| content | 显示的内容 | string | - |
| placement | 弹出位置，可选值：`top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`、`right`、`right-start`、`right-end` | string | top |
| closeable | 是否显示关闭按钮 | boolean | false |
| trigger | 触发方式，可选值：`hover`、`click` | string | hover |
| theme | 主题，可选值：`light`、`dark` | string | light |
| modelValue | 用于控制气泡显示状态的双向绑定值 | boolean | false |
| autoClose | 点击外部是否自动关闭 | boolean | true |
| confirm | 是否显示确认框 | boolean | false |
| okText | 确认按钮文字 | string | 确定 |
| cancelText | 取消按钮文字 | string | 取消 |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 触发器内容 |
| title | 自定义标题 |
| content | 自定义内容 |
| icon | 自定义图标 |

### 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 气泡显示状态改变时触发 | (value: boolean) |
| visibleChange | 气泡显示状态改变时触发 | (value: boolean) |
| confirm | 点击确认按钮时触发 | (value: boolean) |
| cancel | 点击取消按钮时触发 | - |