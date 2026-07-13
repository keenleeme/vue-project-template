import type { ReportCardItem, ReportKpiItem, ReportTableRow } from './types';

export const reportTemplateTagMap: Record<ReportCardItem['id'], string> = {
  'api-security-ops': 'API 数据安全运营',
  'application-asset-analysis': '应用资产综合分析',
  'api-asset-analysis': 'API 资产综合分析'
};

export const reportCards: ReportCardItem[] = [
  {
    id: 'api-security-ops',
    title: 'API 数据安全运营报表',
    description: '汇总 API 风险事件、告警处置、访问异常与运营闭环情况，适用于安全运营周报/月报。',
    audience: '安全运营',
    updateCycle: '每周 / 每月',
    lastGeneratedAt: '2026-06-04 08:30:00',
    route: '/report-management/api-security-ops',
    tags: ['风险趋势', '告警处置', 'Top 风险 API'],
    theme: 'api'
  },
  {
    id: 'application-asset-analysis',
    title: '应用资产综合分析报表',
    description: '应用维度深度分析：概览看板 + 单应用下钻，透视缺陷、攻击与行为风险。',
    audience: '安全运营 / 应用负责人',
    updateCycle: '每周 / 每月',
    lastGeneratedAt: '2026-06-23 09:00:00',
    route: '/report-management/application-asset-analysis',
    tags: ['应用概览', 'TOP榜单', '单应用下钻'],
    theme: 'app-grid'
  },
  {
    id: 'api-asset-analysis',
    title: 'API 资产综合分析报表',
    description: '从资产发现、生命周期、敏感暴露、脆弱性等维度分析 API 资产健康度。',
    audience: '安全运营 / 应用负责人',
    updateCycle: '每月',
    lastGeneratedAt: '2026-06-03 18:00:00',
    route: '/report-management/api-asset-analysis',
    tags: ['资产盘点', '敏感暴露', '脆弱性'],
    theme: 'api-plug'
  }
];

export const reportAppFilterOptions = [
  { label: '全部', value: 'all' },
  { label: '订单中心', value: 'app-order' },
  { label: '支付网关', value: 'app-pay' },
  { label: '用户中心', value: 'app-user' },
  { label: '报表服务', value: 'app-report' },
  { label: '统一认证', value: 'app-auth' }
];

export const reportApiFilterOptions = [
  { label: '全部', value: 'all', appId: 'all' },
  { label: '/api/order/export', value: '/api/order/export', appId: 'app-order' },
  { label: '/api/order/list', value: '/api/order/list', appId: 'app-order' },
  { label: '/api/payment/refund', value: '/api/payment/refund', appId: 'app-pay' },
  { label: '/api/user/profile', value: '/api/user/profile', appId: 'app-user' },
  { label: '/api/report/download', value: '/api/report/download', appId: 'app-report' },
  { label: '/api/auth/token', value: '/api/auth/token', appId: 'app-auth' }
];

export const reportHistoryList = [
  {
    id: 'h1',
    reportName: 'API 安全运营周报',
    remark: '每周安全趋势分析',
    templateType: 'api-security-ops' as const,
    templateTag: 'API 数据安全运营',
    filterApp: '全部',
    filterTime: '2026-06-03 ~ 2026-06-09',
    createdAt: '2026-06-10 14:30',
    status: '成功' as const
  },
  {
    id: 'h2',
    reportName: '应用资产健康度报告',
    remark: '应用维度风险分析',
    templateType: 'application-asset-analysis' as const,
    templateTag: '应用资产综合分析',
    filterApp: '订单中心',
    filterTime: '2026-06-01 ~ 2026-06-15',
    createdAt: '2026-06-16 09:15',
    status: '生成中' as const
  },
  {
    id: 'h3',
    reportName: '支付网关 API 风险报告',
    remark: '支付相关 API 专项分析',
    templateType: 'api-asset-analysis' as const,
    templateTag: 'API 资产综合分析',
    filterApi: '/api/payment/*',
    filterTime: '2026-05-20 ~ 2026-06-20',
    createdAt: '2026-06-21 16:45',
    status: '失败' as const,
    failReason: '数据源连接超时'
  },
  {
    id: 'h4',
    reportName: '月度安全态势总览',
    remark: '全平台安全态势汇总',
    templateType: 'api-security-ops' as const,
    templateTag: 'API 数据安全运营',
    filterApp: '全部',
    filterTime: '2026-05-01 ~ 2026-05-31',
    createdAt: '2026-06-01 08:00',
    status: '待开始' as const
  },
  {
    id: 'h5',
    reportName: '用户中心应用分析报告',
    remark: '单应用深度下钻分析',
    templateType: 'application-asset-analysis' as const,
    templateTag: '应用资产综合分析',
    filterApp: '用户中心',
    filterTime: '2026-06-10 ~ 2026-06-23',
    createdAt: '2026-06-23 11:20',
    status: '成功' as const
  }
];

export const reportSubscriptionList = [
  {
    id: 's1',
    templateName: 'API 数据安全运营报表',
    cycle: '每周一 08:00',
    nextRunAt: '2026-06-30 08:00:00',
    status: '已启用' as const,
    subscriber: '安全运营组'
  },
  {
    id: 's2',
    templateName: '应用资产综合分析报表',
    cycle: '每月 1 日 09:00',
    nextRunAt: '2026-07-01 09:00:00',
    status: '已启用' as const,
    subscriber: '应用治理组'
  },
  {
    id: 's3',
    templateName: 'API 资产综合分析报表',
    cycle: '每月 1 日 09:00',
    nextRunAt: '2026-07-01 09:00:00',
    status: '已暂停' as const,
    subscriber: '张三'
  }
];

export const apiSecurityOpsKpis: ReportKpiItem[] = [
  { label: '监测 API 总数', value: '12,486', hint: '较上期 +3.2%', trend: 'up', trendText: '+386' },
  { label: '新增风险事件', value: 328, hint: '近 7 天', trend: 'down', trendText: '-12%' },
  { label: '待处置告警', value: 47, hint: '高危 9 条', trend: 'flat', trendText: '持平' },
  { label: '处置闭环率', value: '86.4%', hint: '目标 ≥ 85%', trend: 'up', trendText: '+2.1%' }
];

export const apiSecurityOpsTrend = {
  dates: ['05-30', '05-31', '06-01', '06-02', '06-03', '06-04', '06-05'],
  risk: [42, 38, 51, 46, 39, 44, 36],
  alert: [28, 31, 35, 29, 33, 30, 27]
};

export const apiSecurityOpsRiskTypes = [
  { name: '越权访问', value: 86 },
  { name: '敏感数据泄露', value: 64 },
  { name: '异常流量', value: 52 },
  { name: '弱认证', value: 41 },
  { name: '参数篡改', value: 33 },
  { name: '其他', value: 18 }
];

export const apiSecurityOpsTable: ReportTableRow[] = [
  { key: '1', api: '/api/order/create', app: '订单中心', level: '高危', events: 18, status: '处置中' },
  { key: '2', api: '/api/user/profile', app: '用户中心', level: '高危', events: 14, status: '待确认' },
  { key: '3', api: '/api/payment/refund', app: '支付网关', level: '中危', events: 11, status: '已闭环' },
  { key: '4', api: '/api/report/export', app: '报表服务', level: '中危', events: 9, status: '处置中' },
  { key: '5', api: '/api/auth/token', app: '统一认证', level: '低危', events: 7, status: '已闭环' }
];

export const apiAssetKpis: ReportKpiItem[] = [
  { label: '已纳管 API', value: '12,486', hint: '覆盖率 94.6%' },
  { label: '僵尸 API', value: 218, hint: '90 天无访问', trend: 'down', trendText: '-6%' },
  { label: '涉敏 API', value: 1_024, hint: '含 PII / 金融字段' },
  { label: '存在脆弱性', value: 156, hint: '需优先整改', trend: 'up', trendText: '+8' }
];

export const apiAssetLifecycle = [
  { name: '活跃', value: 8420 },
  { name: '低频', value: 2848 },
  { name: '僵尸', value: 218 }
];

export const apiAssetSensitivity = [
  { name: '高敏', value: 312 },
  { name: '中敏', value: 712 },
  { name: '低敏', value: 486 },
  { name: '未标注', value: 10976 }
];

export const apiAssetTable: ReportTableRow[] = [
  { key: '1', api: '/api/customer/idcard', sensitivity: '高敏', exposure: '公网', vuln: 3, owner: '客户域' },
  { key: '2', api: '/api/account/balance', sensitivity: '高敏', exposure: '内网', vuln: 2, owner: '账户域' },
  { key: '3', api: '/api/order/list', sensitivity: '中敏', exposure: '内网', vuln: 1, owner: '交易域' },
  { key: '4', api: '/api/log/query', sensitivity: '低敏', exposure: '运维区', vuln: 4, owner: '平台域' },
  { key: '5', api: '/api/legacy/sync', sensitivity: '未标注', exposure: '隔离区', vuln: 5, owner: '遗留系统' }
];
