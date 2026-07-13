<template>
  <a-drawer
    :open="open"
    placement="right"
    width="1440"
    destroy-on-close
    class="defect-detail-drawer"
    :body-style="{ padding: '16px 20px 80px' }"
    @close="handleClose"
  >
    <template v-if="detail">
      <div class="defect-detail">
        <div class="defect-detail__header">
          <div class="defect-detail__title-row">
            <a-tag :color="severityColor(detail.severity)" class="severity-tag">{{ detail.severity }}</a-tag>
            <span class="defect-detail__title">{{ detail.defectName }}</span>
            <span class="ai-result-tag">AI研判结果：{{ detail.aiVerdict }}</span>
          </div>
        </div>

        <a-tabs v-model:active-key="activeTab" class="defect-detail__tabs">
          <a-tab-pane key="basic" tab="基本信息" />
          <a-tab-pane key="alert" tab="告警信息" />
        </a-tabs>

        <div v-if="activeTab === 'basic'" class="defect-detail__body">
          <div class="defect-detail__main">
            <section class="detail-section">
              <div class="detail-section__title">缺陷信息</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-item__label">缺陷类型</span>
                  <span class="info-item__value">
                    <a-tag color="orange">{{ detail.defectType }}</a-tag>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">OWASP API</span>
                  <span class="info-item__value">
                    <a-tag color="orange">{{ detail.owaspApi }}</a-tag>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">缺陷ID</span>
                  <span class="info-item__value">{{ detail.defectId }}</span>
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
                  <span class="info-item__label">缺陷状态</span>
                  <span class="info-item__value status-value">
                    {{ detail.displayStatus }}
                    <EditOutlined class="status-edit-icon" @click="handleEditStatus" />
                  </span>
                </div>
              </div>

              <div class="info-box info-box--warning">
                <div class="info-box__title">可被利用方式</div>
                <div class="info-box__content">{{ detail.exploitableMethod }}</div>
              </div>
              <div class="info-box info-box--success">
                <div class="info-box__title">修复建议</div>
                <div class="info-box__content">{{ detail.remediation }}</div>
              </div>
            </section>

            <section class="detail-section">
              <div class="detail-section__title">API信息</div>
              <div class="info-grid">
                <div class="info-item info-item--span2">
                  <span class="info-item__label">API</span>
                  <span class="info-item__value">
                    <a-tag :color="methodColor(detail.method)">{{ detail.method }}</a-tag>
                    <span class="api-path">{{ detail.path }}</span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">部署域</span>
                  <span class="info-item__value">{{ detail.deployDomain }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">访问域</span>
                  <span class="info-item__value">{{ detail.accessDomain }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">访问量</span>
                  <span class="info-item__value">{{ detail.visits }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">API类型</span>
                  <span class="info-item__value">{{ detail.apiType }}</span>
                </div>
                <div class="info-item">
                  <span class="info-item__label">API返回类型</span>
                  <span class="info-item__value">{{ detail.responseContentType }}</span>
                </div>
                <div class="info-item info-item--span2">
                  <span class="info-item__label">应用名称</span>
                  <span class="info-item__value">
                    {{ detail.appName }}
                    <a-tag v-if="detail.appStatus" :color="appStatusColor(detail.appStatus)" class="app-status-tag">
                      {{ detail.appStatus }}
                    </a-tag>
                  </span>
                </div>
                <div class="info-item info-item--span2">
                  <span class="info-item__label">应用域名</span>
                  <span class="info-item__value">{{ detail.appDomain }}</span>
                </div>
                <div class="info-item info-item--span2">
                  <span class="info-item__label">请求数据标签</span>
                  <span class="info-item__value">
                    <AiDataTagList :tags="detail.requestTags" color="orange" />
                  </span>
                </div>
                <div class="info-item info-item--span2">
                  <span class="info-item__label">返回数据标签</span>
                  <span class="info-item__value">
                    <AiDataTagList :tags="detail.responseTags" color="orange" />
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside class="handling-sidebar">
            <div class="handling-sidebar__title">处置记录</div>
            <div class="handling-timeline">
              <div v-for="(item, index) in detail.handlingRecords" :key="index" class="handling-timeline__item">
                <div class="handling-timeline__dot" />
                <div class="handling-timeline__content">
                  <div class="handling-timeline__time">{{ item.time }}</div>
                  <div class="handling-timeline__text">{{ item.content }}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="defect-detail__tab-panel">
          <DefectAlertPanel
            :instances="detail.alertInstances"
            :active-id="activeAlertId"
            :ai-judgment="detail.aiJudgment"
            @select="activeAlertId = $event"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="defect-detail__footer">
        <a-space>
          <a-button @click="handleDecodeTool">解码工具</a-button>
          <a-button @click="activeTab = 'alert'">告警日志</a-button>
          <a-button class="ai-judgment-btn" @click="handleAiJudgment">
            <template #icon><RobotOutlined /></template>
            AI研判
          </a-button>
          <a-button type="primary" ghost @click="handleProcess">处置</a-button>
        </a-space>
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button type="primary" disabled>确定</a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
  import { EditOutlined, RobotOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import AiDataTagList from '../../api-management/components/AiDataTagList.vue';
  import DefectAlertPanel from './DefectAlertPanel.vue';
  import type { ApiDefectDetail, DefectSeverity } from '../types';

  const props = defineProps<{
    open: boolean;
    detail: ApiDefectDetail | null;
    initialTab?: 'basic' | 'alert';
  }>();

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'process', detail: ApiDefectDetail): void;
  }>();

  const activeTab = ref('basic');
  const activeAlertId = ref('');

  watch(
    () => props.open,
    (visible) => {
      if (!visible) return;
      activeTab.value = props.initialTab ?? 'basic';
      activeAlertId.value = props.detail?.alertInstances[0]?.id || '';
    }
  );

  watch(
    () => props.detail?.id,
    () => {
      activeAlertId.value = props.detail?.alertInstances[0]?.id || '';
    }
  );

  function handleClose() {
    emit('update:open', false);
  }

  function handleEditStatus() {
    message.info('修改缺陷状态（演示）');
  }

  function handleDecodeTool() {
    message.info('打开解码工具（演示）');
  }

  function handleAiJudgment() {
    activeTab.value = 'alert';
  }

  function handleProcess() {
    if (props.detail) emit('process', props.detail);
    message.info('进入缺陷处置流程（演示）');
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

  function appStatusColor(status: string) {
    if (status === '重要' || status === '关键') return 'orange';
    if (status === '确认') return 'blue';
    return 'default';
  }
</script>

<style lang="less" scoped>
  .defect-detail__header {
    padding-bottom: 4px;
  }

  .defect-detail__title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex-wrap: wrap;
  }

  .severity-tag {
    margin: 0;
    flex-shrink: 0;
  }

  .defect-detail__title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2a44;
  }

  .ai-result-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 10px;
    border-radius: 4px;
    background: #f9f0ff;
    color: #722ed1;
    font-size: 12px;
    white-space: nowrap;
  }

  .defect-detail__tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }
  }

  .defect-detail__body {
    display: flex;
    gap: 16px;
    min-height: 420px;
    padding-top: 12px;
  }

  .defect-detail__main {
    flex: 1;
    min-width: 0;
  }

  .detail-section {
    margin-bottom: 20px;

    &__title {
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 3px solid #1677ff;
      font-size: 14px;
      font-weight: 600;
      color: #1f2a44;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 24px;
    margin-bottom: 12px;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.6;

    &--span2 {
      grid-column: span 2;
    }

    &__label {
      flex-shrink: 0;
      width: 88px;
      color: var(--color-text-secondary);
    }

    &__value {
      flex: 1;
      min-width: 0;
      color: #1f2a44;
      word-break: break-all;
    }
  }

  .status-value {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .status-edit-icon {
    color: #1677ff;
    cursor: pointer;
  }

  .info-box {
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 6px;

    &__title {
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
    }

    &__content {
      font-size: 13px;
      line-height: 1.7;
      color: #3d4a66;
    }

    &--warning {
      background: #fff7e6;
      border: 1px solid #ffd591;

      .info-box__title {
        color: #d46b08;
      }
    }

    &--success {
      background: #f6ffed;
      border: 1px solid #b7eb8f;

      .info-box__title {
        color: #389e0d;
      }
    }
  }

  .api-path {
    margin-left: 6px;
    color: #1677ff;
  }

  .app-status-tag {
    margin-left: 8px;
  }

  .handling-sidebar {
    width: 220px;
    flex-shrink: 0;
    padding: 12px;
    border-left: 1px solid var(--color-border-secondary);
    background: #fafbfc;

    &__title {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 600;
      color: #1f2a44;
    }
  }

  .handling-timeline {
    &__item {
      display: flex;
      gap: 10px;
      padding-bottom: 16px;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 4px;
        top: 14px;
        bottom: 0;
        width: 1px;
        background: #d9d9d9;
      }
    }

    &__dot {
      width: 9px;
      height: 9px;
      margin-top: 4px;
      border-radius: 50%;
      background: #1677ff;
      flex-shrink: 0;
    }

    &__time {
      font-size: 12px;
      color: var(--color-text-secondary);
    }

    &__text {
      margin-top: 4px;
      font-size: 13px;
      color: #1f2a44;
      line-height: 1.5;
    }
  }

  .defect-detail__tab-panel {
    min-height: 420px;
    padding-top: 16px;
  }

  .defect-detail__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .ai-judgment-btn {
    color: #722ed1;
    border-color: #d3adf7;

    &:hover {
      color: #531dab;
      border-color: #b37feb;
    }
  }
</style>

<style lang="less">
  .defect-detail-drawer {
    .ant-drawer-header {
      display: none;
    }

    .ant-drawer-body {
      padding-top: 20px;
    }
  }
</style>
