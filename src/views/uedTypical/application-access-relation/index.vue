<template>
  <div class="application-access-relation-container">
    <a-card style="height: 100%">
      <div class="page-header">
        <div>
          <h2>应用访问关系</h2>
          <p>展示应用之间通过接口产生的访问、依赖与异常调用关系。</p>
        </div>
        <a-space>
          <a-select
            v-model:value="selectedAppId"
            :options="appOptions"
            allow-clear
            show-search
            option-filter-prop="label"
            placeholder="请选择应用"
            style="width: 220px"
            @change="renderChart"
          />
          <a-button @click="resetSelection">重置视图</a-button>
        </a-space>
      </div>

      <div class="summary-grid">
        <div v-for="item in summaryCards" :key="item.label" class="summary-card">
          <span class="summary-label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <span class="summary-desc">{{ item.desc }}</span>
        </div>
      </div>

      <div class="relation-layout">
        <section class="relation-chart-panel">
          <div class="panel-title">
            <span>应用调用关系图</span>
            <span>{{ relationTitle }}</span>
          </div>
          <div ref="chartRef" class="relation-chart" />
        </section>

        <aside class="relation-detail-panel">
          <div class="panel-title">
            <span>访问详情</span>
            <span>{{ selectedDetail?.typeText || '点击节点或连线查看' }}</span>
          </div>
          <template v-if="selectedDetail">
            <a-descriptions :column="1" bordered size="small" class="detail-descriptions">
              <a-descriptions-item v-for="row in selectedDetail.rows" :key="row.label" :label="row.label">
                {{ row.value }}
              </a-descriptions-item>
            </a-descriptions>
            <div class="detail-section">
              <div class="detail-section-title">调用链路</div>
              <a-timeline>
                <a-timeline-item v-for="step in selectedDetail.timeline" :key="step">
                  {{ step }}
                </a-timeline-item>
              </a-timeline>
            </div>
          </template>
          <a-empty v-else description="选择应用、接口或调用连线查看访问关系" />
        </aside>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts';
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

  type RiskLevel = 'normal' | 'warning' | 'high';
  type NodeType = 'app' | 'api';

  type RelationNode = {
    id: string;
    name: string;
    type: NodeType;
    owner: string;
    description: string;
    risk: RiskLevel;
    x: number;
    y: number;
    symbolSize: number;
  };

  type RelationLink = {
    source: string;
    target: string;
    api: string;
    method: string;
    qps: number;
    latency: string;
    risk: RiskLevel;
    auth: string;
    desc: string;
  };

  type SelectedDetail = {
    typeText: string;
    rows: { label: string; value: string }[];
    timeline: string[];
  };

  type AccessStat = {
    inboundApps: number;
    inboundCalls: string;
    inboundPeakQps: number;
    outboundApps: number;
    outboundCalls: string;
    outboundPeakQps: number;
  };

  const chartRef = ref<HTMLElement | null>(null);
  const selectedDetail = ref<SelectedDetail | null>(null);
  const selectedAppId = ref<string | undefined>(undefined);
  let chart: echarts.ECharts | null = null;

  const riskOptions = [
    { label: '正常', value: 'normal' },
    { label: '关注', value: 'warning' },
    { label: '高风险', value: 'high' }
  ];

  const defaultAccessStats: AccessStat = {
    inboundApps: 18,
    inboundCalls: '42.8万',
    inboundPeakQps: 1240,
    outboundApps: 22,
    outboundCalls: '58.6万',
    outboundPeakQps: 1568
  };

  const appAccessStats: Record<string, AccessStat> = {
    'app-crm': {
      inboundApps: 6,
      inboundCalls: '12.4万',
      inboundPeakQps: 486,
      outboundApps: 5,
      outboundCalls: '9.8万',
      outboundPeakQps: 392
    },
    'app-order': {
      inboundApps: 4,
      inboundCalls: '18.9万',
      inboundPeakQps: 738,
      outboundApps: 6,
      outboundCalls: '21.6万',
      outboundPeakQps: 861
    },
    'app-risk': {
      inboundApps: 5,
      inboundCalls: '6.7万',
      inboundPeakQps: 264,
      outboundApps: 4,
      outboundCalls: '4.2万',
      outboundPeakQps: 188
    },
    'app-bi': {
      inboundApps: 7,
      inboundCalls: '15.2万',
      inboundPeakQps: 524,
      outboundApps: 5,
      outboundCalls: '10.3万',
      outboundPeakQps: 341
    },
    'app-payment': {
      inboundApps: 3,
      inboundCalls: '9.1万',
      inboundPeakQps: 356,
      outboundApps: 2,
      outboundCalls: '2.8万',
      outboundPeakQps: 116
    },
    'app-message': {
      inboundApps: 8,
      inboundCalls: '23.5万',
      inboundPeakQps: 932,
      outboundApps: 3,
      outboundCalls: '7.6万',
      outboundPeakQps: 288
    },
    'app-credit': {
      inboundApps: 2,
      inboundCalls: '1.8万',
      inboundPeakQps: 96,
      outboundApps: 1,
      outboundCalls: '0.6万',
      outboundPeakQps: 32
    },
    'app-datahub': {
      inboundApps: 6,
      inboundCalls: '17.3万',
      inboundPeakQps: 604,
      outboundApps: 7,
      outboundCalls: '24.9万',
      outboundPeakQps: 875
    },
    'app-ticket': {
      inboundApps: 3,
      inboundCalls: '3.9万',
      inboundPeakQps: 148,
      outboundApps: 4,
      outboundCalls: '5.4万',
      outboundPeakQps: 214
    },
    'app-auth': {
      inboundApps: 11,
      inboundCalls: '36.2万',
      inboundPeakQps: 1326,
      outboundApps: 3,
      outboundCalls: '8.1万',
      outboundPeakQps: 301
    },
    'app-inventory': {
      inboundApps: 4,
      inboundCalls: '8.6万',
      inboundPeakQps: 332,
      outboundApps: 3,
      outboundCalls: '6.9万',
      outboundPeakQps: 276
    },
    'app-mask': {
      inboundApps: 5,
      inboundCalls: '4.8万',
      inboundPeakQps: 176,
      outboundApps: 2,
      outboundCalls: '3.1万',
      outboundPeakQps: 124
    }
  };

  const relationNodes: RelationNode[] = [
    {
      id: 'app-crm',
      name: 'CRM 客户中心',
      type: 'app',
      owner: '客户经营组',
      description: '客户资料查询与销售跟进入口',
      risk: 'normal',
      x: 80,
      y: 120,
      symbolSize: 72
    },
    {
      id: 'api-customer-query',
      name: '/api/customer/query',
      type: 'api',
      owner: 'API 网关',
      description: '客户基础信息查询接口',
      risk: 'normal',
      x: 300,
      y: 120,
      symbolSize: 58
    },
    {
      id: 'app-order',
      name: '订单服务',
      type: 'app',
      owner: '交易平台组',
      description: '订单明细、支付状态和履约数据服务',
      risk: 'warning',
      x: 540,
      y: 90,
      symbolSize: 68
    },
    {
      id: 'api-risk-export',
      name: '/api/risk/export',
      type: 'api',
      owner: 'API 网关',
      description: '风险名单导出接口',
      risk: 'high',
      x: 300,
      y: 260,
      symbolSize: 62
    },
    {
      id: 'app-risk',
      name: '风控分析平台',
      type: 'app',
      owner: '安全运营组',
      description: '风险事件分析与名单处置',
      risk: 'high',
      x: 540,
      y: 260,
      symbolSize: 72
    },
    {
      id: 'app-bi',
      name: '经营分析 BI',
      type: 'app',
      owner: '数据中台组',
      description: '经营指标看板与自助分析',
      risk: 'warning',
      x: 80,
      y: 260,
      symbolSize: 70
    },
    {
      id: 'api-order-pay',
      name: '/api/order/pay/status',
      type: 'api',
      owner: 'API 网关',
      description: '订单支付状态查询接口',
      risk: 'normal',
      x: 760,
      y: 90,
      symbolSize: 58
    },
    {
      id: 'app-payment',
      name: '支付网关',
      type: 'app',
      owner: '资金清算组',
      description: '聚合支付渠道、清算状态和退款能力',
      risk: 'normal',
      x: 980,
      y: 90,
      symbolSize: 68
    },
    {
      id: 'api-notice-send',
      name: '/api/notice/send',
      type: 'api',
      owner: 'API 网关',
      description: '短信、邮件、站内信统一发送接口',
      risk: 'warning',
      x: 760,
      y: 220,
      symbolSize: 58
    },
    {
      id: 'app-message',
      name: '消息通知中心',
      type: 'app',
      owner: '平台基础组',
      description: '统一处理消息模板、触达通道与发送回执',
      risk: 'warning',
      x: 980,
      y: 220,
      symbolSize: 70
    },
    {
      id: 'api-credit-query',
      name: '/api/credit/query',
      type: 'api',
      owner: 'API 网关',
      description: '第三方征信查询接口',
      risk: 'high',
      x: 760,
      y: 360,
      symbolSize: 62
    },
    {
      id: 'app-credit',
      name: '第三方征信服务',
      type: 'app',
      owner: '外部合作方',
      description: '提供客户征信评分和黑名单校验',
      risk: 'high',
      x: 980,
      y: 360,
      symbolSize: 72
    },
    {
      id: 'api-data-sync',
      name: '/api/data/sync',
      type: 'api',
      owner: 'API 网关',
      description: '跨系统客户与交易数据同步接口',
      risk: 'warning',
      x: 300,
      y: 400,
      symbolSize: 58
    },
    {
      id: 'app-datahub',
      name: '数据交换平台',
      type: 'app',
      owner: '数据平台组',
      description: '统一承载跨应用数据交换、落库和分发',
      risk: 'warning',
      x: 540,
      y: 420,
      symbolSize: 72
    },
    {
      id: 'app-ticket',
      name: '客服工单系统',
      type: 'app',
      owner: '客户服务组',
      description: '处理客户咨询、投诉和售后工单',
      risk: 'normal',
      x: 80,
      y: 540,
      symbolSize: 68
    },
    {
      id: 'app-auth',
      name: '权限认证中心',
      type: 'app',
      owner: '平台安全组',
      description: '统一管理账号、角色、Token 和权限校验',
      risk: 'normal',
      x: 300,
      y: 560,
      symbolSize: 70
    },
    {
      id: 'app-inventory',
      name: '库存履约系统',
      type: 'app',
      owner: '供应链平台组',
      description: '管理库存锁定、发货履约和仓配状态',
      risk: 'warning',
      x: 760,
      y: 540,
      symbolSize: 70
    },
    {
      id: 'app-mask',
      name: '数据脱敏服务',
      type: 'app',
      owner: '数据安全组',
      description: '提供敏感字段识别、脱敏和水印能力',
      risk: 'high',
      x: 980,
      y: 540,
      symbolSize: 72
    }
  ];

  const relationLinks: RelationLink[] = [
    {
      source: 'app-crm',
      target: 'api-customer-query',
      api: '/api/customer/query',
      method: 'GET',
      qps: 186,
      latency: '86ms',
      risk: 'normal',
      auth: 'OAuth2',
      desc: 'CRM 通过客户查询接口访问订单服务客户快照。'
    },
    {
      source: 'api-customer-query',
      target: 'app-order',
      api: '/api/customer/query',
      method: 'GET',
      qps: 186,
      latency: '86ms',
      risk: 'normal',
      auth: 'OAuth2',
      desc: '订单服务响应客户基础信息与最近订单概览。'
    },
    {
      source: 'app-bi',
      target: 'api-risk-export',
      api: '/api/risk/export',
      method: 'POST',
      qps: 42,
      latency: '420ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: 'BI 发起风险名单导出，包含批量下载行为。'
    },
    {
      source: 'api-risk-export',
      target: 'app-risk',
      api: '/api/risk/export',
      method: 'POST',
      qps: 42,
      latency: '420ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '风控分析平台返回风险名单和处置状态。'
    },
    {
      source: 'app-crm',
      target: 'app-risk',
      api: '/api/risk/check',
      method: 'POST',
      qps: 73,
      latency: '135ms',
      risk: 'warning',
      auth: 'JWT',
      desc: 'CRM 在客户跟进前调用风控校验能力。'
    },
    {
      source: 'app-order',
      target: 'api-order-pay',
      api: '/api/order/pay/status',
      method: 'GET',
      qps: 238,
      latency: '72ms',
      risk: 'normal',
      auth: 'mTLS',
      desc: '订单服务查询支付网关中的支付状态和退款进度。'
    },
    {
      source: 'api-order-pay',
      target: 'app-payment',
      api: '/api/order/pay/status',
      method: 'GET',
      qps: 238,
      latency: '72ms',
      risk: 'normal',
      auth: 'mTLS',
      desc: '支付网关返回渠道流水、支付状态和退款标识。'
    },
    {
      source: 'app-order',
      target: 'api-notice-send',
      api: '/api/notice/send',
      method: 'POST',
      qps: 118,
      latency: '158ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '订单状态变化后调用通知中心发送履约提醒。'
    },
    {
      source: 'api-notice-send',
      target: 'app-message',
      api: '/api/notice/send',
      method: 'POST',
      qps: 118,
      latency: '158ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '消息通知中心根据模板和用户偏好分发短信、邮件和站内信。'
    },
    {
      source: 'app-risk',
      target: 'api-credit-query',
      api: '/api/credit/query',
      method: 'POST',
      qps: 24,
      latency: '680ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '风控分析平台调用第三方征信查询客户评分，涉及外部数据出域。'
    },
    {
      source: 'api-credit-query',
      target: 'app-credit',
      api: '/api/credit/query',
      method: 'POST',
      qps: 24,
      latency: '680ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '第三方征信服务返回评分、命中名单和风险原因。'
    },
    {
      source: 'app-bi',
      target: 'api-data-sync',
      api: '/api/data/sync',
      method: 'POST',
      qps: 64,
      latency: '310ms',
      risk: 'warning',
      auth: 'OAuth2',
      desc: '经营分析 BI 将指标口径与客户分群结果同步到数据交换平台。'
    },
    {
      source: 'api-data-sync',
      target: 'app-datahub',
      api: '/api/data/sync',
      method: 'POST',
      qps: 64,
      latency: '310ms',
      risk: 'warning',
      auth: 'OAuth2',
      desc: '数据交换平台接收同步任务并分发给下游订阅应用。'
    },
    {
      source: 'app-datahub',
      target: 'app-message',
      api: '/api/audience/push',
      method: 'POST',
      qps: 37,
      latency: '246ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '数据交换平台将客户分群结果推送给消息通知中心用于触达。'
    },
    {
      source: 'app-payment',
      target: 'app-bi',
      api: '/api/settlement/report',
      method: 'GET',
      qps: 31,
      latency: '192ms',
      risk: 'normal',
      auth: 'OAuth2',
      desc: '支付网关向经营分析 BI 提供清算日报和渠道成功率指标。'
    },
    {
      source: 'app-ticket',
      target: 'app-crm',
      api: '/api/customer/context',
      method: 'GET',
      qps: 96,
      latency: '118ms',
      risk: 'normal',
      auth: 'JWT',
      desc: '客服工单系统拉取客户基础资料和最近服务记录。'
    },
    {
      source: 'app-crm',
      target: 'app-auth',
      api: '/api/auth/permission/check',
      method: 'POST',
      qps: 164,
      latency: '45ms',
      risk: 'normal',
      auth: 'mTLS',
      desc: 'CRM 在进入客户详情前校验账号的数据访问权限。'
    },
    {
      source: 'app-auth',
      target: 'app-crm',
      api: '/api/auth/session/refresh',
      method: 'POST',
      qps: 88,
      latency: '52ms',
      risk: 'normal',
      auth: 'mTLS',
      desc: '权限认证中心向 CRM 回写会话刷新和权限变更通知。'
    },
    {
      source: 'app-order',
      target: 'app-inventory',
      api: '/api/inventory/lock',
      method: 'POST',
      qps: 146,
      latency: '124ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '订单服务创建订单时调用库存履约系统锁定库存。'
    },
    {
      source: 'app-inventory',
      target: 'app-order',
      api: '/api/order/fulfillment/callback',
      method: 'POST',
      qps: 132,
      latency: '139ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '库存履约系统将发货、缺货和仓配异常状态回调给订单服务。'
    },
    {
      source: 'app-risk',
      target: 'app-mask',
      api: '/api/security/mask',
      method: 'POST',
      qps: 58,
      latency: '206ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '风控分析平台在导出名单前调用数据脱敏服务处理敏感字段。'
    },
    {
      source: 'app-mask',
      target: 'app-datahub',
      api: '/api/datahub/secure-write',
      method: 'POST',
      qps: 52,
      latency: '238ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '数据脱敏服务将脱敏后的名单和水印结果写入数据交换平台。'
    },
    {
      source: 'app-message',
      target: 'app-ticket',
      api: '/api/ticket/create',
      method: 'POST',
      qps: 29,
      latency: '174ms',
      risk: 'warning',
      auth: 'JWT',
      desc: '消息通知中心在触达失败时自动生成客服跟进工单。'
    },
    {
      source: 'app-bi',
      target: 'app-mask',
      api: '/api/security/report-mask',
      method: 'POST',
      qps: 43,
      latency: '268ms',
      risk: 'high',
      auth: 'AccessKey',
      desc: '经营分析 BI 在导出报表前调用数据脱敏服务处理客户标识字段。'
    }
  ];

  const appOptions = computed(() =>
    relationNodes.filter((item) => item.type === 'app').map((item) => ({ label: item.name, value: item.id }))
  );

  const selectedAppNode = computed(() => relationNodes.find((item) => item.id === selectedAppId.value));

  const appRelationLinks = computed(() => {
    const appToAppLinks: RelationLink[] = [];

    relationLinks.forEach((link) => {
      if (isAppNode(link.source) && isAppNode(link.target)) {
        appToAppLinks.push(link);
        return;
      }

      if (isAppNode(link.source) && isApiNode(link.target)) {
        const apiToApp = relationLinks.find((item) => item.source === link.target && isAppNode(item.target));
        if (!apiToApp) return;
        appToAppLinks.push({
          ...link,
          target: apiToApp.target,
          risk: link.risk === 'high' || apiToApp.risk === 'high' ? 'high' : link.risk,
          latency: apiToApp.latency,
          desc: `${link.desc}${apiToApp.desc}`
        });
      }
    });

    const dedupeMap = new Map<string, RelationLink>();
    appToAppLinks.forEach((link) => {
      dedupeMap.set(`${link.source}-${link.target}-${link.method}-${link.api}`, link);
    });
    return Array.from(dedupeMap.values());
  });

  const selectedRelationLinks = computed(() => {
    if (!selectedAppId.value) return appRelationLinks.value;
    return appRelationLinks.value.filter((link) => link.source === selectedAppId.value || link.target === selectedAppId.value);
  });

  const filteredNodeIds = computed(() => {
    return new Set(selectedRelationLinks.value.flatMap((item) => [item.source, item.target]));
  });

  const relationTitle = computed(() => {
    if (!selectedAppNode.value) return '全部应用访问关系';
    return `${selectedAppNode.value.name} 的上下游访问关系`;
  });

  const currentAccessStats = computed(() => {
    if (!selectedAppId.value) return defaultAccessStats;
    return appAccessStats[selectedAppId.value] || defaultAccessStats;
  });

  const summaryCards = computed(() => [
    {
      label: '当前应用',
      value: selectedAppNode.value?.name || '全部',
      desc: selectedAppNode.value ? selectedAppNode.value.owner : '展示全量访问网络'
    },
    {
      label: '被访问来源',
      value: `${currentAccessStats.value.inboundApps} 个`,
      desc: `今日 ${currentAccessStats.value.inboundCalls} 次 / 峰值 ${currentAccessStats.value.inboundPeakQps} QPS`
    },
    {
      label: '访问目标',
      value: `${currentAccessStats.value.outboundApps} 个`,
      desc: `今日 ${currentAccessStats.value.outboundCalls} 次 / 峰值 ${currentAccessStats.value.outboundPeakQps} QPS`
    },
    {
      label: '相关调用',
      value: selectedRelationLinks.value.length,
      desc: `${selectedRelationLinks.value.filter((item) => item.risk === 'high').length} 条高风险`
    }
  ]);

  function getRiskColor(risk: RiskLevel) {
    if (risk === 'high') return '#f53c3c';
    if (risk === 'warning') return '#f3a700';
    return '#134bea';
  }

  function isAppNode(id: string) {
    return relationNodes.some((item) => item.id === id && item.type === 'app');
  }

  function isApiNode(id: string) {
    return relationNodes.some((item) => item.id === id && item.type === 'api');
  }

  function buildOption(): echarts.EChartsOption {
    const nodes = relationNodes
      .filter((item) => item.type === 'app' && filteredNodeIds.value.has(item.id))
      .map((item) => ({
        id: item.id,
        name: item.name,
        x: item.x,
        y: item.y,
        value: item.description,
        category: 0,
        symbol: 'roundRect',
        symbolSize: item.symbolSize,
        itemStyle: {
          color: '#e8f2ff',
          borderColor: getRiskColor(item.risk),
          borderWidth: 2,
          shadowBlur: item.risk === 'high' ? 14 : 8,
          shadowColor: item.risk === 'high' ? 'rgba(245, 60, 60, 0.22)' : 'rgba(19, 75, 234, 0.14)'
        },
        label: {
          show: true,
          color: '#1f2937',
          fontSize: 12,
          lineHeight: 16,
          formatter: item.name
        }
      }));

    const links = selectedRelationLinks.value.map((item) => ({
      source: item.source,
      target: item.target,
      value: item.desc,
      lineStyle: {
        color: getRiskColor(item.risk),
        width: item.risk === 'high' ? 3 : 2,
        curveness: 0.14,
        type: item.risk === 'high' ? 'dashed' : 'solid'
      },
      label: {
        show: false,
        color: getRiskColor(item.risk),
        fontSize: 11,
        formatter: `${item.method} ${item.api}`
      }
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderColor: '#d9e2ef',
        textStyle: { color: '#1f2937' },
        formatter: (params: unknown) => {
          const item = params as { dataType?: string; data?: { name?: string; value?: string } };
          if (item.dataType === 'edge') return item.data?.value || '';
          return `${item.data?.name || ''}<br/>${item.data?.value || ''}`;
        }
      },
      legend: {
        top: 8,
        right: 16,
        data: ['应用']
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          roam: true,
          draggable: true,
          categories: [{ name: '应用' }],
          data: nodes as unknown as echarts.GraphSeriesOption['data'],
          links: links as unknown as echarts.GraphSeriesOption['links'],
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 8,
          label: { position: 'inside' },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 4 }
          }
        }
      ]
    };
  }

  function renderChart() {
    if (!chart) return;
    selectedDetail.value = null;
    chart.setOption(buildOption(), true);
  }

  function resetSelection() {
    selectedAppId.value = undefined;
    selectedDetail.value = null;
    renderChart();
  }

  function bindChartEvents() {
    if (!chart) return;
    chart.off('click');
    chart.on('click', (params) => {
      const data = params as {
        dataType?: string;
        data?: Record<string, unknown> & { id?: string; source?: string; target?: string; name?: string };
      };
      if (data.dataType === 'edge') {
        const link = selectedRelationLinks.value.find(
          (item) => item.source === data.data?.source && item.target === data.data?.target
        );
        if (link) selectLink(link);
        return;
      }
      const node = relationNodes.find((item) => item.id === data.data?.id || item.name === data.data?.name);
      if (node) selectNode(node);
    });
  }

  function selectNode(node: RelationNode) {
    selectedDetail.value = {
      typeText: '应用节点',
      rows: [
        { label: '名称', value: node.name },
        { label: '类型', value: '应用' },
        { label: '负责人', value: node.owner },
        { label: '风险等级', value: riskOptions.find((item) => item.value === node.risk)?.label || '-' },
        { label: '说明', value: node.description }
      ],
      timeline: appRelationLinks.value
        .filter((item) => item.source === node.id || item.target === node.id)
        .map((item) => `${getNodeName(item.source)} 通过 ${item.method} ${item.api} 访问 ${getNodeName(item.target)}`)
    };
  }

  function selectLink(link: RelationLink) {
    selectedDetail.value = {
      typeText: '调用关系',
      rows: [
        { label: '调用方', value: getNodeName(link.source) },
        { label: '被调方', value: getNodeName(link.target) },
        { label: '访问接口', value: `${link.method} ${link.api}` },
        { label: '认证方式', value: link.auth },
        { label: 'QPS', value: String(link.qps) },
        { label: '平均延迟', value: link.latency },
        { label: '风险等级', value: riskOptions.find((item) => item.value === link.risk)?.label || '-' }
      ],
      timeline: [
        `${getNodeName(link.source)} 发起调用请求`,
        `API 网关校验 ${link.auth} 凭证并转发 ${link.api}`,
        `${getNodeName(link.target)} 响应业务数据，平均延迟 ${link.latency}`
      ]
    };
  }

  function getNodeName(id: string) {
    return relationNodes.find((item) => item.id === id)?.name || id;
  }

  function resizeChart() {
    chart?.resize();
  }

  onMounted(async () => {
    await nextTick();
    if (chartRef.value) {
      chart = echarts.init(chartRef.value);
      renderChart();
      bindChartEvents();
    }
    window.addEventListener('resize', resizeChart);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart);
    chart?.dispose();
    chart = null;
  });
</script>

<script lang="ts">
  export default {
    name: 'ApplicationAccessRelation'
  };
</script>

<style scoped lang="less">
  .application-access-relation-container {
    height: 100%;
    padding: 20px;

    :deep(.ant-card-body) {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 16px;

    h2 {
      margin: 0 0 8px;
      color: var(--color-text-primarys, #1f2937);
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--color-text-secondary, #667085);
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .summary-card {
    padding: 14px 16px;
    border: 1px solid #d9e2ef;
    border-radius: 10px;
    background: linear-gradient(135deg, #ffffff 0%, #f6f9ff 100%);

    strong {
      display: block;
      margin: 6px 0 4px;
      color: #134bea;
      font-size: 24px;
      line-height: 1;
    }
  }

  .summary-label,
  .summary-desc {
    color: #667085;
    font-size: 12px;
  }

  .relation-layout {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 16px;
  }

  .relation-chart-panel,
  .relation-detail-panel {
    min-height: 0;
    border: 1px solid #d9e2ef;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  }

  .relation-chart-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .relation-detail-panel {
    padding: 16px;
    overflow: auto;
  }

  .panel-title {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 1px solid #edf1f7;
    color: #1f2937;
    font-weight: 600;

    span:last-child {
      color: #667085;
      font-size: 12px;
      font-weight: 400;
    }
  }

  .relation-detail-panel .panel-title {
    padding: 0 0 14px;
    margin-bottom: 16px;
  }

  .relation-chart {
    flex: 1;
    min-height: 480px;
  }

  .detail-section {
    margin-top: 18px;
  }

  .detail-section-title {
    margin-bottom: 12px;
    color: #1f2937;
    font-weight: 600;
  }

  :deep(.detail-descriptions .ant-descriptions-item-label) {
    width: 92px;
    background: #f8fafc;
    color: #667085;
  }

  @media (max-width: 1200px) {
    .summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .relation-layout {
      grid-template-columns: 1fr;
    }

    .relation-detail-panel {
      min-height: 280px;
    }
  }
</style>
