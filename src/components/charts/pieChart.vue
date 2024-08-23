<template>
  <ECharts :option="pieOption" :auto-resize="true" :style="{ width: props.width, height: props.height }" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ECharts from 'vue-echarts';
  import { PieChart } from 'echarts/charts';
  import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';

  use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

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
        return [];
      }
    },
    darkColor: {
      type: Array,
      default: () => {
        return [];
      }
    }
  });
  const color = ref([
    '#3B71EE',
    '#62D592',
    '#FF9B4F',
    '#32cd32',
    '#6495ed',
    '#ff69b4',
    '#ba55d3',
    '#cd5c5c',
    '#ffa500',
    '#48e0de',
    '#1e9off'
  ]);
  const pieOption = ref({
    color,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 56,
      top: 36,
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 12,
      formatter(name: any) {
        return name;
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['66%', '74%'],
        center: ['30%', '50%'],
        avoidLabeloverlap: false,
        padAngle: 5,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        data: [
          {
            name: '高危',
            value: 0
          },
          {
            name: '中危',
            value: 0
          },
          {
            name: '低微',
            value: 0
          }
        ]
      },
      {
        name: '',
        type: 'pie',
        radius: ['56%', '64%'],
        center: ['30%', '50%'],
        avoidLabeloverlap: false,
        hasAnimation: false,
        padAngle: 5,
        tooltip: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          normal: {
            color: (list: any) => {
              const colorList = ['rgba(59,113,238,0.1)', 'rgba(98,213,146,0.1)', 'rgba(255,155,79,0.1)'];
              return colorList[list.dataIndex];
            }
          }
        },
        data: [
          {
            name: '高危',
            value: 0
          },
          {
            name: '中危',
            value: 0
          },
          {
            name: '低微',
            value: 0
          }
        ]
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
