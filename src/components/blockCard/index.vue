<template>
  <div class="block-card" :class="{ 'top-border': topBorder }">
    <div class="block-card-header" :class="{ 'title-border': topBorder }">
      <h2>{{ title }}</h2>
      <slot name="operation" />
      <a-button v-show="more" type="link"> 更多 </a-button>
    </div>
    <slot name="content" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    more: {
      type: Boolean,
      default: false
    },
    topBorder: {
      type: Boolean,
      default: false
    },
    titleBorder: {
      type: Boolean,
      default: false
    }
  });
</script>

<style lang="less" scoped>
  .block-card {
    background: var(--primary-bg);
    .block-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      height: 48px;
      padding: 0 16px;
      font-weight: bold;
      &.title-border {
        border-bottom: 1px solid var(--primary-divider);
      }
    }
    h2 {
      font-size: 14px;
      line-height: 26px;
      color: var(--color-text-title);
    }
  }
</style>
