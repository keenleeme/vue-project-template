<template>
  <a-space wrap :size="4">
    <a-tag v-for="tag in normalizedTags" :key="tag.name" :color="color">
      <span v-if="tag.ai" class="ai-data-tag">
        <span class="ai-data-tag__badge">AI</span>
        {{ tag.name }}
      </span>
      <span v-else>{{ tag.name }}</span>
    </a-tag>
    <span v-if="!normalizedTags.length" class="tag-empty">-</span>
  </a-space>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ApiDataTagInput } from '../types';
  import { normalizeDataTag } from '../utils/dataTag';

  const props = withDefaults(
    defineProps<{
      tags: ApiDataTagInput[];
      color?: string;
    }>(),
    { color: 'blue' }
  );

  const normalizedTags = computed(() => props.tags.map(normalizeDataTag));
</script>

<style lang="less" scoped>
  .ai-data-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .ai-data-tag__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 14px;
    padding: 0 3px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.28);
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }

  .tag-empty {
    font-size: 12px;
    color: var(--color-text-quaternary);
  }
</style>
