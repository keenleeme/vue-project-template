<template>
  <div class="report-template-card">
    <div class="report-template-card__header">
      <h3 class="report-template-card__title" @click="emit('open', item)">{{ item.title }}</h3>
      <div class="report-template-card__actions">
        <a-button type="primary" @click.stop="emit('generate', item)">生成报告</a-button>
        <a-button @click.stop="emit('subscribe', item)">
          <template #icon><StarOutlined /></template>
          订阅报告
        </a-button>
      </div>
    </div>

    <div class="report-template-card__preview" @click="emit('open', item)">
      <div class="preview-inner">
        <div :class="['preview-icon', `preview-icon--${item.theme}`]">
          <span v-if="item.theme === 'api'" class="api-text">API</span>
          <AppstoreOutlined v-else-if="item.theme === 'app-grid'" />
          <ApiOutlined v-else />
        </div>
        <div class="preview-lines">
          <span class="line line--long" />
          <span class="line line--short" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ApiOutlined, AppstoreOutlined, StarOutlined } from '@ant-design/icons-vue';
  import type { ReportCardItem } from '../types';

  defineProps<{
    item: ReportCardItem;
  }>();

  const emit = defineEmits<{
    open: [item: ReportCardItem];
    generate: [item: ReportCardItem];
    subscribe: [item: ReportCardItem];
  }>();
</script>

<style lang="less" scoped>
  .report-template-card {
    display: flex;
    flex-direction: column;
    min-height: 320px;
    padding: 20px 20px 16px;
    border-radius: 8px;
    border: 1px solid #e8edf5;
    background: #fff;
    box-shadow: 0 2px 8px rgba(15, 35, 95, 0.04);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;

    &:hover {
      border-color: #c8daf8;
      box-shadow: 0 8px 24px rgba(24, 144, 255, 0.1);
    }
  }

  .report-template-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .report-template-card__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2a44;
    line-height: 1.4;
    cursor: pointer;

    &:hover {
      color: #1677ff;
    }
  }

  .report-template-card__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .report-template-card__preview {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 220px;
    border-radius: 6px;
    background: linear-gradient(180deg, #edf5ff 0%, #f7fbff 55%, #ffffff 100%);
    cursor: pointer;
  }

  .preview-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 168px;
    padding: 18px 20px 16px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(24, 144, 255, 0.08);
  }

  .preview-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    font-size: 28px;
    color: #fff;

    &--api {
      background: linear-gradient(135deg, #4b8bff 0%, #2f6df6 100%);
      border-radius: 14px;
    }

    &--app-grid {
      background: linear-gradient(135deg, #8b6cff 0%, #6a4dff 100%);
      border-radius: 14px;
    }

    &--api-plug {
      background: linear-gradient(135deg, #35c9c3 0%, #1eb8b2 100%);
      border-radius: 50%;
    }
  }

  .api-text {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .preview-lines {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .line {
    display: block;
    height: 8px;
    border-radius: 4px;
    background: #e8edf5;

    &--long {
      width: 100%;
    }

    &--short {
      width: 68%;
      margin: 0 auto;
    }
  }
</style>
