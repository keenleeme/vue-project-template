export type AnnouncementLevel = 'critical' | 'high' | 'medium';
export type AnnouncementStatus = 'draft' | 'ongoing' | 'overdue' | 'closed';
export type UnitFinalStatus = 'met' | 'notMet' | 'escalated';
export type ReadStatus = 'unread' | 'read' | 'invalid';
export type ReplyStatus = 'notRequired' | 'pending' | 'replied' | 'invalid';

export interface AnnouncementListItem {
  id: string;
  title: string;
  level: AnnouncementLevel;
  publishTime: string;
  deadline: string;
  readRate: number;
  replyRate: number;
  unmetUnitCount: number;
  escalatedUnitCount: number;
  status: AnnouncementStatus;
  forceRead: boolean;
  forceReply: boolean;
}

export interface UnitTrackingRow {
  id: string;
  unitName: string;
  expectedUserCount: number;
  readUserCount: number;
  readRate: number;
  repliedUserCount: number;
  replyRate: number;
  keyPositionProgress: string;
  lastActionTime: string;
  escalated: boolean;
  status: UnitFinalStatus;
}

export interface UserTrackingRow {
  id: string;
  unitId: string;
  unitName: string;
  name: string;
  account: string;
  readStatus: ReadStatus;
  readTime: string;
  replyStatus: ReplyStatus;
  replyTime: string;
  replySummary: string;
  reminderCount: number;
  lastReminderTime: string;
  isOverdue: boolean;
}

export interface ReplyVersionItem {
  id: string;
  version: string;
  submitTime: string;
  content: string;
  isCurrent: boolean;
}

export interface ReplyDetail {
  userId: string;
  userName: string;
  account: string;
  unitName: string;
  currentStatus: string;
  replyMode: string;
  latestContent: string;
  contentHash: string;
  readAudit: string;
  reminderTrail: string;
  versions: ReplyVersionItem[];
}

export interface AuditLogItem {
  id: string;
  actionTime: string;
  actionType: string;
  actor: string;
  snapshot: string;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  level: AnnouncementLevel;
  content: string;
  publishTime: string;
  deadline: string;
  status: AnnouncementStatus;
  summary: {
    coverageUnitCount: number;
    expectedUserCount: number;
    readRate: number;
    replyRate: number;
    escalatedUnitCount: number;
    pendingReadCount: number;
    pendingReplyCount: number;
    completedCount: number;
  };
  forceRead: boolean;
  forceReply: boolean;
  unitRows: UnitTrackingRow[];
  userRows: UserTrackingRow[];
  auditLogs: AuditLogItem[];
  replyDetails: Record<string, ReplyDetail>;
}

export interface AnnouncementFormData {
  title: string;
  /** 新建未选时为 undefined，避免预填等级 */
  level?: AnnouncementLevel;
  content: string;
  deadline: string;
  forceRead: boolean;
  forceReply: boolean;
  replyMode: 'options' | 'text' | 'mixed';
  scopeUnits: string[];
  scopeDepartments: string[];
  scopeRoles: string[];
  scopeGroups: string[];
}

export interface TodoNoticeItem {
  id: string;
  title: string;
  level: AnnouncementLevel;
  deadline: string;
  unitName: string;
  statusText: string;
  actionText: string;
  forceRead: boolean;
  forceReply: boolean;
  overdue: boolean;
}

export interface NoticeConfirmData {
  id: string;
  title: string;
  level: AnnouncementLevel;
  deadline: string;
  unitName: string;
  currentStatus: string;
  content: string;
  replyTips: string;
  options: string[];
  initialReadConfirmed?: boolean;
  initialReplyRequired?: boolean;
  initialReplyOption?: string;
  initialReplyContent?: string;
  completed?: boolean;
}

const announcements: AnnouncementListItem[] = [
  {
    id: 'notice-001',
    title: '高危漏洞应急排查公告',
    level: 'critical',
    publishTime: '2026-04-24 09:00',
    deadline: '2026-04-25 18:00',
    readRate: 84,
    replyRate: 62,
    unmetUnitCount: 9,
    escalatedUnitCount: 3,
    status: 'ongoing',
    forceRead: true,
    forceReply: true
  },
  {
    id: 'notice-002',
    title: '互联网暴露面临时加固通知',
    level: 'high',
    publishTime: '2026-04-24 12:30',
    deadline: '2026-04-26 12:00',
    readRate: 91,
    replyRate: 0,
    unmetUnitCount: 4,
    escalatedUnitCount: 0,
    status: 'ongoing',
    forceRead: true,
    forceReply: false
  },
  {
    id: 'notice-003',
    title: '证书异常排查与替换要求',
    level: 'high',
    publishTime: '2026-04-23 18:20',
    deadline: '2026-04-24 20:00',
    readRate: 63,
    replyRate: 31,
    unmetUnitCount: 14,
    escalatedUnitCount: 5,
    status: 'overdue',
    forceRead: true,
    forceReply: true
  },
  {
    id: 'notice-004',
    title: '专项攻防演练准备通告',
    level: 'medium',
    publishTime: '2026-04-22 10:15',
    deadline: '2026-04-30 18:00',
    readRate: 55,
    replyRate: 18,
    unmetUnitCount: 22,
    escalatedUnitCount: 0,
    status: 'ongoing',
    forceRead: false,
    forceReply: true
  }
];

const unitRows: UnitTrackingRow[] = [
  {
    id: 'unit-001',
    unitName: '华东运营中心',
    expectedUserCount: 56,
    readUserCount: 40,
    readRate: 71,
    repliedUserCount: 24,
    replyRate: 43,
    keyPositionProgress: '2 / 5',
    lastActionTime: '2026-04-24 10:32',
    escalated: true,
    status: 'escalated'
  },
  {
    id: 'unit-002',
    unitName: '研发共享平台',
    expectedUserCount: 68,
    readUserCount: 60,
    readRate: 88,
    repliedUserCount: 41,
    replyRate: 60,
    keyPositionProgress: '4 / 6',
    lastActionTime: '2026-04-24 11:05',
    escalated: false,
    status: 'notMet'
  },
  {
    id: 'unit-003',
    unitName: '支付业务部',
    expectedUserCount: 51,
    readUserCount: 48,
    readRate: 94,
    repliedUserCount: 40,
    replyRate: 78,
    keyPositionProgress: '6 / 7',
    lastActionTime: '2026-04-24 11:46',
    escalated: false,
    status: 'met'
  }
];

const userRows: UserTrackingRow[] = [
  {
    id: 'user-001',
    unitId: 'unit-001',
    unitName: '华东运营中心',
    name: '张明',
    account: 'zhangming',
    readStatus: 'read',
    readTime: '2026-04-24 08:43',
    replyStatus: 'pending',
    replyTime: '',
    replySummary: '待补充排查结果',
    reminderCount: 2,
    lastReminderTime: '2026-04-24 10:32',
    isOverdue: true
  },
  {
    id: 'user-002',
    unitId: 'unit-002',
    unitName: '研发共享平台',
    name: '李洁',
    account: 'lijie',
    readStatus: 'unread',
    readTime: '',
    replyStatus: 'pending',
    replyTime: '',
    replySummary: '未提交',
    reminderCount: 3,
    lastReminderTime: '2026-04-24 09:10',
    isOverdue: true
  },
  {
    id: 'user-003',
    unitId: 'unit-003',
    unitName: '支付业务部',
    name: '王越',
    account: 'wangyue',
    readStatus: 'read',
    readTime: '2026-04-24 09:26',
    replyStatus: 'replied',
    replyTime: '2026-04-24 11:46',
    replySummary: '已发现测试环境风险，正在处置',
    reminderCount: 1,
    lastReminderTime: '2026-04-24 09:30',
    isOverdue: false
  },
  {
    id: 'user-004',
    unitId: 'unit-001',
    unitName: '华东运营中心',
    name: '陈涛',
    account: 'chentao',
    readStatus: 'read',
    readTime: '2026-04-24 09:14',
    replyStatus: 'replied',
    replyTime: '2026-04-24 10:18',
    replySummary: '已确认无受影响资产',
    reminderCount: 1,
    lastReminderTime: '2026-04-24 09:00',
    isOverdue: false
  },
  {
    id: 'user-005',
    unitId: 'unit-001',
    unitName: '华东运营中心',
    name: '王可',
    account: 'wangke',
    readStatus: 'invalid',
    readTime: '',
    replyStatus: 'invalid',
    replyTime: '',
    replySummary: '离职剔除，保留历史',
    reminderCount: 0,
    lastReminderTime: '',
    isOverdue: false
  }
];

const replyDetails: Record<string, ReplyDetail> = {
  'user-001': {
    userId: 'user-001',
    userName: '张明',
    account: 'zhangming',
    unitName: '华东运营中心',
    currentStatus: '已读 / 未回复（超时）',
    replyMode: '预设选项 + 自由文本',
    latestContent: '已发现一台测试环境资产存在受影响组件，生产环境暂未发现风险，补丁窗口申请中。',
    contentHash: '5f2b-98ac-77de-41fa',
    readAudit: '首次已读：04-24 08:43 / IP 10.2.6.17 / Chrome on Windows',
    reminderTrail: '催办记录：站内信 1 次，短信 1 次，升级通知 1 次',
    versions: [
      {
        id: 'reply-001-v3',
        version: 'V3',
        submitTime: '2026-04-24 11:46',
        content: '已发现一台测试环境资产存在受影响组件，生产环境暂未发现风险，补丁窗口申请中。',
        isCurrent: true
      },
      {
        id: 'reply-001-v2',
        version: 'V2',
        submitTime: '2026-04-24 10:15',
        content: '补充了受影响资产范围，待团队确认修复窗口。',
        isCurrent: false
      },
      {
        id: 'reply-001-v1',
        version: 'V1',
        submitTime: '2026-04-24 09:58',
        content: '首次提交回复。',
        isCurrent: false
      }
    ]
  },
  'user-003': {
    userId: 'user-003',
    userName: '王越',
    account: 'wangyue',
    unitName: '支付业务部',
    currentStatus: '已读 / 已回复',
    replyMode: '预设选项 + 自由文本',
    latestContent: '已完成排查，测试环境发现风险并完成临时缓解，生产环境未受影响。',
    contentHash: '9fd1-22bc-17fe-88aa',
    readAudit: '首次已读：04-24 09:26 / IP 10.8.5.13 / Chrome on Windows',
    reminderTrail: '催办记录：站内信 1 次',
    versions: [
      {
        id: 'reply-003-v2',
        version: 'V2',
        submitTime: '2026-04-24 11:46',
        content: '已完成排查，测试环境发现风险并完成临时缓解，生产环境未受影响。',
        isCurrent: true
      },
      {
        id: 'reply-003-v1',
        version: 'V1',
        submitTime: '2026-04-24 10:34',
        content: '首次反馈排查结果。',
        isCurrent: false
      }
    ]
  }
};

const auditLogs: AuditLogItem[] = [
  {
    id: 'audit-001',
    actionTime: '2026-04-24 11:46',
    actionType: '用户回复',
    actor: '张明 / zhangming',
    snapshot: '更新了 V3 回复内容'
  },
  {
    id: 'audit-002',
    actionTime: '2026-04-24 10:32',
    actionType: '系统催办',
    actor: '自动任务',
    snapshot: '对未回复对象发送站内信 + 短信'
  },
  {
    id: 'audit-003',
    actionTime: '2026-04-24 09:58',
    actionType: '用户已读',
    actor: '张明 / zhangming',
    snapshot: '记录 IP、User-Agent'
  },
  {
    id: 'audit-004',
    actionTime: '2026-04-24 09:00',
    actionType: '公告发布',
    actor: '安全运营-李晨',
    snapshot: '发布高危漏洞应急排查公告'
  }
];

export const getAnnouncementList = () => announcements;

export const getAnnouncementSummary = () => {
  const total = announcements.length;
  const overdueCount = announcements.filter((item) => item.status === 'overdue').length;
  const unmetUnitCount = announcements.reduce((sum, item) => sum + item.unmetUnitCount, 0);
  const criticalTodoCount = announcements.filter((item) => item.level === 'critical').length;

  return {
    total,
    overdueCount,
    unmetUnitCount,
    criticalTodoCount
  };
};

export const getAnnouncementDetail = (id: string): AnnouncementDetail | undefined => {
  const current = announcements.find((item) => item.id === id) ?? announcements[0];
  if (!current) return undefined;

  return {
    id: current.id,
    title: current.title,
    level: current.level,
    content: getAnnouncementFormData(current.id).content,
    publishTime: current.publishTime,
    deadline: current.deadline,
    status: current.status,
    forceRead: current.forceRead,
    forceReply: current.forceReply,
    summary: {
      coverageUnitCount: 68,
      expectedUserCount: 621,
      readRate: current.readRate,
      replyRate: current.replyRate,
      escalatedUnitCount: current.escalatedUnitCount,
      pendingReadCount: 123,
      pendingReplyCount: 86,
      completedCount: 412
    },
    unitRows,
    userRows,
    auditLogs,
    replyDetails
  };
};

/** 新建公告：不预填任何业务字段 */
export const getEmptyAnnouncementFormData = (): AnnouncementFormData => ({
  title: '',
  level: undefined,
  content: '',
  deadline: '',
  forceRead: false,
  forceReply: false,
  replyMode: 'mixed',
  scopeUnits: [],
  scopeDepartments: [],
  scopeRoles: [],
  scopeGroups: []
});

export const getAnnouncementFormData = (id?: string): AnnouncementFormData => {
  const current = id ? announcements.find((item) => item.id === id) : undefined;
  if (!current) {
    return getEmptyAnnouncementFormData();
  }
  return {
    title: current.title,
    level: current.level,
    content:
      '近期监测发现外部高危漏洞已存在利用风险，请各单位在收到公告后立即完成本单位资产排查，并由关键岗位提交排查结果。',
    deadline: current.deadline,
    forceRead: current.forceRead,
    forceReply: current.forceReply,
    replyMode: 'mixed',
    scopeUnits: ['华东运营中心', '研发共享平台', '支付业务部'],
    scopeDepartments: ['安全', '运维', '应用负责人'],
    scopeRoles: ['关键岗位'],
    scopeGroups: ['应急响应群组']
  };
};

export const getTodoNotices = (): TodoNoticeItem[] => [
  {
    id: 'notice-001',
    title: '高危漏洞应急排查公告',
    level: 'critical',
    deadline: '2026-04-25 18:00',
    unitName: '华东运营中心',
    statusText: '待确认回复',
    actionText: '立即处理',
    forceRead: true,
    forceReply: true,
    overdue: false
  },
  {
    id: 'notice-002',
    title: '互联网暴露面临时加固通知',
    level: 'high',
    deadline: '2026-04-26 12:00',
    unitName: '华东运营中心',
    statusText: '待确认',
    actionText: '立即处理',
    forceRead: true,
    forceReply: false,
    overdue: false
  },
  {
    id: 'notice-003',
    title: '证书异常排查与替换要求',
    level: 'high',
    deadline: '2026-04-24 20:00',
    unitName: '华东运营中心',
    statusText: '待回复',
    actionText: '立即处理',
    forceRead: true,
    forceReply: true,
    overdue: true
  }
];

export const getNoticeConfirmData = (id: string): NoticeConfirmData => {
  const current = announcements.find((item) => item.id === id) ?? announcements[0];
  return {
    id: current.id,
    title: current.title,
    level: current.level,
    deadline: current.deadline,
    unitName: '华东运营中心',
    currentStatus: current.forceReply ? '待已读 / 待回复' : '待已读',
    content:
      '近期监测发现外部高危漏洞已存在利用风险，请各单位在收到公告后立即完成本单位资产排查，并由关键岗位提交排查结果。请重点确认互联网暴露资产是否受影响、临时缓解措施是否已执行、正式修复计划是否已制定。',
    replyTips: '先选择最贴近现状的预设项，再补充自由文本说明受影响范围、处置进度和预计完成时间。',
    options: ['已完成排查，未发现受影响资产', '已发现风险，正在处置并补充说明'],
    initialReadConfirmed: false,
    initialReplyRequired: current.forceReply,
    initialReplyOption: '',
    initialReplyContent: '',
    completed: false
  };
};

export const getLevelTagColor = (level: AnnouncementLevel) => {
  const colorMap: Record<AnnouncementLevel, string> = {
    critical: 'red',
    high: 'orange',
    medium: 'blue'
  };
  return colorMap[level];
};

export const getLevelLabel = (level: AnnouncementLevel) => {
  const labelMap: Record<AnnouncementLevel, string> = {
    critical: '高危',
    high: '高',
    medium: '中'
  };
  return labelMap[level];
};

export const getAnnouncementStatusLabel = (status: AnnouncementStatus) => {
  const labelMap: Record<AnnouncementStatus, string> = {
    draft: '草稿',
    ongoing: '进行中',
    overdue: '已超时',
    closed: '已闭环'
  };
  return labelMap[status];
};

export const getAnnouncementStatusTagColor = (status: AnnouncementStatus) => {
  const colorMap: Record<AnnouncementStatus, string> = {
    draft: 'default',
    ongoing: 'processing',
    overdue: 'error',
    closed: 'success'
  };
  return colorMap[status];
};

export const getUnitStatusLabel = (status: UnitFinalStatus) => {
  const labelMap: Record<UnitFinalStatus, string> = {
    met: '已达标',
    notMet: '未达标',
    escalated: '已升级'
  };
  return labelMap[status];
};

export const getUnitStatusTagColor = (status: UnitFinalStatus) => {
  const colorMap: Record<UnitFinalStatus, string> = {
    met: 'success',
    notMet: 'warning',
    escalated: 'error'
  };
  return colorMap[status];
};

export const getReadStatusLabel = (status: ReadStatus) => {
  const labelMap: Record<ReadStatus, string> = {
    unread: '未读',
    read: '已读',
    invalid: '状态失效'
  };
  return labelMap[status];
};

export const getReadStatusTagColor = (status: ReadStatus) => {
  const colorMap: Record<ReadStatus, string> = {
    unread: 'warning',
    read: 'success',
    invalid: 'default'
  };
  return colorMap[status];
};

export const getReplyStatusLabel = (status: ReplyStatus) => {
  const labelMap: Record<ReplyStatus, string> = {
    notRequired: '无需回复',
    pending: '未回复',
    replied: '已回复',
    invalid: '状态失效'
  };
  return labelMap[status];
};

export const getReplyStatusTagColor = (status: ReplyStatus) => {
  const colorMap: Record<ReplyStatus, string> = {
    notRequired: 'default',
    pending: 'warning',
    replied: 'success',
    invalid: 'default'
  };
  return colorMap[status];
};

export const filterUsersByUnit = (detail: AnnouncementDetail, unitId: string) =>
  detail.userRows.filter((item) => item.unitId === unitId);
