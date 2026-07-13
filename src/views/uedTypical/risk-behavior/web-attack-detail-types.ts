import type { AiVerdictResult } from './types';

export type WebAttackAlertRow = {
  id: string;
  occurredAt: string;
  method: string;
  path: string;
  serverApp: string;
  serverIp: string;
  serverPort: number;
  clientIp: string;
  clientPort: number;
  alertName: string;
  alertSeverity: '高' | '中' | '低';
  summaryRequest: string;
  summaryResponse: string;
};

export type WebAttackDetail = {
  id: string;
  attackId: string;
  severity: '高' | '中' | '低';
  title: string;
  attackName: string;
  sourceIp: string;
  attackCount: number;
  appName: string;
  appDomain: string;
  discoveredAt: string;
  activeAt: string;
  riskStatus: string;
  eventResult: string;
  aiVerdict: AiVerdictResult;
  aiEventResult: string;
  disposalRecords: Array<{ time: string; content: string }>;
  aiJudgment: {
    conclusion: AiVerdictResult;
    explanation: string[];
    suggestions: string[];
  };
  alerts: WebAttackAlertRow[];
};
