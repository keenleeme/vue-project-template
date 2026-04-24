<template>
  <a-modal
    :open="open"
    title="导出报告"
    width="50%"
    centered
    :confirm-loading="confirmLoading"
    ok-text="生成导出任务"
    cancel-text="取消"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <div class="export-report-modal">
      <a-alert
        show-icon
        type="warning"
        message="若包含用户明细，请确认当前导出权限与脱敏策略。"
        style="margin-bottom: 16px"
      />

      <a-form layout="vertical">
        <a-form-item label="公告标题">
          <a-input :value="announcementTitle" disabled />
        </a-form-item>

        <a-form-item label="导出范围">
          <a-radio-group v-model:value="form.scope">
            <a-radio value="all">全部接收单位</a-radio>
            <a-radio value="current">当前筛选结果</a-radio>
            <a-radio value="currentUnit">当前单位范围</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="导出格式">
          <a-checkbox-group v-model:value="form.formats" :options="formatOptions" />
        </a-form-item>

        <a-form-item label="脱敏导出">
          <a-switch v-model:checked="form.desensitize" />
        </a-form-item>
      </a-form>

      <div class="tips">
        <div>导出文件会写入导出人、导出时间、公告标题和当前筛选条件。</div>
        <div>大数据量场景默认异步导出，生成后可在下载中心查看。</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';

  const props = defineProps<{
    open: boolean;
    announcementTitle: string;
    confirmLoading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (
      e: 'submit',
      payload: {
        scope: string;
        formats: string[];
        desensitize: boolean;
      }
    ): void;
  }>();

  const formatOptions = [
    { label: 'Excel', value: 'excel' },
    { label: 'PDF', value: 'pdf' }
  ];

  const createDefaultForm = () => ({
    scope: 'all',
    formats: ['excel', 'pdf'],
    desensitize: false
  });

  const form = reactive(createDefaultForm());

  watch(
    () => props.open,
    (value) => {
      if (value) {
        Object.assign(form, createDefaultForm());
      }
    }
  );

  const handleCancel = () => {
    emit('update:open', false);
  };

  const handleSubmit = () => {
    emit('submit', {
      scope: form.scope,
      formats: [...form.formats],
      desensitize: form.desensitize
    });
  };
</script>

<style lang="less" scoped>
  .export-report-modal {
    .tips {
      padding: 12px 16px;
      border-radius: 8px;
      background: #f7f8fa;
      color: var(--color-text-secondary);
      font-size: 13px;
      line-height: 1.8;
    }
  }
</style>
