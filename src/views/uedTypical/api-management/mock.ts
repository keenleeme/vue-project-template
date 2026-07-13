import type { ApiDataTagInput, ApiDefectItem, ApiDetail, ApiManagementRow, ApiParameterRow, IsApiVerdict } from './types';
import { getTagName } from './utils/dataTag';

type RawApiRow = Omit<ApiManagementRow, 'businessType' | 'apiDescription' | 'isApi' | 'isApiAiBasis' | 'isSensitive' | 'sensitiveLevel'>;

const rawRows: RawApiRow[] = [
  {
    id: '1',
    name: '未命名',
    lifecycle: '新发现',
    method: 'POST',
    path: '/open/api/v2/agent/execute',
    appName: 'http_10.50.71.208_31094',
    appDomain: 'www.das-ai.com',
    appStatus: '未标识',
    visits: 231024,
    requestTags: ['全员标签'],
    responseTags: ['全员标签'],
    aiInterpretation: '是否为API: --',
    riskCount: 12,
    riskStrategies: ['SQL注入'],
    deployDomain: '局域网'
  },
  {
    id: '2',
    name: '未命名',
    lifecycle: '新发现',
    method: 'POST',
    path: '/open/api/v2/agent/execute',
    appName: 'http_10.50.85.5_9092',
    appDomain: '10.50.85.5:9092',
    appStatus: '未标识',
    visits: 231024,
    requestTags: ['全员标签'],
    responseTags: ['全员标签'],
    aiInterpretation: '是否为API: --',
    riskCount: 12,
    riskStrategies: ['SQL注入'],
    deployDomain: '互联网'
  },
  {
    id: '3',
    name: '未命名',
    lifecycle: '新发现',
    method: 'POST',
    path: '/open/api/v2/agent/execute',
    appName: 'http_10.50.71.208_31094',
    appDomain: 'www.das-ai.com',
    appStatus: '未标识',
    visits: 231024,
    requestTags: ['全员标签'],
    responseTags: ['全员标签'],
    aiInterpretation: '是否为API: --',
    riskCount: 12,
    riskStrategies: ['SQL注入'],
    deployDomain: '局域网'
  },
  {
    id: '4',
    name: '订单导出接口',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/order/export',
    appName: 'http_order_center_443',
    appDomain: 'order.example.com',
    appStatus: '关键',
    visits: 186420,
    requestTags: ['订单号', '手机号'],
    responseTags: ['订单信息', '身份证号'],
    aiInterpretation: '是否为API: 是',
    riskCount: 8,
    riskStrategies: ['敏感泄露', '越权访问'],
    deployDomain: '内网'
  },
  {
    id: '5',
    name: '用户资料查询',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/user/profile',
    appName: 'http_user_center_443',
    appDomain: 'user.example.com',
    appStatus: '确认',
    visits: 142860,
    requestTags: ['用户ID'],
    responseTags: ['手机号', '邮箱地址'],
    aiInterpretation: '是否为API: 是',
    riskCount: 5,
    riskStrategies: ['XSS'],
    deployDomain: 'DMZ'
  },
  {
    id: '6',
    name: '支付退款',
    lifecycle: '活跃',
    method: 'POST',
    path: '/api/payment/refund',
    appName: 'http_pay_gateway_443',
    appDomain: 'pay.example.com',
    appStatus: '关键',
    visits: 98420,
    requestTags: ['银行卡号'],
    responseTags: ['金融数据'],
    aiInterpretation: '是否为API: 是',
    riskCount: 6,
    riskStrategies: ['SQL注入', 'CSRF'],
    deployDomain: '云环境'
  },
  {
    id: '7',
    name: '统一认证令牌',
    lifecycle: '新发现',
    method: 'POST',
    path: '/api/auth/token',
    appName: 'http_auth_service_443',
    appDomain: 'auth.example.com',
    appStatus: '确认',
    visits: 75680,
    requestTags: ['访问令牌'],
    responseTags: ['认证凭证'],
    aiInterpretation: '是否为API: 是',
    riskCount: 3,
    riskStrategies: ['弱口令'],
    deployDomain: '内网'
  },
  {
    id: '8',
    name: '文件上传',
    lifecycle: '活跃',
    method: 'POST',
    path: '/api/file/upload',
    appName: 'http_file_service_80',
    appDomain: 'file.example.com',
    appStatus: '不重要',
    visits: 52340,
    requestTags: ['文件流'],
    responseTags: ['文件地址'],
    aiInterpretation: '是否为API: 是',
    riskCount: 4,
    riskStrategies: ['未鉴权访问'],
    deployDomain: '互联网'
  },
  {
    id: '9',
    name: '微信回调',
    lifecycle: '疑似下线',
    method: 'POST',
    path: '/api/wechat/callback',
    appName: 'http_wechat_bridge_443',
    appDomain: 'wechat.example.com',
    appStatus: '未标识',
    visits: 12860,
    requestTags: ['回调签名'],
    responseTags: ['业务状态'],
    aiInterpretation: '是否为API: 待确认',
    riskCount: 2,
    riskStrategies: ['错误配置'],
    deployDomain: '互联网'
  },
  {
    id: '10',
    name: '报表下载',
    lifecycle: '复活',
    method: 'GET',
    path: '/api/report/download',
    appName: 'http_report_service_443',
    appDomain: 'report.example.com',
    appStatus: '确认',
    visits: 34210,
    requestTags: ['报表ID'],
    responseTags: ['报表文件'],
    aiInterpretation: '是否为API: 是',
    riskCount: 7,
    riskStrategies: ['批量导出'],
    deployDomain: '局域网'
  },
  {
    id: '11',
    name: '注册提交',
    lifecycle: '新发现',
    method: 'POST',
    path: '/api/register/submit',
    appName: 'http_register_portal_443',
    appDomain: 'register.example.com',
    appStatus: '未标识',
    visits: 45680,
    requestTags: ['手机号', '验证码'],
    responseTags: ['用户ID'],
    aiInterpretation: '是否为API: 是',
    riskCount: 4,
    riskStrategies: ['暴力破解'],
    deployDomain: '互联网'
  },
  {
    id: '12',
    name: '客户身份证查询',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/customer/idcard',
    appName: 'http_crm_core_443',
    appDomain: 'crm.example.com',
    appStatus: '关键',
    visits: 67890,
    requestTags: ['客户ID'],
    responseTags: ['身份证号', '姓名'],
    aiInterpretation: '是否为API: 是',
    riskCount: 9,
    riskStrategies: ['敏感泄露', 'SQL注入'],
    deployDomain: '内网'
  },
  {
    id: '13',
    name: '账户余额',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/account/balance',
    appName: 'http_account_service_443',
    appDomain: 'account.example.com',
    appStatus: '关键',
    visits: 112340,
    requestTags: ['账户号'],
    responseTags: ['账户余额', '金融数据'],
    aiInterpretation: '是否为API: 是',
    riskCount: 6,
    riskStrategies: ['越权访问'],
    deployDomain: 'DMZ'
  },
  {
    id: '14',
    name: '日志检索',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/log/query',
    appName: 'http_log_platform_9200',
    appDomain: 'log.example.com',
    appStatus: '不重要',
    visits: 28940,
    requestTags: ['查询条件'],
    responseTags: ['日志内容'],
    aiInterpretation: '是否为API: 是',
    riskCount: 1,
    riskStrategies: ['响应信息泄露'],
    deployDomain: '云环境'
  },
  {
    id: '15',
    name: '健康检查',
    lifecycle: '活跃',
    method: 'GET',
    path: '/api/health',
    appName: 'http_legacy_portal_80',
    appDomain: 'legacy.example.com',
    appStatus: '不重要',
    visits: 8920,
    requestTags: [],
    responseTags: ['状态码'],
    aiInterpretation: '是否为API: 否',
    riskCount: 0,
    riskStrategies: [],
    deployDomain: '局域网'
  },
  {
    id: '16',
    name: '交易下单',
    lifecycle: '活跃',
    method: 'POST',
    path: '/api/trade/order',
    appName: 'http_trade_core_443',
    appDomain: 'trade.example.com',
    appStatus: '关键',
    visits: 203560,
    requestTags: ['交易金额', '银行卡号'],
    responseTags: ['订单号', '交易状态'],
    aiInterpretation: '是否为API: 是',
    riskCount: 10,
    riskStrategies: ['SQL注入', 'CSRF'],
    deployDomain: '内网'
  },
  {
    id: '17',
    name: '未命名',
    lifecycle: '新发现',
    method: 'PUT',
    path: '/api/config/update',
    appName: 'http_config_center_8080',
    appDomain: '10.20.30.40:8080',
    appStatus: '未标识',
    visits: 5620,
    requestTags: ['配置项'],
    responseTags: ['配置结果'],
    aiInterpretation: '是否为API: 待确认',
    riskCount: 2,
    riskStrategies: ['越权访问'],
    deployDomain: '局域网'
  },
  {
    id: '18',
    name: '消息推送',
    lifecycle: '活跃',
    method: 'POST',
    path: '/api/message/push',
    appName: 'http_message_hub_443',
    appDomain: 'message.example.com',
    appStatus: '确认',
    visits: 87430,
    requestTags: ['手机号', '消息内容'],
    responseTags: ['推送结果'],
    aiInterpretation: '是否为API: 是',
    riskCount: 3,
    riskStrategies: ['XSS'],
    deployDomain: '云环境'
  },
  {
    id: '19',
    name: '数据同步',
    lifecycle: '疑似下线',
    method: 'POST',
    path: '/api/legacy/sync',
    appName: 'http_legacy_sync_9000',
    appDomain: 'sync.internal.com',
    appStatus: '不重要',
    visits: 3240,
    requestTags: ['同步批次'],
    responseTags: ['同步状态'],
    aiInterpretation: '是否为API: 是',
    riskCount: 5,
    riskStrategies: ['HTTP明文传输'],
    deployDomain: '内网'
  },
  {
    id: '20',
    name: '开放代理执行',
    lifecycle: '新发现',
    method: 'POST',
    path: '/open/api/v2/agent/execute',
    appName: 'http_agent_gateway_31094',
    appDomain: 'agent.das-ai.com',
    appStatus: '未标识',
    visits: 231024,
    requestTags: ['全员标签'],
    responseTags: ['全员标签'],
    aiInterpretation: '是否为API: --',
    riskCount: 12,
    riskStrategies: ['SQL注入'],
    deployDomain: '互联网'
  }
];

interface BusinessMeta {
  businessType: string;
  apiDescription: string;
  requestTags: ApiDataTagInput[];
  responseTags: ApiDataTagInput[];
}

function resolveBusinessMeta(row: RawApiRow): BusinessMeta {
  const map: Record<string, BusinessMeta> = {
    '/open/api/v2/agent/execute': {
      businessType: '代理执行接口',
      apiDescription:
        '路径含 /agent/execute，请求体含 agent 指令参数，响应返回执行结果 JSON，符合代理任务下发接口特征。',
      requestTags: [{ name: '手机号' }, { name: '地址', ai: false }],
      responseTags: [{ name: '身份证号' }, { name: '姓名', ai: false }]
    },
    '/api/order/export': {
      businessType: '订单导出接口',
      apiDescription:
        'URL 路径含 /order/export，GET 方法携带订单筛选参数，响应 Content-Type 为文件流或 JSON 列表，判定为订单批量导出场景。',
      requestTags: ['订单号', '手机号'],
      responseTags: [{ name: '身份证号' }, { name: '姓名', ai: false }]
    },
    '/api/user/profile': {
      businessType: '用户资料查询接口',
      apiDescription:
        '路径 /user/profile 与 userId 查询参数组合，响应体含 nickname、phone、email 等用户画像字段，判定为用户资料查询。',
      requestTags: ['用户ID', '手机号'],
      responseTags: ['手机号', '身份证号', { name: '地址', ai: false }, { name: '姓名', ai: false }]
    },
    '/api/payment/refund': {
      businessType: '支付退款接口',
      apiDescription:
        '路径含 payment/refund，POST 请求体含 orderNo、refundAmount 等字段，响应返回退款流水号，符合支付退款业务特征。',
      requestTags: ['银行卡号', '订单号'],
      responseTags: ['身份证号', '金融数据']
    },
    '/api/auth/token': {
      businessType: '统一认证令牌接口',
      apiDescription:
        '路径 /auth/token，请求含 client_id、client_secret，响应返回 access_token 与 expires_in，符合 OAuth2 令牌颁发特征。',
      requestTags: ['手机号', '用户ID'],
      responseTags: ['认证凭证', '手机号']
    },
    '/api/file/upload': {
      businessType: '文件上传接口',
      apiDescription:
        'multipart/form-data 请求体含 file 字段，响应返回 fileUrl 或 fileId，判定为文件上传接口。',
      requestTags: [{ name: '姓名', ai: false }, '手机号'],
      responseTags: ['身份证号', { name: '地址', ai: false }]
    },
    '/api/wechat/callback': {
      businessType: '微信回调接口',
      apiDescription:
        '路径含 wechat/callback，请求含 signature、timestamp、nonce 等微信验签字段，判定为第三方回调通知接口。',
      requestTags: ['手机号', '用户ID'],
      responseTags: ['订单号', '手机号']
    },
    '/api/report/download': {
      businessType: '报表下载接口',
      apiDescription:
        '路径 /report/download 携带 reportId 参数，响应为 application/octet-stream，判定为报表文件下载接口。',
      requestTags: ['用户ID', '手机号'],
      responseTags: [{ name: '身份证号' }, { name: '姓名', ai: false }]
    },
    '/api/register/submit': {
      businessType: '用户注册接口',
      apiDescription:
        '路径 /register/submit，请求体含 mobile、verifyCode、password，响应返回 userId，符合用户注册提交场景。',
      requestTags: ['手机号', '验证码'],
      responseTags: ['用户ID', '手机号']
    },
    '/api/customer/idcard': {
      businessType: '客户身份证查询接口',
      apiDescription:
        '路径 /customer/idcard 与 customerId 参数，响应体直接返回 idCard、realName 字段，判定为敏感身份信息查询接口。',
      requestTags: ['客户ID', '手机号'],
      responseTags: [{ name: '身份证号' }, { name: '姓名', ai: false }]
    },
    '/api/account/balance': {
      businessType: '账户余额查询接口',
      apiDescription:
        '路径 /account/balance，请求含 accountNo，响应返回 balance、currency 等字段，判定为金融账户余额查询。',
      requestTags: ['银行卡号', '账户号'],
      responseTags: ['身份证号', '金融数据']
    },
    '/api/log/query': {
      businessType: '日志检索接口',
      apiDescription:
        '路径 /log/query 含 keyword、timeRange 等检索参数，响应返回日志条目列表，判定为日志查询接口。',
      requestTags: ['手机号', 'IP地址'],
      responseTags: ['身份证号', '手机号']
    },
    '/api/health': {
      businessType: '健康检查接口',
      apiDescription:
        '路径为 /health，无业务参数，响应仅含 status: ok 简单 JSON，判定为服务存活探测接口，非业务 API。',
      requestTags: [],
      responseTags: ['状态码']
    },
    '/api/trade/order': {
      businessType: '交易下单接口',
      apiDescription:
        '路径 /trade/order，POST 请求体含 amount、payMethod、cardNo，响应返回 orderNo、tradeStatus，判定为交易下单接口。',
      requestTags: ['银行卡号', '手机号'],
      responseTags: ['订单号', '身份证号']
    },
    '/api/config/update': {
      businessType: '配置更新接口',
      apiDescription:
        'PUT 方法更新 /config/update，请求体为 key-value 配置项，响应返回更新结果，判定为系统配置维护接口。',
      requestTags: ['用户ID', '手机号'],
      responseTags: ['姓名', '身份证号']
    },
    '/api/message/push': {
      businessType: '消息推送接口',
      apiDescription:
        '路径 /message/push，请求含 mobile、content、channel，响应返回 pushId，判定为消息推送下发接口。',
      requestTags: ['手机号', '姓名'],
      responseTags: ['手机号', '用户ID']
    },
    '/api/legacy/sync': {
      businessType: '数据同步接口',
      apiDescription:
        '路径 /legacy/sync，POST 请求含 batchId、syncData 数组，响应返回 syncStatus，判定为遗留系统数据同步接口。',
      requestTags: ['身份证号', '手机号'],
      responseTags: ['姓名', '银行卡号']
    }
  };

  const meta = map[row.path];
  if (meta) return meta;

  const reqTags = row.requestTags.filter((t) => getTagName(t) !== '全员标签');
  const resTags = row.responseTags.filter((t) => getTagName(t) !== '全员标签');

  return {
    businessType: row.name === '未命名' ? '待识别业务接口' : `${row.name}接口`,
    apiDescription: `根据路径 ${row.path}、请求方法 ${row.method} 及流量样本中的参数结构，初步判定为${row.name === '未命名' ? '通用' : row.name}类接口，建议补充样本以提高识别置信度。`,
    requestTags: reqTags.length ? reqTags : ['手机号', { name: '地址', ai: false }],
    responseTags: resTags.length ? resTags : [{ name: '身份证号' }, { name: '姓名', ai: false }]
  };
}

function enrichRow(row: RawApiRow): ApiManagementRow {
  const meta = resolveBusinessMeta(row);
  const enriched: ApiManagementRow = {
    ...row,
    businessType: meta.businessType,
    apiDescription: meta.apiDescription,
    requestTags: meta.requestTags.length ? meta.requestTags : row.requestTags,
    responseTags: meta.responseTags.length ? meta.responseTags : row.responseTags,
    isApi: '是',
    isApiAiBasis: '',
    isSensitive: '否',
    sensitiveLevel: '-'
  };
  const params = buildApiParams(enriched);
  const isApi = resolveIsApi(enriched);
  const { isSensitive, sensitiveLevel } = resolveApiSensitivity(params);

  return {
    ...enriched,
    isApi,
    isApiAiBasis: buildIsApiAiBasis(enriched, isApi),
    isSensitive,
    sensitiveLevel
  };
}

export const mockApiManagementRows = rawRows.map(enrichRow);
export const mockApiManagementTotal = 384883;

function buildApiParams(row: ApiManagementRow): { requestParams: ApiParameterRow[]; responseParams: ApiParameterRow[] } {
  const paramMap: Record<string, { requestParams: ApiParameterRow[]; responseParams: ApiParameterRow[] }> = {
    '/api/order/export': {
      requestParams: [
        { key: '1', name: 'orderId', paramType: 'string', sample: 'ORD20260323001', dataTag: '订单号', category: '订单数据', level: 'L2', sensitive: '否' },
        { key: '2', name: 'startDate', paramType: 'string', sample: '2026-01-01', dataTag: '日期', category: '基础信息', level: 'L1', sensitive: '否' },
        { key: '3', name: 'endDate', paramType: 'string', sample: '2026-03-23', dataTag: '日期', category: '基础信息', level: 'L1', sensitive: '否' }
      ],
      responseParams: [
        { key: '1', name: 'orderNo', paramType: 'string', sample: 'ORD20260323001', dataTag: '订单号', category: '订单数据', level: 'L2', sensitive: '否' },
        { key: '2', name: 'idCard', paramType: 'string', sample: '110101199001011234', dataTag: '身份证号', category: '身份信息', level: 'L4', sensitive: '是' },
        { key: '3', name: 'amount', paramType: 'number', sample: '1280.50', dataTag: '交易金额', category: '金融数据', level: 'L3', sensitive: '是' }
      ]
    },
    '/api/user/profile': {
      requestParams: [
        { key: '1', name: 'userId', paramType: 'string', sample: 'U10086', dataTag: '用户ID', category: '用户数据', level: 'L2', sensitive: '否' }
      ],
      responseParams: [
        { key: '1', name: 'mobile', paramType: 'string', sample: '13800138000', dataTag: '手机号', category: '联系方式', level: 'L3', sensitive: '是' },
        { key: '2', name: 'email', paramType: 'string', sample: 'user@example.com', dataTag: '邮箱地址', category: '联系方式', level: 'L2', sensitive: '否' },
        { key: '3', name: 'nickname', paramType: 'string', sample: '张三', dataTag: '姓名', category: '身份信息', level: 'L2', sensitive: '否' }
      ]
    },
    '/api/trade/order': {
      requestParams: [
        { key: '1', name: 'amount', paramType: 'number', sample: '2999.00', dataTag: '交易金额', category: '金融数据', level: 'L3', sensitive: '是' },
        { key: '2', name: 'cardNo', paramType: 'string', sample: '6222****1234', dataTag: '银行卡号', category: '金融数据', level: 'L4', sensitive: '是' },
        { key: '3', name: 'payMethod', paramType: 'string', sample: 'WECHAT', dataTag: '支付方式', category: '交易数据', level: 'L1', sensitive: '否' }
      ],
      responseParams: [
        { key: '1', name: 'orderNo', paramType: 'string', sample: 'T202603230088', dataTag: '订单号', category: '订单数据', level: 'L2', sensitive: '否' },
        { key: '2', name: 'tradeStatus', paramType: 'string', sample: 'SUCCESS', dataTag: '交易状态', category: '交易数据', level: 'L1', sensitive: '否' }
      ]
    },
    '/api/customer/idcard': {
      requestParams: [
        { key: '1', name: 'customerId', paramType: 'string', sample: 'C20260001', dataTag: '客户ID', category: '客户数据', level: 'L2', sensitive: '否' }
      ],
      responseParams: [
        { key: '1', name: 'idCard', paramType: 'string', sample: '110101199001011234', dataTag: '身份证号', category: '身份信息', level: 'L4', sensitive: '是' },
        { key: '2', name: 'realName', paramType: 'string', sample: '李四', dataTag: '姓名', category: '身份信息', level: 'L3', sensitive: '是' }
      ]
    }
  };

  const preset = paramMap[row.path];
  if (preset) return preset;

  const defaultRequest: ApiParameterRow[] = row.requestTags.map((tag, index) => {
    const tagName = getTagName(tag);
    return {
      key: `req-${index}`,
      name: `param_${index + 1}`,
      paramType: 'string',
      sample: tagName === '手机号' ? '13800138000' : tagName === '用户ID' ? 'U10001' : 'sample_value',
      dataTag: tagName,
      category: tagName.includes('金融') || tagName.includes('银行') ? '金融数据' : '业务数据',
      level: tagName.includes('身份证') || tagName.includes('银行卡') ? 'L4' : tagName.includes('手机') ? 'L3' : 'L2',
      sensitive: ['身份证号', '银行卡号', '手机号', '金融数据', '交易金额'].some((k) => tagName.includes(k)) ? '是' : '否'
    };
  });

  const defaultResponse: ApiParameterRow[] = row.responseTags.map((tag, index) => {
    const tagName = getTagName(tag);
    return {
      key: `res-${index}`,
      name: `field_${index + 1}`,
      paramType: 'string',
      sample: tagName === '订单号' ? 'ORD20260323001' : tagName === '身份证号' ? '110101********1234' : 'response_value',
      dataTag: tagName,
      category: tagName.includes('金融') ? '金融数据' : tagName.includes('身份') || tagName.includes('身份证') ? '身份信息' : '业务数据',
      level: tagName.includes('身份证') ? 'L4' : tagName.includes('手机') || tagName.includes('金融') ? 'L3' : 'L2',
      sensitive: ['身份证号', '银行卡号', '手机号', '金融数据', '账户余额'].some((k) => tagName.includes(k)) ? '是' : '否'
    };
  });

  if (!defaultRequest.length && !defaultResponse.length) {
    return {
      requestParams: [{ key: '1', name: '-', paramType: '-', sample: '-', dataTag: '-', category: '-', level: '-', sensitive: '否' }],
      responseParams: [{ key: '1', name: 'status', paramType: 'string', sample: 'ok', dataTag: '状态码', category: '系统数据', level: 'L1', sensitive: '否' }]
    };
  }

  return { requestParams: defaultRequest, responseParams: defaultResponse };
}

const defaultSnapshot = {
  requestRaw: `POST /index.php?a=example&fileid=1&mod=system&op=orgtree&do=orgtree HTTP/1.1
Host: 10.20.141.236:10030
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Content-Length: 68

stype=<img+src=x+onerror=alert(document.domain)>&range=0-10-1111`,
  requestHeader: `POST /index.php?a=example&fileid=1&mod=system&op=orgtree&do=orgtree HTTP/1.1
Host: 10.20.141.236:10030
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: */*
Accept-Language: zh-CN,zh;q=0.9
Content-Length: 68`,
  requestCookie: `PHPSESSID=7f3a9c2e1b8d4f6a; path=/; HttpOnly
token=eyJhbGciOiJIUzI1NiJ9; path=/`,
  requestBody: `stype=<img+src=x+onerror=alert(document.domain)>&range=0-10-1111`,
  responseRaw: `<!DOCTYPE html>
<html>
<head><title>系统组织树</title></head>
<body>
  <div class="org-tree">QQ号: 123456789</div>
  <script>var data = {"qq":"987654321"};</script>
</body>
</html>`,
  responseHeader: `HTTP/1.1 200 OK
Server: nginx/1.18.0
Content-Type: text/html; charset=UTF-8
Set-Cookie: session_id=abc123; Path=/; HttpOnly
Content-Length: 2048`,
  responseSetCookie: `session_id=abc123; Path=/; HttpOnly; Max-Age=3600
track_id=xyz789; Path=/`,
  responseBody: `<!DOCTYPE html>
<html>
<head>
  <style>
    .org-tree { font-size: 14px; color: #333; }
    .node { padding: 4px 8px; }
  </style>
</head>
<body>
  <div class="org-tree">
    <div class="node">QQ号: 123456789</div>
    <div class="node">QQ号: 987654321</div>
  </div>
</body>
</html>`,
  highlightTag: 'QQ号',
  highlightCount: 12
};

const defectSuggestionMap: Record<string, string> = {
  SQL注入: '使用参数化查询，统一收敛动态 SQL 拼接，并增加输入白名单校验。',
  XSS: '对输出内容进行上下文转义，限制富文本输入并开启内容安全策略。',
  CSRF: '关键写操作增加 CSRF Token 校验，并校验 Origin/Referer。',
  敏感泄露: '按最小必要原则收敛返回字段，对敏感字段进行脱敏或加密传输。',
  越权访问: '在接口层增加资源归属校验，按用户、角色、租户维度执行权限判断。',
  弱口令: '启用强密码策略、失败锁定和多因素认证，清理默认账号。',
  未鉴权访问: '为接口补充认证中间件，并将匿名访问范围限制在白名单内。',
  错误配置: '关闭生产环境调试信息，收敛错误回显和敏感响应头。',
  批量导出: '增加导出审批、频率限制和字段级脱敏，记录完整审计日志。',
  响应信息泄露: '过滤响应中的内部地址、版本号、堆栈和调试字段。',
  HTTP明文传输: '强制使用 HTTPS，配置 HSTS，并禁止敏感数据通过明文链路传输。'
};

function resolveDefectSeverity(strategy: string, riskCount: number): ApiDefectItem['severity'] {
  if (['SQL注入', '敏感泄露', '越权访问', '未鉴权访问', 'HTTP明文传输'].includes(strategy)) return '高';
  if (riskCount >= 6) return '高';
  if (riskCount >= 3) return '中';
  return '低';
}

function buildApiDefects(row: ApiManagementRow): ApiDefectItem[] {
  if (!row.riskCount || !row.riskStrategies.length) return [];

  return row.riskStrategies.map((strategy, index) => ({
    key: `${row.id}-defect-${index}`,
    name: strategy,
    severity: resolveDefectSeverity(strategy, row.riskCount),
    strategy,
    evidence: `近 24 小时命中 ${row.riskCount} 次，涉及 ${row.method} ${row.path}`,
    suggestion: defectSuggestionMap[strategy] || '结合命中报文与业务上下文复核风险，确认后补充策略或修复规则。',
    status: index === 0 ? '待处置' : '已确认'
  }));
}

export function buildApiDetail(row: ApiManagementRow): ApiDetail {
  const host = row.appDomain.includes(':') ? row.appDomain : row.appDomain;
  const requestUrl = `http://${host}${row.path}`;
  const isApi = row.isApi ?? resolveIsApi(row);
  const isApiAiBasis = row.isApiAiBasis || buildIsApiAiBasis(row, isApi);
  const params = buildApiParams(row);
  const sensitiveLevel = row.sensitiveLevel || resolveApiSensitivity(params).sensitiveLevel;
  const defects = buildApiDefects(row);

  return {
    ...row,
    discoveredAt: '2026-06-23 19:31:29',
    activeAt: '2026-06-23 19:32:36',
    apiType: row.riskCount > 0 || row.requestTags.some((t) => getTagName(t) !== '全员标签') ? '敏感API' : '普通API',
    responseContentType: 'text/html,application/json',
    isApi,
    isApiAiBasis,
    isSensitive: resolveApiSensitivity(params).isSensitive,
    sensitiveLevel,
    defects,
    ...params,
    snapshot: {
      ...defaultSnapshot,
      requestUrl,
      requestRaw: defaultSnapshot.requestRaw.replace('/index.php', row.path).replace('10.20.141.236:10030', host),
      requestHeader: defaultSnapshot.requestHeader.replace('/index.php', row.path).replace('10.20.141.236:10030', host),
      responseRaw: defaultSnapshot.responseRaw,
      highlightTag:
        row.responseTags.map(getTagName).find((t) => ['身份证号', '手机号', '姓名', '银行卡号'].includes(t)) ||
        getTagName(row.responseTags[0] || '手机号'),
      highlightCount: Math.max(row.riskCount, 1)
    }
  };
}

function resolveApiSensitivity(params: {
  requestParams: ApiParameterRow[];
  responseParams: ApiParameterRow[];
}): { isSensitive: '是' | '否'; sensitiveLevel: string } {
  const allParams = [...params.requestParams, ...params.responseParams];
  const isSensitive = allParams.some((p) => p.sensitive === '是') ? '是' : '否';

  const levelOrder = ['L1', 'L2', 'L3', 'L4'];
  const levels = allParams.map((p) => p.level).filter((level) => levelOrder.includes(level));
  const sensitiveLevel = levels.length
    ? levelOrder.slice().reverse().find((level) => levels.includes(level)) || '-'
    : '-';

  return { isSensitive, sensitiveLevel };
}

function resolveIsApi(row: ApiManagementRow): IsApiVerdict {
  const text = row.aiInterpretation;
  if (text.includes('是否为API: 否')) return '否';
  if (text.includes('是否为API: 是')) return '是';
  if (row.path === '/api/health' || row.path.endsWith('/health')) return '否';
  return '是';
}

function buildIsApiAiBasis(row: ApiManagementRow, isApi: IsApiVerdict): string {
  if (isApi === '是') {
    const uncertain = row.aiInterpretation.includes('待确认') || row.aiInterpretation.includes('--');
    if (uncertain) {
      return `AI 判断依据：路径 ${row.path} 具备 API 接口特征（${row.method} 请求、结构化参数），基于当前流量样本判定为 API。`;
    }
    return `AI 判断依据：请求方法为 ${row.method}，路径 ${row.path} 符合 RESTful API 特征；响应 Content-Type 含 application/json，且存在结构化请求/响应数据标签。`;
  }
  return 'AI 判断依据：访问路径为静态资源或页面跳转特征，响应以 text/html 为主，缺少典型 API 接口的请求参数与 JSON 响应结构。';
}
