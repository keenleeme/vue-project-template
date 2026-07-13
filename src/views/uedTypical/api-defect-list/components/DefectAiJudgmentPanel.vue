<template>
  <div class="ai-judgment-card">
    <div class="ai-judgment-card__head">
      <div class="ai-judgment-card__title">
        <RobotOutlined class="ai-judgment-card__icon" />
        <span>AI研判结论</span>
      </div>
    </div>
    <div class="ai-judgment-timeline">
      <div class="ai-judgment-timeline__item">
        <div class="ai-judgment-timeline__icon">
          <FileTextOutlined />
        </div>
        <div class="ai-judgment-timeline__content">
          <div class="ai-judgment-timeline__label">结论</div>
          <div class="ai-judgment-timeline__value ai-judgment-timeline__value--conclusion">
            {{ judgment.conclusion }}
          </div>
        </div>
      </div>
      <div class="ai-judgment-timeline__item">
        <div class="ai-judgment-timeline__icon">
          <FileTextOutlined />
        </div>
        <div class="ai-judgment-timeline__content">
          <div class="ai-judgment-timeline__label">结论说明</div>
          <ol class="ai-judgment-timeline__list">
            <li v-for="(item, index) in judgment.explanation" :key="index">{{ item }}</li>
          </ol>
        </div>
      </div>
      <div class="ai-judgment-timeline__item ai-judgment-timeline__item--last">
        <div class="ai-judgment-timeline__icon">
          <FileTextOutlined />
        </div>
        <div class="ai-judgment-timeline__content">
          <div class="ai-judgment-timeline__label">处置建议</div>
          <ol class="ai-judgment-timeline__list">
            <li v-for="(item, index) in judgment.suggestions" :key="index">{{ item }}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FileTextOutlined, RobotOutlined } from '@ant-design/icons-vue';
  import type { DefectAiJudgment } from '../types';

  defineProps<{
    judgment: DefectAiJudgment;
  }>();
</script>

<style lang="less" scoped>
  .ai-judgment-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    padding: 12px 14px;
    border: 1px solid #e8d4f8;
    border-radius: 8px;
    background: linear-gradient(180deg, #faf5ff 0%, #fff 100%);

    &__head {
      margin-bottom: 10px;
      flex-shrink: 0;
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #531dab;
    }

    &__icon {
      font-size: 14px;
    }
  }

  .ai-judgment-timeline {
    flex: 1;
    min-height: 0;
    padding-left: 2px;
    overflow-y: auto;

    &__item {
      display: flex;
      gap: 8px;
      position: relative;
      padding-bottom: 10px;

      &:not(&--last)::after {
        content: '';
        position: absolute;
        left: 10px;
        top: 24px;
        bottom: 0;
        border-left: 1px dashed #d3adf7;
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      border-radius: 4px;
      background: #f9f0ff;
      color: #722ed1;
      font-size: 11px;
    }

    &__content {
      flex: 1;
      min-width: 0;
    }

    &__label {
      margin-bottom: 2px;
      font-size: 12px;
      font-weight: 600;
      color: #1f2a44;
    }

    &__value {
      font-size: 12px;
      line-height: 1.6;
      color: #3d4a66;

      &--conclusion {
        font-weight: 600;
        color: #1f2a44;
      }
    }

    &__list {
      margin: 0;
      padding-left: 16px;
      font-size: 12px;
      line-height: 1.6;
      color: #3d4a66;

      li + li {
        margin-top: 2px;
      }
    }
  }
</style>
