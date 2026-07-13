import { riskBehaviorRows } from './mock';
import type { RiskBehaviorRow } from './types';
import type { WebAttackAlertRow, WebAttackDetail } from './web-attack-detail-types';

const alertTemplates: Omit<WebAttackAlertRow, 'id' | 'occurredAt'>[] = [
  {
    method: 'POST',
    path: '/view/zentao/v1/api/dashboard/nthird/selectDate',
    serverApp: '应用名称',
    serverIp: '10.20.120.205',
    serverPort: 80,
    clientIp: '10.50.2.93',
    clientPort: 44396,
    alertName: 'SQL注入',
    alertSeverity: '高',
    summaryRequest:
      'API请求: HTTP/1.1 accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    summaryResponse:
      'API响应: HTTP/1.1 200 OK content-type:application/json;charset=UTF-8 content-length:128'
  },
  {
    method: 'GET',
    path: '/api/user/login?username=admin\' OR 1=1--',
    serverApp: '应用名称',
    serverIp: '10.20.120.205',
    serverPort: 80,
    clientIp: '10.50.2.93',
    clientPort: 44397,
    alertName: 'SQL注入',
    alertSeverity: '高',
    summaryRequest: 'API请求: HTTP/1.1 accept:*/* user-agent:Mozilla/5.0',
    summaryResponse: 'API响应: HTTP/1.1 403 Forbidden content-type:text/html'
  }
];

function buildAlerts(row: RiskBehaviorRow): WebAttackAlertRow[] {
  const rows: WebAttackAlertRow[] = [];
  for (let i = 0; i < 20; i += 1) {
    const template = alertTemplates[i % alertTemplates.length];
    rows.push({
      ...template,
      id: `${row.id}-alert-${i + 1}`,
      occurredAt: i === 0 ? '2026-04-08 18:58:29' : `2026-04-08 18:${String(57 - (i % 10)).padStart(2, '0')}:${String(10 + i).padStart(2, '0')}`
    });
  }
  return rows;
}

export function buildWebAttackDetail(id: string): WebAttackDetail | null {
  const row = riskBehaviorRows.find((item) => item.id === id && item.tabKey === 'web-attack');
  if (!row) return null;

  const severity = row.severity;
  const attackId = String(82783782 + Number(row.id.replace(/\D/g, '') || 0));

  return {
    id: row.id,
    attackId,
    severity,
    title: `来自${row.sourceIp}的${row.riskType}`,
    attackName: row.riskType,
    sourceIp: row.sourceIp,
    attackCount: row.id === 'web-1' ? 10 : row.sourceCount,
    appName: row.keywordLabel && row.keywordLabel !== '-' ? '应用名称' : '应用名称',
    appDomain: row.keywordLabel && row.keywordLabel !== '-' ? row.keywordLabel : '域名',
    discoveredAt: row.id === 'web-1' ? '2025-11-05 00:00:47' : row.discoveredAt,
    activeAt: row.id === 'web-1' ? '2025-11-06 16:40:34' : row.activeAt,
    riskStatus: '待处理',
    eventResult: row.eventResult || '成功',
    aiVerdict: row.aiVerdict || '真实威胁',
    aiEventResult: row.eventResult === '失败' ? '失败' : '成功',
    disposalRecords: [
      {
        time: '2025-11-05 08:47:58',
        content: '首次发现该攻击事件'
      }
    ],
    aiJudgment: {
      conclusion: row.aiVerdict || '真实威胁',
      explanation: [
        '攻击特征与已知暴力破解、SQL注入模式高度匹配，非测试流量。',
        '同源 IP 在短时间内对多个接口发起异常请求，存在明确攻击意图。',
        `事件结果判定为「${row.eventResult || '成功'}」，建议优先处置。`
      ],
      suggestions: [
        '对来源 IP 实施临时封禁，并同步更新 WAF 拦截策略。',
        '检查受影响接口是否存在弱口令或 SQL 注入漏洞并及时修复。',
        '持续观察 24 小时，确认无二次攻击后解除观察状态。'
      ]
    },
    alerts: buildAlerts(row)
  };
}
