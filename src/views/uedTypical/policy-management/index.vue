<template>
  <div class="policy-management-container">
    <a-card :body-style="{ padding: '0 0 16px' }" style="height: 100%">
      <a-tabs v-model:active-key="activeRuleTab" class="rule-tabs">
        <a-tab-pane key="security" tab="安全规则" />
        <a-tab-pane key="behavior" tab="异常行为" />
      </a-tabs>

      <template v-if="activeRuleTab === 'security'">
        <div class="search-section">
          <a-form layout="inline" :model="searchForm" class="search-form">
            <a-form-item label="规则名称">
              <a-input
                v-model:value="searchForm.name"
                allow-clear
                placeholder="请输入规则名称"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item label="严重等级">
              <a-select
                v-model:value="searchForm.severity"
                :options="severityOptions"
                allow-clear
                placeholder="请选择严重等级"
                style="width: 160px"
              />
            </a-form-item>
            <a-form-item label="启用状态">
              <a-select
                v-model:value="searchForm.enabled"
                :options="enabledOptions"
                allow-clear
                placeholder="请选择状态"
                style="width: 160px"
              />
            </a-form-item>
            <template v-if="filterExpanded">
              <a-form-item label="来源">
                <a-select
                  v-model:value="searchForm.source"
                  :options="sourceOptions"
                  allow-clear
                  placeholder="请选择来源"
                  style="width: 160px"
                />
              </a-form-item>
              <a-form-item label="类型">
                <a-select
                  v-model:value="searchForm.type"
                  :options="typeOptions"
                  allow-clear
                  placeholder="请选择类型"
                  style="width: 160px"
                />
              </a-form-item>
              <a-form-item label="OWASP">
                <a-select
                  v-model:value="searchForm.owasp"
                  :options="owaspOptions"
                  allow-clear
                  placeholder="请选择 OWASP"
                  style="width: 220px"
                />
              </a-form-item>
            </template>
            <a-form-item class="search-actions">
              <a-space>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="link" class="expand-btn" @click="filterExpanded = !filterExpanded">
                  {{ filterExpanded ? '收起' : '展开' }}
                  <UpOutlined v-if="filterExpanded" />
                  <DownOutlined v-else />
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>

        <a-table
          class="policy-table"
          :columns="columns"
          :data-source="pagedRows"
          :row-selection="rowSelection"
          :pagination="false"
          :loading="loading"
          row-key="id"
          size="middle"
          :scroll="{ x: 1400 }"
          table-layout="fixed"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'severity'">
              <span :class="['severity-text', `severity-text--${record.severity}`]">{{ record.severity }}</span>
            </template>

            <template v-else-if="column.key === 'name'">
              <span class="rule-name">{{ record.name }}</span>
            </template>

            <template v-else-if="column.key === 'owasp'">
              <a-tag v-if="record.owasp" class="owasp-tag" color="orange">{{ record.owasp }}</a-tag>
              <span v-else>-</span>
            </template>

            <template v-else-if="column.key === 'exploitation'">
              <a-tooltip v-if="record.exploitation" :title="record.exploitation">
                <span class="text-ellipsis">{{ record.exploitation }}</span>
              </a-tooltip>
              <span v-else>-</span>
            </template>

            <template v-else-if="column.key === 'remediation'">
              <a-tooltip v-if="record.remediation" :title="record.remediation">
                <span class="text-ellipsis">{{ record.remediation }}</span>
              </a-tooltip>
              <span v-else>-</span>
            </template>

            <template v-else-if="column.key === 'enabled'">
              <a-switch
                :checked="record.enabled"
                checked-children="开"
                un-checked-children="关"
                size="small"
                @change="(checked: boolean) => handleToggleEnabled(record, checked)"
              />
            </template>

            <template v-else-if="column.key === 'operation'">
              <a-space :size="0">
                <a-button type="link" size="small" @click="handleEdit(record)">修改</a-button>
                <a-popconfirm
                  title="确定删除该规则吗？"
                  :disabled="record.source === '系统内置'"
                  @confirm="handleDelete(record)"
                >
                  <a-button
                    type="link"
                    size="small"
                    :class="{ 'delete-disabled': record.source === '系统内置' }"
                    :disabled="record.source === '系统内置'"
                  >
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>

        <div class="table-footer">
          <a-pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :show-size-changer="false"
            :show-total="(total: number) => `总共 ${total} 个`"
            @change="handlePageChange"
          />
        </div>
      </template>

      <div v-else class="behavior-empty">
        <a-empty description="异常行为规则（演示占位）" />
      </div>
    </a-card>

    <PolicyFormModal v-model:open="formOpen" :record="editingRecord" @success="handleFormSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import PolicyFormModal from './components/PolicyFormModal.vue';
  import {
    enabledOptions,
    getPolicyRows,
    mockPolicyTotal,
    owaspOptions,
    severityOptions,
    sourceOptions,
    typeOptions
  } from './mock';
  import type { PolicyFilter, PolicyRow, PolicyRuleTab } from './types';

  const loading = ref(false);
  const filterExpanded = ref(true);
  const formOpen = ref(false);
  const editingRecord = ref<PolicyRow | null>(null);
  const selectedRowKeys = ref<string[]>([]);
  const activeRuleTab = ref<PolicyRuleTab>('security');
  const policyRows = ref<PolicyRow[]>([...getPolicyRows()]);

  const searchForm = reactive<PolicyFilter>({
    name: undefined,
    enabled: undefined,
    severity: undefined,
    source: undefined,
    type: undefined,
    owasp: undefined
  });

  const appliedFilter = ref<PolicyFilter>({});

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: mockPolicyTotal
  });

  const filteredRows = computed(() => {
    const f = appliedFilter.value;
    return policyRows.value.filter((row) => {
      if (f.name && !row.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (f.severity && row.severity !== f.severity) return false;
      if (f.enabled === 'enabled' && !row.enabled) return false;
      if (f.enabled === 'disabled' && row.enabled) return false;
      if (f.source && row.source !== f.source) return false;
      if (f.type && row.type !== f.type) return false;
      if (f.owasp && row.owasp !== f.owasp) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const columns: TableColumnType<PolicyRow>[] = [
    { title: '严重等级', dataIndex: 'severity', key: 'severity', width: 80, align: 'center' },
    { title: '规则名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
    { title: 'OWASP TOP 10', dataIndex: 'owasp', key: 'owasp', width: 220, ellipsis: true },
    { title: '可被利用方式', dataIndex: 'exploitation', key: 'exploitation', width: 220, ellipsis: true },
    { title: '修复建议', dataIndex: 'remediation', key: 'remediation', width: 260, ellipsis: true },
    { title: '状态', dataIndex: 'enabled', key: 'enabled', width: 80, align: 'center' },
    { title: '操作', key: 'operation', width: 100, fixed: 'right', align: 'center' }
  ];

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[]) => {
      selectedRowKeys.value = keys as string[];
    }
  }));

  watch(filteredRows, (rows) => {
    pagination.total = rows.length > getPolicyRows().length ? mockPolicyTotal : rows.length;
    if ((pagination.current - 1) * pagination.pageSize >= rows.length && rows.length > 0) {
      pagination.current = 1;
    }
  });

  function handleSearch() {
    appliedFilter.value = {
      name: searchForm.name,
      enabled: searchForm.enabled,
      severity: searchForm.severity,
      source: searchForm.source,
      type: searchForm.type,
      owasp: searchForm.owasp
    };
    pagination.current = 1;
    selectedRowKeys.value = [];
  }

  function handleReset() {
    searchForm.name = undefined;
    searchForm.enabled = undefined;
    searchForm.severity = undefined;
    searchForm.source = undefined;
    searchForm.type = undefined;
    searchForm.owasp = undefined;
    appliedFilter.value = {};
    pagination.current = 1;
    selectedRowKeys.value = [];
  }

  function handlePageChange() {
    selectedRowKeys.value = [];
  }

  function handleEdit(record: PolicyRow) {
    editingRecord.value = record;
    formOpen.value = true;
  }

  function handleFormSuccess(payload: Partial<PolicyRow> & { name: string }) {
    if (payload.id) {
      const index = policyRows.value.findIndex((item) => item.id === payload.id);
      if (index >= 0) {
        policyRows.value[index] = { ...policyRows.value[index], ...payload } as PolicyRow;
      }
      return;
    }
    policyRows.value.unshift({
      id: `p-${Date.now()}`,
      name: payload.name,
      severity: payload.severity || '中',
      enabled: payload.enabled ?? true,
      remediation: payload.remediation || '',
      exploitation: payload.exploitation || '',
      designConcept: payload.designConcept || '',
      source: '用户添加',
      type: payload.type || 'Web安全缺陷',
      owasp: payload.owasp || 'API8:2023 安全配置错误'
    });
  }

  function handleToggleEnabled(record: PolicyRow, enabled: boolean) {
    record.enabled = enabled;
    message.success(enabled ? '已开启' : '已关闭');
  }

  function handleDelete(record: PolicyRow) {
    policyRows.value = policyRows.value.filter((row) => row.id !== record.id);
    message.success('删除成功');
  }
</script>

<style lang="less" scoped>
  .policy-management-container {
    padding: 20px;
    height: 100%;
  }

  .rule-tabs {
    padding: 0 16px;

    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }
  }

  .search-section {
    padding: 16px 16px 0;
  }

  .search-form {
    row-gap: 12px;
  }

  .search-actions {
    margin-left: auto;
  }

  .expand-btn {
    padding-inline: 4px;
  }

  .policy-table {
    padding: 0 16px;

    :deep(.ant-table-thead > tr > th),
    :deep(.ant-table-tbody > tr > td) {
      padding: 12px 16px;
    }
  }

  .severity-text {
    font-weight: 500;

    &--高 {
      color: #ff4d4f;
    }

    &--中 {
      color: #fa8c16;
    }

    &--低 {
      color: #1677ff;
    }
  }

  .rule-name {
    color: rgba(0, 0, 0, 0.88);
    word-break: break-all;
  }

  .owasp-tag {
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
  }

  .delete-disabled {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }

  .behavior-empty {
    padding: 80px 16px;
  }
</style>
