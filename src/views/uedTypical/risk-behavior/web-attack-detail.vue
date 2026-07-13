<template>
  <div class="web-attack-detail-container">
    <a-card style="height: 100%">
      <div class="detail-header">
        <div class="detail-header__left">
          <a-button type="link" class="back-btn" @click="goBack">
            <template #icon><ArrowLeftOutlined /></template>
          </a-button>
          <div class="detail-header__title-row">
            <a-tag :color="severityColor(detail?.severity)" class="severity-tag">{{ detail?.severity }}</a-tag>
            <h2 class="detail-title">{{ detail?.title || 'Web攻击详情' }}</h2>
            <template v-if="detail">
              <span class="ai-meta-tag">API研判：{{ detail.aiVerdict }}</span>
            </template>
          </div>
        </div>
        <div class="detail-header__actions">
          <a-button @click="handleDecode">解码工具</a-button>
          <a-badge :count="2" :offset="[6, 0]">
            <a-button @click="handleAlertLog">告警日志</a-button>
          </a-badge>
          <a-button type="primary" @click="handleDispose">处置</a-button>
        </div>
      </div>

      <a-spin :spinning="loading">
        <template v-if="detail">
          <section class="attack-info-section">
            <div class="section-title">攻击信息</div>
            <div class="attack-info-layout">
              <div class="attack-info-top">
                <div class="attack-info-grid">
                  <div class="info-item">
                    <span class="info-item__label">攻击编号</span>
                    <span class="info-item__value">{{ detail.attackId }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-item__label">攻击名称</span>
                    <span class="info-item__value">
                      <a-tag :color="severityColor(detail.severity)" class="severity-tag">{{ detail.severity }}</a-tag>
                      {{ detail.attackName }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-item__label">源IP</span>
                    <span class="info-item__value">{{ detail.sourceIp }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-item__label">攻击次数</span>
                    <span class="info-item__value">{{ detail.attackCount }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-item__label">关联应用</span>
                    <span class="info-item__value">
                      {{ detail.appName }}
                      <a-tag class="domain-tag">{{ detail.appDomain }}</a-tag>
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
                    <span class="info-item__label">风险状态</span>
                    <span class="info-item__value status-value">
                      {{ detail.riskStatus }}
                      <EditOutlined class="status-edit-icon" @click="handleEditStatus" />
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-item__label">事件结果</span>
                    <span class="info-item__value">{{ detail.eventResult }}</span>
                  </div>
                </div>

                <aside class="disposal-panel">
                  <div class="disposal-panel__title">处置记录</div>
                  <a-timeline>
                    <a-timeline-item v-for="(item, index) in detail.disposalRecords" :key="index" color="blue">
                      <div class="disposal-item">
                        <div class="disposal-item__time">{{ item.time }}</div>
                        <div class="disposal-item__content">{{ item.content }}</div>
                      </div>
                    </a-timeline-item>
                  </a-timeline>
                </aside>
              </div>

              <div class="ai-judgment-section">
                <DefectAiJudgmentPanel :judgment="detail.aiJudgment" />
              </div>
            </div>
          </section>

          <section class="alert-table-section">
            <div class="section-title">告警信息</div>
            <a-table
              :columns="alertColumns"
              :data-source="pagedAlerts"
              :pagination="false"
              row-key="id"
              size="middle"
              :scroll="{ x: 1400 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'apiUrl'">
                  <div class="api-url-cell">
                    <a-tag color="green" class="api-tag">API</a-tag>
                    <span class="api-path">{{ record.method }} {{ record.path }}</span>
                  </div>
                </template>

                <template v-else-if="column.key === 'server'">
                  <div class="endpoint-cell">
                    <div>{{ record.serverApp }}</div>
                    <div class="endpoint-cell__sub">IP：{{ record.serverIp }}</div>
                    <div class="endpoint-cell__sub">端口：{{ record.serverPort }}</div>
                  </div>
                </template>

                <template v-else-if="column.key === 'client'">
                  <div class="endpoint-cell">
                    <div class="endpoint-cell__sub">IP：{{ record.clientIp }}</div>
                    <div class="endpoint-cell__sub">端口：{{ record.clientPort }}</div>
                  </div>
                </template>

                <template v-else-if="column.key === 'alertName'">
                  <span class="alert-name-cell">
                    <a-tag :color="severityColor(record.alertSeverity)" class="severity-tag">
                      {{ record.alertSeverity }}
                    </a-tag>
                    {{ record.alertName }}
                  </span>
                </template>

                <template v-else-if="column.key === 'summary'">
                  <div class="summary-cell">
                    <div>{{ record.summaryRequest }}</div>
                    <div>{{ record.summaryResponse }}</div>
                  </div>
                </template>

                <template v-else-if="column.key === 'action'">
                  <a-button type="link" size="small" @click="handleAlertDetail(record)">详情</a-button>
                </template>
              </template>
            </a-table>

            <div class="pagination-bar">
              <a-pagination
                v-model:current="pagination.current"
                v-model:page-size="pagination.pageSize"
                :total="pagination.total"
                :show-size-changer="true"
                :page-size-options="['10', '20', '50', '100']"
                :show-quick-jumper="true"
                :show-total="(total: number) => `共 ${total} 条`"
              />
            </div>
          </section>
        </template>

        <a-empty v-else-if="!loading" description="未找到 Web 攻击详情" />
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import DefectAiJudgmentPanel from '../api-defect-list/components/DefectAiJudgmentPanel.vue';
  import { buildWebAttackDetail } from './web-attack-detail-mock';
  import type { WebAttackAlertRow, WebAttackDetail } from './web-attack-detail-types';

  const route = useRoute();
  const router = useRouter();

  const loading = ref(false);
  const detail = ref<WebAttackDetail | null>(null);

  const pagination = reactive({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const alertColumns: TableColumnType<WebAttackAlertRow>[] = [
    { title: '发生时间', dataIndex: 'occurredAt', key: 'occurredAt', width: 170 },
    { title: 'API/URL', key: 'apiUrl', width: 320 },
    { title: '服务端', key: 'server', width: 180 },
    { title: '客户端', key: 'client', width: 150 },
    { title: '告警名称', key: 'alertName', width: 140 },
    { title: '概要信息', key: 'summary', width: 360 },
    { title: '操作', key: 'action', width: 80, fixed: 'right', align: 'center' }
  ];

  const pagedAlerts = computed(() => {
    if (!detail.value) return [];
    const start = (pagination.current - 1) * pagination.pageSize;
    return detail.value.alerts.slice(start, start + pagination.pageSize);
  });

  watch(
    () => detail.value?.alerts.length,
    (count) => {
      pagination.total = count || 0;
    },
    { immediate: true }
  );

  function loadDetail() {
    const id = String(route.params.id || '');
    loading.value = true;
    detail.value = buildWebAttackDetail(id);
    loading.value = false;
  }

  function goBack() {
    router.push('/risk-behavior');
  }

  function severityColor(severity?: string) {
    if (severity === '高') return 'red';
    if (severity === '中') return 'orange';
    return 'blue';
  }

  function handleDecode() {
    message.info('解码工具（演示）');
  }

  function handleAlertLog() {
    message.info('告警日志（演示）');
  }

  function handleDispose() {
    message.info('进入处置流程（演示）');
  }

  function handleEditStatus() {
    message.info('编辑风险状态（演示）');
  }

  function handleAlertDetail(record: WebAttackAlertRow) {
    message.info(`查看告警详情：${record.alertName}`);
  }

  onMounted(() => {
    loadDetail();
  });

  watch(
    () => route.params.id,
    () => loadDetail()
  );
</script>

<style lang="less" scoped>
  .web-attack-detail-container {
    padding: 20px;
    height: 100%;
  }

  .detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border-secondary, var(--color-component-stroke));
  }

  .detail-header__left {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    min-width: 0;
  }

  .back-btn {
    padding-left: 0;
    margin-top: 2px;
  }

  .detail-header__title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }

  .detail-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2a44;
  }

  .severity-tag {
    margin: 0;
  }

  .ai-meta-tag {
    padding: 2px 10px;
    border: 1px solid #d3adf7;
    border-radius: 4px;
    background: #f9f0ff;
    color: #531dab;
    font-size: 12px;
    line-height: 20px;
  }

  .detail-header__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .attack-info-section {
    margin-bottom: 16px;
  }

  .section-title {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .attack-info-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--color-border-secondary, var(--color-component-stroke));
    border-radius: 8px;
    background: #fafbfc;
  }

  .attack-info-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 16px;
    align-items: start;
  }

  .ai-judgment-section {
    min-width: 0;

    :deep(.ai-judgment-timeline) {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0 24px;
      padding-left: 0;
      overflow: visible;
    }

    :deep(.ai-judgment-timeline__item) {
      padding-bottom: 0;

      &::after {
        display: none;
      }
    }
  }

  .attack-info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 24px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;

    &__label {
      color: var(--color-text-secondary);
      font-size: 12px;
    }

    &__value {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      color: #1f2a44;
      font-size: 13px;
      line-height: 1.6;
    }
  }

  .domain-tag {
    margin: 0;
    color: #1677ff;
    background: #e6f4ff;
    border-color: #bae0ff;
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

  .disposal-panel {
    padding: 12px 14px;
    border: 1px solid var(--color-border-secondary, var(--color-component-stroke));
    border-radius: 8px;
    background: #fff;

    &__title {
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #1f2a44;
    }
  }

  .disposal-item {
    &__time {
      color: var(--color-text-secondary);
      font-size: 12px;
    }

    &__content {
      margin-top: 2px;
      color: #1f2a44;
      font-size: 13px;
    }
  }

  .alert-table-section {
    margin-top: 4px;
  }

  .api-url-cell {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 12px;
    line-height: 1.6;
  }

  .api-tag {
    margin: 0;
    flex-shrink: 0;
  }

  .api-path {
    color: #1677ff;
    word-break: break-all;
  }

  .endpoint-cell,
  .summary-cell {
    font-size: 12px;
    line-height: 1.7;
    color: #3d4a66;

    &__sub {
      color: var(--color-text-secondary);
    }
  }

  .alert-name-cell {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  @media (max-width: 1200px) {
    .attack-info-top {
      grid-template-columns: 1fr;
    }

    .attack-info-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ai-judgment-section {
      :deep(.ai-judgment-timeline) {
        grid-template-columns: 1fr;
        gap: 10px 0;
      }

      :deep(.ai-judgment-timeline__item) {
        padding-bottom: 10px;
      }
    }
  }
</style>
