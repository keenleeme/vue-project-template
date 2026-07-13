<template>
  <div class="report-kpi-grid">
    <div v-for="item in items" :key="item.label" class="report-kpi-card">
      <div class="label">{{ item.label }}</div>
      <div class="value">{{ item.value }}</div>
      <div class="hint-row">
        <span v-if="item.hint" class="hint">{{ item.hint }}</span>
        <span
          v-if="item.trendText"
          :class="['trend', item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'flat']"
        >
          {{ item.trendText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ReportKpiItem } from '../types';

  defineProps<{
    items: ReportKpiItem[];
  }>();
</script>

<style lang="less" scoped>
  .report-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .report-kpi-card {
    padding: 14px 16px;
    border-radius: 8px;
    background: var(--color-bg-container);
    border: 1px solid var(--color-border-secondary);
  }

  .label {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 8px;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-text-primarys);
    line-height: 1.2;
  }

  .hint-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 12px;
  }

  .hint {
    color: var(--color-text-placeholder);
  }

  .trend {
    &.up {
      color: #52c41a;
    }
    &.down {
      color: #f5222d;
    }
    &.flat {
      color: var(--color-text-secondary);
    }
  }

  @media (max-width: 1200px) {
    .report-kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
