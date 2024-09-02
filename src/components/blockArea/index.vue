import UedMaterialMenu from '@ued-material/menu';
<template>
  <div class="page-item">
    <div class="page-item-title">{{ title }}</div>
    <div class="page-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({ title: String });
</script>

<style lang="less" scoped>
  .page-item {
    background-color: #fff;
    margin-bottom: 16px;
    &-title {
      font-size: 16px;
      color: #1e2345;
      line-height: 24px;
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid #e9eaf0;
    }

    &-content {
      padding: 24px;
      display: flex;
      flex-direction: row;

      & > div {
        width: 50%;
      }
    }
  }
</style>
