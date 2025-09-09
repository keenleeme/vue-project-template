<ComponentInfo developer="李忠贤" date="2025-03-24" />

# das-sql-tip-tree  SQL查询组件

## 组件说明

通用 aiql 语法生成器，SQL过滤器/多条件组合器（Query Builder），是一种允许用户通过图形化界面动态组合多个查询条件，并直接生成 SQL语句（如WHERE子句）的交互组件。它抽象了SQL语法复杂性，通过直观的界面帮助用户（包括非技术人员）实现灵活、精准的数据筛选。
🆕 新版UI还原，并修复了几处样式问题：

- 修复了sql-tree的条件树如果第一个是条件组的连接线渲染异常问题，调整了连接线的渲染方式及条件
- 滚动区域修改，修复了出现滚动条后的滚动区域与提示文字间的重叠问题
- 修复了运算符选择器的placeholder未正确显示的问题
- 样式调整，并将部分原生组件还原为了相应antd组件的样式
- 增加了部分组件数据的ts类型规范
- 规范了部分参数命名（驼峰、短横线、下划线、大小写混用）
- 修改了部分暗色模式的样式
- 部分原被注释的vue2语法转vue3
- input中的PopTip弹出框改用ant-design-vue Popover组件

## 何时使用

- 通过下拉框、输入框等传统表单控件构建条件， 帮助用户通过图形化界面进行数据筛选，而不需要手动编写SQL语句
- 实时SQL预览：同步显示生成的SQL语句，便于用户验证逻辑
- 允许用户创建条件组，定义逻辑关系，满足用户从简单到复杂的数据筛选需求，尤其适用于需要灵活组合多维度条件的场景

## 交互演示  {style="color:#ff47a3"}

通过编辑JSON配置，实时预览组件效果

:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-sql-tip-tree
      :all-field-list="config.allFieldList"
      :freq-used-field-list="config.freqUsedFieldList"
      :get-value-options-fn="config.getValueOptions"
      :get-tree-obj-by-sql-via-api-fn="config.getTreeObjBySqlViaApi"
      :aiql-guide="config.aiqlGuides"
      :is-history-show="config.isHistoryShow"
      @ai-trans-aiql="config.handleAiTransClick"
    />
  </JsonEditor>
</template>

<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/sql-tip-tree/mock/config';
  import { ref } from 'vue';

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
  async function getValueOptions(params) {
    // 此处调用接口 参数是params 当选择了的field的时候，动态获取后面value的数据
    return [false, []];
  }

  function getTreeObjBySqlViaApi() {
    // 此处调用接口 参数是params 当存在aiql表达式的时候，点击tree展开，获取展开数的数据
    return [false, []];
  }

  function handleAiTransClick(value) {
    console.log('handleAiTransClick', value)
  }
</script>
<style>
  .demo-sql-tip-tree .demoblock-view {
    overflow: unset !important;
  }
</style>
```

:::

## 基础用法

:::demo

```vue
<template>
  <div>
    <das-sql-tip-tree
      ref="sqlTipTreeRef"
      :all-field-list="allFieldList"
      :freq-used-field-list="freqUsedFieldList"
      :get-value-options-fn="getValueOptions"
      :get-tree-obj-by-sql-via-api-fn="getTreeObjBySqlViaApi"
      :aiql-guide="aiqlGuides"
      :isHistoryShow="true"
      :isHistoryWrapShow="true"
      @onShowHistory="onShowHistory"
      @ai-trans-aiql="handleAiTransClick"
      >
        <template #history>
          <a-tooltip placement="top">
            <template #title>
              <span>搜索记录插槽</span>
            </template>
            <HistoryOutlined />
          </a-tooltip>
        </template>
      </das-sql-tip-tree>
    <a-button style="margin-top: 16px" @click="addRule">添加规则示例</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/sql-tip-tree/mock/config';
  import { HistoryOutlined } from '@ant-design/icons-vue';
  import { ref } from 'vue';

  const sqlTipTreeRef = ref();

  // 添加规则示例
  const addRule = () => {
    sqlTipTreeRef.value?.addTreeRules([{
      id: '1',
      type: 'rule',
      field: 'eventType',
      operator: '==',
      value: 'test'
    },{
      id: '2',
      type: 'rule',
      field: 'eventType',
      operator: '==',
      value: 'tes2t'
    }]);
  };

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
  async function getValueOptions(params) {
    // 此处调用接口 参数是params 当选择了的field的时候，动态获取后面value的数据
    return [false, []];
  }

  function getTreeObjBySqlViaApi() {
    // 此处调用接口 参数是params 当存在aiql表达式的时候，点击tree展开，获取展开数的数据
    return [false, []];
  }
  function onShowHistory(v){
    console.log(v)
  }

  function handleAiTransClick(value) {
    console.log('handleAiTransClick', value)
  }
</script>
<style>
  .demo-sql-tip-tree .demoblock-view {
    overflow: unset !important;
  }
</style>
```

:::

## API

### das-sql-tip-tree

| 属性名 | 说明 | 类型 | 默认值 {width="100px"} | 是否必填 {width="100px"} |
| --- | --- | --- | --- | :---: |
| allFieldList | AIQL 所有字段集合数组，具体项见下表 | `FieldListType[]` | [] | - |
| freqUsedFieldList | AIQL 常用字段集合数组，具体项见下表 | `FieldListType[]` | [] | - |
| dynamicListObj | 活动列表数据 | `object<{ threshold: any, element: any, object: any }>` | {} | - |
| aiqlGuide | AIQL 语法提示数据 | `AiqlGuideType[]` | [] | - |
| disabled | 禁用编辑和语法提示 | `boolean` | false | - |
| isShowTreeIcon | 是否显示自定义数据 | `boolean` | true | - |
| maxRulesCount | 添加条件最大数量限制 | `number` | 100 | - |
| maxGroupDepth | 添加组最大数量限制 | `number` | 5 | - |
| isShowValue | 在字段展示的时候，是否显示字段的 value 值 | `boolean` | false | - |
| isShowAI | 是否开启AI能力<sup style="color: red;">[开启需要同时恒脑校验通过且配置打开]</sup> | `boolean` | false | - |
| isAiqlShow | 是否显示语法提示 | `boolean` | true | - |
| isHistoryWrapShow | 自定义了历史记录，需要设置为true | `boolean` | false | - |
| isHistoryShow | 是否显示历史记录icon | `boolean` | false | - |
| isSupportValueFilter | 在选择 field 字段搜索时，是否支持 value 搜索 | `boolean` | false | - |
| operatorsConfig | 当默认的操作符不满足的时候，可传入对应类型的操作符`例如：{ string: ['==', '!==', 'match', ...], number: [...] }` | `object<{ string: string[], number: string[], ... }>` | false | - |
| getValueOptionsFn | 一个异步函数，根据选中的 field 从服务器获取队友的 value 数据。此函数的参数我会传递给你，返回一个 Promise。该 Promise 解析为一个包含两个元素的数组：第一个元素是一个布尔值，表示请求是否成功；如果请求成功，则第二个元素是实际的数据对象。`调用时机：当选择的field字段发生变化`。 | `(arg: any) => Promise<[success: boolean, data?: any]>` | - | 是 |
| getTreeObjBySqlViaApiFn | 同上。`调用时机：当存在表达式的时候，点击展开tree模式`。 | `(arg: any) => Promise<[success: boolean, data?: any]>` | - | 是 |
| getDynamiclistObjDataByEnId | 同上。`调用时机：当添加了表达式过滤时候`。 | `(arg: any) => Promise<[success: boolean, data?: any]>` | - | - |

## FieldListType

字段数据对象，用于常用及所有字段集合数组

| 属性名 | 说明 | 类型 | 默认值 {width="100px"} | 是否必填 {width="100px"} |
| --- | --- | --- | --- | :---: |
| id | 唯一id | `string` | - | 是 |
| value | 字段值，如 eventType | `string` | - | 是 |
| label | 字段显示名称，如 事件类型 | `string` | - | 是 |
| type | 字段类型，如 string | `string` | - | 是 |
| desc | 字段描述 | `string` | - | 是 |
| isCustom | 是否为自定义字段 | `boolean` | false | 是 |
| isLabel | 是否为标签字段 | `boolean` | false | 是 |
| isCommon | 是否为常用字段 | `boolean` | false | 是 |
| isQuery | 是否可查询 | `boolean` | false | 是 |
| isAgg | 是否可聚合 | `boolean` | false | 是 |
| list | 字段可选值列表，主要用于处理枚举类型（type: 'enum'）的字段选项，list数组包含了所有可选的枚举值 | `FieldListType` | null | - |

## AiqlGuideType

AIQL 语法提示数据对象

| 属性名 | 说明 | 类型 | 默认值 {width="100px"} | 是否必填 {width="100px"} |
| --- | --- | --- | --- | :---: |
| expression | 语法 | `string` | - | 是 |
| tab | 语法类型 | `string` | - | - |
| desc | 语法描述 | `string` | - | - |
| example | 语法示例 | `string` | - | - |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onAddRuleSuccess | 添加规则成功时触发 | `(rule: RuleType) => void` |
| onSqlInputChange | SQL输入框内容变化时触发 | `(value: string) => void` |
| onEnter | 按下回车键时触发 | `(event: KeyboardEvent) => void` |
| onBlur | 输入框失去焦点时触发 | `(event: FocusEvent) => void` |
| onFocus | 输入框获得焦点时触发 | `(event: FocusEvent) => void` |
| onLangChange | 语言切换时触发 | `(lang: string) => void` |
| aiTransAiql | AI转换AIQL时触发 | `(value: string) => void` |
| showAiResult | 显示AI结果时触发 | `(result: any) => void` |
| searchFeedback | 搜索反馈时触发 | `(feedback: any) => void` |
| onTreeOpenChange | 树形结构展开/收起时触发 | `(expanded: boolean) => void` |
