<template>
  <div class="api-total-card">
    <span class="api-total-card__label">API 总数</span>
    <span class="api-total-card__value">{{ formatNumber(total) }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    total: number;
  }>();

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }
</script>

<style lang="less" scoped>
  .api-total-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    min-height: 220px;
    padding: 20px 24px;
    border: 1px solid #e8edf5;
    border-radius: 8px;
    background: #fff;
  }

  .api-total-card__label {
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
    margin-bottom: 12px;
  }

  .api-total-card__value {
    font-size: 36px;
    font-weight: 700;
    color: #1677ff;
    line-height: 1;
  }
</style>
