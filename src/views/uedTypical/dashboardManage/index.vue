<template>
  <div class="dashboard-wrap">
    <div class="group">
      <GroupComponent :dataSource="groupData"></GroupComponent>
    </div>
    <div class="table">
      <ListComponent></ListComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
  import GroupComponent from './components/group.vue';
  import ListComponent from './components/list.vue';

  const groupData: any[] = [
    {
      key: '1',
      name: '全部',
      count: 20
    },
    {
      key: '2',
      name: '仪表盘',
      count: 5
    },
    {
      key: '3',
      name: '可视化大屏',
      count: 5
    },
    {
      key: '4',
      name: '可视化拓扑',
      count: 5
    },
    {
      key: '5',
      name: '通用典型页面',
      count: 5
    }
  ];
</script>

<style lang="less" scoped>
  .dashboard-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 24px 0 16px 16px;
    background: var(--color-bg-container);
    .group {
      width: 208px;
      height: calc(100vh - 176px);
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px solid var(--color-component-stroke);
    }
    .table {
      flex: 1;
    }
  }
</style>
