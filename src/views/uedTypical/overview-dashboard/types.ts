export type LifecycleScope = 'app' | 'api';
export type RiskTabKey = 'fragility' | 'behavior';

export interface SummaryMetric {
  key: string;
  label: string;
  value: number;
  tone: 'blue' | 'orange' | 'green' | 'purple';
  icon: string;
}

export interface LifecycleStage {
  key: string;
  label: string;
  value: number;
  tone: 'new' | 'active' | 'revive' | 'offline';
}

export interface RiskRankItem {
  name: string;
  value: number;
  color: string;
}

export interface SensitiveDataItem {
  name: string;
  request: number;
  response: number;
}
