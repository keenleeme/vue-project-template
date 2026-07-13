<template>
  <div class="report-management-container">
    <a-card :body-style="{ padding: '0 24px 24px' }" style="height: 100%">
      <a-tabs v-model:active-key="activeTab" class="report-tabs">
        <a-tab-pane key="template" tab="报告模板">
          <div class="template-grid">
            <ReportTemplateCard
              v-for="item in reportCards"
              :key="item.id"
              :item="item"
              @open="goReportDetail"
              @generate="openGenerateModal"
              @subscribe="handleSubscribe"
            />
          </div>
        </a-tab-pane>

        <a-tab-pane key="list" tab="报告列表">
          <ReportListPanel
            ref="listPanelRef"
            @generate="openGenerateModal()"
            @preview="handlePreviewReport"
            @export="handleExportReport"
          />
        </a-tab-pane>

        <a-tab-pane key="subscription" tab="订阅中心">
          <div class="tab-panel">
            <a-table
              :columns="subscriptionColumns"
              :data-source="reportSubscriptionList"
              :pagination="{ pageSize: 10, showSizeChanger: false }"
              row-key="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :color="record.status === '已启用' ? 'green' : 'default'">{{ record.status }}</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small">
                      {{ record.status === '已启用' ? '暂停' : '启用' }}
                    </a-button>
                    <a-button type="link" size="small" danger>取消订阅</a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <GenerateReportModal
      v-model:open="generateModalOpen"
      :template-type="generateTemplateType"
      :template-locked="generateTemplateLocked"
      :confirm-loading="generateLoading"
      @submit="handleGenerateSubmit"
    />
  </div>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import GenerateReportModal from './components/GenerateReportModal.vue';
  import ReportListPanel from './components/ReportListPanel.vue';
  import ReportTemplateCard from './components/ReportTemplateCard.vue';
  import { reportCards, reportSubscriptionList, reportTemplateTagMap } from './mock';
  import type {
    GenerateReportFormValues,
    ReportCardItem,
    ReportHistoryItem,
    ReportType
  } from './types';

  const router = useRouter();
  const activeTab = ref('template');
  const generateModalOpen = ref(false);
  const generateLoading = ref(false);
  const generateTemplateType = ref<ReportType | undefined>();
  const generateTemplateLocked = ref(false);
  const listPanelRef = ref<InstanceType<typeof ReportListPanel>>();

  const subscriptionColumns = [
    { title: '订阅模板', dataIndex: 'templateName', key: 'templateName', ellipsis: true },
    { title: '订阅周期', dataIndex: 'cycle', key: 'cycle', width: 160 },
    { title: '下次执行', dataIndex: 'nextRunAt', key: 'nextRunAt', width: 180 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '订阅人/组', dataIndex: 'subscriber', key: 'subscriber', width: 120 },
    { title: '操作', key: 'action', width: 160 }
  ];

  function openGenerateModal(item?: ReportCardItem) {
    generateTemplateType.value = item?.id;
    generateTemplateLocked.value = Boolean(item);
    generateModalOpen.value = true;
  }

  function goReportDetail(item: ReportCardItem) {
    router.push(item.route);
  }

  function handleSubscribe(item: ReportCardItem) {
    message.success(`已打开「${item.title}」订阅配置（演示）`);
    activeTab.value = 'subscription';
  }

  async function handleGenerateSubmit(values: GenerateReportFormValues) {
    generateLoading.value = true;
    try {
      const now = dayjs().format('YYYY-MM-DD HH:mm');
      const newRecord: ReportHistoryItem = {
        id: `h-${Date.now()}`,
        reportName: values.reportName,
        remark: values.remark || '—',
        templateType: values.templateType,
        templateTag: reportTemplateTagMap[values.templateType],
        filterApp:
          values.templateType === 'application-asset-analysis'
            ? values.filterApp || '全部'
            : values.templateType === 'api-security-ops'
              ? '全部'
              : undefined,
        filterApi: values.templateType === 'api-asset-analysis' ? values.filterApi || undefined : undefined,
        filterTime: `${values.dateRange?.[0]} ~ ${values.dateRange?.[1]}`,
        createdAt: now,
        status: '生成中'
      };

      listPanelRef.value?.prependReport(newRecord);
      activeTab.value = 'list';
      message.success(`报告生成任务已提交，格式：${values.formats.join('、')}`);

      window.setTimeout(() => {
        newRecord.status = '成功';
      }, 1500);
    } finally {
      generateLoading.value = false;
    }
  }

  function handlePreviewReport(record: ReportHistoryItem) {
    const card = reportCards.find((c) => c.id === record.templateType);
    if (card) {
      router.push(card.route);
      return;
    }
    message.info('暂无可预览的报告详情');
  }

  function handleExportReport(record: ReportHistoryItem, format: string) {
    message.success(`正在导出「${record.reportName}」为 ${format.toUpperCase()}（演示）`);
  }
</script>

<style lang="less" scoped>
  .report-management-container {
    padding: 20px;
    height: 100%;
    background: #f5f7fb;
  }

  .report-tabs {
    :deep(.ant-tabs-nav) {
      margin-bottom: 20px;
    }

    :deep(.ant-tabs-tab) {
      padding: 12px 4px;
      font-size: 14px;
    }

    :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
      font-weight: 600;
      color: #1677ff;
    }
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .tab-panel {
    padding-top: 4px;
  }

  @media (max-width: 1400px) {
    .template-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
