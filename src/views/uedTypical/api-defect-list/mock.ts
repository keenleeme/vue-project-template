import type { ApiDefectDetail, ApiDefectRow, DefectCategoryNode } from './types';

export const defectCategoryTree: DefectCategoryNode[] = [
  {
    key: 'all',
    title: '全部缺陷',
    count: 454
  },
  {
    key: 'web-security',
    title: 'Web安全缺陷',
    children: [
      { key: 'sql-injection', title: 'SQL注入', count: 23, badge: '成功' },
      { key: 'csrf', title: 'CSRF跨站', count: 89 },
      { key: 'auth-in-url', title: '鉴权信息在URL中', count: 76, badge: '成功' },
      { key: 'xss', title: 'XSS攻击', count: 76 }
    ]
  },
  {
    key: 'security-spec',
    title: '安全规范类',
    children: [
      { key: 'mask-incomplete', title: '脱敏策略不彻底', count: 45 },
      { key: 'dangerous-get', title: 'GET方式执行高危操作', count: 45 },
      { key: 'plaintext-password', title: '明文密码传输', count: 45, badge: '成功' }
    ]
  },
  {
    key: 'identity-permission',
    title: '身份权限类',
    children: [
      { key: 'weak-password', title: '登录弱密码', count: 23 },
      { key: 'plaintext-leak', title: '明文密码送出', count: 45 },
      { key: 'sensitive-in-url', title: '敏感信息在URL中', count: 45 }
    ]
  },
  {
    key: 'owasp-top10',
    title: 'OWASP API TOP 10',
    children: [
      { key: 'owasp-a1', title: 'A1-失效的对象级授权', count: 32 },
      { key: 'owasp-a2', title: 'A2-失效的身份认证', count: 28 },
      { key: 'owasp-a3', title: 'A3-过度的数据暴露', count: 21 },
      { key: 'owasp-a4', title: 'A4-缺乏资源和速率限制', count: 18 }
    ]
  }
];

const defectTemplates: Omit<ApiDefectRow, 'id'>[] = [
  {
    categoryKey: 'auth-in-url',
    defectName: '鉴权信息在URL中',
    severity: '中',
    discoveredAt: '2023-11-03 15:53:57',
    activeAt: '2023-11-04 09:35:18',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/comm/api/v1/user/profile',
    appInfo: '未标识',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置',
    hasPendingAction: true
  },
  {
    categoryKey: 'plaintext-password',
    defectName: '明文密码传输',
    severity: '高',
    discoveredAt: '2023-11-03 14:22:10',
    activeAt: '2023-11-04 08:15:42',
    aiVerdict: '疑似威胁',
    method: 'POST',
    path: '/api/v2/auth/login',
    appInfo: '未标识',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置'
  },
  {
    categoryKey: 'sql-injection',
    defectName: '命令执行漏洞',
    severity: '中',
    discoveredAt: '2023-11-02 18:40:33',
    activeAt: '2023-11-03 11:20:05',
    aiVerdict: '真实威胁',
    method: 'POST',
    path: '/api/v1/agent/execute',
    appInfo: '未标识',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置',
    hasPendingAction: true
  },
  {
    categoryKey: 'sql-injection',
    defectName: 'SQL注入',
    severity: '高',
    discoveredAt: '2023-11-02 16:08:21',
    activeAt: '2023-11-03 10:45:30',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/api/v1/order/query',
    appInfo: '未标识',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置'
  },
  {
    categoryKey: 'csrf',
    defectName: 'CSRF跨站请求伪造',
    severity: '中',
    discoveredAt: '2023-11-01 12:30:00',
    activeAt: '2023-11-02 09:12:18',
    aiVerdict: '真实威胁',
    method: 'POST',
    path: '/api/v1/payment/transfer',
    appInfo: 'http_pay_gateway_443',
    accessDomain: '互联网',
    deployDomain: 'DMZ',
    processStatus: '待处置'
  },
  {
    categoryKey: 'xss',
    defectName: 'XSS攻击',
    severity: '高',
    discoveredAt: '2023-10-31 20:15:44',
    activeAt: '2023-11-01 08:30:22',
    aiVerdict: '误报',
    method: 'POST',
    path: '/api/v1/comment/submit',
    appInfo: 'http_comment_service_80',
    accessDomain: '互联网',
    deployDomain: '互联网',
    processStatus: '待处置'
  },
  {
    categoryKey: 'mask-incomplete',
    defectName: '脱敏策略不彻底',
    severity: '中',
    discoveredAt: '2023-10-30 11:22:33',
    activeAt: '2023-10-31 14:08:55',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/api/v1/user/list',
    appInfo: 'http_user_center_443',
    accessDomain: '内网',
    deployDomain: '内网',
    processStatus: '已确认'
  },
  {
    categoryKey: 'dangerous-get',
    defectName: 'GET方式执行高危操作',
    severity: '高',
    discoveredAt: '2023-10-29 09:45:12',
    activeAt: '2023-10-30 16:20:08',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/api/v1/admin/delete',
    appInfo: 'http_admin_console_443',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置',
    hasPendingAction: true
  },
  {
    categoryKey: 'weak-password',
    defectName: '登录弱密码',
    severity: '中',
    discoveredAt: '2023-10-28 15:33:20',
    activeAt: '2023-10-29 10:11:45',
    aiVerdict: '无法研判',
    method: 'POST',
    path: '/api/v1/auth/register',
    appInfo: '未标识',
    accessDomain: '局域网',
    deployDomain: '局域网',
    processStatus: '待处置'
  },
  {
    categoryKey: 'sensitive-in-url',
    defectName: '敏感信息在URL中',
    severity: '高',
    discoveredAt: '2023-10-27 08:12:55',
    activeAt: '2023-10-28 13:40:30',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/api/v1/export/data',
    appInfo: 'http_export_service_8080',
    accessDomain: '局域网',
    deployDomain: '云环境',
    processStatus: '待处置'
  },
  {
    categoryKey: 'owasp-a1',
    defectName: '失效的对象级授权',
    severity: '高',
    discoveredAt: '2023-10-26 17:25:40',
    activeAt: '2023-10-27 09:50:15',
    aiVerdict: '真实威胁',
    method: 'GET',
    path: '/api/v1/resource/{id}',
    appInfo: 'http_resource_api_443',
    accessDomain: '内网',
    deployDomain: '内网',
    processStatus: '待处置'
  },
  {
    categoryKey: 'owasp-a2',
    defectName: '失效的身份认证',
    severity: '高',
    discoveredAt: '2023-10-25 14:08:22',
    activeAt: '2023-10-26 11:33:48',
    aiVerdict: '真实威胁',
    method: 'POST',
    path: '/api/v1/token/refresh',
    appInfo: 'http_auth_service_443',
    accessDomain: 'DMZ',
    deployDomain: 'DMZ',
    processStatus: '待处置'
  }
];

function buildMockRows(): ApiDefectRow[] {
  const rows: ApiDefectRow[] = defectTemplates.map((item, index) => ({
    ...item,
    id: String(index + 1)
  }));

  let id = rows.length + 1;
  const categoryKeys = [
    'sql-injection',
    'csrf',
    'auth-in-url',
    'xss',
    'mask-incomplete',
    'dangerous-get',
    'plaintext-password',
    'weak-password',
    'plaintext-leak',
    'sensitive-in-url',
    'owasp-a1',
    'owasp-a2',
    'owasp-a3',
    'owasp-a4'
  ];
  const severities: ApiDefectRow['severity'][] = ['高', '中', '低'];
  const methods: ApiDefectRow['method'][] = ['GET', 'POST', 'PUT', 'DELETE'];
  const domains: ApiDefectRow['accessDomain'][] = ['互联网', '局域网', '内网', 'DMZ', '云环境'];

  while (rows.length < 85) {
    const template = defectTemplates[rows.length % defectTemplates.length];
    const day = String((rows.length % 28) + 1).padStart(2, '0');
    rows.push({
      ...template,
      id: String(id),
      categoryKey: categoryKeys[rows.length % categoryKeys.length],
      severity: severities[rows.length % severities.length],
      method: methods[rows.length % methods.length],
      accessDomain: domains[rows.length % domains.length],
      deployDomain: domains[(rows.length + 2) % domains.length],
      discoveredAt: `2023-10-${day} ${String(8 + (rows.length % 12)).padStart(2, '0')}:15:00`,
      activeAt: `2023-10-${day} ${String(14 + (rows.length % 8)).padStart(2, '0')}:30:00`,
      hasPendingAction: rows.length % 5 === 0
    });
    id += 1;
  }

  return rows;
}

export const mockApiDefectRows = buildMockRows();
export const mockApiDefectTotal = 85;

export const severityOptions = [
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' }
];

export const aiVerdictOptions = [
  { label: '误报', value: '误报' },
  { label: '真实威胁', value: '真实威胁' },
  { label: '疑似威胁', value: '疑似威胁' },
  { label: '无法研判', value: '无法研判' }
];

export const processStatusOptions = [
  { label: '待处置', value: '待处置' },
  { label: '已确认', value: '已确认' },
  { label: '已忽略', value: '已忽略' }
];

export const domainOptions = [
  { label: '互联网', value: '互联网' },
  { label: '局域网', value: '局域网' },
  { label: '内网', value: '内网' },
  { label: 'DMZ', value: 'DMZ' },
  { label: '云环境', value: '云环境' }
];

export function getCategoryDescendantKeys(key: string): string[] {
  if (key === 'all') return [];

  const findNode = (nodes: DefectCategoryNode[]): DefectCategoryNode | undefined => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const node = findNode(defectCategoryTree);
  if (!node) return [key];
  if (!node.children?.length) return [key];

  const keys: string[] = [];
  const walk = (children: DefectCategoryNode[]) => {
    children.forEach((child) => {
      if (child.children?.length) {
        walk(child.children);
      } else {
        keys.push(child.key);
      }
    });
  };
  walk(node.children);
  return keys;
}

const defectTypeMap: Record<string, { defectType: string; owaspApi: string }> = {
  'auth-in-url': { defectType: '损坏的身份认证', owaspApi: 'API13-损坏的身份认证' },
  'sql-injection': { defectType: '注入类缺陷', owaspApi: 'API8-注入' },
  csrf: { defectType: 'Web安全缺陷', owaspApi: 'API6-未限制的资源消耗' },
  xss: { defectType: '跨站脚本攻击', owaspApi: 'API8-注入' },
  'mask-incomplete': { defectType: '安全规范类', owaspApi: 'API3-过度的数据暴露' },
  'dangerous-get': { defectType: '安全规范类', owaspApi: 'API1-失效的对象级授权' },
  'plaintext-password': { defectType: '损坏的身份认证', owaspApi: 'API2-失效的身份认证' },
  'weak-password': { defectType: '损坏的身份认证', owaspApi: 'API2-失效的身份认证' },
  'plaintext-leak': { defectType: '敏感数据泄露', owaspApi: 'API3-过度的数据暴露' },
  'sensitive-in-url': { defectType: '敏感数据泄露', owaspApi: 'API3-过度的数据暴露' },
  'owasp-a1': { defectType: '失效的对象级授权', owaspApi: 'API1-失效的对象级授权' },
  'owasp-a2': { defectType: '损坏的身份认证', owaspApi: 'API2-失效的身份认证' },
  'owasp-a3': { defectType: '过度的数据暴露', owaspApi: 'API3-过度的数据暴露' },
  'owasp-a4': { defectType: '未限制的资源消耗', owaspApi: 'API4-缺乏资源和速率限制' }
};

const defaultExploitable =
  '攻击者可通过该漏洞执行系统命令，上传后门木马，进而控制服务器主机，窃取敏感数据或发起进一步攻击。';
const defaultRemediation =
  '1、确认漏洞存在后，及时修复漏洞；2、排查并清除已上传的后门木马文件；3、加强接口鉴权与参数校验。';

const defaultAlertSnapshot = {
  requestUrl: 'GET /comm/pollingnewmsg?token=client&uid=10001 HTTP/1.1',
  requestRaw: `GET /comm/pollingnewmsg?token=client&uid=10001 HTTP/1.1
Host: 10.23.30.58:55444
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json, text/plain, */*
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive
Cookie: JSESSIONID=A1B2C3D4; token=xxx; path=/`,
  requestHeader: `GET /comm/pollingnewmsg?token=client&uid=10001 HTTP/1.1
Host: 10.23.30.58:55444
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json, text/plain, */*
Accept-Language: zh-CN,zh;q=0.9
Connection: keep-alive`,
  requestCookie: `JSESSIONID=A1B2C3D4; Path=/; HttpOnly
token=xxx; Path=/`,
  requestBody: '',
  responseRaw: `HTTP/1.1 200 OK
Server: nginx/1.20.2
Date: Tue, 08 Apr 2026 03:12:23 GMT
Content-Type: application/json; charset=UTF-8
Connection: keep-alive
access-control-allow-origin: *
set-cookie: session_id=efg456; Path=/; HttpOnly

{"code":0,"msg":"success","data":{"unread":3}}`,
  responseHeader: `HTTP/1.1 200 OK
Server: nginx/1.20.2
Date: Tue, 08 Apr 2026 03:12:23 GMT
Content-Type: application/json; charset=UTF-8
Connection: keep-alive
access-control-allow-origin: *`,
  responseSetCookie: `session_id=efg456; Path=/; HttpOnly; Max-Age=3600`,
  responseBody: `{"code":0,"msg":"success","data":{"unread":3}}`,
  highlightTag: 'token=xxx',
  highlightCount: 1
};

function buildAlertInstances(row: ApiDefectRow, isAuthInUrl: boolean) {
  const snapshot = isAuthInUrl
    ? defaultAlertSnapshot
    : {
        ...defaultAlertSnapshot,
        requestUrl: `${row.method} ${row.path} HTTP/1.1`,
        requestRaw: defaultAlertSnapshot.requestRaw.replace('/comm/pollingnewmsg?token=client&uid=10001', row.path),
        highlightTag: 'token'
      };

  const hitRules = isAuthInUrl
    ? [
        {
          ruleNo: '规则1',
          snapshot:
            '匹配成功：请求URL: http://10.23.30.58:55444/comm/pollingnewmsg?token=client&uid=10001',
          highlightText: 'token=client&'
        },
        { ruleNo: '规则2、规则3', snapshot: '未进行匹配' },
        { ruleNo: '规则关系', snapshot: '1 | (2 & 3)', showHelp: true }
      ]
    : [
        { ruleNo: '规则1', snapshot: `匹配成功：请求路径包含 ${row.defectName} 特征`, highlightText: row.path },
        { ruleNo: '规则2、规则3', snapshot: '未进行匹配' },
        { ruleNo: '规则关系', snapshot: '1 | (2 & 3)', showHelp: true }
      ];

  const alertTime = '2026/4/8 11:12:23';

  const logInfo = {
    client: {
      ip: '10.50.3.246',
      ipRegion: '中国·浙江省·杭州市',
      networkDomain: '局域网',
      port: 51360,
      mac: '08:94:ef:bc:56:3e'
    },
    application: {
      ip: isAuthInUrl ? '10.23.30.58' : '10.20.152.35',
      ipRegion: isAuthInUrl ? '中国·浙江省·杭州市' : '中国·北京市·海淀区',
      networkDomain: row.deployDomain === '互联网' ? '互联网' : '局域网',
      port: isAuthInUrl ? 55444 : 9092,
      mac: '60:db:15:73:46:01',
      appName: isAuthInUrl ? 'http_10.23.30.58_55444' : `http_10.20.152.35_9092`
    },
    transportProtocol: 'TCP',
    applicationProtocol: 'HTTP',
    captureInterface: 'eth2',
    responseTime: '42.64秒'
  };

  return [
    { id: `${row.id}-alert-1`, time: alertTime, hitRules, snapshot, logInfo },
    { id: `${row.id}-alert-2`, time: alertTime, hitRules, snapshot, logInfo },
    { id: `${row.id}-alert-3`, time: alertTime, hitRules, snapshot, logInfo }
  ];
}

export function buildDefectDetail(row: ApiDefectRow): ApiDefectDetail {
  const typeInfo = defectTypeMap[row.categoryKey] || {
    defectType: 'Web安全缺陷',
    owaspApi: 'API10-不当资产管理'
  };

  const displayStatusMap: Record<ApiDefectRow['processStatus'], ApiDefectDetail['displayStatus']> = {
    待处置: '待处理',
    已确认: '处理中',
    已忽略: '已忽略'
  };

  const defectId = `1985747811567878${row.id.padStart(3, '0')}`;
  const isAuthInUrl = row.defectName === '鉴权信息在URL中';

  return {
    ...row,
    defectId,
    defectType: typeInfo.defectType,
    owaspApi: typeInfo.owaspApi,
    displayStatus: displayStatusMap[row.processStatus],
    exploitableMethod: defaultExploitable,
    remediation: defaultRemediation,
    handlingRecords: [
      {
        time: row.discoveredAt.replace('2023', '2025'),
        content: '首次发现该资产缺陷'
      }
    ],
    visits: isAuthInUrl ? '14W' : `${12 + Number(row.id)}W`,
    apiType: isAuthInUrl ? '登录接口' : '业务接口',
    responseContentType: 'application/json',
    appName: isAuthInUrl ? 'http_10.23.30.58_55444' : row.appInfo === '未标识' ? `http_app_${row.id}` : row.appInfo,
    appDomain: isAuthInUrl ? 'http_10.23.30.58_55444' : row.appInfo === '未标识' ? `http_app_${row.id}` : row.appInfo,
    appStatus: isAuthInUrl ? '重要' : row.appInfo === '未标识' ? '未标识' : '确认',
    requestTags: isAuthInUrl ? ['手机号', '手机号'] : ['用户ID'],
    responseTags: isAuthInUrl ? ['手机号', '手机号'] : ['认证凭证'],
    path: isAuthInUrl ? '/comm/pollingnewmsg' : row.path,
    method: isAuthInUrl ? 'GET' : row.method,
    discoveredAt: isAuthInUrl ? '2025-11-05 00:00:47' : row.discoveredAt,
    activeAt: isAuthInUrl ? '2025-11-06 16:40:34' : row.activeAt,
    alertInstances: buildAlertInstances(row, isAuthInUrl),
    aiJudgment: {
      conclusion: row.aiVerdict,
      explanation:
        row.aiVerdict === '真实威胁'
          ? [
              '告警名称与设计理念匹配，请求无鉴权参数且响应返回了敏感数据（手机号、身份证、银行卡等）。',
              '非误报，原始HTTP内容清晰显示未鉴权访问并泄露敏感信息。',
              '真实威胁，攻击成本低、复杂度低、影响范围大，非测试或日志场景。'
            ]
          : row.aiVerdict === '误报'
            ? [
                '告警规则与当前请求上下文不匹配，响应中未发现实际敏感数据泄露。',
                '请求包含合法鉴权参数，属于正常业务调用场景。',
                '综合判定为误报，建议优化检测规则以减少噪音。'
              ]
            : row.aiVerdict === '疑似威胁'
              ? [
                  '请求中存在部分可疑特征，但缺少完整的攻击链路证据。',
                  '响应数据可能包含敏感字段，需结合业务上下文进一步确认。',
                  '暂无法完全排除威胁，建议人工复核。'
                ]
              : [
                  '当前告警样本信息不足，无法完成自动化研判。',
                  '缺少完整的请求/响应上下文或关键字段缺失。',
                  '建议补充样本后重新发起AI研判。'
                ],
      suggestions:
        row.aiVerdict === '真实威胁'
          ? [
              '建议立即对该接口实施强制鉴权（如OAuth2.0令牌），并对响应中的敏感字段进行脱敏处理，同时审计攻击来源IP并排查是否存在数据泄露。'
            ]
          : row.aiVerdict === '误报'
            ? ['建议调整检测规则阈值或增加白名单，避免同类正常请求触发告警。']
            : row.aiVerdict === '疑似威胁'
              ? ['建议安全人员人工复核告警样本，结合业务场景确认是否为真实威胁。']
              : ['建议补充完整HTTP请求/响应样本后重新发起AI研判。']
    }
  };
}
