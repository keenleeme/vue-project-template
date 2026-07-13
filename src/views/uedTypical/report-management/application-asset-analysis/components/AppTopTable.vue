<template>
  <a-table
    :columns="columns"
    :data-source="rows"
    :pagination="false"
    row-key="appId"
    size="middle"
    :scroll="{ x: 1200 }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'appName'">
        <a-button type="link" class="link-btn" @click="emit('drill', record.appId)">
          {{ record.appName }}
        </a-button>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
      </template>
      <template v-else-if="column.key === 'lifecycle'">
        <AppLifecycleBadge :lifecycle="record.lifecycle" />
      </template>
      <template v-else-if="column.key === 'riskCount'">
        <RiskLevelBar :dist="record.riskCount" show-total />
      </template>
      <template v-else-if="column.key === 'dataTags'">
        <a-space wrap :size="4">
          <a-tag v-for="tag in record.dataTags" :key="tag">{{ tag }}</a-tag>
        </a-space>
      </template>
      <template v-else-if="column.key === 'visits'">
        {{ formatNumber(record.visits) }}
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { AppTopRow } from '../types';
  import AppLifecycleBadge from './AppLifecycleBadge.vue';
  import RiskLevelBar from './RiskLevelBar.vue';

  const props = defineProps<{
    rows: AppTopRow[];
    variant: 'defect' | 'attack' | 'behavior';
  }>();

  const emit = defineEmits<{
    drill: [appId: string];
  }>();

  const riskCountTitle = computed(() => {
    if (props.variant === 'defect') return '缺陷数量';
    if (props.variant === 'attack') return '攻击风险数量';
    return '行为风险数量';
  });

  const columns = computed(() => [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 70, fixed: 'left' as const },
    { title: '应用名称', dataIndex: 'appName', key: 'appName', width: 140, fixed: 'left' as const },
    { title: '域名', dataIndex: 'domain', key: 'domain', width: 180, ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '生命周期', dataIndex: 'lifecycle', key: 'lifecycle', width: 130 },
    { title: riskCountTitle.value, dataIndex: 'riskCount', key: 'riskCount', width: 180 },
    { title: '数据标签', dataIndex: 'dataTags', key: 'dataTags', width: 260 },
    { title: '访问量', dataIndex: 'visits', key: 'visits', width: 120 }
  ]);

  function statusColor(status: string) {
    if (status === '关键') return 'red';
    if (status === '确认') return 'blue';
    if (status === '不重要') return 'default';
    return 'default';
  }

  function formatNumber(val: number) {
    return val.toLocaleString('zh-CN');
  }
</script>

<style lang="less" scoped>
  .link-btn {
    padding: 0;
  }
</style>
