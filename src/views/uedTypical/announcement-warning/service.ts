import {
  getAnnouncementDetail,
  getAnnouncementFormData,
  getAnnouncementList,
  getNoticeConfirmData,
  getTodoNotices,
  type AnnouncementDetail,
  type AnnouncementFormData,
  type AnnouncementListItem,
  type AnnouncementStatus,
  type NoticeConfirmData,
  type TodoNoticeItem
} from './mock';

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;
const wait = (ms = 400) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
const STORAGE_KEY = 'announcement-warning-demo-state';

export interface SaveAnnouncementDraftPayload extends AnnouncementFormData {
  id?: string;
}

export interface PublishAnnouncementPayload extends AnnouncementFormData {
  id?: string;
}

export interface SubmitNoticeConfirmPayload {
  id: string;
  readConfirmed: boolean;
  replyRequired: boolean;
  replyOption: string;
  replyContent: string;
}

export interface SaveNoticeConfirmDraftPayload extends SubmitNoticeConfirmPayload {}

export interface SendReminderPayload {
  targets: string[];
  channels: string[];
  message: string;
}

export interface CreateExportTaskPayload {
  announcementTitle: string;
  scope: string;
  formats: string[];
  desensitize: boolean;
}

const getMergedAnnouncementById = (id: string) => mergeAnnouncementList().find((item) => item.id === id);

const getPersistedDraftById = (id: string) => readState().drafts.find((item) => item.id === id);

const resolveAnnouncementContent = (id: string) =>
  getPersistedDraftById(id)?.content || getAnnouncementFormData(id).content || '暂无公告内容';

const buildPersistedAnnouncementFromExisting = (
  id: string,
  status: AnnouncementStatus
): PersistedAnnouncementDraft | undefined => {
  const existingDraft = readState().drafts.find((item) => item.id === id);
  if (existingDraft) {
    return {
      ...existingDraft,
      status
    };
  }

  const listItem = getMergedAnnouncementById(id);
  if (!listItem) return undefined;
  const formData = getAnnouncementFormData(id);
  return {
    id,
    ...formData,
    title: listItem.title,
    level: listItem.level,
    deadline: listItem.deadline,
    forceRead: listItem.forceRead,
    forceReply: listItem.forceReply,
    status,
    publishTime: listItem.publishTime
  };
};

interface PersistedAnnouncementDraft extends AnnouncementFormData {
  id: string;
  status: AnnouncementStatus;
  publishTime: string;
}

interface PersistedConfirmState {
  id: string;
  readConfirmed: boolean;
  replyRequired: boolean;
  replyOption: string;
  replyContent: string;
  completed: boolean;
  updatedAt: string;
}

interface PersistedAnnouncementState {
  drafts: PersistedAnnouncementDraft[];
  confirmStates: PersistedConfirmState[];
  deletedIds: string[];
}

const buildDefaultState = (): PersistedAnnouncementState => ({
  drafts: [],
  confirmStates: [],
  deletedIds: []
});

const readState = (): PersistedAnnouncementState => {
  if (typeof window === 'undefined') return buildDefaultState();
  const cache = window.localStorage.getItem(STORAGE_KEY);
  if (!cache) {
    const defaults = buildDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return {
      ...buildDefaultState(),
      ...(JSON.parse(cache) as PersistedAnnouncementState)
    };
  } catch (error) {
    const defaults = buildDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
};

const writeState = (state: PersistedAnnouncementState) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  return state;
};

const nowString = () => new Date().toLocaleString('sv-SE').replace('T', ' ');

const mergeAnnouncementList = (): AnnouncementListItem[] => {
  const state = readState();
  const baseList = clone(getAnnouncementList()).filter((item) => !state.deletedIds.includes(item.id));
  const draftItems: AnnouncementListItem[] = state.drafts.map((item) => ({
    id: item.id,
    title: item.title,
    level: item.level || 'high',
    publishTime: item.publishTime,
    deadline: item.deadline,
    readRate: item.status === 'closed' ? 100 : 0,
    replyRate: item.forceReply ? (item.status === 'closed' ? 100 : 0) : 0,
    unmetUnitCount: item.status === 'closed' ? 0 : Math.max(item.scopeUnits.length || 1, 1),
    escalatedUnitCount: 0,
    status: item.status,
    forceRead: item.forceRead,
    forceReply: item.forceReply
  }));

  const mergedMap = new Map<string, AnnouncementListItem>();
  [...baseList, ...draftItems].forEach((item) => {
    mergedMap.set(item.id, item);
  });

  state.drafts.forEach((draft) => {
    const current = mergedMap.get(draft.id);
    if (current) {
      mergedMap.set(draft.id, {
        ...current,
        title: draft.title,
        level: draft.level || current.level,
        deadline: draft.deadline,
        publishTime: draft.publishTime,
        forceRead: draft.forceRead,
        forceReply: draft.forceReply,
        status: draft.status,
        unmetUnitCount: draft.status === 'closed' ? 0 : current.unmetUnitCount
      });
    }
  });

  return Array.from(mergedMap.values()).sort((a, b) => b.publishTime.localeCompare(a.publishTime));
};

const buildSummaryFromList = (list: AnnouncementListItem[]) => ({
  total: list.length,
  overdueCount: list.filter((item) => item.status === 'overdue').length,
  unmetUnitCount: list.reduce((sum, item) => sum + item.unmetUnitCount, 0),
  criticalTodoCount: list.filter((item) => item.level === 'critical').length
});

const resolveConfirmState = (id: string) => readState().confirmStates.find((item) => item.id === id);

const resolveTodoStatusText = (params: {
  forceReply: boolean;
  completed?: boolean;
  readConfirmed?: boolean;
  replyRequired?: boolean;
  replyContent?: string;
}) => {
  const { forceReply, completed, readConfirmed, replyRequired, replyContent } = params;
  const hasReplyContent = Boolean(replyContent?.trim());

  if (completed) {
    if (forceReply) {
      return hasReplyContent ? '已确认回复' : '已确认';
    }
    return '已确认';
  }

  if (forceReply || replyRequired) {
    if (readConfirmed && hasReplyContent) return '已回复';
    if (readConfirmed) return '待回复';
    return '待确认回复';
  }

  return readConfirmed ? '已确认' : '待确认';
};

const resolveTodoActionText = (params: {
  completed?: boolean;
  readConfirmed?: boolean;
  forceReply: boolean;
  replyRequired?: boolean;
  replyContent?: string;
}) => {
  const { completed, readConfirmed, forceReply, replyRequired, replyContent } = params;
  const hasReplyContent = Boolean(replyContent?.trim());
  if (completed) return '查看详情';

  if (forceReply || replyRequired) {
    return readConfirmed || hasReplyContent ? '继续处理' : '立即处理';
  }

  return readConfirmed ? '继续处理' : '立即处理';
};

const buildFallbackDetail = (item: AnnouncementListItem): AnnouncementDetail => ({
  id: item.id,
  title: item.title,
  level: item.level,
  content: resolveAnnouncementContent(item.id),
  publishTime: item.publishTime,
  deadline: item.deadline,
  status: item.status,
  forceRead: item.forceRead,
  forceReply: item.forceReply,
  summary: {
    coverageUnitCount: 3,
    expectedUserCount: 36,
    readRate: item.readRate,
    replyRate: item.replyRate,
    escalatedUnitCount: item.escalatedUnitCount,
    pendingReadCount: item.status === 'closed' ? 0 : 12,
    pendingReplyCount: item.forceReply ? (item.status === 'closed' ? 0 : 6) : 0,
    completedCount: item.status === 'closed' ? 36 : 18
  },
  unitRows: clone(getAnnouncementDetail('notice-001')?.unitRows || []),
  userRows: clone(getAnnouncementDetail('notice-001')?.userRows || []),
  auditLogs: clone(getAnnouncementDetail('notice-001')?.auditLogs || []),
  replyDetails: clone(getAnnouncementDetail('notice-001')?.replyDetails || {})
});

const buildFallbackConfirmData = (item: AnnouncementListItem): NoticeConfirmData => {
  const persistedDraft = getPersistedDraftById(item.id);
  return {
    id: item.id,
    title: item.title,
    level: item.level,
    deadline: item.deadline,
    unitName: '华东运营中心',
    currentStatus: item.forceReply ? '待已读 / 待回复' : '待已读',
    content:
      persistedDraft?.content ||
      '近期监测发现外部高危漏洞已存在利用风险，请各单位在收到公告后立即完成本单位资产排查，并由关键岗位提交排查结果。请重点确认互联网暴露资产是否受影响、临时缓解措施是否已执行、正式修复计划是否已制定。',
    replyTips: '先选择最贴近现状的预设项，再补充自由文本说明受影响范围、处置进度和预计完成时间。',
    options: ['已完成排查，未发现受影响资产', '已发现风险，正在处置并补充说明'],
    initialReadConfirmed: false,
    initialReplyRequired: item.forceReply,
    initialReplyOption: '',
    initialReplyContent: '',
    completed: item.status === 'closed'
  };
};

export const fetchAnnouncementList = async (): Promise<AnnouncementListItem[]> => {
  await wait(250);
  return clone(mergeAnnouncementList());
};

export const fetchAnnouncementMeta = async (id: string): Promise<AnnouncementListItem | undefined> => {
  await wait(150);
  return clone(getMergedAnnouncementById(id));
};

export const fetchAnnouncementSummary = async (): Promise<{
  total: number;
  overdueCount: number;
  unmetUnitCount: number;
  criticalTodoCount: number;
}> => {
  await wait(200);
  return clone(buildSummaryFromList(mergeAnnouncementList()));
};

export const fetchAnnouncementDetail = async (id: string): Promise<AnnouncementDetail | undefined> => {
  await wait(250);
  const listItem = mergeAnnouncementList().find((item) => item.id === id);
  const mockDetail = clone(getAnnouncementDetail(id));
  const base = mockDetail && mockDetail.id === id ? mockDetail : listItem ? buildFallbackDetail(listItem) : undefined;
  if (!base) return undefined;
  const confirmState = resolveConfirmState(id);
  if (listItem) {
    base.title = listItem.title;
    base.level = listItem.level;
    base.content = resolveAnnouncementContent(id);
    base.deadline = listItem.deadline;
    base.publishTime = listItem.publishTime;
    base.status = listItem.status;
    base.forceRead = listItem.forceRead;
    base.forceReply = listItem.forceReply;
    base.summary.readRate = listItem.readRate;
    base.summary.replyRate = listItem.replyRate;
    base.summary.escalatedUnitCount = listItem.escalatedUnitCount;
    base.summary.pendingReadCount = confirmState?.completed ? 0 : base.summary.pendingReadCount;
    base.summary.pendingReplyCount =
      confirmState?.completed || !listItem.forceReply ? 0 : base.summary.pendingReplyCount;
  }
  return base;
};

export const fetchAnnouncementFormData = async (id?: string): Promise<AnnouncementFormData> => {
  await wait(250);
  const draft = readState().drafts.find((item) => item.id === id);
  if (draft) {
    return clone({
      title: draft.title,
      level: draft.level,
      content: draft.content,
      deadline: draft.deadline,
      forceRead: draft.forceRead,
      forceReply: draft.forceReply,
      replyMode: draft.replyMode,
      scopeUnits: draft.scopeUnits,
      scopeDepartments: draft.scopeDepartments,
      scopeRoles: draft.scopeRoles,
      scopeGroups: draft.scopeGroups
    });
  }
  return clone(getAnnouncementFormData(id));
};

export const fetchTodoNotices = async (): Promise<TodoNoticeItem[]> => {
  await wait(250);
  const baseTodos = clone(getTodoNotices());
  const list = mergeAnnouncementList();
  const state = readState();

  const dynamicTodos = list
    .filter((item) => item.status !== 'draft')
    .map<TodoNoticeItem>((item) => {
      const confirm = state.confirmStates.find((entry) => entry.id === item.id);
      const completed = confirm?.completed;
      const overdue = item.status === 'overdue';
      return {
        id: item.id,
        title: item.title,
        level: item.level,
        deadline: item.deadline,
        unitName: '华东运营中心',
        statusText: resolveTodoStatusText({
          forceReply: item.forceReply,
          completed,
          readConfirmed: confirm?.readConfirmed,
          replyRequired: confirm?.replyRequired,
          replyContent: confirm?.replyContent
        }),
        actionText: resolveTodoActionText({
          completed,
          readConfirmed: confirm?.readConfirmed,
          forceReply: item.forceReply,
          replyRequired: confirm?.replyRequired,
          replyContent: confirm?.replyContent
        }),
        forceRead: item.forceRead,
        forceReply: item.forceReply,
        overdue
      };
    });

  const mergedMap = new Map<string, TodoNoticeItem>();
  [...dynamicTodos, ...baseTodos].forEach((item) => {
    mergedMap.set(item.id, item);
  });

  state.confirmStates
    .filter((item) => item.completed)
    .forEach((confirm) => {
      const current = mergedMap.get(confirm.id);
      if (!current) return;
      mergedMap.set(confirm.id, {
        ...current,
        statusText: resolveTodoStatusText({
          forceReply: current.forceReply,
          completed: true,
          readConfirmed: confirm.readConfirmed,
          replyRequired: confirm.replyRequired,
          replyContent: confirm.replyContent
        }),
        actionText: '查看详情',
        overdue: false
      });
    });

  return Array.from(mergedMap.values());
};

export const fetchNoticeConfirmData = async (id: string): Promise<NoticeConfirmData> => {
  await wait(250);
  const listItem = mergeAnnouncementList().find((item) => item.id === id);
  const mockConfirm = clone(getNoticeConfirmData(id));
  const base =
    mockConfirm && mockConfirm.id === id ? mockConfirm : listItem ? buildFallbackConfirmData(listItem) : undefined;
  if (!base) {
    throw new Error(`Announcement ${id} not found`);
  }
  const confirmState = resolveConfirmState(id);
  if (listItem) {
    base.title = listItem.title;
    base.level = listItem.level;
    base.content = resolveAnnouncementContent(id);
    base.deadline = listItem.deadline;
    base.currentStatus = listItem.forceReply ? '待已读 / 待回复' : '待已读';
  }
  if (confirmState) {
    base.initialReadConfirmed = confirmState.readConfirmed;
    base.initialReplyRequired = confirmState.replyRequired;
    base.initialReplyOption = confirmState.replyOption;
    base.initialReplyContent = confirmState.replyContent;
    base.completed = confirmState.completed;
    base.currentStatus = confirmState.completed
      ? '已完成确认'
      : confirmState.replyRequired
        ? '待已读 / 待回复'
        : confirmState.readConfirmed
          ? '已读待提交'
          : '待已读';
  }
  return base;
};

export const saveAnnouncementDraft = async (
  payload: SaveAnnouncementDraftPayload
): Promise<{ id: string; message: string }> => {
  await wait(600);
  const state = readState();
  const id = payload.id || `draft-${Date.now()}`;
  const draft: PersistedAnnouncementDraft = {
    ...payload,
    id,
    status: 'draft',
    publishTime: nowString()
  };
  const nextDrafts = state.drafts.filter((item) => item.id !== id);
  nextDrafts.unshift(draft);
  writeState({
    ...state,
    drafts: nextDrafts,
    deletedIds: state.deletedIds.filter((item) => item !== id)
  });
  return {
    id,
    message: '草稿已保存'
  };
};

export const publishAnnouncement = async (
  payload: PublishAnnouncementPayload
): Promise<{ id: string; message: string }> => {
  await wait(800);
  const state = readState();
  const id = payload.id || `notice-${Date.now()}`;
  const existing = state.drafts.find((item) => item.id === id);
  const published: PersistedAnnouncementDraft = {
    ...payload,
    id,
    status: 'ongoing',
    publishTime: existing?.publishTime || nowString()
  };
  const nextDrafts = state.drafts.filter((item) => item.id !== id);
  nextDrafts.unshift(published);
  writeState({
    ...state,
    drafts: nextDrafts,
    deletedIds: state.deletedIds.filter((item) => item !== id)
  });
  return {
    id,
    message: payload.id ? '公告已更新并重新生效' : '公告已发布'
  };
};

export const saveNoticeConfirmDraft = async (
  payload: SaveNoticeConfirmDraftPayload
): Promise<{ id: string; message: string }> => {
  await wait(500);
  const state = readState();
  const nextConfirm: PersistedConfirmState = {
    id: payload.id,
    readConfirmed: payload.readConfirmed,
    replyRequired: payload.replyRequired,
    replyOption: payload.replyOption,
    replyContent: payload.replyContent,
    completed: false,
    updatedAt: nowString()
  };
  writeState({
    ...state,
    confirmStates: [nextConfirm, ...state.confirmStates.filter((item) => item.id !== payload.id)]
  });
  return {
    id: payload.id,
    message: '已暂存当前填写内容'
  };
};

export const submitNoticeConfirm = async (
  payload: SubmitNoticeConfirmPayload
): Promise<{ id: string; message: string }> => {
  await wait(800);
  const state = readState();
  const nextConfirm: PersistedConfirmState = {
    id: payload.id,
    readConfirmed: payload.readConfirmed,
    replyRequired: payload.replyRequired,
    replyOption: payload.replyOption,
    replyContent: payload.replyContent,
    completed: true,
    updatedAt: nowString()
  };
  writeState({
    ...state,
    confirmStates: [nextConfirm, ...state.confirmStates.filter((item) => item.id !== payload.id)]
  });
  return {
    id: payload.id,
    message: '已完成公告确认'
  };
};

export const sendAnnouncementReminder = async (
  payload: SendReminderPayload
): Promise<{ count: number; message: string }> => {
  await wait(700);
  return {
    count: payload.targets.length,
    message: '已发送催办通知'
  };
};

export const createAnnouncementExportTask = async (
  payload: CreateExportTaskPayload
): Promise<{ taskId: string; message: string }> => {
  await wait(700);
  return {
    taskId: `export-${Date.now()}`,
    message: `已生成导出任务（${payload.formats.join(' / ').toUpperCase()}）`
  };
};

export const deleteAnnouncementDraft = async (id: string): Promise<{ id: string; message: string }> => {
  await wait(500);
  const state = readState();
  writeState({
    drafts: state.drafts.filter((item) => item.id !== id),
    confirmStates: state.confirmStates.filter((item) => item.id !== id),
    deletedIds: [...state.deletedIds.filter((item) => item !== id), id]
  });
  return {
    id,
    message: '草稿已删除'
  };
};

export const deleteClosedAnnouncement = async (id: string): Promise<{ id: string; message: string }> => {
  await wait(500);
  const state = readState();
  writeState({
    drafts: state.drafts.filter((item) => item.id !== id),
    confirmStates: state.confirmStates.filter((item) => item.id !== id),
    deletedIds: [...state.deletedIds.filter((item) => item !== id), id]
  });
  return {
    id,
    message: '公告已删除'
  };
};

export const updateAnnouncementStatus = async (
  id: string,
  status: Extract<AnnouncementStatus, 'ongoing' | 'closed'>
): Promise<{ id: string; message: string }> => {
  await wait(600);
  const state = readState();
  const persisted = buildPersistedAnnouncementFromExisting(id, status);
  if (!persisted) {
    throw new Error(`Announcement ${id} not found`);
  }

  const nextConfirmStates =
    status === 'ongoing' ? state.confirmStates.filter((item) => item.id !== id) : state.confirmStates;

  writeState({
    drafts: [persisted, ...state.drafts.filter((item) => item.id !== id)],
    confirmStates: nextConfirmStates
  });

  return {
    id,
    message: status === 'closed' ? '公告已关闭' : '公告已重新打开'
  };
};

export const resetAnnouncementDemoState = async (): Promise<{ message: string }> => {
  await wait(500);
  writeState(buildDefaultState());
  return {
    message: '本地演示数据已清空'
  };
};
