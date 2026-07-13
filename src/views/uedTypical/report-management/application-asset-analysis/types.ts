export type AppLifecycle = '新发现' | '活跃' | '疑似下线' | '复活';
export type AppStatus = '关键' | '确认' | '不重要' | '未标识';
export type RiskLevel = '高' | '中' | '低';

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface ChartSlice {
  name: string;
  value: number;
}

export type AccessTrendRange = '7d' | '30d';

export interface AccessTrendData {
  dates: string[];
  values: number[];
}

export interface AppOverviewStats {
  lifecycleDist: ChartSlice[];
  statusDist: ChartSlice[];
  deployDist: ChartSlice[];
  accessTrend: Record<AccessTrendRange, AccessTrendData>;
}

export interface AppTopRow {
  rank: number;
  appId: string;
  appName: string;
  domain: string;
  status: AppStatus;
  lifecycle: AppLifecycle;
  riskCount: RiskDistribution;
  dataTags: string[];
  visits: number;
}

export interface ThreatTopRow {
  rank: number;
  threatName: string;
  affectedApps: number;
  riskDist: RiskDistribution;
}

export interface DefectApiTopRow {
  rank: number;
  apiName: string;
  appName: string;
  appDomain: string;
  appId: string;
  defectDist: RiskDistribution;
}

export interface AttackIpTopRow {
  rank: number;
  ip: string;
  attackDist: RiskDistribution;
  region: string;
}

export interface BehaviorSubjectTopRow {
  rank: number;
  subject: string;
  riskDist: RiskDistribution;
}

export interface AppAssetDetail {
  appId: string;
  appName: string;
  assetName: string;
  lifecycle: AppLifecycle;
  status: AppStatus;
  discoveredAt: string;
  activeRange: string;
  requestTags: string[];
  responseTags: string[];
  appInfo: string;
}

export interface RelatedApiRow {
  apiName: string;
  dataTags: string[];
  status: '活跃' | '下线';
}

export interface AppDefectItem {
  id: string;
  name: string;
  level: RiskLevel;
  suggestion: string;
  exploitWay: string;
  relatedApis: RelatedApiRow[];
}

export interface AppAttackItem {
  id: string;
  threat: string;
  level: RiskLevel;
  suggestion: string;
  description: string;
  occurredAt: string;
  relatedApis: RelatedApiRow[];
}

export interface AppBehaviorItem {
  id: string;
  description: string;
  level: RiskLevel;
  subject: string;
  status: '未处理' | '处理中' | '已忽略' | '已修复';
  occurredAt: string;
}

export interface AppDetailBundle {
  asset: AppAssetDetail;
  defects: AppDefectItem[];
  attacks: AppAttackItem[];
  behaviors: AppBehaviorItem[];
}
