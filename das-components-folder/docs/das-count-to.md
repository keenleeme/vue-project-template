<ComponentInfo developer="刘广庆" date="2025-02-27" />

# das-count-to 数字滚动器

## 组件说明

一个轻量级的数字滚动展示组件，用于在页面中以动画的形式展示数字的变化过程，可精确小数点位数，配置执行时间和分隔符。

## 何时使用

数字滚动器组件在以下场景中特别适用：

- **数据大屏展示**：通过数字的动态滚动效果，增强数据可视化的动感吸引力
- **电商销售数据**：展示实时销售额、订单量等关键指标的变化过程
- **金融数据监控**：股票价格、汇率等金融数据的实时更新展示
- **系统监控面板**：服务器性能指标、业务指标等数据的动态变化展示
- **营销活动数据**：展示活动参与人数、销售额等数据的累计过程



## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果 


:::demo
```vue

<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-count-to 
      :end="config.count" 
      :duration="config.duration"
      :decimal="config.decimal"
      :size="config.size"
      :weight="config.weight"
      :separator="config.separator"
      :suffix="config.suffix"
      :unit-size="config.unitSize"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/count-to/mock/config';
</script>
```
:::

## das-count-to-01 基础用法
end：结束数字，start：开始数字默认为0，duration：执行周期
:::demo
```vue
<template>
  <das-count-to :end="200000000.12" :size="40" />
</template>
```
:::



## das-count-to-02 单位配置
prefix和suffix支持文字配置和插槽配置
:::demo
```vue
<template>
  <das-count-to :end="2048" suffix="GB" :size="40"  separator="," />
</template>
```
:::


## das-count-to-03 执行周期
duration单位为毫秒
:::demo
```vue
<template>
  <das-count-to :end="2048" :duration="4000" :weight="600" suffix="GB" :size="40" :unit-size="16"  separator="," />
</template>
```
:::
## das-count-to-04 精确小数点
decimal：可通过配置小数点精度，默认为0
:::demo
```vue
<template>
  <das-count-to :end="2048.23" :decimal="2" suffix="GB" :size="40" :unit-size="16"  separator="," />
</template>
```
:::


## API

### das-count-to

| 参数    | 说明 | 类型   | 可选值 | 默认值 |
| ------- | ---- | ------ | ------ | ------ |
| start | 开始数字   | `number` | -      | 0      |
| end | 结束数字   | `number`<sup style="color: red;">[必传]</sup> | -      |       |
| duration | 持续时间   | `number`<sup style="color: red;">[毫秒]</sup> | -      | 2000      |
| separator | 分割符号   | `string` | -      | ,      |
| decimal | 精确小数   | `number` | -      | 0      |
| size | 字体大小   | `number` | -      | 16      |
| weight | 字体粗细   | `number` | -      | 400      |
| prefix | 前缀   | `string \| slot` | -      |       |
| suffix | 后缀   | `string \| slot` | -      |       |
| unitSize | 单位字体大小   | `number` | -      | 16      |
