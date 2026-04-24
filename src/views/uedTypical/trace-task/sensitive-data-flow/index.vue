<template>
  <div
    class="sensitive-flow-page"
    :class="{ 'is-chart-fullscreen': chartFullscreen, 'is-compact-toolbar': compactToolbar }"
  >
    <header class="flow-toolbar" role="region" aria-label="筛选与工具栏">
      <div class="toolbar-main">
        <div class="toolbar-title-block">
          <h1 class="page-heading">敏感数据流转追踪</h1>
          <div class="toolbar-meta" aria-live="polite">
            <span class="meta-item">最后更新：{{ lastUpdatedText }}</span>
            <span class="meta-item">
              自动刷新：
              <a-select
                v-model:value="refreshIntervalSec"
                size="small"
                class="interval-select"
                :disabled="!realtimeEnabled || refreshPaused"
                :options="intervalOptions"
                aria-label="自动刷新间隔"
              />
            </span>
          </div>
        </div>

        <div v-if="!compactToolbar" class="filter-row">
          <a-form layout="inline" class="dark-form">
            <a-form-item label="敏感数据标签">
              <a-select
                v-model:value="filters.tags"
                mode="multiple"
                allow-clear
                placeholder="多选标签"
                :options="tagOptions"
                class="filter-control"
                aria-label="敏感数据标签，支持多选"
              />
            </a-form-item>
            <a-form-item label="账号">
              <a-input
                v-model:value="filters.account"
                allow-clear
                placeholder="模糊搜索账号"
                class="filter-control"
                aria-label="账号模糊搜索"
              />
            </a-form-item>
            <a-form-item label="应用">
              <a-select
                v-model:value="filters.app"
                allow-clear
                placeholder="选择应用"
                :options="appOptions"
                class="filter-control"
                aria-label="应用选择"
              />
            </a-form-item>
            <a-form-item label="时间范围">
              <a-range-picker
                v-model:value="filters.range"
                show-time
                class="filter-control filter-range"
                aria-label="时间范围"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button size="small" @click="clearFilters">清除条件</a-button>
                <a-button type="primary" size="small" ghost @click="resetFilters">重置</a-button>
                <a-button size="small" :loading="manualRefreshing" @click="manualRefresh"> 手动刷新 </a-button>
                <a-button size="small" :disabled="!realtimeEnabled" @click="refreshPaused = !refreshPaused">
                  {{ refreshPaused ? '继续自动更新' : '暂停自动更新' }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>

        <div v-else class="filter-compact">
          <a-button type="primary" ghost size="small" @click="filterDrawerOpen = true"> 打开筛选 </a-button>
        </div>

        <div class="toolbar-actions">
          <a-space>
            <span class="live-label">
              实时监控
              <a-switch
                v-model:checked="realtimeEnabled"
                size="small"
                aria-label="实时监控开关"
                @change="onRealtimeChange"
              />
            </span>
            <a-button size="small" @click="exportReport">导出报告</a-button>
            <a-button size="small" @click="chartFullscreen = !chartFullscreen">
              {{ chartFullscreen ? '退出全屏' : '图表全屏' }}
            </a-button>
          </a-space>
        </div>
      </div>

      <div class="risk-legend" role="group" aria-label="风险等级图例">
        <span class="legend-title">风险图例</span>
        <span class="legend-item legend-normal">
          <span class="legend-shape legend-shape-line solid" aria-hidden="true" />
          <span>正常</span>
        </span>
        <span class="legend-item legend-warn">
          <span class="legend-shape legend-shape-line dash warn" aria-hidden="true" />
          <span>警告</span>
        </span>
        <span class="legend-item legend-high">
          <span class="legend-shape legend-shape-line dash high" aria-hidden="true" />
          <span>高风险 / 异常路径</span>
        </span>
        <span class="legend-item legend-node">
          <span class="legend-shape circle" aria-hidden="true" />数据源
          <span class="legend-shape diamond" aria-hidden="true" />处理
          <span class="legend-shape rect" aria-hidden="true" />API
        </span>
      </div>
    </header>

    <div class="flow-body">
      <main class="flow-chart-wrap" role="main" aria-label="数据流转拓扑图">
        <div ref="chartRef" class="flow-chart" tabindex="0" aria-label="可缩放平移的链路图，节点可拖拽" />
      </main>

      <aside
        class="flow-detail-panel"
        :class="{ collapsed: detailCollapsed }"
        role="complementary"
        aria-label="详情面板"
      >
        <div class="panel-header">
          <span>详情</span>
          <a-button type="link" size="small" @click="detailCollapsed = !detailCollapsed">
            {{ detailCollapsed ? '展开' : '折叠' }}
          </a-button>
        </div>
        <div v-show="!detailCollapsed" class="panel-body">
          <template v-if="selection">
            <a-collapse v-model:active-key="detailActiveKeys" :bordered="false" ghost>
              <a-collapse-panel key="summary" header="关键信息">
                <a-descriptions :column="1" size="small" bordered class="dark-descriptions">
                  <a-descriptions-item v-for="row in selection.summary" :key="row.label" :label="row.label">
                    {{ row.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-collapse-panel>
              <a-collapse-panel key="more" header="查看更多">
                <a-descriptions :column="1" size="small" bordered class="dark-descriptions">
                  <a-descriptions-item v-for="row in selection.extra" :key="row.label" :label="row.label">
                    {{ row.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </a-collapse-panel>
            </a-collapse>
            <div v-if="selection.badges?.length" class="panel-badges">
              <a-tag v-for="b in selection.badges" :key="b" color="red">{{ b }}</a-tag>
            </div>
            <div class="panel-footer-actions">
              <a-button type="primary" block ghost size="small" @click="addToWatchlist"> 加入监控 </a-button>
              <a-button block size="small" class="mt-8" @click="generateNodeReport"> 生成报告 </a-button>
            </div>
          </template>
          <a-empty v-else description="点击节点或连接线查看详情" />
        </div>
      </aside>
    </div>

    <a-drawer
      v-model:open="filterDrawerOpen"
      title="筛选条件"
      placement="left"
      :width="320"
      class="flow-filter-drawer"
      @close="filterDrawerOpen = false"
    >
      <a-form layout="vertical" class="dark-form">
        <a-form-item label="敏感数据标签">
          <a-select v-model:value="filters.tags" mode="multiple" allow-clear :options="tagOptions" />
        </a-form-item>
        <a-form-item label="账号">
          <a-input v-model:value="filters.account" allow-clear placeholder="模糊搜索" />
        </a-form-item>
        <a-form-item label="应用">
          <a-select v-model:value="filters.app" allow-clear :options="appOptions" />
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="filters.range" show-time class="w-full" />
        </a-form-item>
        <a-space>
          <a-button @click="clearFilters">清除</a-button>
          <a-button type="primary" ghost @click="resetFilters">重置</a-button>
        </a-space>
      </a-form>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import { message, notification } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

  type RiskLevel = 'normal' | 'warning' | 'high';
  type NodeKind = 'source' | 'process' | 'api';

  type FlowNode = {
    id: string;
    name: string;
    kind: NodeKind;
    traffic: number;
    x: number;
    y: number;
    risk: RiskLevel;
    zombie?: boolean;
    hasNew?: boolean;
    abnormal?: boolean;
  };

  type FlowLink = {
    source: string;
    target: string;
    risk: RiskLevel;
    bulk?: boolean;
    nonCompliant?: boolean;
    newFlag?: boolean;
  };

  const chartRef = ref<HTMLElement | null>(null);
  let chart: echarts.ECharts | null = null;
  let blinkTimer: ReturnType<typeof setInterval> | null = null;
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  const chartFullscreen = ref(false);
  const compactToolbar = ref(false);
  const filterDrawerOpen = ref(false);
  const detailCollapsed = ref(false);
  const detailActiveKeys = ref(['summary', 'more']);
  const realtimeEnabled = ref(true);
  const refreshPaused = ref(false);
  const refreshIntervalSec = ref(30);
  const lastUpdated = ref(dayjs());
  const manualRefreshing = ref(false);
  const blinkPhase = ref(false);

  const intervalOptions = [
    { label: '15 秒', value: 15 },
    { label: '30 秒', value: 30 },
    { label: '60 秒', value: 60 },
    { label: '120 秒', value: 120 }
  ];

  const tagOptions = [
    { label: '身份证号', value: 'id_card' },
    { label: '银行卡号', value: 'bank' },
    { label: '手机号', value: 'phone' },
    { label: '客户画像', value: 'profile' }
  ];

  const appOptions = [
    { label: '计费核心', value: 'billing' },
    { label: 'CRM 服务', value: 'crm' },
    { label: '数据中台 API', value: 'dmp' }
  ];

  const filters = reactive<{
    tags: string[];
    account: string;
    app?: string;
    range: [Dayjs, Dayjs] | undefined;
  }>({
    tags: [],
    account: '',
    app: undefined,
    range: [dayjs().subtract(1, 'day'), dayjs()]
  });

  const lastUpdatedText = computed(() => lastUpdated.value.format('YYYY-MM-DD HH:mm:ss'));

  const baseNodes: FlowNode[] = [
    {
      id: 'db1',
      name: '客户主库',
      kind: 'source',
      traffic: 120,
      x: 80,
      y: 120,
      risk: 'normal'
    },
    {
      id: 'kafka1',
      name: '脱敏 Kafka',
      kind: 'process',
      traffic: 90,
      x: 280,
      y: 80,
      risk: 'warning',
      abnormal: true
    },
    {
      id: 'svc1',
      name: '画像聚合',
      kind: 'process',
      traffic: 70,
      x: 280,
      y: 200,
      risk: 'normal'
    },
    {
      id: 'api1',
      name: '/api/v1/customer/export',
      kind: 'api',
      traffic: 100,
      x: 520,
      y: 100,
      risk: 'high',
      hasNew: true
    },
    {
      id: 'api2',
      name: '/internal/legacy/query',
      kind: 'api',
      traffic: 40,
      x: 520,
      y: 220,
      risk: 'warning',
      zombie: true
    }
  ];

  const baseLinks: FlowLink[] = [
    { source: 'db1', target: 'kafka1', risk: 'normal' },
    { source: 'db1', target: 'svc1', risk: 'normal' },
    { source: 'kafka1', target: 'api1', risk: 'warning', newFlag: true },
    { source: 'svc1', target: 'api1', risk: 'normal' },
    { source: 'kafka1', target: 'api2', risk: 'high', bulk: true, nonCompliant: true }
  ];

  const graphNodes = ref<FlowNode[]>(JSON.parse(JSON.stringify(baseNodes)));
  const graphLinks = ref<FlowLink[]>(JSON.parse(JSON.stringify(baseLinks)));

  type DetailSelection = {
    type: 'node' | 'edge';
    title: string;
    summary: { label: string; value: string }[];
    extra: { label: string; value: string }[];
    badges?: string[];
  };

  const selection = ref<DetailSelection | null>(null);

  function symbolForKind(kind: NodeKind): string {
    if (kind === 'source') return 'circle';
    if (kind === 'process') return 'diamond';
    return 'rect';
  }

  function nodeColor(kind: NodeKind, risk: RiskLevel): string {
    if (risk === 'high') return '#f5222d';
    if (risk === 'warning') return '#fa8c16';
    if (kind === 'source') return '#36cfc9';
    if (kind === 'process') return '#597ef7';
    return '#73d13d';
  }

  function buildChartOption(): echarts.EChartsOption {
    const nData = graphNodes.value.map((n) => {
      const size = 28 + Math.min(n.traffic / 4, 36);
      const labelText = (n.hasNew ? 'NEW ' : '') + n.name + (n.abnormal ? ' ⚠' : '') + (n.zombie ? ' [僵尸]' : '');
      return {
        id: n.id,
        name: n.name,
        x: n.x,
        y: n.y,
        value: n.traffic,
        symbol: symbolForKind(n.kind),
        symbolSize: size,
        draggable: true,
        itemStyle: {
          color: nodeColor(n.kind, n.risk),
          borderColor: n.zombie ? '#faad14' : '#303030',
          borderWidth: n.zombie ? 2 : 1,
          borderType: n.zombie ? 'dashed' : 'solid',
          shadowBlur: n.abnormal ? (blinkPhase.value ? 22 : 6) : 0,
          shadowColor: 'rgba(245, 34, 45, 0.55)'
        },
        label: {
          show: true,
          formatter: labelText,
          color: '#e6e6e6',
          fontSize: 11
        }
      };
    });

    const lData = graphLinks.value.map((e) => {
      let color = '#52c41a';
      let type: 'solid' | 'dashed' = 'solid';
      let width = 1.5;
      if (e.risk === 'warning') {
        color = '#fa8c16';
        type = 'solid';
        width = 2;
      }
      if (e.risk === 'high' || e.nonCompliant) {
        color = '#f5222d';
        type = 'dashed';
        width = e.nonCompliant ? 4 : 2.5;
      }
      if (e.bulk) {
        width = blinkPhase.value ? 5 : 2;
        color = '#ff4d4f';
      }
      return {
        source: e.source,
        target: e.target,
        lineStyle: {
          color,
          width,
          type,
          curveness: 0.2
        },
        label: {
          show: !!e.newFlag,
          formatter: 'NEW',
          color: '#ffccc7',
          fontSize: 10
        }
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(20,24,32,0.95)',
        borderColor: '#434343',
        textStyle: { color: '#fff' },
        formatter: (p: unknown) => {
          const param = p as {
            dataType?: string;
            data?: { source?: string; target?: string; name?: string; value?: number };
          };
          if (param.dataType === 'edge') {
            const { source, target } = param.data || {};
            return `${source} → ${target}<br/>状态：参见图例颜色与线型`;
          }
          const d = param.data;
          if (!d?.name) return '';
          return `${d.name}<br/>估算流量：${d.value ?? '-'} req/min`;
        }
      },
      animationDurationUpdate: 500,
      series: [
        {
          type: 'graph',
          layout: 'none',
          roam: true,
          scaleLimit: { min: 0.4, max: 3 },
          data: nData as unknown as echarts.GraphSeriesOption['data'],
          links: lData as unknown as echarts.GraphSeriesOption['links'],
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 4 }
          },
          lineStyle: { opacity: 0.9 }
        }
      ]
    };
  }

  function renderChart() {
    if (!chart) return;
    chart.setOption(buildChartOption(), true);
  }

  function bindChartEvents() {
    if (!chart) return;
    chart.off('click');
    chart.on('click', (params) => {
      const p = params as {
        dataType: string;
        data: Record<string, unknown> & { source?: string; target?: string; name?: string };
      };
      if (p.dataType === 'node') {
        const id = (p.data as { id?: string }).id || p.data.name;
        const node = graphNodes.value.find((x) => x.id === id || x.name === id);
        if (!node) return;
        selection.value = {
          type: 'node',
          title: node.name,
          summary: [
            { label: '节点类型', value: node.kind },
            { label: '风险', value: node.risk },
            { label: '流量', value: `${node.traffic} req/min` }
          ],
          extra: [
            { label: '坐标(示意)', value: `x=${node.x}, y=${node.y}` },
            { label: '僵尸 API', value: node.zombie ? '是（虚线框标识）' : '否' },
            { label: '异常闪烁', value: node.abnormal ? '是' : '否' }
          ],
          badges: [
            ...(node.hasNew ? ['NEW'] : []),
            ...(node.zombie ? ['僵尸 API'] : []),
            ...(node.abnormal ? ['异常行为'] : [])
          ].filter(Boolean)
        };
      } else if (p.dataType === 'edge') {
        const { source, target } = p.data;
        const linkMeta = graphLinks.value.find((l) => l.source === source && l.target === target);
        selection.value = {
          type: 'edge',
          title: `${source} → ${target}`,
          summary: [
            { label: '源', value: String(source) },
            { label: '目标', value: String(target) },
            {
              label: '合规',
              value: linkMeta?.nonCompliant ? '不合规流向（粗红虚线）' : '未标记不合规'
            }
          ],
          extra: [
            { label: '高频批量', value: linkMeta?.bulk ? '是（红色闪烁）' : '否' },
            { label: '风险等级', value: linkMeta?.risk ?? '-' },
            { label: 'API 路径', value: '示例：见目标节点' },
            { label: '请求参数', value: 'userId, scope, exportFormat（演示）' },
            { label: '调用统计', value: '近 1h 12.4k 次，P99 820ms（演示）' },
            { label: '异常分析', value: '短时突增、越权字段组合（演示）' }
          ],
          badges: linkMeta?.bulk ? ['高频批量'] : undefined
        };
      }
    });
  }

  function clearFilters() {
    filters.tags = [];
    filters.account = '';
    filters.app = undefined;
    filters.range = undefined;
  }

  function resetFilters() {
    filters.tags = ['id_card'];
    filters.account = '';
    filters.app = 'billing';
    filters.range = [dayjs().subtract(1, 'day'), dayjs()];
  }

  function manualRefresh() {
    manualRefreshing.value = true;
    setTimeout(() => {
      touchRefresh(true);
      manualRefreshing.value = false;
      message.success('已刷新');
    }, 400);
  }

  function touchRefresh(fromUser = false) {
    lastUpdated.value = dayjs();
    if (!fromUser && realtimeEnabled.value && !refreshPaused.value) {
      const hit = Math.random() > 0.85;
      if (hit) {
        notification.warning({
          message: '检测到新的异常行为',
          description: '已在相关路径上标记 NEW，请关注高风险链路。',
          placement: 'topRight',
          duration: 4
        });
        graphLinks.value = graphLinks.value.map((l) =>
          l.source === 'kafka1' && l.target === 'api1' ? { ...l, newFlag: true, risk: 'high' } : l
        );
      }
    }
    renderChart();
  }

  function exportReport() {
    message.success('报告导出任务已加入队列（演示）');
  }

  function addToWatchlist() {
    message.success('已加入监控列表（演示）');
  }

  function generateNodeReport() {
    message.success('正在生成专项报告（演示）');
  }

  function onRealtimeChange(checked: boolean | string | number) {
    const on = checked === true;
    if (!on) {
      refreshPaused.value = true;
    } else {
      refreshPaused.value = false;
    }
    setupRefreshTimer();
  }

  function setupRefreshTimer() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (!realtimeEnabled.value || refreshPaused.value) return;
    refreshTimer = setInterval(() => {
      touchRefresh(false);
    }, refreshIntervalSec.value * 1000);
  }

  function setupBlink() {
    if (blinkTimer) clearInterval(blinkTimer);
    blinkTimer = setInterval(() => {
      blinkPhase.value = !blinkPhase.value;
      renderChart();
    }, 700);
  }

  function checkCompact() {
    compactToolbar.value = window.innerWidth < 1200;
  }

  function onWindowResize() {
    checkCompact();
    chart?.resize();
  }

  onMounted(async () => {
    checkCompact();
    window.addEventListener('resize', onWindowResize);
    await nextTick();
    if (chartRef.value) {
      chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' });
      renderChart();
      bindChartEvents();
    }
    setupBlink();
    setupRefreshTimer();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
    if (blinkTimer) clearInterval(blinkTimer);
    if (refreshTimer) clearInterval(refreshTimer);
    chart?.dispose();
    chart = null;
  });

  watch(refreshIntervalSec, () => {
    setupRefreshTimer();
  });

  watch([realtimeEnabled, refreshPaused], () => {
    setupRefreshTimer();
  });

  watch([chartFullscreen, compactToolbar], async () => {
    await nextTick();
    chart?.resize();
  });
</script>

<script lang="ts">
  export default {
    name: 'SensitiveDataFlowChain'
  };
</script>

<style scoped lang="less">
  .sensitive-flow-page {
    --flow-bg: #0b0f14;
    --flow-panel: #121820;
    --flow-border: #2a3441;
    --flow-text: #e8eaed;
    --flow-muted: #8b949e;
    min-height: calc(100vh - 48px);
    background: var(--flow-bg);
    color: var(--flow-text);
    display: flex;
    flex-direction: column;
    padding: 12px 16px 16px;
    box-sizing: border-box;
  }

  .sensitive-flow-page.is-chart-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    min-height: 100vh;
    padding: 8px;
  }

  .flow-toolbar {
    flex-shrink: 0;
    background: var(--flow-panel);
    border: 1px solid var(--flow-border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 12px;
  }

  .toolbar-main {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12px 20px;
  }

  .toolbar-title-block {
    flex: 1 1 220px;
    min-width: 200px;
  }

  .page-heading {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: var(--flow-text);
    letter-spacing: 0.02em;
  }

  .toolbar-meta {
    font-size: 12px;
    color: var(--flow-muted);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .interval-select {
    min-width: 100px;
  }

  .filter-row {
    flex: 2 1 400px;
  }

  .filter-row :deep(.ant-form-item) {
    margin-bottom: 8px;
  }

  .filter-row :deep(.ant-form-item-label > label) {
    color: var(--flow-muted);
  }

  .dark-form :deep(.ant-select-selector),
  .dark-form :deep(.ant-input),
  .dark-form :deep(.ant-picker) {
    background: #1a222c !important;
    border-color: var(--flow-border) !important;
    color: var(--flow-text) !important;
  }

  .filter-control {
    min-width: 140px;
  }

  .filter-range {
    min-width: 280px;
  }

  .toolbar-actions {
    margin-left: auto;
    flex-shrink: 0;
  }

  .live-label {
    color: var(--flow-muted);
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .risk-legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--flow-border);
    font-size: 12px;
    color: var(--flow-muted);
  }

  .legend-title {
    font-weight: 600;
    color: var(--flow-text);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .legend-shape-line {
    width: 22px;
    height: 0;
    border-top-width: 3px;
    border-top-style: solid;
    display: inline-block;
  }

  .legend-shape-line.solid {
    border-color: #52c41a;
  }

  .legend-shape-line.dash.warn {
    border-top-style: dashed;
    border-color: #fa8c16;
  }

  .legend-shape-line.dash.high {
    border-top-style: dashed;
    border-color: #f5222d;
  }

  .legend-shape {
    display: inline-block;
    vertical-align: middle;
  }

  .legend-shape.circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #36cfc9;
    margin-right: 4px;
  }

  .legend-shape.diamond {
    width: 10px;
    height: 10px;
    background: #597ef7;
    transform: rotate(45deg);
    margin: 0 6px 0 8px;
  }

  .legend-shape.rect {
    width: 12px;
    height: 10px;
    background: #73d13d;
    margin-left: 4px;
  }

  .flow-body {
    flex: 1;
    display: flex;
    gap: 12px;
    min-height: 520px;
  }

  .sensitive-flow-page.is-chart-fullscreen .flow-body {
    min-height: 0;
    flex: 1;
  }

  .flow-chart-wrap {
    flex: 1;
    min-width: 0;
    background: var(--flow-panel);
    border: 1px solid var(--flow-border);
    border-radius: 8px;
    overflow: hidden;
  }

  .flow-chart {
    width: 100%;
    height: 100%;
    min-height: 480px;
    outline: none;
  }

  .sensitive-flow-page.is-chart-fullscreen .flow-chart {
    min-height: 0;
  }

  .flow-detail-panel {
    width: 30%;
    min-width: 280px;
    max-width: 420px;
    background: var(--flow-panel);
    border: 1px solid var(--flow-border);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    transition: width 0.2s ease;
  }

  .flow-detail-panel.collapsed {
    width: 48px;
    min-width: 48px;
  }

  .flow-detail-panel.collapsed .panel-body {
    display: none;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid var(--flow-border);
    font-weight: 600;
  }

  .panel-body {
    padding: 12px;
    overflow: auto;
    flex: 1;
  }

  .panel-badges {
    margin: 12px 0;
  }

  .panel-footer-actions {
    margin-top: 16px;
  }

  .mt-8 {
    margin-top: 8px;
  }

  :deep(.dark-descriptions .ant-descriptions-item-label) {
    background: #1a222c !important;
    color: var(--flow-muted) !important;
  }

  :deep(.dark-descriptions .ant-descriptions-item-content) {
    background: #141a22 !important;
    color: var(--flow-text) !important;
  }

  :deep(.ant-collapse-header) {
    color: var(--flow-text) !important;
  }

  :deep(.ant-empty-description) {
    color: var(--flow-muted) !important;
  }

  @keyframes node-risk-pulse {
    0%,
    100% {
      filter: drop-shadow(0 0 4px rgba(245, 34, 45, 0.5));
    }
    50% {
      filter: drop-shadow(0 0 14px rgba(245, 34, 45, 0.95));
    }
  }

  /* 异常节点闪烁：由 ECharts shadowBlur + 业务侧定时 refresh；此处为面板外补充说明样式 */
  @media (max-width: 992px) {
    .flow-body {
      flex-direction: column;
    }

    .flow-detail-panel {
      width: 100%;
      max-width: none;
      min-height: 240px;
    }
  }

  .sensitive-flow-page :deep(.ant-btn-default) {
    background: #1a222c;
    border-color: var(--flow-border);
    color: var(--flow-text);
  }

  .sensitive-flow-page :deep(.ant-btn-primary.ant-btn-background-ghost) {
    color: #69c0ff;
    border-color: #69c0ff;
  }

  .filter-compact {
    display: flex;
    align-items: center;
  }
</style>
