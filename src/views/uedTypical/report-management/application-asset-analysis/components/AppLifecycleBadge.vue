<template>
  <span class="lifecycle-badge" :title="lifecycle">
    <component :is="meta.icon" class="lifecycle-badge__icon" :style="{ color: meta.color }" />
    <span class="lifecycle-badge__text">{{ lifecycle }}</span>
  </span>
</template>

<script setup lang="ts">
  import {
    CheckCircleOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    SyncOutlined
  } from '@ant-design/icons-vue';
  import { computed } from 'vue';
  import type { AppLifecycle } from '../types';

  const props = defineProps<{
    lifecycle: AppLifecycle;
  }>();

  const lifecycleMeta: Record<
    AppLifecycle,
    { icon: typeof PlusCircleOutlined; color: string }
  > = {
    新发现: { icon: PlusCircleOutlined, color: '#1677ff' },
    活跃: { icon: CheckCircleOutlined, color: '#52c41a' },
    疑似下线: { icon: MinusCircleOutlined, color: '#faad14' },
    复活: { icon: SyncOutlined, color: '#722ed1' }
  };

  const meta = computed(() => lifecycleMeta[props.lifecycle]);
</script>

<style lang="less" scoped>
  .lifecycle-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #1f2a44;
  }

  .lifecycle-badge__icon {
    font-size: 16px;
  }
</style>
