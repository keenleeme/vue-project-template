<template>
  <div class="workbench-wrap">
    <SearchComponent></SearchComponent>
    <div class="card-wrap">
      <div v-for="item in cardData" :key="item.title" class="card-item">
        <img class="icon" :src="item.icon" />
        <div class="content">
          <div class="title">{{ item.title }}({{ item.unit }})</div>
          <div v-show="item.type !== 'time'" class="data">{{ item.value }}</div>
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
  import fourSvg from './images/four.svg';
  import oneSvg from './images/one.svg';
  import threeSvg from './images/three.svg';
  import twoSvg from './images/two.svg';

  const cardData = ref([
    {
      title: '我参与的事件总数',
      unit: '件',
      icon: oneSvg,
      value: 1315
    },
    {
      title: '我负责的事件总数',
      unit: '件',
      icon: twoSvg,
      value: 1315
    },
    {
      title: '我负责事件的平均处理时间',
      unit: '件',
      icon: threeSvg,
      value: '5时36分12秒',
      type: 'time',
      timeValue: [
        {
          label: '时',
          value: '5'
        },
        {
          label: '分',
          value: '36'
        },
        {
          label: '秒',
          value: '12'
        }
      ]
    },
    {
      title: '我负责的事件关闭率',
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
      background: var(--primary-bg);
      &:last-child {
        margin-right: 0;
      }
      .icon {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
      .title {
        font-size: 12px;
        color: var(--color-text-sub-title);
        line-height: 20px;
      }
      .data {
        font-size: 24px;
        color: var(--color-text-content);
        line-height: 32px;
        font-weight: 600;
        display: flex;
        align-items: flex-end;
        span {
          font-size: 12px;
          color: var(--color-text-placeholder);
          margin: 0 4px;
        }
      }
    }
  }
</style>
