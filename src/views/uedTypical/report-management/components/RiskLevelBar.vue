<template>
  <div class="risk-level-bar">
    <span class="risk-dot high" title="高危">{{ dist.high }}</span>
    <span class="risk-dot medium" title="中危">{{ dist.medium }}</span>
    <span class="risk-dot low" title="低危">{{ dist.low }}</span>
    <span v-if="showTotal" class="risk-total">共 {{ total }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    dist: { high: number; medium: number; low: number };
    showTotal?: boolean;
  }>();

  const total = computed(() => props.dist.high + props.dist.medium + props.dist.low);
</script>

<style lang="less" scoped>
  .risk-level-bar {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .risk-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;

    &.high {
      background: #f5222d;
    }
    &.medium {
      background: #fa8c16;
    }
    &.low {
      background: #52c41a;
    }
  }

  .risk-total {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
</style>
