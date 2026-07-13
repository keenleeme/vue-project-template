export interface ChartSlice {
  name: string;
  value: number;
}

export interface AccessTrendData {
  dates: string[];
  values: number[];
}

export interface ApiOverviewStats {
  apiTotal: number;
  deployDist: ChartSlice[];
  typeDist: ChartSlice[];
  accessTrend: AccessTrendData;
  accessDataAll: ChartSlice[];
  accessDataSensitive: ChartSlice[];
}

export type DefectLevel = '高危' | '中危' | '低危';

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface ApiDefectDistRow {
  key: string;
  defectName: string;
  level: DefectLevel;
  affectedApiCount: number;
}

export type AttackLevel = '严重' | '高危' | '中危';

export interface ApiAttackDistRow {
  key: string;
  attackName: string;
  level: AttackLevel;
  attackCount: number;
}

export interface DefectApiTopRow {
  rank: number;
  apiPath: string;
  defectTotal: number;
  defectDist: RiskDistribution;
}

export interface ApiAssetReportData {
  overview: ApiOverviewStats;
  defectLevelDist: ChartSlice[];
  defectDist: ApiDefectDistRow[];
  attackDist: ApiAttackDistRow[];
  defectApiTop: DefectApiTopRow[];
}
