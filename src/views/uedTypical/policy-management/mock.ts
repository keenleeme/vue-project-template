import type { PolicyRow } from './types';

const policyRows: PolicyRow[] = [
  {
    id: 'p1',
    name: '数据库配置信息泄露',
    severity: '高',
    enabled: true,
    remediation:
      '关闭数据库详细错误信息回显，统一返回通用错误码与提示，避免在响应中暴露数据库配置、连接串等敏感信息。',
    exploitation: '在系统之间的调用接口中直接返回数据库配置信息，攻击者可据此推断库表结构并构造注入攻击。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API8:2023 安全配置错误',
    designConcept: '通过识别数据库异常响应中的表名、字段名等特征，判断是否存在 SQL 错误回显类安全风险。'
  },
  {
    id: 'p2',
    name: '第三方支付接口调用存在负值金额',
    severity: '高',
    enabled: true,
    remediation: '在支付网关增加金额下限校验与业务侧二次确认。',
    exploitation: '利用负值金额绕过扣款逻辑，造成资金损失或账务异常。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API3:2023 损坏的对象属性级别授权',
    designConcept: '关注支付类接口中金额参数的合法性校验，识别负值、零值等异常金额输入场景。'
  },
  {
    id: 'p3',
    name: '未授权访问敏感接口',
    severity: '高',
    enabled: true,
    remediation: '为敏感接口补充鉴权与细粒度权限控制，并开启访问审计。',
    exploitation: '未登录或低权限用户可直接访问敏感数据接口。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API5:2023 损坏的功能级别授权'
  },
  {
    id: 'p4',
    name: '响应中包含明文身份证号',
    severity: '高',
    enabled: false,
    remediation: '对身份证号字段进行脱敏展示，并限制返回字段范围。',
    exploitation: '通过抓包或日志回放获取用户身份敏感信息。',
    source: '系统内置',
    type: '数据泄露风险',
    owasp: 'API3:2023 损坏的对象属性级别授权',
    designConcept: '结合响应体字段语义与数据标签，识别未脱敏的身份证号等个人敏感信息泄露。'
  },
  {
    id: 'p5',
    name: '弱口令登录尝试',
    severity: '低',
    enabled: true,
    remediation: '启用账号锁定策略、强密码策略与多因素认证。',
    exploitation: '通过暴力破解或字典攻击获取账号访问权限。',
    source: '用户添加',
    type: 'Web安全缺陷',
    owasp: 'API2:2023 损坏的身份验证'
  },
  {
    id: 'p6',
    name: '越权修改他人订单',
    severity: '高',
    enabled: true,
    remediation: '在订单更新接口增加资源归属校验与操作审计。',
    exploitation: '篡改订单 ID 参数即可修改其他用户订单信息。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API5:2023 损坏的功能级别授权'
  },
  {
    id: 'p7',
    name: '接口返回过多调试字段',
    severity: '中',
    enabled: true,
    remediation: '生产环境关闭调试字段输出，仅保留必要业务字段。',
    exploitation: '调试字段可能暴露内部实现与敏感配置信息。',
    source: '用户添加',
    type: 'Web安全缺陷',
    owasp: 'API8:2023 安全配置错误'
  },
  {
    id: 'p8',
    name: '文件上传未校验类型',
    severity: '中',
    enabled: false,
    remediation: '限制上传文件后缀、MIME 类型，并进行病毒扫描。',
    exploitation: '上传恶意脚本文件可能导致远程代码执行。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API8:2023 安全配置错误'
  },
  {
    id: 'p9',
    name: '短信验证码可重放',
    severity: '中',
    enabled: true,
    remediation: '验证码一次性使用并绑定会话，设置短有效期。',
    exploitation: '截获验证码后在有效期内重复使用完成认证绕过。',
    source: '系统内置',
    type: '鉴别认证缺陷',
    owasp: 'API2:2023 损坏的身份验证'
  },
  {
    id: 'p10',
    name: '批量导出未脱敏',
    severity: '高',
    enabled: true,
    remediation: '导出前执行字段级脱敏，并增加导出审批流程。',
    exploitation: '批量导出接口可获取大量未脱敏用户数据。',
    source: '用户添加',
    type: '数据泄露风险',
    owasp: 'API3:2023 损坏的对象属性级别授权'
  },
  {
    id: 'p11',
    name: 'GraphQL 深度查询',
    severity: '低',
    enabled: true,
    remediation: '限制查询深度与字段数量，启用查询复杂度分析。',
    exploitation: '构造深层嵌套查询导致服务端资源耗尽。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API5:2023 损坏的功能级别授权'
  },
  {
    id: 'p12',
    name: 'JWT 未校验签名',
    severity: '高',
    enabled: true,
    remediation: '强制校验 JWT 签名、过期时间与颁发者信息。',
    exploitation: '伪造 Token 获取高权限访问能力。',
    source: '系统内置',
    type: '鉴别认证缺陷',
    owasp: 'API2:2023 损坏的身份验证'
  },
  {
    id: 'p13',
    name: '敏感参数出现在 URL',
    severity: '中',
    enabled: true,
    remediation: '敏感参数改为 POST Body 传输，并清理访问日志中的敏感字段。',
    exploitation: 'URL 参数可能被浏览器历史、代理或 Referer 泄露。',
    source: '用户添加',
    type: '数据泄露风险',
    owasp: 'API3:2023 损坏的对象属性级别授权'
  },
  {
    id: 'p14',
    name: 'CORS 配置过于宽松',
    severity: '低',
    enabled: false,
    remediation: '按域名白名单配置 CORS，禁止通配符与凭证同用。',
    exploitation: '恶意站点可跨域读取受保护接口响应。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API5:2023 损坏的功能级别授权'
  },
  {
    id: 'p15',
    name: '接口缺少限流保护',
    severity: '中',
    enabled: true,
    remediation: '对高频接口配置 IP/账号维度限流与熔断策略。',
    exploitation: '高频调用导致服务不可用或触发数据爬取。',
    source: '用户添加',
    type: 'Web安全缺陷',
    owasp: 'API4:2023 无限制的资源消耗'
  },
  {
    id: 'p16',
    name: '返回包包含内部 IP',
    severity: '低',
    enabled: true,
    remediation: '响应中过滤内网地址与调试链路信息。',
    exploitation: '辅助攻击者绘制内网拓扑并寻找进一步渗透入口。',
    source: '系统内置',
    type: '数据泄露风险',
    owasp: 'API3:2023 损坏的对象属性级别授权'
  },
  {
    id: 'p17',
    name: '支付回调未验签',
    severity: '高',
    enabled: true,
    remediation: '回调接口必须校验签名、金额与订单状态一致性。',
    exploitation: '伪造支付成功回调造成业务侧误判已支付。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API8:2023 安全配置错误'
  },
  {
    id: 'p18',
    name: '密码重置链接长期有效',
    severity: '中',
    enabled: true,
    remediation: '重置链接设置短有效期并单次使用后失效。',
    exploitation: '泄露的重置链接可被他人用于接管账号。',
    source: '用户添加',
    type: '鉴别认证缺陷',
    owasp: 'API2:2023 损坏的身份验证'
  },
  {
    id: 'p19',
    name: 'API 版本信息泄露',
    severity: '低',
    enabled: true,
    remediation: '隐藏框架版本号与服务端软件版本响应头。',
    exploitation: '根据版本信息匹配已知漏洞进行针对性攻击。',
    source: '系统内置',
    type: 'Web安全缺陷',
    owasp: 'API5:2023 损坏的功能级别授权'
  },
  {
    id: 'p20',
    name: '手机号批量枚举',
    severity: '中',
    enabled: false,
    remediation: '注册/找回密码接口增加图形验证码与频率限制。',
    exploitation: '批量探测接口判断手机号是否已注册。',
    source: '用户添加',
    type: 'Web安全缺陷',
    owasp: 'API4:2023 无限制的资源消耗'
  }
];

export const mockPolicyTotal = 85;

export const severityOptions = [
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' }
];

export const enabledOptions = [
  { label: '开', value: 'enabled' },
  { label: '关', value: 'disabled' }
];

export const sourceOptions = [
  { label: '系统内置', value: '系统内置' },
  { label: '用户添加', value: '用户添加' }
];

export const typeOptions = [
  { label: 'Web安全缺陷', value: 'Web安全缺陷' },
  { label: '数据泄露风险', value: '数据泄露风险' },
  { label: '鉴别认证缺陷', value: '鉴别认证缺陷' }
];

export const owaspOptions = [
  { label: 'API2:2023 损坏的身份验证', value: 'API2:2023 损坏的身份验证' },
  { label: 'API3:2023 损坏的对象属性级别授权', value: 'API3:2023 损坏的对象属性级别授权' },
  { label: 'API4:2023 无限制的资源消耗', value: 'API4:2023 无限制的资源消耗' },
  { label: 'API5:2023 损坏的功能级别授权', value: 'API5:2023 损坏的功能级别授权' },
  { label: 'API8:2023 安全配置错误', value: 'API8:2023 安全配置错误' }
];

export function getPolicyRows(): PolicyRow[] {
  return policyRows;
}
