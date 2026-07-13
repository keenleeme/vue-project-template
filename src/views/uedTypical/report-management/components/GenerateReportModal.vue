<template>
  <a-modal
    :open="open"
    :title="modalTitle"
    width="520px"
    centered
    :confirm-loading="confirmLoading"
    ok-text="确认生成"
    cancel-text="取消"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="generate-report-form">
      <a-form-item label="报告名称" name="reportName" required>
        <a-input v-model:value="form.reportName" placeholder="请输入报告名称" allow-clear />
      </a-form-item>

      <a-form-item label="报告模板" name="templateType" required>
        <a-select
          v-model:value="form.templateType"
          :options="templateOptions"
          :disabled="templateLocked"
          placeholder="请选择报告模板"
          @change="handleTemplateChange"
        />
      </a-form-item>

      <a-form-item v-if="showAppFilter" label="应用筛选" name="filterApp">
        <a-select
          v-model:value="form.filterApp"
          :options="reportAppFilterOptions"
          placeholder="请选择应用（可选）"
          allow-clear
          show-search
          option-filter-prop="label"
        />
      </a-form-item>

      <a-form-item v-if="showApiFilter" label="API 筛选" name="filterApi">
        <a-select
          v-model:value="form.filterApi"
          :options="apiFilterOptions"
          placeholder="请选择 API（可选）"
          allow-clear
          show-search
          option-filter-prop="label"
        />
      </a-form-item>

      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
          :rows="3"
          placeholder="请输入备注信息"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="时间周期" name="dateRange" required>
        <a-range-picker
          v-model:value="form.dateRange"
          style="width: 100%"
          format="YYYY-MM-DD"
          :placeholder="['年 / 月 / 日', '年 / 月 / 日']"
        />
      </a-form-item>

      <a-form-item label="报告格式" name="formats" required>
        <a-checkbox-group v-model:value="form.formats" :options="formatOptions" class="format-group" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import { computed, reactive, ref, watch } from 'vue';
  import { reportApiFilterOptions, reportAppFilterOptions, reportCards } from '../mock';
  import type { GenerateReportFormValues, ReportFormat, ReportType } from '../types';

  const props = defineProps<{
    open: boolean;
    confirmLoading?: boolean;
    templateType?: ReportType;
    templateLocked?: boolean;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    submit: [values: GenerateReportFormValues];
  }>();

  const formRef = ref<FormInstance>();
  const form = reactive<{
    reportName: string;
    templateType?: ReportType;
    filterApp?: string;
    filterApi?: string;
    remark: string;
    dateRange: [Dayjs, Dayjs] | [string, string] | null;
    formats: ReportFormat[];
  }>({
    reportName: '',
    templateType: undefined,
    filterApp: 'all',
    filterApi: 'all',
    remark: '',
    dateRange: null,
    formats: ['PDF']
  });

  const formatOptions = [
    { label: 'WORD', value: 'WORD' },
    { label: 'PDF', value: 'PDF' },
    { label: 'PNG', value: 'PNG' },
    { label: 'HTML', value: 'HTML' }
  ];

  const templateOptions = computed(() =>
    reportCards.map((item) => ({
      label: item.title,
      value: item.id
    }))
  );

  const showAppFilter = computed(() => form.templateType === 'application-asset-analysis');
  const showApiFilter = computed(() => form.templateType === 'api-asset-analysis');

  const apiFilterOptions = computed(() => {
    if (form.templateType === 'api-asset-analysis') {
      return reportApiFilterOptions.map(({ label, value }) => ({ label, value }));
    }
    return [];
  });

  const modalTitle = computed(() => {
    const card = reportCards.find((item) => item.id === form.templateType);
    return card ? `生成报告 - ${card.title}` : '生成报告';
  });

  const rules = computed<Record<string, Rule[]>>(() => {
    const base: Record<string, Rule[]> = {
      reportName: [{ required: true, message: '请输入报告名称', trigger: 'blur' }],
      templateType: [{ required: true, message: '请选择报告模板', trigger: 'change' }],
      dateRange: [{ required: true, message: '请选择时间周期', trigger: 'change' }],
      formats: [
        {
          type: 'array',
          required: true,
          min: 1,
          message: '请至少选择一种报告格式',
          trigger: 'change'
        }
      ]
    };

    return base;
  });

  function resetFilterFields() {
    form.filterApp = undefined;
    form.filterApi = undefined;
  }

  function handleTemplateChange() {
    resetFilterFields();
    formRef.value?.clearValidate(['filterApp', 'filterApi']);
  }

  function resetForm() {
    form.reportName = '';
    form.templateType = props.templateType ?? reportCards[0]?.id;
    resetFilterFields();
    form.remark = '';
    form.dateRange = [dayjs().subtract(7, 'day'), dayjs()];
    form.formats = ['PDF'];
    formRef.value?.clearValidate();
  }

  function handleCancel() {
    emit('update:open', false);
  }

  function resolveFilterAppLabel(value?: string) {
    if (!value || value === 'all') return '全部';
    return reportAppFilterOptions.find((item) => item.value === value)?.label ?? value;
  }

  function resolveFilterApiLabel(value?: string) {
    if (!value || value === 'all') return undefined;
    return value;
  }

  async function handleSubmit() {
    await formRef.value?.validate();
    const range = form.dateRange;
    if (!range || !form.templateType) return;

    const start = dayjs(range[0]).format('YYYY-MM-DD');
    const end = dayjs(range[1]).format('YYYY-MM-DD');

    const payload: GenerateReportFormValues = {
      reportName: form.reportName.trim(),
      templateType: form.templateType,
      remark: form.remark.trim(),
      dateRange: [start, end],
      formats: [...form.formats]
    };

    if (showAppFilter.value) {
      payload.filterApp = resolveFilterAppLabel(form.filterApp);
    }
    if (showApiFilter.value && form.filterApi) {
      payload.filterApi = resolveFilterApiLabel(form.filterApi);
    }

    emit('submit', payload);
    emit('update:open', false);
  }

  watch(
    () => props.open,
    (visible) => {
      if (visible) resetForm();
    }
  );

  watch(
    () => props.templateType,
    (type) => {
      if (type) form.templateType = type;
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .generate-report-form {
    padding-top: 4px;
  }

  .format-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }
</style>
