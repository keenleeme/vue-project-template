<template>
  <div class="tag-management-container">
    <a-card :body-style="{ padding: '0 0 16px' }" style="height: 100%">
      <div class="page-tabs-wrap">
        <a-tabs v-model:active-key="activeTab" class="page-tabs" @change="handleTabChange">
          <a-tab-pane key="data" tab="数据标签" />
          <a-tab-pane key="framework" tab="分类分级框架" />
        </a-tabs>
      </div>

      <template v-if="activeTab === 'data'">
        <div class="framework-switch-bar">
          <a-form layout="inline" class="framework-switch-form">
            <a-form-item label="分类分级框架">
              <a-select
                v-model:value="activeFrameworkId"
                :options="frameworkOptions"
                style="width: 280px"
                @change="handleFrameworkChange"
              />
            </a-form-item>
          </a-form>
        </div>

        <div class="search-section">
          <a-form layout="inline" :model="searchForm" class="search-form">
            <a-form-item label="标签名称">
              <a-input
                v-model:value="searchForm.name"
                allow-clear
                placeholder="请输入标签名称"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item label="分类">
              <a-select
                v-model:value="searchForm.category"
                :options="currentCategoryOptions"
                allow-clear
                placeholder="请选择分类"
                style="width: 200px"
              />
            </a-form-item>
            <a-form-item label="分级">
              <a-select
                v-model:value="searchForm.level"
                :options="currentLevelOptions"
                allow-clear
                placeholder="请选择分级"
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
                  style="width: 180px"
                />
              </a-form-item>
              <a-form-item label="启用状态">
                <a-select
                  v-model:value="searchForm.enabled"
                  :options="enabledOptions"
                  allow-clear
                  placeholder="请选择状态"
                  style="width: 180px"
                />
              </a-form-item>
              <a-form-item label="是否敏感">
                <a-select
                  v-model:value="searchForm.sensitive"
                  :options="sensitiveOptions"
                  allow-clear
                  placeholder="请选择是否敏感"
                  style="width: 180px"
                />
              </a-form-item>
            </template>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
                <a-button type="link" class="expand-btn" @click="filterExpanded = !filterExpanded">
                  {{ filterExpanded ? '收起' : '展开' }}
                  <DownOutlined v-if="!filterExpanded" />
                  <UpOutlined v-else />
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>

        <div class="toolbar">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon><PlusOutlined /></template>
              新增
            </a-button>
            <a-button :disabled="!selectedRowKeys.length" @click="handleBatchEnable(true)">启用选中项</a-button>
            <a-button :disabled="!selectedRowKeys.length" @click="handleBatchEnable(false)">禁用选中项</a-button>
            <a-popconfirm title="确定删除选中的标签吗？" :disabled="!selectedRowKeys.length" @confirm="handleBatchDelete">
              <a-button danger :disabled="!selectedRowKeys.length">删除</a-button>
            </a-popconfirm>
          </a-space>
          <a-space :size="4">
            <a-tooltip title="分享">
              <a-button type="text"><ShareAltOutlined /></a-button>
            </a-tooltip>
            <a-tooltip title="刷新">
              <a-button type="text" @click="handleRefresh"><ReloadOutlined /></a-button>
            </a-tooltip>
            <a-tooltip title="列设置">
              <a-button type="text"><SettingOutlined /></a-button>
            </a-tooltip>
          </a-space>
        </div>

        <a-table
          class="tag-table"
          :columns="columns"
          :data-source="pagedRows"
          :row-selection="rowSelection"
          :pagination="false"
          :loading="loading"
          row-key="id"
          size="middle"
          :scroll="{ x: 1040 }"
          :table-layout="'fixed'"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'enabled'">
              <a-switch
                :checked="record.enabled"
                checked-children="启用"
                un-checked-children="禁用"
                @change="(checked: boolean) => handleToggleEnabled(record, checked)"
              />
            </template>

            <template v-else-if="column.key === 'description'">
              <a-tooltip v-if="record.description && record.description !== '-'" :title="record.description">
                <span class="desc-ellipsis">{{ record.description }}</span>
              </a-tooltip>
              <span v-else>-</span>
            </template>

            <template v-else-if="column.key === 'sensitive'">
              <a-tag :color="sensitiveColor(record.sensitive)">{{ record.sensitive }}</a-tag>
            </template>

            <template v-else-if="column.key === 'source'">
              <a-tag :color="sourceColor(record.source)">{{ record.source }}</a-tag>
            </template>

            <template v-else-if="column.key === 'operation'">
              <a-space :size="0">
                <a-button type="link" size="small" @click="handleEdit(record)">修改</a-button>
                <a-popconfirm
                  title="确定删除该标签吗？"
                  :disabled="record.source === '系统内置'"
                  @confirm="handleDelete(record)"
                >
                  <a-button type="link" size="small" danger :disabled="record.source === '系统内置'">删除</a-button>
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
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
            :show-total="(total: number) => `共 ${total} 条`"
            @change="handlePageChange"
          />
        </div>
      </template>

      <FrameworkPanel v-else @config="handleFrameworkConfig" />
    </a-card>

    <TagFormModal
      v-model:open="formOpen"
      :record="editingRecord"
      :category-options="currentCategoryOptions"
      :level-options="currentLevelOptions"
      @success="handleFormSuccess"
    />
    <FrameworkConfigDrawer v-model:open="frameworkConfigOpen" :record="frameworkConfigRecord" />
  </div>
</template>

<script setup lang="ts">
  import {
    DownOutlined,
    PlusOutlined,
    ReloadOutlined,
    SettingOutlined,
    ShareAltOutlined,
    UpOutlined
  } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import FrameworkPanel from './components/FrameworkPanel.vue';
  import FrameworkConfigDrawer from './components/FrameworkConfigDrawer.vue';
  import TagFormModal from './components/TagFormModal.vue';
  import {
    deriveTagSensitive,
    getFrameworkOptions,
    getFrameworkTagOptions,
    getTagRows
  } from './mock';
  import type { FrameworkRow, TagFilter, TagRow, TagTabKey } from './types';

  const activeTab = ref<TagTabKey>('data');
  const activeFrameworkId = ref('f3');
  const previousFrameworkId = ref('f3');
  const filterExpanded = ref(false);
  const loading = ref(false);
  const formOpen = ref(false);
  const frameworkConfigOpen = ref(false);
  const frameworkConfigRecord = ref<FrameworkRow | null>(null);
  const editingRecord = ref<TagRow | null>(null);
  const selectedRowKeys = ref<string[]>([]);

  const dataRows = ref<TagRow[]>([...getTagRows(activeFrameworkId.value)]);

  const frameworkOptions = getFrameworkOptions();
  const currentTagOptions = computed(() => getFrameworkTagOptions(activeFrameworkId.value));
  const currentCategoryOptions = computed(() => currentTagOptions.value.categoryOptions);
  const currentLevelOptions = computed(() => currentTagOptions.value.levelOptions);
  const searchForm = reactive<TagFilter & { source?: string; enabled?: string }>({
    name: undefined,
    category: undefined,
    level: undefined,
    source: undefined,
    enabled: undefined,
    sensitive: undefined
  });

  const appliedFilter = ref<TagFilter & { source?: string; enabled?: string }>({});

  const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: getTagRows(activeFrameworkId.value).length
  });

  const sourceOptions = [
    { label: '用户添加', value: '用户添加' },
    { label: '系统内置', value: '系统内置' }
  ];

  const enabledOptions = [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' }
  ];

  const sensitiveOptions = [
    { label: '是', value: '是' },
    { label: '否', value: '否' },
    { label: '未知', value: '未知' }
  ];

  const filteredRows = computed(() => {
    const f = appliedFilter.value;
    return dataRows.value.filter((row) => {
      if (f.name && !row.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (f.category && row.category !== f.category) return false;
      if (f.level && row.level !== f.level) return false;
      if (f.source && row.source !== f.source) return false;
      if (f.enabled === 'enabled' && !row.enabled) return false;
      if (f.enabled === 'disabled' && row.enabled) return false;
      if (f.sensitive && row.sensitive !== f.sensitive) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const columns: TableColumnType<TagRow>[] = [
    { title: '标签名称', dataIndex: 'name', key: 'name', width: 132, ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', width: 168, ellipsis: true },
    { title: '分级', dataIndex: 'level', key: 'level', width: 108 },
    { title: '敏感', dataIndex: 'sensitive', key: 'sensitive', width: 72, align: 'center' },
    { title: '描述', dataIndex: 'description', key: 'description', width: 220, ellipsis: true },
    { title: '来源', dataIndex: 'source', key: 'source', width: 96 },
    { title: '启用', dataIndex: 'enabled', key: 'enabled', width: 88, align: 'center', fixed: 'right' },
    { title: '操作', key: 'operation', width: 108, fixed: 'right', align: 'center' }
  ];

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[]) => {
      selectedRowKeys.value = keys as string[];
    }
  }));

  watch(filteredRows, (rows) => {
    pagination.total = rows.length;
    if ((pagination.current - 1) * pagination.pageSize >= rows.length) {
      pagination.current = 1;
    }
  });

  function loadFrameworkTags(frameworkId: string) {
    dataRows.value = [...getTagRows(frameworkId)];
    selectedRowKeys.value = [];
    pagination.current = 1;
    pagination.total = dataRows.value.length;
    appliedFilter.value = {};
    Object.assign(searchForm, {
      name: undefined,
      category: undefined,
      level: undefined,
      source: undefined,
      enabled: undefined,
      sensitive: undefined
    });
    activeFrameworkId.value = frameworkId;
    previousFrameworkId.value = frameworkId;
  }

  function handleFrameworkChange(frameworkId: string) {
    if (frameworkId === previousFrameworkId.value) return;

    const frameworkName =
      frameworkOptions.find((item) => item.value === frameworkId)?.label || '该';

    Modal.confirm({
      title: `确认启用${frameworkName}分类分级框架吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        loadFrameworkTags(frameworkId);
      },
      onCancel() {
        activeFrameworkId.value = previousFrameworkId.value;
      }
    });
  }

  function sourceColor(source: string) {
    if (source === '系统内置') return 'blue';
    return 'default';
  }

  function sensitiveColor(sensitive: TagRow['sensitive']) {
    if (sensitive === '是') return 'red';
    if (sensitive === '未知') return 'orange';
    return 'default';
  }

  function handleTabChange() {
    selectedRowKeys.value = [];
    pagination.current = 1;
    if (activeTab.value === 'data') {
      loadFrameworkTags(activeFrameworkId.value);
    }
  }

  function handleSearch() {
    appliedFilter.value = {
      name: searchForm.name,
      category: searchForm.category,
      level: searchForm.level,
      source: searchForm.source,
      enabled: searchForm.enabled,
      sensitive: searchForm.sensitive
    };
    pagination.current = 1;
    selectedRowKeys.value = [];
  }

  function handleReset() {
    Object.assign(searchForm, {
      name: undefined,
      category: undefined,
      level: undefined,
      source: undefined,
      enabled: undefined,
      sensitive: undefined
    });
    appliedFilter.value = {};
    pagination.current = 1;
    selectedRowKeys.value = [];
  }

  function handlePageChange() {
    selectedRowKeys.value = [];
  }

  function handleRefresh() {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      message.success('数据已刷新');
    }, 300);
  }

  function handleAdd() {
    editingRecord.value = null;
    formOpen.value = true;
  }

  function handleEdit(record: TagRow) {
    editingRecord.value = record;
    formOpen.value = true;
  }

  function handleFormSuccess(payload: Partial<TagRow> & { name: string }) {
    if (payload.id) {
      const index = dataRows.value.findIndex((item) => item.id === payload.id);
      if (index >= 0) {
        dataRows.value[index] = { ...dataRows.value[index], ...payload } as TagRow;
      }
      return;
    }
    dataRows.value.unshift({
      id: `data-${Date.now()}`,
      name: payload.name,
      enabled: payload.enabled ?? true,
      category: payload.category || '未分级',
      level: payload.level || '未分级',
      sensitive: payload.sensitive || deriveTagSensitive(payload.level || '未分级'),
      description: payload.description || '-',
      source: '用户添加',
      frameworkId: activeFrameworkId.value
    });
  }

  function handleToggleEnabled(record: TagRow, enabled: boolean) {
    record.enabled = enabled;
    message.success(enabled ? '已启用' : '已禁用');
  }

  function handleBatchEnable(enabled: boolean) {
    dataRows.value.forEach((row) => {
      if (selectedRowKeys.value.includes(row.id)) {
        row.enabled = enabled;
      }
    });
    message.success(enabled ? '已批量启用' : '已批量禁用');
    selectedRowKeys.value = [];
  }

  function handleBatchDelete() {
    dataRows.value = dataRows.value.filter(
      (row) => !selectedRowKeys.value.includes(row.id) || row.source === '系统内置'
    );
    selectedRowKeys.value = [];
    message.success('删除成功');
  }

  function handleDelete(record: TagRow) {
    dataRows.value = dataRows.value.filter((row) => row.id !== record.id);
    message.success('删除成功');
  }

  function handleFrameworkConfig(record: FrameworkRow) {
    frameworkConfigRecord.value = record;
    frameworkConfigOpen.value = true;
  }
</script>

<style lang="less" scoped>
  .tag-management-container {
    padding: 20px;
    height: 100%;
  }

  .page-tabs-wrap {
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .page-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }
  }

  .framework-switch-bar {
    padding: 16px 16px 0;
  }

  .framework-switch-form {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }
  }

  .search-section {
    padding: 12px 16px 0;
  }

  .search-form {
    row-gap: 12px;
  }

  .expand-btn {
    padding-inline: 4px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }

  .tag-table {
    padding: 0 16px;
  }

  .desc-ellipsis {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }
</style>
