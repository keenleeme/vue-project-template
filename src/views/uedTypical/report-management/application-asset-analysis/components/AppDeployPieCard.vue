<template>
  <div ref="chartRef" class="deploy-pie-chart"></div>
</template>

<script setup lang="ts">
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import type { ChartSlice } from '../types';

  const props = defineProps<{
    slices: ChartSlice[];
  }>();

  const deployColors: Record<string, string> = {
    互联网: '#13c2c2',
    内网: '#2f54eb',
    杭州办: '#eb2f96'
  };

  const chartRef = ref<HTMLElement>();
  let chart: ECharts | null = null;

  function buildOption(): EChartsOption {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
      color: props.slices.map((item) => deployColors[item.name] || '#bfbfbf'),
      series: [
        {
          type: 'pie',
          radius: ['38%', '62%'],
          center: ['50%', '44%'],
          label: { show: false },
          data: props.slices
        }
      ]
    };
  }

  function renderChart() {
    if (!chartRef.value) return;
    if (!chart) {
      chart = echarts.init(chartRef.value);
    }
    chart.setOption(buildOption(), true);
  }

  function resizeChart() {
    chart?.resize();
  }

  onMounted(() => {
    renderChart();
    window.addEventListener('resize', resizeChart);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    chart?.dispose();
    chart = null;
  });

  watch(
    () => props.slices,
    () => renderChart(),
    { deep: true }
  );

  defineExpose({ resizeChart });
</script>

<style lang="less" scoped>
  .deploy-pie-chart {
    height: 220px;
  }
</style>
