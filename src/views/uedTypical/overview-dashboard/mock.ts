import type { LifecycleStage, RiskRankItem, RiskTabKey, SensitiveDataItem, SummaryMetric } from './types';

export const summaryMetrics: SummaryMetric[] = [
  { key: 'app', label: '应用系统', value: 5766, tone: 'blue', icon: 'app' },
  { key: 'api', label: 'API', value: 36492, tone: 'orange', icon: 'api' },
  { key: 'account', label: '账号', value: 2786, tone: 'green', icon: 'account' },
  { key: 'file', label: '文件', value: 2200, tone: 'purple', icon: 'file' }
];

export const lifecycleByScope: Record<'app' | 'api', LifecycleStage[]> = {
  app: [
    { key: 'new', label: '新发现', value: 5766, tone: 'new' },
    { key: 'active', label: '活跃', value: 0, tone: 'active' },
    { key: 'revive', label: '复活', value: 0, tone: 'revive' },
    { key: 'offline', label: '疑似下线', value: 0, tone: 'offline' }
  ],
  api: [
    { key: 'new', label: '新发现', value: 36492, tone: 'new' },
    { key: 'active', label: '活跃', value: 12840, tone: 'active' },
    { key: 'revive', label: '复活', value: 126, tone: 'revive' },
    { key: 'offline', label: '疑似下线', value: 86, tone: 'offline' }
  ]
};

const fragilityRisks: RiskRankItem[][] = [
  [
    { name: '鉴权信息在URL中', value: 2016, color: '#5B8FF9' },
    { name: '认证令牌有效性...', value: 212, color: '#61DDAA' },
    { name: '任意文件读取漏洞', value: 131, color: '#65789B' },
    { name: '明文密码传输', value: 119, color: '#F6BD16' },
    { name: 'SQL注入', value: 98, color: '#7262FD' },
    { name: '命令执行漏洞', value: 70, color: '#78D3F8' },
    { name: '任意文件上传', value: 47, color: '#9661BC' },
    { name: 'XSS攻击', value: 38, color: '#F6903D' },
    { name: '明文密码透出', value: 32, color: '#008685' },
    { name: '代码执行漏洞', value: 18, color: '#F08BB4' }
  ],
  [
    { name: '敏感信息泄露', value: 860, color: '#5B8FF9' },
    { name: '越权访问', value: 420, color: '#61DDAA' },
    { name: '弱口令', value: 318, color: '#65789B' },
    { name: '未授权访问', value: 256, color: '#F6BD16' },
    { name: '批量导出风险', value: 198, color: '#7262FD' },
    { name: '错误配置', value: 142, color: '#78D3F8' },
    { name: 'CSRF', value: 96, color: '#9661BC' },
    { name: '响应信息泄露', value: 74, color: '#F6903D' },
    { name: 'HTTP明文传输', value: 52, color: '#008685' },
    { name: '接口缺少限流', value: 36, color: '#F08BB4' }
  ],
  [
    { name: '支付回调未验签', value: 128, color: '#5B8FF9' },
    { name: 'JWT未校验签名', value: 96, color: '#61DDAA' },
    { name: 'GraphQL深度查询', value: 72, color: '#65789B' },
    { name: 'CORS配置宽松', value: 58, color: '#F6BD16' },
    { name: '手机号批量枚举', value: 44, color: '#7262FD' },
    { name: '密码重置链接长期有效', value: 32, color: '#78D3F8' },
    { name: '返回包包含内部IP', value: 24, color: '#9661BC' },
    { name: 'API版本信息泄露', value: 18, color: '#F6903D' },
    { name: '短信验证码可重放', value: 12, color: '#008685' },
    { name: '调试字段暴露', value: 8, color: '#F08BB4' }
  ]
];

const behaviorRisks: RiskRankItem[][] = [
  [
    { name: '异常高频访问', value: 1260, color: '#5B8FF9' },
    { name: '异地登录行为', value: 680, color: '#61DDAA' },
    { name: '批量爬取行为', value: 420, color: '#65789B' },
    { name: '非工作时间访问', value: 318, color: '#F6BD16' },
    { name: '敏感接口突增', value: 256, color: '#7262FD' },
    { name: '账号共享嫌疑', value: 198, color: '#78D3F8' },
    { name: '异常导出行为', value: 142, color: '#9661BC' },
    { name: '撞库尝试', value: 96, color: '#F6903D' },
    { name: '代理池访问', value: 74, color: '#008685' },
    { name: '异常IP聚集', value: 52, color: '#F08BB4' }
  ],
  [
    { name: '短时间多账号登录', value: 360, color: '#5B8FF9' },
    { name: '接口遍历探测', value: 288, color: '#61DDAA' },
    { name: '失败请求突增', value: 220, color: '#65789B' },
    { name: '跨应用横向访问', value: 176, color: '#F6BD16' },
    { name: '敏感字段批量拉取', value: 142, color: '#7262FD' },
    { name: '异常User-Agent', value: 118, color: '#78D3F8' },
    { name: '夜间批量操作', value: 96, color: '#9661BC' },
    { name: '同设备多账号', value: 72, color: '#F6903D' },
    { name: '异常地理位置跳转', value: 48, color: '#008685' },
    { name: '高频失败认证', value: 32, color: '#F08BB4' }
  ],
  [
    { name: '影子API访问', value: 88, color: '#5B8FF9' },
    { name: '僵尸账号复活', value: 64, color: '#61DDAA' },
    { name: '异常文件下载', value: 52, color: '#65789B' },
    { name: '接口参数爆破', value: 40, color: '#F6BD16' },
    { name: '异常响应体大小', value: 28, color: '#7262FD' },
    { name: '短时大量404', value: 22, color: '#78D3F8' },
    { name: '异常Referer来源', value: 16, color: '#9661BC' },
    { name: '敏感标签突增', value: 12, color: '#F6903D' },
    { name: '异常Cookie复用', value: 8, color: '#008685' },
    { name: '批量注销行为', value: 4, color: '#F08BB4' }
  ]
];

export function getRiskPages(tab: RiskTabKey) {
  return tab === 'fragility' ? fragilityRisks : behaviorRisks;
}

export const riskTrend = {
  dates: ['5', '9', '13', '17', '21', '25', '29', '7月'],
  fragility: [120, 180, 260, 320, 480, 620, 980, 1890],
  behavior: [12, 18, 22, 28, 30, 26, 24, 20]
};

export const sensitiveData: SensitiveDataItem[] = [
  { name: '姓名', request: 120, response: 8600 },
  { name: '手机号码', request: 280, response: 9200 },
  { name: '详细地址', request: 96, response: 6400 },
  { name: '身份证', request: 64, response: 7800 },
  { name: '邮箱地址', request: 180, response: 5200 },
  { name: '银行卡', request: 42, response: 3600 }
];
