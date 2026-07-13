<template>
  <div class="app-overview-panel">
    <div class="app-overview-panel__head">
      <span class="app-overview-panel__label">应用总数</span>
      <span class="app-overview-panel__total">{{ formatNumber(appTotal) }}</span>
    </div>
    <a-row :gutter="10" class="app-overview-panel__body">
      <a-col :span="12">
        <AppDistributionCard
          label="应用生命周期"
          variant="lifecycle"
          :slices="stats.lifecycleDist"
          sub
        />
      </a-col>
      <a-col :span="12">
        <AppDistributionCard label="应用状态" variant="status" :slices="stats.statusDist" sub />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { AppOverviewStats } from '../types';
  import AppDistributionCard from './AppDistributionCard.vue';

  const props = defineProps<{
    stats: AppOverviewStats;
  }>();

  const appTotal = computed(() =>
    props.stats.lifecycleDist.reduce((sum, item) => sum + item.value, 0)
  );

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }
</script>

<style lang="less" scoped>
  .app-overview-panel {
    height: 100%;
    padding: 16px 18px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;
    min-height: 220px;
  }

  .app-overview-panel__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f3f8;
  }

  .app-overview-panel__label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .app-overview-panel__total {
    font-size: 28px;
    font-weight: 700;
    color: #1677ff;
    line-height: 1;
  }

  .app-overview-panel__body {
    margin-top: 0;
  }
</style>
