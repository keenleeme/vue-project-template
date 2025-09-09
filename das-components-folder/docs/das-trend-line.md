# das-trend-line 趋势线条

## 组件说明
一种用于可视化数据趋势的统计图表组件。该组件基于D3.js实现，能够高效渲染数据曲线，支持自定义线条样式、颜色和粗细。主要用于展示数据随时间或其他维度的变化趋势，帮助用户快速识别数据模式和异常点。

## 何时使用
- 需要展示数据随时间变化的趋势时
- 需要比较多个数据序列的变化模式时
- 需要突出显示数据中的峰值、谷值或异常点时
- 需要以简洁直观的方式呈现统计数据变化时

## 基础用法
线条粗细、颜色可配置

## 基础用法
线条粗细、颜色可配置
:::demo
```vue
<template>
  <das-trend-line :data="list" :thick="0.5" color="rgb(255, 85, 0)" />
</template>

<script setup>
  import { ref } from 'vue';
  const list = ref([1, 1, 2, 2, 3, 1, 1, 1]);
</script>
```
:::

:::demo
```vue
<template>
  <das-trend-line :data="list" color="#63BB7E" />
</template>

<script setup>
  import { ref } from 'vue';

  const list = ref([]);
  list.value = Array.from({ length: 9 }, (e, i) => i + 1)
</script>
```
:::



## API

| 参数    | 说明 | 类型   | 可选值 | 默认值 |
| ------- | ---- | ------ | ------ | ------ |
| data | 数据   | `array` | -      | []      |
| thick | 线粗   | `number`<sup style="color: red;">[非像素单位]</sup> | -      | 1      |
| width | 宽度   | `number` | -      | 300      |
| height | 高度  | `number` | -      | 100      |
| color | 线条颜色   | `string` | -      | #63BB7E      |

