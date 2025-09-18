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
          padding: '16px',
          height: '96px'
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
    <!-- 图表内容直接嵌入 -->
    <div class="chart-wrap">
      <div class="left">
        <div class="chart-block">
          <div class="chart-header">
            <div class="chart-title">我负责事件的级别分配</div>
          </div>
          <div class="chart-content">
            <div ref="pieChart1" class="chart-container"></div>
          </div>
        </div>
        <div class="chart-block">
          <div class="chart-header">
            <div class="chart-title">我负责事件状态分布</div>
          </div>
          <div class="chart-content">
            <div ref="pieChart2" class="chart-container"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="chart-block">
          <div class="chart-header">
            <div class="chart-title">我负责事件数量趋势</div>
          </div>
          <div class="chart-content">
            <div ref="lineChart" class="chart-container"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表内容直接嵌入 -->
    <div class="table-wrap">
      <das-table
        :columns="columns"
        :dataSource="data"
        :rowKey="'key'"
        :selection="true"
        :refreshIntervals="[5, 10, 20]"
        :total="data.length"
        :current="1"
        @change="onChange"
        @select="onSelect"
        @columnChange="columnChange"
        :bordered="false"
      >
        <!-- 操作栏插槽 -->
        <template #operate="{ rowSelection }">
          <a-button type="primary">
            <template #icon>
              <PlusOutlined />
            </template>
            新建
          </a-button>
          <a-button :disabled="rowSelection.length === 0">导出</a-button>
          <a-button :disabled="rowSelection.length === 0"> 重点关注 </a-button>
          <a-button :disabled="rowSelection.length === 0">取消关注</a-button>
        </template>

        <!-- 快捷查询插槽 -->
        <template #shortcut>
          <a-input
            style="width: 200px"
            v-model:value="searchKeyword"
            placeholder="请输入关键字"
            @change="handleSearch"
          />
        </template>

        <!-- 自定义单元格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="handleViewDetail(record)" class="brand-link">
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag v-for="tag in record.tags" :key="tag" :color="getTagColor(tag)">
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-button class="link" type="link" @click="handleViewDetail(record)"> 详情 </a-button>
            <a-button class="link" type="link" @click="handleDelete(record)"> 删除 </a-button>
          </template>
        </template>
      </das-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';
  import fourSvg from './images/four.png';
  import oneSvg from './images/one.png';
  import threeSvg from './images/three.png';
  import twoSvg from './images/two.png';

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

  const cardData = ref([
    {
      title: '我参与的事件总数',
      unit: '件',
      icon: oneSvg,
      value: 1315
    },
    {
      title: '我参与的事件总数',
      unit: '件',
      icon: twoSvg,
      value: 1315
    },
    {
      title: '我负责的事件总数',
      unit: '件',
      icon: threeSvg,
      value: 0, // 时间类型不需要传递给DasCountTo，设置为0避免类型错误
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

  // 图表相关
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

  // 表格相关
  const searchKeyword = ref('');

  // 表格列配置 - 使用a-table增强功能
  const columns: any[] = [
    {
      title: '项目名称',
      key: 'name',
      width: 200,
      // ellipsis: true,
      disabled: true, // 固定显示列
      resizable: true
    },
    {
      title: '所属组织',
      dataIndex: 'age',
      width: 150,
      ellipsis: true,
      resizable: true
    },
    {
      title: '所属类别',
      key: 'tags',
      width: 200
      // ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      fixed: 'right'
    }
  ];

  // 原始数据
  const originalData: TableDataType[] = [
    {
      key: '1',
      name: 'Opc网关系统',
      age: '根组织',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '2',
      name: '综合管理系统',
      age: '科信部门',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '3',
      name: '服务系统',
      age: '监管部门',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '4',
      name: '其他系统',
      age: '其他组织',
      tags: ['重要资产', '核心资产']
    }
  ];

  // 根据搜索关键词过滤数据
  const data = computed(() => {
    if (!searchKeyword.value) {
      return originalData;
    }
    return originalData.filter(
      (item) =>
        item.name.includes(searchKeyword.value) ||
        item.age.includes(searchKeyword.value) ||
        item.tags.some((tag) => tag.includes(searchKeyword.value))
    );
  });

  // 表格变化事件
  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log('表格查询:', { pagination, filters, sorter });
  };

  // 选择行事件
  const onSelect = (selectedRowKeys: string[], selectedRows: TableDataType[]) => {
    console.log('选择项:', { selectedRowKeys, selectedRows });
  };

  // 列配置变化事件
  const columnChange = (columns: TableColumnType<TableDataType>[]) => {
    console.log('列设置:', columns);
  };

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value);
  };

  // 查看详情
  const handleViewDetail = (record: TableDataType) => {
    console.log('查看详情:', record);
    // 这里可以添加跳转到详情页的逻辑
  };

  // 删除处理
  const handleDelete = (record: TableDataType) => {
    console.log('删除:', record);
    // 这里可以添加删除确认和删除逻辑
  };

  // 获取标签颜色
  const getTagColor = (tag: string) => {
    if (tag === '重要资产') return 'red';
    if (tag === '核心资产') return 'blue';
    return 'green';
  };
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
    height: 32px; /* 统一内容区域高度 */

    span {
      font-size: var(--font-size-base);
      color: var(--color-text-placeholder);
      margin: 0 4px;
    }
  }

  .count-value {
    display: flex;
    align-items: flex-end;
    height: 32px; /* 统一内容区域高度 */
  }

  .chart-wrap {
    display: flex;
    align-items: stretch;
    margin: 16px;
    gap: 16px;

    .left {
      display: flex;
      flex: 1;
      gap: 16px;
    }

    .right {
      flex: 1;
    }

    .chart-block {
      flex: 1;
      background: var(--color-bg-container);
      border-radius: 6px;
      // border: 1px solid var(--color-component-stroke);
      min-height: 200px;

      .chart-header {
        padding: 16px 20px 8px;
        border-bottom: 1px solid var(--color-component-stroke);

        .chart-title {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-text-primarys);
        }
      }

      .chart-content {
        padding: 16px 20px 20px;
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 160px;
  }

  .table-wrap {
    background: var(--color-bg-container);
    padding: 16px;
    margin: 16px;

    .link {
      padding: 0;
      margin-right: 20px;
      color: var(--color-brand-normal) !important;
      text-decoration: none;
      &:hover {
        color: var(--color-brand-active) !important;
        text-decoration: none;
      }
      &:last-child {
        margin-right: 0;
      }
    }

    .brand-link {
      color: var(--color-brand-normal) !important;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        color: var(--color-brand-active) !important;
        text-decoration: none;
      }
    }
  }
  /* 统一去除 a-button link 模式的下划线并应用品牌色 */
  :deep(.ant-btn-link) {
    color: var(--color-brand-normal) !important;
    text-decoration: none !important;
  }
  :deep(.ant-btn-link:hover),
  :deep(.ant-btn-link:focus) {
    color: var(--color-brand-active) !important;
    text-decoration: none !important;
  }
  /* 兼容某些主题对 a 标签的覆盖，确保内部元素不带下划线 */
  :deep(.ant-btn-link a),
  :deep(.ant-btn-link span),
  :deep(.ant-btn-link *) {
    text-decoration: none !important;
  }
</style>
