<template>
  <div :class="['dist-card', { 'dist-card--sub': sub }]">
    <div class="dist-card__head">
      <span class="dist-card__label">{{ label }}</span>
      <span v-if="!sub" class="dist-card__total">{{ formatNumber(total) }}</span>
    </div>
    <ul class="dist-card__list" :class="{ 'dist-card__list--single': sub }">
      <li v-for="item in slices" :key="item.name">
        <span class="item-label">
          <i :class="['status-dot', dotClass(item.name)]" />
          {{ item.name }}
        </span>
        <strong>{{ formatNumber(item.value) }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ChartSlice } from '../types';

  const props = withDefaults(
    defineProps<{
      label: string;
      slices: ChartSlice[];
      variant: 'lifecycle' | 'status' | 'deploy';
      sub?: boolean;
    }>(),
    { sub: false }
  );

  const total = computed(() => props.slices.reduce((sum, item) => sum + item.value, 0));

  const dotMap: Record<string, Record<string, string>> = {
    lifecycle: {
      新发现: 'status-dot--newFound',
      活跃: 'status-dot--active',
      疑似下线: 'status-dot--suspectedOffline',
      复活: 'status-dot--resurrected'
    },
    status: {
      关键: 'status-dot--critical',
      确认: 'status-dot--confirmed',
      不重要: 'status-dot--minor',
      未知: 'status-dot--unknown'
    },
    deploy: {
      互联网: 'status-dot--internet',
      内网: 'status-dot--intranet',
      杭州办: 'status-dot--hangzhou'
    }
  };

  function dotClass(name: string) {
    return dotMap[props.variant][name] || 'status-dot--default';
  }

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }
</script>

<style lang="less" scoped>
  .dist-card {
    height: 100%;
    padding: 16px 18px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;
    min-height: 220px;

    &--sub {
      min-height: 0;
      padding: 12px 14px;
      background: #fafbfd;
    }
  }

  .dist-card__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f3f8;

    .dist-card--sub & {
      margin-bottom: 10px;
      padding-bottom: 8px;
    }
  }

  .dist-card__label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;

    .dist-card--sub & {
      font-size: 13px;
    }
  }

  .dist-card__total {
    font-size: 24px;
    font-weight: 700;
    color: #1677ff;
    line-height: 1;
  }

  .dist-card__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #5c6b8a;

      strong {
        font-size: 13px;
        color: #1f2a44;
        font-weight: 600;
      }
    }
  }

  .dist-card__list--single {
    grid-template-columns: 1fr;
  }

  .item-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--newFound {
      background: #1677ff;
    }

    &--active {
      background: #52c41a;
    }

    &--suspectedOffline {
      background: #faad14;
    }

    &--resurrected {
      background: #722ed1;
    }

    &--critical {
      background: #f5222d;
    }

    &--confirmed {
      background: #1677ff;
    }

    &--minor {
      background: #8c8c8c;
    }

    &--unknown {
      background: #d9d9d9;
    }

    &--internet {
      background: #13c2c2;
    }

    &--intranet {
      background: #2f54eb;
    }

    &--hangzhou {
      background: #eb2f96;
    }

    &--default {
      background: #bfbfbf;
    }
  }
</style>
