<template>
  <div class="report-list-panel">
    <div class="report-list-panel__toolbar">
      <a-input
        v-model:value="keyword"
        allow-clear
        placeholder="按报告名称筛选"
        class="search-input"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary" @click="emit('generate')">生成报告</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredList"
      :pagination="{ pageSize: 10, showSizeChanger: false, showTotal: (t: number) => `共 ${t} 条` }"
      row-key="id"
      :scroll="{ x: 1280 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'reportName'">
          <div class="name-cell">
            <FileTextOutlined class="name-icon" />
            <span>{{ record.reportName }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'templateTag'">
          <span class="template-tag">{{ record.templateTag }}</span>
        </template>

        <template v-else-if="column.key === 'filterConditions'">
          <div class="filter-cell">
            <div v-if="record.filterApp">应用：{{ record.filterApp }}</div>
            <div v-if="record.filterApi">API：{{ record.filterApi }}</div>
            <div>时间：{{ record.filterTime }}</div>
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <div class="status-cell">
            <span :class="['status-badge', `status-badge--${statusClass(record.status)}`]">
              {{ record.status }}
            </span>
            <div v-if="record.status === '失败' && record.failReason" class="fail-reason">
              {{ record.failReason }}
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space :size="0" wrap>
            <a-button
              type="link"
              size="small"
              :disabled="record.status !== '成功'"
              @click="emit('preview', record)"
            >
              在线预览
            </a-button>
            <a-dropdown :disabled="record.status !== '成功'">
              <a-button type="link" size="small" :disabled="record.status !== '成功'">
                导出
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="({ key }) => emit('export', record, String(key))">
                  <a-menu-item key="word">WORD</a-menu-item>
                  <a-menu-item key="html">HTML</a-menu-item>
                  <a-menu-item key="pdf">PDF</a-menu-item>
                  <a-menu-item key="png">PNG</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { DownOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { Modal, message } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { reportHistoryList } from '../mock';
  import type { ReportHistoryItem, ReportListStatus } from '../types';

  const emit = defineEmits<{
    generate: [];
    preview: [record: ReportHistoryItem];
    export: [record: ReportHistoryItem, format: string];
    delete: [record: ReportHistoryItem];
  }>();

  const keyword = ref('');
  const list = ref<ReportHistoryItem[]>([...reportHistoryList]);

  const columns = [
    { title: '报告名称', dataIndex: 'reportName', key: 'reportName', width: 200, ellipsis: true },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 160, ellipsis: true },
    { title: '报告模板', dataIndex: 'templateTag', key: 'templateTag', width: 150 },
    { title: '筛选条件', dataIndex: 'filterConditions', key: 'filterConditions', width: 220 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
    { title: '操作', key: 'action', width: 220, fixed: 'right' as const }
  ];

  const filteredList = computed(() => {
    const q = keyword.value.trim().toLowerCase();
    if (!q) return list.value;
    return list.value.filter((item) => item.reportName.toLowerCase().includes(q));
  });

  function statusClass(status: ReportListStatus) {
    if (status === '成功') return 'success';
    if (status === '生成中') return 'processing';
    if (status === '失败') return 'error';
    return 'default';
  }

  function handleDelete(record: ReportHistoryItem) {
    Modal.confirm({
      title: '确认删除该报告？',
      content: `删除后不可恢复：${record.reportName}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        list.value = list.value.filter((item) => item.id !== record.id);
        emit('delete', record);
        message.success('报告已删除');
      }
    });
  }

  function prependReport(record: ReportHistoryItem) {
    list.value = [record, ...list.value];
  }

  defineExpose({ prependReport });
</script>

<style lang="less" scoped>
  .report-list-panel__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .search-input {
    width: 280px;
  }

  .name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1f2a44;
  }

  .name-icon {
    color: #8c9ab5;
    font-size: 15px;
  }

  .template-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #1677ff;
    background: #e8f3ff;
    border: 1px solid #c8e0ff;
  }

  .filter-cell {
    font-size: 12px;
    line-height: 1.6;
    color: #5c6b8a;
  }

  .status-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 52px;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 20px;

    &--success {
      color: #389e0d;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
    }

    &--processing {
      color: #d48806;
      background: #fffbe6;
      border: 1px solid #ffe58f;
    }

    &--error {
      color: #cf1322;
      background: #fff1f0;
      border: 1px solid #ffa39e;
    }

    &--default {
      color: #8c8c8c;
      background: #fafafa;
      border: 1px solid #d9d9d9;
    }
  }

  .fail-reason {
    font-size: 12px;
    color: #cf1322;
    line-height: 1.4;
  }
</style>
