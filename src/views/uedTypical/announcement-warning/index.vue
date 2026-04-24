<template>
  <div class="announcement-warning-container">
    <a-card style="height: 100%">
      <template v-if="!selectedAnnouncement">
        <div class="statistics-section">
          <div class="stat-card">
            <div class="stat-label">发布中公告</div>
            <div class="stat-value">{{ summary.total }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">已超时未闭环</div>
            <div class="stat-value danger">{{ summary.overdueCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">未达标单位</div>
            <div class="stat-value warning">{{ summary.unmetUnitCount }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">高危公告</div>
            <div class="stat-value brand">{{ summary.criticalTodoCount }}</div>
          </div>
        </div>

        <div class="search-section">
          <a-form layout="inline">
            <a-form-item label="公告标题">
              <a-input
                v-model:value="searchForm.keyword"
                allow-clear
                placeholder="请输入公告标题"
                style="width: 220px"
              />
            </a-form-item>
            <a-form-item label="预警等级">
              <a-select
                v-model:value="searchForm.level"
                :options="levelOptions"
                allow-clear
                placeholder="请选择预警等级"
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item label="公告状态">
              <a-select
                v-model:value="searchForm.status"
                :options="statusOptions"
                allow-clear
                placeholder="请选择状态"
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch">
                  <template #icon><SearchOutlined /></template>
                  搜索
                </a-button>
                <a-button @click="handleReset">
                  <template #icon><ReloadOutlined /></template>
                  重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>

        <div class="action-section">
          <div class="action-bar">
            <div class="left-actions">
              <a-button type="primary" @click="handleCreate">
                <template #icon><PlusOutlined /></template>
                新建公告
              </a-button>
              <a-button @click="router.push('/announcement-warning/todo')">我的待办</a-button>
            </div>
            <div class="right-actions">
              <span class="summary-text">当前共 {{ filteredAnnouncements.length }} 条公告</span>
            </div>
          </div>
        </div>

        <div class="data-display-section">
          <a-table
            :columns="listColumns"
            :data-source="filteredAnnouncements"
            :pagination="false"
            row-key="id"
            :scroll="{ x: 1400 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'title'">
                <div class="title-cell">
                  <div class="title-main">{{ record.title }}</div>
                  <div class="title-sub">
                    {{ record.forceRead ? '强制已读' : '普通公告' }}
                    <span v-if="record.forceReply"> / 强制回复</span>
                  </div>
                </div>
              </template>

              <template v-else-if="column.key === 'level'">
                <a-tag :color="getLevelTagColor(record.level)">
                  {{ getLevelLabel(record.level) }}
                </a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-tag :color="getAnnouncementStatusTagColor(record.status)">
                  {{ getAnnouncementStatusLabel(record.status) }}
                </a-tag>
              </template>

              <template v-else-if="column.key === 'rates'">
                <span>{{ record.readRate }}% / {{ record.replyRate }}%</span>
              </template>

              <template v-else-if="column.key === 'operation'">
                <div class="operation-cell">
                  <a-button
                    v-if="record.status !== 'draft'"
                    type="link"
                    class="link-btn"
                    @click="handleViewDetail(record.id)"
                  >
                    查看详情
                  </a-button>
                  <a-button type="link" class="link-btn" @click="handleEdit(record.id)"> 编辑 </a-button>
                  <a-popconfirm
                    v-if="record.status === 'draft'"
                    title="确定删除该草稿吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDeleteDraft(record.id)"
                  >
                    <a-button
                      type="link"
                      danger
                      class="link-btn"
                      :loading="listActionLoadingId === record.id && listActionType === 'delete'"
                    >
                      删除
                    </a-button>
                  </a-popconfirm>
                  <template v-else>
                    <a-button
                      type="link"
                      class="link-btn"
                      :disabled="record.status === 'closed'"
                      @click="openReminderModal"
                    >
                      手动催办
                    </a-button>
                    <a-popconfirm
                      v-if="record.status !== 'closed'"
                      title="确定关闭该公告吗？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleChangeStatus(record.id, 'closed')"
                    >
                      <a-button
                        type="link"
                        class="link-btn"
                        :loading="listActionLoadingId === record.id && listActionType === 'status'"
                      >
                        关闭
                      </a-button>
                    </a-popconfirm>
                    <a-button
                      v-else
                      type="link"
                      class="link-btn"
                      :loading="listActionLoadingId === record.id && listActionType === 'status'"
                      @click="handleChangeStatus(record.id, 'ongoing')"
                    >
                      重新打开
                    </a-button>
                    <a-popconfirm
                      v-if="record.status === 'closed'"
                      title="确定删除该已关闭公告吗？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="handleDeleteClosed(record.id)"
                    >
                      <a-button
                        type="link"
                        danger
                        class="link-btn"
                        :loading="listActionLoadingId === record.id && listActionType === 'delete'"
                      >
                        删除
                      </a-button>
                    </a-popconfirm>
                  </template>
                </div>
              </template>
            </template>
          </a-table>

          <div class="pagination-container">
            <a-pagination :current="1" :pageSize="10" :total="filteredAnnouncements.length" />
          </div>
        </div>
      </template>

      <template v-else-if="selectedAnnouncement && detailData">
        <div class="detail-view">
          <div class="page-header">
            <div>
              <div class="page-title">{{ selectedAnnouncement.title }}</div>
              <div class="page-subtitle">同一公告下查看单位闭环进度与个人执行状态，支撑催办、导出和审计追踪</div>
            </div>
            <a-space>
              <a-button @click="goBackToList">
                <template #icon><ArrowLeftOutlined /></template>
                返回列表
              </a-button>
              <a-button
                v-if="selectedAnnouncement.status !== 'draft'"
                :loading="detailStatusSubmitting"
                @click="
                  handleChangeStatus(
                    selectedAnnouncement.id,
                    selectedAnnouncement.status === 'closed' ? 'ongoing' : 'closed'
                  )
                "
              >
                {{ selectedAnnouncement.status === 'closed' ? '重新打开公告' : '关闭公告' }}
              </a-button>
              <a-popconfirm
                v-if="selectedAnnouncement.status === 'closed'"
                title="确定删除该已关闭公告吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteClosed(selectedAnnouncement.id)"
              >
                <a-button danger :loading="detailDeleteSubmitting">删除公告</a-button>
              </a-popconfirm>
              <a-button @click="openAuditDrawer">
                <template #icon><FileSearchOutlined /></template>
                查看审计日志
              </a-button>
              <a-button type="primary" :disabled="selectedAnnouncement.status === 'closed'" @click="openReminderModal">
                <template #icon><BellOutlined /></template>
                批量催办
              </a-button>
              <a-button @click="openExportModal(selectedAnnouncement.title)"> 导出报告 </a-button>
            </a-space>
          </div>

          <div class="overview-panel">
            <div class="overview-main">
              <div class="meta-tags">
                <a-tag :color="getLevelTagColor(selectedAnnouncement.level)">
                  {{ getLevelLabel(selectedAnnouncement.level) }}
                </a-tag>
                <a-tag color="default">截止 {{ selectedAnnouncement.deadline }}</a-tag>
                <a-tag color="processing">
                  {{ selectedAnnouncement.forceRead ? '强制已读' : '普通阅读' }}
                  <span v-if="selectedAnnouncement.forceReply"> / 强制回复</span>
                </a-tag>
              </div>
              <div class="overview-name">{{ selectedAnnouncement.title }}</div>
              <div class="overview-desc">
                当前公告默认优先查看未达标单位，也支持切换到用户视角直接筛选未读、未回复和超时对象。
              </div>
            </div>
            <div class="overview-side">
              <div class="overview-side-item">
                <span class="item-label">公告状态</span>
                <a-tag :color="getAnnouncementStatusTagColor(selectedAnnouncement.status)">
                  {{ getAnnouncementStatusLabel(selectedAnnouncement.status) }}
                </a-tag>
              </div>
              <div class="overview-side-item">
                <span class="item-label">发布时间</span>
                <span>{{ selectedAnnouncement.publishTime }}</span>
              </div>
              <div class="overview-side-item">
                <span class="item-label">结束时间</span>
                <span>{{ selectedAnnouncement.deadline }}</span>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <div class="summary-card">
              <div class="summary-label">覆盖单位</div>
              <div class="summary-value">{{ detailData.summary.coverageUnitCount }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">应接收人数</div>
              <div class="summary-value">{{ detailData.summary.expectedUserCount }}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">全局已读率</div>
              <div class="summary-value brand">{{ detailData.summary.readRate }}%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">全局回复率</div>
              <div class="summary-value warning">{{ detailData.summary.replyRate }}%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">已升级单位</div>
              <div class="summary-value danger">
                {{ detailData.summary.escalatedUnitCount }}
              </div>
            </div>
          </div>

          <a-card title="公告内容" size="small" class="content-card">
            <div class="announcement-content">{{ detailData.content || '暂无公告内容' }}</div>
          </a-card>

          <a-tabs v-model:activeKey="activeView" class="detail-tabs">
            <a-tab-pane key="unit" tab="单位处理情况">
              <a-table :columns="unitColumns" :data-source="detailData.unitRows" :pagination="false" row-key="id">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag :color="getUnitStatusTagColor(record.status)">
                      {{ getUnitStatusLabel(record.status) }}
                    </a-tag>
                  </template>

                  <template v-else-if="column.key === 'readRate'">
                    <a-button type="link" class="link-btn" @click="handleOpenUnit(record)">
                      {{ record.readUserCount }}/{{ record.expectedUserCount }} ({{ record.readRate }}%)
                    </a-button>
                  </template>

                  <template v-else-if="column.key === 'replyRate'">
                    <span>{{ record.repliedUserCount }}/{{ record.expectedUserCount }} ({{ record.replyRate }}%)</span>
                  </template>

                  <template v-else-if="column.key === 'operation'">
                    <div class="operation-cell">
                      <a-button type="link" class="link-btn" @click="handleOpenUnit(record)"> 下钻人员 </a-button>
                      <a-button type="link" class="link-btn" @click="openReminderModal"> 催办本单位 </a-button>
                    </div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>

            <a-tab-pane key="user" tab="用户处理情况">
              <a-table :columns="userColumns" :data-source="detailData.userRows" :pagination="false" row-key="id">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'readStatus'">
                    <a-tag :color="getReadStatusTagColor(record.readStatus)">
                      {{ getReadStatusLabel(record.readStatus) }}
                    </a-tag>
                  </template>

                  <template v-else-if="column.key === 'replyStatus'">
                    <a-tag :color="getReplyStatusTagColor(record.replyStatus)">
                      {{ getReplyStatusLabel(record.replyStatus) }}
                    </a-tag>
                  </template>

                  <template v-else-if="column.key === 'operation'">
                    <div class="operation-cell">
                      <a-button
                        type="link"
                        class="link-btn"
                        :disabled="record.replyStatus !== 'replied' && record.replyStatus !== 'pending'"
                        @click="openReplyDrawer(record.id)"
                      >
                        回复详情
                      </a-button>
                      <a-button type="link" class="link-btn" @click="openReminderModal"> 手动催办 </a-button>
                    </div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-card>

    <a-drawer :open="unitDrawerOpen" title="单位下钻用户明细" width="70%" @close="unitDrawerOpen = false">
      <template v-if="selectedUnit">
        <div class="drawer-header">
          <a-space>
            <a-tag color="processing">{{ selectedUnit.unitName }}</a-tag>
            <a-tag :color="getUnitStatusTagColor(selectedUnit.status)">
              {{ getUnitStatusLabel(selectedUnit.status) }}
            </a-tag>
          </a-space>
        </div>
        <a-table :columns="drawerUserColumns" :data-source="selectedUnitUsers" :pagination="false" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'readStatus'">
              <a-tag :color="getReadStatusTagColor(record.readStatus)">
                {{ getReadStatusLabel(record.readStatus) }}
              </a-tag>
            </template>
            <template v-else-if="column.key === 'replyStatus'">
              <a-tag :color="getReplyStatusTagColor(record.replyStatus)">
                {{ getReplyStatusLabel(record.replyStatus) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </template>
    </a-drawer>

    <a-drawer :open="replyDrawerOpen" title="回复详情" width="50%" @close="replyDrawerOpen = false">
      <template v-if="selectedReplyDetail">
        <div class="detail-panel">
          <div class="detail-block">
            <div class="detail-title">个人执行信息</div>
            <div class="detail-line">
              姓名 / 账号：{{ selectedReplyDetail.userName }} / {{ selectedReplyDetail.account }}
            </div>
            <div class="detail-line">所属单位：{{ selectedReplyDetail.unitName }}</div>
            <div class="detail-line warning-text">当前状态：{{ selectedReplyDetail.currentStatus }}</div>
          </div>
          <div class="detail-block">
            <div class="detail-title">最新回复内容</div>
            <a-tag color="processing">{{ selectedReplyDetail.replyMode }}</a-tag>
            <div class="detail-line" style="margin-top: 8px">
              {{ selectedReplyDetail.latestContent }}
            </div>
          </div>
          <div class="detail-block">
            <div class="detail-title">回复版本历史</div>
            <div v-for="item in selectedReplyDetail.versions" :key="item.id" class="detail-line">
              {{ item.version }} {{ item.submitTime }} {{ item.isCurrent ? '当前生效' : '' }}
            </div>
            <div class="detail-line subtle-text">防篡改摘要：{{ selectedReplyDetail.contentHash }}</div>
          </div>
          <div class="detail-block">
            <div class="detail-title">已读凭证与催办记录</div>
            <div class="detail-line">{{ selectedReplyDetail.readAudit }}</div>
            <div class="detail-line">{{ selectedReplyDetail.reminderTrail }}</div>
          </div>
        </div>
      </template>
    </a-drawer>

    <a-drawer :open="auditDrawerOpen" title="审计日志" width="50%" @close="auditDrawerOpen = false">
      <div class="detail-panel">
        <div class="detail-block">
          <div class="detail-title">关键操作时间线</div>
          <div v-for="log in detailData.auditLogs" :key="log.id" class="detail-line">
            {{ log.actionTime }} {{ log.actionType }} {{ log.actor }} {{ log.snapshot }}
          </div>
        </div>
      </div>
    </a-drawer>

    <ExportReportModal
      v-model:open="exportModalOpen"
      :announcement-title="exportAnnouncementTitle"
      :confirm-loading="exportSubmitting"
      @submit="handleExportSubmit"
    />

    <ReminderModal
      v-model:open="reminderModalOpen"
      :confirm-loading="reminderSubmitting"
      @submit="handleReminderSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onMounted, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    ArrowLeftOutlined,
    BellOutlined,
    FileSearchOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import ExportReportModal from './components/ExportReportModal.vue';
  import ReminderModal from './components/ReminderModal.vue';
  import {
    filterUsersByUnit,
    getAnnouncementStatusLabel,
    getAnnouncementStatusTagColor,
    getLevelLabel,
    getLevelTagColor,
    getReadStatusLabel,
    getReadStatusTagColor,
    getReplyStatusLabel,
    getReplyStatusTagColor,
    getUnitStatusLabel,
    getUnitStatusTagColor,
    type AnnouncementDetail,
    type AnnouncementListItem,
    type UnitTrackingRow
  } from './mock';
  import {
    createAnnouncementExportTask,
    deleteClosedAnnouncement,
    deleteAnnouncementDraft,
    fetchAnnouncementDetail,
    fetchAnnouncementList,
    fetchAnnouncementSummary,
    sendAnnouncementReminder,
    updateAnnouncementStatus
  } from './service';

  interface SearchFormState {
    keyword: string;
    level?: string;
    status?: string;
  }

  const route = useRoute();
  const router = useRouter();
  const announcements = ref<AnnouncementListItem[]>([]);
  const summary = ref({
    total: 0,
    overdueCount: 0,
    unmetUnitCount: 0,
    criticalTodoCount: 0
  });

  const searchForm = reactive<SearchFormState>({
    keyword: '',
    level: undefined,
    status: undefined
  });

  const levelOptions = [
    { label: '高危', value: 'critical' },
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' }
  ];

  const statusOptions = [
    { label: '草稿', value: 'draft' },
    { label: '进行中', value: 'ongoing' },
    { label: '已超时', value: 'overdue' },
    { label: '已闭环', value: 'closed' }
  ];

  const selectedAnnouncementId = ref<string>('');
  const activeView = ref<'unit' | 'user'>('unit');

  const unitDrawerOpen = ref(false);
  const replyDrawerOpen = ref(false);
  const auditDrawerOpen = ref(false);
  const exportModalOpen = ref(false);
  const reminderModalOpen = ref(false);

  const exportAnnouncementTitle = ref('');
  const selectedUnit = ref<UnitTrackingRow | null>(null);
  const selectedReplyUserId = ref('');
  const exportSubmitting = ref(false);
  const reminderSubmitting = ref(false);
  const detailStatusSubmitting = ref(false);
  const detailDeleteSubmitting = ref(false);
  const listActionLoadingId = ref('');
  const listActionType = ref<'delete' | 'status' | ''>('');

  const filteredAnnouncements = computed(() => {
    return announcements.value.filter((item) => {
      const matchKeyword = !searchForm.keyword || item.title.includes(searchForm.keyword);
      const matchLevel = !searchForm.level || item.level === searchForm.level;
      const matchStatus = !searchForm.status || item.status === searchForm.status;
      return matchKeyword && matchLevel && matchStatus;
    });
  });

  const selectedAnnouncement = computed(() =>
    announcements.value.find((item) => item.id === selectedAnnouncementId.value)
  );

  const detailData = ref<AnnouncementDetail>();

  const selectedUnitUsers = computed(() => {
    if (!selectedUnit.value || !detailData.value) return [];
    return filterUsersByUnit(detailData.value, selectedUnit.value.id);
  });

  const selectedReplyDetail = computed(() => {
    return detailData.value?.replyDetails[selectedReplyUserId.value];
  });

  const listColumns = [
    { title: '公告标题', dataIndex: 'title', key: 'title', width: 260 },
    { title: '预警等级', dataIndex: 'level', key: 'level', width: 120 },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 160 },
    { title: '结束时间', dataIndex: 'deadline', key: 'deadline', width: 160 },
    { title: '已读率 / 回复率', key: 'rates', width: 160 },
    { title: '未达标单位', dataIndex: 'unmetUnitCount', key: 'unmetUnitCount', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
    { title: '操作', key: 'operation', width: 280, fixed: 'right' }
  ];

  const unitColumns = [
    { title: '单位名称', dataIndex: 'unitName', key: 'unitName', width: 220 },
    { title: '应接收人数', dataIndex: 'expectedUserCount', key: 'expectedUserCount', width: 120 },
    { title: '已读情况', key: 'readRate', width: 200 },
    { title: '回复情况', key: 'replyRate', width: 200 },
    { title: '关键岗位进度', dataIndex: 'keyPositionProgress', key: 'keyPositionProgress', width: 150 },
    { title: '最后操作时间', dataIndex: 'lastActionTime', key: 'lastActionTime', width: 180 },
    { title: '状态', key: 'status', width: 120 },
    { title: '操作', key: 'operation', width: 180, fixed: 'right' }
  ];

  const userColumns = [
    { title: '姓名 / 账号', dataIndex: 'name', key: 'name', width: 180 },
    { title: '所属单位', dataIndex: 'unitName', key: 'unitName', width: 180 },
    { title: '已读状态', key: 'readStatus', width: 120 },
    { title: '回复状态', key: 'replyStatus', width: 120 },
    { title: '回复摘要', dataIndex: 'replySummary', key: 'replySummary', width: 260 },
    { title: '催办次数', dataIndex: 'reminderCount', key: 'reminderCount', width: 120 },
    { title: '最近催办时间', dataIndex: 'lastReminderTime', key: 'lastReminderTime', width: 180 },
    { title: '操作', key: 'operation', width: 180, fixed: 'right' }
  ];

  const drawerUserColumns = [
    { title: '姓名 / 账号', dataIndex: 'name', key: 'name', width: 180 },
    { title: '已读状态', key: 'readStatus', width: 120 },
    { title: '回复状态', key: 'replyStatus', width: 120 },
    { title: '回复摘要', dataIndex: 'replySummary', key: 'replySummary', width: 220 },
    { title: '催办次数', dataIndex: 'reminderCount', key: 'reminderCount', width: 100 },
    { title: '最近催办时间', dataIndex: 'lastReminderTime', key: 'lastReminderTime', width: 180 }
  ];

  const handleSearch = () => {
    message.success('已按筛选条件更新公告列表');
  };

  const handleReset = () => {
    searchForm.keyword = '';
    searchForm.level = undefined;
    searchForm.status = undefined;
  };

  const handleCreate = () => {
    router.push({ path: '/announcement-warning/editor', query: {} });
  };

  const handleViewDetail = (id: string) => {
    selectedAnnouncementId.value = id;
    activeView.value = 'unit';
    router.replace({ path: '/announcement-warning', query: { id } });
  };

  const handleEdit = (id: string) => {
    router.push({ path: '/announcement-warning/editor', query: { id } });
  };

  const goBackToList = () => {
    selectedAnnouncementId.value = '';
    router.replace('/announcement-warning');
  };

  const handleOpenUnit = (row: UnitTrackingRow) => {
    selectedUnit.value = row;
    unitDrawerOpen.value = true;
  };

  const openReplyDrawer = (userId: string) => {
    selectedReplyUserId.value = userId;
    replyDrawerOpen.value = true;
  };

  const openAuditDrawer = () => {
    auditDrawerOpen.value = true;
  };

  const openExportModal = (title: string) => {
    exportAnnouncementTitle.value = title;
    exportModalOpen.value = true;
  };

  const openReminderModal = () => {
    reminderModalOpen.value = true;
  };

  const handleExportSubmit = async (payload: { scope: string; formats: string[]; desensitize: boolean }) => {
    exportSubmitting.value = true;
    try {
      const result = await createAnnouncementExportTask({
        announcementTitle: exportAnnouncementTitle.value,
        scope: payload.scope,
        formats: payload.formats,
        desensitize: payload.desensitize
      });
      message.success(result.message);
      exportModalOpen.value = false;
    } finally {
      exportSubmitting.value = false;
    }
  };

  const handleReminderSubmit = async (payload: { targets: string[]; channels: string[]; message: string }) => {
    reminderSubmitting.value = true;
    try {
      const result = await sendAnnouncementReminder(payload);
      message.success(result.message);
      reminderModalOpen.value = false;
    } finally {
      reminderSubmitting.value = false;
    }
  };

  const loadDetailData = async (id: string) => {
    detailData.value = await fetchAnnouncementDetail(id);
  };

  const loadListData = async () => {
    const [list, summaryData] = await Promise.all([fetchAnnouncementList(), fetchAnnouncementSummary()]);
    announcements.value = list;
    summary.value = summaryData;
  };

  const handleDeleteDraft = async (id: string) => {
    listActionLoadingId.value = id;
    listActionType.value = 'delete';
    try {
      const result = await deleteAnnouncementDraft(id);
      if (selectedAnnouncementId.value === id) {
        selectedAnnouncementId.value = '';
        router.replace('/announcement-warning');
      }
      await loadListData();
      message.success(result.message);
    } finally {
      listActionLoadingId.value = '';
      listActionType.value = '';
    }
  };

  const handleDeleteClosed = async (id: string) => {
    const isCurrentDetail = selectedAnnouncementId.value === id;
    if (isCurrentDetail) {
      detailDeleteSubmitting.value = true;
    } else {
      listActionLoadingId.value = id;
      listActionType.value = 'delete';
    }
    try {
      const result = await deleteClosedAnnouncement(id);
      if (selectedAnnouncementId.value === id) {
        selectedAnnouncementId.value = '';
        detailData.value = undefined;
        router.replace('/announcement-warning');
      }
      await loadListData();
      message.success(result.message);
    } finally {
      detailDeleteSubmitting.value = false;
      listActionLoadingId.value = '';
      listActionType.value = '';
    }
  };

  const handleChangeStatus = async (id: string, status: 'ongoing' | 'closed') => {
    const isCurrentDetail = selectedAnnouncementId.value === id;
    if (isCurrentDetail) {
      detailStatusSubmitting.value = true;
    } else {
      listActionLoadingId.value = id;
      listActionType.value = 'status';
    }
    try {
      const result = await updateAnnouncementStatus(id, status);
      await loadListData();
      if (selectedAnnouncementId.value === id) {
        await loadDetailData(id);
      }
      message.success(result.message);
    } finally {
      detailStatusSubmitting.value = false;
      listActionLoadingId.value = '';
      listActionType.value = '';
    }
  };

  watch(
    () => route.query.id,
    (id) => {
      selectedAnnouncementId.value = typeof id === 'string' ? id : '';
    },
    { immediate: true }
  );

  watch(
    () => route.query.refresh,
    async (refreshToken) => {
      if (!refreshToken) return;
      handleReset();
      selectedAnnouncementId.value = '';
      await loadListData();
    }
  );

  watch(
    selectedAnnouncementId,
    async (id) => {
      detailData.value = id ? await fetchAnnouncementDetail(id) : undefined;
    },
    { immediate: true }
  );

  onMounted(() => {
    loadListData();
  });

  onActivated(() => {
    loadListData();
    if (selectedAnnouncementId.value) {
      loadDetailData(selectedAnnouncementId.value);
    }
  });
</script>

<style lang="less" scoped>
  .announcement-warning-container {
    padding: 20px;
    height: 100%;
    min-height: calc(100vh - 48px);
    box-sizing: border-box;

    :deep(.ant-card) {
      height: 100%;
    }

    :deep(.ant-card-body) {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }

    .detail-view {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
    }

    .statistics-section,
    .summary-section {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .summary-section {
      grid-template-columns: repeat(5, 1fr);
    }

    .stat-card,
    .summary-card {
      padding: 20px;
      border-radius: 8px;
      background: #f7f8fa;

      .stat-label,
      .summary-label {
        margin-bottom: 8px;
        color: var(--color-text-secondary);
        font-size: 13px;
      }

      .stat-value,
      .summary-value {
        color: var(--color-text-primarys);
        font-size: 28px;
        font-weight: 600;

        &.danger {
          color: #f53c3c;
        }

        &.warning {
          color: #f3a700;
        }

        &.brand {
          color: #134bea;
        }
      }
    }

    .search-section,
    .action-section {
      margin-bottom: 16px;
    }

    .content-card {
      margin-bottom: 16px;
    }

    .detail-tabs {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;

      :deep(.ant-tabs-content-holder),
      :deep(.ant-tabs-content),
      :deep(.ant-tabs-tabpane) {
        height: 100%;
      }
    }

    .action-bar,
    .sub-action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-text {
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .title-cell {
      .title-main {
        color: var(--color-text-primarys);
        font-weight: 500;
      }

      .title-sub {
        margin-top: 4px;
        color: var(--color-text-secondary);
        font-size: 12px;
      }
    }

    .operation-cell {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .link-btn {
      padding: 0;
    }

    .pagination-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .page-title {
      color: var(--color-text-primarys);
      font-size: 22px;
      font-weight: 600;
    }

    .page-subtitle {
      margin-top: 4px;
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .overview-panel {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px;
      margin-bottom: 16px;
      border-radius: 8px;
      background: #f7f8fa;
    }

    .overview-main {
      flex: 1;
    }

    .meta-tags {
      margin-bottom: 12px;
    }

    .overview-name {
      margin-bottom: 8px;
      color: var(--color-text-primarys);
      font-size: 24px;
      font-weight: 600;
    }

    .overview-desc {
      color: var(--color-text-secondary);
      line-height: 1.7;
    }

    .announcement-content {
      color: var(--color-text-primarys);
      line-height: 24px;
      white-space: pre-wrap;
    }

    .overview-side {
      min-width: 260px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .overview-side-item {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
    }

    .item-label {
      color: var(--color-text-secondary);
    }

    .drawer-header {
      margin-bottom: 16px;
    }

    .detail-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-block {
      padding: 16px;
      border-radius: 8px;
      background: #f7f8fa;
    }

    .detail-title {
      margin-bottom: 12px;
      color: var(--color-text-primarys);
      font-size: 15px;
      font-weight: 600;
    }

    .detail-line {
      margin-bottom: 8px;
      color: var(--color-text-secondary);
      line-height: 1.7;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .warning-text {
      color: #f3a700;
    }

    .subtle-text {
      font-size: 12px;
    }
  }
</style>
