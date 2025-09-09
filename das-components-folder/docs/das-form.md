<ComponentInfo developer="施明财" date="2025-03-22" />

# das-form 表单
## 组件说明
DasForm 是一个基于 Ant Design Vue 的表单组件，在原有基础上扩展了更灵活的布局方式。主要特点：

- 支持水平布局、垂直布局、行内布局、行内垂直布局
- 支持自定义 label 宽度
- 支持表单项自动换行和列数设置
- 支持表单分组和导航锚点
- 支持批量新增表单项（卡片/表格模式）
- 支持表单项互斥显示（单选/下拉/开关）
- 支持表单项 Extra 说明（普通/带背景）
- 支持表单项 Tooltip 提示
- 支持表单项标签左右对齐
- 继承了 Ant Design Form 的所有特性

## 何时使用

- 需要收集用户输入信息时
- 需要对输入的数据进行校验时
- 需要灵活控制表单布局，特别是行内布局时
- 需要对表单进行分组管理时
- 需要批量添加表单项时

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-form
      ref="formRef"
      :model="config.model"
      :label-col="config.labelCol"
      :wrapper-col="config.wrapperCol"
      :layout="config.layout"
      :inline-label-width="config.inlineLabelWidth"
      :inline-columns="config.inlineColumns"
      :rules="config.rules"
      @finish="onFinish"
    >
      <das-form-item label="名称" name="demo_name" required>
        <a-input v-model:value="config.model.demo_name" placeholder="请输入内容" />
      </das-form-item>

      <das-form-item label="等级" name="demo_level">
        <a-radio-group v-model:value="config.model.demo_level">
          <a-radio value="high">高风险</a-radio>
          <a-radio value="medium">中风险</a-radio>
          <a-radio value="low">低风险</a-radio>
        </a-radio-group>
      </das-form-item>

      <das-form-item label="备注" name="demo_remark">
        <a-textarea v-model:value="config.model.demo_remark" :rows="4" placeholder="请输入备注" />
      </das-form-item>

      <das-form-item
        v-if="config.layout === 'horizontal' || config.layout === 'vertical'"
        :wrapper-col="config.layout === 'horizontal' ? { span: 14 } : null"
        :colon="false"
      >
        <a-space>
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handleReset">取消</a-button>
        </a-space>
      </das-form-item>
      <div v-else style="text-align: right;width: 100%;margin-right: 12px;">
        <a-space>
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handleReset">取消</a-button>
        </a-space>
      </div>
    </das-form>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/form/mock/config';
import { ref } from 'vue';

const formRef = ref();

const onFinish = (values: any) => {
  console.log('提交数据:', values);
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-01 基础用法

最基础的表单包含各种表单项，比如输入框、选择器、单选框等。

:::demo
```vue
<template>
  <das-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    @finish="onFinish"
  >
    <das-form-item label="名称" name="basic_name" required>
      <a-input v-model:value="formState.basic_name" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="等级" name="basic_level">
      <a-radio-group v-model:value="formState.basic_level">
        <a-radio value="high">高风险</a-radio>
        <a-radio value="medium">中风险</a-radio>
        <a-radio value="low">低风险</a-radio>
      </a-radio-group>
    </das-form-item>

    <das-form-item label="备注" name="basic_remark">
      <a-textarea v-model:value="formState.basic_remark" :rows="4" placeholder="请输入备注" />
    </das-form-item>

    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
  </das-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormState } from '../interface';

const formRef = ref();

const formState = reactive<FormState>({
  basic_name: '',
  basic_level: 'medium',
  basic_remark: ''
});

const rules = {
  basic_name: [{ required: true, message: '请输入名称' }],
  basic_level: [{ required: true, message: '请选择等级' }]
};

const onFinish = (values: FormState) => {
  console.log('提交数据:', values);
};

const handleReset = () => {
  formRef.value?.resetFields();
};
</script>
```
:::

## das-form-02 Extra 说明

表单项的 Extra 说明文字支持普通文本和带背景样式两种模式。

:::demo
```vue
<template>
  <das-form ref="formRef" :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
    <!-- 普通文本模式 -->
    <das-form-item 
      label="普通说明" 
      name="extra_field1"
      extra="这是一段普通的说明文字"
    >
      <a-input v-model:value="formState.extra_field1" placeholder="请输入内容" />
    </das-form-item>

    <!-- 带背景模式 -->
    <das-form-item 
      label="带背景说明" 
      name="extra_field2"
      extra="这是一段带背景的说明文字，可以更好地突出显示重要信息" 
      :extra-bordered="true"
    >
      <a-input v-model:value="formState.extra_field2" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
  </das-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();

const formState = reactive({
  extra_field1: '',
  extra_field2: ''
});

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-03 Tooltip 提示

表单项标签支持添加 tooltip 提示信息。

:::demo
```vue
<template>
  <das-form ref="formRef" :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
    <!-- 字符串提示 -->
    <das-form-item 
      label="基础提示" 
      name="tooltip_field1"
      tooltip="这是一个基础的提示信息"
    >
      <a-input v-model:value="formState.tooltip_field1" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
  </das-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();

const formState = reactive({
  tooltip_field1: '',
});

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-04 表单布局

DasForm 支持四种布局方式：

- horizontal: 水平布局（默认）
  - 标签在左，控件在右，适合表单项较多且需要整齐排列的场景
  - 适合详细的数据录入、编辑表单
  - 建议用于表单项标签长度相近的情况

- vertical: 垂直布局
  - 标签在上，控件在下，适合移动端或窄屏场景
  - 适合表单项标签长度差异较大的情况
  - 当需要节省水平空间时使用

- inline: 行内布局
  - 表单项水平排列，适合简单的查询表单
  - 适合表单项较少（一般不超过 6 个）的场景
  - 常用于数据列表页的搜索条件区域
  - 支持通过 col 属性设置表单项占据的列数

- inline-vertical: 行内垂直布局
  - 结合了行内布局和垂直布局的特点
  - 适合需要紧凑展示但标签较长的场景
  - 适合查询表单中有较多选项的情况
  - 同样支持 col 属性控制表单项宽度
  - 可以让某些表单项占据更多列以展示更多内容

> 建议：
> - 同一个系统中保持布局风格的一致性
> - 查询表单优先使用行内布局
> - 新增/编辑表单优先使用水平布局
> - 移动端表单优先使用垂直布局

:::demo
```vue
<template>
  <a-radio-group v-model:value="formLayout" style="margin-bottom: 24px">
    <a-radio-button value="horizontal">水平布局</a-radio-button>
    <a-radio-button value="vertical">垂直布局</a-radio-button>
    <a-radio-button value="inline">行内布局</a-radio-button>
    <a-radio-button value="inline-vertical">行内垂直布局</a-radio-button>
  </a-radio-group>

  <das-form
    ref="formRef"
    :model="formState"
    :layout="formLayout"
    :label-col="formLayout === 'horizontal' ? { span: 4 } : null"
    :wrapper-col="formLayout === 'horizontal' ? { span: 14 } : null"
    :inline-label-width="'100px'"
    :inline-columns="3"
    @finish="onFinish"
  >
    <das-form-item label="字段 A" name="layout_fieldA">
      <a-input v-model:value="formState.layout_fieldA" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="字段 B" name="layout_fieldB">
      <a-input v-model:value="formState.layout_fieldB" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="字段 C" name="layout_fieldC">
      <a-input v-model:value="formState.layout_fieldC" placeholder="请输入内容" />
    </das-form-item>

    <!-- 占两列的表单项 -->
    <das-form-item 
      label="占两列的字段" 
      name="layout_fieldD" 
      :col="2"
    >
      <a-input v-model:value="formState.layout_fieldD" placeholder="行内布局时这个字段会占用两列宽度" />
    </das-form-item>

    <das-form-item label="字段 E" name="layout_fieldE">
      <a-input v-model:value="formState.layout_fieldE" placeholder="请输入内容" />
    </das-form-item>
    
    <!-- 占三列的表单项 -->
    <das-form-item 
      label="占满整行的字段" 
      name="layout_fieldF" 
      :col="3"
    >
      <a-textarea v-model:value="formState.layout_fieldF" :rows="3" placeholder="行内布局时这个字段会占满整行宽度" />
    </das-form-item>

    <das-form-item
      v-if="formLayout === 'horizontal' || formLayout === 'vertical'"
      :wrapper-col="formLayout === 'horizontal' ? { span: 14 } : null"
      :colon="false"
    >
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
    <div v-else style="text-align: right;width: 100%;margin-right: 12px;">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </div>
  </das-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formRef = ref();

const formLayout = ref('horizontal');

const formState = reactive({
  layout_fieldA: '',
  layout_fieldB: '',
  layout_fieldC: '',
  layout_fieldD: '',
  layout_fieldE: '',
  layout_fieldF: ''
});

const onFinish = (values: any) => {
  console.log('提交数据:', values);
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-05 标签对齐方式

标签支持左对齐和右对齐两种方式，必填符号会根据对齐方式自动调整位置。

> 说明：
> - 右对齐（默认）：必填符号显示在标签文字左侧
> - 左对齐：必填符号显示在标签文字右侧
> - 建议在标签文字长度不一致时使用右对齐，这样可以保持表单项的视觉对齐

:::demo
```vue
<template>
  <a-radio-group v-model:value="labelAlign" style="margin-bottom: 24px">
    <a-radio-button value="left">左对齐</a-radio-button>
    <a-radio-button value="right">右对齐</a-radio-button>
  </a-radio-group>

  <das-form
    ref="formRef"
    :model="formState"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    :label-align="labelAlign"
  >
    <das-form-item label="普通字段" name="label_align_field1">
      <a-input v-model:value="formState.label_align_field1" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="必填字段" name="label_align_field2" required>
      <a-input v-model:value="formState.label_align_field2" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="带验证字段" name="label_align_field3" :rules="[{ required: true, message: '请输入内容' }]">
      <a-input v-model:value="formState.label_align_field3" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item label="较长的标签文字" name="label_align_field4" required>
      <a-input v-model:value="formState.label_align_field4" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
  </das-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const formRef = ref();

const labelAlign = ref('right');

const formState = reactive({
  label_align_field1: '',
  label_align_field2: '',
  label_align_field3: '',
  label_align_field4: ''
});

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-06 表单分组

使用 das-form-group 组件对表单项进行分组，支持卡片式和普通分组两种模式。

分组支持以下功能：
- 卡片式：使用卡片样式展示分组内容，适合需要明显分隔的场景
- 可折叠：支持展开/收起分组内容，适合内容较多时节省空间
- 描述信息：支持文本和 tooltip 两种描述信息展示方式

> 建议：
> - 当表单项较多时，建议使用分组来组织表单结构
> - 对于可选的高级配置，建议使用可折叠分组并默认收起
> - 当分组描述较长时，建议使用 tooltip 模式展示

:::demo
```vue
<template>
  <das-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }" @finish="onFinish">
    <!-- 卡片式分组 -->
    <das-form-group
      id="basic"
      title="基本信息"
      description="这里是基本信息的说明"
      :card="true"
      description-mode="tooltip"
    >
      <template #title>
        <SolutionOutlined style="margin-right: 4px" />
        基本信息
      </template>
      <das-form-item label="名称" name="groupName" required>
        <a-input v-model:value="formState.groupName" placeholder="请输入内容" />
      </das-form-item>
      
      <das-form-item label="等级" name="groupLevel">
        <a-radio-group v-model:value="formState.groupLevel">
          <a-radio value="high">高风险</a-radio>
          <a-radio value="medium">中风险</a-radio>
          <a-radio value="low">低风险</a-radio>
        </a-radio-group>
      </das-form-item>
    </das-form-group>

    <!-- 可折叠分组 -->
    <das-form-group
      id="advanced"
      title="高级配置"
      description="这里是高级配置的说明"
      :collapsible="true"
      :default-expanded="false"
    >
      <template #title>
        <SettingOutlined style="margin-right: 4px" />
        高级配置
      </template>
      <das-form-item label="动作" name="groupAction">
        <a-radio-group v-model:value="formState.groupAction">
          <a-radio value="allow">允许访问</a-radio>
          <a-radio value="deny">命令阻断</a-radio>
        </a-radio-group>
      </das-form-item>
      
      <das-form-item label="优先级" name="groupPriority">
        <a-input-number v-model:value="formState.groupPriority" :min="1" :max="100" placeholder="请输入优先级" />
      </das-form-item>
      
      <das-form-item label="通知方式" name="groupNotifyType">
        <a-checkbox-group v-model:value="formState.groupNotifyType">
          <a-checkbox value="email">邮件</a-checkbox>
          <a-checkbox value="sms">短信</a-checkbox>
          <a-checkbox value="wecom">企业微信</a-checkbox>
        </a-checkbox-group>
      </das-form-item>
    </das-form-group>
  
    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>
  </das-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { SettingOutlined, SolutionOutlined } from '@ant-design/icons-vue';

const formRef = ref();

const formState = reactive<{
  groupName: string;
  groupLevel: string;
  groupAction: string;
  groupPriority: number;
  groupNotifyType: string[];
}>({
  groupName: '',
  groupLevel: 'medium',
  groupAction: 'deny',
  groupPriority: 50,
  groupNotifyType: []
});

const rules = {
  groupName: [{ required: true, message: '请输入名称' }]
};

const onFinish = (values: any) => {
  // 转换成普通对象
  const plainData = {
    ...values,
    groupNotifyType: Array.from(values.groupNotifyType || [])
  };
  console.log('提交数据:', plainData);
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-07 导航锚点

表单支持导航锚点功能，可以快速定位到指定的表单分组。支持两种使用方式：

- 自动识别：不配置 anchors 时，会自动根据表单分组的 id 和 title 生成导航锚点
- 手动配置：通过 anchors 属性自定义导航锚点的内容和顺序

> 注意：
> - 导航锚点功能需要父级容器具有滚动条才能正常使用
> - 可以通过设置父容器 `overflow: auto` 或 `overflow: scroll` 来启用滚动
> - 建议同时设置父容器的固定高度，如：`height: 400px`

> 建议：
> - 当表单分组较多时，建议开启导航锚点功能
> - 如果需要自定义锚点顺序或内容，可以使用手动配置方式
> - 自动识别模式下，确保每个分组都设置了唯一的 id

:::demo
```vue
<template>
  <div style="height: 400px; overflow: hidden;">
    <das-form
      ref="formRef"
      :model="formState"
      :show-anchor="true"
      :anchors="[
        { id: 'anchor-basic', title: '基本信息' },
        { id: 'anchor-advanced', title: '高级配置' },
        { id: 'anchor-extend', title: '扩展信息' }
      ]"
      anchor-position="right"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
      @finish="onFinish"
    >
      <das-form-group id="anchor-basic" title="基本信息">
        <das-form-item label="名称" name="anchor_basic_name">
          <a-input v-model:value="formState.anchor_basic_name" />
        </das-form-item>
        <das-form-item label="标签" name="anchor_basic_tags">
          <a-select v-model:value="formState.anchor_basic_tags" mode="multiple" placeholder="请选择标签" style="width: 100%">
            <a-select-option value="important">重要</a-select-option>
            <a-select-option value="urgent">紧急</a-select-option>
            <a-select-option value="normal">普通</a-select-option>
          </a-select>
        </das-form-item>
        <das-form-item label="生效时间" name="anchor_basic_effectiveTime">
          <a-range-picker v-model:value="formState.anchor_basic_effectiveTime" show-time />
        </das-form-item>
        <das-form-item label="基础适用场景" name="anchor_basic_scenario">
          <a-select v-model:value="formState.anchor_basic_scenario" placeholder="请选择场景" style="width: 100%">
            <a-select-option value="1">场景一</a-select-option>
            <a-select-option value="2">场景二</a-select-option>
          </a-select>
        </das-form-item>
        <das-form-item label="描述" name="anchor_basic_description">
          <a-textarea v-model:value="formState.anchor_basic_description" :rows="3" placeholder="请输入描述信息" />
        </das-form-item>
      </das-form-group>
      <das-form-group id="anchor-advanced" title="高级配置">
        <das-form-item label="等级" name="anchor_advanced_level">
          <a-radio-group v-model:value="formState.anchor_advanced_level">
            <a-radio value="high">高</a-radio>
            <a-radio value="medium">中</a-radio>
            <a-radio value="low">低</a-radio>
          </a-radio-group>
        </das-form-item>
        <das-form-item label="动作" name="anchor_advanced_action">
          <a-radio-group v-model:value="formState.anchor_advanced_action">
            <a-radio value="allow">允许访问</a-radio>
            <a-radio value="deny">命令阻断</a-radio>
          </a-radio-group>
        </das-form-item>
        <das-form-item label="优先级" name="anchor_advanced_priority">
          <a-input-number v-model:value="formState.anchor_advanced_priority" :min="1" :max="100" />
        </das-form-item>
        <das-form-item label="通知方式" name="anchor_advanced_notifyType">
          <a-checkbox-group v-model:value="formState.anchor_advanced_notifyType">
            <a-checkbox value="email">邮件</a-checkbox>
            <a-checkbox value="sms">短信</a-checkbox>
            <a-checkbox value="wecom">企业微信</a-checkbox>
          </a-checkbox-group>
        </das-form-item>
      </das-form-group>
      <das-form-group id="anchor-extend" title="扩展信息">
        <das-form-item label="IP白名单" name="anchor_extend_ipWhitelist">
          <a-textarea v-model:value="formState.anchor_extend_ipWhitelist" :rows="3" placeholder="每行输入一个IP地址" />
        </das-form-item>
        <das-form-item label="执行策略" name="anchor_extend_executePolicy">
          <a-radio-group v-model:value="formState.anchor_extend_executePolicy" button-style="solid">
            <a-radio-button value="1">立即执行</a-radio-button>
            <a-radio-button value="2">定时执行</a-radio-button>
            <a-radio-button value="3">手动执行</a-radio-button>
          </a-radio-group>
        </das-form-item>
        <das-form-item label="备注" name="anchor_extend_remark">
          <a-textarea v-model:value="formState.anchor_extend_remark" placeholder="请输入备注" />
        </das-form-item>
      </das-form-group>

      <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
        <a-space>
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handleReset">取消</a-button>
        </a-space>
      </das-form-item>
    </das-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();

const formState = reactive<{
  anchor_basic_name: string;
  anchor_basic_tags: string[];
  anchor_basic_effectiveTime: any;
  anchor_basic_scenario: string;
  anchor_basic_description: string;
  anchor_advanced_level: string;
  anchor_advanced_action: string;
  anchor_advanced_priority: number;
  anchor_advanced_notifyType: string[];
  anchor_extend_ipWhitelist: string;
  anchor_extend_executePolicy: string;
  anchor_extend_remark: string;
}>({
  anchor_basic_name: '',
  anchor_basic_tags: [],
  anchor_basic_effectiveTime: null,
  anchor_basic_scenario: '',
  anchor_basic_description: '',
  anchor_advanced_level: 'medium',
  anchor_advanced_action: 'deny',
  anchor_advanced_priority: 50,
  anchor_advanced_notifyType: [],
  anchor_extend_ipWhitelist: '',
  anchor_extend_executePolicy: '1',
  anchor_extend_remark: ''
});

const onFinish = (values: any) => {
  // 转换成普通对象
  const plainData = {
    ...values,
    notifyType: Array.from(values.notifyType || [])
  };
  console.log('提交数据:', plainData);
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-08 互斥表单

通过 depends 属性可以设置表单项的依赖关系，当依赖条件满足时才显示该表单项。

depends 支持以下类型：
- radio: 单选框类型，会在选中指定值时显示互斥表单项，并添加背景色和缩进
- select: 下拉选择类型，会在选中指定值时显示互斥表单项，并添加背景色和缩进
- switch: 开关类型，会在开关打开时显示互斥表单项，不添加背景色和缩进

> 注意：
> - 同一个值可以对应多个依赖项，它们会同时显示
> - 建议将相关的依赖项放在一起，便于理解和维护
> - 当需要多个表单项共享同一个依赖条件时，可以使用无 label/name 的 das-form-item 作为容器

:::demo
```vue
<template>
  <das-form 
    ref="formRef"
    :model="formState" 
    :label-col="{ span: 4 }" 
    :wrapper-col="{ span: 14 }"
    @finish="onFinish"
  >
    <!-- 单选框类型 -->
    <das-form-item label="动作" name="action">
      <a-radio-group v-model:value="formState.action">
        <a-radio value="allow">允许访问</a-radio>
        <a-radio value="deny">命令阻断</a-radio>
      </a-radio-group>
    </das-form-item>

    <das-form-item
      label="阻断原因"
      name="denyReason"
      :depends="{
        type: 'radio',
        field: 'action',
        value: 'deny'
      }"
    >
      <a-input v-model:value="formState.denyReason" />
    </das-form-item>

    <!-- 下拉选择类型 -->
    <das-form-item label="高级场景" name="advancedScenario">
      <a-select v-model:value="formState.advancedScenario" placeholder="请选择场景" style="width: 100%">
        <a-select-option value="scene1">场景一</a-select-option>
        <a-select-option value="scene2">场景二</a-select-option>
      </a-select>
    </das-form-item>

    <das-form-item
      :depends="{
        type: 'select',
        field: 'advancedScenario',
        value: 'scene1'
      }"
    >
      <das-form-item label="配置一" name="scene1Config1">
        <a-input v-model:value="formState.scene1Config1" placeholder="请输入内容" />
      </das-form-item>
      <das-form-item label="配置二" name="scene1Config2" style="margin-bottom: 0">
        <a-input v-model:value="formState.scene1Config2" placeholder="请输入内容" />
      </das-form-item>
    </das-form-item>

    <!-- 开关类型 -->
    <das-form-item label="专家模式" name="expertMode">
      <a-switch v-model:checked="formState.expertMode" />
    </das-form-item>

    <das-form-item
      label="高级配置"
      name="advancedConfig"
      :depends="{
        type: 'switch',
        field: 'expertMode',
        value: true
      }"
    >
      <a-input v-model:value="formState.advancedConfig" placeholder="请输入内容" />
    </das-form-item>

    <das-form-item :wrapper-col="{ span: 14 }" :colon="false">
      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="handleReset">取消</a-button>
      </a-space>
    </das-form-item>  
  </das-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const formRef = ref();

const formState = reactive({
  action: 'allow',
  denyReason: '',
  advancedScenario: undefined,
  scene1Config1: '',
  scene1Config2: '',
  expertMode: false,
  advancedConfig: ''
});

const onFinish = (values: any) => {
  console.log('提交数据:', values);
  // 注意：未显示的互斥表单项的值不会包含在提交数据中
};

const handleReset = () => {
  formRef.value.resetFields();
};
</script>
```
:::

## das-form-09 批量新增表单项

支持卡片和表格两种模式的批量新增表单项。

### 何时使用

在以下场景中使用批量新增表单：

- 需要动态添加多条相同结构的数据时，如：
  - 批量添加 IP 地址和掩码
  - 批量添加域名和解析类型
  - 批量配置端口和协议
- 数据项之间相互独立，但结构相同
- 需要对数据项进行增删改查操作
- 数据项数量不固定，由用户动态添加

### 数据结构

表单提交时，批量新增表单项的数据结构如下：

```ts
interface FormState {
  items: Array<{
    // 每个表单项的字段
    name: string;
    remark: string;
    [key: string]: any;
  }>;
}
```

> 注意：
> - items 是一个数组，包含所有已添加的表单项数据
> - 每个表单项的数据结构由具体表单项的字段决定
> - 可以通过 min/max 属性限制最少/最多可添加的项数
> - 表格模式下可以通过 columns 配置显示的列

:::demo
```vue
<template>
  <das-form ref="formRef" :model="formState" @finish="onFinish">
    <das-form-list
      type="table"
      name="items"
      :min="1"
      :max="5"
      :columns="[
        { title: '元素', key: 'name' },
        { title: '备注', key: 'remark' },
        { title: '操作', key: 'action', width: 120, align: 'center' }
      ]"
      v-model:value="formState.items"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-input v-model:value="record.name" placeholder="请输入内容" />
        </template>
        <template v-else-if="column.key === 'remark'">
          <a-input v-model:value="record.remark" placeholder="请输入备注" />
        </template>
      </template>
    </das-form-list>

    <a-space>
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button @click="handleReset">取消</a-button>
    </a-space>
  </das-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const formRef = ref();

// 保存初始值
const initialItems = [
  {
    name: '元素测试',
    remark: '备注备注'
  }
];

const formState = ref({
  items: [...initialItems]
});

const onFinish = (values: any) => {
  console.log('提交数据:', values);
};

const handleReset = () => {
  // 先重置表单验证状态
  formRef.value?.resetFields();
  // 重置数据到初始状态
  formState.value.items = [...initialItems];
};
</script>
```
:::

### 卡片模式

:::demo
```vue
<template>
  <das-form
    ref="formRef"
    :model="formState"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    @finish="onFinish"
  >
    <das-form-list
      type="card"
      name="items"
      :min="1"
      :max="5"
      v-model:value="formState.items"
    >
      <template #default="{ record }">
        <das-form-item label="元素">
          <a-input v-model:value="record.name" placeholder="请输入内容" />
        </das-form-item>
        <das-form-item label="备注">
          <a-input v-model:value="record.remark" placeholder="请输入备注" />
        </das-form-item>
      </template>
    </das-form-list>

    <a-space>
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button @click="handleReset">取消</a-button>
    </a-space>
  </das-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const formRef = ref();

// 保存初始值
const initialItems = [
  {
    name: '元素测试',
    remark: '备注备注'
  }
];

const formState = ref({
  items: [...initialItems]
});

const onFinish = (values: any) => {
  console.log('提交数据:', values);
};

const handleReset = () => {
  // 先重置表单验证状态
  formRef.value?.resetFields();
  // 重置数据到初始状态
  formState.value.items = [...initialItems];
};
</script>
```
:::

## API

### DasForm Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `object` | - |
| rules | 表单验证规则 | `object` | - |
| layout | 表单布局方式 | `'horizontal' \| 'vertical' \| 'inline' \| 'inline-vertical'` | `'horizontal'` |
| labelCol | label 标签布局 | `object` | - |
| wrapperCol | 输入控件布局 | `object` | - |
| colon | 配置 Form.Item 的 colon 的默认值 | `boolean` | `false` |
| inlineLabelWidth | 行内布局时的统一 label 宽度 | `string` | `'120px'` |
| inlineColumns | 行内布局时的列数 | `number` | `3` |
| labelAlign | 标签文本对齐方式 | `'left' \| 'right'` | `'right'` |
| showAnchor | 是否显示导航锚点 | `boolean` | `false` |
| anchors | 导航锚点配置 | `Array<{ id: string, title: string }>` | `[]` |
| anchorPosition | 导航锚点位置 | `'left' \| 'right'` | `'right'` |
| hideRequiredMark | 隐藏所有表单项的必选标记 | `boolean` | `false` |
| validateOnRuleChange | 是否在 rules 属性改变后立即触发一次验证 | `boolean` | `true` |
| validateTrigger | 统一设置字段校验规则触发时机 | `string \| string[]` | `'change'` |
| scrollToFirstError | 提交失败自动滚动到第一个错误字段 | `boolean \| ScrollIntoViewOptions` | `false` |

### DasFormItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | `string \| slot` | - |
| name | 表单域字段名 | `string \| number \| (string \| number)[]` | - |
| rules | 校验规则 | `Rule[]` | - |
| required | 是否必填 | `boolean` | `false` |
| labelCol | label 标签布局，会覆盖 Form 的 labelCol | `ColProps` | - |
| wrapperCol | 输入控件布局，会覆盖 Form 的 wrapperCol | `ColProps` | - |
| col | 在行内布局时，当前表单项占据的列数 | `number` | `1` |
| tooltip | 标签文本右侧的提示信息 | `string \| slot` | - |
| extra | 额外的提示信息 | `string \| slot` | - |
| extraBordered | 额外提示信息是否显示边框 | `boolean` | `false` |
| validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验 | `boolean` | `false` |
| validateStatus | 校验状态 | `'success' \| 'warning' \| 'error' \| 'validating'` | - |
| validateTrigger | 设置字段校验的时机 | `string \| string[]` | `'change'` |
| help | 提示信息 | `string \| slot` | - |
| depends | 依赖配置，仅在layout为horizontal时生效 | `FormDependency` | - |

### DasFormGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 分组唯一标识，用于锚点导航 | `string` | - |
| title | 分组标题 | `string \| slot` | - |
| description | 分组描述 | `string \| slot` | - |
| descriptionMode | 描述显示模式 | `'text' \| 'tooltip'` | `'text'` |
| card | 是否使用卡片样式 | `boolean` | `false` |
| collapsible | 是否可折叠 | `boolean` | `false` |
| defaultExpanded | 默认是否展开 | `boolean` | `true` |

### DasFormList Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 列表类型 | `'card' \| 'table'` | `'card'` |
| name | 列表字段名 | `string` | - |
| value | 列表数据 | `Array<any>` | `[]` |
| min | 最小条目数 | `number` | `0` |
| max | 最大条目数 | `number` | `Infinity` |
| columns | 表格模式的列配置 | `Array<{ title: string, key: string, width?: number, align?: 'left' \| 'center' \| 'right' }>` | - |

### FormDependency

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 依赖类型 | `'radio' \| 'select' \| 'switch'` | - |
| field | 依赖的字段名 | `string` | - |
| value | 依赖的值，当字段值等于该值时显示互斥表单项 | `any` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| finish | 提交表单且验证通过后触发 | `function(values)` |
| finish-failed | 提交表单且验证失败后触发 | `function({ values, errorFields, outOfDate })` |
| validate | 任一表单项被校验后触发 | `function(name, status, errorMsgs)` |

### Methods

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| validate | 触发表单验证 | `nameList?: string[]` | `Promise` |
| validateFields | 验证指定字段 | `nameList: string[]` | `Promise` |
| resetFields | 重置表单数据 | `nameList?: string[]` | `void` |
| clearValidate | 移除表单项的校验结果 | `nameList?: string[]` | `void` |
| scrollToField | 滚动到指定表单字段位置 | `name: string \| number \| (string \| number)[], options?: ScrollIntoViewOptions` | `void` |