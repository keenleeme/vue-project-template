<template>
  <div class="defect-alert-panel">
    <div class="alert-main-row">
      <div class="alert-left-panel">
        <div class="alert-section-head">
          <div class="alert-section-title">告警信息</div>
          <div class="alert-time-list">
            <button
              v-for="item in instances"
              :key="item.id"
              type="button"
              class="alert-time-chip"
              :class="{ 'alert-time-chip--active': item.id === activeId }"
              @click="emit('select', item.id)"
            >
              {{ item.time }}
            </button>
          </div>
        </div>

        <div class="hit-info-panel">
          <div class="alert-subsection-title">命中信息</div>
          <a-table
            class="hit-rule-table"
            :columns="hitRuleColumns"
            :data-source="currentInstance?.hitRules || []"
            :pagination="false"
            row-key="ruleNo"
            size="small"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'ruleNo'">
                <span>{{ record.ruleNo }}</span>
                <a-tooltip v-if="record.showHelp" title="规则关系表示多条命中规则之间的逻辑组合">
                  <QuestionCircleOutlined class="rule-help-icon" />
                </a-tooltip>
              </template>
              <template v-else-if="column.key === 'snapshot'">
                <span class="hit-snapshot" v-html="renderHitSnapshot(record.snapshot, record.highlightText)" />
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <div class="ai-judgment-panel">
        <DefectAiJudgmentPanel :judgment="aiJudgment" />
      </div>
    </div>

    <div class="alert-section-title">日志信息</div>
    <div v-if="currentInstance?.logInfo" class="log-info-flow">
      <div class="log-info-card">
        <div class="log-info-card__title">客户端</div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">IP:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.client.ip }}</span>
          <a-tag class="log-info-card__tag">{{ currentInstance.logInfo.client.networkDomain }}</a-tag>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">IP地域:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.client.ipRegion }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">端口:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.client.port }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">MAC:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.client.mac }}</span>
        </div>
      </div>

      <div class="log-info-arrow" aria-hidden="true">
        <RightOutlined />
      </div>

      <div class="log-info-card log-info-card--center">
        <div class="log-info-card__row">
          <span class="log-info-card__label">传输层协议:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.transportProtocol }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">应用层协议:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.applicationProtocol }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">抓包网卡:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.captureInterface }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">响应时间:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.responseTime }}</span>
        </div>
      </div>

      <div class="log-info-arrow" aria-hidden="true">
        <RightOutlined />
      </div>

      <div class="log-info-card">
        <div class="log-info-card__title">应用</div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">IP:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.application.ip }}</span>
          <a-tag class="log-info-card__tag">{{ currentInstance.logInfo.application.networkDomain }}</a-tag>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">IP地域:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.application.ipRegion }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">端口:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.application.port }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">MAC:</span>
          <span class="log-info-card__value">{{ currentInstance.logInfo.application.mac }}</span>
        </div>
        <div class="log-info-card__row">
          <span class="log-info-card__label">应用名称:</span>
          <a-tooltip :title="currentInstance.logInfo.application.appName">
            <span class="log-info-card__value log-info-card__value--ellipsis">
              {{ currentInstance.logInfo.application.appName }}
            </span>
          </a-tooltip>
        </div>
      </div>
    </div>

    <div class="snapshot-panels">
      <div class="snapshot-panel">
        <div class="snapshot-panel__head">
          <div class="snapshot-panel__title">请求</div>
          <div class="snapshot-actions">
            <a-button type="link" size="small" @click="copyText(activeRequestContent, '请求报文')">
              复制请求报文
            </a-button>
            <a-button type="link" size="small" @click="copyText(currentInstance?.snapshot.requestUrl || '', '请求地址')">
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
        <a-input
          v-model:value="responseSearch"
          allow-clear
          size="small"
          placeholder="请输入搜索关键词"
          class="snapshot-search"
        />
        <pre class="snapshot-code" v-html="highlightedResponse"></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { QuestionCircleOutlined, RightOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import DefectAiJudgmentPanel from './DefectAiJudgmentPanel.vue';
  import type { DefectAiJudgment, DefectAlertInstance, DefectHitRuleRow } from '../types';

  const props = defineProps<{
    instances: DefectAlertInstance[];
    activeId: string;
    aiJudgment: DefectAiJudgment;
  }>();

  const emit = defineEmits<{
    (e: 'select', id: string): void;
  }>();

  const requestTab = ref('raw');
  const responseTab = ref('raw');
  const requestSearch = ref('');
  const responseSearch = ref('');

  const hitRuleColumns: TableColumnType<DefectHitRuleRow>[] = [
    { title: '命中规则序号', dataIndex: 'ruleNo', key: 'ruleNo', width: 140 },
    { title: '命中快照', dataIndex: 'snapshot', key: 'snapshot' }
  ];

  const currentInstance = computed(() => props.instances.find((item) => item.id === props.activeId));

  const activeRequestContent = computed(() => {
    const snap = currentInstance.value?.snapshot;
    if (!snap) return '';
    if (requestTab.value === 'header') return snap.requestHeader;
    if (requestTab.value === 'cookie') return snap.requestCookie;
    if (requestTab.value === 'body') return snap.requestBody;
    return snap.requestRaw;
  });

  const activeResponseContent = computed(() => {
    const snap = currentInstance.value?.snapshot;
    if (!snap) return '';
    if (responseTab.value === 'header') return snap.responseHeader;
    if (responseTab.value === 'setCookie') return snap.responseSetCookie;
    if (responseTab.value === 'body') return snap.responseBody;
    return snap.responseRaw;
  });

  watch(
    () => props.activeId,
    () => {
      requestTab.value = 'raw';
      responseTab.value = 'raw';
      requestSearch.value = '';
      responseSearch.value = '';
    }
  );

  function escapeHtml(text: string) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function applyHighlight(content: string, keyword?: string) {
    const escaped = escapeHtml(content);
    if (!keyword) return escaped;
    const pattern = new RegExp(escapeHtml(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return escaped.replace(pattern, (match) => `<mark class="hit-mark">${match}</mark>`);
  }

  function renderHitSnapshot(snapshot: string, highlightText?: string) {
    return applyHighlight(snapshot, highlightText);
  }

  const highlightedRequest = computed(() => {
    const content = activeRequestContent.value;
    const keyword = requestSearch.value.trim() || currentInstance.value?.snapshot.highlightTag;
    return applyHighlight(content, keyword);
  });

  const highlightedResponse = computed(() => applyHighlight(activeResponseContent.value, responseSearch.value.trim()));

  async function copyText(text: string, label: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label}已复制`);
    } catch {
      message.error('复制失败');
    }
  }
</script>

<style lang="less" scoped>
  .defect-alert-panel {
    padding-top: 4px;
  }

  .alert-main-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .alert-left-panel {
    flex: 0 0 42%;
    max-width: 42%;
    min-width: 0;
  }

  .alert-section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .alert-time-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }

  .alert-time-chip {
    height: 32px;
    padding: 0 14px;
    border: 1px solid #91caff;
    border-radius: 16px;
    background: #fff;
    color: #1677ff;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background: #e6f4ff;
      font-weight: 600;
    }

    &:hover {
      background: #f0f7ff;
    }
  }

  .alert-section-title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
    flex-shrink: 0;

    .alert-section-head & {
      margin-bottom: 0;
    }
  }

  .alert-subsection-title {
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #3d4a66;
  }

  .ai-judgment-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    align-self: flex-start;
  }

  .hit-rule-table {
    margin-bottom: 0;

    :deep(.ant-table-thead > tr > th) {
      background: #fafbfd;
      font-weight: 600;
    }
  }

  .log-info-flow {
    display: flex;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }

  .log-info-arrow {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: #bfbfbf;
    font-size: 14px;
  }

  .log-info-card {
    flex: 1;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid #e8edf5;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

    &--center {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #1f2a44;
    }

    &__row {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      line-height: 1.8;
      color: #3d4a66;

      & + & {
        margin-top: 2px;
      }
    }

    &__label {
      flex-shrink: 0;
      color: var(--color-text-secondary);
    }

    &__value {
      min-width: 0;
      color: #1f2a44;

      &--ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &__tag {
      margin: 0 0 0 4px;
      line-height: 18px;
      font-size: 11px;
      color: var(--color-text-secondary);
      background: #f5f5f5;
      border-color: #e8e8e8;
    }
  }

  .rule-help-icon {
    margin-left: 4px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .hit-snapshot {
    font-size: 13px;
    line-height: 1.6;
    color: #3d4a66;
    word-break: break-all;

    :deep(.hit-mark) {
      background: #ffd591;
      padding: 0 2px;
      color: #d46b08;
    }
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

  .snapshot-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .snapshot-search {
    margin: 8px 12px 0;
    width: calc(100% - 24px);
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

    :deep(mark),
    :deep(.hit-mark) {
      background: #ffd591;
      padding: 0 2px;
      color: #d46b08;
    }
  }
</style>
