<template>
  <div class="risk-behavior-container">
    <a-card :body-style="{ padding: 0, height: '100%' }" style="height: 100%">
      <div class="risk-behavior-page">
        <div class="page-tabs">
          <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
            <a-tab-pane v-for="item in tabOptions" :key="item.key" :tab="item.label" />
          </a-tabs>
        </div>

        <div class="page-layout">
          <aside class="category-sidebar">
            <div class="category-sidebar__inner">
              <div class="category-badge">{{ activeCategoryIndex + 1 }}</div>
              <div
                class="category-item category-item--root"
                :class="{ 'category-item--active': isAllRiskActive }"
                @click="handleCategoryChange('')"
              >
                <span class="category-item__label">全部风险</span>
                <span class="category-item__count">({{ currentTabTotal }})</span>
              </div>
              <div v-for="group in currentGroups" :key="group.key" class="category-group">
                <div class="category-group__head" @click="toggleGroup(group.key)">
                  <CaretDownOutlined v-if="expandedGroups.has(group.key)" class="category-group__icon" />
                  <CaretRightOutlined v-else class="category-group__icon" />
                  <FolderOutlined class="category-group__folder" />
                  <span class="category-group__title">{{ group.title }}</span>
                </div>
                <div v-show="expandedGroups.has(group.key)" class="category-group__children">
                  <div
                    v-for="item in group.children"
                    :key="item.key"
                    class="category-item"
                    :class="{ 'category-item--active': activeCategory === item.key }"
                    @click="handleCategoryChange(item.key)"
                  >
                    <span class="category-item__label">{{ item.title }}</span>
                    <span class="category-item__count">({{ item.count }})</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section class="content-panel">
            <div class="filter-strip">
              <div class="filter-strip__left">
                <span class="filter-strip__label">筛选条件:</span>
                <span v-if="isWebAttack" class="aggregate-summary">{{ webAggregateSummary }}</span>
                <template v-if="activeFilterTags.length">
                  <a-tag
                    v-for="tag in activeFilterTags"
                    :key="tag.key"
                    closable
                    class="filter-tag"
                    @close="handleRemoveFilter(tag.key)"
                  >
                    {{ tag.label }}
                  </a-tag>
                </template>
                <span v-else class="filter-strip__empty">暂无筛选条件</span>
              </div>
              <div class="filter-strip__right">
                <a-button type="primary" @click="filterDrawerOpen = true">筛选条件</a-button>
                <a-button @click="handleResetFilters">隐藏筛选</a-button>
              </div>
            </div>

            <div class="table-wrap">
              <a-table
                :columns="currentColumns"
                :data-source="pagedRows"
                :pagination="false"
                :loading="loading"
                row-key="id"
                :scroll="{ x: 1540 }"
              >
                <template #headerCell="{ column }">
                  <template v-if="column.key === 'aiInterpretation'">
                    <AiColumnLabel label="AI研判" />
                  </template>
                </template>

                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'time'">
                    <div class="time-cell">
                      <div>发现时间：{{ record.discoveredAt }}</div>
                      <div>活跃时间：{{ record.activeAt }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'severity'">
                    <a-tag :color="severityColor(record.severity)">{{ record.severity }}</a-tag>
                  </template>

                  <template v-else-if="column.key === 'riskType'">
                    <span class="risk-type-cell">{{ getRiskTypeLabel(record) }}</span>
                  </template>

                  <template v-else-if="column.key === 'source'">
                    <div class="ip-cell">
                      <div>IP：{{ record.sourceIp }}</div>
                      <div>属地：{{ record.sourceArea }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'target'">
                    <div class="ip-cell">
                      <div>{{ record.targetIp }}</div>
                      <div>属地：{{ record.targetArea }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'sourceIpWeb'">
                    <div class="ip-cell">
                      <div>{{ record.sourceIp }}</div>
                      <div>属地：{{ record.sourceArea }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'attackName'">
                    <div class="attack-name-cell">
                      <div class="attack-name-cell__main">{{ record.riskType }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'attackCount'">
                    <span>{{ record.sourceCount }}</span>
                  </template>

                  <template v-else-if="column.key === 'eventResult'">
                    <span>{{ record.eventResult || '-' }}</span>
                  </template>

                  <template v-else-if="column.key === 'keywordLabel'">
                    <div class="keyword-cell">
                      <div>应用名称</div>
                      <a-tag class="keyword-tag">{{ record.keywordLabel || '-' }}</a-tag>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'sourceCount'">
                    <div class="count-cell">
                      <div>命中数：{{ record.sourceCount }}</div>
                      <div>影响数：{{ record.affectedCount }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'alertCount'">
                    <div class="count-cell">
                      <div>通报：{{ record.alertCount }}</div>
                      <div>溯源：1</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'status'">
                    <div class="status-cell">
                      <div :class="['status-text', statusClassMap[record.status] || '']">{{ record.status }}</div>
                      <div class="status-cell__sub">{{ record.url }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'aiInterpretation'">
                    <span class="ai-verdict-cell">
                      <span :class="aiVerdictClass(record.aiVerdict)">{{ record.aiVerdict || '真实威胁' }}</span>
                      <a-tooltip title="AI研判">
                        <a-button type="text" size="small" class="ai-judgment-icon-btn">
                          <RobotOutlined />
                        </a-button>
                      </a-tooltip>
                    </span>
                  </template>

                  <template v-else-if="column.key === 'occurTime'">
                    <div class="time-cell">
                      <div>发现时间{{ record.discoveredAt }}</div>
                      <div>活跃时间{{ record.activeAt }}</div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'action'">
                    <a-space :size="0">
                      <a-button type="link" size="small" @click="handleDetail(record)">详情</a-button>
                      <a-button type="link" size="small" @click="handleProcess(record)">处理</a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </div>

            <div class="pagination-bar">
              <a-pagination
                v-model:current="pagination.current"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                :show-size-changer="true"
                :page-size-options="['5', '10', '20', '50']"
                :show-total="(total: number) => `总共 ${total} 个`"
                @change="handlePageChange"
              />
            </div>
          </section>
        </div>
      </div>
    </a-card>

    <a-drawer v-model:open="filterDrawerOpen" title="筛选条件" width="420" destroy-on-close>
      <a-form layout="vertical">
        <a-form-item label="关键词">
          <a-input
            v-model:value="filterForm.keyword"
            allow-clear
            placeholder="请输入风险类型、规则名称或 URL"
          />
        </a-form-item>
        <a-form-item label="源IP属地">
          <a-select
            v-model:value="filterForm.sourceArea"
            allow-clear
            :options="sourceAreaOptions"
            placeholder="请选择源IP属地"
          />
        </a-form-item>
        <a-form-item label="处置状态">
          <a-select
            v-model:value="filterForm.status"
            allow-clear
            :options="statusOptions"
            placeholder="请选择处置状态"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleResetFilters">重置</a-button>
          <a-button type="primary" @click="handleApplyFilters">应用筛选</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
  import { CaretDownOutlined, CaretRightOutlined, FolderOutlined, RobotOutlined } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import AiColumnLabel from '../api-management/components/AiColumnLabel.vue';
  import {
    defaultFilter,
    getCategoryGroupTitle,
    getCategoryGroups,
    getDefaultCategoryKey,
    riskBehaviorRows,
    sourceAreaOptions,
    statusOptions,
    tabOptions
  } from './mock';
  import type { AiVerdictResult, RiskBehaviorFilter, RiskBehaviorRow, RiskTabKey } from './types';

  const loading = ref(false);
  const router = useRouter();
  const filterDrawerOpen = ref(false);
  const activeTab = ref<RiskTabKey>('abnormal-behavior');
  const activeCategory = ref(getDefaultCategoryKey(activeTab.value));
  const expandedGroups = ref(new Set(getCategoryGroups(activeTab.value).map((group) => group.key)));
  const appliedFilter = ref<RiskBehaviorFilter>({ ...defaultFilter });
  const filterForm = reactive<RiskBehaviorFilter>({ ...defaultFilter });

  const pagination = reactive({
    current: 1,
    pageSize: 5,
    total: 0
  });

  const columns: TableColumnType<RiskBehaviorRow>[] = [
    { title: '发现/活跃时间', key: 'time', width: 200 },
    { title: '严重等级', dataIndex: 'severity', key: 'severity', width: 96, align: 'center' },
    { title: '风险类型', dataIndex: 'riskType', key: 'riskType', width: 180 },
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', width: 200, ellipsis: true },
    { title: '主机来源IP信息', key: 'source', width: 150 },
    { title: '访问路径', dataIndex: 'url', key: 'url', width: 220, ellipsis: true },
    { title: '被访主机IP', key: 'target', width: 140 },
    { title: '概览总数', key: 'sourceCount', width: 120, align: 'center' },
    { title: '受影响数', key: 'alertCount', width: 110, align: 'center' },
    { title: '处置路径', dataIndex: 'sourceAsset', key: 'sourceAsset', width: 100, align: 'center' },
    { title: '处置结果', key: 'status', width: 180 },
    { title: 'AI研判', key: 'aiInterpretation', width: 160 },
    { title: '操作', key: 'action', width: 120, fixed: 'right', align: 'center' }
  ];

  const webColumns: TableColumnType<RiskBehaviorRow>[] = [
    { title: '来源IP', key: 'sourceIpWeb', width: 150 },
    { title: '严重等级', dataIndex: 'severity', key: 'severity', width: 96, align: 'center' },
    { title: '攻击名称', key: 'attackName', width: 120 },
    { title: '攻击次数', key: 'attackCount', width: 90, align: 'center' },
    { title: '事件结果', key: 'eventResult', width: 90, align: 'center' },
    { title: '关键应用', key: 'keywordLabel', width: 120 },
    { title: '处置结果', key: 'status', width: 220 },
    { title: 'AI研判', key: 'aiInterpretation', width: 160 },
    { title: '发现/活跃时间', key: 'occurTime', width: 180 },
    { title: '操作', key: 'action', width: 110, fixed: 'right', align: 'center' }
  ];

  const statusClassMap: Record<string, string> = {
    未处置: 'status-text--danger',
    已忽略: 'status-text--muted',
    已处置: 'status-text--success'
  };

  const isWebAttack = computed(() => activeTab.value === 'web-attack');
  const currentColumns = computed(() => (isWebAttack.value ? webColumns : columns));
  const webAggregateSummary = computed(
    () => filteredRows.value[0]?.aggregateSummary || '聚合: 来源IP+站点+时间'
  );

  const currentGroups = computed(() => getCategoryGroups(activeTab.value));

  const currentTabTotal = computed(
    () => riskBehaviorRows.filter((item) => item.tabKey === activeTab.value).length
  );

  const isAllRiskActive = computed(() => !activeCategory.value);

  const activeCategoryIndex = computed(() => {
    if (!activeCategory.value) return 0;
    const list = currentGroups.value.flatMap((group) => group.children);
    const idx = list.findIndex((item) => item.key === activeCategory.value);
    return Math.max(0, idx + 1);
  });

  const filteredRows = computed(() => {
    const keyword = appliedFilter.value.keyword?.trim().toLowerCase();
    return riskBehaviorRows.filter((item) => {
      if (item.tabKey !== activeTab.value) return false;
      if (activeCategory.value && item.categoryKey !== activeCategory.value) return false;
      if (keyword) {
        const matched = [item.riskType, item.ruleName, item.url].some((text) =>
          text.toLowerCase().includes(keyword)
        );
        if (!matched) return false;
      }
      if (appliedFilter.value.sourceArea && item.sourceArea !== appliedFilter.value.sourceArea) return false;
      if (appliedFilter.value.status && item.status !== appliedFilter.value.status) return false;
      return true;
    });
  });

  const pagedRows = computed(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return filteredRows.value.slice(start, start + pagination.pageSize);
  });

  const activeFilterTags = computed(() => {
    const tags: Array<{ key: keyof RiskBehaviorFilter; label: string }> = [];
    if (appliedFilter.value.keyword) tags.push({ key: 'keyword', label: `关键词: ${appliedFilter.value.keyword}` });
    if (appliedFilter.value.sourceArea)
      tags.push({ key: 'sourceArea', label: `源IP属地: ${appliedFilter.value.sourceArea}` });
    if (appliedFilter.value.status) tags.push({ key: 'status', label: `处置状态: ${appliedFilter.value.status}` });
    return tags;
  });

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

  function handleTabChange(key: string) {
    activeTab.value = key as RiskTabKey;
    activeCategory.value = getDefaultCategoryKey(activeTab.value);
    expandedGroups.value = new Set(getCategoryGroups(activeTab.value).map((group) => group.key));
    pagination.current = 1;
  }

  function toggleGroup(key: string) {
    const next = new Set(expandedGroups.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    expandedGroups.value = next;
  }

  function handleCategoryChange(key: string) {
    activeCategory.value = key;
    pagination.current = 1;
  }

  function handleApplyFilters() {
    appliedFilter.value = {
      keyword: filterForm.keyword || undefined,
      sourceArea: filterForm.sourceArea,
      status: filterForm.status
    };
    pagination.current = 1;
    filterDrawerOpen.value = false;
    message.success('筛选条件已应用');
  }

  function handleResetFilters() {
    Object.assign(filterForm, defaultFilter);
    appliedFilter.value = { ...defaultFilter };
    pagination.current = 1;
    filterDrawerOpen.value = false;
  }

  function handleRemoveFilter(key: keyof RiskBehaviorFilter) {
    appliedFilter.value = { ...appliedFilter.value, [key]: undefined };
    filterForm[key] = undefined;
    pagination.current = 1;
  }

  function handlePageChange() {
    window.requestAnimationFrame(() => undefined);
  }

  function severityColor(severity: RiskBehaviorRow['severity']) {
    if (severity === '高') return 'red';
    if (severity === '中') return 'orange';
    return 'blue';
  }

  function getRiskTypeLabel(record: RiskBehaviorRow) {
    if (record.tabKey === 'abnormal-behavior') {
      return getCategoryGroupTitle(record.categoryKey, record.tabKey) || record.riskType;
    }
    return record.riskType;
  }

  function aiVerdictClass(value?: AiVerdictResult) {
    if (value === '真实威胁') return 'status-text status-text--danger';
    if (value === '误报') return 'status-text status-text--muted';
    if (value === '疑似威胁') return 'status-text status-text--warning';
    return 'status-text status-text--muted';
  }

  function handleDetail(record: RiskBehaviorRow) {
    if (record.tabKey === 'web-attack') {
      router.push(`/risk-behavior/web-attack/${record.id}`);
      return;
    }
    Modal.info({
      title: '风险详情',
      centered: true,
      width: '70%',
      footer: null,
      content: `风险类型：${record.riskType}\n规则名称：${record.ruleName}\n访问路径：${record.url}`
    });
  }

  function handleProcess(record: RiskBehaviorRow) {
    message.info(`已进入处置流程：${record.riskType}`);
  }
</script>

<style lang="less" scoped>
  .risk-behavior-container {
    padding: 20px;
    height: 100%;

    :deep(.ant-card-body) {
      height: 100%;
    }
  }

  .risk-behavior-page {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .page-tabs {
    padding: 0 16px;
    border-bottom: 1px solid var(--color-component-stroke);
  }

  .page-layout {
    display: flex;
    min-height: 0;
    flex: 1;
  }

  .category-sidebar {
    width: 220px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border-secondary, var(--color-component-stroke));
    background: #fafbfc;

    &__inner {
      position: relative;
      padding: 12px 0;
    }
  }

  .category-badge {
    position: absolute;
    top: 8px;
    left: 74px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ff4d4f;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
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

    &__title {
      flex: 1;
      min-width: 0;
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
    color: #3d4a66;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(22, 119, 255, 0.04);
    }

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

    &__label {
      flex: 1;
      min-width: 0;
      font-size: 13px;
    }

    &__count {
      margin-left: 4px;
      font-size: 12px;
      color: inherit;
    }
  }

  .content-panel {
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
  }

  .filter-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-component-stroke);

    &__left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      min-width: 0;
    }

    &__label {
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    &__empty {
      color: var(--color-text-placeholder);
      font-size: 13px;
    }

    &__right {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
  }

  .filter-tag {
    margin: 0;
  }

  .aggregate-summary {
    color: #ff4d4f;
    font-size: 13px;
    font-weight: 600;
  }

  .table-wrap {
    flex: 1;
    min-height: 0;
    padding: 0 16px;
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
  }

  .time-cell,
  .ip-cell,
  .count-cell,
  .status-cell,
  .risk-type-cell,
  .attack-name-cell,
  .keyword-cell {
    font-size: 12px;
    line-height: 1.7;
    color: var(--color-text-primarys);
  }

  .risk-type-cell__sub,
  .status-cell__sub {
    color: var(--color-text-secondary);
  }

  .status-text {
    font-weight: 600;

    &--danger {
      color: #ff4d4f;
    }

    &--warning {
      color: #faad14;
    }

    &--muted {
      color: var(--color-text-secondary);
    }

    &--success {
      color: #52c41a;
    }
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

  .attack-name-cell__main {
    color: #ff4d4f;
  }

  .keyword-tag {
    margin: 2px 0 0;
    color: #1677ff;
    background: #e6f4ff;
    border-color: #bae0ff;
  }
</style>
