<template>
  <div>
  <DsSqlTipTree
    :props_allFieldList="allFieldList"
    :props_freqUsedFieldList="freqUsedFieldList"
    :get-value-options-fn="getValueOptions"
    :get-tree-obj-by-sql-via-api-fn="getTreeObjBySqlViaApi"
    :aiql-guide="aiqlGuides"
  />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const freqUsedFieldList  =ref(
[
  {
      "id": "1821821109012938753",
      "value": "eventType",
      "label": "事件类型",
      "type": "string",
      "desc": "事件类型",
      "isCustom": true,
      "isLabel": true,
      "isCommon": true,
      "isQuery": true,
      "isAgg": true,
      "list": null
  },
  {
      "id": "1821821109365260289",
      "value": "flowDestPort",
      "label": "flow目的端口",
      "type": "int",
      "desc": "flow目的端口",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": true,
      "list": null
  }
])
const allFieldList  =ref(
[
  {
      "id": "1821821109012938753",
      "value": "eventType",
      "label": "事件类型",
      "type": "string",
      "desc": "事件类型",
      "isCustom": true,
      "isLabel": true,
      "isCommon": true,
      "isQuery": true,
      "isAgg": true,
      "list": null
  },
  {
      "id": "1821821109365260289",
      "value": "flowDestPort",
      "label": "flow目的端口",
      "type": "int",
      "desc": "flow目的端口",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": true,
      "list": null
  },
  {
      "id": "1821821109902131201",
      "value": "IoCLevel",
      "label": "危害等级",
      "type": "enum",
      "desc": "情报危害等级，Critical/High/Medium/Low/Info",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": false,
      "list": [
          {
              "id": "1821821109914714113",
              "value": "Info",
              "label": "信息",
              "type": null,
              "desc": "情报危害评级为信息",
              "isCustom": null,
              "isLabel": null,
              "isCommon": null,
              "isQuery": null,
              "isAgg": null,
              "list": null
          },
          {
              "id": "1821821109918908418",
              "value": "Low",
              "label": "低",
              "type": null,
              "desc": "情报危害评级为低",
              "isCustom": null,
              "isLabel": null,
              "isCommon": null,
              "isQuery": null,
              "isAgg": null,
              "list": null
          }
      ]
  },
  {
      "id": "1821821109654667266",
      "value": "tags",
      "label": "情报标签",
      "type": "array",
      "desc": "情报标签",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": false,
      "list": null
  },
  {
      "id": "1821821115677687809",
      "value": "responseTime",
      "label": "响应时间",
      "type": "double",
      "desc": "响应时间",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": true,
      "list": null
  },
  {
      "id": "1821821109881159681",
      "value": "isAPT",
      "label": "是否为APT攻击",
      "type": "boolean",
      "desc": "是否为APT攻击",
      "isCustom": true,
      "isLabel": true,
      "isCommon": false,
      "isQuery": true,
      "isAgg": true,
      "list": null
  }
]
)

const aiqlGuides = ref([
{
  expression: 'AND',
  tab: '基础语法',
  desc: '与',
  example: 'srcAddress == "192.168.1.101" AND destAddress == "192.168.1.102"',
},
{
  expression: 'OR',
  tab: '基础语法',
  desc: '或',
  example: 'srcAddress =="192.168.1.101" OR destAddress == "192.168.1.102"',
},
])
async function getValueOptions(params) {
  // 此处调用接口 参数是params 当选择了的field的时候，动态获取后面value的数据
  return [false,[]]
}

function getTreeObjBySqlViaApi(){
  // 此处调用接口 参数是params 当存在aiql表达式的时候，点击tree展开，获取展开数的数据
  return [false,[]]
}
</script>
