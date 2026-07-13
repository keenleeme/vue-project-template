<template>
  <div class="stacked-bar">
    <div class="stacked-bar__track">
      <div
        v-if="dist.high"
        class="stacked-bar__seg high"
        :style="{ width: `${segWidth(dist.high)}%` }"
        :title="`高危 ${dist.high}`"
      />
      <div
        v-if="dist.medium"
        class="stacked-bar__seg medium"
        :style="{ width: `${segWidth(dist.medium)}%` }"
        :title="`中危 ${dist.medium}`"
      />
      <div
        v-if="dist.low"
        class="stacked-bar__seg low"
        :style="{ width: `${segWidth(dist.low)}%` }"
        :title="`低危 ${dist.low}`"
      />
    </div>
    <div class="stacked-bar__legend">
      <span class="legend-item high">高 {{ dist.high }}</span>
      <span class="legend-item medium">中 {{ dist.medium }}</span>
      <span class="legend-item low">低 {{ dist.low }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { RiskDistribution } from '../types';

  const props = defineProps<{
    dist: RiskDistribution;
  }>();

  const total = computed(() => props.dist.high + props.dist.medium + props.dist.low);

  function segWidth(val: number) {
    if (!total.value) return 0;
    return (val / total.value) * 100;
  }
</script>

<style lang="less" scoped>
  .stacked-bar {
    min-width: 160px;
  }

  .stacked-bar__track {
    display: flex;
    height: 10px;
    border-radius: 5px;
    overflow: hidden;
    background: #f0f3f8;
  }

  .stacked-bar__seg {
    height: 100%;
    min-width: 2px;

    &.high {
      background: #f5222d;
    }

    &.medium {
      background: #fa8c16;
    }

    &.low {
      background: #1677ff;
    }
  }

  .stacked-bar__legend {
    display: flex;
    gap: 8px;
    margin-top: 6px;
    font-size: 11px;
    color: #5c6b8a;

    .legend-item {
      &.high {
        color: #cf1322;
      }

      &.medium {
        color: #d48806;
      }

      &.low {
        color: #1677ff;
      }
    }
  }
</style>
