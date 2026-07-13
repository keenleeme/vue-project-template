import dayjs from 'dayjs';

export type TraceType = 'sensitive' | 'sourceIp' | 'account';
export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';
export type LogicType = 'AND' | 'OR';
export type SensitiveClueDimension =
  | 'timeRange'
  | 'urlPath'
  | 'apiSensitiveLevel'
  | 'appDomain'
  | 'accountName'
  | 'sourceIp'
  | 'destIp'
  | 'destPort'
  | 'requestDataTag'
  | 'responseDataTag'
  | 'fileName'
  | 'fileFormat'
  | 'fileAction';

export interface SensitiveTraceClue {
  id: string;
  dimension: SensitiveClueDimension | undefined;
  value?: string;
  values?: string[];
  timeRange?: [string, string];
}

export interface AppOption {
  id: string;
  name: string;
  accounts: string[];
}

export interface SensitiveTraceConditions {
  clues?: SensitiveTraceClue[];
  loginAccount: string;
  clientIp: string;
  serverIp: string;
  appIds: string[];
  apiPath: string;
  fileName: string;
  requestDataTags: string[];
  requestTagLogic: LogicType;
  responseDataTags: string[];
  responseTagLogic: LogicType;
  dataClue: string;
  timeRange?: [string, string];
}

export interface SourceIpTraceConditions {
  clientIp: string;
  appIds: string[];
  timeRange: [string, string];
}

export interface AccountTraceConditions {
  appId: string;
  account: string;
  timeRange: [string, string];
}

export type TraceConditions = SensitiveTraceConditions | SourceIpTraceConditions | AccountTraceConditions;

export interface TraceTask {
  id: string;
  name: string;
  description: string;
  traceType: TraceType;
  status: TaskStatus;
  conditions: TraceConditions;
  conditionTags: string[];
  createTime: string;
  endTime: string;
  updateTime: string;
}

const STORAGE_KEY = 'ued-typical-trace-task-list';
export const MAX_RUNNING_TASKS = 5;

export const TRACE_TYPE_OPTIONS = [
  { label: '敏感数据溯源', value: 'sensitive' as const },
  { label: '源IP溯源', value: 'sourceIp' as const },
  { label: '账号溯源', value: 'account' as const }
];

export const STATUS_OPTIONS = [
  { label: '待开始', value: 'pending' as const },
  { label: '进行中', value: 'running' as const },
  { label: '完成', value: 'success' as const },
  { label: '失败', value: 'failed' as const }
];

export const DATA_TAG_OPTIONS = ['身份证号', '手机号', '银行卡号', '邮箱地址', '设备标识', '地理位置', '联系人信息'];

export const API_SENSITIVE_LEVEL_OPTIONS = ['低敏', '中敏', '高敏', '核心敏感'];
export const FILE_FORMAT_OPTIONS = ['xlsx', 'csv', 'pdf', 'docx', 'txt', 'zip'];
export const FILE_ACTION_OPTIONS = ['上传', '下载', '预览', '分享', '删除', '外发'];

export const SENSITIVE_CLUE_DIMENSION_OPTIONS: { label: string; value: SensitiveClueDimension }[] = [
  { label: '时间范围', value: 'timeRange' },
  { label: 'URL路径字符串', value: 'urlPath' },
  { label: 'API敏感等级', value: 'apiSensitiveLevel' },
  { label: '应用域名', value: 'appDomain' },
  { label: '账号名称', value: 'accountName' },
  { label: '请求源IP', value: 'sourceIp' },
  { label: '目的IP', value: 'destIp' },
  { label: '目的端口', value: 'destPort' },
  { label: '请求数据标签', value: 'requestDataTag' },
  { label: '响应数据标签', value: 'responseDataTag' },
  { label: '文件名称', value: 'fileName' },
  { label: '文件格式', value: 'fileFormat' },
  { label: '文件操作行为条件', value: 'fileAction' }
];

export const APP_OPTIONS: AppOption[] = [
  {
    id: 'app-oa',
    name: '统一办公平台',
    accounts: ['zhangsan', 'lisi', 'wangwu', 'zhaoliu']
  },
  {
    id: 'app-erp',
    name: '供应链ERP',
    accounts: ['erp_admin', 'erp_audit', 'erp_ops']
  },
  {
    id: 'app-api',
    name: '开放API网关',
    accounts: ['api_reader', 'api_auditor', 'api_operator']
  },
  {
    id: 'app-finance',
    name: '财务结算中心',
    accounts: ['finance01', 'finance02', 'finance-audit']
  },
  {
    id: 'app-hr',
    name: '人事档案系统',
    accounts: ['hr_admin', 'hr_reviewer', 'hr_sync']
  }
];

const buildDefaultTasks = (): TraceTask[] => [
  {
    id: 'trace-001',
    name: '高敏文件外发溯源',
    description: '排查近24小时敏感文件下载与外发链路',
    traceType: 'sensitive',
    status: 'running',
    conditions: {
      clues: [
        {
          id: 'clue-default-001',
          dimension: 'timeRange',
          timeRange: ['2026-04-21 09:00:00', '2026-04-22 09:00:00']
        },
        {
          id: 'clue-default-002',
          dimension: 'fileName',
          value: '客户名单.xlsx'
        },
        {
          id: 'clue-default-003',
          dimension: 'requestDataTag',
          values: ['身份证号', '手机号']
        }
      ],
      loginAccount: 'zhangsan',
      clientIp: '10.10.10.8',
      serverIp: '172.16.8.18',
      appIds: ['app-oa', 'app-api'],
      apiPath: '/file/export',
      fileName: '客户名单.xlsx',
      requestDataTags: ['身份证号', '手机号'],
      requestTagLogic: 'AND',
      responseDataTags: ['邮箱地址'],
      responseTagLogic: 'OR',
      dataClue: '华东区域客户',
      timeRange: ['2026-04-21 09:00:00', '2026-04-22 09:00:00']
    },
    conditionTags: [],
    createTime: '2026-04-22 09:10:12',
    endTime: '',
    updateTime: '2026-04-22 09:10:12'
  },
  {
    id: 'trace-002',
    name: '异常客户端IP检索',
    description: '追踪可疑客户端IP访问路径及影响应用',
    traceType: 'sourceIp',
    status: 'pending',
    conditions: {
      clientIp: '192.168.10.34',
      appIds: ['app-api'],
      timeRange: ['2026-04-22 00:00:00', '2026-04-22 10:00:00']
    },
    conditionTags: [],
    createTime: '2026-04-22 10:16:03',
    endTime: '',
    updateTime: '2026-04-22 10:16:03'
  },
  {
    id: 'trace-003',
    name: '财务账号操作回溯',
    description: '复核财务账号在关键应用中的敏感操作记录',
    traceType: 'account',
    status: 'success',
    conditions: {
      appId: 'app-finance',
      account: 'finance-audit',
      timeRange: ['2026-04-20 08:00:00', '2026-04-21 20:00:00']
    },
    conditionTags: [],
    createTime: '2026-04-21 08:00:00',
    endTime: '2026-04-21 08:23:41',
    updateTime: '2026-04-21 08:23:41'
  },
  {
    id: 'trace-004',
    name: '敏感接口响应核查',
    description: '校验接口返回敏感标签命中情况',
    traceType: 'sensitive',
    status: 'failed',
    conditions: {
      clues: [
        {
          id: 'clue-default-004',
          dimension: 'timeRange',
          timeRange: ['2026-04-19 08:00:00', '2026-04-19 18:00:00']
        },
        {
          id: 'clue-default-005',
          dimension: 'urlPath',
          value: '/customer/profile'
        },
        {
          id: 'clue-default-006',
          dimension: 'responseDataTag',
          values: ['手机号', '身份证号']
        }
      ],
      loginAccount: '',
      clientIp: '10.10.9.7',
      serverIp: '',
      appIds: ['app-api', 'app-erp'],
      apiPath: '/customer/profile',
      fileName: '',
      requestDataTags: [],
      requestTagLogic: 'OR',
      responseDataTags: ['手机号', '身份证号'],
      responseTagLogic: 'AND',
      dataClue: '',
      timeRange: ['2026-04-19 08:00:00', '2026-04-19 18:00:00']
    },
    conditionTags: [],
    createTime: '2026-04-19 08:12:27',
    endTime: '2026-04-19 08:15:55',
    updateTime: '2026-04-19 08:15:55'
  },
  {
    id: 'trace-005',
    name: '登录IP横向扩散分析',
    description: '分析异常IP在多应用中的访问扩散范围',
    traceType: 'sourceIp',
    status: 'running',
    conditions: {
      clientIp: '172.20.6.66',
      appIds: ['app-oa', 'app-hr', 'app-finance'],
      timeRange: ['2026-04-22 06:00:00', '2026-04-22 10:00:00']
    },
    conditionTags: [],
    createTime: '2026-04-22 10:22:08',
    endTime: '',
    updateTime: '2026-04-22 10:22:08'
  }
];

export const formatDateTime = (value?: string) => {
  if (!value) return '';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};

export const getTraceTypeLabel = (type: TraceType) =>
  TRACE_TYPE_OPTIONS.find((item) => item.value === type)?.label || type;

export const getStatusLabel = (status: TaskStatus) =>
  STATUS_OPTIONS.find((item) => item.value === status)?.label || status;

export const getStatusTagColor = (status: TaskStatus) => {
  const colorMap: Record<TaskStatus, string> = {
    pending: 'warning',
    running: 'processing',
    success: 'success',
    failed: 'error'
  };
  return colorMap[status];
};

export const getAppName = (id: string) => APP_OPTIONS.find((item) => item.id === id)?.name || id;

export const getAccountsByAppId = (appId?: string) => {
  if (!appId) return [];
  return APP_OPTIONS.find((item) => item.id === appId)?.accounts || [];
};

export const getSensitiveClueDimensionLabel = (dimension?: SensitiveClueDimension) =>
  SENSITIVE_CLUE_DIMENSION_OPTIONS.find((item) => item.value === dimension)?.label || dimension || '';

export const formatSensitiveClueValue = (clue: SensitiveTraceClue) => {
  if (clue.dimension === 'timeRange') {
    return clue.timeRange?.length === 2 ? `${clue.timeRange[0]} ~ ${clue.timeRange[1]}` : '';
  }
  if (Array.isArray(clue.values)) return clue.values.join('、');
  return clue.value || '';
};

export const buildConditionTags = (task: Pick<TraceTask, 'traceType' | 'conditions'>) => {
  const tags: string[] = [];

  if (task.traceType === 'sensitive') {
    const conditions = task.conditions as SensitiveTraceConditions;
    const hasClues = !!conditions.clues?.length;
    if (hasClues) {
      conditions.clues.forEach((clue, index) => {
        const label = getSensitiveClueDimensionLabel(clue.dimension);
        const value = formatSensitiveClueValue(clue);
        if (label && value) tags.push(`线索${index + 1}:${label}=${value}`);
      });
    } else {
      if (conditions.loginAccount) tags.push(`登录账号:${conditions.loginAccount}`);
      if (conditions.clientIp) tags.push(`客户端IP:${conditions.clientIp}`);
      if (conditions.serverIp) tags.push(`服务端IP:${conditions.serverIp}`);
      if (conditions.appIds.length) {
        tags.push(`应用:${conditions.appIds.map(getAppName).join('、')}`);
      }
      if (conditions.apiPath) tags.push(`API路径:${conditions.apiPath}`);
      if (conditions.fileName) tags.push(`文件:${conditions.fileName}`);
      if (conditions.requestDataTags.length) {
        tags.push(`请求标签(${conditions.requestTagLogic}):${conditions.requestDataTags.join('、')}`);
      }
      if (conditions.responseDataTags.length) {
        tags.push(`返回标签(${conditions.responseTagLogic}):${conditions.responseDataTags.join('、')}`);
      }
      if (conditions.dataClue) tags.push(`数据线索:${conditions.dataClue}`);
      if (conditions.timeRange) tags.push(`发生时间:${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`);
    }
  }

  if (task.traceType === 'sourceIp') {
    const conditions = task.conditions as SourceIpTraceConditions;
    tags.push(`客户端IP:${conditions.clientIp}`);
    if (conditions.appIds.length) {
      tags.push(`应用:${conditions.appIds.map(getAppName).join('、')}`);
    }
    tags.push(`发生时间:${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`);
  }

  if (task.traceType === 'account') {
    const conditions = task.conditions as AccountTraceConditions;
    tags.push(`应用:${getAppName(conditions.appId)}`);
    tags.push(`账号:${conditions.account}`);
    tags.push(`发生时间:${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`);
  }

  return tags;
};

const normalizeTasks = (tasks: unknown): TraceTask[] => {
  const list = Array.isArray(tasks) ? tasks : [];
  return list
    .filter((item): item is TraceTask => {
      return item != null && typeof item === 'object' && 'id' in item && 'traceType' in item;
    })
    .map((item) => ({
      ...item,
      name: item.name ?? '',
      description: item.description ?? '',
      conditionTags: buildConditionTags(item)
    }));
};

export const getRunningTaskCount = (tasks: TraceTask[], excludeId?: string) =>
  tasks.filter((item) => item.status === 'running' && item.id !== excludeId).length;

export const getNextStatusAfterSubmit = (tasks: TraceTask[], excludeId?: string): TaskStatus =>
  getRunningTaskCount(tasks, excludeId) >= MAX_RUNNING_TASKS ? 'pending' : 'running';

export const readTraceTasks = () => {
  if (typeof window === 'undefined') {
    return normalizeTasks(buildDefaultTasks());
  }

  const cache = window.localStorage.getItem(STORAGE_KEY);
  if (!cache) {
    const defaults = normalizeTasks(buildDefaultTasks());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const data = JSON.parse(cache) as unknown;
    return normalizeTasks(data);
  } catch (error) {
    const defaults = normalizeTasks(buildDefaultTasks());
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
};

export const writeTraceTasks = (tasks: TraceTask[]) => {
  const nextTasks = normalizeTasks(tasks);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
  }
  return nextTasks;
};

export const getTraceTaskById = (id: string) => readTraceTasks().find((item) => item.id === id);
