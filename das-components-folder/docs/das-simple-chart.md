# das-simple-chart 简单图表

## 组件说明

一个基于ECharts 的轻量级图表组件。它提供了常见图表类型的快速集成，包括折线图、柱状图、饼图等基础可视化功能。组件支持响应式调整、自定义配置选项和动态数据更新，适用于需要快速实现数据可视化的场景。

## 何时使用

- 当需要快速展示简单数据可视化时
- 项目需要轻量级图表解决方案时
- 需要集成常见图表类型但不想引入完整ECharts包时
- 需要响应式调整图表大小的场景

## 折线图
:::demo
```vue
<template>  
  <das-simple-chart :needResize="true" :option="lineChartOption" width="100%" height="300px" />
</template>  
  
<script setup lang="ts">  
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';  

  
interface ChartOption {  
  xAxis: {  
    type: string;  
    data: string[];  
  };
}
    
interface ChartOption {  
  xAxis: {  
    type: string;  
    data: string[];  
  };  
  yAxis: {  
    type: string;  
  };  
  series: {  
    data: number[];  
    type: string;  
    smooth?: boolean;  
  }[];  
}  
  
// 初始化图表选项  
const lineChartOption = ref<ChartOption>({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {  
    type: 'category',  
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']  
  },  
  yAxis: {  
    type: 'value'  
  },  
  series: [  
    {  
      data: [820, 932, 901, 934, 1290, 1330, 1320],  
      type: 'line',  
      smooth: true  
    }  
  ]  
});  
  
// 如果 onMounted 有其他用途，请在这里添加代码  
onMounted(() => {  
  // 可以在这里执行任何需要在组件挂载后执行的代码  
});  
</script>

<style scoped lang="less"></style>

```
:::


## 柱状图
:::demo
```vue
<template>  
  <das-simple-chart :needResize="true" :option="barChartOption" width="100%" height="300px" />  
</template>  
  
<script setup lang="ts">  
import { ref, onMounted } from 'vue';  
import * as echarts from 'echarts';  
  
// 更具体的类型定义，如果可能的话，进一步细化 xAxis 和 yAxis 的结构  
interface ChartOption {  
  xAxis: {  
    type: string;  
    data: string[];  
  };  
  yAxis: {  
    type: string;  
  };  
  series: {  
    data: number[];  
    type: string;  
    smooth?: boolean;  
  }[];  
}  
  
// 初始化图表选项  
const barChartOption = ref<ChartOption>({
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
});
  
// 如果 onMounted 有其他用途，请在这里添加代码  
onMounted(() => {  
  // 可以在这里执行任何需要在组件挂载后执行的代码  
});  
</script>

<style scoped lang="less"></style>

```
:::


## 饼状图
:::demo
```vue
<template>  
  <das-simple-chart :needResize="true" :option="pieChartOption" width="100%" height="300px" />  
</template>  
  
<script setup lang="ts">  
import { ref, onMounted } from 'vue';  
import * as echarts from 'echarts';  
  
// 更具体的类型定义，如果可能的话，进一步细化 xAxis 和 yAxis 的结构  
interface ChartOption {  
  xAxis: {  
    type: string;  
    data: string[];  
  };  
  yAxis: {  
    type: string;  
  };  
  series: {  
    data: number[];  
    type: string;  
    smooth?: boolean;  
  }[];  
}  
  
// 初始化图表选项  
const pieChartOption = ref<ChartOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
});
  
// 如果 onMounted 有其他用途，请在这里添加代码  
onMounted(() => {  
  // 可以在这里执行任何需要在组件挂载后执行的代码  
});  
</script>

<style scoped lang="less"></style>

```
:::

## API

### das-simple-chart

| 参数    | 说明 | 类型   | 可选值 | 默认值 |
| ------- | ---- | ------ | ------ | ------ |
| option | 图表配置项   | `object` | -      | {}      |
| needResize | 是否需要自适应   | `Boolean` | -      |   true    |
| width | 图表宽度   | `string` | -      | 100%   |
| height | 图表高度   | `string` | -      | 100%      |
