<template>
  <div class="chart-wrap">
    <div class="left">
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianDeJiBieFenPei')">
        <template #content>
          <div ref="pieChart1" class="chart-container"></div>
        </template>
      </BlockCard>
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianZhuangTaiFenBu')">
        <template #content>
          <div ref="pieChart2" class="chart-container"></div>
        </template>
      </BlockCard>
    </div>
    <div class="right">
      <BlockCard :title="$t('I18N.layout.woFuZeShiJianShuLiangQuShi')">
        <template #content>
          <div ref="lineChart" class="chart-container"></div>
        </template>
      </BlockCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import { storeToRefs } from 'pinia';
  import BlockCard from '@/components/uedModule/blockCard/index.vue';
  import { useThemeStore } from '@/store';

  const pieChart1 = ref<HTMLElement>();
  const pieChart2 = ref<HTMLElement>();
  const lineChart = ref<HTMLElement>();

  let pieChart1Instance: echarts.ECharts | null = null;
  let pieChart2Instance: echarts.ECharts | null = null;
  let lineChartInstance: echarts.ECharts | null = null;

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);

  // 饼图1配置 - 级别分配
  const getPieChart1Option = () => ({
    color: ['#F53C3C', '#FF7F29', '#FFD700'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 6,
      itemGap: 12,
      borderRadius: 6,
      textStyle: {
        color: themeConfig.value.mode === 'dark' ? '#fff' : '#1E2435'
      },
      formatter(name: any) {
        return name;
      }
    },
    series: [
      {
        name: '级别分配',
        type: 'pie',
        radius: ['55%', '65%'],
        center: ['35%', '50%'],
        avoidLabeloverlap: false,
        padAngle: 5,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45, name: '高危' },
          { value: 35, name: '中危' },
          { value: 20, name: '低微' }
        ]
      },
      {
        name: '',
        type: 'pie',
        radius: ['45%', '55%'],
        center: ['35%', '50%'],
        avoidLabeloverlap: false,
        hasAnimation: false,
        padAngle: 5,
        tooltip: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          color: (list: any) => {
            const colorList = ['rgba(245, 60, 60, 0.1)', 'rgba(255, 127, 41, 0.1)', 'rgba(255, 215, 0, 0.1)'];
            return colorList[list.dataIndex];
          }
        },
        data: [
          { value: 45, name: '高危' },
          { value: 35, name: '中危' },
          { value: 20, name: '低微' }
        ]
      }
    ]
  });

  // 饼图2配置 - 状态分布
  const getPieChart2Option = () => ({
    color: ['#134BEA', '#1DB969', '#F53C3C', '#8B4513'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 6,
      itemGap: 12,
      borderRadius: 6,
      textStyle: {
        color: themeConfig.value.mode === 'dark' ? '#fff' : '#1E2435'
      },
      formatter(name: any) {
        return name;
      }
    },
    series: [
      {
        name: '状态分布',
        type: 'pie',
        radius: ['55%', '65%'],
        center: ['35%', '50%'],
        avoidLabeloverlap: false,
        padAngle: 5,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 38, name: '活动中' },
          { value: 32, name: '已关闭' },
          { value: 18, name: '已超时' },
          { value: 12, name: '错误' }
        ]
      },
      {
        name: '',
        type: 'pie',
        radius: ['45%', '55%'],
        center: ['35%', '50%'],
        avoidLabeloverlap: false,
        hasAnimation: false,
        padAngle: 5,
        tooltip: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          color: (list: any) => {
            const colorList = [
              'rgba(19, 75, 234, 0.1)',
              'rgba(29, 185, 105, 0.1)',
              'rgba(245, 60, 60, 0.1)',
              'rgba(139, 69, 19, 0.1)'
            ];
            return colorList[list.dataIndex];
          }
        },
        data: [
          { value: 38, name: '活动中' },
          { value: 32, name: '已关闭' },
          { value: 18, name: '已超时' },
          { value: 12, name: '错误' }
        ]
      }
    ]
  });

  // 折线图配置 - 数量趋势
  const getLineChartOption = () => ({
    color: ['#134BEA'],
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '6%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      splitLine: {
        lineStyle: {
          color: themeConfig.value.mode === 'dark' ? '#394052' : '#E9EAF0',
          type: 'dashed'
        }
      },
      axisLine: {
        lineStyle: {
          color: themeConfig.value.mode === 'dark' ? '#394052' : '#E9EAF0'
        }
      },
      axisLabel: {
        color: themeConfig.value.mode === 'dark' ? '#fff' : '#1E2435'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1500,
      interval: 300,
      axisLine: {
        lineStyle: {
          color: themeConfig.value.mode === 'dark' ? '#ffffff' : '#1E2435'
        }
      },
      axisLabel: {
        color: themeConfig.value.mode === 'dark' ? '#fff' : '#1E2435'
      },
      splitLine: {
        lineStyle: {
          color: themeConfig.value.mode === 'dark' ? '#394052' : '#E9EAF0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '事件数量',
        type: 'line',
        smooth: true,
        data: [870, 920, 940, 960, 1280, 1320, 1310],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(19, 75, 234, 0.1)' },
              { offset: 1, color: 'rgba(19, 75, 234, 0)' }
            ]
          }
        }
      }
    ]
  });

  // 初始化图表
  const initCharts = () => {
    if (pieChart1.value) {
      pieChart1Instance = echarts.init(pieChart1.value);
      pieChart1Instance.setOption(getPieChart1Option());
    }

    if (pieChart2.value) {
      pieChart2Instance = echarts.init(pieChart2.value);
      pieChart2Instance.setOption(getPieChart2Option());
    }

    if (lineChart.value) {
      lineChartInstance = echarts.init(lineChart.value);
      lineChartInstance.setOption(getLineChartOption());
    }
  };

  // 更新图表主题
  const updateChartsTheme = () => {
    if (pieChart1Instance) {
      pieChart1Instance.setOption(getPieChart1Option());
    }
    if (pieChart2Instance) {
      pieChart2Instance.setOption(getPieChart2Option());
    }
    if (lineChartInstance) {
      lineChartInstance.setOption(getLineChartOption());
    }
  };

  // 监听主题变化
  watch(
    () => themeConfig.value.mode,
    () => {
      updateChartsTheme();
    }
  );

  // 监听窗口大小变化
  const handleResize = () => {
    pieChart1Instance?.resize();
    pieChart2Instance?.resize();
    lineChartInstance?.resize();
  };

  onMounted(() => {
    initCharts();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    pieChart1Instance?.dispose();
    pieChart2Instance?.dispose();
    lineChartInstance?.dispose();
  });
</script>

<style lang="less" scoped>
  .chart-wrap {
    display: flex;
    align-items: stretch;
    margin: 16px;
    gap: 16px;

    .left {
      display: flex;
      flex: 1;
      gap: 16px;

      div {
        flex: 1;
        background: var(--color-bg-container);
        border-radius: 6px;
        min-height: 160px;
      }
    }

    .right {
      flex: 1;

      div {
        background: var(--color-bg-container);
        border-radius: 6px;
        min-height: 160px;
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 160px;
  }
</style>
