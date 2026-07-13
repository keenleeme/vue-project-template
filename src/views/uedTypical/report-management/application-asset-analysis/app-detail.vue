<template>
  <div class="report-detail-container">
    <a-card style="height: 100%">
      <ReportDetailHeader
        :title="pageTitle"
        subtitle="单应用综合分析：资产信息、API 缺陷、攻击风险与行为风险"
        :period="detail?.asset.activeRange || '-'"
        generated-at="2026-06-23 09:00:00"
        back-to="/report-management/application-asset-analysis"
        back-label="返回应用概览"
        @export="handleExport"
        @refresh="loadDetail"
      />

      <a-spin :spinning="loading">
        <template v-if="detail">
          <section class="section-block">
            <div class="section-title">应用基础资产信息</div>
            <a-descriptions bordered :column="3" size="small">
              <a-descriptions-item label="资产名称">{{ detail.asset.assetName }}</a-descriptions-item>
              <a-descriptions-item label="资产生命周期">{{ detail.asset.lifecycle }}</a-descriptions-item>
              <a-descriptions-item label="资产状态">
                <a-tag :color="statusColor(detail.asset.status)">{{ detail.asset.status }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="资产发现时间">{{ detail.asset.discoveredAt }}</a-descriptions-item>
              <a-descriptions-item label="资产活跃时间" :span="2">{{ detail.asset.activeRange }}</a-descriptions-item>
              <a-descriptions-item label="请求数据标签" :span="3">
                <a-space wrap>
                  <a-tag v-for="tag in detail.asset.requestTags" :key="tag" color="blue">{{ tag }}</a-tag>
                </a-space>
              </a-descriptions-item>
              <a-descriptions-item label="返回数据标签" :span="3">
                <a-space wrap>
                  <a-tag v-for="tag in detail.asset.responseTags" :key="tag" color="purple">{{ tag }}</a-tag>
                </a-space>
              </a-descriptions-item>
              <a-descriptions-item label="应用信息" :span="3">{{ detail.asset.appInfo }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="section-block">
            <div class="section-title">风险模块一：API 缺陷</div>
            <a-collapse v-model:active-key="defectKeys" accordion>
              <a-collapse-panel v-for="item in detail.defects" :key="item.id">
                <template #header>
                  <div class="collapse-header">
                    <a-tag :color="levelColor(item.level)">【{{ item.level }}风险】</a-tag>
                    <span>{{ item.name }}</span>
                  </div>
                </template>
                <div class="collapse-body">
                  <p><strong>修复建议：</strong>{{ item.suggestion }}</p>
                  <p><strong>可被利用方式：</strong>{{ item.exploitWay }}</p>
                  <div class="sub-title">关联 API 列表</div>
                  <a-table
                    :columns="apiColumns"
                    :data-source="item.relatedApis"
                    :pagination="false"
                    row-key="apiName"
                    size="small"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'apiName'">
                        <a-button type="link" class="link-btn" @click="handleApiDrill(record.apiName)">
                          {{ record.apiName }}
                        </a-button>
                      </template>
                      <template v-else-if="column.key === 'dataTags'">
                        <a-space wrap :size="4">
                          <a-tag v-for="tag in record.dataTags" :key="tag">{{ tag }}</a-tag>
                        </a-space>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <a-tag :color="record.status === '活跃' ? 'green' : 'default'">{{ record.status }}</a-tag>
                      </template>
                    </template>
                  </a-table>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </section>

          <section class="section-block">
            <div class="section-title">风险模块二：攻击风险</div>
            <a-collapse v-model:active-key="attackKeys" accordion>
              <a-collapse-panel v-for="item in detail.attacks" :key="item.id">
                <template #header>
                  <div class="collapse-header">
                    <a-tag :color="levelColor(item.level)">【{{ item.level }}风险】</a-tag>
                    <span>{{ item.threat }}</span>
                    <span class="time-text">{{ item.occurredAt }}</span>
                  </div>
                </template>
                <div class="collapse-body">
                  <p><strong>修复建议：</strong>{{ item.suggestion }}</p>
                  <p><strong>风险描述：</strong>{{ item.description }}</p>
                  <div class="sub-title">关联 API / URL</div>
                  <a-table
                    :columns="apiColumns"
                    :data-source="item.relatedApis"
                    :pagination="false"
                    row-key="apiName"
                    size="small"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'apiName'">
                        <a-button type="link" class="link-btn" @click="handleApiDrill(record.apiName)">
                          {{ record.apiName }}
                        </a-button>
                      </template>
                      <template v-else-if="column.key === 'dataTags'">
                        <a-space wrap :size="4">
                          <a-tag v-for="tag in record.dataTags" :key="tag">{{ tag }}</a-tag>
                        </a-space>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <a-tag :color="record.status === '活跃' ? 'green' : 'default'">{{ record.status }}</a-tag>
                      </template>
                    </template>
                  </a-table>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </section>

          <section class="section-block">
            <div class="section-title">风险模块三：行为风险</div>
            <a-table
              :columns="behaviorColumns"
              :data-source="detail.behaviors"
              :pagination="false"
              row-key="id"
              size="middle"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'level'">
                  <a-tag :color="levelColor(record.level)">{{ record.level }}风险</a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="behaviorStatusColor(record.status)">{{ record.status }}</a-tag>
                </template>
              </template>
            </a-table>
          </section>
        </template>

        <a-empty v-else-if="!loading" description="未找到应用资产信息" />
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import ReportDetailHeader from '../components/ReportDetailHeader.vue';
  import { fetchAppAssetDetail } from './service';
  import type { AppDetailBundle } from './types';

  const route = useRoute();
  const loading = ref(false);
  const detail = ref<AppDetailBundle | null>(null);
  const defectKeys = ref<string[]>([]);
  const attackKeys = ref<string[]>([]);

  const apiColumns = [
    { title: 'API 名称', dataIndex: 'apiName', key: 'apiName', ellipsis: true },
    { title: 'API 数据标签', dataIndex: 'dataTags', key: 'dataTags', width: 220 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90 }
  ];

  const behaviorColumns = [
    { title: '风险描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '风险等级', dataIndex: 'level', key: 'level', width: 100 },
    { title: '主体信息', dataIndex: 'subject', key: 'subject', width: 180, ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '发生时间', dataIndex: 'occurredAt', key: 'occurredAt', width: 170 }
  ];

  const pageTitle = computed(() => {
    if (!detail.value) return '单应用综合分析';
    return `${detail.value.asset.appName} · 应用深度分析`;
  });

  function levelColor(level: string) {
    if (level === '高') return 'red';
    if (level === '中') return 'orange';
    return 'green';
  }

  function statusColor(status: string) {
    if (status === '关键') return 'red';
    if (status === '确认') return 'blue';
    if (status === '不重要' || status === '未标识') return 'default';
    return 'default';
  }

  function behaviorStatusColor(status: string) {
    if (status === '已修复') return 'green';
    if (status === '处理中') return 'blue';
    if (status === '已忽略') return 'default';
    return 'orange';
  }

  async function loadDetail() {
    const appId = String(route.params.appId || '');
    if (!appId) return;
    loading.value = true;
    try {
      detail.value = await fetchAppAssetDetail(appId);
      defectKeys.value = detail.value?.defects[0]?.id ? [detail.value.defects[0].id] : [];
      attackKeys.value = detail.value?.attacks[0]?.id ? [detail.value.attacks[0].id] : [];
    } finally {
      loading.value = false;
    }
  }

  function handleExport() {
    message.success('单应用分析报表导出任务已加入队列（演示）');
  }

  function handleApiDrill(apiName: string) {
    message.info(`单 API/URL 详情页待后续补充：${apiName}`);
  }

  watch(
    () => route.params.appId,
    () => loadDetail(),
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .report-detail-container {
    padding: 20px;
    height: 100%;
  }

  .section-block {
    margin-top: 16px;
    padding: 12px;
    border: 1px solid var(--color-border-secondary);
    border-radius: 8px;
    background: var(--color-bg-container);
  }

  .section-title {
    margin-bottom: 12px;
    font-size: 15px;
    font-weight: 600;
  }

  .sub-title {
    margin: 12px 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .collapse-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .time-text {
    margin-left: auto;
    font-size: 12px;
    color: var(--color-text-placeholder);
  }

  .collapse-body p {
    margin: 0 0 8px;
    line-height: 1.6;
  }

  .link-btn {
    padding: 0;
  }
</style>
