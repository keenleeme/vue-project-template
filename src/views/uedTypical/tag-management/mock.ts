import type { FrameworkRow, FrameworkTagOptions, FrameworkTreeNode, TagRow } from './types';

const commonLevelOptions = [
  { label: '未分级', value: '未分级' },
  { label: '一般-1级', value: '一般-1级' },
  { label: '一般-2级', value: '一般-2级' },
  { label: '敏感-3级', value: '敏感-3级' },
  { label: '敏感-4级', value: '敏感-4级' }
];

const personalInfoCategories = [
  '个人生物识别信息',
  '网络身份标识信息',
  '个人健康生理信息',
  '个人教育工作信息',
  '个人财产信息',
  '个人通信信息',
  '联系人信息',
  '其他信息',
  '个人基本资料',
  '个人身份信息',
  '个人常用设备信息',
  '健康码',
  '特殊敏感信息'
];

const frameworkTagOptionsMap: Record<string, FrameworkTagOptions> = {
  f3: {
    categoryOptions: personalInfoCategories.map((item) => ({ label: item, value: item })),
    levelOptions: commonLevelOptions
  },
  f1: {
    categoryOptions: [
      { label: '未分级', value: '未分级' },
      { label: '默认分类节点', value: '默认分类节点' },
      { label: '示例分级节点', value: '示例分级节点' }
    ],
    levelOptions: commonLevelOptions
  },
  f2: {
    categoryOptions: [
      { label: '未分级', value: '未分级' },
      { label: '业务接口', value: '业务接口' },
      { label: '通用数据', value: '通用数据' }
    ],
    levelOptions: commonLevelOptions
  }
};

const tagRowsByFramework: Record<string, Omit<TagRow, 'sensitive'>[]> = {
  f3: [
    {
      id: 'f3-1',
      name: '手机号',
      enabled: true,
      category: '个人基本资料',
      level: '敏感-3级',
      description: '识别11位中国大陆手机号码',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-2',
      name: '身份证号',
      enabled: true,
      category: '个人身份信息',
      level: '敏感-4级',
      description: '识别18位居民身份证号码',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-3',
      name: '银行卡号',
      enabled: true,
      category: '个人财产信息',
      level: '敏感-4级',
      description: '识别银行卡号及脱敏展示',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-4',
      name: '人脸图像',
      enabled: true,
      category: '个人生物识别信息',
      level: '敏感-4级',
      description: '识别人脸特征图像数据',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-5',
      name: '指纹信息',
      enabled: false,
      category: '个人生物识别信息',
      level: '敏感-4级',
      description: '识别指纹生物特征',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-6',
      name: '电子邮箱',
      enabled: true,
      category: '个人通信信息',
      level: '一般-2级',
      description: '识别电子邮箱地址',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-7',
      name: '通讯录',
      enabled: true,
      category: '联系人信息',
      level: '敏感-3级',
      description: '识别联系人姓名与号码',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-8',
      name: '健康档案',
      enabled: true,
      category: '个人健康生理信息',
      level: '敏感-4级',
      description: '识别个人健康生理相关信息',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-9',
      name: '学历信息',
      enabled: true,
      category: '个人教育工作信息',
      level: '一般-2级',
      description: '识别用户学历信息',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-10',
      name: '设备标识',
      enabled: true,
      category: '个人常用设备信息',
      level: '一般-2级',
      description: '识别终端设备唯一标识',
      source: '用户添加',
      frameworkId: 'f3'
    },
    {
      id: 'f3-11',
      name: '健康码数据',
      enabled: true,
      category: '健康码',
      level: '敏感-3级',
      description: '识别健康码相关字段',
      source: '系统内置',
      frameworkId: 'f3'
    },
    {
      id: 'f3-12',
      name: '基因信息',
      enabled: false,
      category: '特殊敏感信息',
      level: '敏感-4级',
      description: '识别基因等高度敏感信息',
      source: '系统内置',
      frameworkId: 'f3'
    }
  ],
  f1: [
    {
      id: 'f1-1',
      name: 'test',
      enabled: true,
      category: '默认分类节点',
      level: '未分级',
      description: '-',
      source: '用户添加',
      frameworkId: 'f1'
    },
    {
      id: 'f1-2',
      name: '示例标签A',
      enabled: true,
      category: '默认分类节点',
      level: '一般-1级',
      description: '自定义框架示例标签',
      source: '用户添加',
      frameworkId: 'f1'
    },
    {
      id: 'f1-3',
      name: '示例标签B',
      enabled: false,
      category: '示例分级节点',
      level: '敏感-3级',
      description: '自定义框架分级示例',
      source: '用户添加',
      frameworkId: 'f1'
    }
  ],
  f2: [
    {
      id: 'f2-1',
      name: '接口路径',
      enabled: true,
      category: '业务接口',
      level: '一般-2级',
      description: '识别 API 接口路径字段',
      source: '用户添加',
      frameworkId: 'f2'
    },
    {
      id: 'f2-2',
      name: '请求参数',
      enabled: true,
      category: '业务接口',
      level: '敏感-3级',
      description: '识别接口请求参数',
      source: '系统内置',
      frameworkId: 'f2'
    },
    {
      id: 'f2-3',
      name: '通用编码',
      enabled: true,
      category: '通用数据',
      level: '一般-1级',
      description: '识别通用业务编码',
      source: '用户添加',
      frameworkId: 'f2'
    }
  ]
};

const frameworkRows: FrameworkRow[] = [
  {
    id: 'f1',
    name: '111111',
    source: '自定义',
    description: '1111',
    createdAt: '2026-06-29 15:19:25',
    updatedAt: '2026-06-29 15:19:25'
  },
  {
    id: 'f2',
    name: '11111',
    source: '自定义',
    description: '1111',
    createdAt: '2026-06-29 15:10:58',
    updatedAt: '2026-06-29 15:10:58'
  },
  {
    id: 'f3',
    name: '个人信息安全规范',
    source: '系统内置',
    description: 'GB/T 35273—2020 信息安全技术 个人信息安全规范',
    createdAt: '2025-12-02 17:04:57',
    updatedAt: '2025-12-02 17:04:57'
  }
];

export const mockDataTagTotal = 113;

export const frameworkSourceOptions = [
  { label: '自定义', value: '自定义' },
  { label: '系统内置', value: '系统内置' }
];

/** @deprecated 使用 getFrameworkTagOptions */
export const categoryOptions = frameworkTagOptionsMap.f3.categoryOptions;

/** @deprecated 使用 getFrameworkTagOptions */
export const levelOptions = commonLevelOptions;

export function getFrameworkOptions() {
  return frameworkRows.map((item) => ({ label: item.name, value: item.id }));
}

export function getFrameworkTagOptions(frameworkId: string): FrameworkTagOptions {
  return frameworkTagOptionsMap[frameworkId] || frameworkTagOptionsMap.f3;
}

export function deriveTagSensitive(level: string): TagRow['sensitive'] {
  if (!level || level === '未分级') return '未知';
  return level.includes('敏感') ? '是' : '否';
}

export function getTagRows(frameworkId = 'f3'): TagRow[] {
  return (tagRowsByFramework[frameworkId] || tagRowsByFramework.f3).map((row) => ({
    ...row,
    sensitive: deriveTagSensitive(row.level)
  }));
}

export function getFrameworkRows(): FrameworkRow[] {
  return frameworkRows;
}

const bankingFrameworkTree: FrameworkTreeNode[] = [
  {
    key: 'bank-root',
    title: '0604',
    children: [
      {
        key: 'bank-cust',
        title: '客户数据',
        children: [
          {
            key: 'bank-cust-1',
            title: '客户基本信息',
            level: '一般-1级',
            description: '客户号、客户名称、证件类型、证件号码、联系方式、联系地址'
          },
          {
            key: 'bank-cust-2',
            title: '客户交易信息',
            level: '敏感-3级',
            description: '交易账号、交易时间、交易金额、交易渠道、交易对手'
          },
          {
            key: 'bank-cust-3',
            title: '客户信用数据',
            level: '敏感-4级',
            description:
              '征信报告编号、信用评分、逾期次数、逾期金额、授信额度、已用额度、贷款余额、信用卡账单日、还款记录、担保信息'
          }
        ]
      },
      {
        key: 'bank-biz',
        title: '业务数据',
        children: [
          {
            key: 'bank-biz-1',
            title: '账户数据',
            level: '敏感-3级',
            description: '账号、账户余额、开户日期、账户状态、账户类型'
          },
          {
            key: 'bank-biz-2',
            title: '产品数据',
            level: '一般-2级',
            description: '产品名称、产品代码、产品利率、产品期限、起息日'
          },
          {
            key: 'bank-biz-3',
            title: '交易流水数据',
            level: '敏感-3级',
            description: '流水号、交易类型、交易金额、交易状态、交易时间'
          }
        ]
      },
      {
        key: 'bank-risk',
        title: '风控数据',
        children: [
          {
            key: 'bank-risk-1',
            title: '风险监测数据',
            level: '敏感-3级',
            description: '风险事件编号、风险等级、触发规则、处置状态'
          },
          {
            key: 'bank-risk-2',
            title: '合规审计数据',
            level: '一般-2级',
            description: '审计批次号、审计对象、审计结论、整改状态'
          },
          {
            key: 'bank-risk-3',
            title: '反洗钱数据',
            level: '敏感-4级',
            description: '可疑交易编号、可疑类型、报送状态、客户风险等级'
          }
        ]
      },
      {
        key: 'bank-ops',
        title: '运营数据',
        children: [
          {
            key: 'bank-ops-1',
            title: '财务会计数据',
            level: '敏感-3级',
            description: '科目代码、凭证号、借贷金额、会计期间'
          },
          {
            key: 'bank-ops-2',
            title: '人力资源数据',
            level: '一般-2级',
            description: '员工编号、岗位名称、所属部门、入职日期'
          },
          {
            key: 'bank-ops-3',
            title: '系统日志数据',
            level: '一般-1级',
            description: '日志编号、操作人、操作时间、操作类型、操作结果'
          }
        ]
      }
    ]
  }
];

const personalInfoFrameworkTree: FrameworkTreeNode[] = [
  {
    key: 'pi-root',
    title: '个人信息安全规范',
    children: [
      {
        key: 'pi-1',
        title: '个人生物识别信息',
        level: '敏感-4级',
        description: '指纹、人脸、虹膜、声纹、掌纹、耳廓、步态'
      },
      {
        key: 'pi-2',
        title: '网络身份标识信息',
        level: '一般-2级',
        description: '账号、昵称、用户ID、登录凭证、数字证书'
      },
      {
        key: 'pi-3',
        title: '个人健康生理信息',
        level: '敏感-3级',
        description: '病历号、体检报告、血型、过敏史、生育信息'
      },
      {
        key: 'pi-4',
        title: '个人教育工作信息',
        level: '一般-2级',
        description: '学历、学位、学校、专业、工作单位、职位'
      },
      {
        key: 'pi-5',
        title: '个人财产信息',
        level: '敏感-4级',
        description:
          '征信报告编号、信用评分、逾期次数、逾期金额、授信额度、已用额度、贷款余额、信用卡账单日、还款记录、担保信息'
      },
      {
        key: 'pi-6',
        title: '个人通信信息',
        level: '敏感-3级',
        description: '通话记录、短信内容、即时通信记录、邮箱地址'
      },
      {
        key: 'pi-7',
        title: '联系人信息',
        level: '敏感-3级',
        description: '联系人姓名、联系人电话、通讯录、社交关系'
      },
      {
        key: 'pi-8',
        title: '其他信息',
        level: '一般-1级',
        description: '婚史、宗教信仰、性取向、未归类个人信息'
      },
      {
        key: 'pi-9',
        title: '个人基本资料',
        level: '敏感-3级',
        description: '姓名、生日、性别、民族、国籍、家庭关系'
      },
      {
        key: 'pi-10',
        title: '个人身份信息',
        level: '敏感-4级',
        description: '身份证号、护照号、军官证号、社保卡号'
      },
      {
        key: 'pi-11',
        title: '个人常用设备信息',
        level: '一般-2级',
        description: '设备型号、设备标识、操作系统、应用列表'
      },
      {
        key: 'pi-12',
        title: '健康码',
        level: '敏感-3级',
        description: '健康码状态、核酸检测结果、行程轨迹'
      },
      {
        key: 'pi-13',
        title: '特殊敏感信息',
        level: '敏感-4级',
        description: '基因、宗教信仰、性取向、犯罪记录'
      }
    ]
  }
];

export function getFrameworkTree(frameworkId: string, frameworkName: string): FrameworkTreeNode[] {
  if (frameworkId === 'f3') {
    return JSON.parse(JSON.stringify(personalInfoFrameworkTree)) as FrameworkTreeNode[];
  }
  if (frameworkId === 'f1') {
    return JSON.parse(JSON.stringify(bankingFrameworkTree)) as FrameworkTreeNode[];
  }
  return [
    {
      key: `root-${frameworkId}`,
      title: frameworkName,
      children: [
        {
          key: `child-${frameworkId}-1`,
          title: '默认分类节点',
          level: '一般-1级',
          description: '示例字段A、示例字段B、示例字段C'
        },
        {
          key: `child-${frameworkId}-2`,
          title: '示例分级节点',
          level: '敏感-3级',
          description: '示例敏感字段1、示例敏感字段2'
        }
      ]
    }
  ];
}
