<template>
  <ECharts :option="pieOption" :auto-resize="true" :style="{ width: props.width, height: props.height }" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ECharts from 'vue-echarts';
  import { LineChart } from 'echarts/charts';
  import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';

  use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    themeColor: {
      type: Array,
      default: () => {
        return ['#3B71EE', '#62D592', '#FF9B4F', '#32cd32'];
      }
    },
    darkColor: {
      type: Array,
      default: () => {
        return [];
      }
    }
  });
  const color = ref<any[]>(props.themeColor);
  const pieOption = ref({
    color: color.value,
    grid: {
      top: '6%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(19,75,234,0.15)' // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(19,75,234,0)' // 0% 处的颜色
              }
            ]
          }
        }
      }
    ]
  });
</script>

<style lang="less" scoped>
  .charts-wrap {
    display: flex;
    align-items: center;
    margin: 16px;
    background: var(--primary-bg);
    .left {
      flex: 1;
      margin-right: 16px;
    }
    .right {
      flex: 1;
    }
  }
</style>
