export type ReportType = 'api-security-ops' | 'api-asset-analysis' | 'application-asset-analysis';
export type ReportTemplateTheme = 'api' | 'app-grid' | 'api-plug';

export interface ReportCardItem {
  id: ReportType;
  title: string;
  description: string;
  audience: string;
  updateCycle: string;
  lastGeneratedAt: string;
  route: string;
  tags: string[];
  theme: ReportTemplateTheme;
}

export type ReportFormat = 'WORD' | 'PDF' | 'PNG' | 'HTML';

export type ReportListStatus = '成功' | '生成中' | '失败' | '待开始';

export interface GenerateReportFormValues {
  reportName: string;
  templateType: ReportType;
  remark: string;
  dateRange: [string, string] | null;
  formats: ReportFormat[];
  filterApp?: string;
  filterApi?: string;
}

export interface ReportHistoryItem {
  id: string;
  reportName: string;
  remark: string;
  templateType: ReportType;
  templateTag: string;
  filterApp?: string;
  filterApi?: string;
  filterTime: string;
  createdAt: string;
  status: ReportListStatus;
  failReason?: string;
}

export interface ReportSubscriptionItem {
  id: string;
  templateName: string;
  cycle: string;
  nextRunAt: string;
  status: '已启用' | '已暂停';
  subscriber: string;
}

export interface ReportKpiItem {
  label: string;
  value: string | number;
  hint?: string;
  trend?: 'up' | 'down' | 'flat';
  trendText?: string;
}

export interface ReportTableRow {
  key: string;
  [field: string]: string | number;
}
