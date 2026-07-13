<template>
  <div class="api-asset-report">
    <a-card :body-style="{ padding: '20px 24px 24px' }" style="height: 100%">
      <ReportDetailHeader
        title="API 资产综合分析报表"
        :show-meta="false"
        :show-refresh="false"
        export-label="生成报告"
        export-primary
        @export="openGenerateModal"
      />

      <a-spin :spinning="loading">
        <section class="report-section">
          <h2 class="section-title">API 概况</h2>
          <a-row :gutter="12" class="chart-row">
            <a-col :span="4">
              <ApiTotalCard :total="reportData.overview.apiTotal" />
            </a-col>
            <a-col :span="6">
              <div class="chart-panel">
                <div class="panel-title">API 部署域分布</div>
                <div ref="deployRef" class="chart-box chart-box--sm"></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="chart-panel">
                <div class="panel-title">API 类型分布</div>
                <div ref="typeRef" class="chart-box chart-box--sm"></div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="chart-panel">
                <div class="panel-title">API 近七天访问趋势</div>
                <div ref="trendRef" class="chart-box chart-box--sm"></div>
              </div>
            </a-col>
          </a-row>
          <a-row :gutter="12" class="chart-row">
            <a-col :span="10">
              <div class="chart-panel">
                <div class="chart-panel__head">
                  <div class="panel-title">近七天访问数据分布</div>
                  <a-radio-group v-model:value="accessDataTab" size="small" @change="renderTreemap">
                    <a-radio-button value="all">全部</a-radio-button>
                    <a-radio-button value="sensitive">个人敏感信息</a-radio-button>
                  </a-radio-group>
                </div>
                <div ref="treemapRef" class="chart-box chart-box--md"></div>
              </div>
            </a-col>
          </a-row>
        </section>

        <section class="report-section">
          <h2 class="section-title">威胁分析</h2>

          <a-row :gutter="12" class="chart-row">
            <a-col :span="8">
              <div class="chart-panel">
                <div class="panel-title">API 缺陷等级分布</div>
                <div ref="defectLevelRef" class="chart-box chart-box--sm"></div>
              </div>
            </a-col>
            <a-col :span="16">
              <div class="table-panel table-panel--flat">
                <div class="table-panel__head">
                  <div class="panel-title">API 缺陷分布</div>
                  <a-select
                    v-model:value="defectLevelFilter"
                    allow-clear
                    placeholder="按等级筛选"
                    style="width: 140px"
                    size="small"
                    :options="defectLevelOptions"
                  />
                </div>
                <a-table
                  :columns="defectDistColumns"
                  :data-source="filteredDefectDist"
                  :pagination="false"
                  row-key="key"
                  size="small"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'level'">
                      <span :class="['level-badge', levelClass(record.level)]">{{ record.level }}</span>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-col>
          </a-row>

          <div class="table-panel">
            <div class="table-panel__head">
              <div class="panel-title">API 攻击风险分布</div>
              <a-range-picker
                v-model:value="attackDateRange"
                format="YYYY-MM-DD"
                size="small"
                @change="handleAttackDrill"
              />
            </div>
            <a-table
              :columns="attackDistColumns"
              :data-source="attackDistRows"
              :pagination="false"
              row-key="key"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'level'">
                  <span :class="['level-badge', attackLevelClass(record.level)]">{{ record.level }}</span>
                </template>
                <template v-else-if="column.key === 'attackCount'">
                  <div class="attack-count-cell">
                    <a-progress
                      :percent="attackPercent(record.attackCount)"
                      :show-info="false"
                      :stroke-color="attackProgressColor(record.level)"
                      size="small"
                    />
                    <span class="attack-count-value">{{ formatNumber(record.attackCount) }}</span>
                  </div>
                </template>
              </template>
            </a-table>
          </div>

          <div class="table-panel">
            <div class="panel-title">缺陷 API TOP10</div>
            <a-table
              :columns="defectApiTopColumns"
              :data-source="defectApiTop"
              :pagination="false"
              row-key="rank"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'defectDist'">
                  <RiskLevelBar :dist="record.defectDist" show-total />
                </template>
                <template v-else-if="column.key === 'stackedBar'">
                  <StackedDefectBar :dist="record.defectDist" />
                </template>
                <template v-else-if="column.key === 'defectTotal'">
                  <strong>{{ record.defectTotal }}</strong>
                </template>
              </template>
            </a-table>
          </div>
        </section>
      </a-spin>
    </a-card>

    <GenerateReportModal
      v-model:open="generateModalOpen"
      template-type="api-asset-analysis"
      :template-locked="true"
      :confirm-loading="generateLoading"
      @submit="handleGenerateSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import GenerateReportModal from '../components/GenerateReportModal.vue';
  import ReportDetailHeader from '../components/ReportDetailHeader.vue';
  import RiskLevelBar from '../components/RiskLevelBar.vue';
  import type { GenerateReportFormValues } from '../types';
  import ApiTotalCard from './components/ApiTotalCard.vue';
  import StackedDefectBar from './components/StackedDefectBar.vue';
  import { mockApiAssetReport } from './mock';
  import { fetchApiAssetReport } from './service';
  import type { ApiAssetReportData, AttackLevel, ChartSlice, DefectLevel } from './types';

  const loading = ref(false);
  const generateModalOpen = ref(false);
  const generateLoading = ref(false);
  const accessDataTab = ref<'all' | 'sensitive'>('all');
  const defectLevelFilter = ref<DefectLevel | undefined>();
  const attackDateRange = ref<[Dayjs, Dayjs]>([dayjs('2026-06-17'), dayjs('2026-06-23')]);

  const reportData = reactive<ApiAssetReportData>({ ...mockApiAssetReport });

  const deployRef = ref<HTMLElement>();
  const typeRef = ref<HTMLElement>();
  const trendRef = ref<HTMLElement>();
  const treemapRef = ref<HTMLElement>();
  const defectLevelRef = ref<HTMLElement>();

  let deployChart: ECharts | null = null;
  let typeChart: ECharts | null = null;
  let trendChart: ECharts | null = null;
  let treemapChart: ECharts | null = null;
  let defectLevelChart: ECharts | null = null;

  const defectLevelOptions = [
    { label: '高危', value: '高危' },
    { label: '中危', value: '中危' },
    { label: '低危', value: '低危' }
  ];

  const defectDistColumns = [
    { title: '缺陷名称', dataIndex: 'defectName', key: 'defectName', ellipsis: true },
    { title: '缺陷等级', dataIndex: 'level', key: 'level', width: 100 },
    { title: '影响 API 数量', dataIndex: 'affectedApiCount', key: 'affectedApiCount', width: 120 }
  ];

  const attackDistColumns = [
    { title: '攻击名称', dataIndex: 'attackName', key: 'attackName', ellipsis: true },
    { title: '攻击等级', dataIndex: 'level', key: 'level', width: 100 },
    { title: '攻击次数', dataIndex: 'attackCount', key: 'attackCount', width: 220 }
  ];

  const defectApiTopColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 64 },
    { title: 'API 名称', dataIndex: 'apiPath', key: 'apiPath', ellipsis: true },
    { title: '缺陷总数', dataIndex: 'defectTotal', key: 'defectTotal', width: 90 },
    { title: '高中低分布', dataIndex: 'defectDist', key: 'defectDist', width: 180 },
    { title: '堆叠分布', dataIndex: 'stackedBar', key: 'stackedBar', width: 200 }
  ];

  const filteredDefectDist = computed(() => {
    if (!defectLevelFilter.value) return reportData.defectDist;
    return reportData.defectDist.filter((row) => row.level === defectLevelFilter.value);
  });

  const attackDistRows = computed(() => reportData.attackDist);
  const defectApiTop = computed(() => reportData.defectApiTop);

  const maxAttackCount = computed(() =>
    Math.max(...reportData.attackDist.map((row) => row.attackCount), 1)
  );

  const deployColors = ['#13c2c2', '#2f54eb', '#fa8c16', '#722ed1'];
  const defectLevelColors: Record<string, string> = {
    高危: '#f5222d',
    中危: '#fa8c16',
    低危: '#1677ff'
  };

  function pieOption(data: ChartSlice[], colors?: string[]): EChartsOption {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, type: 'scroll', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
      color: colors,
      series: [
        {
          type: 'pie',
          radius: ['38%', '62%'],
          center: ['50%', '44%'],
          label: { show: false },
          data
        }
      ]
    };
  }

  function barOption(data: ChartSlice[]): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 12, top: 16, bottom: 48 },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLabel: { interval: 0, rotate: 20, fontSize: 10 }
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          barWidth: 28,
          data: data.map((d) => d.value),
          itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] }
        }
      ]
    };
  }

  function lineOption(dates: string[], values: number[]): EChartsOption {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 52, right: 12, top: 20, bottom: 28 },
      xAxis: { type: 'category', boundaryGap: false, data: dates },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (v: number) => `${Math.round(v / 10000)}万` }
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: values,
          areaStyle: { color: 'rgba(22, 119, 255, 0.12)' },
          itemStyle: { color: '#1677ff' }
        }
      ]
    };
  }

  function buildTreemapOption(): EChartsOption {
    const data =
      accessDataTab.value === 'all'
        ? reportData.overview.accessDataAll
        : reportData.overview.accessDataSensitive;
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

  function renderDeployChart() {
    if (!deployRef.value) return;
    if (!deployChart) deployChart = echarts.init(deployRef.value);
    deployChart.setOption(pieOption(reportData.overview.deployDist, deployColors), true);
  }

  function renderTypeChart() {
    if (!typeRef.value) return;
    if (!typeChart) typeChart = echarts.init(typeRef.value);
    typeChart.setOption(barOption(reportData.overview.typeDist), true);
  }

  function renderTrendChart() {
    if (!trendRef.value) return;
    const { dates, values } = reportData.overview.accessTrend;
    if (!trendChart) trendChart = echarts.init(trendRef.value);
    trendChart.setOption(lineOption(dates, values), true);
  }

  function renderTreemap() {
    if (!treemapRef.value) return;
    if (!treemapChart) treemapChart = echarts.init(treemapRef.value);
    treemapChart.setOption(buildTreemapOption(), true);
  }

  function renderDefectLevelChart() {
    if (!defectLevelRef.value) return;
    if (!defectLevelChart) defectLevelChart = echarts.init(defectLevelRef.value);
    defectLevelChart.setOption(
      pieOption(
        reportData.defectLevelDist,
        reportData.defectLevelDist.map((d) => defectLevelColors[d.name] || '#bfbfbf')
      ),
      true
    );
  }

  function renderAllCharts() {
    renderDeployChart();
    renderTypeChart();
    renderTrendChart();
    renderTreemap();
    renderDefectLevelChart();
  }

  function resizeCharts() {
    deployChart?.resize();
    typeChart?.resize();
    trendChart?.resize();
    treemapChart?.resize();
    defectLevelChart?.resize();
  }

  async function loadData() {
    loading.value = true;
    try {
      const data = await fetchApiAssetReport();
      Object.assign(reportData, data);
      await nextTick();
      renderAllCharts();
    } finally {
      loading.value = false;
    }
  }

  function levelClass(level: DefectLevel) {
    if (level === '高危') return 'level-badge--high';
    if (level === '中危') return 'level-badge--medium';
    return 'level-badge--low';
  }

  function attackLevelClass(level: AttackLevel) {
    if (level === '严重') return 'level-badge--critical';
    if (level === '高危') return 'level-badge--high';
    return 'level-badge--medium';
  }

  function attackPercent(count: number) {
    return Math.round((count / maxAttackCount.value) * 100);
  }

  function attackProgressColor(level: AttackLevel) {
    if (level === '严重') return '#a8071a';
    if (level === '高危') return '#fa8c16';
    return '#1677ff';
  }

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }

  function handleAttackDrill() {
    message.success('已按所选时间范围下钻攻击风险数据（演示）');
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

  onMounted(() => {
    loadData();
    window.addEventListener('resize', resizeCharts);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts);
    deployChart?.dispose();
    typeChart?.dispose();
    trendChart?.dispose();
    treemapChart?.dispose();
    defectLevelChart?.dispose();
  });
</script>

<style lang="less" scoped>
  .api-asset-report {
    padding: 20px;
    height: 100%;
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

  .chart-row {
    margin-bottom: 0;
  }

  .chart-panel,
  .table-panel {
    margin-top: 12px;
    padding: 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    background: var(--color-bg-container);

    &--flat {
      margin-top: 0;
      height: 100%;
    }

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
  }

  .panel-title {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;

    .chart-panel__head &,
    .table-panel__head & {
      margin-bottom: 0;
    }
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

  .level-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;

    &--critical {
      background: #a8071a;
    }

    &--high {
      background: #f5222d;
    }

    &--medium {
      background: #fa8c16;
    }

    &--low {
      background: #1677ff;
    }
  }

  .attack-count-cell {
    display: flex;
    align-items: center;
    gap: 10px;

    :deep(.ant-progress) {
      flex: 1;
      margin: 0;
    }
  }

  .attack-count-value {
    min-width: 48px;
    font-size: 13px;
    font-weight: 600;
    color: #1f2a44;
    text-align: right;
  }
</style>
