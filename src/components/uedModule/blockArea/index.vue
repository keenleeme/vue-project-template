<template>
  <div class="page-item">
    <div class="page-item-title">
      <span>{{ title }}</span>
      <div>
        <slot name="description"></slot>
      </div>
    </div>
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
    background-color: var(--color-bg-container);
    margin-bottom: 16px;
    &-title {
      display: flex;
      font-size: var(--font-size-base);
      color: var(--color-text-primarys);
      line-height: 24px;
      font-weight: 600;
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-component-stroke);
    }

    &-content {
      padding: 24px;
      display: flex;
      flex-direction: row;
      color: var(--color-text-primarys);

      & > div {
        width: 50%;
      }
    }
  }
</style>
