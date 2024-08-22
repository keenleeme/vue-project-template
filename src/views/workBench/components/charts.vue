<template>
  <div class="chart-wrap">
    <div class="left">
      <BlockCard :title="'我负责事件的级别分配'">
        <template #content>
          <PieChartComponent :data="[]" height="160px"></PieChartComponent>
        </template>
      </BlockCard>
      <BlockCard :title="'我负责事件状态分布'">
        <template #content>
          <PieChartComponent :data="[]" height="160px"></PieChartComponent>
        </template>
      </BlockCard>
    </div>
    <div class="right">
      <BlockCard :title="'我负责事件数量趋势'">
        <template #content>
          <LineChartComponent :data="[]" height="160px"></LineChartComponent>
        </template>
      </BlockCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BlockCard from '@/components/blockCard/index.vue';
  import LineChartComponent from '@/components/charts/lineChart.vue';
  import PieChartComponent from '@/components/charts/pieChart.vue';
</script>

<style lang="less" scoped>
  .chart-wrap {
    display: flex;
    align-items: center;
    margin: 16px;
    .left {
      display: flex;
      flex: 1;
      margin-right: 16px;
      div {
        flex: 1;
        background: var(--primary-bg);
        &:first-child {
          margin-right: 16px;
        }
      }
    }
    .right {
      flex: 1;
      div {
        background: var(--primary-bg);
      }
    }
  }
</style>
