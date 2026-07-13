<template>
  <div class="overview-card">
    <div class="overview-card__head">
      <span class="overview-card__label">{{ card.label }}</span>
      <span class="overview-card__total">{{ formatNumber(card.total) }}</span>
    </div>
    <ul class="overview-card__list">
      <template v-if="card.type === 'lifecycle'">
        <li v-for="item in lifecycleItems" :key="item.key">
          <span class="item-label">
            <i :class="['status-dot', `status-dot--${item.key}`]" />
            {{ item.label }}
          </span>
          <strong>{{ formatNumber(item.value) }}</strong>
        </li>
      </template>
      <template v-else>
        <li v-for="item in riskItems" :key="item.key">
          <span class="item-label">
            <i :class="['status-dot', `status-dot--${item.key}`]" />
            {{ item.label }}
          </span>
          <strong :class="`risk-${item.key}`">{{ formatNumber(item.value) }}</strong>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverviewAssetCard, OverviewRiskCard } from '../mock';

  const props = defineProps<{
    card: OverviewAssetCard | OverviewRiskCard;
  }>();

  const lifecycleItems = computed(() => {
    if (props.card.type !== 'lifecycle') return [];
    const b = props.card.breakdown;
    return [
      { key: 'newFound', label: '新发现', value: b.newFound },
      { key: 'active', label: '活跃', value: b.active },
      { key: 'suspectedOffline', label: '疑似下线', value: b.suspectedOffline },
      { key: 'resurrected', label: '复活', value: b.resurrected }
    ];
  });

  const riskItems = computed(() => {
    if (props.card.type !== 'risk') return [];
    const b = props.card.breakdown;
    return [
      { key: 'high', label: '高危', value: b.high },
      { key: 'medium', label: '中危', value: b.medium },
      { key: 'low', label: '低危', value: b.low }
    ];
  });

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }
</script>

<style lang="less" scoped>
  .overview-card {
    padding: 16px 18px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;
    min-height: 148px;
  }

  .overview-card__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f3f8;
  }

  .overview-card__label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .overview-card__total {
    font-size: 24px;
    font-weight: 700;
    color: #1677ff;
    line-height: 1;
  }

  .overview-card__list {
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

    &--high {
      background: #f5222d;
    }

    &--medium {
      background: #fa8c16;
    }

    &--low {
      background: #52c41a;
    }
  }

  .risk-high {
    color: #cf1322;
  }

  .risk-medium {
    color: #d48806;
  }

  .risk-low {
    color: #389e0d;
  }
</style>
