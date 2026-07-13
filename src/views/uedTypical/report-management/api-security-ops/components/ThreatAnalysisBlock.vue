<template>
  <div class="threat-block">
    <div class="threat-block__title">{{ data.title }}</div>
    <a-row :gutter="12">
      <a-col :span="7">
        <div class="chart-card">
          <div class="chart-card__label">{{ data.title }}分布</div>
          <div :ref="setDistRef" class="chart-box chart-box--sm"></div>
        </div>
      </a-col>
      <a-col :span="10">
        <div class="chart-card">
          <div class="chart-card__label">{{ data.title }}新增趋势</div>
          <div :ref="setTrendRef" class="chart-box chart-box--sm"></div>
        </div>
      </a-col>
      <a-col :span="7">
        <div class="chart-card chart-card--table">
          <div class="chart-card__label">{{ topTitle }}</div>
          <a-table
            :columns="data.topColumns"
            :data-source="data.topRows"
            :pagination="false"
            row-key="key"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'riskDist'">
                <RiskLevelBar :dist="record.riskDist" show-total />
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
  import RiskLevelBar from '../../components/RiskLevelBar.vue';
  import type { ThreatBlockData } from '../mock';

  const props = defineProps<{
    data: ThreatBlockData;
  }>();

  let distChart: ECharts | null = null;
  let trendChart: ECharts | null = null;
  let distEl: HTMLElement | null = null;
  let trendEl: HTMLElement | null = null;

  const topTitle = computed(() => {
    if (props.data.key === 'defect') return '缺陷 API TOP 5';
    if (props.data.key === 'attack') return '高危 IP TOP 5';
    return '风险主体 TOP 5';
  });

  function setDistRef(el: Element | null) {
    distEl = el as HTMLElement | null;
  }

  function setTrendRef(el: Element | null) {
    trendEl = el as HTMLElement | null;
  }

  function buildDistOption(): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['42%', '68%'],
          center: ['50%', '44%'],
          data: props.data.distribution,
          label: { formatter: '{b}\n{d}%' }
        }
      ]
    };
  }

  function formatRiskDot(color: string, label: string, value: number) {
    return `<span style="display:flex;align-items:center;gap:6px;margin-top:4px">
      <i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></i>
      <span>${label}</span>
      <strong style="margin-left:auto">${value}</strong>
    </span>`;
  }

  function formatTrendTooltip(params: unknown): string {
    const items = params as { axisValue: string; dataIndex: number; value: number }[];
    const item = items[0];
    if (!item) return '';

    const dist = props.data.trend.riskDists[item.dataIndex];
    const lines = [
      `<div style="font-weight:600;margin-bottom:6px">${item.axisValue}</div>`,
      `<div style="margin-bottom:8px">${props.data.title}新增：<strong>${item.value}</strong></div>`
    ];

    if (dist) {
      lines.push(
        formatRiskDot('#f5222d', '高危', dist.high),
        formatRiskDot('#fa8c16', '中危', dist.medium),
        formatRiskDot('#52c41a', '低危', dist.low)
      );
    }

    return lines.join('');
  }

  function buildTrendOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: formatTrendTooltip
      },
      grid: { left: 42, right: 12, top: 20, bottom: 28 },
      xAxis: { type: 'category', boundaryGap: false, data: props.data.trend.dates },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(22, 119, 255, 0.15)' },
          data: props.data.trend.values,
          itemStyle: { color: '#1677ff' }
        }
      ]
    };
  }

  function renderCharts() {
    if (distEl) {
      distChart?.dispose();
      distChart = echarts.init(distEl);
      distChart.setOption(buildDistOption());
    }
    if (trendEl) {
      trendChart?.dispose();
      trendChart = echarts.init(trendEl);
      trendChart.setOption(buildTrendOption());
    }
  }

  function resizeCharts() {
    distChart?.resize();
    trendChart?.resize();
  }

  onMounted(() => {
    renderCharts();
    window.addEventListener('resize', resizeCharts);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts);
    distChart?.dispose();
    trendChart?.dispose();
  });

  watch(
    () => props.data,
    () => renderCharts(),
    { deep: true }
  );

  defineExpose({ resizeCharts });
</script>

<style lang="less" scoped>
  .threat-block {
    margin-bottom: 16px;
  }

  .threat-block__title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .chart-card {
    height: 100%;
    padding: 12px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;

    &--table {
      min-height: 260px;
    }
  }

  .chart-card__label {
    margin-bottom: 6px;
    font-size: 13px;
    color: #5c6b8a;
  }

  .chart-box {
    height: 220px;

    &--sm {
      height: 210px;
    }
  }
</style>
