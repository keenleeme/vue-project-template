<template>
  <a-modal
    :open="open"
    title="手动催办"
    width="50%"
    centered
    :confirm-loading="confirmLoading"
    ok-text="确认发送催办"
    cancel-text="取消"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <div class="reminder-modal">
      <a-alert
        show-icon
        type="warning"
        message="批量催办会累计催办次数，建议优先筛选真正未完成且接近超时的对象。"
        style="margin-bottom: 16px"
      />

      <a-form layout="vertical">
        <a-form-item label="催办对象">
          <a-checkbox-group v-model:value="form.targets" :options="targetOptions" />
        </a-form-item>

        <a-form-item label="通知渠道">
          <a-checkbox-group v-model:value="form.channels" :options="channelOptions" />
        </a-form-item>

        <a-form-item label="催办文案">
          <a-textarea v-model:value="form.message" :rows="4" placeholder="请输入催办文案" />
        </a-form-item>
      </a-form>

      <div class="tips">
        <div>发送前建议核对本次对象数量、通知渠道和催办文案摘要。</div>
        <div>重复催办、升级告警和失败重试都会进入审计日志。</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';

  const props = defineProps<{
    open: boolean;
    confirmLoading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (
      e: 'submit',
      payload: {
        targets: string[];
        channels: string[];
        message: string;
      }
    ): void;
  }>();

  const targetOptions = [
    { label: '未读对象', value: 'unread' },
    { label: '未回复对象', value: 'unreplied' },
    { label: '超时对象', value: 'overdue' }
  ];

  const channelOptions = [
    { label: '站内信', value: 'inbox' },
    { label: '短信', value: 'sms' },
    { label: '邮件', value: 'email' }
  ];

  const createDefaultForm = () => ({
    targets: ['unread', 'unreplied'],
    channels: ['inbox'],
    message: '您收到的公告仍未完成，请尽快完成已读确认与排查回复。超时未完成将继续升级告警。'
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
      targets: [...form.targets],
      channels: [...form.channels],
      message: form.message
    });
  };
</script>

<style lang="less" scoped>
  .reminder-modal {
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
