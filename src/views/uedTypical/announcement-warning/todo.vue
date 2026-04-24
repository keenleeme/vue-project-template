<template>
  <div class="announcement-todo-page">
    <a-card>
      <div class="page-header">
        <div>
          <div class="page-title">我的公告待办</div>
          <div class="page-desc">按时效优先展示待已读、待回复和已超时公告，支持一键进入确认页。</div>
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <div class="summary-label">待处理总数</div>
          <div class="summary-value brand">{{ todoList.length }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">已超时</div>
          <div class="summary-value danger">{{ overdueCount }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">强制回复</div>
          <div class="summary-value warning">{{ forceReplyCount }}</div>
        </div>
      </div>

      <a-table :columns="columns" :data-source="todoList" :pagination="false" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'level'">
            <a-tag :color="getLevelTagColor(record.level)">
              {{ getLevelLabel(record.level) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'statusText'">
            <a-tag :color="record.overdue ? 'error' : 'processing'">
              {{ record.statusText }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'deadline'">
            <span :class="{ 'danger-text': record.overdue }">{{ record.deadline }}</span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space>
              <a-button type="primary" size="small" @click="handlePrimaryAction(record)">
                {{ record.actionText }}
              </a-button>
              <a-button size="small" @click="goDetail(record.id)">查看追踪</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getLevelLabel, getLevelTagColor, type TodoNoticeItem } from './mock';
  import { fetchTodoNotices } from './service';

  const router = useRouter();
  const todoList = ref<TodoNoticeItem[]>([]);

  const overdueCount = computed(() => todoList.value.filter((item) => item.overdue).length);
  const forceReplyCount = computed(() => todoList.value.filter((item) => item.forceReply).length);

  const columns = [
    { title: '公告标题', dataIndex: 'title', key: 'title' },
    { title: '预警等级', dataIndex: 'level', key: 'level', width: 120 },
    { title: '所属单位', dataIndex: 'unitName', key: 'unitName', width: 180 },
    { title: '执行状态', dataIndex: 'statusText', key: 'statusText', width: 200 },
    { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 180 },
    { title: '操作', key: 'operation', width: 220 }
  ];

  const goConfirm = (id: string) => {
    router.push(`/announcement-warning/confirm/${id}`);
  };

  const goDetail = (id: string) => {
    router.push(`/announcement-warning?id=${id}`);
  };

  const handlePrimaryAction = (record: TodoNoticeItem) => {
    if (record.actionText === '查看详情') {
      goDetail(record.id);
      return;
    }
    goConfirm(record.id);
  };

  onMounted(async () => {
    todoList.value = await fetchTodoNotices();
  });
</script>

<style lang="less" scoped>
  .announcement-todo-page {
    padding: 20px;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .page-title {
      color: var(--color-text-primary);
      font-size: 20px;
      font-weight: 600;
    }

    .page-desc {
      margin-top: 4px;
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .summary-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .summary-card {
      padding: 20px;
      border-radius: 8px;
      background: #f7f8fa;
    }

    .summary-label {
      margin-bottom: 8px;
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .summary-value {
      font-size: 28px;
      font-weight: 600;

      &.brand {
        color: #134bea;
      }

      &.danger {
        color: #f53c3c;
      }

      &.warning {
        color: #f3a700;
      }
    }

    .danger-text {
      color: #f53c3c;
    }
  }
</style>
