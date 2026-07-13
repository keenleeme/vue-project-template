<template>
  <div class="api-ops-report">
    <a-card :body-style="{ padding: '20px 24px 24px' }" style="height: 100%">
      <div class="report-toolbar">
        <div class="report-toolbar__left">
          <a-button type="link" class="back-btn" @click="router.push('/report-management')">
            <template #icon><ArrowLeftOutlined /></template>
            返回报告管理
          </a-button>
          <h1 class="report-title">API 数据安全运营报表</h1>
        </div>
        <div class="report-toolbar__right">
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            :placeholder="['选择日期范围', '选择日期范围']"
            @change="handleRefresh"
          />
          <a-button type="primary" @click="handleGenerate">生成报表</a-button>
        </div>
      </div>

      <section class="report-section">
        <h2 class="section-title">综合概述</h2>
        <div class="overview-grid">
          <OverviewMetricCard v-for="card in overviewAssetCards" :key="card.key" :card="card" />
          <OverviewMetricCard v-for="card in overviewRiskCards" :key="card.key" :card="card" />
        </div>
      </section>

      <section class="report-section">
        <h2 class="section-title">周期内访问分析</h2>
        <a-row :gutter="16">
          <a-col :span="14">
            <div class="chart-card">
              <div class="chart-card__label">API 访问趋势</div>
              <div ref="accessTrendRef" class="chart-box chart-box--lg"></div>
            </div>
          </a-col>
          <a-col :span="10">
            <div class="chart-card">
              <div class="chart-card__head">
                <div class="chart-card__label">访问数据分布</div>
                <a-radio-group v-model:value="categoryTab" size="small" @change="renderTreemap">
                  <a-radio-button value="all">全部</a-radio-button>
                  <a-radio-button value="sensitive">个人敏感信息</a-radio-button>
                </a-radio-group>
              </div>
              <div ref="treemapRef" class="chart-box chart-box--lg"></div>
            </div>
          </a-col>
        </a-row>
      </section>

      <section class="report-section">
        <h2 class="section-title">周期内威胁分析</h2>
        <ThreatAnalysisBlock v-for="block in threatBlocks" :key="block.key" :data="block" />
      </section>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import OverviewMetricCard from './components/OverviewMetricCard.vue';
  import ThreatAnalysisBlock from './components/ThreatAnalysisBlock.vue';
  import {
    accessCategoryAll,
    accessCategorySensitive,
    accessTrend,
    overviewAssetCards,
    overviewRiskCards,
    threatBlocks
  } from './mock';

  const router = useRouter();
  const dateRange = ref<[Dayjs, Dayjs]>([dayjs('2026-06-01'), dayjs('2026-06-22')]);
  const categoryTab = ref<'all' | 'sensitive'>('all');

  const accessTrendRef = ref<HTMLElement>();
  const treemapRef = ref<HTMLElement>();

  let accessTrendChart: ECharts | null = null;
  let treemapChart: ECharts | null = null;

  function buildAccessTrendOption(): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 16, top: 24, bottom: 32 },
      xAxis: { type: 'category', boundaryGap: false, data: accessTrend.dates },
      yAxis: { type: 'value', max: 25000 },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(22, 119, 255, 0.35)' },
              { offset: 1, color: 'rgba(22, 119, 255, 0.02)' }
            ])
          },
          data: accessTrend.values,
          itemStyle: { color: '#1677ff' }
        }
      ]
    };
  }

  function buildTreemapOption(): EChartsOption {
    const data = categoryTab.value === 'all' ? accessCategoryAll : accessCategorySensitive;
    return {
      tooltip: { formatter: '{b}: {c}' },
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: { show: true, formatter: '{b}' },
          itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 },
          data
        }
      ]
    };
  }

  function initMainCharts() {
    if (accessTrendRef.value) {
      accessTrendChart = echarts.init(accessTrendRef.value);
      accessTrendChart.setOption(buildAccessTrendOption());
    }
    renderTreemap();
  }

  function renderTreemap() {
    if (!treemapRef.value) return;
    if (!treemapChart) treemapChart = echarts.init(treemapRef.value);
    treemapChart.setOption(buildTreemapOption(), true);
  }

  function resizeAllCharts() {
    accessTrendChart?.resize();
    treemapChart?.resize();
  }

  function handleRefresh() {
    message.success('报表数据已按所选日期范围刷新（演示）');
    accessTrendChart?.setOption(buildAccessTrendOption(), true);
    renderTreemap();
  }

  function handleGenerate() {
    message.success('报表生成任务已提交（演示）');
  }

  onMounted(() => {
    initMainCharts();
    window.addEventListener('resize', resizeAllCharts);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeAllCharts);
    accessTrendChart?.dispose();
    treemapChart?.dispose();
  });
</script>

<style lang="less" scoped>
  .api-ops-report {
    padding: 20px;
    height: 100%;
    background: #f5f7fb;
  }

  .report-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8edf5;
  }

  .report-toolbar__left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .back-btn {
    align-self: flex-start;
    padding-left: 0;
  }

  .report-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2a44;
  }

  .report-toolbar__right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .report-section {
    margin-bottom: 24px;
  }

  .section-title {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: #1f2a44;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .chart-card {
    padding: 12px 14px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;
  }

  .chart-card__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  .chart-card__label {
    font-size: 13px;
    font-weight: 600;
    color: #5c6b8a;
  }

  .chart-box {
    height: 280px;

    &--lg {
      height: 300px;
    }
  }

  @media (max-width: 1200px) {
    .overview-grid {
      grid-template-columns: 1fr;
    }

    .report-toolbar {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
