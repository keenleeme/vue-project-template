<template>
  <div class="report-detail-container">
    <a-card style="height: 100%">
      <ReportDetailHeader
        title="应用资产综合分析报表"
        :show-meta="false"
        :show-refresh="false"
        export-label="生成报告"
        export-primary
        @export="openGenerateModal"
      />

      <a-spin :spinning="loading">
        <a-row :gutter="12" class="chart-row">
          <a-col :span="12">
            <AppOverviewPanel :stats="overviewStats" />
          </a-col>
          <a-col :span="6">
            <div class="chart-panel">
              <div class="panel-title">应用部署域</div>
              <AppDeployPieCard ref="deployPieRef" :slices="overviewStats.deployDist" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="chart-panel">
              <div class="chart-panel__head">
                <div class="panel-title">{{ trendTitle }}</div>
                <a-radio-group v-model:value="trendRange" size="small" @change="updateTrendChart">
                  <a-radio-button value="7d">近七天</a-radio-button>
                  <a-radio-button value="30d">近一个月</a-radio-button>
                </a-radio-group>
              </div>
              <div ref="trendRef" class="chart-box chart-box--sm"></div>
            </div>
          </a-col>
        </a-row>

        <div class="table-panel">
          <div class="panel-title">威胁应用 TOP</div>
          <a-tabs v-model:active-key="topTab">
            <a-tab-pane key="defect" tab="缺陷数量 TOP10">
              <AppTopTable variant="defect" :rows="defectTopApps" @drill="goAppDetail" />
            </a-tab-pane>
            <a-tab-pane key="attack" tab="攻击风险 TOP10">
              <AppTopTable variant="attack" :rows="attackTopApps" @drill="goAppDetail" />
            </a-tab-pane>
            <a-tab-pane key="behavior" tab="行为风险 TOP10">
              <AppTopTable variant="behavior" :rows="behaviorTopApps" @drill="goAppDetail" />
            </a-tab-pane>
          </a-tabs>
        </div>

        <div class="table-panel">
          <a-row :gutter="16">
            <a-col :span="10">
              <div class="sub-table-title">应用缺陷 TOP10 分布</div>
              <div ref="defectDistRef" class="chart-box chart-box--md"></div>
            </a-col>
            <a-col :span="14">
              <div class="sub-table-title">缺陷 API TOP10</div>
              <a-table
                :columns="defectApiColumns"
                :data-source="defectApiTop"
                :pagination="false"
                row-key="rank"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'appName'">
                    <div class="app-info-cell">
                      <a-button type="link" class="link-btn" @click="goAppDetail(record.appId)">
                        {{ record.appName }}
                      </a-button>
                      <div class="app-domain">{{ record.appDomain }}</div>
                    </div>
                  </template>
                  <template v-else-if="column.key === 'defectDist'">
                    <RiskLevelBar :dist="record.defectDist" />
                  </template>
                </template>
              </a-table>
            </a-col>
            <a-col :span="12">
              <div class="sub-table-title">攻击 IP TOP10</div>
              <a-table
                :columns="attackIpColumns"
                :data-source="attackIpTop"
                :pagination="false"
                row-key="rank"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'attackDist'">
                    <RiskLevelBar :dist="record.attackDist" />
                  </template>
                </template>
              </a-table>
            </a-col>
            <a-col :span="12">
              <div class="sub-table-title">行为风险主体 TOP10</div>
              <a-table
                :columns="behaviorSubjectColumns"
                :data-source="behaviorSubjectTop"
                :pagination="false"
                row-key="rank"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'riskDist'">
                    <RiskLevelBar :dist="record.riskDist" />
                  </template>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-card>

    <GenerateReportModal
      v-model:open="generateModalOpen"
      template-type="application-asset-analysis"
      :template-locked="true"
      :confirm-loading="generateLoading"
      @submit="handleGenerateSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { nextTick, onBeforeUnmount, onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import GenerateReportModal from '../components/GenerateReportModal.vue';
  import ReportDetailHeader from '../components/ReportDetailHeader.vue';
  import AppDeployPieCard from './components/AppDeployPieCard.vue';
  import AppOverviewPanel from './components/AppOverviewPanel.vue';
  import AppTopTable from './components/AppTopTable.vue';
  import RiskLevelBar from './components/RiskLevelBar.vue';
  import { mockOverviewStats } from './mock';
  import {
    fetchAppOverviewStats,
    fetchAttackTopApps,
    fetchBehaviorTopApps,
    fetchDefectTopApps,
    fetchSupplementaryTops
  } from './service';
  import type {
    AccessTrendRange,
    AppOverviewStats,
    AppTopRow,
    AttackIpTopRow,
    BehaviorSubjectTopRow,
    ChartSlice,
    DefectApiTopRow
  } from './types';
  import type { GenerateReportFormValues } from '../types';

  const router = useRouter();
  const loading = ref(false);
  const topTab = ref('defect');
  const generateModalOpen = ref(false);
  const generateLoading = ref(false);
  const overviewStats = ref<AppOverviewStats>({ ...mockOverviewStats });

  const defectTopApps = ref<AppTopRow[]>([]);
  const attackTopApps = ref<AppTopRow[]>([]);
  const behaviorTopApps = ref<AppTopRow[]>([]);
  const defectApiTop = ref<DefectApiTopRow[]>([]);
  const attackIpTop = ref<AttackIpTopRow[]>([]);
  const behaviorSubjectTop = ref<BehaviorSubjectTopRow[]>([]);
  const appDefectTop10Dist = ref<ChartSlice[]>([]);

  const trendRef = ref<HTMLElement>();
  const defectDistRef = ref<HTMLElement>();
  const deployPieRef = ref<InstanceType<typeof AppDeployPieCard>>();
  const trendRange = ref<AccessTrendRange>('7d');
  let trendChart: ECharts | null = null;
  let defectDistChart: ECharts | null = null;

  const trendTitle = computed(() =>
    trendRange.value === '7d' ? '应用近七天访问趋势' : '应用近一个月访问趋势'
  );

  const attackIpColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: '攻击 IP', dataIndex: 'ip', key: 'ip', width: 130 },
    { title: '归属地域', dataIndex: 'region', key: 'region', width: 110 },
    { title: '攻击分布', dataIndex: 'attackDist', key: 'attackDist', width: 150 }
  ];

  const defectApiColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: 'API 名称', dataIndex: 'apiName', key: 'apiName', ellipsis: true },
    { title: '所属应用', dataIndex: 'appName', key: 'appName', width: 160 },
    { title: '缺陷分布', dataIndex: 'defectDist', key: 'defectDist', width: 150 }
  ];

  const behaviorSubjectColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: '主体信息', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: '风险分布', dataIndex: 'riskDist', key: 'riskDist', width: 150 }
  ];

  function pieOption(data: ChartSlice[]): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [
        {
          type: 'pie',
          radius: ['38%', '62%'],
          center: ['50%', '44%'],
          label: { formatter: '{b}\n{d}%' },
          data
        }
      ]
    };
  }

  function lineOption(dates: string[], values: number[], compact = false): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 42, right: 12, top: 20, bottom: compact ? 36 : 28 },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLabel: compact ? { interval: 4, fontSize: 10 } : undefined
      },
      yAxis: { type: 'value', axisLabel: { formatter: (v: number) => `${Math.round(v / 1000)}k` } },
      series: [
        {
          type: 'line',
          smooth: true,
          data: values,
          areaStyle: { color: 'rgba(24,144,255,0.12)' },
          itemStyle: { color: '#1890ff' }
        }
      ]
    };
  }

  function getCurrentTrendData() {
    return overviewStats.value.accessTrend[trendRange.value];
  }

  function renderTrendChart() {
    if (!trendRef.value) return;
    const { dates, values } = getCurrentTrendData();
    const option = lineOption(dates, values, trendRange.value === '30d');
    if (!trendChart) {
      trendChart = echarts.init(trendRef.value);
    }
    trendChart.setOption(option, true);
  }

  function renderDefectDistChart() {
    if (!defectDistRef.value) return;
    const option = pieOption(appDefectTop10Dist.value);
    if (!defectDistChart) {
      defectDistChart = echarts.init(defectDistRef.value);
    }
    defectDistChart.setOption(option, true);
  }

  function updateTrendChart() {
    renderTrendChart();
  }

  async function loadData() {
    loading.value = true;
    try {
      const [stats, defect, attack, behavior, extra] = await Promise.all([
        fetchAppOverviewStats(),
        fetchDefectTopApps(),
        fetchAttackTopApps(),
        fetchBehaviorTopApps(),
        fetchSupplementaryTops()
      ]);
      overviewStats.value = stats;
      defectTopApps.value = defect;
      attackTopApps.value = attack;
      behaviorTopApps.value = behavior;
      appDefectTop10Dist.value = extra.appDefectTop10Dist;
      defectApiTop.value = extra.defectApiTop;
      attackIpTop.value = extra.attackIpTop;
      behaviorSubjectTop.value = extra.behaviorSubjectTop;
      await nextTick();
      renderTrendChart();
      renderDefectDistChart();
    } finally {
      loading.value = false;
    }
  }

  function goAppDetail(appId: string) {
    router.push(`/report-management/application-asset-analysis/${appId}`);
  }

  function openGenerateModal() {
    generateModalOpen.value = true;
  }

  async function handleGenerateSubmit(values: GenerateReportFormValues) {
    generateLoading.value = true;
    try {
      await new Promise<void>((resolve) => { setTimeout(resolve, 400); });
      message.success(`报告「${values.reportName}」生成任务已提交（演示）`);
      generateModalOpen.value = false;
    } finally {
      generateLoading.value = false;
    }
  }

  function resizeCharts() {
    trendChart?.resize();
    defectDistChart?.resize();
    deployPieRef.value?.resizeChart();
  }

  onMounted(() => {
    loadData();
    window.addEventListener('resize', resizeCharts);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts);
    trendChart?.dispose();
    trendChart = null;
    defectDistChart?.dispose();
    defectDistChart = null;
  });
</script>

<style lang="less" scoped>
  .report-detail-container {
    padding: 20px;
    height: 100%;
  }

  .chart-row {
    margin-bottom: 8px;
  }

  .chart-panel {
    margin-top: 12px;
    padding: 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    background: var(--color-bg-container);

    &__head {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;

      .panel-title {
        margin-bottom: 0;
      }
    }
  }

  .table-panel {
    margin-top: 12px;
    padding: 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    background: var(--color-bg-container);
  }

  .panel-title {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  .sub-table-title {
    margin: 8px 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .chart-box {
    height: 240px;

    &--sm {
      height: 220px;
    }

    &--md {
      height: 280px;
    }
  }

  .link-btn {
    padding: 0;
    height: auto;
    line-height: 1.4;
  }

  .app-info-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    line-height: 1.4;
  }

  .app-domain {
    font-size: 12px;
    color: var(--color-text-secondary);
    word-break: break-all;
  }
</style>
