<template>
  <span v-if="shouldMaskSample(sample)" class="param-sample-cell__text" :title="displayText">
    {{ displayText }}
  </span>
  <span v-else>{{ sample }}</span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ApiParameterRow } from '../types';
  import { maskSampleValue, shouldMaskSample } from '../utils/maskSample';

  const props = defineProps<{
    sample: string;
    record: ApiParameterRow;
  }>();

  const displayText = computed(() => maskSampleValue(props.sample, props.record));
</script>

<style lang="less" scoped>
  .param-sample-cell__text {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
</style>
