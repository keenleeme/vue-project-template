export interface LifecycleBreakdown {
  newFound: number;
  active: number;
  suspectedOffline: number;
  resurrected: number;
}

export interface RiskBreakdown {
  high: number;
  medium: number;
  low: number;
}

export interface OverviewAssetCard {
  key: string;
  label: string;
  total: number;
  type: 'lifecycle';
  breakdown: LifecycleBreakdown;
}

export interface OverviewRiskCard {
  key: string;
  label: string;
  total: number;
  type: 'risk';
  breakdown: RiskBreakdown;
}

export const overviewAssetCards: OverviewAssetCard[] = [
  {
    key: 'app',
    label: '应用',
    total: 1248,
    type: 'lifecycle',
    breakdown: { newFound: 248, active: 789, suspectedOffline: 156, resurrected: 55 }
  },
  {
    key: 'api',
    label: 'API',
    total: 15842,
    type: 'lifecycle',
    breakdown: { newFound: 2156, active: 11234, suspectedOffline: 1876, resurrected: 576 }
  },
  {
    key: 'account',
    label: '账号',
    total: 8934,
    type: 'lifecycle',
    breakdown: { newFound: 1234, active: 6245, suspectedOffline: 876, resurrected: 579 }
  }
];

export const overviewRiskCards: OverviewRiskCard[] = [
  {
    key: 'defect',
    label: 'API 缺陷',
    total: 123826,
    type: 'risk',
    breakdown: { high: 121163, medium: 2561, low: 102 }
  },
  {
    key: 'behavior',
    label: '行为风险',
    total: 5880,
    type: 'risk',
    breakdown: { high: 5831, medium: 49, low: 0 }
  },
  {
    key: 'attack',
    label: '攻击风险',
    total: 8452,
    type: 'risk',
    breakdown: { high: 6210, medium: 1840, low: 402 }
  }
];

export const accessTrend = {
  dates: [
    '06-01', '06-03', '06-05', '06-07', '06-09', '06-11', '06-13',
    '06-15', '06-17', '06-19', '06-21', '06-22'
  ],
  values: [8200, 9600, 11200, 10800, 12500, 14200, 13800, 15600, 16800, 17500, 18200, 19000]
};

export const accessCategoryAll = [
  { name: '订单信息', value: 4200 },
  { name: '账户信息', value: 3600 },
  { name: '手机号码', value: 3100 },
  { name: '金融数据', value: 2800 },
  { name: '资产信息', value: 2400 },
  { name: '地址信息', value: 1900 },
  { name: '证件号码', value: 1650 },
  { name: '邮箱信息', value: 1420 },
  { name: '其他', value: 980 }
];

export const accessCategorySensitive = [
  { name: '手机号码', value: 3100 },
  { name: '证件号码', value: 1650 },
  { name: '金融数据', value: 2800 },
  { name: '邮箱信息', value: 1420 },
  { name: '地址信息', value: 1900 }
];

export interface ThreatTrendData {
  dates: string[];
  values: number[];
  riskDists: RiskBreakdown[];
}

export interface ThreatBlockData {
  key: string;
  title: string;
  distribution: { name: string; value: number }[];
  trend: ThreatTrendData;
  topColumns: { title: string; dataIndex: string; key: string; width?: number; ellipsis?: boolean }[];
  topRows: (Record<string, string | number | RiskBreakdown> & { key: string; rank: number })[];
}

export const defectThreatBlock: ThreatBlockData = {
  key: 'defect',
  title: 'API 缺陷',
  distribution: [
    { name: 'SQL 注入', value: 32 },
    { name: 'XSS', value: 24 },
    { name: 'CSRF', value: 18 },
    { name: '越权访问', value: 14 },
    { name: '敏感泄露', value: 12 }
  ],
  trend: {
    dates: ['06-01', '06-05', '06-09', '06-13', '06-17', '06-21'],
    values: [820, 960, 1120, 980, 1050, 1180],
    riskDists: [
      { high: 652, medium: 128, low: 40 },
      { high: 768, medium: 152, low: 40 },
      { high: 896, medium: 168, low: 56 },
      { high: 784, medium: 147, low: 49 },
      { high: 840, medium: 158, low: 52 },
      { high: 944, medium: 177, low: 59 }
    ]
  },
  topColumns: [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: 'API', dataIndex: 'api', key: 'api', ellipsis: true },
    { title: '缺陷数量', dataIndex: 'riskDist', key: 'riskDist', width: 150 }
  ],
  topRows: [
    { key: '1', rank: 1, api: '/api/order/export', riskDist: { high: 142, medium: 32, low: 12 } },
    { key: '2', rank: 2, api: '/api/user/profile', riskDist: { high: 98, medium: 36, low: 8 } },
    { key: '3', rank: 3, api: '/api/payment/refund', riskDist: { high: 76, medium: 28, low: 14 } },
    { key: '4', rank: 4, api: '/api/account/balance', riskDist: { high: 58, medium: 24, low: 14 } },
    { key: '5', rank: 5, api: '/api/customer/idcard', riskDist: { high: 48, medium: 22, low: 14 } }
  ]
};

export const attackThreatBlock: ThreatBlockData = {
  key: 'attack',
  title: '攻击风险',
  distribution: [
    { name: 'SQL 注入', value: 28 },
    { name: '扫描探测', value: 22 },
    { name: 'XSS', value: 18 },
    { name: '暴力破解', value: 16 },
    { name: '其他', value: 16 }
  ],
  trend: {
    dates: ['06-01', '06-05', '06-09', '06-13', '06-17', '06-21'],
    values: [420, 510, 480, 560, 620, 590],
    riskDists: [
      { high: 310, medium: 85, low: 25 },
      { high: 378, medium: 102, low: 30 },
      { high: 355, medium: 96, low: 29 },
      { high: 414, medium: 112, low: 34 },
      { high: 458, medium: 124, low: 38 },
      { high: 436, medium: 118, low: 36 }
    ]
  },
  topColumns: [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 56 },
    { title: 'IP 地址', dataIndex: 'ip', key: 'ip', width: 120, ellipsis: true },
    { title: '地域', dataIndex: 'region', key: 'region', width: 100 },
    { title: '访问域', dataIndex: 'domain', key: 'domain', width: 72 },
    { title: '攻击次数', dataIndex: 'attackCount', key: 'attackCount', width: 80 }
  ],
  topRows: [
    { key: '1', rank: 1, ip: '103.21.45.88', region: '境外-东南亚', domain: '公网', attackCount: 1286 },
    { key: '2', rank: 2, ip: '47.92.118.6', region: '中国-浙江', domain: '公网', attackCount: 942 },
    { key: '3', rank: 3, ip: '182.92.64.19', region: '中国-北京', domain: '公网', attackCount: 756 },
    { key: '4', rank: 4, ip: '45.33.32.102', region: '境外-北美', domain: '公网', attackCount: 618 },
    { key: '5', rank: 5, ip: '10.11.42.53', region: '内网', domain: '内网', attackCount: 384 }
  ]
};

export const behaviorThreatBlock: ThreatBlockData = {
  key: 'behavior',
  title: '行为风险',
  distribution: [
    { name: '账号爆破', value: 26 },
    { name: '批量导出', value: 22 },
    { name: '异常高频', value: 18 },
    { name: '非工作时间访问', value: 20 },
    { name: '其他', value: 14 }
  ],
  trend: {
    dates: ['06-01', '06-05', '06-09', '06-13', '06-17', '06-21'],
    values: [180, 210, 196, 240, 228, 256],
    riskDists: [
      { high: 140, medium: 32, low: 8 },
      { high: 164, medium: 36, low: 10 },
      { high: 152, medium: 34, low: 10 },
      { high: 186, medium: 42, low: 12 },
      { high: 178, medium: 38, low: 12 },
      { high: 200, medium: 44, low: 12 }
    ]
  },
  topColumns: [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: '主体', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: '风险数量', dataIndex: 'riskDist', key: 'riskDist', width: 150 }
  ],
  topRows: [
    { key: '1', rank: 1, subject: 'admin@example.com', riskDist: { high: 96, medium: 24, low: 8 } },
    { key: '2', rank: 2, subject: 'svc_report_bot', riskDist: { high: 72, medium: 18, low: 6 } },
    { key: '3', rank: 3, subject: 'token_7f3a9c', riskDist: { high: 58, medium: 20, low: 6 } },
    { key: '4', rank: 4, subject: 'device_fp_a8291', riskDist: { high: 48, medium: 16, low: 8 } },
    { key: '5', rank: 5, subject: 'batch_export_job', riskDist: { high: 42, medium: 15, low: 8 } }
  ]
};

export const threatBlocks = [defectThreatBlock, attackThreatBlock, behaviorThreatBlock];
