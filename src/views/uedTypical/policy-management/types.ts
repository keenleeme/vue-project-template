export type PolicySeverity = '高' | '中' | '低';
export type PolicySource = '系统内置' | '用户添加';
export type PolicyRuleTab = 'security' | 'behavior';

export interface PolicyRow {
  id: string;
  name: string;
  severity: PolicySeverity;
  enabled: boolean;
  remediation: string;
  exploitation: string;
  source: PolicySource;
  type: string;
  owasp: string;
  designConcept?: string;
}

export interface PolicyFilter {
  name?: string;
  enabled?: string;
  severity?: PolicySeverity;
  source?: PolicySource;
  type?: string;
  owasp?: string;
}
