<ComponentInfo developer="王庆" date="2025-06-10" />

# async-button 异步按钮

## 组件说明
多状态聚合按钮，通过动态状态流转（例如：禁用→默认→加载→成功/失败）提供即时反馈，降低用户操作焦虑，提升系统可观测性。

- 降低用户焦虑：通过状态流转明确告知用户操作进度
- 减少重复操作：避免用户频繁点击导致的系统出错
- 检验前置：避免提交时候统一报错，返工成本高
- 统一交互体验：复用同一按钮样式和逻辑，保持系统一致性，节省页面空间

## 何时使用
- 即时反馈：通过UI变化（颜色、文案、图标）明确告知操作进度与结果。

## 交互演示 {style="color:#ff47a3"}
:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-async-button
      :type="config.type"
      :status="config.status"
      :showIcon="config.showIcon"
    >
      {{ config.text}}
    </das-async-button>
  </JsonEditor>
</template>
<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/async-button/mock/config';
</script>
```

:::


## 基础用法

异步按钮有两种类型: 主按钮和实线按钮
:::demo

```vue
<template>
  <das-async-button style="margin-right: 8px;">连通性测试</das-async-button>
  <das-async-button type="outline">连通性测试</das-async-button>
</template>
```

:::

## 异步按钮状态

异步按钮有五种类型: 禁用，默认，加载，成功，失败
:::demo

```vue
<template>
  <h3 style="margin-bottom: 16px;">主按钮</h3>
  <das-async-button status="disabled" style="margin-right: 8px;">连通性测试</das-async-button>
  <das-async-button style="margin-right: 8px;">连通性测试</das-async-button>
  <das-async-button status="loading" style="margin-right: 8px;">测试中</das-async-button>
  <das-async-button status="success" style="margin-right: 8px;">测试成功</das-async-button>
  <das-async-button status="error">测试失败</das-async-button>
  <h3 style="margin: 16px 0;">实线按钮</h3>
  <das-async-button type="outline" status="disabled" style="margin-right: 8px;">连通性测试</das-async-button>
  <das-async-button type="outline" style="margin-right: 8px;">连通性测试</das-async-button>
  <das-async-button type="outline" status="loading" style="margin-right: 8px;">测试中</das-async-button>
  <das-async-button type="outline" status="success" style="margin-right: 8px;">测试成功</das-async-button>
  <das-async-button type="outline" status="error">测试失败</das-async-button>
</template>
```

:::

## 状态流转

通过变更状态，明确告知用户操作进度与结果

:::demo

```vue
<template>
  <das-async-button style="margin-right: 8px;" :status="primaryBtnStatus" @click="handlePrimaryBtnClick">连通性测试</das-async-button>
  <das-async-button type="outline" :status="outlineBtnStatus" @click="handleOutlineBtnClick">连通性测试</das-async-button>
</template>
<script setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  const primaryBtnStatus = ref('default');
  const outlineBtnStatus = ref('default');
  const handlePrimaryBtnClick = () => {
    if(primaryBtnStatus.value !== 'default') return
    primaryBtnStatus.value = 'loading';
    const random = Math.round(Math.random());
    const statusArr = ['success', 'error'];
    setTimeout(() => {
       primaryBtnStatus.value = statusArr[random];
       message[statusArr[random]](`连通性测试${random === 0 ? '成功': '失败'}`);
      setTimeout(() => {
        primaryBtnStatus.value = 'default';
      }, 3000);
    }, 3000);
  };
  const handleOutlineBtnClick = () => {
    if(outlineBtnStatus.value !== 'default') return
    outlineBtnStatus.value = 'loading';
    const random = Math.round(Math.random());
    const statusArr = ['success', 'error'];
    setTimeout(() => {
       outlineBtnStatus.value = statusArr[random];
       message[statusArr[random]](`连通性测试${random === 0 ? '成功': '失败'}`);
      setTimeout(() => {
        outlineBtnStatus.value = 'default';
      }, 3000);
    }, 3000);
  };
</script>
```

:::

## API

### 属性

| 参数     | 说明                                                                     | 类型    | 默认值  |
| -------- | ------------------------------------------------------------------------ | ------- | ------- |
| type     | 异步按钮类型 (`primary`、 `outline` )                                    | string  | parmary |
| status   | 异步按钮状态 (`disabled`、 `default` 、 `loading`、 `success`、 `error`) | string  | default |
| showIcon | 是否显示图标                                                             | boolean | true    |

### 事件

| 事件名称 | 说明             | 回调参数        |
| -------- | ---------------- | --------------- |
| click    | 点击按钮时的回调 | (event) => void |

### 插槽

| 插槽名称 | 说明         |
| -------- | ------------ |
| default  | 异步按钮内容 |
| icon     | 异步按钮图标 |


## 适用场景

| 场景       | 示例                     | Async Button状态流转                    |
| ---------- | ------------------------ | --------------------------------------- |
| 数据导出   | 导出报表/日志到本地      | 「导出」→「导出中」→「完成/失败」       |
| 数据同步   | 同步外部数据到系统       | 「同步」→「同步中」→「完成/失败」       |
| 连通性测试 | 测试接口连通性           | 「测试」→「测试中」→「成功/失败」       |
| 数据导出   | 身份认证时发送短信验证码 | 「发送」→「已发送+倒计时」→「再次发送」 |

## 不适用场景

| 类型     | 适用场景                                      | 其他方案                                   |
| -------- | --------------------------------------------- | ------------------------------------------ |
| 长时任务 | 操作耗时超过30秒，用户误以为卡死              | 任务放在后台，结合alert / notification反馈 |
| 数据同步 | 批量操作中部分成功（如10/20台服务器配置生效） | 异步结果反馈列表                           |