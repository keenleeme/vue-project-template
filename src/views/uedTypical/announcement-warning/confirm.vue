<template>
  <div class="announcement-confirm-page">
    <a-card :loading="pageLoading">
      <div class="page-header">
        <a-button type="link" class="back-btn" @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回待办
        </a-button>
      </div>

      <div class="hero-panel">
        <div>
          <div class="hero-title">{{ detail?.title }}</div>
          <div class="hero-meta">
            <a-space wrap>
              <a-tag :color="getLevelTagColor(detail?.level || 'high')">
                {{ getLevelLabel(detail?.level || 'high') }}
              </a-tag>
              <a-tag color="processing">{{ detail?.unitName }}</a-tag>
              <a-tag color="warning">{{ detail?.currentStatus }}</a-tag>
              <span>截止时间：{{ detail?.deadline }}</span>
            </a-space>
          </div>
        </div>
      </div>

      <a-row :gutter="16">
        <a-col :span="16">
          <a-card title="公告内容" size="small" class="section-card">
            <div class="notice-content">{{ detail?.content || '暂无公告内容' }}</div>
          </a-card>

          <a-card v-if="form.replyRequired && detail" title="回复反馈" size="small" class="section-card">
            <a-form layout="vertical">
              <a-form-item label="处置结论">
                <a-radio-group v-model:value="form.replyOption">
                  <a-radio v-for="item in detail.options" :key="item" :value="item">{{ item }}</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="补充说明">
                <a-textarea
                  v-model:value="form.replyContent"
                  :auto-size="{ minRows: 4, maxRows: 6 }"
                  :maxlength="500"
                  show-count
                  placeholder="请补充资产范围、处置动作和预计完成时间"
                />
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :span="8">
          <a-card title="确认动作" size="small" class="section-card side-card">
            <div class="confirm-line">
              <span>已读确认</span>
              <a-switch v-model:checked="form.readConfirmed" />
            </div>
            <div class="confirm-line">
              <span>需要回复</span>
              <a-switch v-model:checked="form.replyRequired" />
            </div>
            <a-space direction="vertical" style="width: 100%; margin-top: 16px">
              <a-button block :loading="draftSubmitting" @click="saveLater">稍后补充</a-button>
              <a-button type="primary" block :loading="submitSubmitting" @click="submitConfirm"> 提交确认 </a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { getLevelLabel, getLevelTagColor, type NoticeConfirmData } from './mock';
  import { fetchNoticeConfirmData, saveNoticeConfirmDraft, submitNoticeConfirm } from './service';

  const route = useRoute();
  const router = useRouter();
  const detail = ref<NoticeConfirmData>();
  const pageLoading = ref(false);
  const draftSubmitting = ref(false);
  const submitSubmitting = ref(false);

  const form = reactive({
    readConfirmed: true,
    replyRequired: true,
    replyOption: '',
    replyContent: ''
  });

  const goBack = () => {
    router.push('/announcement-warning/todo');
  };

  const saveLater = async () => {
    if (!detail.value) return;
    draftSubmitting.value = true;
    try {
      const result = await saveNoticeConfirmDraft({
        id: detail.value.id,
        readConfirmed: form.readConfirmed,
        replyRequired: form.replyRequired,
        replyOption: form.replyOption,
        replyContent: form.replyContent
      });
      message.success(result.message);
    } finally {
      draftSubmitting.value = false;
    }
  };

  const submitConfirm = async () => {
    if (!detail.value) return;
    if (!form.readConfirmed) {
      message.warning('请先确认已读');
      return;
    }
    if (form.replyRequired && !form.replyContent.trim()) {
      message.warning('请补充回复说明');
      return;
    }
    submitSubmitting.value = true;
    try {
      const result = await submitNoticeConfirm({
        id: detail.value.id,
        readConfirmed: form.readConfirmed,
        replyRequired: form.replyRequired,
        replyOption: form.replyOption,
        replyContent: form.replyContent
      });
      message.success(result.message);
      router.push('/announcement-warning/todo');
    } finally {
      submitSubmitting.value = false;
    }
  };

  onMounted(async () => {
    pageLoading.value = true;
    try {
      detail.value = await fetchNoticeConfirmData(String(route.params.id));
      form.readConfirmed = Boolean(detail.value.initialReadConfirmed);
      form.replyRequired = detail.value.initialReplyRequired ?? true;
      form.replyOption = detail.value.initialReplyOption || detail.value.options[0] || '';
      form.replyContent = detail.value.initialReplyContent || '';
    } finally {
      pageLoading.value = false;
    }
  });
</script>

<style lang="less" scoped>
  .announcement-confirm-page {
    padding: 20px;

    .page-header {
      margin-bottom: 12px;
    }

    .back-btn {
      padding-left: 0;
    }

    .hero-panel {
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f5f8ff 0%, #eef3ff 100%);
    }

    .hero-title {
      color: var(--color-text-primary);
      font-size: 22px;
      font-weight: 600;
      line-height: 32px;
    }

    .hero-meta {
      margin-top: 8px;
      color: var(--color-text-secondary);
    }

    .section-card {
      margin-bottom: 16px;
    }

    .notice-content {
      line-height: 24px;
      white-space: pre-wrap;
    }

    .side-card {
      position: sticky;
      top: 20px;
    }

    .confirm-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .helper-text {
      margin-top: 12px;
      color: var(--color-text-secondary);
      font-size: 13px;
      line-height: 22px;
    }
  }
</style>
