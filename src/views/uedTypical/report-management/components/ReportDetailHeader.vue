<template>
  <div class="report-detail-header">
    <div class="report-detail-header__left">
      <a-button type="link" class="back-btn" @click="goBack">
        <template #icon><ArrowLeftOutlined /></template>
        {{ backLabel || '返回报告管理' }}
      </a-button>
      <div class="title-block">
        <h2 class="title">{{ title }}</h2>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="report-detail-header__right">
      <template v-if="showMeta">
        <span class="meta">统计周期：{{ period }}</span>
        <span class="meta">生成时间：{{ generatedAt }}</span>
      </template>
      <a-button :type="exportPrimary ? 'primary' : 'default'" @click="emit('export')">{{ exportLabel }}</a-button>
      <a-button v-if="showRefresh" type="primary" @click="emit('refresh')">刷新数据</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';

  const props = withDefaults(
    defineProps<{
      title: string;
      subtitle?: string;
      period?: string;
      generatedAt?: string;
      showMeta?: boolean;
      showRefresh?: boolean;
      exportLabel?: string;
      exportPrimary?: boolean;
      backTo?: string;
      backLabel?: string;
    }>(),
    {
      period: '-',
      generatedAt: '-',
      showMeta: true,
      showRefresh: true,
      exportLabel: '导出 PDF',
      exportPrimary: false,
      backTo: '/report-management',
      backLabel: '返回报告管理'
    }
  );

  const emit = defineEmits<{
    export: [];
    refresh: [];
  }>();

  const router = useRouter();

  function goBack() {
    router.push(props.backTo);
  }
</script>

<style lang="less" scoped>
  .report-detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border-secondary);
  }

  .report-detail-header__left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .back-btn {
    padding-left: 0;
  }

  .title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-primarys);
  }

  .subtitle {
    margin: 4px 0 0;
    color: var(--color-text-secondary);
    font-size: 13px;
  }

  .report-detail-header__right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .meta {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-right: 4px;
  }
</style>
