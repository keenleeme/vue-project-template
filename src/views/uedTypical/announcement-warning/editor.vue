<template>
  <div class="announcement-editor-page">
    <a-card :loading="pageLoading">
      <div class="page-header">
        <a-space>
          <a-button type="link" class="back-btn" @click="goBack">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
            返回列表
          </a-button>
          <div>
            <div class="page-title">{{ isEdit ? '编辑公告' : '新建公告' }}</div>
            <div class="page-desc">支持强制已读、强制回复、范围下发和截止时间控制，形成可追踪的责任闭环。</div>
          </div>
        </a-space>
      </div>

      <a-alert
        type="info"
        show-icon
        message="发布后将按照公告范围生成单位与用户执行对象；若开启强制回复，用户端必须提交回复后才视为完成。"
        style="margin-bottom: 16px"
      />

      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-card title="基本信息" size="small" class="section-card">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item
                    label="公告标题"
                    name="title"
                    :rules="[
                      { required: true, message: '请输入公告标题' },
                      { max: 60, message: '标题最多 60 个字符' }
                    ]"
                  >
                    <a-input v-model:value="formState.title" :maxlength="60" show-count placeholder="请输入公告标题" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="预警等级" name="level" :rules="[{ required: true, message: '请选择预警等级' }]">
                    <a-select
                      v-model:value="formState.level"
                      allow-clear
                      placeholder="请选择预警等级"
                      :options="levelOptions"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item
                    label="截止时间"
                    name="deadline"
                    :rules="[{ required: true, message: '请选择截止时间' }]"
                  >
                    <a-date-picker
                      v-model:value="deadlineValue"
                      show-time
                      value-format="YYYY-MM-DD HH:mm:ss"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="公告正文" name="content" :rules="[{ required: true, message: '请输入公告正文' }]">
                    <a-textarea
                      v-model:value="formState.content"
                      :auto-size="{ minRows: 8, maxRows: 12 }"
                      :maxlength="1000"
                      show-count
                      placeholder="请输入公告正文、处置要求与补充说明"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <a-card title="执行规则" size="small" class="section-card">
              <a-row :gutter="16">
                <a-col :span="12">
                  <div class="switch-item">
                    <div class="switch-label">强制已读</div>
                    <a-switch v-model:checked="formState.forceRead" />
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="switch-item">
                    <div class="switch-label">强制回复</div>
                    <a-switch v-model:checked="formState.forceReply" />
                  </div>
                </a-col>
              </a-row>
              <div class="helper-text">
                若开启强制回复，系统会对未回复对象持续催办，并支持按单位或人员导出执行报告。
              </div>
            </a-card>

            <a-card title="下发范围" size="small" class="section-card">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="接收单位">
                    <a-select
                      v-model:value="formState.scopeUnits"
                      mode="multiple"
                      :options="unitOptions"
                      placeholder="请选择接收单位"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="部门范围">
                    <a-select
                      v-model:value="formState.scopeDepartments"
                      mode="multiple"
                      :options="departmentOptions"
                      placeholder="请选择部门范围"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="角色范围">
                    <a-select
                      v-model:value="formState.scopeRoles"
                      mode="multiple"
                      :options="roleOptions"
                      placeholder="请选择角色范围"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="预置群组">
                    <a-select
                      v-model:value="formState.scopeGroups"
                      mode="multiple"
                      :options="groupOptions"
                      placeholder="请选择预置群组"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>

          <a-col :span="8">
            <a-card title="发布前检查" size="small" class="section-card side-card">
              <div class="check-item">
                <div class="check-title">对象规模</div>
                <div class="check-value">{{ targetSummary }}</div>
              </div>
              <div class="check-item">
                <div class="check-title">执行模式</div>
                <div class="check-value">
                  {{ formState.forceRead ? '强制已读' : '普通阅读' }} /
                  {{ formState.forceReply ? '强制回复' : '无需回复' }}
                </div>
              </div>
              <div class="check-item">
                <div class="check-title">风险提示</div>
                <div class="check-value warning-text">
                  高等级公告建议至少覆盖关键岗位，并配置明确截止时间与回复口径。
                </div>
              </div>
            </a-card>

            <a-card title="操作" size="small" class="section-card side-card">
              <a-space direction="vertical" style="width: 100%">
                <a-button block :loading="draftSubmitting" @click="handleSaveDraft">保存草稿</a-button>
                <a-button type="primary" block :loading="publishSubmitting" @click="handlePublish"> 立即发布 </a-button>
                <a-popconfirm
                  v-if="currentStatus === 'draft'"
                  title="确定删除该草稿吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteDraft"
                >
                  <a-button danger block :loading="deleteSubmitting">删除草稿</a-button>
                </a-popconfirm>
                <a-button danger ghost block @click="handleReset">重置表单</a-button>
              </a-space>
            </a-card>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import type { FormInstance } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { getEmptyAnnouncementFormData, type AnnouncementFormData } from './mock';
  import {
    deleteAnnouncementDraft,
    fetchAnnouncementMeta,
    fetchAnnouncementFormData,
    publishAnnouncement,
    saveAnnouncementDraft
  } from './service';

  const route = useRoute();
  const router = useRouter();
  const formRef = ref<FormInstance>();
  const noticeId = computed(() => String(route.query.id || ''));
  const isEdit = computed(() => Boolean(noticeId.value));
  const pageLoading = ref(false);
  const draftSubmitting = ref(false);
  const publishSubmitting = ref(false);
  const deleteSubmitting = ref(false);
  const currentStatus = ref('');

  const formState = reactive<AnnouncementFormData>(getEmptyAnnouncementFormData());
  const initialFormState = ref<AnnouncementFormData>(JSON.parse(JSON.stringify(formState)) as AnnouncementFormData);

  const deadlineValue = computed({
    get: () => (formState.deadline ? dayjs(formState.deadline) : undefined),
    set: (value) => {
      formState.deadline = value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '';
    }
  });

  const levelOptions = [
    { label: '高危', value: 'critical' },
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' }
  ];

  const unitOptions = ['华东运营中心', '研发共享平台', '支付业务部', '总部安全中心'].map((item) => ({
    label: item,
    value: item
  }));
  const departmentOptions = ['安全', '运维', '研发', '应用负责人'].map((item) => ({
    label: item,
    value: item
  }));
  const roleOptions = ['关键岗位', '值班人员', '管理员'].map((item) => ({
    label: item,
    value: item
  }));
  const groupOptions = ['应急响应群组', '值班群组', '专项通报群组'].map((item) => ({
    label: item,
    value: item
  }));

  const targetSummary = computed(() => {
    return `${formState.scopeUnits.length || 0} 个单位 / ${formState.scopeDepartments.length || 0} 个部门 / ${formState.scopeRoles.length || 0} 个角色`;
  });

  const goBack = () => {
    router.push('/announcement-warning');
  };

  const handleSaveDraft = async () => {
    draftSubmitting.value = true;
    try {
      const result = await saveAnnouncementDraft({
        id: noticeId.value || undefined,
        ...formState
      });
      currentStatus.value = 'draft';
      initialFormState.value = JSON.parse(JSON.stringify(formState)) as AnnouncementFormData;
      message.success(result.message);
      if (!noticeId.value) {
        router.replace({ path: '/announcement-warning/editor', query: { id: result.id } });
      }
    } finally {
      draftSubmitting.value = false;
    }
  };

  const handleReset = () => {
    Object.assign(formState, JSON.parse(JSON.stringify(initialFormState.value)) as AnnouncementFormData);
    message.success('已重置表单');
  };

  const handlePublish = async () => {
    try {
      await formRef.value?.validate();
      publishSubmitting.value = true;
      const result = await publishAnnouncement({
        id: noticeId.value || undefined,
        ...formState
      });
      currentStatus.value = 'ongoing';
      initialFormState.value = JSON.parse(JSON.stringify(formState)) as AnnouncementFormData;
      message.success(result.message);
      router.push({
        path: '/announcement-warning',
        query: {
          refresh: String(Date.now()),
          highlightId: result.id
        }
      });
    } catch (error) {
      // 表单校验失败时组件会展示字段级提示
    } finally {
      publishSubmitting.value = false;
    }
  };

  const handleDeleteDraft = async () => {
    if (!noticeId.value) return;
    deleteSubmitting.value = true;
    try {
      const result = await deleteAnnouncementDraft(noticeId.value);
      message.success(result.message);
      router.push('/announcement-warning');
    } finally {
      deleteSubmitting.value = false;
    }
  };

  watch(
    noticeId,
    async (id) => {
      const normalizedId = id || undefined;
      if (!normalizedId) {
        Object.assign(formState, getEmptyAnnouncementFormData());
        initialFormState.value = JSON.parse(JSON.stringify(formState)) as AnnouncementFormData;
        currentStatus.value = '';
      }
      pageLoading.value = true;
      try {
        const [data, meta] = await Promise.all([
          fetchAnnouncementFormData(normalizedId),
          normalizedId ? fetchAnnouncementMeta(normalizedId) : Promise.resolve(undefined)
        ]);
        Object.assign(formState, data);
        initialFormState.value = JSON.parse(JSON.stringify(data)) as AnnouncementFormData;
        currentStatus.value = meta?.status || '';
      } finally {
        pageLoading.value = false;
      }
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .announcement-editor-page {
    padding: 20px;

    .page-header {
      margin-bottom: 16px;
    }

    .back-btn {
      padding-left: 0;
    }

    .page-title {
      color: var(--color-text-primary);
      font-size: 20px;
      font-weight: 600;
    }

    .page-desc {
      margin-top: 4px;
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .section-card {
      margin-bottom: 16px;
    }

    .switch-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
      background: #f7f8fa;
    }

    .switch-label {
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .helper-text {
      margin-top: 12px;
      color: var(--color-text-secondary);
      font-size: 13px;
      line-height: 22px;
    }

    .side-card {
      position: sticky;
      top: 20px;
    }

    .check-item + .check-item {
      margin-top: 16px;
    }

    .check-title {
      margin-bottom: 8px;
      color: var(--color-text-secondary);
      font-size: 13px;
    }

    .check-value {
      color: var(--color-text-primary);
      line-height: 22px;
    }

    .warning-text {
      color: #f3a700;
    }
  }
</style>
