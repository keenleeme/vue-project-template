<template>
  <div class="search-wrap divider">
    <div class="tabs left">
      <a-select v-if="showTabs" ref="select" v-model:value="activeKey" style="width: 120px" @change="handleChange">
        <a-select-option value="1">{{ $t('I18N.layout.yiBiaoPanMingCheng1') }}</a-select-option>
        <a-select-option value="2">{{ $t('I18N.layout.yiBiaoPanMingCheng2') }}</a-select-option>
        <a-select-option value="3" disabled>{{ $t('I18N.layout.yiBiaoPanMingCheng3') }}</a-select-option>
      </a-select>
      <a-tabs v-else v-model:active-key="activeKey">
        <a-tab-pane key="1" :tab="$t('I18N.layout.yiBiaoPanMingCheng1')"></a-tab-pane>
        <a-tab-pane key="2" :tab="$t('I18N.layout.yiBiaoPanMingCheng2')"></a-tab-pane>
        <a-tab-pane key="3" :tab="$t('I18N.layout.yiBiaoPanMingCheng3')" disabled></a-tab-pane>
      </a-tabs>
    </div>
    <!-- <a-radio-group v-model:value="tabPosition" style="margin: 8px">
      <a-radio-button value="1">{{ $t('I18N.layout.moRen') }}</a-radio-button>
      <a-radio-button value="2">{{ $t('I18N.layout.ziDingYi') }}</a-radio-button>
    </a-radio-group> -->
    <!-- <div class="sql-input ml-8">
      <DasSqlTipTree
        :props_allFieldList="allFieldList"
        :props_freqUsedFieldList="freqUsedFieldList"
        :get-value-options-fn="getValueOptions"
        :get-tree-obj-by-sql-via-api-fn="getTreeObjBySqlViaApi"
        :aiql-guide="aiqlGuides"
      />
    </div> -->
    <div class="right">
      <a-date-picker v-model:value="timeValue" class="ml-8 date-picker" :placeholder="$t('I18N.layout.kaiShiRiQi')" />
      <a-button class="ml-8">
        <template #icon>
          <Icon>
            <template #component>
              <svg
                data-v-4c45684f=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="currentColor"
              >
                <g data-v-4c45684f="" fill="currentColor">
                  <rect data-v-4c45684f="" width="16" height="16" fill="currentColor" opacity="0"></rect>
                  <path
                    data-v-4c45684f=""
                    fill="currentColor"
                    fill-opacity=".9"
                    d="M8,1.2 L14.1,4.6 L14.1,11.4 L8,14.8 L1.9,11.4 L1.9,4.6 L8,1.2 Z M8,2.4 L2.9,5.2 L2.9,10.8 L8,13.6 L13.1,10.8 L13.1,5.2 L8,2.4 Z M8,5 C9.7,5 11,6.3 11,8 C11,9.7 9.7,11 8,11 C6.3,11 5,9.7 5,8 C5,6.3 6.3,5 8,5 Z M8,6 C6.9,6 6,6.9 6,8 C6,9.1 6.9,10 8,10 C9.1,10 10,9.1 10,8 C10,6.9 9.1,6 8,6 Z"
                  ></path>
                </g>
              </svg>
            </template>
          </Icon>
        </template>
      </a-button>
    </div>
    <!-- <a-button class="ml-8">
      <template #icon>
        <Icon :style="{ position: 'relative', top: '2px' }">
          <template #component>
            <svg
              data-v-4c45684f=""
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
            >
              <g data-v-4c45684f="" fill="currentColor">
                <rect data-v-4c45684f="" width="16" height="16" fill="currentColor" opacity="0"></rect>
                <path
                  data-v-4c45684f=""
                  fill="currentColor"
                  fill-opacity=".9"
                  d="M8,1.2 L14.1,4.6 L14.1,11.4 L8,14.8 L1.9,11.4 L1.9,4.6 L8,1.2 Z M8,2.4 L2.9,5.2 L2.9,10.8 L8,13.6 L13.1,10.8 L13.1,5.2 L8,2.4 Z M8,5 C9.7,5 11,6.3 11,8 C11,9.7 9.7,11 8,11 C6.3,11 5,9.7 5,8 C5,6.3 6.3,5 8,5 Z M8,6 C6.9,6 6,6.9 6,8 C6,9.1 6.9,10 8,10 C9.1,10 10,9.1 10,8 C10,6.9 9.1,6 8,6 Z"
                ></path>
              </g>
            </svg>
          </template>
        </Icon>
      </template>
      {{ $t('I18N.layout.sheZhiPianHao') }}
    </a-button> -->
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Icon from '@ant-design/icons-vue';

  const showTabs = ref(true);
  const activeKey = ref('1');
  const tabPosition = ref('1');
  const timeValue = ref();
  const freqUsedFieldList = ref([
    {
      id: '1821821109012938753',
      value: 'eventType',
      label: '事件类型',
      type: 'string',
      desc: '事件类型',
      isCustom: true,
      isLabel: true,
      isCommon: true,
      isQuery: true,
      isAgg: true,
      list: null
    },
    {
      id: '1821821109365260289',
      value: 'flowDestPort',
      label: 'flow目的端口',
      type: 'int',
      desc: 'flow目的端口',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: true,
      list: null
    }
  ]);
  const allFieldList = ref([
    {
      id: '1821821109012938753',
      value: 'eventType',
      label: '事件类型',
      type: 'string',
      desc: '事件类型',
      isCustom: true,
      isLabel: true,
      isCommon: true,
      isQuery: true,
      isAgg: true,
      list: null
    },
    {
      id: '1821821109365260289',
      value: 'flowDestPort',
      label: 'flow目的端口',
      type: 'int',
      desc: 'flow目的端口',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: true,
      list: null
    },
    {
      id: '1821821109902131201',
      value: 'IoCLevel',
      label: '危害等级',
      type: 'enum',
      desc: '情报危害等级，Critical/High/Medium/Low/Info',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: false,
      list: [
        {
          id: '1821821109914714113',
          value: 'Info',
          label: '信息',
          type: null,
          desc: '情报危害评级为信息',
          isCustom: null,
          isLabel: null,
          isCommon: null,
          isQuery: null,
          isAgg: null,
          list: null
        },
        {
          id: '1821821109918908418',
          value: 'Low',
          label: '低',
          type: null,
          desc: '情报危害评级为低',
          isCustom: null,
          isLabel: null,
          isCommon: null,
          isQuery: null,
          isAgg: null,
          list: null
        }
      ]
    },
    {
      id: '1821821109654667266',
      value: 'tags',
      label: '情报标签',
      type: 'array',
      desc: '情报标签',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: false,
      list: null
    },
    {
      id: '1821821115677687809',
      value: 'responseTime',
      label: '响应时间',
      type: 'double',
      desc: '响应时间',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: true,
      list: null
    },
    {
      id: '1821821109881159681',
      value: 'isAPT',
      label: '是否为APT攻击',
      type: 'boolean',
      desc: '是否为APT攻击',
      isCustom: true,
      isLabel: true,
      isCommon: false,
      isQuery: true,
      isAgg: true,
      list: null
    }
  ]);

  const aiqlGuides = ref([
    {
      expression: 'AND',
      tab: '基础语法',
      desc: '与',
      example: 'srcAddress == "192.168.1.101" AND destAddress == "192.168.1.102"'
    },
    {
      expression: 'OR',
      tab: '基础语法',
      desc: '或',
      example: 'srcAddress =="192.168.1.101" OR destAddress == "192.168.1.102"'
    }
  ]);
  async function getValueOptions() {
    // 此处调用接口 参数是params 当选择了的field的时候，动态获取后面value的数据
    return [false, []];
  }

  function getTreeObjBySqlViaApi() {
    // 此处调用接口 参数是params 当存在aiql表达式的时候，点击tree展开，获取展开数的数据
    return [false, []];
  }
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
  };
</script>

<style lang="less" scoped>
  .search-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 8px;
    background: var(--color-bg-container);
    .tabs {
      padding: 0 16px;
      background-color: var(--color-bg-container);
      :deep(.ant-tabs) {
        .ant-tabs-nav {
          margin-bottom: 0;
        }
        .ant-tabs-nav::before {
          display: none;
        }
      }
      .ant-select-focused.ant-select .ant-select-selector {
        border: transparent;
        box-shadow: none;
      }
      :deep(.ant-select-selector) {
        border: transparent !important;
        box-shadow: none !important;
      }
    }
    &.divider {
      // border-left: 1px solid var(--color-component-stroke);
      border-bottom: 1px solid var(--color-component-stroke);
    }
    .date-picker {
      width: 185px;
    }
  }
  .sql-input {
    flex: 1;
  }
</style>
