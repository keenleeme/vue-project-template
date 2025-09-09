<ComponentInfo developer="李忠贤" date="2025-03-22" />

# das-search-bar 搜索栏查询组件

## 组件说明

查询组件是用户与系统进行数据检索或过滤操作的核心界面元素。它们允许用户输入条件、调整参数并触发搜索行为，最终帮助用户快速定位所需信息。典型的查询组件包含【输入类组件（如搜索框、过滤器）】、【触发机制（如按查询/重置按钮组、自动触发）】以及【反馈类组件（结果展示区域、条件回显/Applied Filters、实时反馈）】。

## 何时使用

- 管理后台的复杂数据查询界面
- 数据仪表盘中的筛选和过滤功能
- 查询组件实际按用途区分为两个组件，DasSearchBar与DasSearchBarUnion，可单独使用，也可组合使用
- DasSearchBar常用于表格的检索区查询
- DasSearchBarUnion则常用于表格的操作区查询。

## 交互演示  {style="color:#ff47a3"}

通过编辑JSON配置，实时预览组件效果

:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-search-bar
      :model="formState"
      :columns="config.columns"
      :layout="config.layout"
      :label-col="config.labelCol"
      :expandable="config.expandable"
      :show-buttons="config.showButtons"
    >
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status" >
        <a-select v-model:value="formState.status" class="status-select"  mode="multiple" placeholder="请选择" :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="日期" name="date">
        <a-date-picker v-model:value="formState.date" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="序号" name="index">
        <a-input-number v-model:value="formState.index" placeholder="请输入" />
      </a-form-item>
    </das-search-bar>
  </JsonEditor>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';
  import { basicConfig as initConfig } from 'Comp/search-bar/mock/config';
  import { ref } from 'vue';
  const formState = reactive({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
  });

  const statusOptions = [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '待审核', value: 'pending' },
    { label: '已审核', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已下线', value: 'offline' },
    { label: '维护中', value: 'maintenance' },
    { label: '已删除', value: 'deleted' }
  ];
</script>

<style >
  .status-select .ant-select-selector {
      overflow: auto;
      max-height: 32px;
  }
</style>
```

:::

## das-search-bar-01 检索区查询

:::demo

```vue
<template>
  <das-search-bar
    :columns="4"
    :model="formState"
    @search="handleSearch"
   >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions" mode="multiple" :max-tag-count="1" />
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入" ></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

const formState = reactive({
  name: '',
  status: undefined,
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已审核', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' },
  { label: '维护中', value: 'maintenance' },
  { label: '已删除', value: 'deleted' }
];

// 监听 formState 的变化
watch(formState, (newVal) => {
  console.log('formState changed:', newVal);
}, { deep: true });

const handleSearch = (values: Record<string, any>) => {
  console.log('表单值：', values);
  // 处理查询逻辑
};

</script>
```

:::

## das-search-bar-02 操作区查询

查询条件少，<=3个
:::demo

```vue
<template>
  <das-search-bar-union
    :default="{
      model: defaultModel
    }"
    @default:search="handleDefaultSearch"
    @default:reset="handleDefaultReset"
  >
    <template #default>
      <a-form-item name="name">
        <a-input v-model:value="defaultModel.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item name="status">
        <a-input v-model:value="defaultModel.status" placeholder="请输入" />
      </a-form-item>
    </template>
  </das-search-bar-union>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

// 分离操作栏和高级筛选的表单数据
const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已审核', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' },
  { label: '维护中', value: 'maintenance' },
  { label: '已删除', value: 'deleted' }
];

const defaultModel = reactive({
  name: '',
  status: undefined,
});

// 监听表单数据变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

// 处理操作栏事件
const handleDefaultSearch = (values: Record<string, any>) => {
  console.log('操作栏查询：', values);
};

const handleDefaultReset = () => {
  console.log('操作栏重置');
};

</script>
```
:::

查询条件多，配合高级筛选展示更多筛选项
:::demo

```vue
<template>
  <das-search-bar-union
    :default="{
      model: defaultModel
    }"
    :advanced="{
      model: advancedModel,
      columns: 3,
      layout: 'horizontal',
      labelCol: { span: 6 },
    }"
    @default:search="handleDefaultSearch"
    @default:reset="handleDefaultReset"
    @advanced:search="handleAdvancedSearch"
    @advanced:reset="handleAdvancedReset"
  >
    <template #default>
      <a-form-item name="name">
        <a-input v-model:value="defaultModel.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item name="status">
        <a-select v-model:value="defaultModel.status" placeholder="请选择" :options="statusOptions"></a-select>
      </a-form-item>
    </template>
    <template #advanced>
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="advancedModel.name" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="advancedModel.status" placeholder="请选择" :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="日期" name="date">
        <a-date-picker v-model:value="advancedModel.date" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="序号" name="index">
        <a-input-number v-model:value="advancedModel.index" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="advancedModel.address" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="advancedModel.email" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-input v-model:value="advancedModel.role" placeholder="请输入" ></a-input>
      </a-form-item>
    </template>
  </das-search-bar-union>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

// 分离操作栏和高级筛选的表单数据
const defaultModel = reactive({
  name: '',
  status: undefined,
});

const advancedModel = reactive({
  name: '',
  status: undefined,
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

// 监听表单数据变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

watch(advancedModel, (newVal) => {
  console.log('advancedModel changed:', newVal);
}, { deep: true });

// 处理操作栏事件
const handleDefaultSearch = (values: Record<string, any>) => {
  console.log('操作栏查询：', values);
};

const handleDefaultReset = () => {
  console.log('操作栏重置');
};

// 处理高级筛选事件
const handleAdvancedSearch = (values: Record<string, any>) => {
  console.log('高级筛选查询：', values);
};

const handleAdvancedReset = () => {
  console.log('高级筛选重置');
};

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已审核', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' },
  { label: '维护中', value: 'maintenance' },
  { label: '已删除', value: 'deleted' }
];

</script>
```
:::

## das-search-bar-03 多区块查询

:::demo
```vue
<template>
  <div style="border: 1px solid #e9eaf0">
    <div style="border-bottom: 1px solid #e9eaf0">
      <das-search-bar
        :columns="3"
        :model="formState"
        @search="handleSearch"
      >
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
        </a-form-item>
        <a-form-item label="日期" name="date">
          <a-date-picker v-model:value="formState.date" placeholder="请选择" />
        </a-form-item>
        <a-form-item label="序号" name="index">
          <a-input-number v-model:value="formState.index" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="地址" name="address">
          <a-input v-model:value="formState.address" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="角色" name="role">
          <a-input v-model:value="formState.role" placeholder="请输入" ></a-input>
        </a-form-item>
      </das-search-bar>
    </div>
    <das-search-bar-union
      :default="{
        model: defaultModel,
        showButtons: false
      }"
      :advanced="{
        model: advancedModel,
        columns: 3,
        layout: 'horizontal',
        labelCol: { span: 6 },
        expandable: false,
      }"
      @default:search="handleDefaultSearch"
      @default:reset="handleDefaultReset"
      @advanced:search="handleAdvancedSearch"
      @advanced:reset="handleAdvancedReset"
    >
      <template #default>
        <a-form-item name="name">
          <a-input v-model:value="defaultModel.name" placeholder="请输入" />
        </a-form-item>
        <a-form-item name="status">
          <a-input v-model:value="defaultModel.status" placeholder="请输入" />
        </a-form-item>
      </template>
    </das-search-bar-union>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

const formState = reactive({
  name: '',
  status: undefined,
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

const defaultModel = reactive({
  name: '',
  status: undefined,
});

const advancedModel = reactive({
  date: undefined,
  index: undefined,
});

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已审核', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' },
  { label: '维护中', value: 'maintenance' },
  { label: '已删除', value: 'deleted' }
];

// 监听 formState 的变化
watch(formState, (newVal) => {
  console.log('formState changed:', newVal);
}, { deep: true });

// 监听 defaultModel 的变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

const handleSearch = (values: Record<string, any>) => {
  console.log('表单值：', values);
  // 处理查询逻辑
};

const handleDefaultSearch = (values: Record<string, any>) => {
  // Implementation of handleDefaultSearch
  console.log('操作栏表单值：', values);
};

const handleDefaultReset = () => {
  // Implementation of handleDefaultReset
};

const handleAdvancedSearch = (values: Record<string, any>) => {
  // Implementation of handleAdvancedSearch
  console.log('高级筛选表单值：', values);
};

const handleAdvancedReset = () => {
  // Implementation of handleAdvancedReset
};

</script>

```

:::

## das-search-bar-04 浮窗形式的高级筛选

:::demo

```vue
<template>
  <das-search-bar-union
    :default="{
      model: defaultModel
    }"
    :advanced="{
      model: advancedModel,
      columns: 3,
      layout: 'horizontal',
      labelCol: { span: 6 },
      isPopOver: true,
      expandable: false
    }"
    @default:search="handleDefaultSearch"
    @default:reset="handleDefaultReset"
    @advanced:search="handleAdvancedSearch"
    @advanced:reset="handleAdvancedReset"
  >
    <template #btns-left>
      <a-button type="primary">新增</a-button>
    </template>
    <template #default>
      <a-form-item name="name">
        <a-input v-model:value="defaultModel.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item name="status">
        <a-input v-model:value="defaultModel.status" placeholder="请输入" />
      </a-form-item>
    </template>
    <template #advanced>
      <a-form-item label="日期" name="date">
        <a-date-picker v-model:value="advancedModel.date" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="序号" name="index">
        <a-input-number v-model:value="advancedModel.index" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="advancedModel.address" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="advancedModel.email" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-input v-model:value="advancedModel.role" placeholder="请输入" ></a-input>
      </a-form-item>
    </template>
    <template #btns-right>
      <a-button><setting-outlined /></a-button>
    </template>
  </das-search-bar-union>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';
import { SettingOutlined } from '@ant-design/icons-vue';

// 分离操作栏和高级筛选的表单数据
const defaultModel = reactive({
  name: '',
  status: undefined,
});

const advancedModel = reactive({
  name: '',
  status: undefined,
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

// 监听表单数据变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

watch(advancedModel, (newVal) => {
  console.log('advancedModel changed:', newVal);
}, { deep: true });

// 处理操作栏事件
const handleDefaultSearch = (values: Record<string, any>) => {
  console.log('操作栏查询：', values);
};

const handleDefaultReset = () => {
  console.log('操作栏重置');
};

// 处理高级筛选事件
const handleAdvancedSearch = (values: Record<string, any>) => {
  console.log('高级筛选查询：', values);
};

const handleAdvancedReset = () => {
  console.log('高级筛选重置');
};

</script>
<style>
  .demo-SearchBar .demoblock-view {
    overflow: unset !important;
  }
</style>
```

:::

## das-search-bar-05 上下结构（国际化布局）

:::demo

```vue
<template>
  <das-search-bar
    :columns="3"
    :model="formState"
    layout="vertical"
    @search="handleSearch"
   >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入" ></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';
const formState = reactive({
  name: '',
  status: undefined,
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已审核', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下线', value: 'offline' },
  { label: '维护中', value: 'maintenance' },
  { label: '已删除', value: 'deleted' }
];

const handleSearch = (values: Record<string, any>) => {
  console.log('表单值：', values);
  // 处理查询逻辑
};
</script>
```
:::

## das-search-bar-06 过滤条件回显

检索区查询的条件回显

:::demo

```vue
<template>
  <das-search-bar
    :columns="3"
    :model="formState"
    :filtered="filtered"
    @filter-remove="handleFilterRemove"
    @search="handleSearch"
   >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入" ></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入" ></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

  const formState = reactive({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
    address: '',
    email: '',
    role: '',
  });

  const filtered = reactive([
    { 
      name: 'name1',
      label: '姓名',
      text: '张三'
    },
    {
      name: 'status2',
      label: '状态',
      text: '正常'
    },
    {
      name: 'date3',
      label: '日期',
      text: '2025-03-10 ~ 2025-03-28'
    },
    { 
      name: 'name4',
      label: '姓名',
      text: '张三'
    },
    {
      name: 'status5',
      label: '状态',
      text: '正常'
    },
    { 
      name: 'name6',
      label: '姓名',
      text: '张三'
    },
    {
      name: 'status7',
      label: '状态',
      text: '正常'
    },
    {
      name: 'status8',
      label: '状态',
      text: '正常'
    },
    {
      name: 'status9',
      label: '状态',
      text: '正常'
    },
    {
      name: 'date10',
      label: '日期',
      text: '2025-03-10 ~ 2025-03-28'
    },
  ]);

  const handleSearch = (values: Record<string, any>) => {
    console.log('表单值：', values);
    // 处理查询逻辑
  };
  const statusOptions = [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '待审核', value: 'pending' },
    { label: '已审核', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已下线', value: 'offline' },
    { label: '维护中', value: 'maintenance' },
    { label: '已删除', value: 'deleted' }
  ];

  const handleFilterRemove = (filter: any) => {
    filtered.splice(0, filtered.length, ...filtered.filter(t => t.name !== filter.name));
  };
</script>
```
:::

操作区查询的过滤回显

:::demo
```vue
<template>
  <das-search-bar-union
    :default="{
      model: defaultModel
    }"
    :advanced="{
      model: advancedModel,
      columns: 3,
      layout: 'horizontal',
      labelCol: { span: 6 },
      expandable: false,
    }"
    :filtered="filtered"
    @filter-remove="handleFilterRemove"
    @default:search="handleDefaultSearch"
    @default:reset="handleDefaultReset"
    @advanced:search="handleAdvancedSearch"
    @advanced:reset="handleAdvancedReset"
  >
    <template #default>
      <a-form-item name="name">
        <a-input v-model:value="defaultModel.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item name="status">
        <a-input v-model:value="defaultModel.status" placeholder="请输入" />
      </a-form-item>
    </template>
    <template #advanced>
      <a-form-item label="日期" name="date">
        <a-date-picker v-model:value="advancedModel.date" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="序号" name="index">
        <a-input-number v-model:value="advancedModel.index" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="advancedModel.address" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="advancedModel.email" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-input v-model:value="advancedModel.role" placeholder="请输入" ></a-input>
      </a-form-item>
    </template>
  </das-search-bar-union>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

const defaultModel = reactive({
  name: '',
  status: undefined,
});

const advancedModel = reactive({
  date: undefined,
  index: undefined,
  address: '',
  email: '',
  role: '',
});

const filtered = reactive([
  { 
    name: 'name1',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status2',
    label: '状态',
    text: '正常'
  },
  {
    name: 'date3',
    label: '日期',
    text: '2025-03-10 ~ 2025-03-28'
  },
  { 
    name: 'name4',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status5',
    label: '状态',
    text: '正常'
  },
  { 
    name: 'name6',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status7',
    label: '状态',
    text: '正常'
  },
  {
    name: 'status8',
    label: '状态',
    text: '正常'
  },
  {
    name: 'status9',
    label: '状态',
    text: '正常'
  },
  {
    name: 'date10',
    label: '日期',
    text: '2025-03-10 ~ 2025-03-28'
  },
]);

// 监听 defaultModel 的变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

const handleDefaultSearch = (values: Record<string, any>) => {
  // Implementation of handleDefaultSearch
  console.log('操作栏表单值：', values);
};

const handleDefaultReset = () => {
  // Implementation of handleDefaultReset
};

const handleAdvancedSearch = (values: Record<string, any>) => {
  // Implementation of handleAdvancedSearch
  console.log('高级筛选表单值：', values);
};

const handleAdvancedReset = () => {
  // Implementation of handleAdvancedReset
};

const handleFilterRemove = (filter: any) => {
  filtered.splice(0, filtered.length, ...filtered.filter(t => t.name !== filter.name));
};

</script>
```
:::

多区块查询的过滤回显

:::demo

```vue
<template>
  <div style="border: 1px solid #e9eaf0">
    <div style="border-bottom: 1px solid #e9eaf0; padding: 0 16px">
      <das-search-bar
      :columns="3"
      :label-col="{ span: 8 }"
      :model="formState"
      :filtered="filtered"
      @filter-remove="handleFilterRemove"
      @search="handleSearch"
    >
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
      </a-form-item>
      <a-form-item label="日期" name="date">
        <a-date-picker v-model:value="formState.date" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="序号" name="index">
        <a-input-number v-model:value="formState.index" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="formState.address" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email" placeholder="请输入" ></a-input>
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-input v-model:value="formState.role" placeholder="请输入" ></a-input>
      </a-form-item>
    </das-search-bar>
    </div>
    <div style="padding: 0 16px">
      <das-search-bar-union
        :default="{
          model: defaultModel
        }"
      >
        <template #default>
          <a-form-item name="name">
            <a-input v-model:value="defaultModel.name" placeholder="请输入" />
          </a-form-item>
          <a-form-item name="status">
            <a-input v-model:value="defaultModel.status" placeholder="请输入" />
          </a-form-item>
        </template>
      </das-search-bar-union>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FormItem as AFormItem, Input as AInput, Select as ASelect, DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue';

const formState = reactive({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
    address: '',
    email: '',
    role: '',
  });

const defaultModel = reactive({
  name: '',
  status: undefined,
});

const filtered = reactive([
  { 
    name: 'name1',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status2',
    label: '状态',
    text: '正常'
  },
  {
    name: 'date3',
    label: '日期',
    text: '2025-03-10 ~ 2025-03-28'
  },
  { 
    name: 'name4',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status5',
    label: '状态',
    text: '正常'
  },
  { 
    name: 'name6',
    label: '姓名',
    text: '张三'
  },
  {
    name: 'status7',
    label: '状态',
    text: '正常'
  },
  {
    name: 'status8',
    label: '状态',
    text: '正常'
  },
  {
    name: 'status9',
    label: '状态',
    text: '正常'
  },
  {
    name: 'date10',
    label: '日期',
    text: '2025-03-10 ~ 2025-03-28'
  }]
)

// 监听 formState 的变化
watch(formState, (newVal) => {
  console.log('formState changed:', newVal);
}, { deep: true });

// 监听 defaultModel 的变化
watch(defaultModel, (newVal) => {
  console.log('defaultModel changed:', newVal);
}, { deep: true });

const handleSearch = (values: Record<string, any>) => {
  console.log('表单值：', values);
  // 处理查询逻辑
};

const handleDefaultSearch = (values: Record<string, any>) => {
  // Implementation of handleDefaultSearch
  console.log('操作栏表单值：', values);
};

const handleDefaultReset = () => {
  // Implementation of handleDefaultReset
};

const handleFilterRemove = (filter: any) => {
  filtered.splice(0, filtered.length, ...filtered.filter(t => t.name !== filter.name));
};

</script>
  
```
:::

## das-search-bar-07 查询模版

功能扩展：查询模版，将高频使用的历史查询固化为模板，方便团队共享或下次使用

:::demo

```vue
<template>
  <das-search-bar
    :model="formState"
    :enable-template="true"
    :templates="templates"
    @template-add="handleTemplateAdd"
    @template-edit="handleTemplateEdit"
    @template-delete="handleTemplateDelete"
    @template-select="handleTemplateSelect"
  >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入"></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
  import { reactive, watch, ref } from 'vue';
  import {
    FormItem as AFormItem,
    Input as AInput,
    Select as ASelect,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber
  } from 'ant-design-vue';
  const formState = ref({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
    address: '',
    email: '',
    role: ''
  });
  const statusOptions = [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '待审核', value: 'pending' },
    { label: '已审核', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已下线', value: 'offline' },
    { label: '维护中', value: 'maintenance' },
    { label: '已删除', value: 'deleted' }
  ];

  const templates = reactive([
    { id: 1, name: '模板1' },
    { id: 2, name: '模板2' },
    { id: 3, name: '模板3' }
  ]);
  const handleTemplateAdd = (values: Record<string, any>) => {
    console.log('保存模版', values);
  };
  const handleTemplateEdit = (values: Record<string, any>) => {
    console.log('编辑模版', values);
  };
  const handleTemplateDelete = (id: string | number) => {
    console.log('删除模版', id);
  }
  const handleTemplateSelect = (id: string | number) => {
    console.log('选择模板', id);
    formState.value = {
      name: '张三',
      status: undefined,
      date: undefined,
      index: undefined,
      address: '',
      email: '',
      role: ''
    };
  };
</script>
```
:::

## das-search-bar-08 自定义查询项

功能扩展：自定义查询项，临时设计新查询逻辑，探索数据需求， 可配置禁止编辑的字段

:::demo

```vue
<template>
  <das-search-bar
    :model="formState"
    :columns="3"
    :enable-search-bar-custom="true"
    :custom-disabled-keys="['name', 'status']"
  >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="statusOptions"></a-select>
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入"></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import {
    FormItem as AFormItem,
    Input as AInput,
    Select as ASelect,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber
  } from 'ant-design-vue';
  const formState = reactive({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
    address: '',
    email: '',
    role: ''
  });

  const statusOptions = [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '待审核', value: 'pending' },
    { label: '已审核', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已下线', value: 'offline' },
    { label: '维护中', value: 'maintenance' },
    { label: '已删除', value: 'deleted' }
  ];
</script>
```
:::

## das-search-bar-09 历史查询

功能扩展：历史查询，复用之前的查询，直接从历史记录中调取，无需重新输入条件

:::demo

```vue
<template>
  <das-search-bar
    :model="formState"
    :columns="3"
    :enable-history="true"
    :histories="histories"
    @history-select="handleHistorySelect"
  >
    <a-form-item label="姓名" name="name">
      <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="状态" name="status">
      <a-select v-model:value="formState.status" placeholder="请选择" :options="[]"></a-select>
    </a-form-item>
    <a-form-item label="日期" name="date">
      <a-date-picker v-model:value="formState.date" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="序号" name="index">
      <a-input-number v-model:value="formState.index" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="地址" name="address">
      <a-input v-model:value="formState.address" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="邮箱" name="email">
      <a-input v-model:value="formState.email" placeholder="请输入"></a-input>
    </a-form-item>
    <a-form-item label="角色" name="role">
      <a-input v-model:value="formState.role" placeholder="请输入"></a-input>
    </a-form-item>
  </das-search-bar>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import {
    FormItem as AFormItem,
    Input as AInput,
    Select as ASelect,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber
  } from 'ant-design-vue';
  const formState = ref({
    name: '',
    status: undefined,
    date: undefined,
    index: undefined,
    address: '',
    email: '',
    role: ''
  });
  const statusOptions = [
    { label: '正常', value: 'normal' },
    { label: '禁用', value: 'disabled' },
    { label: '待审核', value: 'pending' },
    { label: '已审核', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
    { label: '草稿', value: 'draft' },
    { label: '已发布', value: 'published' },
    { label: '已下线', value: 'offline' },
    { label: '维护中', value: 'maintenance' },
    { label: '已删除', value: 'deleted' }
  ];

  const histories = reactive([
    { id: 1, name: '历史1' },
    { id: 2, name: '历史2' },
    { id: 3, name: '历史3' }
  ]);
  const handleHistoryClear = () => {
    console.log('清空历史');
  };
  const handleHistorySelect = (id: string | number) => {
    console.log('选择历史', id);
    formState.value = {
      name: '张三',
      status: undefined,
      date: undefined,
      index: undefined,
      address: '',
      email: '',
      role: ''
    };
  };
</script>
```
:::



## API

### das-search-bar

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| columns | 列数 | `number` | 4 | - |
| model | 表单数据 | `Record<string, any>` | {} | - |
| layout | 布局 | `'horizontal' \| 'vertical'` | horizontal | - |
| labelCol | 标签布局 |  `{span: number}` | `{ span: 6 }` | - |
| expandable | 是否开启展开收起功能 | `boolean` | true | - |
| showButtons | 是否显示表单查询按钮组 | `boolean` | true | - |
| filtered | 当前查询 | `SearchBarFilterType[]` | [] | - |
| enableTemplate | 是否开启查询模版功能 | `boolean` | false | - |
| templates | 查询模版 | `SearchBarTemplateType[]` | [] | - |
| enableSearchBarCustom | 是否开启自定义查询项功能 | `boolean` | false | - |
| customDisabledKeys | 自定义查询禁止编辑的字段 | `string[]` | [] | - |
| enableHistory | 是否开启历史查询功能 | `boolean` | false | - |
| histories | 历史查询列表 | `SearchBarHistoryType[]` | [] | - |


### das-search-bar-union

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| default | 默认查询表单配置 | `DefaultFormConfig` | {} | - |
| advanced | 高级查询表单配置 | `AdvancedFormConfig` | {} | - |
| filtered | 当前查询 | `SearchBarFilterType[]` | [] | - |

### das-search-bar-union插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 默认查询表单内容 |
| advanced | 高级查询表单内容 |
| btns-left | 操作栏左侧按钮区内容 |
| btns-right | 操作栏右侧按钮区内容 |

### DefaultFormConfig

das-search-bar-union默认查询表单配置

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| model | 表单数据 | `Record<string, any>` | {} | - |
| showButtons | 是否显示表单查询按钮组 | `boolean` | true | - |

### AdvancedFormConfig

das-search-bar-union高级查询表单配置

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| model | 表单数据 | `Record<string, any>` | {} | - |
| columns | 列数 | `number` | 4 | - |
| layout | 布局 | `'horizontal' \| 'vertical'` | horizontal | - |
| labelCol | 标签布局 | `{span: number}` | `{ span: 6 }` | - |
| expandable | 是否开启展开收起功能 | `boolean` | true | - |
| showButtons | 是否显示表单查询按钮组 | `boolean` | true | - |
| isPopOver | 是否是浮窗形式的高级筛选 | `boolean` | false | - |
| enableTemplate | 是否开启查询模版功能 | `boolean` | false | - |
| templates | 查询模版 | `SearchBarTemplateType[]` | [] | - |
| enableSearchBarCustom | 是否开启自定义查询项功能 | `boolean` | false | - |
| customDisabledKeys | 自定义查询禁止编辑的字段 | `string[]` | [] | - |
| customDisabledKeys | 自定义查询禁止编辑的字段 | `string[]` | [] | - |
| enableHistory | 是否开启历史查询功能 | `boolean` | false | - |
| histories | 历史查询列表 | `SearchBarHistoryType[]` | [] | - |

### SearchBarTemplateType

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| id | key | `number \| string` | _ | 是 |
| name | 模版名称 | `string` | _ | 是 |

### SearchBarHistoryType

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| id | key | `number \| string` | _ | 是 |
| name | 历史查询名称 | `string` | _ | 是 |

### SearchBarFilterType

当前查询项

| 属性名 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | :---: |
| name | 标签名称 | `string` | - | - |
| label | 标签文本 | `string` | - | - |

## das-search-bar事件

| 事件名称              | 说明                 | 回调参数                                     |
| --------------------- | -------------------- | -------------------------------------------- |
| search                | 表单查询事件         | `function(values)` |
| reset                 | 表单重置事件         | `function(values)` |
| filter-remove         | 移除当前查询项事件       | `function(filter)` |
| template-add          | 新增模版事件         | `function(values)` |
| template-edit         | 编辑模版事件         | `function(values)` |
| template-delete       | 删除模版事件         | `function(id)` |
| template-select       | 选择模版事件         | `function(id)` |
| history-clear         | 清空历史查询事件       | `function()` |
| history-select        | 选择历史查询事件       | `function(id)` |

## das-search-bar-union事件

| 事件名称              | 说明                 | 回调参数                                     |
| --------------------- | -------------------- | -------------------------------------------- |
| default-search        | 查询表单查询事件 | `function(values)` |
| default-reset         | 查询表单重置事件 | `function(values)` |
| advanced-search       | 高级查询表单查询事件 | `function(values)` |
| advanced-reset        | 高级查询表单重置事件 | `function(values)` |
| filter-remove         | 移除当前查询项事件       | `function(filter)` |
| template-add          | 新增模版事件         | `function(values)` |
| template-edit         | 编辑模版事件         | `function(values)` |
| template-delete       | 删除模版事件         | `function(id)` |
| template-select       | 选择模版事件         | `function(id)` |
| history-clear         | 清空历史查询事件       | `function()` |
| history-select        | 选择历史查询事件       | `function(id)` |

## 注意事项

由于该查询组件的扩展功能支持开启查询模版、自定义查询项，所以查询表单的按钮组宽度不定，会根据开启的功能而显示相应的按钮。通过组件props自定义配置的列宽`columns`，在表单收起状态时，如果按钮组的宽度大于了表单的列宽，组件内部会自动调整一行显示的表单控件数量，以保证按钮组能够正常显示；在表单展开状态时，按钮组会新起一行显示。
