import type { ApiDataTagInput, ApiDetailSnapshot, ApiMethod, DeployDomain } from '../api-management/types';

export type DefectSeverity = '高' | '中' | '低';
export type AiVerdictResult = '误报' | '真实威胁' | '疑似威胁' | '无法研判';
export type DefectProcessStatus = '待处置' | '已确认' | '已忽略';
export type DefectDisplayStatus = '待处理' | '处理中' | '已处理' | '已忽略';

export interface DefectCategoryNode {
  key: string;
  title: string;
  count?: number;
  badge?: string;
  children?: DefectCategoryNode[];
}

export interface ApiDefectRow {
  id: string;
  categoryKey: string;
  defectName: string;
  severity: DefectSeverity;
  discoveredAt: string;
  activeAt: string;
  aiVerdict: AiVerdictResult;
  method: ApiMethod;
  path: string;
  appInfo: string;
  accessDomain: DeployDomain;
  deployDomain: DeployDomain;
  processStatus: DefectProcessStatus;
  hasPendingAction?: boolean;
}

export interface DefectHandlingRecord {
  time: string;
  content: string;
}

export interface DefectHitRuleRow {
  ruleNo: string;
  snapshot: string;
  highlightText?: string;
  showHelp?: boolean;
}

export interface DefectLogEndpoint {
  ip: string;
  ipRegion: string;
  networkDomain: string;
  port: number;
  mac: string;
  appName?: string;
}

export interface DefectLogInfo {
  client: DefectLogEndpoint;
  application: DefectLogEndpoint;
  transportProtocol: string;
  applicationProtocol: string;
  captureInterface: string;
  responseTime: string;
}

export interface DefectAlertInstance {
  id: string;
  time: string;
  hitRules: DefectHitRuleRow[];
  snapshot: ApiDetailSnapshot;
  logInfo: DefectLogInfo;
}

export interface DefectAiJudgment {
  conclusion: AiVerdictResult;
  explanation: string[];
  suggestions: string[];
}

export interface ApiDefectDetail extends ApiDefectRow {
  defectId: string;
  defectType: string;
  owaspApi: string;
  displayStatus: DefectDisplayStatus;
  exploitableMethod: string;
  remediation: string;
  handlingRecords: DefectHandlingRecord[];
  visits: string;
  apiType: string;
  responseContentType: string;
  appName: string;
  appDomain: string;
  appStatus: string;
  requestTags: ApiDataTagInput[];
  responseTags: ApiDataTagInput[];
  alertInstances: DefectAlertInstance[];
  aiJudgment: DefectAiJudgment;
}

export interface ApiDefectFilter {
  keyword?: string;
  severity?: DefectSeverity;
  aiVerdict?: AiVerdictResult;
  accessDomain?: DeployDomain;
  deployDomain?: DeployDomain;
  processStatus?: DefectProcessStatus;
}
