<template>
  <div class="trace-task-container">
    <a-card style="height: 100%">
      <div class="statistics-section">
        <div class="stat-card">
          <div class="stat-label">任务总数</div>
          <div class="stat-value">{{ tasks.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">进行中</div>
          <div class="stat-value running">{{ runningCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">待开始</div>
          <div class="stat-value pending">{{ pendingCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已完成 / 失败</div>
          <div class="stat-value">{{ finishedCount }} / {{ failedCount }}</div>
        </div>
      </div>

      <div class="search-section">
        <a-form layout="inline">
          <a-form-item label="任务名称">
            <a-input v-model:value="searchForm.keyword" allow-clear placeholder="请输入任务名称" style="width: 220px" />
          </a-form-item>
          <a-form-item label="溯源类型">
            <a-select
              v-model:value="searchForm.traceType"
              :options="TRACE_TYPE_OPTIONS"
              allow-clear
              placeholder="请选择溯源类型"
              style="width: 180px"
            />
          </a-form-item>
          <a-form-item label="任务状态">
            <a-select
              v-model:value="searchForm.status"
              :options="STATUS_OPTIONS"
              allow-clear
              placeholder="请选择任务状态"
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
            <a-button type="primary" @click="openCreateDrawer">
              <template #icon><PlusOutlined /></template>
              创建任务
            </a-button>
          </div>
          <div class="right-actions">
            <a-tag color="processing">并行中 {{ runningCount }}/{{ MAX_RUNNING_TASKS }}</a-tag>
            <span class="summary-text">待执行 {{ pendingCount }} 项</span>
          </div>
        </div>
      </div>

      <div class="data-display-section">
        <a-table
          :columns="columns"
          :data-source="paginatedTasks"
          :pagination="false"
          :row-key="(record: TraceTask) => record.id"
          :scroll="{ x: 1600 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a-tooltip :title="record.name">
                <span class="name-cell">{{ record.name }}</span>
              </a-tooltip>
            </template>

            <template v-else-if="column.key === 'description'">
              <a-tooltip :title="record.description || '-'">
                <span class="ellipsis-text">{{ record.description || '-' }}</span>
              </a-tooltip>
            </template>

            <template v-else-if="column.key === 'traceType'">
              {{ getTraceTypeLabel(record.traceType) }}
            </template>

            <template v-else-if="column.key === 'conditionTags'">
              <div class="tag-list">
                <a-tag v-for="tag in (record.conditionTags ?? []).slice(0, 4)" :key="tag" class="condition-tag">
                  {{ tag }}
                </a-tag>
                <a-tooltip
                  v-if="(record.conditionTags ?? []).length > 4"
                  :title="(record.conditionTags ?? []).slice(4).join('；')"
                >
                  <a-tag class="condition-tag more-tag"> +{{ (record.conditionTags ?? []).length - 4 }} </a-tag>
                </a-tooltip>
              </div>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusTagColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'taskTime'">
              <div class="time-cell">
                <div>创建：{{ record.createTime }}</div>
                <div>结束：{{ record.endTime || '-' }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'operation'">
              <div class="operation-cell">
                <a-button type="link" class="link-btn" @click="goToDetail(record)"> 详情 </a-button>
                <a-button
                  type="link"
                  class="link-btn"
                  :disabled="!isFinishedStatus(record.status)"
                  @click="handleRetry(record)"
                >
                  重新溯源
                </a-button>
                <a-button
                  type="link"
                  class="link-btn"
                  :disabled="!isFinishedStatus(record.status)"
                  @click="handleEdit(record)"
                >
                  编辑
                </a-button>
                <a-popconfirm
                  title="确定删除该溯源任务吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(record)"
                >
                  <a-button type="link" danger class="link-btn"> 删除 </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>

        <div class="pagination-container">
          <a-pagination
            :current="pagination.current"
            :pageSize="pagination.pageSize"
            :total="filteredTasks.length"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            :show-total="(total) => `共 ${total} 条`"
            @change="handlePageChange"
            @showSizeChange="handlePageSizeChange"
          />
        </div>
      </div>
    </a-card>

    <TraceTaskFormDrawer v-model:open="drawerOpen" :mode="drawerMode" :task="currentTask" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import TraceTaskFormDrawer from './components/TraceTaskFormDrawer.vue';
  import {
    MAX_RUNNING_TASKS,
    STATUS_OPTIONS,
    TRACE_TYPE_OPTIONS,
    buildConditionTags,
    getNextStatusAfterSubmit,
    getStatusLabel,
    getStatusTagColor,
    getTraceTypeLabel,
    readTraceTasks,
    writeTraceTasks,
    type TraceConditions,
    type TraceTask,
    type TraceType
  } from './task-store';

  interface SearchFormState {
    keyword: string;
    traceType: TraceType | undefined;
    status: TraceTask['status'] | undefined;
  }

  interface SubmitPayload {
    name: string;
    description: string;
    traceType: TraceType;
    conditions: TraceConditions;
  }

  const router = useRouter();
  const tasks = ref<TraceTask[]>(readTraceTasks());
  const drawerOpen = ref(false);
  const drawerMode = ref<'create' | 'edit'>('create');
  const currentTask = ref<TraceTask | null>(null);

  const searchForm = reactive<SearchFormState>({
    keyword: '',
    traceType: undefined,
    status: undefined
  });

  const pagination = reactive({
    current: 1,
    pageSize: 10
  });

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left'
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      key: 'description',
      width: 220
    },
    {
      title: '溯源类型',
      dataIndex: 'traceType',
      key: 'traceType',
      width: 140
    },
    {
      title: '溯源条件',
      dataIndex: 'conditionTags',
      key: 'conditionTags',
      width: 460
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      width: 120
    },
    {
      title: '任务时间',
      dataIndex: 'taskTime',
      key: 'taskTime',
      width: 260
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 260,
      fixed: 'right'
    }
  ];

  const filteredTasks = computed(() =>
    tasks.value.filter((item) => {
      const matchKeyword =
        !searchForm.keyword ||
        (item.name ?? '').includes(searchForm.keyword) ||
        (item.description ?? '').includes(searchForm.keyword);
      const matchType = !searchForm.traceType || item.traceType === searchForm.traceType;
      const matchStatus = !searchForm.status || item.status === searchForm.status;
      return matchKeyword && matchType && matchStatus;
    })
  );

  const paginatedTasks = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTasks.value.slice(start, end);
  });

  const runningCount = computed(() => tasks.value.filter((item) => item.status === 'running').length);
  const pendingCount = computed(() => tasks.value.filter((item) => item.status === 'pending').length);
  const finishedCount = computed(() => tasks.value.filter((item) => item.status === 'success').length);
  const failedCount = computed(() => tasks.value.filter((item) => item.status === 'failed').length);

  const isFinishedStatus = (status: TraceTask['status']) => status === 'success' || status === 'failed';

  const persistTasks = (nextTasks: TraceTask[]) => {
    tasks.value = writeTraceTasks(nextTasks);
  };

  const handleSearch = () => {
    pagination.current = 1;
  };

  const handleReset = () => {
    searchForm.keyword = '';
    searchForm.traceType = undefined;
    searchForm.status = undefined;
    pagination.current = 1;
  };

  const handlePageChange = (page: number) => {
    pagination.current = page;
  };

  const handlePageSizeChange = (_current: number, size: number) => {
    pagination.current = 1;
    pagination.pageSize = size;
  };

  const openCreateDrawer = () => {
    drawerMode.value = 'create';
    currentTask.value = null;
    drawerOpen.value = true;
  };

  const handleEdit = (task: TraceTask) => {
    if (!isFinishedStatus(task.status)) return;
    drawerMode.value = 'edit';
    currentTask.value = { ...task };
    drawerOpen.value = true;
  };

  const buildRuntimeMessage = (status: TraceTask['status']) =>
    status === 'running' ? '任务已进入执行中' : '当前并行上限已满，任务已加入待开始队列';

  const handleSubmit = (payload: SubmitPayload) => {
    const nextStatus = getNextStatusAfterSubmit(tasks.value, currentTask.value?.id);
    const now = new Date().toLocaleString('sv-SE').replace('T', ' ');

    if (drawerMode.value === 'create') {
      const newTask: TraceTask = {
        id: `trace-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        traceType: payload.traceType,
        status: nextStatus,
        conditions: payload.conditions,
        conditionTags: buildConditionTags({
          traceType: payload.traceType,
          conditions: payload.conditions
        }),
        createTime: now,
        endTime: '',
        updateTime: now
      };
      persistTasks([newTask, ...tasks.value]);
      message.success(`创建成功，${buildRuntimeMessage(nextStatus)}`);
    } else if (currentTask.value) {
      const nextTasks = tasks.value.map((item) => {
        if (item.id !== currentTask.value?.id) return item;
        return {
          ...item,
          name: payload.name,
          description: payload.description,
          traceType: payload.traceType,
          status: nextStatus,
          conditions: payload.conditions,
          conditionTags: buildConditionTags({
            traceType: payload.traceType,
            conditions: payload.conditions
          }),
          endTime: '',
          updateTime: now
        };
      });
      persistTasks(nextTasks);
      message.success(`保存成功，${buildRuntimeMessage(nextStatus)}`);
    }

    drawerOpen.value = false;
  };

  const handleRetry = (task: TraceTask) => {
    if (!isFinishedStatus(task.status)) return;

    Modal.confirm({
      title: '重新溯源',
      content: '将基于该任务最新条件重新发起溯源，历史溯源结果会被清空。',
      onOk: () => {
        const nextStatus = getNextStatusAfterSubmit(tasks.value, task.id);
        const now = new Date().toLocaleString('sv-SE').replace('T', ' ');
        const nextTasks = tasks.value.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: nextStatus,
                endTime: '',
                updateTime: now
              }
            : item
        );
        persistTasks(nextTasks);
        message.success(`已重新发起溯源，${buildRuntimeMessage(nextStatus)}`);
      }
    });
  };

  const handleDelete = (task: TraceTask) => {
    const nextTasks = tasks.value.filter((item) => item.id !== task.id);
    persistTasks(nextTasks);

    if (
      paginatedTasks.value.length === 1 &&
      pagination.current > 1 &&
      nextTasks.length <= (pagination.current - 1) * pagination.pageSize
    ) {
      pagination.current -= 1;
    }

    message.success('删除成功');
  };

  const goToDetail = (task: TraceTask) => {
    router.push(`/trace-task/detail/${task.id}`);
  };
</script>

<style lang="less" scoped>
  .trace-task-container {
    padding: 20px;
    height: 100%;

    .statistics-section {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .stat-card {
      padding: 16px 20px;
      border-radius: 8px;
      background: var(--color-bg-page);
    }

    .stat-label {
      margin-bottom: 8px;
      color: var(--color-text-secondary);
      font-size: 12px;
    }

    .stat-value {
      color: var(--color-text-primarys);
      font-size: 28px;
      font-weight: 700;
      line-height: 1;

      &.running {
        color: var(--color-brand-normal);
      }

      &.pending {
        color: #fa8c16;
      }
    }

    .search-section {
      margin-bottom: 16px;
    }

    .action-section {
      margin-bottom: 16px;
    }

    .action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .right-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .summary-text {
      color: var(--color-text-secondary);
      font-size: 12px;
    }

    .name-cell {
      color: var(--color-brand-normal);
      font-weight: 500;
    }

    .ellipsis-text {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 0;
    }

    .condition-tag {
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .more-tag {
      cursor: pointer;
    }

    .time-cell {
      color: var(--color-text-secondary);
      line-height: 1.8;
    }

    .operation-cell {
      display: flex;
      align-items: center;
    }

    .link-btn {
      padding: 0;
      margin-right: 12px;

      &:last-child {
        margin-right: 0;
      }
    }

    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
