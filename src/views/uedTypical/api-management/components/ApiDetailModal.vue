<template>
  <a-drawer
    :open="open"
    title="API详情"
    placement="right"
    width="1280"
    destroy-on-close
    class="api-detail-drawer"
    :body-style="{ padding: '16px 20px 80px' }"
    @close="handleClose"
  >
    <template v-if="detail">
      <section class="detail-section">
        <div class="section-title">基础信息</div>
        <div class="basic-info-layout" :class="{ 'basic-info-layout--with-ai': showAiBlock }">
          <div class="info-grid">
            <div class="info-item info-item--span3">
              <span class="info-item__label">API</span>
              <span class="info-item__value">
                <a-tag :color="methodColor(detail.method)">{{ detail.method }}</a-tag>
                <span class="api-path-text">{{ detail.path }}</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-item__label">名称</span>
              <span class="info-item__value">{{ detail.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">生命周期</span>
              <span class="info-item__value lifecycle-cell">
                <i :class="['lifecycle-dot', lifecycleDotClass(detail.lifecycle)]" />
                {{ detail.lifecycle }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-item__label">发现时间</span>
              <span class="info-item__value">{{ detail.discoveredAt }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">活跃时间</span>
              <span class="info-item__value">{{ detail.activeAt }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">所属应用名称</span>
              <span class="info-item__value">{{ detail.appName }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">API访问量</span>
              <span class="info-item__value">{{ formatNumber(detail.visits) }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">API类型</span>
              <span class="info-item__value">{{ detail.apiType }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">API返回类型</span>
              <span class="info-item__value">{{ detail.responseContentType }}</span>
            </div>
            <div class="info-item">
              <span class="info-item__label">API敏感等级</span>
              <span class="info-item__value">
                <a-tag v-if="detail.sensitiveLevel !== '-'" :color="sensitiveLevelColor(detail.sensitiveLevel)">
                  {{ detail.sensitiveLevel }}
                </a-tag>
                <span v-else>-</span>
              </span>
            </div>
            <div class="info-item info-item--span3">
              <span class="info-item__label">请求数据标签</span>
              <span class="info-item__value">
                <AiDataTagList :tags="detail.requestTags" color="blue" />
              </span>
            </div>
            <div class="info-item info-item--span3">
              <span class="info-item__label">返回数据标签</span>
              <span class="info-item__value">
                <AiDataTagList :tags="detail.responseTags" color="green" />
              </span>
            </div>
          </div>

          <div v-if="showAiBlock" ref="aiBlockRef" class="ai-interpret-block">
            <div class="ai-interpret-block__head">
              <RobotOutlined class="ai-interpret-block__icon" />
              <span class="ai-interpret-block__title">AI解读</span>
            </div>
            <div class="ai-interpret-grid">
              <div class="ai-interpret-item">
                <span class="ai-interpret-item__label">是否API</span>
                <a-tooltip :title="detail.isApiAiBasis" placement="top">
                  <span class="ai-interpret-item__value ai-interpret-item__value--hover" :class="isApiValueClass(detail.isApi)">
                    {{ detail.isApi }}
                  </span>
                </a-tooltip>
              </div>
              <div class="ai-interpret-item">
                <span class="ai-interpret-item__label">是否敏感</span>
                <span class="ai-interpret-item__value" :class="isSensitiveValueClass(detail.isSensitive)">
                  {{ detail.isSensitive }}
                </span>
              </div>
              <div class="ai-interpret-item">
                <span class="ai-interpret-item__label">API业务类型</span>
                <span class="ai-interpret-item__value">{{ detail.businessType }}</span>
              </div>
              <div class="ai-interpret-item ai-interpret-item--full">
                <span class="ai-interpret-item__label">API说明</span>
                <span class="ai-interpret-item__value ai-interpret-item__value--desc">{{ detail.apiDescription }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <a-tabs v-model:active-key="detailContentTab" class="detail-content-tabs">
          <a-tab-pane key="snapshot" tab="API快照">
            <a-tabs v-model:active-key="snapshotTab" size="small" class="snapshot-main-tabs">
          <a-tab-pane key="message" tab="API报文">
            <div class="snapshot-panels">
              <div class="snapshot-panel">
                <div class="snapshot-panel__head">
                  <div class="snapshot-panel__title">请求</div>
                  <div class="snapshot-actions">
                    <a-button type="link" size="small" @click="copyText(activeRequestContent, '请求报文')">
                      复制请求报文
                    </a-button>
                    <a-button type="link" size="small" @click="copyText(detail.snapshot.requestUrl, '请求地址')">
                      复制请求地址
                    </a-button>
                  </div>
                </div>
                <a-tabs v-model:active-key="requestTab" size="small">
                  <a-tab-pane key="raw" tab="Raw" />
                  <a-tab-pane key="header" tab="Header" />
                  <a-tab-pane key="cookie" tab="Cookie" />
                  <a-tab-pane key="body" tab="Body" />
                </a-tabs>
                <a-input
                  v-model:value="requestSearch"
                  allow-clear
                  size="small"
                  placeholder="请输入搜索关键词"
                  class="snapshot-search"
                />
                <pre class="snapshot-code" v-html="highlightedRequest"></pre>
              </div>

              <div class="snapshot-panel">
                <div class="snapshot-panel__title snapshot-panel__title--bar">返回</div>
                <a-tabs v-model:active-key="responseTab" size="small">
                  <a-tab-pane key="raw" tab="Raw" />
                  <a-tab-pane key="header" tab="Header" />
                  <a-tab-pane key="setCookie" tab="Set-Cookie" />
                  <a-tab-pane key="body" tab="Body" />
                </a-tabs>
                <div v-if="detail.snapshot.highlightTag" class="highlight-bar">
                  <a-button type="text" size="small" :disabled="highlightIndex <= 0" @click="highlightIndex -= 1">
                    <UpOutlined />
                  </a-button>
                  <span>{{ detail.snapshot.highlightTag }} {{ highlightIndex + 1 }}</span>
                  <a-button
                    type="text"
                    size="small"
                    :disabled="highlightIndex >= (detail.snapshot.highlightCount || 1) - 1"
                    @click="highlightIndex += 1"
                  >
                    <DownOutlined />
                  </a-button>
                </div>
                <pre class="snapshot-code" v-html="highlightedResponse"></pre>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="params" tab="API参数">
            <a-tabs v-model:active-key="paramTab" size="small" class="param-main-tabs">
              <a-tab-pane key="request" tab="请求参数">
                <a-table
                  class="param-table"
                  :columns="paramColumns"
                  :data-source="detail.requestParams"
                  :pagination="requestParamPagination"
                  size="small"
                  row-key="key"
                  table-layout="fixed"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'sample'">
                      <ParamSampleCell :sample="record.sample" :record="record" />
                    </template>
                    <template v-else-if="column.key === 'dataTag'">
                      <a-tag v-if="record.dataTag && record.dataTag !== '-'" color="blue">
                        <span class="param-tag-ai">AI</span>
                        {{ record.dataTag }}
                      </a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="column.key === 'sensitive'">
                      <a-tag :color="record.sensitive === '是' ? 'red' : 'default'">{{ record.sensitive }}</a-tag>
                    </template>
                  </template>
                </a-table>
              </a-tab-pane>

              <a-tab-pane key="response" tab="返回参数">
                <a-table
                  class="param-table"
                  :columns="paramColumns"
                  :data-source="detail.responseParams"
                  :pagination="responseParamPagination"
                  size="small"
                  row-key="key"
                  table-layout="fixed"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'sample'">
                      <ParamSampleCell :sample="record.sample" :record="record" />
                    </template>
                    <template v-else-if="column.key === 'dataTag'">
                      <a-tag v-if="record.dataTag && record.dataTag !== '-'" color="green">
                        <span class="param-tag-ai">AI</span>
                        {{ record.dataTag }}
                      </a-tag>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="column.key === 'sensitive'">
                      <a-tag :color="record.sensitive === '是' ? 'red' : 'default'">{{ record.sensitive }}</a-tag>
                    </template>
                  </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
            </a-tabs>
          </a-tab-pane>

          <a-tab-pane key="defects" tab="API缺陷">
            <div class="defect-panel">
              <div class="defect-summary-card">
                <div class="defect-summary-card__body">
                  <div class="defect-pending">
                    <span class="defect-pending__label">待处理 API 缺陷</span>
                    <span class="defect-pending__value">{{ pendingDefectCount }}</span>
                  </div>
                  <div class="defect-severity">
                    <span class="defect-severity__label">高中低分布</span>
                    <div class="defect-severity__list">
                      <button
                        v-for="item in defectSeverityDistribution"
                        :key="item.severity"
                        type="button"
                        class="defect-severity__item"
                        :class="`defect-severity__item--${item.className}`"
                        @click="handleDefectJump(item.severity)"
                      >
                        <i class="defect-severity__dot" />
                        <span class="defect-severity__name">{{ item.label }}危</span>
                        <span class="defect-severity__count">{{ item.count }}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="pendingDefectCount" class="defect-severity-bar">
                  <div
                    v-for="item in activeDefectDistribution"
                    :key="item.severity"
                    class="defect-severity-bar__segment"
                    :class="`defect-severity-bar__segment--${item.className}`"
                    :style="{ flex: item.count }"
                    :title="`${item.label}危 ${item.count}`"
                  />
                </div>
              </div>

              <div class="defect-types">
                <div class="defect-types__head">缺陷分布</div>
                <div v-if="detail.defects.length" class="defect-types__list">
                  <button
                    v-for="item in detail.defects"
                    :key="item.key"
                    type="button"
                    class="defect-type-row"
                    @click="handleDefectJump(item.severity)"
                  >
                    <span
                      class="defect-type-row__level"
                      :class="`defect-type-row__level--${severityClass(item.severity)}`"
                    >
                      {{ item.severity }}危
                    </span>
                    <span class="defect-type-row__name">{{ item.name }}</span>
                    <RightOutlined class="defect-type-row__arrow" />
                  </button>
                </div>
                <div v-else class="defect-types__empty">
                  <CheckCircleOutlined />
                  <span>暂无 API 缺陷</span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </section>
    </template>

    <template #footer>
      <div class="detail-footer">
        <a-space wrap>
          <a-button @click="message.info('查看日志（演示）')">
            <template #icon><FileTextOutlined /></template>
            查看日志
          </a-button>
          <a-button @click="message.info('解码工具（演示）')">解码工具</a-button>
          <a-button :class="['ai-footer-btn', { 'ai-footer-btn--active': showAiBlock }]" @click="toggleAiBlock">
            <template #icon><RobotOutlined /></template>
            AI解读
          </a-button>
        </a-space>
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button :disabled="!hasPrev" @click="emit('prev')">上一条</a-button>
          <a-button type="primary" :disabled="!hasNext" @click="emit('next')">下一条</a-button>
        </a-space>
      </div>
    </template>

  </a-drawer>
</template>

<script setup lang="ts">
  import { CheckCircleOutlined, DownOutlined, FileTextOutlined, RightOutlined, RobotOutlined, UpOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import { computed, nextTick, ref, watch } from 'vue';
  import type { ApiDefectItem, ApiDetail, ApiLifecycle, ApiMethod, ApiParameterRow } from '../types';
  import AiDataTagList from './AiDataTagList.vue';
  import ParamSampleCell from './ParamSampleCell.vue';

  const props = defineProps<{
    open: boolean;
    detail: ApiDetail | null;
    hasPrev: boolean;
    hasNext: boolean;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    prev: [];
    next: [];
  }>();

  const detailContentTab = ref('snapshot');
  const snapshotTab = ref('message');
  const paramTab = ref('request');
  const requestTab = ref('raw');
  const responseTab = ref('raw');
  const requestSearch = ref('');
  const highlightIndex = ref(0);
  const showAiBlock = ref(false);
  const aiBlockRef = ref<HTMLElement | null>(null);
  const requestParamCurrent = ref(1);
  const requestParamPageSize = ref(10);
  const responseParamCurrent = ref(1);
  const responseParamPageSize = ref(10);

  const paramPageSizeOptions = ['5', '10', '20', '50'];

  const requestParamPagination = computed(() => ({
    current: requestParamCurrent.value,
    pageSize: requestParamPageSize.value,
    total: props.detail?.requestParams.length ?? 0,
    showSizeChanger: true,
    pageSizeOptions: paramPageSizeOptions,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      requestParamCurrent.value = page;
      requestParamPageSize.value = pageSize;
    },
    onShowSizeChange: (_page: number, pageSize: number) => {
      requestParamCurrent.value = 1;
      requestParamPageSize.value = pageSize;
    }
  }));

  const responseParamPagination = computed(() => ({
    current: responseParamCurrent.value,
    pageSize: responseParamPageSize.value,
    total: props.detail?.responseParams.length ?? 0,
    showSizeChanger: true,
    pageSizeOptions: paramPageSizeOptions,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      responseParamCurrent.value = page;
      responseParamPageSize.value = pageSize;
    },
    onShowSizeChange: (_page: number, pageSize: number) => {
      responseParamCurrent.value = 1;
      responseParamPageSize.value = pageSize;
    }
  }));

  const paramColumns: TableColumnType<ApiParameterRow>[] = [
    { title: '参数名', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'paramType', key: 'paramType', ellipsis: true },
    { title: '参数样例', dataIndex: 'sample', key: 'sample', width: 132, ellipsis: true },
    { title: '数据标签', dataIndex: 'dataTag', key: 'dataTag', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', ellipsis: true },
    { title: '分级', dataIndex: 'level', key: 'level', ellipsis: true },
    { title: '敏感', dataIndex: 'sensitive', key: 'sensitive', ellipsis: true }
  ];

  const pendingDefectCount = computed(
    () => props.detail?.defects.filter((item) => item.status === '待处置').length ?? 0
  );

  const defectSeverityDistribution = computed(() => {
    const defects = props.detail?.defects || [];
    const countBySeverity = (severity: ApiDefectItem['severity']) =>
      defects.filter((item) => item.severity === severity).length;

    return [
      { severity: '高' as const, label: '高', className: 'high', count: countBySeverity('高') },
      { severity: '中' as const, label: '中', className: 'medium', count: countBySeverity('中') },
      { severity: '低' as const, label: '低', className: 'low', count: countBySeverity('低') }
    ];
  });

  const activeDefectDistribution = computed(() =>
    defectSeverityDistribution.value.filter((item) => item.count > 0)
  );

  const activeRequestContent = computed(() => {
    if (!props.detail) return '';
    const snap = props.detail.snapshot;
    if (requestTab.value === 'header') return snap.requestHeader;
    if (requestTab.value === 'cookie') return snap.requestCookie;
    if (requestTab.value === 'body') return snap.requestBody;
    return snap.requestRaw;
  });

  const activeResponseContent = computed(() => {
    if (!props.detail) return '';
    const snap = props.detail.snapshot;
    if (responseTab.value === 'header') return snap.responseHeader;
    if (responseTab.value === 'setCookie') return snap.responseSetCookie;
    if (responseTab.value === 'body') return snap.responseBody;
    return snap.responseRaw;
  });

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function applySearchHighlight(content: string, keyword: string) {
    const kw = keyword.trim();
    const escaped = escapeHtml(content);
    if (!kw) return escaped;
    const pattern = new RegExp(escapeHtml(kw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return escaped.replace(pattern, (match) => `<mark>${match}</mark>`);
  }

  function applyTagHighlight(content: string, tag?: string) {
    const escaped = escapeHtml(content);
    if (!tag || responseTab.value === 'header' || responseTab.value === 'setCookie') return escaped;
    const pattern = new RegExp(escapeHtml(tag).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return escaped.replace(pattern, (match) => `<mark class="tag-mark">${match}</mark>`);
  }

  const highlightedRequest = computed(() =>
    applySearchHighlight(activeRequestContent.value, requestSearch.value)
  );
  const highlightedResponse = computed(() =>
    applyTagHighlight(activeResponseContent.value, props.detail?.snapshot.highlightTag)
  );

  watch(
    () => props.detail?.id,
    () => {
      detailContentTab.value = 'snapshot';
      snapshotTab.value = 'message';
      paramTab.value = 'request';
      requestParamCurrent.value = 1;
      responseParamCurrent.value = 1;
      requestTab.value = 'raw';
      responseTab.value = 'raw';
      requestSearch.value = '';
      highlightIndex.value = 0;
      showAiBlock.value = false;
    }
  );

  async function toggleAiBlock() {
    showAiBlock.value = !showAiBlock.value;
    if (showAiBlock.value) {
      await nextTick();
      aiBlockRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

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

  function severityClass(severity: ApiDefectItem['severity']) {
    if (severity === '高') return 'high';
    if (severity === '中') return 'medium';
    return 'low';
  }

  function handleDefectJump(severity: ApiDefectItem['severity']) {
    message.info(`跳转至${severity}危API缺陷列表（演示）`);
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label}已复制`);
    } catch {
      message.error('复制失败');
    }
  }

  function handleClose() {
    emit('update:open', false);
  }
</script>

<style lang="less" scoped>
  .detail-section {
    margin-bottom: 20px;
  }

  .section-title {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .detail-content-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 14px;
    }
  }

  .basic-info-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: stretch;

    &--with-ai {
      grid-template-columns: minmax(0, 1fr) 360px;

      .ai-interpret-grid {
        grid-template-columns: 1fr;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 20px;
    padding: 16px;
    border-radius: 8px;
    background: #fafbfd;
    border: 1px solid #eef1f6;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;

    &--span3 {
      grid-column: 1 / -1;
    }

    &__label {
      font-size: 12px;
      color: #8c9ab3;
      line-height: 1.4;
    }

    &__value {
      font-size: 13px;
      color: #1f2a44;
      line-height: 1.5;
      word-break: break-all;

      &--desc {
        color: #4a5874;
      }
    }
  }

  .label-with-ai {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ai-label-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 18px;
    padding: 0 5px;
    border-radius: 4px;
    background: linear-gradient(135deg, #722ed1 0%, #1677ff 100%);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    cursor: help;
  }

  .is-api-value--yes {
    font-weight: 600;
    color: #389e0d;
  }

  .is-api-value--no {
    font-weight: 600;
    color: #cf1322;
  }

  .is-api-value--unknown {
    color: #8c9ab3;
  }

  .is-sensitive-value--yes {
    font-weight: 600;
    color: #cf1322;
  }

  .is-sensitive-value--no {
    font-weight: 600;
    color: #389e0d;
  }

  .api-path-text {
    margin-left: 6px;
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
    flex-shrink: 0;

    &--new {
      background: #52c41a;
    }

    &--active {
      background: #1677ff;
    }

    &--offline {
      background: #faad14;
    }

    &--revive {
      background: #722ed1;
    }
  }

  .ai-interpret-block {
    height: 100%;
    padding: 14px 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f0f5ff 0%, #f9f0ff 100%);
    border: 1px solid #d6e4ff;
    min-height: 100%;
    box-shadow: 0 8px 24px rgba(31, 42, 68, 0.08);
  }

  .ai-interpret-block__head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .ai-interpret-block__icon {
    font-size: 16px;
    color: #722ed1;
  }

  .ai-interpret-block__title {
    font-size: 14px;
    font-weight: 600;
    color: #722ed1;
  }

  .ai-interpret-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 20px;
  }

  .ai-interpret-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    &--full {
      grid-column: 1 / -1;
    }

    &__label {
      font-size: 12px;
      color: #8c9ab3;
      line-height: 1.4;
    }

    &__value {
      font-size: 13px;
      color: #1f2a44;
      line-height: 1.5;
      word-break: break-all;

      &--desc {
        color: #4a5874;
      }

      &--hover {
        align-self: flex-start;
        cursor: help;
        border-bottom: 1px dashed currentColor;
      }
    }
  }

  .defect-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .defect-summary-card {
    padding: 16px;
    border: 1px solid #eef1f6;
    border-radius: 8px;
    background: #fafbfd;
  }

  .defect-summary-card__body {
    display: flex;
    align-items: stretch;
    gap: 24px;
  }

  .defect-pending {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-width: 132px;
    padding-right: 24px;
    border-right: 1px solid #e8edf5;

    &__label {
      font-size: 12px;
      color: #8c9ab3;
      line-height: 1.4;
    }

    &__value {
      font-size: 32px;
      font-weight: 600;
      color: #1f2a44;
      line-height: 1;
    }
  }

  .defect-severity {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    min-width: 0;

    &__label {
      font-size: 12px;
      color: #8c9ab3;
      line-height: 1.4;
    }

    &__list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      padding: 10px 12px;
      border: 1px solid #e8edf5;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:hover {
        border-color: #d6e4ff;
        box-shadow: 0 4px 12px rgba(31, 42, 68, 0.06);
      }

      &--high .defect-severity__dot {
        background: #f5222d;
      }

      &--medium .defect-severity__dot {
        background: #fa8c16;
      }

      &--low .defect-severity__dot {
        background: #1677ff;
      }
    }

    &__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    &__name {
      font-size: 13px;
      color: #4a5874;
      flex: 1;
      text-align: left;
    }

    &__count {
      font-size: 18px;
      font-weight: 600;
      color: #1f2a44;
      line-height: 1;
    }
  }

  .defect-severity-bar {
    display: flex;
    gap: 2px;
    height: 6px;
    margin-top: 14px;
    overflow: hidden;
    border-radius: 999px;
    background: #eef1f6;

    &__segment {
      min-width: 8px;
      transition: flex 0.2s;

      &--high {
        background: #f5222d;
      }

      &--medium {
        background: #fa8c16;
      }

      &--low {
        background: #1677ff;
      }
    }
  }

  .defect-types {
    border: 1px solid #eef1f6;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;

    &__head {
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #1f2a44;
      background: #fafbfd;
      border-bottom: 1px solid #eef1f6;
    }

    &__list {
      display: flex;
      flex-direction: column;
    }

    &__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 28px 16px;
      font-size: 13px;
      color: #8c9ab3;
    }
  }

  .defect-type-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border: 0;
    border-bottom: 1px solid #f0f2f5;
    background: #fff;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;

    &:last-child {
      border-bottom: 0;
    }

    &:hover {
      background: #fafbfd;

      .defect-type-row__arrow {
        color: #1677ff;
        transform: translateX(2px);
      }
    }

    &__level {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      height: 22px;
      padding: 0 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;

      &--high {
        color: #cf1322;
        background: #fff1f0;
      }

      &--medium {
        color: #d46b08;
        background: #fff7e6;
      }

      &--low {
        color: #1677ff;
        background: #e6f4ff;
      }
    }

    &__name {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      color: #1f2a44;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__arrow {
      font-size: 12px;
      color: #b8c2d6;
      transition: color 0.2s, transform 0.2s;
    }
  }

  .snapshot-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;

    .section-title {
      margin-bottom: 0;
    }
  }

  .snapshot-main-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 12px;
    }
  }

  .snapshot-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .snapshot-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .snapshot-panel {
    border: 1px solid #e8edf5;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      background: #fafbfd;
      border-bottom: 1px solid #e8edf5;
    }

    &__title {
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;

      &--bar {
        padding: 8px 12px;
        background: #fafbfd;
        border-bottom: 1px solid #e8edf5;
      }
    }

    :deep(.ant-tabs-nav) {
      margin: 0 12px;
    }
  }

  .snapshot-search {
    margin: 8px 12px 0;
    width: calc(100% - 24px);
  }

  .highlight-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 8px 12px 0;
    padding: 4px 8px;
    border-radius: 4px;
    background: #e6f4ff;
    font-size: 12px;
    color: #1677ff;
  }

  .snapshot-code {
    margin: 8px 0 0;
    padding: 12px;
    height: 280px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.5;
    background: #fafbfd;
    border-top: 1px solid #e8edf5;
    white-space: pre-wrap;
    word-break: break-all;

    :deep(mark) {
      background: #fff566;
      padding: 0 2px;
    }

    :deep(.tag-mark) {
      background: #91caff;
    }
  }

  .param-main-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 12px;
    }
  }

  .param-table {
    :deep(.ant-table) {
      table-layout: fixed;
    }

    :deep(.ant-table-thead > tr > th),
    :deep(.ant-table-tbody > tr > td) {
      width: calc(100% / 7);
      padding: 8px 10px;
      text-align: left;
      vertical-align: middle;
    }

    :deep(.ant-table-thead > tr > th) {
      white-space: nowrap;
    }

    :deep(.ant-table-cell) {
      overflow: hidden;
    }

    :deep(.ant-pagination) {
      margin: 12px 0 4px;
    }
  }

  .param-tag-ai {
    display: inline-block;
    margin-right: 4px;
    padding: 0 3px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.3);
    font-size: 9px;
    font-weight: 700;
  }

  .detail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ai-footer-btn {
    color: #722ed1;
    border-color: #d3adf7;

    &--active,
    &:hover {
      color: #531dab;
      border-color: #b37feb;
      background: #f9f0ff;
    }
  }
</style>
