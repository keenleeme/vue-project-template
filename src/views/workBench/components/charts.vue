<template>
  <div class="chart-wrap">
    <div class="left">
      <BlockCard :title="'我负责事件的级别分配'">
        <template #content>
          <PieChartComponent
            :data="[
              {
                name: '高危',
                value: 0
              },
              {
                name: '中危',
                value: 0
              },
              {
                name: '低微',
                value: 0
              }
            ]"
            height="160px"
          ></PieChartComponent>
        </template>
      </BlockCard>
      <BlockCard :title="'我负责事件状态分布'">
        <template #content>
          <PieChartComponent
            :data="[
              {
                name: '活动中',
                value: 0
              },
              {
                name: '已关闭',
                value: 0
              },
              {
                name: '已超时',
                value: 0
              },
              {
                name: '错误',
                value: 0
              }
            ]"
            :theme-color="['#134BEA', '#1DB969', '#F53C3C', '#A74748']"
            height="160px"
          ></PieChartComponent>
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
