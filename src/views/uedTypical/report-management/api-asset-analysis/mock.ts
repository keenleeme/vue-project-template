import type { ApiAssetReportData } from './types';

export const mockApiAssetReport: ApiAssetReportData = {
  overview: {
    apiTotal: 15842,
    deployDist: [
      { name: '公网', value: 4826 },
      { name: '内网', value: 6214 },
      { name: 'DMZ', value: 2848 },
      { name: '云环境', value: 1954 }
    ],
    typeDist: [
      { name: '登录 API', value: 2186 },
      { name: '文件上传 API', value: 1542 },
      { name: '注册接口', value: 986 },
      { name: '交易接口', value: 3248 },
      { name: '微信接口', value: 782 }
    ],
    accessTrend: {
      dates: ['06-17', '06-18', '06-19', '06-20', '06-21', '06-22', '06-23'],
      values: [2860000, 2948000, 3012000, 3124000, 3186000, 3268000, 3356000]
    },
    accessDataAll: [
      { name: '订单信息', value: 842000 },
      { name: '账户信息', value: 726000 },
      { name: '交易流水', value: 618000 },
      { name: '日志查询', value: 412000 },
      { name: '认证令牌', value: 386000 },
      { name: '其他', value: 272000 }
    ],
    accessDataSensitive: [
      { name: '手机号码', value: 486000 },
      { name: '身份证号', value: 328000 },
      { name: '银行卡号', value: 256000 },
      { name: '邮箱地址', value: 198000 },
      { name: '姓名', value: 142000 }
    ]
  },
  defectLevelDist: [
    { name: '高危', value: 428 },
    { name: '中危', value: 986 },
    { name: '低危', value: 1246 }
  ],
  defectDist: [
    { key: '1', defectName: 'SQL 注入', level: '高危', affectedApiCount: 186 },
    { key: '2', defectName: '越权访问', level: '高危', affectedApiCount: 142 },
    { key: '3', defectName: '敏感数据泄露', level: '高危', affectedApiCount: 98 },
    { key: '4', defectName: 'XSS 跨站脚本', level: '中危', affectedApiCount: 124 },
    { key: '5', defectName: 'CSRF', level: '中危', affectedApiCount: 86 },
    { key: '6', defectName: '弱口令认证', level: '中危', affectedApiCount: 72 },
    { key: '7', defectName: '未鉴权访问', level: '中危', affectedApiCount: 68 },
    { key: '8', defectName: '响应信息泄露', level: '低危', affectedApiCount: 156 },
    { key: '9', defectName: 'HTTP 明文传输', level: '低危', affectedApiCount: 98 },
    { key: '10', defectName: '错误配置', level: '低危', affectedApiCount: 84 }
  ],
  attackDist: [
    { key: '1', attackName: 'SQL 注入', level: '严重', attackCount: 1286 },
    { key: '2', attackName: '越权访问', level: '严重', attackCount: 942 },
    { key: '3', attackName: '爬虫', level: '高危', attackCount: 756 },
    { key: '4', attackName: '暴力破解', level: '高危', attackCount: 618 },
    { key: '5', attackName: '扫描探测', level: '高危', attackCount: 524 },
    { key: '6', attackName: 'XSS 攻击', level: '中危', attackCount: 386 },
    { key: '7', attackName: 'CC 攻击', level: '中危', attackCount: 298 },
    { key: '8', attackName: '异常高频调用', level: '中危', attackCount: 242 }
  ],
  defectApiTop: [
    {
      rank: 1,
      apiPath: '/api/order/export',
      defectTotal: 28,
      defectDist: { high: 18, medium: 6, low: 4 }
    },
    {
      rank: 2,
      apiPath: '/api/user/profile',
      defectTotal: 24,
      defectDist: { high: 12, medium: 8, low: 4 }
    },
    {
      rank: 3,
      apiPath: '/api/payment/refund',
      defectTotal: 22,
      defectDist: { high: 14, medium: 5, low: 3 }
    },
    {
      rank: 4,
      apiPath: '/api/customer/idcard',
      defectTotal: 19,
      defectDist: { high: 11, medium: 5, low: 3 }
    },
    {
      rank: 5,
      apiPath: '/api/account/balance',
      defectTotal: 17,
      defectDist: { high: 9, medium: 5, low: 3 }
    },
    {
      rank: 6,
      apiPath: '/api/auth/token',
      defectTotal: 15,
      defectDist: { high: 8, medium: 4, low: 3 }
    },
    {
      rank: 7,
      apiPath: '/api/report/download',
      defectTotal: 14,
      defectDist: { high: 6, medium: 5, low: 3 }
    },
    {
      rank: 8,
      apiPath: '/api/file/upload',
      defectTotal: 12,
      defectDist: { high: 5, medium: 4, low: 3 }
    },
    {
      rank: 9,
      apiPath: '/api/wechat/callback',
      defectTotal: 11,
      defectDist: { high: 4, medium: 4, low: 3 }
    },
    {
      rank: 10,
      apiPath: '/api/register/submit',
      defectTotal: 10,
      defectDist: { high: 3, medium: 4, low: 3 }
    }
  ]
};

export function getMockApiAssetReport(): ApiAssetReportData {
  return mockApiAssetReport;
}
