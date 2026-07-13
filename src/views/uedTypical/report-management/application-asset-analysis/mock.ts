import type {
  AppAttackItem,
  AppBehaviorItem,
  AppDefectItem,
  AppDetailBundle,
  AppOverviewStats,
  AppTopRow,
  AttackIpTopRow,
  BehaviorSubjectTopRow,
  ChartSlice,
  DefectApiTopRow,
  ThreatTopRow
} from './types';

const appSeeds = [
  { id: 'app-order', name: '订单中心', domain: 'order.example.com' },
  { id: 'app-pay', name: '支付网关', domain: 'pay.example.com' },
  { id: 'app-user', name: '用户中心', domain: 'user.example.com' },
  { id: 'app-report', name: '报表服务', domain: 'report.example.com' },
  { id: 'app-auth', name: '统一认证', domain: 'auth.example.com' },
  { id: 'app-crm', name: 'CRM系统', domain: 'crm.example.com' },
  { id: 'app-oa', name: 'OA办公', domain: 'oa.example.com' },
  { id: 'app-erp', name: 'ERP核心', domain: 'erp.example.com' },
  { id: 'app-log', name: '日志平台', domain: 'log.example.com' },
  { id: 'app-legacy', name: '遗留门户', domain: 'legacy.example.com' }
] as const;

const statuses = ['关键', '确认', '不重要', '未标识'] as const;
const lifecycles = ['新发现', '活跃', '疑似下线', '复活'] as const;

const appDataTags = [
  ['身份证号', '手机号', '订单信息'],
  ['邮箱地址', '银行卡号', '姓名'],
  ['手机号', '地址信息', '证件号码'],
  ['邮箱地址', '手机号'],
  ['身份证号', '金融数据', '账户余额'],
  ['姓名', '手机号', '邮箱地址'],
  ['订单信息', '手机号码', '收货地址'],
  ['手机号', '身份证号', '邮箱地址'],
  ['证件号码', '银行卡号'],
  ['邮箱地址', '地址信息', '姓名']
] as const;

function buildTopRows(sortKey: 'defect' | 'attack' | 'behavior'): AppTopRow[] {
  const weights = [
    { high: 18, medium: 12, low: 6 },
    { high: 15, medium: 10, low: 8 },
    { high: 12, medium: 14, low: 5 },
    { high: 10, medium: 9, low: 7 },
    { high: 9, medium: 8, low: 6 },
    { high: 8, medium: 7, low: 5 },
    { high: 7, medium: 6, low: 4 },
    { high: 6, medium: 5, low: 3 },
    { high: 5, medium: 4, low: 3 },
    { high: 4, medium: 3, low: 2 }
  ];

  const rows = appSeeds.map((app, idx) => {
    const dist = weights[idx];
    const total = dist.high + dist.medium + dist.low;
    const visits = 120000 - idx * 8200 + (sortKey === 'attack' ? 3000 : 0);
    return {
      rank: idx + 1,
      appId: app.id,
      appName: app.name,
      domain: app.domain,
      status: statuses[idx % statuses.length],
      lifecycle: lifecycles[idx % lifecycles.length],
      riskCount: dist,
      dataTags: [...appDataTags[idx]],
      visits,
      _total: total
    };
  });

  return rows
    .sort((a, b) => b._total - a._total)
    .map((row, idx) => {
      const { _total, ...rest } = row;
      return { ...rest, rank: idx + 1 };
    });
}

export const mockOverviewStats: AppOverviewStats = {
  lifecycleDist: [
    { name: '新发现', value: 24 },
    { name: '活跃', value: 128 },
    { name: '疑似下线', value: 18 },
    { name: '复活', value: 16 }
  ],
  statusDist: [
    { name: '关键', value: 58 },
    { name: '确认', value: 86 },
    { name: '不重要', value: 32 },
    { name: '未知', value: 10 }
  ],
  deployDist: [
    { name: '互联网', value: 72 },
    { name: '内网', value: 94 },
    { name: '杭州办', value: 20 }
  ],
  accessTrend: {
    '7d': {
      dates: ['06-17', '06-18', '06-19', '06-20', '06-21', '06-22', '06-23'],
      values: [328900, 335600, 341200, 348500, 352100, 354600, 356800]
    },
    '30d': {
      dates: [
        '05-25', '05-26', '05-27', '05-28', '05-29', '05-30', '05-31',
        '06-01', '06-02', '06-03', '06-04', '06-05', '06-06', '06-07',
        '06-08', '06-09', '06-10', '06-11', '06-12', '06-13', '06-14',
        '06-15', '06-16', '06-17', '06-18', '06-19', '06-20', '06-21',
        '06-22', '06-23'
      ],
      values: [
        248600, 251200, 254800, 257300, 260100, 262400, 265900,
        268200, 271500, 274800, 278200, 281600, 284300, 287900,
        291400, 294800, 298400, 301200, 304600, 305600, 308900,
        312400, 316800, 320500, 328900, 335600, 341200, 348500,
        352100, 356800
      ]
    }
  }
};

export const mockDefectTopApps = buildTopRows('defect');
export const mockAttackTopApps = buildTopRows('attack');
export const mockBehaviorTopApps = buildTopRows('behavior');

export const mockAppDefectTop10Dist: ChartSlice[] = [
  { name: 'SQL 注入', value: 86 },
  { name: 'XSS', value: 64 },
  { name: '越权访问', value: 52 },
  { name: '敏感泄露', value: 38 },
  { name: 'CSRF', value: 28 },
  { name: '弱口令', value: 22 },
  { name: '未鉴权访问', value: 18 },
  { name: '其他', value: 14 }
];

export const mockThreatTop: ThreatTopRow[] = [
  { rank: 1, threatName: 'SQL注入', affectedApps: 18, riskDist: { high: 42, medium: 28, low: 12 } },
  { rank: 2, threatName: 'XSS跨站脚本', affectedApps: 14, riskDist: { high: 26, medium: 31, low: 18 } },
  { rank: 3, threatName: '暴力破解', affectedApps: 11, riskDist: { high: 19, medium: 22, low: 9 } },
  { rank: 4, threatName: '越权访问', affectedApps: 9, riskDist: { high: 15, medium: 18, low: 11 } },
  { rank: 5, threatName: '敏感数据泄露', affectedApps: 8, riskDist: { high: 12, medium: 14, low: 6 } }
];

export const mockDefectApiTop: DefectApiTopRow[] = [
  {
    rank: 1,
    apiName: '/api/order/export',
    appName: '订单中心',
    appDomain: 'order.example.com',
    appId: 'app-order',
    defectDist: { high: 5, medium: 3, low: 1 }
  },
  {
    rank: 2,
    apiName: '/api/user/profile',
    appName: '用户中心',
    appDomain: 'user.example.com',
    appId: 'app-user',
    defectDist: { high: 4, medium: 4, low: 2 }
  },
  {
    rank: 3,
    apiName: '/api/payment/refund',
    appName: '支付网关',
    appDomain: 'pay.example.com',
    appId: 'app-pay',
    defectDist: { high: 3, medium: 5, low: 1 }
  },
  {
    rank: 4,
    apiName: '/api/report/download',
    appName: '报表服务',
    appDomain: 'report.example.com',
    appId: 'app-report',
    defectDist: { high: 3, medium: 2, low: 3 }
  },
  {
    rank: 5,
    apiName: '/api/auth/token',
    appName: '统一认证',
    appDomain: 'auth.example.com',
    appId: 'app-auth',
    defectDist: { high: 2, medium: 3, low: 2 }
  }
];

export const mockAttackIpTop: AttackIpTopRow[] = [
  { rank: 1, ip: '103.21.45.88', attackDist: { high: 38, medium: 22, low: 8 }, region: '境外-东南亚' },
  { rank: 2, ip: '47.92.118.6', attackDist: { high: 26, medium: 18, low: 12 }, region: '中国-浙江' },
  { rank: 3, ip: '182.92.64.19', attackDist: { high: 21, medium: 16, low: 9 }, region: '中国-北京' },
  { rank: 4, ip: '45.33.32.102', attackDist: { high: 18, medium: 14, low: 11 }, region: '境外-北美' },
  { rank: 5, ip: '10.11.42.53', attackDist: { high: 6, medium: 12, low: 18 }, region: '内网' }
];

export const mockBehaviorSubjectTop: BehaviorSubjectTopRow[] = [
  { rank: 1, subject: 'svc_report_bot', riskDist: { high: 24, medium: 8, low: 3 } },
  { rank: 2, subject: 'admin@example.com', riskDist: { high: 18, medium: 12, low: 5 } },
  { rank: 3, subject: 'token_7f3a9c', riskDist: { high: 14, medium: 10, low: 6 } },
  { rank: 4, subject: 'device_fp_a8291', riskDist: { high: 11, medium: 9, low: 4 } },
  { rank: 5, subject: 'batch_export_job', riskDist: { high: 9, medium: 11, low: 7 } }
];

const detailMap: Record<string, AppDetailBundle> = {
  'app-order': {
    asset: {
      appId: 'app-order',
      appName: '订单中心',
      assetName: 'http_10.20.120.6_80',
      lifecycle: '新发现',
      status: '未标识',
      discoveredAt: '2026-06-05 00:00:01',
      activeRange: '2026-06-05 ~ 2026-06-23',
      requestTags: ['含手机号', '含身份证号'],
      responseTags: ['含客户资料', '含邮箱'],
      appInfo: '订单中心核心交易系统，负责人：张三（交易部）'
    },
    defects: [
      {
        id: 'd1',
        name: '单次返回数据量过大',
        level: '高',
        suggestion: '对导出接口增加分页与字段白名单，限制单次返回记录数不超过 500 条。',
        exploitWay: '攻击者可通过构造大页码或宽字段查询，引发内存耗尽或敏感数据批量泄露。',
        relatedApis: [
          { apiName: '/api/order/export', dataTags: ['含PII', '批量导出'], status: '活跃' },
          { apiName: '/api/order/list', dataTags: ['含订单号'], status: '活跃' }
        ]
      },
      {
        id: 'd2',
        name: '未鉴权访问敏感接口',
        level: '中',
        suggestion: '为所有订单查询接口补充 OAuth2 鉴权与细粒度 RBAC 控制。',
        exploitWay: '未登录用户可直接访问部分历史订单查询接口。',
        relatedApis: [{ apiName: '/api/order/history', dataTags: ['含客户ID'], status: '活跃' }]
      }
    ],
    attacks: [
      {
        id: 'a1',
        threat: 'SQL注入',
        level: '高',
        suggestion: '启用参数化查询，对 orderId 等入参进行白名单校验。',
        description: '2026-06-18 14:22 检测到 orderId 参数拼接 SQL 载荷：1 OR 1=1--',
        occurredAt: '2026-06-18 14:22:08',
        relatedApis: [{ apiName: '/api/order/detail', dataTags: ['含订单明细'], status: '活跃' }]
      },
      {
        id: 'a2',
        threat: 'XSS跨站脚本',
        level: '中',
        suggestion: '对备注字段进行 HTML 转义并增加 CSP 响应头。',
        description: '2026-06-20 09:15 在订单备注字段检测到 script 标签注入尝试。',
        occurredAt: '2026-06-20 09:15:33',
        relatedApis: [{ apiName: '/api/order/remark', dataTags: ['用户输入'], status: '活跃' }]
      }
    ],
    behaviors: [
      {
        id: 'b1',
        description: '账号爆破',
        level: '高',
        subject: 'admin@order.example.com',
        status: '处理中',
        occurredAt: '2026-06-21 23:48:12'
      },
      {
        id: 'b2',
        description: '非工作时间批量导出',
        level: '中',
        subject: 'svc_report_bot',
        status: '未处理',
        occurredAt: '2026-06-22 02:16:45'
      }
    ]
  }
};

function buildDefaultDetail(appId: string, appName: string, domain: string): AppDetailBundle {
  return {
    asset: {
      appId,
      appName,
      assetName: `http_${domain.replace(/\./g, '_')}_443`,
      lifecycle: '活跃',
      status: '关键',
      discoveredAt: '2026-05-12 08:30:00',
      activeRange: '2026-06-01 ~ 2026-06-23',
      requestTags: ['含访问令牌', '含设备指纹'],
      responseTags: ['含业务数据'],
      appInfo: `${appName}，域名 ${domain}，自动关联 CMDB 资产。`
    },
    defects: [
      {
        id: `${appId}-d1`,
        name: '弱口令认证接口',
        level: '中',
        suggestion: '启用多因素认证并限制弱密码策略。',
        exploitWay: '攻击者可对登录接口进行字典爆破。',
        relatedApis: [{ apiName: `/api/${appId}/login`, dataTags: ['认证'], status: '活跃' }]
      }
    ],
    attacks: [
      {
        id: `${appId}-a1`,
        threat: '扫描探测',
        level: '低',
        suggestion: '对异常扫描 IP 启用 WAF 限速与封禁策略。',
        description: '检测到针对多个路径的目录扫描行为。',
        occurredAt: '2026-06-19 11:05:22',
        relatedApis: [{ apiName: `/api/${appId}/health`, dataTags: ['健康检查'], status: '活跃' }]
      }
    ],
    behaviors: [
      {
        id: `${appId}-b1`,
        description: '异常高频调用',
        level: '中',
        subject: `token_${appId.slice(-4)}`,
        status: '未处理',
        occurredAt: '2026-06-20 16:40:18'
      }
    ]
  };
}

export function getMockAppDetail(appId: string): AppDetailBundle | null {
  if (detailMap[appId]) return detailMap[appId];
  const seed = appSeeds.find((s) => s.id === appId);
  if (!seed) return null;
  return buildDefaultDetail(seed.id, seed.name, seed.domain);
}

export function getMockOverview() {
  return {
    stats: mockOverviewStats,
    defectTopApps: mockDefectTopApps,
    attackTopApps: mockAttackTopApps,
    behaviorTopApps: mockBehaviorTopApps,
    appDefectTop10Dist: mockAppDefectTop10Dist,
    threatTop: mockThreatTop,
    defectApiTop: mockDefectApiTop,
    attackIpTop: mockAttackIpTop,
    behaviorSubjectTop: mockBehaviorSubjectTop
  };
}
