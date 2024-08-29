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
        return ['#F53C3C', '#FF7F29', '#FFB005', '#7E8494'];
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
  const formatColor = (hexColors: any[]) => {
    const rgbColor = hexColors.map((hexColor) => {
      const red = parseInt(hexColor.slice(1, 3), 16);
      const green = parseInt(hexColor.slice(3, 5), 16);
      const blue = parseInt(hexColor.slice(5, 7), 16);
      return `rgba(${red},${green},${blue}, 0.1)`;
    });
    return rgbColor;
  };

  const pieOption = ref({
    color: color.value,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 56,
      top: 36,
      itemWidth: 10,
      itemHeight: 6,
      itemGap: 12,
      borderRadius: 6,
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
        data: props.data
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
            show: false,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          normal: {
            color: (list: any) => {
              const colorList = formatColor(color.value);
              return colorList[list.dataIndex];
            }
          }
        },
        data: props.data
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
