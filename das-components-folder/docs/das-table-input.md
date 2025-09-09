<ComponentInfo developer="刘广庆" date="2025-08-28" />
# TableInput 表格输入

表格输入组件，支持在表格中进行数据录入和编辑，提供多种输入类型和灵活的配置选项。

## 何时使用

- 需要在表格形式中录入或编辑多行数据时
- 需要对表格数据进行批量操作和验证时
- 需要支持动态添加和删除行的数据录入场景

## 交互演示 {style="color:#ff47a3"}

最简单的用法，支持文本输入和基本的增删操作。

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-table-input
      v-model="basicData"
      :columns="config.columns"
      :min-row="config.minRow"
      :max-row="config.maxRow"
      :index="config.index"
      :error-text="true"
      :readonly="config.readonly"
    />
  </JsonEditor>
</template>

<script setup>
import { ref } from 'vue';
import { basicConfig as initConfig } from 'Comp/table-input/mock/config';

const basicData = ref([
  { name: '张三', age: 18, email: 'zhangsan@example.com' },
  { name: '李四', age: 22, email: 'lisi@example.com' },
  {}
]);
</script>
```
:::

## 基础演示
- 支持条数阈值：`min-row`、`max-row`
- 支持新增默认值：`defaultValue`
- 支持字段说明：`description`
- 支持正则校验：`rules`
:::demo
```vue
<template>
  <das-table-input
    v-model="basicData"
    :columns="columns"
    :error-text="true"
    :min-row="1"
    :max-row="5"
  />
</template>

<script setup>
import { ref } from 'vue';

const basicData = ref([
  { name: '张三', age: 18, email: 'zhangsan@example.com' },
  { name: '李四', age: 22, email: 'lisi@example.com' },
]);

const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      type: 'input',
      description: '用户的真实姓名，用于身份识别',
      placeholder: '请输入姓名',
      key: 'name',
      rules: [
        { required: true, message: '请输入姓名' },
        { min: 2, max: 6, message: '姓名长度在2-20个字符' }
      ]
    },
    {
      title: '年龄',
      dataIndex: 'age',
      defaultValue: '18',
      key: 'age'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      type: 'link',
      key: 'email'
    }
  ]
</script>
```
:::

## 类型演示

支持输入框、选择框、开关、链接、纯文本，并支持组件属性透传。
:::demo
```vue
<template>
  <div>
    <das-table-input
      v-model="typeData"
      :columns="typeColumns"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const typeData = ref([
  {
    text: '文本输入',
    number: 100,
    select: 'option1',
    switch: true,
    link: 'https://example.com',
    display: '纯文本显示'
  }
]);

const typeColumns = [
  {
    title: '文本类型',
    dataIndex: 'text',
    type: 'input',
    placeholder: '请输入文本',
    width: 150
  },
  {
    title: '选择类型',
    dataIndex: 'select',
    type: 'select',
    options: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' }
    ],
    attrs: {
      mode: 'multiple',
    },
    width: 120
  },
  {
    title: '开关类型',
    dataIndex: 'switch',
    type: 'switch',
    width: 100
  },
  {
    title: '链接类型',
    dataIndex: 'link',
    type: 'link',
    width: 120
  },
  {
    title: '纯文本类型',
    dataIndex: 'display',
    type: 'text',
    width: 120
  }
];
</script>
```
:::


## 搭配表单
搭配表单使用，支持表单校验。

:::demo
```vue
<template>
  <div>
    <a-form ref="formRef" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
        <a-input v-model:value="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="表格输入" name="tableInput" :rules="[{ required: true, validator: tableInputRef?.validate }]">
        <das-table-input
          ref="tableInputRef"
          v-model="formData.tableInput"
          :columns="typeColumns"
          :min-row="1"
          :show-index="true"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" @click="handleSubmit">提交</a-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const formData = ref({
  name: '',
  tableInput: [
    {
      text: '文本输入',
      number: 100,
      select: 'option1',
      switch: true,
      link: 'https://example.com',
      display: '纯文本显示'
    },
  ]
});

const typeColumns = [
  {
    title: '文本类型',
    dataIndex: 'text',
    type: 'input',
    placeholder: '请输入文本',
    width: 150,
    rules: [{ required: true, message: '请输入文本' }]
  },
  {
    title: '链接类型',
    dataIndex: 'link',
    type: 'link',
    width: 120
  }
];

const formRef = ref();
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    message.success('校验通过');
  } catch (error) {
    message.error('校验失败');
  }
};

const tableInputRef = ref();
</script>
```
:::



## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 表格数据，支持 v-model | `Array<Record<string, any>>` | `[]` |
| columns | 列配置 | `columns[]` | `[]` |
| readonly | 是否只读模式 | `boolean` | `false` |
| index | 是否显示序号列 | `boolean` | `false` |
| error-text | 是否显示校验错误提示 | `boolean` | `false` |
| min-row | 最小行数，0 表示不限制 | `number` | `1` |
| max-row | 最大行数，0 表示不限制 | `number` | `0` |

### columns（继承：ATableColumn 额外的属性）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 输入类型 | `input \| select \| switch \| link \| text \| number` | `input` |
| defaultValue | 默认值 | `any` | - |
| placeholder | 占位符文本 | `string` | - |
| description | 列描述信息，设置后表头会显示问号图标，鼠标悬停显示tooltip | `string` | - |
| options | 选择器选项（type为select时使用） | `SelectOption[]` | - |
| attrs | 透传组件属性 | `{}` | - |
| rules | 验证规则 | `Rule[]` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 数据更新时触发 | `(value: Array<Record<string, any>>) => void` |
| change | 数据变更时触发 | `(value: Array<Record<string, any>>) => void` |
| add | 添加行时触发 | `(index: number) => void` |
| remove | 删除行时触发 | `(index: number, record: Record<string, any>) => void` |

### Expose

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 手动触发全量校验 | `() => boolean` |
| validateField | 校验单个字段 | `(rowIndex: number, fieldName: string) => boolean` |
| getValidationErrors | 获取所有校验错误 | `() => ValidationError[]` |
| getFieldErrors | 获取字段错误映射 | `() => Record<string, string>` |
| clearValidation | 清除所有校验错误 | `() => void` |
| hasErrors | 检查是否有校验错误 | `() => boolean` |
| getErrorCount | 获取错误数量 | `() => number` |

## 常见问题
### 如何使用必填验证？


**验证规则：**
- 只有`rules`属性设置了 `required: true` 的列才会进行验证
- 必填字段的表头会自动显示红色星号(*)标识
- 验证时机：组件加载时、输入过程中、失焦时、点击"新增一行"按钮时
- 验证范围：所有行的所有必填字段

### 校验提示是如何工作的？

组件采用统一的校验提示方式，提供更好的用户体验：

**校验时机：**
- 组件初始化加载时自动校验
- 用户输入过程中实时校验（延迟100ms避免频繁提示）
- 输入框失焦时立即校验
- 点击"新增一行"按钮时全面校验

**示例效果：**
```
数据校验失败，请检查以下字段：
• 第1行的姓名：姓名不能为空
• 第2行的邮箱地址：邮箱地址不能为空
• 第3行的部门：请选择部门
```