<template>
  <div class="chart-wrap">
    <div class="left">
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianDeJiBieFenPei')">
        <template #content>
          <PieChartComponent
            :data="[
              {
                name: $t('I18N.layout.gaoWei'),
                value: 0
              },
              {
                name: $t('I18N.layout.zhongWei'),
                value: 0
              },
              {
                name: $t('I18N.layout.diWei'),
                value: 0
              }
            ]"
            height="160px"
            :dark-color="['#B63154', '#F53C3C', '#FF7F29', '#F53C3C']"
          ></PieChartComponent>
        </template>
      </BlockCard>
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianZhuangTaiFenBu')">
        <template #content>
          <PieChartComponent
            :data="[
              {
                name: $t('I18N.layout.huoDongZhong'),
                value: 0
              },
              {
                name: $t('I18N.layout.yiGuanBi'),
                value: 0
              },
              {
                name: $t('I18N.layout.yiChaoShi'),
                value: 0
              },
              {
                name: $t('I18N.layout.cuoWu'),
                value: 0
              }
            ]"
            :theme-color="['#134BEA', '#1DB969', '#F53C3C', '#A74748']"
            :dark-color="['#1DB969', '#FF7F29', '#6A7285', '#F53C3C']"
            height="160px"
          ></PieChartComponent>
        </template>
      </BlockCard>
    </div>
    <div class="right">
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianShuLiangQuShi')">
        <template #content>
          <LineChartComponent :data="[]" height="160px"></LineChartComponent>
        </template>
      </BlockCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BlockCard from '@/components/uedModule/blockCard/index.vue';
  import LineChartComponent from '@/components/uedModule/charts/lineChart.vue';
  import PieChartComponent from '@/components/uedModule/charts/pieChart.vue';
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
        background: var(--color-bg-container);
        &:first-child {
          margin-right: 16px;
        }
      }
    }
    .right {
      flex: 1;
      div {
        background: var(--color-bg-container);
      }
    }
  }
</style>
