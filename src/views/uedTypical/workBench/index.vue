<template>
  <div class="workbench-wrap">
    <!-- <SearchComponent></SearchComponent> -->
    <div class="card-wrap">
      <das-metric-card
        v-for="item in cardData"
        :key="item.title"
        :title="item.title"
        layout="vertical"
        :bordered="false"
        :wrapper-style="{
          flex: 1,
          backgroundColor: 'var(--color-bg-container)',
          borderRadius: '6px',
          padding: '16px'
        }"
      >
        <template #image>
          <img :src="item.icon" alt="icon" style="width: 40px; height: 40px" />
        </template>
        <template #default>
          <div v-if="item.type === 'time'" class="time-value">
            <div v-for="child in item.timeValue" :key="child.label">
              {{ child.value }}<span>{{ child.label }}</span>
            </div>
          </div>
          <div v-else class="count-value">
            <DasCountTo :end="item.value" :size="32" :weight="600" :suffix="` ${item.unit}`" :unit-size="12" />
          </div>
        </template>
      </das-metric-card>
    </div>
    <ChartsComponent></ChartsComponent>
    <ListComponent></ListComponent>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ChartsComponent from './components/charts.vue';
  import ListComponent from './components/list.vue';
  import fourSvg from './images/four.png';
  import oneSvg from './images/one.png';
  import threeSvg from './images/three.png';
  import twoSvg from './images/two.png';

  const cardData = ref([
    {
      title: I18N.layout.woCanYuDeShiJianZongShu,
      unit: I18N.layout.jian,
      icon: oneSvg,
      value: 1315
    },
    {
      title: I18N.layout.woCanYuDeShiJianZongShu,
      unit: I18N.layout.jian,
      icon: twoSvg,
      value: 1315
    },
    {
      title: I18N.layout.woFuZeDeShiJianZongShu,
      unit: I18N.layout.jian,
      icon: threeSvg,
      value: 0, // 时间类型不需要传递给DasCountTo，设置为0避免类型错误
      type: 'time',
      timeValue: [
        {
          label: I18N.layout.shi,
          value: '5'
        },
        {
          label: I18N.layout.fen,
          value: '36'
        },
        {
          label: I18N.layout.miao,
          value: '12'
        }
      ]
    },
    {
      title: I18N.layout.woFuZeDeShiJianGuanBiLv,
      unit: '%',
      icon: fourSvg,
      value: 37.32
    }
  ]);
</script>

<style lang="less" scoped>
  .workbench-wrap {
    height: 100%;
  }
  .card-wrap {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    margin: 16px;
    gap: 16px;
  }

  .time-value {
    display: flex;
    align-items: flex-end;
    font-size: var(--font-size-xl);
    color: var(--color-text-primarys);
    line-height: 32px;
    font-weight: 600;

    span {
      font-size: var(--font-size-base);
      color: var(--color-text-placeholder);
      margin: 0 4px;
    }
  }

  .count-value {
    display: flex;
    align-items: flex-end;
  }
</style>
