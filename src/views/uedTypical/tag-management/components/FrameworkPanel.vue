<template>
  <div class="framework-panel">
    <div class="framework-toolbar">
      <a-space>
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          新建框架
        </a-button>
      </a-space>

      <a-space wrap :size="8">
        <a-input
          v-model:value="searchForm.name"
          allow-clear
          placeholder="请输入框架名称"
          style="width: 200px"
          @press-enter="handleSearch"
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-select
          v-model:value="searchForm.source"
          :options="frameworkSourceOptions"
          allow-clear
          placeholder="请选择来源"
          style="width: 160px"
        />
        <a-button @click="advancedOpen = true">
          <template #icon><FilterOutlined /></template>
          高级筛选
        </a-button>
        <a-tooltip title="刷新">
          <a-button type="text" @click="handleRefresh"><ReloadOutlined /></a-button>
        </a-tooltip>
        <a-tooltip title="列设置">
          <a-button type="text"><SettingOutlined /></a-button>
        </a-tooltip>
      </a-space>
    </div>

    <a-table
      class="framework-table"
      :columns="columns"
      :data-source="pagedRows"
      :pagination="false"
      :loading="loading"
      row-key="id"
      size="middle"
      :scroll="{ x: 1100 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-button type="link" class="name-link" @click="handleConfig(record)">{{ record.name }}</a-button>
        </template>

        <template v-else-if="column.key === 'description'">
          <a-tooltip v-if="record.description" :title="record.description">
            <span class="desc-ellipsis">{{ record.description }}</span>
          </a-tooltip>
          <span v-else>-</span>
        </template>

        <template v-else-if="column.key === 'operation'">
          <a-space :size="0" wrap>
            <a-button type="link" size="small" @click="handleConfig(record)">框架配置</a-button>
            <a-button type="link" size="small" :disabled="record.source === '系统内置'" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-dropdown>
              <a-button type="link" size="small">导入</a-button>
              <template #overlay>
                <a-menu @click="({ key }) => handleImport(key as FrameworkImportType, record)">
                  <a-menu-item key="framework">导入框架分类分级</a-menu-item>
                  <a-menu-item key="dataTag">导入数据标签分类分级</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-dropdown>
              <a-button type="link" size="small">导出</a-button>
              <template #overlay>
                <a-menu @click="({ key }) => handleExport(key as FrameworkImportType, [record])">
                  <a-menu-item key="framework">导出分类分级框架</a-menu-item>
                  <a-menu-item key="dataTag">导出数据标签分类分级</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-dropdown>
              <a-button type="link" size="small">
                <EllipsisOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="({ key }) => handleMoreAction(key as string, record)">
                  <a-menu-item key="copy">复制</a-menu-item>
                  <a-menu-item key="delete" :disabled="record.source === '系统内置'">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
        :page-size-options="['10', '20', '50', '100']"
        :show-total="(total: number) => `共 ${total} 项数据`"
      />
    </div>

    <a-drawer v-model:open="advancedOpen" title="高级筛选" width="360" destroy-on-close>
      <a-form layout="vertical">
        <a-form-item label="框架名称">
          <a-input v-model:value="searchForm.name" allow-clear placeholder="请输入框架名称" />
        </a-form-item>
        <a-form-item label="来源">
          <a-select
            v-model:value="searchForm.source"
            :options="frameworkSourceOptions"
            allow-clear
            placeholder="请选择来源"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSearchAndClose">查询</a-button>
        </a-space>
      </template>
    </a-drawer>

    <FrameworkFormModal v-model:open="formOpen" :record="editingRecord" @success="handleFormSuccess" />
    <FrameworkImportModal
      v-model:open="importOpen"
      :framework-name="importFrameworkName"
      :import-type="importType"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    EllipsisOutlined,
    FilterOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    SettingOutlined
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { frameworkSourceOptions, getFrameworkRows, getFrameworkTree, getTagRows } from '../mock';
  import type { FrameworkFilter, FrameworkImportType, FrameworkRow } from '../types';
  import FrameworkFormModal from './FrameworkFormModal.vue';
  import FrameworkImportModal from './FrameworkImportModal.vue';

  const emit = defineEmits<{
    config: [record: FrameworkRow];
  }>();

  const loading = ref(false);
  const formOpen = ref(false);
  const importOpen = ref(false);
  const importFrameworkName = ref<string>();
  const importType = ref<FrameworkImportType>('framework');
  const advancedOpen = ref(false);
  const editingRecord = ref<FrameworkRow | null>(null);
  const frameworkRows = ref<FrameworkRow[]>([...getFrameworkRows()]);

  const searchForm = reactive<FrameworkFilter>({
    name: undefined,
    source: undefined
  });

  const appliedFilter = ref<FrameworkFilter>({});

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: frameworkRows.value.length
  });

  const filteredRows = computed(() => {
    const f = appliedFilter.value;
    return frameworkRows.value.filter((row) => {
      if (f.name && !row.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (f.source && row.source !== f.source) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const columns: TableColumnType<FrameworkRow>[] = [
    { title: '分类分级框架名称', dataIndex: 'name', key: 'name', width: 220 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 110 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    { title: '操作', key: 'operation', width: 280, fixed: 'right' }
  ];

  watch(filteredRows, (rows) => {
    pagination.total = rows.length;
    if ((pagination.current - 1) * pagination.pageSize >= rows.length) {
      pagination.current = 1;
    }
  });

  function handleSearch() {
    appliedFilter.value = {
      name: searchForm.name,
      source: searchForm.source
    };
    pagination.current = 1;
  }

  function handleSearchAndClose() {
    handleSearch();
    advancedOpen.value = false;
  }

  function handleReset() {
    searchForm.name = undefined;
    searchForm.source = undefined;
    appliedFilter.value = {};
    pagination.current = 1;
    advancedOpen.value = false;
  }

  function handleRefresh() {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      message.success('数据已刷新');
    }, 300);
  }

  function handleCreate() {
    editingRecord.value = null;
    formOpen.value = true;
  }

  function handleEdit(record: FrameworkRow) {
    editingRecord.value = record;
    formOpen.value = true;
  }

  function handleConfig(record: FrameworkRow) {
    emit('config', record);
  }

  function handleImport(type: FrameworkImportType, record: FrameworkRow) {
    importType.value = type;
    importFrameworkName.value = record.name;
    importOpen.value = true;
  }

  function handleImportSuccess() {
    handleRefresh();
  }

  function getExportLabel(type: FrameworkImportType) {
    return type === 'dataTag' ? '数据标签分类分级' : '分类分级框架';
  }

  function downloadJson(filename: string, data: unknown) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleExport(type: FrameworkImportType, records: FrameworkRow[]) {
    if (!records.length) return;

    records.forEach((record) => {
      const suffix = getExportLabel(type);
      const filename = `${record.name}-${suffix}.json`;
      const payload =
        type === 'dataTag'
          ? { framework: record, tags: getTagRows(record.id) }
          : { framework: record, tree: getFrameworkTree(record.id, record.name) };
      downloadJson(filename, payload);
    });

    const exportLabel = getExportLabel(type);
    if (records.length === 1) {
      message.success(`「${records[0].name}」${exportLabel}导出成功`);
      return;
    }
    message.success(`已导出 ${records.length} 个框架的${exportLabel}`);
  }

  function handleMoreAction(key: string, record: FrameworkRow) {
    if (key === 'copy') {
      message.success(`已复制框架：${record.name}`);
      return;
    }
    if (key === 'delete') {
      frameworkRows.value = frameworkRows.value.filter((row) => row.id !== record.id);
      message.success('删除成功');
    }
  }

  function handleFormSuccess(payload: Partial<FrameworkRow> & { name: string }) {
    if (payload.id) {
      const index = frameworkRows.value.findIndex((item) => item.id === payload.id);
      if (index >= 0) {
        frameworkRows.value[index] = { ...frameworkRows.value[index], ...payload } as FrameworkRow;
      }
      return;
    }
    frameworkRows.value.unshift({
      id: `f-${Date.now()}`,
      name: payload.name,
      source: '自定义',
      description: payload.description || '',
      createdAt: payload.createdAt || '',
      updatedAt: payload.updatedAt || ''
    });
  }
</script>

<style lang="less" scoped>
  .framework-panel {
    padding-top: 4px;
  }

  .framework-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    flex-wrap: wrap;
  }

  .framework-table {
    padding: 0 16px;
  }

  .name-link {
    padding: 0;
    height: auto;
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
