<template>
  <div class="overview-dashboard-container">
    <a-card :body-style="{ padding: '16px' }" style="height: 100%">
      <div class="overview-layout">
        <section class="panel panel--summary">
          <div class="panel__title">数据总览</div>
          <div class="summary-grid">
            <div
              v-for="item in summaryMetrics"
              :key="item.key"
              class="summary-card"
              :class="`summary-card--${item.tone}`"
            >
              <div class="summary-card__icon">
                <AppstoreOutlined v-if="item.icon === 'app'" />
                <ShareAltOutlined v-else-if="item.icon === 'api'" />
                <UserOutlined v-else-if="item.icon === 'account'" />
                <FolderOutlined v-else />
              </div>
              <div class="summary-card__value">{{ formatNumber(item.value) }}</div>
              <div class="summary-card__label">{{ item.label }}</div>
            </div>
          </div>
        </section>

        <section class="panel panel--lifecycle">
          <div class="panel__title">生命周期分布</div>
          <div class="lifecycle-board">
            <div class="lifecycle-track lifecycle-track--top">
              <div class="lifecycle-node lifecycle-node--new">
                <span class="lifecycle-node__label">{{ lifecycleStages[0].label }}</span>
                <span class="lifecycle-node__value">{{ formatNumber(lifecycleStages[0].value) }}</span>
                <div class="lifecycle-node__bar">
                  <i :style="{ width: lifecycleBarWidth(lifecycleStages[0].value) }" />
                </div>
              </div>
              <div class="lifecycle-node lifecycle-node--active">
                <span class="lifecycle-node__label">{{ lifecycleStages[1].label }}</span>
                <span class="lifecycle-node__value">{{ formatNumber(lifecycleStages[1].value) }}</span>
              </div>
            </div>

            <div class="lifecycle-switch">
              <a-segmented
                v-model:value="lifecycleScope"
                :options="lifecycleScopeOptions"
                size="small"
              />
            </div>

            <div class="lifecycle-track lifecycle-track--bottom">
              <div class="lifecycle-node lifecycle-node--revive">
                <span class="lifecycle-node__label">{{ lifecycleStages[2].label }}</span>
                <span class="lifecycle-node__value">{{ formatNumber(lifecycleStages[2].value) }}</span>
              </div>
              <div class="lifecycle-node lifecycle-node--offline">
                <span class="lifecycle-node__label">{{ lifecycleStages[3].label }}</span>
                <span class="lifecycle-node__value">{{ formatNumber(lifecycleStages[3].value) }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="panel panel--risk">
          <div class="panel__head">
            <div class="panel__title panel__title--inline">现存风险分布</div>
            <a-radio-group v-model:value="riskTab" size="small">
              <a-radio-button value="fragility">脆弱性风险</a-radio-button>
              <a-radio-button value="behavior">行为风险</a-radio-button>
            </a-radio-group>
          </div>
          <div class="risk-panel">
            <div class="risk-panel__chart">
              <div class="risk-stack">
                <div
                  v-for="item in currentRiskItems"
                  :key="item.name"
                  class="risk-stack__segment"
                  :style="{ flex: item.value, background: item.color }"
                  :title="`${item.name} ${item.value}`"
                />
              </div>
            </div>
            <div class="risk-panel__list">
              <div v-for="item in currentRiskItems" :key="item.name" class="risk-rank-row">
                <i class="risk-rank-row__dot" :style="{ background: item.color }" />
                <span class="risk-rank-row__name" :title="item.name">{{ item.name }}</span>
                <span class="risk-rank-row__value">{{ formatNumber(item.value) }}</span>
              </div>
            </div>
          </div>
          <div class="risk-pagination">
            <a-button type="text" size="small" :disabled="riskPage <= 1" @click="riskPage -= 1">
              <UpOutlined />
            </a-button>
            <span>{{ riskPage }}/{{ riskTotalPages }}</span>
            <a-button
              type="text"
              size="small"
              :disabled="riskPage >= riskTotalPages"
              @click="riskPage += 1"
            >
              <DownOutlined />
            </a-button>
          </div>
        </section>

        <section class="panel panel--charts">
          <div class="chart-block">
            <div class="panel__title">新增风险趋势</div>
            <div ref="riskTrendRef" class="chart-box chart-box--trend" />
          </div>
          <div class="chart-block">
            <div class="panel__title">API敏感数据分布</div>
            <div ref="sensitiveDataRef" class="chart-box chart-box--bar" />
          </div>
        </section>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import {
    AppstoreOutlined,
    DownOutlined,
    FolderOutlined,
    ShareAltOutlined,
    UpOutlined,
    UserOutlined
  } from '@ant-design/icons-vue';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import {
    getRiskPages,
    lifecycleByScope,
    riskTrend,
    sensitiveData,
    summaryMetrics
  } from './mock';
  import type { LifecycleScope, RiskTabKey } from './types';

  const lifecycleScope = ref<LifecycleScope>('api');
  const riskTab = ref<RiskTabKey>('fragility');
  const riskPage = ref(1);

  const lifecycleScopeOptions = [
    { label: '应用生命周期', value: 'app' },
    { label: 'API生命周期', value: 'api' }
  ];

  const lifecycleStages = computed(() => lifecycleByScope[lifecycleScope.value]);
  const riskTotalPages = computed(() => getRiskPages(riskTab.value).length);
  const currentRiskItems = computed(() => getRiskPages(riskTab.value)[riskPage.value - 1] || []);

  const riskTrendRef = ref<HTMLElement>();
  const sensitiveDataRef = ref<HTMLElement>();
  let riskTrendChart: ECharts | null = null;
  let sensitiveDataChart: ECharts | null = null;

  function formatNumber(value: number) {
    return value.toLocaleString('zh-CN');
  }

  function lifecycleBarWidth(value: number) {
    const max = Math.max(...lifecycleStages.value.map((item) => item.value), 1);
    return `${Math.max((value / max) * 100, value > 0 ? 8 : 0)}%`;
  }

  watch(riskTab, () => {
    riskPage.value = 1;
  });

  function buildRiskTrendOption(): EChartsOption {
    return {
      color: ['#F6BD16', '#F5222D'],
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['脆弱性风险', '行为风险'],
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: 48, right: 16, top: 36, bottom: 28 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: riskTrend.dates,
        axisLine: { lineStyle: { color: '#d9e2ef' } },
        axisLabel: { color: '#8c9ab3' }
      },
      yAxis: {
        type: 'value',
        name: '单位: 个',
        max: 2100,
        splitLine: { lineStyle: { color: '#eef1f6' } },
        axisLabel: { color: '#8c9ab3' }
      },
      series: [
        {
          name: '脆弱性风险',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: riskTrend.fragility
        },
        {
          name: '行为风险',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: riskTrend.behavior
        }
      ]
    };
  }

  function buildSensitiveDataOption(): EChartsOption {
    return {
      color: ['#5B8FF9', '#61DDAA'],
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['请求', '返回'],
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: 56, right: 16, top: 36, bottom: 28 },
      xAxis: {
        type: 'category',
        data: sensitiveData.map((item) => item.name),
        axisLine: { lineStyle: { color: '#d9e2ef' } },
        axisLabel: { color: '#8c9ab3' }
      },
      yAxis: {
        type: 'log',
        logBase: 10,
        min: 1,
        max: 10000,
        splitLine: { lineStyle: { color: '#eef1f6' } },
        axisLabel: { color: '#8c9ab3' }
      },
      series: [
        {
          name: '请求',
          type: 'bar',
          barMaxWidth: 18,
          data: sensitiveData.map((item) => item.request)
        },
        {
          name: '返回',
          type: 'bar',
          barMaxWidth: 18,
          data: sensitiveData.map((item) => item.response)
        }
      ]
    };
  }

  function renderCharts() {
    if (riskTrendRef.value) {
      if (!riskTrendChart) riskTrendChart = echarts.init(riskTrendRef.value);
      riskTrendChart.setOption(buildRiskTrendOption(), true);
    }
    if (sensitiveDataRef.value) {
      if (!sensitiveDataChart) sensitiveDataChart = echarts.init(sensitiveDataRef.value);
      sensitiveDataChart.setOption(buildSensitiveDataOption(), true);
    }
  }

  function handleResize() {
    riskTrendChart?.resize();
    sensitiveDataChart?.resize();
  }

  onMounted(() => {
    renderCharts();
    window.addEventListener('resize', handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    riskTrendChart?.dispose();
    sensitiveDataChart?.dispose();
    riskTrendChart = null;
    sensitiveDataChart = null;
  });
</script>

<style lang="less" scoped>
  .overview-dashboard-container {
    padding: 20px;
    height: 100%;
    background: #f5f7fb;
  }

  .overview-layout {
    display: grid;
    grid-template-columns: minmax(300px, 34%) minmax(0, 1fr);
    grid-template-rows: auto minmax(420px, 1fr);
    gap: 12px;
    min-height: calc(100vh - 120px);
  }

  .panel {
    padding: 14px 16px 16px;
    border: 1px solid #eef1f6;
    border-radius: 10px;
    background: #fff;

    &__title {
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #1f2a44;

      &--inline {
        margin-bottom: 0;
      }
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }
  }

  .panel--summary {
    grid-column: 1;
    grid-row: 1;
  }

  .panel--lifecycle {
    grid-column: 2;
    grid-row: 1;
  }

  .panel--risk {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .panel--charts {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .summary-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 108px;
    border-radius: 10px;
    text-align: center;

    &--blue {
      background: #edf5ff;
      color: #1677ff;
    }

    &--orange {
      background: #fff7e6;
      color: #fa8c16;
    }

    &--green {
      background: #f6ffed;
      color: #52c41a;
    }

    &--purple {
      background: #f9f0ff;
      color: #722ed1;
    }

    &__icon {
      font-size: 22px;
      line-height: 1;
    }

    &__value {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.1;
      color: #1f2a44;
    }

    &__label {
      font-size: 13px;
      color: #4a5874;
    }
  }

  .lifecycle-board {
    position: relative;
    min-height: 220px;
    padding: 18px 20px;
    border-radius: 999px;
    background: linear-gradient(180deg, #fafbfd 0%, #f3f7fc 100%);
    border: 1px solid #e8edf5;
  }

  .lifecycle-track {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    &--top {
      margin-bottom: 18px;
    }

    &--bottom {
      margin-top: 18px;
    }
  }

  .lifecycle-switch {
    display: flex;
    justify-content: center;
  }

  .lifecycle-node {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    &__label {
      font-size: 12px;
      color: #8c9ab3;
    }

    &__value {
      font-size: 24px;
      font-weight: 600;
      color: #1f2a44;
      line-height: 1.2;
    }

    &__bar {
      width: 100%;
      max-width: 220px;
      height: 8px;
      border-radius: 999px;
      background: #e8edf5;
      overflow: hidden;

      i {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #52c41a 0%, #1677ff 100%);
      }
    }

    &--active .lifecycle-node__value,
    &--revive .lifecycle-node__value,
    &--offline .lifecycle-node__value {
      font-size: 20px;
    }
  }

  .risk-panel {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 16px;
    flex: 1;
    min-height: 0;
  }

  .risk-stack {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 320px;
    border-radius: 8px;
    overflow: hidden;
    background: #f5f7fb;

    &__segment {
      min-height: 8px;
    }
  }

  .risk-panel__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow: auto;
  }

  .risk-rank-row {
    display: grid;
    grid-template-columns: 10px minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    font-size: 12px;

    &__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    &__name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #4a5874;
    }

    &__value {
      font-weight: 600;
      color: #1f2a44;
    }
  }

  .risk-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    font-size: 12px;
    color: #8c9ab3;
  }

  .chart-block {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }

  .chart-box {
    flex: 1;
    min-height: 180px;

    &--trend {
      min-height: 210px;
    }

    &--bar {
      min-height: 210px;
    }
  }

  @media (max-width: 1280px) {
    .overview-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    .panel--summary,
    .panel--lifecycle,
    .panel--risk,
    .panel--charts {
      grid-column: 1;
      grid-row: auto;
    }
  }
</style>
