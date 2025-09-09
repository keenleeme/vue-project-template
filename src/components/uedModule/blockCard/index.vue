<template>
  <div class="block-card" :class="{ 'top-border': topBorder }">
    <div class="block-card-header" :class="{ 'title-border': topBorder || titleBorder }">
      <h2>{{ title }}</h2>
      <div class="block-card-description">
        <slot name="description" />
      </div>
      <div class="block-card-ops">
        <slot name="operation" />
        <a-button v-show="more" type="link"> {{ $t('I18N.layout.gengDuo') }} </a-button>
      </div>
    </div>
    <div class="block-card-content" :class="{ 'two-columns': twoColumns }" :style="contentPaddingStyle">
      <slot name="content"><slot /></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

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
    },
    twoColumns: {
      type: Boolean,
      default: false
    },
    contentPadding: {
      type: [Number, String],
      default: 0
    }
  });

  const contentPaddingStyle = computed(() => {
    const padding = typeof props.contentPadding === 'number' ? `${props.contentPadding}px` : props.contentPadding;
    return padding ? { padding } : undefined;
  });
</script>

<style lang="less" scoped>
  .block-card {
    background: var(--color-bg-container);
    &.top-border {
      border-top: 1px solid var(--color-component-stroke);
    }
    .block-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
      padding: 0 16px;
      font-weight: bold;
      &.title-border {
        border-bottom: 1px solid var(--color-component-stroke);
      }
      h2 {
        font-size: var(--font-size-base);
        line-height: 26px;
        color: var(--color-text-primarys);
        margin: 0;
      }
      .block-card-description {
        flex: 1;
        color: var(--color-text-primarys);
        font-weight: 400;
      }
      .block-card-ops {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .block-card-content {
      color: var(--color-text-primarys);
      &.two-columns {
        display: flex;
        flex-direction: row;
        & > div {
          width: 50%;
        }
      }
    }
  }
</style>
