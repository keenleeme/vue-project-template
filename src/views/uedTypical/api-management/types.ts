export type ApiLifecycle = '新发现' | '活跃' | '疑似下线' | '复活';
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type AppStatus = '关键' | '确认' | '不重要' | '未标识';
export type DeployDomain = '互联网' | '局域网' | '内网' | 'DMZ' | '云环境';
export type IsApiVerdict = '是' | '否';
export type ApiSensitiveLevel = 'L1' | 'L2' | 'L3' | 'L4' | '-';

export interface ApiDataTag {
  name: string;
  ai?: boolean;
}

export type ApiDataTagInput = string | ApiDataTag;

export interface ApiManagementRow {
  id: string;
  name: string;
  lifecycle: ApiLifecycle;
  method: ApiMethod;
  path: string;
  appName: string;
  appDomain: string;
  appStatus: AppStatus;
  visits: number;
  businessType: string;
  apiDescription: string;
  isApi: IsApiVerdict;
  isApiAiBasis: string;
  isSensitive: '是' | '否';
  sensitiveLevel: ApiSensitiveLevel | string;
  requestTags: ApiDataTagInput[];
  responseTags: ApiDataTagInput[];
  aiInterpretation: string;
  riskCount: number;
  riskStrategies: string[];
  deployDomain: DeployDomain;
}

export interface ApiManagementFilter {
  keyword?: string;
  lifecycle?: ApiLifecycle;
  method?: ApiMethod;
  appStatus?: AppStatus;
  deployDomain?: DeployDomain;
  hasRisk?: boolean;
  isApi?: IsApiVerdict;
  businessType?: string;
  sensitiveLevel?: string;
}

export interface ApiDetailSnapshot {
  requestUrl: string;
  requestRaw: string;
  requestHeader: string;
  requestCookie: string;
  requestBody: string;
  responseRaw: string;
  responseHeader: string;
  responseSetCookie: string;
  responseBody: string;
  highlightTag?: string;
  highlightCount?: number;
}

export interface ApiParameterRow {
  key: string;
  name: string;
  paramType: string;
  sample: string;
  dataTag: string;
  category: string;
  level: string;
  sensitive: '是' | '否';
}

export type ApiDefectSeverity = '高' | '中' | '低';
export type ApiDefectStatus = '待处置' | '已确认' | '已忽略';

export interface ApiDefectItem {
  key: string;
  name: string;
  severity: ApiDefectSeverity;
  strategy: string;
  evidence: string;
  suggestion: string;
  status: ApiDefectStatus;
}

export interface ApiDetail extends ApiManagementRow {
  discoveredAt: string;
  activeAt: string;
  apiType: string;
  responseContentType: string;
  isApi: IsApiVerdict;
  isApiAiBasis: string;
  isSensitive: '是' | '否';
  sensitiveLevel: string;
  snapshot: ApiDetailSnapshot;
  requestParams: ApiParameterRow[];
  responseParams: ApiParameterRow[];
  defects: ApiDefectItem[];
}
