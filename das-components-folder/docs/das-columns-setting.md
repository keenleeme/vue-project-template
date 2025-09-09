# das-columns-setting 列设置

列设置基础模板，内部使用 ant-design-vue 组件库 Dropdown、CheckBox 组件包裹

## 基础用法

通过传入数组显示下拉选择菜单
选中数据回传

:::demo

```vue
<template>
  <DasColumnsSetting v-model="checkList" :column="testList"> </DasColumnsSetting>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const testList = [
    { name: '任务名称', value: '任务名称', show: 'all' },
    { name: '模版', value: '模版', show: 'all' },
    { name: '数据源', value: '数据源', show: 'all' },
    { name: '主机', value: '主机', show: undefined },
    { name: '资产统计', value: '资产统计', show: '数据打标' },
    { name: '梳理论次', value: '梳理论次', show: '数据打标' },
    { name: '当前处理步骤', value: '当前处理步骤', show: '数据打标' },
    { name: '执行周期', value: '执行周期', show: false },
    { name: '操作', value: '操作', show: 'all' }
  ];

  const checkList = ref<any[]>(['任务名称', '模版', '主机', '梳理论次', '操作']);
</script>
```

:::


## API

### das-columns-setting

| 参数    | 说明 | 类型   | 可选值 | 默认值 |
| ------- | ---- | ------ | ------ | ------ |
| columns | 下拉选项   | `{name: string, value: string}[]` | -      | []      |
| v-model | 已选选项   | `string[]` | -      | []      |

