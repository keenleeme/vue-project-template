export type RiskTabKey = 'abnormal-behavior' | 'web-attack';

export type AiVerdictResult = '误报' | '真实威胁' | '疑似威胁' | '无法研判';

export type RiskCategoryGroup = {
  key: string;
  title: string;
  children: RiskCategoryItem[];
};

export type RiskCategoryItem = {
  key: string;
  title: string;
  count: number;
};

export type RiskBehaviorRow = {
  id: string;
  tabKey: RiskTabKey;
  categoryKey: string;
  severity: '高' | '中' | '低';
  discoveredAt: string;
  activeAt: string;
  riskType: string;
  ruleName: string;
  sourceIp: string;
  sourceArea: string;
  targetIp: string;
  targetArea: string;
  url: string;
  sourceCount: number;
  affectedCount: number;
  alertCount: number;
  sourceAsset: string;
  status: string;
  eventResult?: string;
  keywordLabel?: string;
  aiVerdict?: AiVerdictResult;
  aggregateSummary?: string;
};

export type RiskBehaviorFilter = {
  keyword?: string;
  status?: string;
  sourceArea?: string;
};
