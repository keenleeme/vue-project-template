<ComponentInfo developer="叶思芳" date="2025-07-21" />

# das-data-export 数据导出

## 组件说明

DasDataExport 是一个功能丰富的数据导出组件，基于 Vue 3 + TypeScript 开发，支持多种导出格式、导出模式和交互方式。组件提供了灵活的配置选项，可以满足不同业务场景下的数据导出需求。组件支持一下特性：

- **多格式支持**：Excel、CSV、PDF 等常见导出格式
- **三种导出模式**：
  - 同步模式（sync）：显示进度条，支持取消操作
  - 异步模式 1（async1）：按钮 loading 状态，适合快速导出
  - 异步模式 2（async2）：后台任务，显示通知信息
- **交互功能**：
  - 导出范围提示确认
  - 字段选择功能
  - 字段分类功能，更好地组织大量字段
  - 实时进度展示
  - 取消操作支持
- **用户体验**：
  - 使用 Dropdown 进行格式选择
  - 统一的 Modal 按钮布局
  - 完整的错误处理机制
  - 支持各种失败场景处理
- **文件下载**：
  - 智能文件重命名：如果服务器返回文件名，自动添加时间戳避免重名
  - 格式：`原文件名_YYYY-MM-DD_HH-MM-SS.扩展名`
  - 无文件名时直接下载原文件

## 何时使用

- 当需要批量导出数据时，如导出用户列表、告警数据等。
- 当需要提供灵活的数据导出功能时，支持自定义导出范围和字段。
- 当需要与后端进行异步交互时，支持多种导出模式。

## 交互演示 {style="color:#ff47a3"}

通过编辑JSON配置，实时预览组件效果，可以动态调整组件的各项配置，直观地查看效果。

:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-data-export
    :mode="config.mode"
    :showCancelButton="config.showCancelButton"
    :formats="config.formats"
    :showRangeTip="config.showRangeTip"
    :showFieldSelect="config.showFieldSelect"
    :fieldCategories="config.fieldCategories"
    :availableFields="config.availableFields"
    :defaultSelectedFields="config.defaultSelectedFields"
    :defaultShowCount="config.defaultShowCount"
    :rangeType="config.rangeType"
    :taskCenterText="config.taskCenterText"
    @success="handleSuccess" 
    @error="handleError"
    :on-export="handleSyncExport"
    :on-go-task-center="handleGoTaskCenter"

    />
  </JsonEditor>
</template>

<script lang="ts" setup>
 import { mockExportHandler, basicConfig as initConfig } from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
  const handleGoTaskCenter = () => {
    message.info('正在跳转到任务列表');
    // 这里可以添加实际的路由跳转逻辑
  };
</script>

:::


## 基础用法

同步导出，支持中断导出，导出成功后自动下载文件
:::demo

```vue
<template>
  <das-data-export
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

## 禁止中断导出

设置`showCancelButton=false`，禁止用户中断导出
:::demo

```vue
<template>
  <das-data-export
   :showCancelButton="false"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };
  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
  // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
  </script>
```
::: 

## 多格式选择

通过设置`formats` ，配置需要导出格式，dropdown选择导出格式
:::demo

```vue
<template>
  <das-data-export
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
   :formats="formats"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';
 import { ref } from 'vue';

   // 导出格式
  const formats = ref([
    { key: 'xlsx', label: 'Excel (.xlsx)' },
    { key: 'csv', label: 'CSV (.csv)' }
  ]);

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };
  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
  // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::


## 导出报告
通过设置`export-type="report"`，导出报告时，导出格式为doc和pdf，自动设置文案和图标
:::demo

```vue
<template>
  <das-data-export
  export-type="report"
  :formats="reportFormats"
  @success="handleSuccess" 
  @error="handleError"
  :on-export="handleSyncExport"
  />
</template>
<script lang="ts" setup>
import {mockExportHandler} from 'Comp/data-export/mock/config'
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const reportFormats = ref([
  { key: 'doc', label: 'World(.doc)' },
  { key: 'pdf', label: 'PDF (.pdf)' }
]);
const handleSuccess = (result) => {
  message.success('导出成功！');
};
const handleError = (error) => {
  message.error('导出失败，请重试');
};
// 同步导出处理
const handleSyncExport = async (params: any) => {
  console.log('同步导出参数:', params);
  const result= await mockExportHandler(params);
  return result
};
  </script>
```

::: 

## 按钮插槽

支持自定义按钮
:::demo

```vue
<template>
  <das-data-export
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  
  >
    <template #button="{ loading,disabled,handleExport}">
      <a href="javascript:void(0);" :loading="loading" style="color:blue" :disabled="disabled" @click="handleExport">下载</a>
    </template>
  </das-data-export>

   <das-data-export
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
    export-type="report"
   :formats="reportFormats"
   style="margin-left:20px"
  >
    <template #trigger="{ loading,disabled,}">
      <a href="javascript:void(0);" :loading="loading" style="color:blue" :disabled="disabled"> 下载文档<DownOutlined/></a>
    </template>
  </das-data-export>

</template>
<script lang="ts" setup>
import {mockExportHandler} from 'Comp/data-export/mock/config'
import { message } from 'ant-design-vue';
import { DownOutlined} from '@ant-design/icons-vue';
import { ref } from 'vue';

const reportFormats = ref([
    { key: 'doc', label: 'World(.doc)' },
    { key: 'pdf', label: 'PDF (.pdf)' }
]);
  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
  
</script>

```
:::

## 导出范围提示

##### 默认导出全部数据
设置`show-range-tip="true"`，开启导出范围提示，默认导出全部数据
:::demo
```vue
<template>
 <das-data-export
  :show-range-tip="true"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  />
</template>


<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

#### 导出选中全部数据
设置`range-type="selected"`，导出选中的数据
:::demo
```vue
<template>
  <das-data-export
  :show-range-tip="true"
  range-type="selected"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

#### 使用插槽
使用插槽配置导出范围提示
:::demo
```vue
<template>
  <das-data-export
  :show-range-tip="true"
  range-type="selected"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  >
   <template #range-tip>
      <div>
        <p>当前将导出以下数据：</p>
        <ul>
          <li>用户列表：共 1,234 条记录</li>
          <li>导出时间：{{ new Date().toLocaleString() }}</li>
          <li>数据范围：全部数据</li>
        </ul>
        <p style="color: #ff4d4f">请确认导出范围是否正确</p>
      </div>
    </template>
  </das-data-export>
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

## 字段选择
通过设置`show-field-select="true"`，开启字段选择，默认选择所有字段
:::demo
```vue
<template>
  <das-data-export
  :show-field-select="true"
  :available-fields="availableFields"
  :default-selected-fields="['name', 'email', 'phone']"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  >
   <template #range-tip>
      <div>
        <p>当前将导出以下数据：</p>
        <ul>
          <li>用户列表：共 1,234 条记录</li>
          <li>导出时间：{{ new Date().toLocaleString() }}</li>
          <li>数据范围：全部数据</li>
        </ul>
        <p style="color: #ff4d4f">请确认导出范围是否正确</p>
      </div>
    </template>
  </das-data-export>
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';
 import { ref } from 'vue';

  // 可用字段
  const availableFields = ref([
    { key: 'name', label: '姓名', required: true },
    { key: 'email', label: '邮箱' },
    { key: 'phone', label: '电话' },
    { key: 'department', label: '部门' },
    { key: 'position', label: '职位' },
    { key: 'salary', label: '薪资' },
    { key: 'joinDate', label: '入职日期' },
    { key: 'status', label: '状态' }
  ]);
  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::
#### 字段分类
设置`field-categories`，配置字段分类，默认选中全部字段，用户可自定义选择字段。默认展开50个字段，用户可通过设置`defaultShowCount`设置默认展开的标签数量
:::demo
```vue
<template>
  <das-data-export
  :show-field-select="true"
  :field-categories="fieldCategories"
  :default-show-count="30"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  >
   <template #range-tip>
      <div>
        <p>当前将导出以下数据：</p>
        <ul>
          <li>用户列表：共 1,234 条记录</li>
          <li>导出时间：{{ new Date().toLocaleString() }}</li>
          <li>数据范围：全部数据</li>
        </ul>
        <p style="color: #ff4d4f">请确认导出范围是否正确</p>
      </div>
    </template>
  </das-data-export>
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';
 import { ref } from 'vue';
 
    // 字段分类
  const fieldCategories = ref([
    {
      key: 'basic',
      label: '基本信息',
      fields: [
        { key: 'name', label: '姓名', required: true },
        { key: 'email', label: '邮箱', required: true },
        { key: 'phone', label: '电话' },
        { key: 'idCard', label: '身份证号' },
        { key: 'gender', label: '性别' },
        { key: 'birthday', label: '出生日期' },
        { key: 'address', label: '居住地址' },
        { key: 'emergencyContact', label: '紧急联系人' },
        { key: 'emergencyPhone', label: '紧急联系电话' },
        { key: 'emergencyContactRelation', label: '紧急联系人关系' },
        { key: 'emergencyContactAddress', label: '紧急联系人地址' },

      ]
    },
    {
      key: 'work',
      label: '工作信息',
      fields: [
        { key: 'department', label: '部门', required: true },
        { key: 'position', label: '职位' },
        { key: 'employeeId', label: '工号', required: true },
        { key: 'joinDate', label: '入职日期' },
        { key: 'status', label: '状态' },
        { key: 'manager', label: '直属上级' },
        { key: 'workLocation', label: '工作地点' },
        { key: 'workPhone', label: '办公电话' },
        { key: 'workEmail', label: '工作邮箱' },
        { key: 'contractType', label: '合同类型' },
        { key: 'contractStart', label: '合同开始日期' },
        { key: 'contractEnd', label: '合同结束日期' },
        { key: 'workType', label: '工作类型' },
        { key: 'workExperience', label: '工作经验' },
        { key: 'workDescription', label: '工作描述' },
        { key: 'workResponsibility', label: '工作责任' },
        { key: 'workSkill', label: '工作技能' },
        { key: 'workProject', label: '工作项目' },
        { key: 'workAchievement', label: '工作业绩' },
        { key: 'workPerformance', label: '工作表现' },
        { key: 'workPerformanceRating', label: '工作表现评级' },
        { key: 'workPerformanceRatingDescription', label: '工作表现评级说明' },
        
      ]
    },
    {
      key: 'salary',
      label: '薪资信息',
      fields: [
        { key: 'salary', label: '基本工资' },
        { key: 'bonus', label: '奖金' },
        { key: 'allowance', label: '津贴' },
        { key: 'insurance', label: '社保' },
        { key: 'housingFund', label: '住房公积金' },
        { key: 'taxRate', label: '税率' },
        { key: 'overtimePay', label: '加班费' },
        { key: 'mealAllowance', label: '餐补' },
        { key: 'transportAllowance', label: '交通补贴' },
        { key: 'otherAllowance', label: '其他补贴' },
        { key: 'deduction', label: '扣款' },
        { key: 'tax', label: '个税' },
        { key: 'taxAmount', label: '个税金额' },
        { key: 'netSalary', label: '实发工资' },
        { key: 'salaryRemark', label: '工资备注' },
        { key: 'salaryRemark1', label: '工资备注1' },
        { key: 'salaryRemark2', label: '工资备注2' },
        { key: 'salaryRemark3', label: '工资备注3' },
      ]
    },
    {
      key: 'performance',
      label: '绩效信息',
      fields: [
        { key: 'performanceLevel', label: '绩效等级' },
        { key: 'evaluationDate', label: '评估日期' },
        { key: 'achievement', label: '主要成就' },
        { key: 'improvement', label: '改进建议' },
        { key: 'nextGoal', label: '下期目标' },
        { key: 'trainingNeeds', label: '培训需求' },
        { key: 'careerPlan', label: '职业规划' },
        { key: 'trainingPlan', label: '培训计划' },
        { key: 'trainingPlanRemark', label: '培训计划备注' },
        { key: 'trainingPlanRemark1', label: '培训计划备注1' },
        { key: 'trainingPlanRemark2', label: '培训计划备注2' },
        { key: 'trainingPlanRemark3', label: '培训计划备注3' },
      ]
    }
  ]);
  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::
## 范围提示+字段选择案例
:::demo
```vue
<template>
  <das-data-export
  :formats="formats"
   :show-range-tip="true"
  :show-field-select="true"
  :available-fields="availableFields"
  :default-selected-fields="['name', 'email', 'phone']"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleSyncExport"
  >
   <template #range-tip>
      <div>
        <p>当前将导出以下数据：</p>
        <ul>
          <li>用户列表：共 1,234 条记录</li>
          <li>导出时间：{{ new Date().toLocaleString() }}</li>
          <li>数据范围：全部数据</li>
        </ul>
        <p style="color: #ff4d4f">请确认导出范围是否正确</p>
      </div>
    </template>
  </das-data-export>
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';
 import { ref } from 'vue';

 const formats = ref([
    { key: 'xlsx', label: 'Excel (.xlsx)' },
    { key: 'csv', label: 'CSV (.csv)' }
  ]);
  // 可用字段
  const availableFields = ref([
    { key: 'name', label: '姓名', required: true },
    { key: 'email', label: '邮箱' },
    { key: 'phone', label: '电话' },
    { key: 'department', label: '部门' },
    { key: 'position', label: '职位' },
    { key: 'salary', label: '薪资' },
    { key: 'joinDate', label: '入职日期' },
    { key: 'status', label: '状态' }
  ]);
  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleSyncExport = async (params: any) => {
    console.log('同步导出参数:', params);
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

## 同步导出失败
:::demo

```vue
<template>
  <das-data-export
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleFailedExport"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleFailedExport = async (params: any) => {
    console.log('导出失败参数:', params);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error('导出失败：服务器内部错误');
  };
</script>

```
:::

## 异步导出-loading

异步模式loading-导出成功
:::demo

```vue
<template>
  <das-data-export
  mode='async1'
  @success="handleSuccess" 
  @error="handleError"
  :on-export="handleAsync1Export"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
    // 同步导出处理
  const handleAsync1Export = async (params: any) => {
    console.log('异步导出参数:', params);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result= await mockExportHandler(params);
    return result
  };
</script>

```
:::

异步模式loading-导出失败
:::demo

```vue
<template>
  <das-data-export
  mode='async1'
  @success="handleSuccess" 
  @error="handleError"
  :on-export="handleAsync1ExportError"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };
   // 异步导出1失败处理
  const handleAsync1ExportError = async (params: any) => {
    console.log('异步模式1导出失败参数:', params);
    // 模拟网络延迟
    // eslint-disable-next-line no-async-promise-executor
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error('导出失败：服务器内部错误');
  }
</script>

```
:::

## 异步模式-后台通知


:::demo

```vue
<template>

  <das-data-export
  mode="async2"
  task-center-text="任务列表"
   @success="handleSuccess" 
   @error="handleError"
   :on-export="handleAsync2Export"
   @go-task-center="handleGoTaskCenter"
  />
</template>
<script lang="ts" setup>
 import {mockExportHandler} from 'Comp/data-export/mock/config'
 import { message } from 'ant-design-vue';

  const handleSuccess = (result) => {
    message.success('导出成功！');
  };

  const handleError = (error) => {
    message.error('导出失败，请重试');
  };

   // 异步导出2处理
  const handleAsync2Export = async (params: any) => {
    console.log('异步模式2导出参数:', params);
    // 模拟后台处理
    // eslint-disable-next-line no-async-promise-executor
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const result= await mockExportHandler(params);
    return result
  };
    // 处理任务中心事件
  const handleGoTaskCenter = () => {
    message.info('正在跳转到任务列表');
    // 这里可以添加实际的路由跳转逻辑
  };
</script>

```
:::

## API

### 属性

| 参数                  | 说明                 | 类型                                     | 默认值                                      |
| --------------------- | -------------------- | ---------------------------------------- | ------------------------------------------- |
| formats               | 导出格式列表         | `ExportFormat[]`                         | `[{ key: 'xlsx', label: 'Excel (.xlsx)' }]` |
| mode                  | 导出模式             | `'sync' \| 'async1' \| 'async2'`         | `'sync'`                                    |
| showCancelButton      | 是否显示取消按钮     | `boolean`                                | `true`                                      |
| showRangeTip          | 是否显示导出范围提示 | `boolean`                                | `false`                                     |
| showFieldSelect       | 是否显示字段选择     | `boolean`                                | `false`                                     |
| availableFields       | 可用字段列表         | `ExportField[]`                          | `[]`                                        |
| fieldCategories  | 字段分类列表，优先级高于availableFields | `FieldCategory[]`                      | `[]`                                        |
| defaultSelectedFields | 默认选中的字段       | `string[]`                               | `[]`                                        |
| exportProgress        | 导出进度（外部控制） | `number`                                 | `0`                                         |
| buttonText            | 按钮显示文本         | `string`                                 | `'导出数据'`                                |
| buttonType            | 按钮样式类型         | `string`                                 | `'default'`                                 |
| exportType            | 导出类型：data(数据) \| `'data' \| 'report'`                            | `'data'`                                    |
| defaultShowCount  | 导出范围提示弹窗默认展开的字段分类数量 | `number`                            | `50`                                        |
| rangeType         | 导出范围类型     | `'all' \| 'selected' \| 'queried'`                                 | `'all'`                                     |
| taskCenterText    | 任务中心按钮文本 | `string`                                 | `'任务中心'`                                |
| autoDownload     | 是否自动下载文件 | `boolean`                                | `true`                                      |
| onExport              | 导出回调函数         | `(params: ExportParams) => Promise<any>` | `-`                                         |

### Events

| 事件名        | 说明           | 回调参数                     |
| ------------- | -------------- | ---------------------------- |
| success       | 导出成功时触发 | `(result?: any) => void`     |
| error         | 导出失败时触发 | `(error: any) => void`       |
| cancel        | 导出取消时触发 | `() => void`                 |
| go-task-center | 任务中心按钮点击事件 | `() => void`                 |


### Slots

| 名称      | 说明             | 参数 |
| --------- | ---------------- | ---- |
| range-tip | 导出范围提示内容 | `-`  |
| trigger   | 自定义触发下拉按钮   | `-`  |
| button   | 自定义导出按钮   | `-`  |

### 类型定义

```typescript
// 导出格式
interface ExportFormat {
  key: string;
  label: string;
}

// 导出字段
interface ExportField {
  key: string;
  label: string;
}

// 导出参数
interface ExportParams {
  format: string;
  fields: string[];
  onProgress?: (progress: number) => void;
}

// 字段分类
interface FieldCategory {
  key: string; // 分类唯一标识
  label: string; // 分类显示名称
  fields: ExportField[]; // 该分类下的字段列表
}

```