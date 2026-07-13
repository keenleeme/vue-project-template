<template>
  <div class="api-defect-list-container">
    <a-card :body-style="{ padding: 0 }" style="height: 100%">
      <div class="page-layout">
        <aside class="category-sidebar">
          <div class="category-sidebar__inner">
            <template v-for="group in defectCategoryTree" :key="group.key">
              <div
                v-if="!group.children?.length"
                class="category-item category-item--root"
                :class="{ 'category-item--active': activeCategory === group.key }"
                @click="handleCategorySelect(group.key)"
              >
                <span class="category-item__title">{{ group.title }}</span>
                <span v-if="group.count != null" class="category-item__count">({{ group.count }})</span>
              </div>

              <div v-else class="category-group">
                <div class="category-group__head" @click="toggleGroup(group.key)">
                  <CaretDownOutlined v-if="expandedGroups.has(group.key)" class="category-group__icon" />
                  <CaretRightOutlined v-else class="category-group__icon" />
                  <FolderOutlined class="category-group__folder" />
                  <span class="category-group__title">{{ group.title }}</span>
                </div>
                <div v-show="expandedGroups.has(group.key)" class="category-group__children">
                  <div
                    v-for="child in group.children"
                    :key="child.key"
                    class="category-item"
                    :class="{ 'category-item--active': activeCategory === child.key }"
                    @click="handleCategorySelect(child.key)"
                  >
                    <span class="category-item__title">{{ child.title }}</span>
                    <span v-if="child.count != null" class="category-item__count">({{ child.count }})</span>
                    <a-tag v-if="child.badge" color="pink" class="category-item__badge">{{ child.badge }}</a-tag>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </aside>

        <div class="main-panel">
          <div class="filter-bar">
            <div class="filter-bar__tags">
              <span class="filter-bar__label">筛选条件:</span>
              <template v-if="activeFilterTags.length">
                <a-tag
                  v-for="tag in activeFilterTags"
                  :key="tag.key"
                  closable
                  class="filter-tag"
                  @close="handleRemoveFilterTag(tag.key)"
                >
                  {{ tag.label }}
                </a-tag>
              </template>
              <span v-else class="filter-bar__empty">暂无筛选条件</span>
            </div>
            <div class="filter-bar__actions">
              <a-button type="primary" @click="filterOpen = true">筛选条件</a-button>
              <a-button @click="chartExpanded = !chartExpanded">
                {{ chartExpanded ? '隐藏图表' : '显示图表' }}
              </a-button>
            </div>
          </div>

          <div v-if="chartExpanded" class="chart-section">
            <a-row :gutter="12">
              <a-col :span="8">
                <div class="mini-chart-card">
                  <div class="mini-chart-card__title">严重等级分布</div>
                  <div ref="severityChartRef" class="mini-chart-card__box"></div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="mini-chart-card">
                  <div class="mini-chart-card__title">缺陷类型分布</div>
                  <div ref="typeChartRef" class="mini-chart-card__box"></div>
                </div>
              </a-col>
              <a-col :span="8">
                <div class="mini-chart-card">
                  <div class="mini-chart-card__title">AI 研判结果分布</div>
                  <div ref="aiChartRef" class="mini-chart-card__box"></div>
                </div>
              </a-col>
            </a-row>
          </div>

          <div class="toolbar">
            <a-button :disabled="!selectedRowKeys.length" @click="handleBatchProcess">处理选中项</a-button>
            <a-space :size="4">
              <a-tooltip title="导出">
                <a-button type="text" @click="handleExport"><DownloadOutlined /></a-button>
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
            class="defect-table"
            :columns="columns"
            :data-source="pagedRows"
            :row-selection="rowSelection"
            :pagination="false"
            :loading="loading"
            row-key="id"
            size="middle"
            :scroll="{ x: 1600 }"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'aiInterpretation'">
                <AiColumnLabel label="AI研判" />
              </template>
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'time'">
                <div class="time-cell">
                  <div>发现时间: {{ record.discoveredAt }}</div>
                  <div>活跃时间: {{ record.activeAt }}</div>
                </div>
              </template>

              <template v-else-if="column.key === 'severity'">
                <a-tag :color="severityColor(record.severity)">{{ record.severity }}</a-tag>
              </template>

              <template v-else-if="column.key === 'defectName'">
                <span class="defect-name">{{ record.defectName }}</span>
              </template>

              <template v-else-if="column.key === 'aiInterpretation'">
                <span class="ai-verdict-cell">
                  <span :class="aiVerdictClass(record.aiVerdict)">{{ record.aiVerdict }}</span>
                  <a-tooltip title="AI研判">
                    <a-button
                      type="text"
                      size="small"
                      class="ai-judgment-icon-btn"
                      @click.stop="handleAiJudgment(record)"
                    >
                      <RobotOutlined />
                    </a-button>
                  </a-tooltip>
                </span>
              </template>

              <template v-else-if="column.key === 'apiInfo'">
                <div class="api-info-cell">
                  <div class="api-info-cell__path">
                    <a-tag :color="methodColor(record.method)" class="method-tag">{{ record.method }}</a-tag>
                    <a-tooltip :title="record.path">
                      <span class="api-path">{{ record.path }}</span>
                    </a-tooltip>
                  </div>
                  <div class="api-info-cell__app">应用信息: {{ record.appInfo }}</div>
                </div>
              </template>

              <template v-else-if="column.key === 'accessDomain'">
                <a-tag>{{ record.accessDomain }}</a-tag>
              </template>

              <template v-else-if="column.key === 'deployDomain'">
                <a-tag>{{ record.deployDomain }}</a-tag>
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space :size="0">
                  <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
                  <a-badge :dot="record.hasPendingAction">
                    <a-button type="link" size="small" @click="handleProcess(record)">处理</a-button>
                  </a-badge>
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
              :show-total="(total: number) => `总共 ${total} 个项目`"
              @change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </a-card>

    <a-drawer v-model:open="filterOpen" title="筛选条件" width="400" destroy-on-close>
      <a-form layout="vertical">
        <a-form-item label="关键词">
          <a-input v-model:value="filterForm.keyword" allow-clear placeholder="缺陷名称 / API 路径" />
        </a-form-item>
        <a-form-item label="严重等级">
          <a-select
            v-model:value="filterForm.severity"
            :options="severityOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item>
          <template #label>
            <AiColumnLabel label="AI研判结果" />
          </template>
          <a-select
            v-model:value="filterForm.aiVerdict"
            :options="aiVerdictOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="访问域">
          <a-select
            v-model:value="filterForm.accessDomain"
            :options="domainOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="部署域">
          <a-select
            v-model:value="filterForm.deployDomain"
            :options="domainOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="处置状态">
          <a-select
            v-model:value="filterForm.processStatus"
            :options="processStatusOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleFilterReset">重置</a-button>
          <a-button type="primary" @click="handleFilterApply">应用筛选</a-button>
        </a-space>
      </template>
    </a-drawer>

    <DefectDetailModal
      v-model:open="detailOpen"
      :detail="currentDetail"
      :initial-tab="detailInitialTab"
      @process="handleProcessFromDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    CaretDownOutlined,
    CaretRightOutlined,
    DownloadOutlined,
    FolderOutlined,
    ReloadOutlined,
    RobotOutlined,
    SettingOutlined
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import AiColumnLabel from '../api-management/components/AiColumnLabel.vue';
  import DefectDetailModal from './components/DefectDetailModal.vue';
  import {
    aiVerdictOptions,
    buildDefectDetail,
    defectCategoryTree,
    domainOptions,
    getCategoryDescendantKeys,
    mockApiDefectRows,
    mockApiDefectTotal,
    processStatusOptions,
    severityOptions
  } from './mock';
  import type { ApiDefectDetail, ApiDefectFilter, ApiDefectRow, AiVerdictResult, DefectSeverity } from './types';

  const loading = ref(false);
  const chartExpanded = ref(false);
  const filterOpen = ref(false);
  const detailOpen = ref(false);
  const currentDetail = ref<ApiDefectDetail | null>(null);
  const detailInitialTab = ref<'basic' | 'alert'>('basic');
  const activeCategory = ref('all');
  const selectedRowKeys = ref<string[]>([]);
  const expandedGroups = ref(new Set(['web-security', 'security-spec', 'identity-permission', 'owasp-top10']));

  const allRows = ref<ApiDefectRow[]>([...mockApiDefectRows]);
  const appliedFilter = ref<ApiDefectFilter>({ aiVerdict: '真实威胁' });

  const filterForm = reactive<ApiDefectFilter>({
    keyword: undefined,
    severity: undefined,
    aiVerdict: '真实威胁',
    accessDomain: undefined,
    deployDomain: undefined,
    processStatus: undefined
  });

  const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: mockApiDefectTotal
  });

  const severityChartRef = ref<HTMLElement>();
  const typeChartRef = ref<HTMLElement>();
  const aiChartRef = ref<HTMLElement>();
  let severityChart: ECharts | null = null;
  let typeChart: ECharts | null = null;
  let aiChart: ECharts | null = null;

  const columns: TableColumnType<ApiDefectRow>[] = [
    { title: '发现/活跃时间', key: 'time', width: 220 },
    { title: '严重等级', dataIndex: 'severity', key: 'severity', width: 96, align: 'center' },
    { title: '缺陷名称', dataIndex: 'defectName', key: 'defectName', width: 180, ellipsis: true },
    { title: 'AI研判', key: 'aiInterpretation', width: 160 },
    { title: 'API/应用信息', key: 'apiInfo', width: 320 },
    { title: '访问域', dataIndex: 'accessDomain', key: 'accessDomain', width: 100, align: 'center' },
    { title: '部署域', dataIndex: 'deployDomain', key: 'deployDomain', width: 100, align: 'center' },
    { title: '操作', key: 'operation', width: 120, fixed: 'right', align: 'center' }
  ];

  const activeFilterTags = computed(() => {
    const f = appliedFilter.value;
    const tags: { key: keyof ApiDefectFilter; label: string }[] = [];
    if (f.keyword) tags.push({ key: 'keyword', label: `关键词: ${f.keyword}` });
    if (f.severity) tags.push({ key: 'severity', label: `严重等级: ${f.severity}` });
    if (f.aiVerdict) tags.push({ key: 'aiVerdict', label: `AI研判结果: ${f.aiVerdict}` });
    if (f.accessDomain) tags.push({ key: 'accessDomain', label: `访问域: ${f.accessDomain}` });
    if (f.deployDomain) tags.push({ key: 'deployDomain', label: `部署域: ${f.deployDomain}` });
    if (f.processStatus) tags.push({ key: 'processStatus', label: `处置状态: ${f.processStatus}` });
    return tags;
  });

  const filteredRows = computed(() => {
    const f = appliedFilter.value;
    const categoryKeys =
      activeCategory.value === 'all' ? null : getCategoryDescendantKeys(activeCategory.value);

    return allRows.value.filter((row) => {
      if (categoryKeys && !categoryKeys.includes(row.categoryKey)) return false;
      if (f.keyword) {
        const keyword = f.keyword.toLowerCase();
        if (!row.defectName.toLowerCase().includes(keyword) && !row.path.toLowerCase().includes(keyword)) {
          return false;
        }
      }
      if (f.severity && row.severity !== f.severity) return false;
      if (f.aiVerdict && row.aiVerdict !== f.aiVerdict) return false;
      if (f.accessDomain && row.accessDomain !== f.accessDomain) return false;
      if (f.deployDomain && row.deployDomain !== f.deployDomain) return false;
      if (f.processStatus && row.processStatus !== f.processStatus) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[]) => {
      selectedRowKeys.value = keys.map(String);
    }
  }));

  watch(
    filteredRows,
    (rows) => {
      pagination.total = rows.length;
      if ((pagination.current - 1) * pagination.pageSize >= rows.length && pagination.current > 1) {
        pagination.current = 1;
      }
    },
    { immediate: true }
  );

  watch(chartExpanded, (visible) => {
    if (visible) nextTick(() => renderOverviewCharts());
    else disposeCharts();
  });

  function toggleGroup(key: string) {
    const next = new Set(expandedGroups.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    expandedGroups.value = next;
  }

  function handleCategorySelect(key: string) {
    activeCategory.value = key;
    pagination.current = 1;
    selectedRowKeys.value = [];
    if (chartExpanded.value) nextTick(() => renderOverviewCharts());
  }

  function handleRemoveFilterTag(key: keyof ApiDefectFilter) {
    appliedFilter.value = { ...appliedFilter.value, [key]: undefined };
    filterForm[key] = undefined;
    pagination.current = 1;
    if (chartExpanded.value) nextTick(() => renderOverviewCharts());
  }

  function handleFilterApply() {
    appliedFilter.value = {
      keyword: filterForm.keyword || undefined,
      severity: filterForm.severity,
      aiVerdict: filterForm.aiVerdict,
      accessDomain: filterForm.accessDomain,
      deployDomain: filterForm.deployDomain,
      processStatus: filterForm.processStatus
    };
    filterOpen.value = false;
    pagination.current = 1;
    message.success('筛选条件已应用');
    if (chartExpanded.value) nextTick(() => renderOverviewCharts());
  }

  function handleFilterReset() {
    Object.assign(filterForm, {
      keyword: undefined,
      severity: undefined,
      aiVerdict: undefined,
      accessDomain: undefined,
      deployDomain: undefined,
      processStatus: undefined
    });
    appliedFilter.value = {};
    pagination.current = 1;
    if (chartExpanded.value) nextTick(() => renderOverviewCharts());
  }

  function handlePageChange() {
    selectedRowKeys.value = [];
  }

  function handleRefresh() {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      message.success('数据已刷新');
      if (chartExpanded.value) renderOverviewCharts();
    }, 400);
  }

  function handleExport() {
    message.success('导出任务已提交（演示）');
  }

  function handleBatchProcess() {
    message.info(`批量处理 ${selectedRowKeys.value.length} 条缺陷（演示）`);
  }

  function handleDetail(record: ApiDefectRow, tab: 'basic' | 'alert' = 'basic') {
    detailInitialTab.value = tab;
    currentDetail.value = buildDefectDetail(record);
    detailOpen.value = true;
  }

  function handleAiJudgment(record: ApiDefectRow) {
    handleDetail(record, 'alert');
  }

  function handleProcessFromDetail(detail: ApiDefectDetail) {
    message.info(`处置缺陷：${detail.defectName}`);
  }

  function handleProcess(record: ApiDefectRow) {
    message.info(`处理缺陷：${record.defectName}`);
  }

  function severityColor(severity: DefectSeverity) {
    if (severity === '高') return 'red';
    if (severity === '中') return 'orange';
    return 'blue';
  }

  function methodColor(method: string) {
    if (method === 'GET') return 'green';
    if (method === 'POST') return 'blue';
    if (method === 'PUT') return 'orange';
    if (method === 'DELETE') return 'red';
    return 'default';
  }

  function aiVerdictClass(value: AiVerdictResult) {
    if (value === '真实威胁') return 'status-text status-text--danger';
    if (value === '误报') return 'status-text status-text--muted';
    if (value === '疑似威胁') return 'status-text status-text--warning';
    return 'status-text status-text--muted';
  }

  function buildPieOption(title: string, data: { name: string; value: number }[]): EChartsOption {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        itemWidth: 10,
        itemHeight: 8,
        textStyle: { fontSize: 11 }
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['42%', '68%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 1 },
          label: { show: false },
          data
        }
      ]
    };
  }

  function renderOverviewCharts() {
    const rows = filteredRows.value;
    const severityMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    const aiMap = new Map<string, number>();

    rows.forEach((row) => {
      severityMap.set(row.severity, (severityMap.get(row.severity) || 0) + 1);
      typeMap.set(row.defectName, (typeMap.get(row.defectName) || 0) + 1);
      aiMap.set(row.aiVerdict, (aiMap.get(row.aiVerdict) || 0) + 1);
    });

    const toPieData = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    if (severityChartRef.value) {
      severityChart = severityChart || echarts.init(severityChartRef.value);
      severityChart.setOption(buildPieOption('严重等级', toPieData(severityMap)), true);
    }
    if (typeChartRef.value) {
      typeChart = typeChart || echarts.init(typeChartRef.value);
      typeChart.setOption(buildPieOption('缺陷类型', toPieData(typeMap)), true);
    }
    if (aiChartRef.value) {
      aiChart = aiChart || echarts.init(aiChartRef.value);
      aiChart.setOption(buildPieOption('AI研判', toPieData(aiMap)), true);
    }
  }

  function resizeCharts() {
    severityChart?.resize();
    typeChart?.resize();
    aiChart?.resize();
  }

  function disposeCharts() {
    severityChart?.dispose();
    typeChart?.dispose();
    aiChart?.dispose();
    severityChart = null;
    typeChart = null;
    aiChart = null;
  }

  onMounted(() => {
    window.addEventListener('resize', resizeCharts);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts);
    disposeCharts();
  });
</script>

<style lang="less" scoped>
  .api-defect-list-container {
    padding: 20px;
    height: 100%;
  }

  .page-layout {
    display: flex;
    min-height: calc(100vh - 140px);
  }

  .category-sidebar {
    width: 220px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border-secondary);
    background: #fafbfc;

    &__inner {
      padding: 12px 0;
    }
  }

  .category-group {
    &__head {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      cursor: pointer;
      color: #1f2a44;
      font-size: 13px;
      font-weight: 600;

      &:hover {
        background: rgba(22, 119, 255, 0.04);
      }
    }

    &__icon {
      font-size: 10px;
      color: var(--color-text-secondary);
    }

    &__folder {
      color: #faad14;
      font-size: 14px;
    }

    &__children {
      padding-bottom: 4px;
    }
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 7px 12px 7px 32px;
    cursor: pointer;
    font-size: 13px;
    color: #3d4a66;
    transition: background 0.2s;

    &--root {
      padding-left: 16px;
      font-weight: 600;
      color: #1f2a44;
    }

    &--active {
      background: #e6f4ff;
      color: #1677ff;
      font-weight: 600;
    }

    &:hover:not(&--active) {
      background: rgba(22, 119, 255, 0.04);
    }

    &__count {
      color: var(--color-text-secondary);
      font-size: 12px;
    }

    &__badge {
      margin: 0 0 0 auto;
      line-height: 18px;
      font-size: 11px;
    }
  }

  .main-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border-secondary);

    &__tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }

    &__label {
      color: var(--color-text-secondary);
      font-size: 13px;
      white-space: nowrap;
    }

    &__empty {
      color: var(--color-text-tertiary);
      font-size: 13px;
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
  }

  .filter-tag {
    margin: 0;
  }

  .chart-section {
    padding: 12px 16px 0;
  }

  .mini-chart-card {
    padding: 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    background: var(--color-bg-container);

    &__title {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #1f2a44;
    }

    &__box {
      height: 200px;
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
  }

  .defect-table {
    padding: 0 16px;
  }

  .time-cell {
    font-size: 12px;
    line-height: 1.6;
    color: #3d4a66;
  }

  .defect-name {
    font-weight: 500;
    color: #1f2a44;
  }

  .ai-verdict-cell {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .ai-judgment-icon-btn {
    width: 22px;
    height: 22px;
    padding: 0;
    color: #722ed1;

    &:hover {
      color: #531dab;
      background: #f9f0ff;
    }
  }

  .status-text {
    font-weight: 500;

    &--danger {
      color: #ff4d4f;
    }

    &--warning {
      color: #faad14;
    }

    &--muted {
      color: var(--color-text-secondary);
    }
  }

  .api-info-cell {
    font-size: 12px;
    line-height: 1.6;

    &__path {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }

    &__app {
      color: var(--color-text-secondary);
    }
  }

  .method-tag {
    margin: 0;
    flex-shrink: 0;
  }

  .api-path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
    color: #1677ff;
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }
</style>
