<template>
  <div class="workbench-wrap">
    <!-- <SearchComponent></SearchComponent> -->
    <div class="card-wrap">
      <div v-for="item in cardData" :key="item.title" class="card-item">
        <img class="icon" :src="item.icon" />
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div v-show="item.type !== 'time'" class="data">
            <DasCountTo :end="item.value" :size="32" :weight="600" :suffix="` ${item.unit}`" :unit-size="12" />
          </div>
          <div v-show="item.type === 'time'" class="data">
            <div v-for="child in item.timeValue" :key="child.label">
              {{ child.value }}<span>{{ child.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChartsComponent></ChartsComponent>
    <ListComponent></ListComponent>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import ChartsComponent from './components/charts.vue';
  import ListComponent from './components/list.vue';
  import SearchComponent from './components/search.vue';
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
      value: '5时36分12秒',
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
    align-items: center;
    margin: 16px;
    .card-item {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 16px;
      margin-right: 16px;
      border-radius: 6px;
      background: var(--color-bg-container);
      &:last-child {
        margin-right: 0;
      }
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
      .title {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        line-height: 20px;
      }
      .data {
        font-size: 24px;
        color: var(--color-text-primarys);
        line-height: 32px;
        font-weight: 600;
        display: flex;
        align-items: flex-end;
        span {
          font-size: var(--font-size-base);
          color: var(--color-text-placeholder);
          margin: 0 4px;
        }
      }
    }
  }
</style>
