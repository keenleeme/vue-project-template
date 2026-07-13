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
                :disabled="refreshPaused"
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
                <a-button size="small" @click="refreshPaused = !refreshPaused">
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
            <a-button size="small" @click="exportReport">导出报告</a-button>
            <a-button size="small" @click="chartFullscreen = !chartFullscreen">
              {{ chartFullscreen ? '退出全屏' : '图表全屏' }}
            </a-button>
          </a-space>
        </div>
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
          <span>{{ selection?.title || '审计详情' }}</span>
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
            <section v-if="selection.requestPayload || selection.responsePayload" class="payload-section">
              <div class="section-title">报文详情</div>
              <a-tabs v-model:active-key="payloadActiveKey" size="small" class="payload-tabs">
                <a-tab-pane key="request" tab="请求报文">
                  <pre class="payload-code">{{ selection.requestPayload }}</pre>
                </a-tab-pane>
                <a-tab-pane key="response" tab="响应报文">
                  <pre class="payload-code">{{ selection.responsePayload }}</pre>
                </a-tab-pane>
              </a-tabs>
            </section>
            <div class="panel-footer-actions">
              <a-button type="primary" block ghost size="small" @click="addToWatchlist"> 加入监控 </a-button>
              <a-button block size="small" class="mt-8" @click="generateNodeReport"> 生成报告 </a-button>
            </div>
          </template>
          <a-empty v-else description="点击任意节点查看请求与响应报文" />
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
  type NodeKind = 'tag' | 'app' | 'api' | 'ip';

  type AuditLog = {
    id: string;
    time: string;
    operator: string;
    action: string;
    result: string;
    detail: string;
    color: string;
  };

  type FlowNode = {
    id: string;
    name: string;
    subtitle: string;
    kind: NodeKind;
    traffic: number;
    x: number;
    y: number;
    risk: RiskLevel;
    summary: { label: string; value: string }[];
    extra: { label: string; value: string }[];
    auditLogs: AuditLog[];
    requestPayload: string;
    responsePayload: string;
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
  const payloadActiveKey = ref('request');
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
      id: 'node1-tag',
      name: '节点1：数据标签',
      subtitle: '身份证号 / 手机号 / 银行卡号',
      kind: 'tag',
      traffic: 128,
      x: 80,
      y: 160,
      risk: 'normal',
      summary: [
        { label: '节点类型', value: '数据标签' },
        { label: '敏感级别', value: 'L3 高敏感' },
        { label: '命中字段', value: 'idNo、mobile、bankCardNo' }
      ],
      extra: [
        { label: '数据域', value: '客户信息域' },
        { label: '标签来源', value: 'DLP 自动识别 + 资产目录同步' },
        { label: '近 1h 访问量', value: '128 req/min' }
      ],
      auditLogs: [
        {
          id: 'tag-log-1',
          time: '2026-05-08 10:21:18',
          operator: 'system-dlp',
          action: '命中敏感数据标签',
          result: '已标记',
          detail: '请求参数命中身份证号、手机号与银行卡号组合标签。',
          color: 'blue'
        },
        {
          id: 'tag-log-2',
          time: '2026-05-08 10:21:19',
          operator: 'audit-engine',
          action: '生成访问审计事件',
          result: '成功',
          detail: '事件编号 EVT-DF-20260508-102119，已进入链路分析。',
          color: 'green'
        }
      ],
      requestPayload: JSON.stringify(
        {
          traceId: 'TRC-20260508-102118',
          fields: ['idNo', 'mobile', 'bankCardNo'],
          dataTags: ['PII_ID_CARD', 'PII_PHONE', 'FIN_BANK_CARD'],
          sensitivityLevel: 'L3'
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          matched: true,
          labels: ['身份证号', '手机号', '银行卡号'],
          policy: '客户敏感信息访问审计',
          nextNode: '访问应用'
        },
        null,
        2
      )
    },
    {
      id: 'node2-app',
      name: '节点2：访问应用',
      subtitle: '统一营销平台',
      kind: 'app',
      traffic: 96,
      x: 300,
      y: 160,
      risk: 'warning',
      abnormal: true,
      summary: [
        { label: '节点类型', value: '访问应用' },
        { label: '应用名称', value: '统一营销平台' },
        { label: '访问账号', value: 'mkt_exporter' }
      ],
      extra: [
        { label: '应用负责人', value: '营销中台 / 王某' },
        { label: '鉴权方式', value: 'OAuth2 Client Credential' },
        { label: '异常提示', value: '非例行导出窗口访问高敏字段' }
      ],
      auditLogs: [
        {
          id: 'app-log-1',
          time: '2026-05-08 10:22:03',
          operator: 'mkt_exporter',
          action: '发起客户明细查询',
          result: '鉴权通过',
          detail: '应用以服务账号访问客户画像与联系方式字段。',
          color: 'orange'
        },
        {
          id: 'app-log-2',
          time: '2026-05-08 10:22:05',
          operator: 'risk-policy',
          action: '触发访问策略校验',
          result: '需审计',
          detail: '命中“营销应用批量访问高敏标签”审计规则。',
          color: 'red'
        }
      ],
      requestPayload: JSON.stringify(
        {
          traceId: 'TRC-20260508-102203',
          appId: 'app-marketing-portal',
          account: 'mkt_exporter',
          scopes: ['customer:profile:read', 'customer:contact:read']
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          authResult: 'PASS',
          auditRequired: true,
          policyHit: '营销应用批量访问高敏标签',
          nextNode: '访问 API'
        },
        null,
        2
      )
    },
    {
      id: 'node3-api',
      name: '节点3：访问 API',
      subtitle: '/api/v1/customer/export',
      kind: 'api',
      traffic: 112,
      x: 540,
      y: 160,
      risk: 'high',
      hasNew: true,
      summary: [
        { label: '节点类型', value: '访问 API' },
        { label: 'API 路径', value: '/api/v1/customer/export' },
        { label: '请求方法', value: 'POST' }
      ],
      extra: [
        { label: '接口归属', value: '客户中心 / customer-service' },
        { label: '返回字段', value: '姓名、证件号、手机号、银行卡尾号' },
        { label: '调用统计', value: '近 1h 6,720 次，P99 820ms' }
      ],
      auditLogs: [
        {
          id: 'api-log-1',
          time: '2026-05-08 10:22:06',
          operator: 'api-gateway',
          action: '转发 API 请求',
          result: '200 OK',
          detail: '网关已记录请求头、请求参数、响应字段和脱敏状态。',
          color: 'green'
        },
        {
          id: 'api-log-2',
          time: '2026-05-08 10:22:07',
          operator: 'data-risk-engine',
          action: '识别批量导出行为',
          result: '高风险',
          detail: '单次导出 5000 条客户记录，包含 3 类敏感标签。',
          color: 'red'
        }
      ],
      requestPayload: JSON.stringify(
        {
          method: 'POST',
          path: '/api/v1/customer/export',
          headers: {
            'x-trace-id': 'TRC-20260508-102206',
            'x-app-id': 'app-marketing-portal'
          },
          body: {
            fields: ['name', 'idNo', 'mobile', 'bankCardNo'],
            exportFormat: 'xlsx',
            limit: 5000
          }
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          code: 0,
          message: 'success',
          data: {
            exportId: 'EXP-20260508-102206',
            rowCount: 5000,
            masked: false
          }
        },
        null,
        2
      )
    },
    {
      id: 'node4-ip',
      name: '节点4：访问 IP',
      subtitle: '10.11.42.53',
      kind: 'ip',
      traffic: 84,
      x: 780,
      y: 160,
      risk: 'high',
      zombie: true,
      summary: [
        { label: '节点类型', value: '访问 IP' },
        { label: '来源 IP', value: '10.11.42.53' },
        { label: '地理位置', value: '办公网出口 / 华东一区' }
      ],
      extra: [
        { label: '设备指纹', value: 'Windows-Edge-9F31' },
        { label: '访问次数', value: '近 1h 84 req/min' },
        { label: '风险原因', value: '出口 IP 非该应用常用访问段' }
      ],
      auditLogs: [
        {
          id: 'ip-log-1',
          time: '2026-05-08 10:22:08',
          operator: 'network-probe',
          action: '记录源 IP',
          result: '成功',
          detail: '检测到来源 IP 10.11.42.53，设备指纹 Windows-Edge-9F31。',
          color: 'blue'
        },
        {
          id: 'ip-log-2',
          time: '2026-05-08 10:22:10',
          operator: 'risk-policy',
          action: '访问段校验',
          result: '异常',
          detail: '来源 IP 与应用白名单网段不一致，建议复核访问主体。',
          color: 'red'
        }
      ],
      requestPayload: JSON.stringify(
        {
          sourceIp: '10.11.42.53',
          userAgent: 'Mozilla/5.0 Edge/122.0',
          requestId: 'REQ-20260508-102208',
          forwardedFor: ['10.11.42.53', '172.16.8.12']
        },
        null,
        2
      ),
      responsePayload: JSON.stringify(
        {
          disposition: 'ALLOW_WITH_AUDIT',
          riskScore: 86,
          reason: 'IP_NOT_IN_APP_BASELINE',
          suggestedAction: '复核应用账号与访问终端'
        },
        null,
        2
      )
    }
  ];

  const baseLinks: FlowLink[] = [
    { source: 'node1-tag', target: 'node2-app', risk: 'normal' },
    { source: 'node2-app', target: 'node3-api', risk: 'warning', newFlag: true },
    { source: 'node3-api', target: 'node4-ip', risk: 'high', bulk: true, nonCompliant: true }
  ];

  const graphNodes = ref<FlowNode[]>(JSON.parse(JSON.stringify(baseNodes)));
  const graphLinks = ref<FlowLink[]>(JSON.parse(JSON.stringify(baseLinks)));

  type DetailSelection = {
    type: 'node' | 'edge';
    title: string;
    summary: { label: string; value: string }[];
    extra: { label: string; value: string }[];
    auditLogs?: AuditLog[];
    requestPayload?: string;
    responsePayload?: string;
    badges?: string[];
  };

  const selection = ref<DetailSelection | null>(null);

  function symbolForKind(kind: NodeKind): string {
    if (kind === 'tag') return 'roundRect';
    if (kind === 'app') return 'diamond';
    if (kind === 'ip') return 'circle';
    return 'rect';
  }

  function nodeColor(kind: NodeKind, risk: RiskLevel): string {
    if (risk === 'high') return '#f5222d';
    if (risk === 'warning') return '#fa8c16';
    if (kind === 'tag') return '#36cfc9';
    if (kind === 'app') return '#597ef7';
    if (kind === 'ip') return '#9254de';
    return '#73d13d';
  }

  function buildChartOption(): echarts.EChartsOption {
    const nData = graphNodes.value.map((n) => {
      const size = 28 + Math.min(n.traffic / 4, 36);
      const labelText = `${n.hasNew ? 'NEW ' : ''}${n.name}\n${n.subtitle}`;
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
          borderColor: n.zombie ? '#faad14' : '#ffffff',
          borderWidth: n.zombie ? 2 : 1,
          borderType: n.zombie ? 'dashed' : 'solid',
          shadowBlur: n.abnormal ? (blinkPhase.value ? 22 : 6) : 0,
          shadowColor: 'rgba(245, 34, 45, 0.55)'
        },
        label: {
          show: true,
          formatter: labelText,
          color: '#1f2937',
          fontSize: 11,
          lineHeight: 16
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
          color: '#f5222d',
          fontSize: 10
        }
      };
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderColor: '#d9e2ef',
        textStyle: { color: '#1f2937' },
        formatter: (p: unknown) => {
          const param = p as {
            dataType?: string;
            data?: { source?: string; target?: string; name?: string; value?: number };
          };
          if (param.dataType === 'edge') {
            const { source, target } = param.data || {};
            return `${source} → ${target}<br/>点击节点查看请求与响应报文`;
          }
          const d = param.data;
          if (!d?.name) return '';
          return `${d.name}<br/>估算流量：${d.value ?? '-'} req/min<br/>点击查看报文详情`;
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
        detailCollapsed.value = false;
        payloadActiveKey.value = 'request';
        selection.value = {
          type: 'node',
          title: node.name,
          summary: node.summary,
          extra: node.extra,
          auditLogs: node.auditLogs,
          requestPayload: node.requestPayload,
          responsePayload: node.responsePayload,
          badges: [
            ...(node.hasNew ? ['NEW'] : []),
            ...(node.zombie ? ['异常 IP'] : []),
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
    if (!fromUser && !refreshPaused.value) {
      const hit = Math.random() > 0.85;
      if (hit) {
        notification.warning({
          message: '检测到新的异常行为',
          description: '已在相关路径上标记 NEW，请关注高风险链路。',
          placement: 'topRight',
          duration: 4
        });
        graphLinks.value = graphLinks.value.map((l) =>
          l.source === 'node2-app' && l.target === 'node3-api' ? { ...l, newFlag: true, risk: 'high' } : l
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

  function setupRefreshTimer() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (refreshPaused.value) return;
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

  watch(refreshPaused, () => {
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
    --flow-bg: #f5f7fb;
    --flow-panel: #ffffff;
    --flow-border: #d9e2ef;
    --flow-text: #1f2937;
    --flow-muted: #667085;
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
    box-shadow: 0 8px 24px rgba(19, 75, 234, 0.06);
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
    background: #ffffff !important;
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
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
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
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
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

  .payload-section {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--flow-border);
  }

  .section-title {
    margin-bottom: 12px;
    color: var(--flow-text);
    font-size: 13px;
    font-weight: 600;
  }

  .payload-code {
    max-height: 260px;
    margin: 0;
    padding: 12px;
    overflow: auto;
    background: #f8fafc;
    border: 1px solid var(--flow-border);
    border-radius: 6px;
    color: #1f2937;
    font-size: 12px;
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .mt-8 {
    margin-top: 8px;
  }

  :deep(.dark-descriptions .ant-descriptions-item-label) {
    background: #f8fafc !important;
    color: var(--flow-muted) !important;
  }

  :deep(.dark-descriptions .ant-descriptions-item-content) {
    background: #ffffff !important;
    color: var(--flow-text) !important;
  }

  :deep(.ant-collapse-header) {
    color: var(--flow-text) !important;
  }

  :deep(.payload-tabs .ant-tabs-tab) {
    color: var(--flow-muted);
  }

  :deep(.payload-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: var(--color-brand-normal, #134bea);
  }

  :deep(.payload-tabs .ant-tabs-ink-bar) {
    background: var(--color-brand-normal, #134bea);
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
    background: #ffffff;
    border-color: var(--flow-border);
    color: var(--flow-text);
  }

  .sensitive-flow-page :deep(.ant-btn-primary.ant-btn-background-ghost) {
    color: var(--color-brand-normal, #134bea);
    border-color: var(--color-brand-normal, #134bea);
  }

  .filter-compact {
    display: flex;
    align-items: center;
  }
</style>
