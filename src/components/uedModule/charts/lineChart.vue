<template>
  <ECharts :option="lineOption" :auto-resize="true" :style="{ width: props.width, height: props.height }" />
</template>

<script setup lang="ts">
  import { ref, watchEffect, watch } from 'vue';
  import ECharts from 'vue-echarts';
  import { LineChart } from 'echarts/charts';
  import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';

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
        return ['#134BEA', '#FF7F29', '#FFB005', '#7E8494'];
      }
    },
    darkColor: {
      type: Array,
      default: () => {
        return ['#1DB969', '#FF7F29', '#6A7285', '#F53C3C'];
      }
    }
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  const color = ref<any[]>(props.themeColor);
  const formatColor = (hexColors: any[]) => {
    const rgbColor = hexColors.map((hexColor) => {
      const red = parseInt(hexColor.slice(1, 3), 16);
      const green = parseInt(hexColor.slice(3, 5), 16);
      const blue = parseInt(hexColor.slice(5, 7), 16);
      return [
        {
          offset: 0,
          color: `rgba(${red},${green},${blue}, 0.1)` // 0% 处的颜色
        },
        {
          offset: 1,
          color: `rgba(${red},${green},${blue}, 0)` // 0% 处的颜色
        }
      ];
    });
    return rgbColor;
  };
  const gradientColor = ref<any[]>(formatColor(color.value));
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  const lineOption = ref({
    color: color.value,
    grid: {
      top: '6%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      splitLine: {
        lineStyle: {
          color: config.value.mode === 'dark' ? '#32394A' : '#E9EAF0',
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: {
          color: config.value.mode === 'dark' ? '#32394A' : '#E9EAF0'
        }
      },
      axisLabel: {
        color: config.value.mode === 'dark' ? '#ffffff' : '#1E2435'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: config.value.mode === 'dark' ? '#32394A' : '#E9EAF0',
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: {
          color: config.value.mode === 'dark' ? '#ffffff' : '#1E2435'
        }
      }
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
            colorStops: gradientColor.value[0]
          }
        }
      }
    ]
  });
  watch(
    () => config.value.mode,
    (val) => {
      color.value = val === 'dark' ? props.darkColor : props.themeColor;
      gradientColor.value = formatColor(color.value);
      lineOption.value.series[0].areaStyle.color = {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: gradientColor.value[0]
      };
      lineOption.value.color = color.value;
      lineOption.value.xAxis.axisLine = {
        lineStyle: {
          color: val === 'dark' ? '#32394A' : '#E9EAF0'
        }
      };
      lineOption.value.xAxis.axisLabel = {
        color: val === 'dark' ? '#ffffff' : '#1E2435'
      };
      lineOption.value.yAxis.axisLine = {
        lineStyle: {
          color: val === 'dark' ? '#ffffff' : '#1E2435'
        }
      };
      lineOption.value.yAxis.splitLine = {
        lineStyle: {
          color: val === 'dark' ? '#32394A' : '#E9EAF0',
          type: 'dashed'
        }
      };
    }
  );
</script>

<style lang="less" scoped>
  .charts-wrap {
    display: flex;
    align-items: center;
    margin: 16px;
    background: var(--color-bg-container);
    .left {
      flex: 1;
      margin-right: 16px;
    }
    .right {
      flex: 1;
    }
  }
</style>
