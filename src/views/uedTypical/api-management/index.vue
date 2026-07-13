<template>
  <div class="api-management-container">
    <a-card :body-style="{ padding: '0 0 16px' }" style="height: 100%">
      <div class="page-top">
        <a-tabs v-model:active-key="activeTab" class="page-tabs">
          <a-tab-pane key="api" tab="API" />
          <a-tab-pane key="other" tab="其他" />
          <a-tab-pane key="divide" tab="API划分" />
          <a-tab-pane key="tag" tab="API打标" />
        </a-tabs>
        <div class="page-top__actions">
          <a-button type="link" class="expand-btn" @click="chartExpanded = !chartExpanded">
            {{ chartExpanded ? '收起图表' : '展开图表' }}
          </a-button>
          <a-button type="primary" @click="filterOpen = true">筛选条件</a-button>
        </div>
      </div>

      <div v-if="chartExpanded" class="chart-section">
        <a-row :gutter="12">
          <a-col :span="8">
            <div class="mini-chart-card">
              <div class="mini-chart-card__title">部署域分布</div>
              <div ref="deployChartRef" class="mini-chart-card__box"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="mini-chart-card">
              <div class="mini-chart-card__title">生命周期分布</div>
              <div ref="lifecycleChartRef" class="mini-chart-card__box"></div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="mini-chart-card">
              <div class="mini-chart-card__title">风险 API 占比</div>
              <div ref="riskChartRef" class="mini-chart-card__box"></div>
            </div>
          </a-col>
        </a-row>
      </div>

      <div class="toolbar">
        <a-space>
          <a-button :disabled="!selectedRowKeys.length">修改</a-button>
          <a-button :disabled="!selectedRowKeys.length">移动</a-button>
          <a-button class="ai-btn" :disabled="!selectedRowKeys.length">
            <template #icon><RobotOutlined /></template>
            AI解读
          </a-button>
        </a-space>
        <a-space :size="4">
          <a-tooltip title="操作历史">
            <a-button type="text"><HistoryOutlined /></a-button>
          </a-tooltip>
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
        class="api-table"
        :columns="columns"
        :data-source="pagedRows"
        :row-selection="rowSelection"
        :pagination="false"
        :loading="loading"
        row-key="id"
        size="middle"
        :scroll="{ x: 2590 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'api'">
            <span>API</span>
            <span class="col-hint">（点击 API 可修改）</span>
          </template>
          <template v-else-if="column.key === 'isApi'">
            <AiColumnLabel label="是否API" />
          </template>
          <template v-else-if="column.key === 'isSensitive'">
            <AiColumnLabel label="是否敏感" />
          </template>
          <template v-else-if="column.key === 'businessType'">
            <AiColumnLabel label="API业务类型" />
          </template>
          <template v-else-if="column.key === 'apiDescription'">
            <AiColumnLabel label="API说明" />
          </template>
          <template v-else-if="column.key === 'sensitiveLevel'">
            <AiColumnLabel label="API敏感等级" />
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="name-cell">
              <span>{{ record.name }}</span>
              <EditOutlined class="edit-icon" @click="handleEditName(record)" />
            </div>
          </template>

          <template v-else-if="column.key === 'lifecycle'">
            <span class="lifecycle-cell">
              <i :class="['lifecycle-dot', lifecycleDotClass(record.lifecycle)]" />
              {{ record.lifecycle }}
            </span>
          </template>

          <template v-else-if="column.key === 'api'">
            <a-button type="link" class="api-link" @click="handleEditApi(record)">
              <a-tag :color="methodColor(record.method)" class="method-tag">{{ record.method }}</a-tag>
              <span class="api-path">{{ record.path }}</span>
            </a-button>
          </template>

          <template v-else-if="column.key === 'appStatus'">
            <a-tag :color="appStatusColor(record.appStatus)">{{ record.appStatus }}</a-tag>
          </template>

          <template v-else-if="column.key === 'visits'">
            {{ formatNumber(record.visits) }}
          </template>

          <template v-else-if="column.key === 'businessType'">
            <span class="ai-cell-value">{{ record.businessType }}</span>
          </template>

          <template v-else-if="column.key === 'apiDescription'">
            <a-tooltip :title="record.apiDescription">
              <span class="desc-ellipsis ai-cell-value">{{ record.apiDescription }}</span>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'isApi'">
            <a-tooltip :title="record.isApiAiBasis">
              <span class="ai-cell-value" :class="isApiValueClass(record.isApi)">{{ record.isApi }}</span>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'isSensitive'">
            <span class="ai-cell-value" :class="isSensitiveValueClass(record.isSensitive)">{{ record.isSensitive }}</span>
          </template>

          <template v-else-if="column.key === 'sensitiveLevel'">
            <a-tag
              v-if="record.sensitiveLevel && record.sensitiveLevel !== '-'"
              :color="sensitiveLevelColor(record.sensitiveLevel)"
            >
              {{ record.sensitiveLevel }}
            </a-tag>
            <span v-else>-</span>
          </template>

          <template v-else-if="column.key === 'dataTags'">
            <div class="tag-groups">
              <div class="tag-group">
                <span class="tag-group__label">请求</span>
                <AiDataTagList :tags="record.requestTags" color="blue" />
              </div>
              <div class="tag-group">
                <span class="tag-group__label">返回</span>
                <AiDataTagList :tags="record.responseTags" color="purple" />
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'risk'">
            <div class="risk-cell">
              <div class="risk-cell__count">脆弱性风险数 {{ record.riskCount }}</div>
              <a-space wrap :size="4">
                <a-tag v-for="item in record.riskStrategies" :key="item" color="red">{{ item }}</a-tag>
                <span v-if="!record.riskStrategies.length" class="tag-empty">暂无风险</span>
              </a-space>
            </div>
          </template>

          <template v-else-if="column.key === 'deployDomain'">
            <a-tag :color="deployColor(record.deployDomain)">{{ record.deployDomain }}</a-tag>
          </template>

          <template v-else-if="column.key === 'operation'">
            <a-space :size="0">
              <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
              <a-button type="link" size="small" @click="handlePortrait(record)">画像</a-button>
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
          :show-total="(total: number) => `共 ${formatNumber(total)} 条`"
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <a-drawer v-model:open="filterOpen" title="筛选条件" width="400" destroy-on-close>
      <a-form layout="vertical">
        <a-form-item label="关键词">
          <a-input v-model:value="filterForm.keyword" allow-clear placeholder="API 路径 / 应用名称 / 域名" />
        </a-form-item>
        <a-form-item label="生命周期">
          <a-select
            v-model:value="filterForm.lifecycle"
            :options="lifecycleOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="请求方法">
          <a-select v-model:value="filterForm.method" :options="methodOptions" allow-clear placeholder="请选择" />
        </a-form-item>
        <a-form-item label="应用状态">
          <a-select
            v-model:value="filterForm.appStatus"
            :options="appStatusOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="部署域">
          <a-select
            v-model:value="filterForm.deployDomain"
            :options="deployOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item>
          <template #label>
            <AiColumnLabel label="是否API" />
          </template>
          <a-select v-model:value="filterForm.isApi" :options="isApiOptions" allow-clear placeholder="请选择" />
        </a-form-item>
        <a-form-item>
          <template #label>
            <AiColumnLabel label="API业务类型" />
          </template>
          <a-select
            v-model:value="filterForm.businessType"
            :options="businessTypeOptions"
            allow-clear
            placeholder="请选择"
            show-search
            option-filter-prop="label"
          />
        </a-form-item>
        <a-form-item>
          <template #label>
            <AiColumnLabel label="API敏感等级" />
          </template>
          <a-select
            v-model:value="filterForm.sensitiveLevel"
            :options="sensitiveLevelOptions"
            allow-clear
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item label="仅显示有风险">
          <a-switch v-model:checked="filterForm.hasRisk" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleFilterReset">重置</a-button>
          <a-button type="primary" @click="handleFilterApply">应用筛选</a-button>
        </a-space>
      </template>
    </a-drawer>

    <ApiDetailModal
      v-model:open="detailOpen"
      :detail="currentDetail"
      :has-prev="detailIndex > 0"
      :has-next="detailIndex < filteredRows.length - 1"
      @prev="navigateDetail(-1)"
      @next="navigateDetail(1)"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    DownloadOutlined,
    EditOutlined,
    HistoryOutlined,
    ReloadOutlined,
    RobotOutlined,
    SettingOutlined
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import type { ECharts, EChartsOption } from 'echarts';
  import * as echarts from 'echarts';
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import ApiDetailModal from './components/ApiDetailModal.vue';
  import AiColumnLabel from './components/AiColumnLabel.vue';
  import AiDataTagList from './components/AiDataTagList.vue';
  import { buildApiDetail, mockApiManagementRows, mockApiManagementTotal } from './mock';
  import type { ApiDetail, ApiLifecycle, ApiManagementFilter, ApiManagementRow, ApiMethod } from './types';

  const activeTab = ref('api');
  const chartExpanded = ref(false);
  const filterOpen = ref(false);
  const detailOpen = ref(false);
  const detailIndex = ref(0);
  const loading = ref(false);
  const selectedRowKeys = ref<string[]>([]);

  const allRows = ref<ApiManagementRow[]>([...mockApiManagementRows]);
  const appliedFilter = ref<ApiManagementFilter>({});

  const filterForm = reactive<ApiManagementFilter & { hasRisk: boolean }>({
    keyword: undefined,
    lifecycle: undefined,
    method: undefined,
    appStatus: undefined,
    deployDomain: undefined,
    isApi: undefined,
    businessType: undefined,
    sensitiveLevel: undefined,
    hasRisk: false
  });

  const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: mockApiManagementTotal
  });

  const deployChartRef = ref<HTMLElement>();
  const lifecycleChartRef = ref<HTMLElement>();
  const riskChartRef = ref<HTMLElement>();
  let deployChart: ECharts | null = null;
  let lifecycleChart: ECharts | null = null;
  let riskChart: ECharts | null = null;

  const lifecycleOptions = [
    { label: '新发现', value: '新发现' },
    { label: '活跃', value: '活跃' },
    { label: '疑似下线', value: '疑似下线' },
    { label: '复活', value: '复活' }
  ];

  const methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'PATCH', value: 'PATCH' }
  ];

  const appStatusOptions = [
    { label: '关键', value: '关键' },
    { label: '确认', value: '确认' },
    { label: '不重要', value: '不重要' },
    { label: '未标识', value: '未标识' }
  ];

  const deployOptions = [
    { label: '互联网', value: '互联网' },
    { label: '局域网', value: '局域网' },
    { label: '内网', value: '内网' },
    { label: 'DMZ', value: 'DMZ' },
    { label: '云环境', value: '云环境' }
  ];

  const isApiOptions = [
    { label: '是', value: '是' },
    { label: '否', value: '否' }
  ];

  const sensitiveLevelOptions = [
    { label: 'L1', value: 'L1' },
    { label: 'L2', value: 'L2' },
    { label: 'L3', value: 'L3' },
    { label: 'L4', value: 'L4' }
  ];

  const businessTypeOptions = computed(() => {
    const types = new Set(allRows.value.map((row) => row.businessType));
    return Array.from(types)
      .sort()
      .map((value) => ({ label: value, value }));
  });

  const columns: TableColumnType<ApiManagementRow>[] = [
    { title: '名称', dataIndex: 'name', key: 'name', width: 120, fixed: 'left' },
    { title: '生命周期', dataIndex: 'lifecycle', key: 'lifecycle', width: 110 },
    { title: 'API', dataIndex: 'api', key: 'api', width: 280 },
    { title: '应用名称', dataIndex: 'appName', key: 'appName', width: 200, ellipsis: true },
    { title: '应用域名', dataIndex: 'appDomain', key: 'appDomain', width: 180, ellipsis: true },
    { title: '应用状态', dataIndex: 'appStatus', key: 'appStatus', width: 100 },
    { title: '访问量', dataIndex: 'visits', key: 'visits', width: 110 },
    { title: '是否API', dataIndex: 'isApi', key: 'isApi', width: 90 },
    { title: '是否敏感', dataIndex: 'isSensitive', key: 'isSensitive', width: 90 },
    { title: 'API业务类型', dataIndex: 'businessType', key: 'businessType', width: 150 },
    { title: 'API说明', dataIndex: 'apiDescription', key: 'apiDescription', width: 220, ellipsis: true },
    { title: 'API敏感等级', dataIndex: 'sensitiveLevel', key: 'sensitiveLevel', width: 120 },
    { title: '数据标签', dataIndex: 'dataTags', key: 'dataTags', width: 240 },
    { title: '风险情况', dataIndex: 'risk', key: 'risk', width: 200 },
    { title: '部署域', dataIndex: 'deployDomain', key: 'deployDomain', width: 100 },
    { title: '操作', key: 'operation', width: 120, fixed: 'right' }
  ];

  const filteredRows = computed(() => {
    const f = appliedFilter.value;
    return allRows.value.filter((row) => {
      if (f.keyword) {
        const kw = f.keyword.toLowerCase();
        const hit =
          row.path.toLowerCase().includes(kw) ||
          row.appName.toLowerCase().includes(kw) ||
          row.appDomain.toLowerCase().includes(kw) ||
          row.name.toLowerCase().includes(kw);
        if (!hit) return false;
      }
      if (f.lifecycle && row.lifecycle !== f.lifecycle) return false;
      if (f.method && row.method !== f.method) return false;
      if (f.appStatus && row.appStatus !== f.appStatus) return false;
      if (f.deployDomain && row.deployDomain !== f.deployDomain) return false;
      if (f.isApi && row.isApi !== f.isApi) return false;
      if (f.businessType && row.businessType !== f.businessType) return false;
      if (f.sensitiveLevel && row.sensitiveLevel !== f.sensitiveLevel) return false;
      if (f.hasRisk && row.riskCount <= 0) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const currentDetail = computed<ApiDetail | null>(() => {
    const row = filteredRows.value[detailIndex.value];
    return row ? buildApiDetail(row) : null;
  });

  const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: (string | number)[]) => {
      selectedRowKeys.value = keys as string[];
    }
  }));

  watch(filteredRows, (rows) => {
    pagination.total = rows.length > mockApiManagementRows.length ? mockApiManagementTotal : rows.length;
    if ((pagination.current - 1) * pagination.pageSize >= rows.length) {
      pagination.current = 1;
    }
  });

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }

  function lifecycleDotClass(lifecycle: ApiLifecycle) {
    if (lifecycle === '新发现') return 'lifecycle-dot--new';
    if (lifecycle === '活跃') return 'lifecycle-dot--active';
    if (lifecycle === '疑似下线') return 'lifecycle-dot--offline';
    return 'lifecycle-dot--revive';
  }

  function methodColor(method: ApiMethod) {
    if (method === 'GET') return 'blue';
    if (method === 'POST') return 'green';
    if (method === 'PUT') return 'orange';
    if (method === 'DELETE') return 'red';
    return 'default';
  }

  function appStatusColor(status: string) {
    if (status === '关键') return 'red';
    if (status === '确认') return 'blue';
    if (status === '不重要') return 'default';
    return 'default';
  }

  function deployColor(domain: string) {
    if (domain === '互联网') return 'cyan';
    if (domain === '局域网') return 'blue';
    if (domain === '内网') return 'geekblue';
    if (domain === 'DMZ') return 'orange';
    return 'purple';
  }

  function isApiValueClass(value: string) {
    return value === '否' ? 'is-api-value--no' : 'is-api-value--yes';
  }

  function isSensitiveValueClass(value: string) {
    return value === '是' ? 'is-sensitive-value--yes' : 'is-sensitive-value--no';
  }

  function sensitiveLevelColor(level: string) {
    if (level === 'L4') return 'red';
    if (level === 'L3') return 'orange';
    if (level === 'L2') return 'gold';
    return 'blue';
  }

  function pieOption(data: { name: string; value: number }[], colors?: string[]): EChartsOption {
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
      color: colors,
      series: [{ type: 'pie', radius: ['40%', '65%'], center: ['50%', '44%'], label: { show: false }, data }]
    };
  }

  function aggregateBy<T extends string>(rows: ApiManagementRow[], getter: (row: ApiManagementRow) => T) {
    const map = new Map<string, number>();
    rows.forEach((row) => {
      const key = getter(row);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }

  function renderOverviewCharts() {
    const rows = filteredRows.value;
    const deployData = aggregateBy(rows, (r) => r.deployDomain);
    const lifecycleData = aggregateBy(rows, (r) => r.lifecycle);
    const riskData = [
      { name: '有风险', value: rows.filter((r) => r.riskCount > 0).length },
      { name: '无风险', value: rows.filter((r) => r.riskCount <= 0).length }
    ];

    if (deployChartRef.value) {
      if (!deployChart) deployChart = echarts.init(deployChartRef.value);
      deployChart.setOption(pieOption(deployData, ['#13c2c2', '#2f54eb', '#fa8c16', '#722ed1', '#52c41a']), true);
    }
    if (lifecycleChartRef.value) {
      if (!lifecycleChart) lifecycleChart = echarts.init(lifecycleChartRef.value);
      lifecycleChart.setOption(
        pieOption(lifecycleData, ['#1677ff', '#52c41a', '#faad14', '#722ed1']),
        true
      );
    }
    if (riskChartRef.value) {
      if (!riskChart) riskChart = echarts.init(riskChartRef.value);
      riskChart.setOption(pieOption(riskData, ['#f5222d', '#d9d9d9']), true);
    }
  }

  function disposeCharts() {
    deployChart?.dispose();
    lifecycleChart?.dispose();
    riskChart?.dispose();
    deployChart = null;
    lifecycleChart = null;
    riskChart = null;
  }

  function resizeCharts() {
    deployChart?.resize();
    lifecycleChart?.resize();
    riskChart?.resize();
  }

  watch(chartExpanded, async (expanded) => {
    if (expanded) {
      await nextTick();
      renderOverviewCharts();
    } else {
      disposeCharts();
    }
  });

  function handleFilterApply() {
    appliedFilter.value = {
      keyword: filterForm.keyword,
      lifecycle: filterForm.lifecycle,
      method: filterForm.method,
      appStatus: filterForm.appStatus,
      deployDomain: filterForm.deployDomain,
      isApi: filterForm.isApi,
      businessType: filterForm.businessType,
      sensitiveLevel: filterForm.sensitiveLevel,
      hasRisk: filterForm.hasRisk || undefined
    };
    filterOpen.value = false;
    pagination.current = 1;
    message.success('筛选条件已应用');
    if (chartExpanded.value) nextTick(() => renderOverviewCharts());
  }

  function handleFilterReset() {
    Object.assign(filterForm, {
      keyword: undefined,
      lifecycle: undefined,
      method: undefined,
      appStatus: undefined,
      deployDomain: undefined,
      isApi: undefined,
      businessType: undefined,
      sensitiveLevel: undefined,
      hasRisk: false
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

  function handleEditName(record: ApiManagementRow) {
    message.info(`编辑名称：${record.name}`);
  }

  function handleEditApi(record: ApiManagementRow) {
    message.info(`编辑 API：${record.method} ${record.path}`);
  }

  function handleDetail(record: ApiManagementRow) {
    const index = filteredRows.value.findIndex((row) => row.id === record.id);
    detailIndex.value = index >= 0 ? index : 0;
    detailOpen.value = true;
  }

  function navigateDetail(step: number) {
    const nextIndex = detailIndex.value + step;
    if (nextIndex < 0 || nextIndex >= filteredRows.value.length) return;
    detailIndex.value = nextIndex;
  }

  function handlePortrait(record: ApiManagementRow) {
    message.info(`查看画像：${record.path}`);
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
  .api-management-container {
    padding: 20px;
    height: 100%;
  }

  .page-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--color-border-secondary);

    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
    }
  }

  .page-tabs {
    flex: 1;

    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }
  }

  .expand-btn {
    padding-right: 0;
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

  .ai-btn {
    color: #722ed1;
    border-color: #d3adf7;

    &:not(:disabled):hover {
      color: #531dab;
      border-color: #b37feb;
    }
  }

  .api-table {
    padding: 0 16px;
  }

  .col-hint {
    margin-left: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--color-text-secondary);
  }

  .name-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    .edit-icon {
      color: var(--color-text-secondary);
      cursor: pointer;

      &:hover {
        color: #1677ff;
      }
    }
  }

  .lifecycle-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .lifecycle-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--new {
      background: #1677ff;
    }

    &--active {
      background: #52c41a;
    }

    &--offline {
      background: #faad14;
    }

    &--revive {
      background: #722ed1;
    }
  }

  .api-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    height: auto;
    white-space: normal;
    text-align: left;
  }

  .method-tag {
    margin: 0;
    flex-shrink: 0;
  }

  .api-path {
    word-break: break-all;
  }

  .tag-groups {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tag-group {
    display: flex;
    align-items: flex-start;
    gap: 6px;

    &__label {
      flex-shrink: 0;
      font-size: 12px;
      color: var(--color-text-secondary);
      line-height: 22px;
    }
  }

  .tag-empty {
    font-size: 12px;
    color: var(--color-text-quaternary);
  }

  .desc-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 12px;
    color: #4a5874;
    line-height: 1.5;
  }

  .ai-cell-value {
    cursor: default;
  }

  .is-api-value--yes {
    font-weight: 600;
    color: #389e0d;
    cursor: help;
  }

  .is-api-value--no {
    font-weight: 600;
    color: #cf1322;
    cursor: help;
  }

  .is-sensitive-value--yes {
    font-weight: 600;
    color: #cf1322;
  }

  .is-sensitive-value--no {
    font-weight: 600;
    color: #389e0d;
  }

  .business-type-cell {
    font-size: 13px;
    color: #1f2a44;
  }

  .ai-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #722ed1;

    &__icon {
      font-size: 16px;
    }
  }

  .risk-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &__count {
      font-size: 12px;
      color: var(--color-text-secondary);
    }
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }
</style>
