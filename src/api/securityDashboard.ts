/**
 * AAS 安全态势大屏 — Java 直连接口封装
 * 前缀：import.meta.env.VITE_AAS_BASE_URL（默认 ''，开发环境走 Vite /api 代理）
 */

const getBaseUrl = () => (import.meta.env.VITE_AAS_BASE_URL as string | undefined) ?? '';

export class AasApiError extends Error {
  constructor(
    message: string,
    public readonly path?: string
  ) {
    super(message);
    this.name = 'AasApiError';
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function authHeaders(token?: string): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    h.Authorization = token.startsWith('Bearer ') || token.startsWith('bearer ') ? token : `Bearer ${token}`;
  }
  return h;
}

export async function aasPost<T = unknown>(path: string, body: unknown, token?: string): Promise<T> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body ?? {})
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new AasApiError(`HTTP ${res.status}`, path);
  }
  return data as T;
}

export async function aasGet<T = unknown>(path: string, token?: string): Promise<T> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    headers: token
      ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` }
      : {}
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new AasApiError(`HTTP ${res.status}`, path);
  }
  return data as T;
}

/** ---------- 响应适应层（兼容 data 包裹或直接返回） ---------- */

function pickData<T>(raw: unknown): T | undefined {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T | undefined;
}

export async function fetchEngineStatus(token?: string): Promise<'online' | 'offline'> {
  try {
    const raw = await aasGet<Record<string, unknown>>('/api/engine/status', token);
    const st = String(pickData(raw)?.status ?? (raw as { status?: string })?.status ?? 'online');
    return st === 'error' || st === 'offline' ? 'offline' : 'online';
  } catch {
    return 'online';
  }
}

export async function fetchResAppTotal(token?: string): Promise<number> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/resApp/query',
    { currentPage: 1, pageSize: 1 },
    token
  );
  const d = pickData<{ totalCount?: number }>(raw) ?? raw;
  return Number(d?.totalCount ?? 0);
}

export async function fetchResApiTotal(token?: string): Promise<number> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/resApi/query',
    { currentPage: 1, pageSize: 1 },
    token
  );
  const d = pickData<{ totalCount?: number }>(raw) ?? raw;
  return Number(d?.totalCount ?? 0);
}

export async function fetchFragilityRiskTotal(token?: string): Promise<number> {
  const raw = await aasPost<Record<string, unknown>>('/api/fragilityRisk/distribution', {}, token);
  const d = pickData<{ total?: number }>(raw) ?? raw;
  if (typeof d?.total === 'number') return d.total;
  const arr = (d as { list?: { count?: number }[] })?.list;
  if (Array.isArray(arr)) return arr.reduce((s, x) => s + Number(x.count ?? 0), 0);
  return 0;
}

export async function fetchRiskBehaviorTotal(token?: string): Promise<number> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/riskBehavior/query',
    { currentPage: 1, pageSize: 1 },
    token
  );
  const d = pickData<{ totalCount?: number }>(raw) ?? raw;
  return Number(d?.totalCount ?? 0);
}

export interface LifeCycleItem {
  lifeCycle: string;
  count: number;
}

const LIFE_CYCLE_LABEL: Record<string, string> = {
  active: '活跃',
  testing: '测试中',
  grayscale: '灰度',
  offline: '已下线',
  unknown: '未知'
};

export async function fetchApiLifeCycleDistribution(token?: string): Promise<{ name: string; value: number }[]> {
  const raw = await aasPost<Record<string, unknown>>('/api/resApi/distribution/lifeCycle', {}, token);
  const arr = (pickData<LifeCycleItem[]>(raw) ?? (raw as { data?: LifeCycleItem[] })?.data) as LifeCycleItem[];
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => ({
    name: LIFE_CYCLE_LABEL[item.lifeCycle] ?? item.lifeCycle,
    value: Number(item.count ?? 0)
  }));
}

export interface VisitTrendPoint {
  time: number;
  count: number;
}

export async function fetchVisitNumTrend(startTime: number, endTime: number, token?: string): Promise<VisitTrendPoint[]> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/auditLog/visitNumTrend',
    { startTime, endTime },
    token
  );
  const arr = (pickData<VisitTrendPoint[]>(raw) ?? []) as VisitTrendPoint[];
  return Array.isArray(arr) ? arr : [];
}

export interface LogsTrendResult {
  alarmLogTrend?: { time?: number; count?: number }[];
  auditLogTrend?: { time?: number; count?: number }[];
}

export async function fetchLogsTrend(startTime: number, endTime: number, token?: string): Promise<LogsTrendResult> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/auditLog/logsTrend',
    { startTime, endTime, interval: '1d' },
    token
  );
  const d = pickData<LogsTrendResult>(raw) ?? (raw as LogsTrendResult);
  return {
    alarmLogTrend: Array.isArray(d?.alarmLogTrend) ? d.alarmLogTrend : [],
    auditLogTrend: Array.isArray(d?.auditLogTrend) ? d.auditLogTrend : []
  };
}

export interface PolicyAggItem {
  policyFragilityName?: string;
  count?: number;
}

export async function fetchFragilityPolicyAggregation(
  token?: string
): Promise<{ name: string; value: number }[]> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/fragilityRisk/aggregation/fragilityPolicy',
    {},
    token
  );
  const arr = (pickData<PolicyAggItem[]>(raw) ?? []) as PolicyAggItem[];
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) => ({ name: String(x.policyFragilityName ?? '-'), value: Number(x.count ?? 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export interface ApiRiskTopItem {
  apiPath?: string;
  riskCount?: number;
}

export async function fetchApiRiskFragilityTop5(token?: string): Promise<{ name: string; value: number }[]> {
  const raw = await aasGet<Record<string, unknown>>('/api/resApi/riskFragilityCountTop10', token);
  const arr = (pickData<ApiRiskTopItem[]>(raw) ?? (raw as { data?: ApiRiskTopItem[] })?.data) as ApiRiskTopItem[];
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, 5).map((x) => ({
    name: String(x.apiPath ?? '-'),
    value: Number(x.riskCount ?? 0)
  }));
}

export interface AlarmLogItem {
  alarmTime?: string;
  alarmLevel?: string;
  alarmName?: string;
  sip?: string;
  httpUrl?: string;
}

export async function fetchAlarmLogLatest(token?: string): Promise<AlarmLogItem[]> {
  const raw = await aasPost<Record<string, unknown>>(
    '/api/alarmLog/query',
    {
      currentPage: 1,
      pageSize: 20,
      orderBy: ['alarmTime'],
      sort: ['desc']
    },
    token
  );
  const d = pickData<{ list?: AlarmLogItem[] }>(raw) ?? raw;
  const list = (d as { list?: AlarmLogItem[] })?.list;
  return Array.isArray(list) ? list : [];
}

/** 演示数据：接口不可用时兜底 */
export function getSecurityDashboardMock(params: { start7: number; end7: number }): {
  kpi: { apps: number; apis: number; fragile: number; behavior: number };
  lifeCycle: { name: string; value: number }[];
  visit: VisitTrendPoint[];
  logsTrend: LogsTrendResult;
  policies: { name: string; value: number }[];
  apiTop5: { name: string; value: number }[];
  alarms: AlarmLogItem[];
} {
  const days = 7;
  const visit: VisitTrendPoint[] = [];
  const alarmTrend: { time: number; count: number }[] = [];
  const auditTrend: { time: number; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const t = params.start7 + i * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000;
    visit.push({ time: t, count: 120000 + Math.floor(Math.random() * 40000) });
    alarmTrend.push({ time: t, count: 8 + Math.floor(Math.random() * 12) });
    auditTrend.push({ time: t, count: 25 + Math.floor(Math.random() * 30) });
  }
  const lv = new Date().getTime();
  const alarms: AlarmLogItem[] = Array.from({ length: 12 }).map((_, i) => ({
    alarmTime: new Date(lv - i * 120000).toISOString().replace('T', ' ').slice(0, 19),
    alarmLevel: ['critical', 'high', 'medium', 'low'][i % 4],
    alarmName: ['敏感数据越权访问', '异常高频调用', '脆弱性策略命中', '鉴别认证失败'][i % 4],
    sip: `10.20.${i % 5}.${100 + i}`,
    httpUrl: `/api/order/detail?id=${1000 + i}`
  }));
  return {
    kpi: { apps: 186, apis: 8420, fragile: 326, behavior: 1542 },
    lifeCycle: [
      { name: '活跃', value: 6200 },
      { name: '测试中', value: 980 },
      { name: '灰度', value: 760 },
      { name: '已下线', value: 480 }
    ],
    visit,
    logsTrend: { alarmLogTrend: alarmTrend, auditLogTrend: auditTrend },
    policies: [
      { name: '敏感数据暴露', value: 112 },
      { name: '未鉴权访问', value: 86 },
      { name: '越权访问', value: 74 },
      { name: '弱哈希算法', value: 52 },
      { name: 'TLS 配置不当', value: 41 },
      { name: '日志注入', value: 33 },
      { name: '接口版本泄露', value: 28 },
      { name: 'CORS 宽松', value: 22 }
    ],
    apiTop5: [
      { name: '/api/v1/customer/export', value: 48 },
      { name: '/api/payment/transfer', value: 39 },
      { name: '/api/user/profile/full', value: 34 },
      { name: '/api/report/finance/summary', value: 29 },
      { name: '/api/file/batch/download', value: 24 }
    ],
    alarms
  };
}
