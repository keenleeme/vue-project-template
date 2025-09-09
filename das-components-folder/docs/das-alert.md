<ComponentInfo developer="李威" date="2025-03-19" />

# das-alert 通知提示

## 组件说明
一种用于向用户展示重要信息的反馈组件。它通过醒目的视觉效果和不同的提示类型，帮助用户快速识别信息的重要程度和类型。组件支持以下特性：

- 多种提示类型：支持成功、信息、警告、错误和普通五种类型，满足不同场景需求
- 可关闭功能：支持手动关闭提示信息
- 轮播功能：支持多条消息轮播展示，节省页面空间

## 何时使用
- 需要向用户展示警告或提示信息时
- 系统操作后需要反馈结果时（如成功、失败、警告）
- 需要用户关注的信息需要突出显示时

## 交互演示 {style="color:#ff47a3"}

通过编辑 JSON 配置，实时预览组件效果
:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-alert
      :type="config.type"
      :message="config.message"
      :title="config.title"
      :closable="config.closable"
      :show-icon="config.showIcon"
      :size="config.size"
      :banner="config.banner"
      :max-line-number="config.maxLineNumber"
      :expand="config.expand"
      :float="config.float"
      :data-source="config.dataSource"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/alert/mock/config';
</script>
```

:::

## 基础用法

展示不同类型的通知提示信息。
:::demo

```vue
<template>
  <das-alert message="用于表示操作顺利达成" type="success" />
  <das-alert message="用于表示通用信息提示" type="info" />
  <das-alert message="用于表示可能会出现的问题" type="warning" />
  <das-alert message="用于表示操作引起严重的后果" type="error" />
  <das-alert message="用于表示普通操作信息提示" type="common" />
</template>
```

:::

## 不同尺寸

通过设置 size 属性来使用不同尺寸的通知提示。
:::demo

```vue
<template>
  <das-alert message="默认尺寸" type="common" />
  <das-alert message="小尺寸" type="common" size="small" />
</template>
```

:::

## 浮层形式

通过设置 float 属性来使用浮层形式的通知提示。
:::demo

```vue
<template>
  <a-button type="primary" size="small" @click="showFloat">展示浮层形式</a-button>
  <das-alert v-if="floatValue" @close="floatValue = false" message="浮层效果" float type="warning" />
</template>

<script setup>
  import { ref } from 'vue';

  const floatValue = ref(false);
  const showFloat = () => {
    floatValue.value = true;
  };
</script>
```

:::

## 横幅模式

通过设置 banner 属性来使用横幅模式，可以添加操作按钮。
:::demo

```vue
<template>
  <das-alert type="common" banner title="标题" message="这是一段提示文案">
    <template #action>
      <a-button type="primary" size="small">主要操作</a-button>
      <a-button type="primary" size="small">次要操作</a-button>
    </template>
  </das-alert>
</template>
```

:::

## 多条消息轮播

通过设置 data-source 属性来展示多条消息的轮播。
:::demo

```vue
<template>
  <das-alert banner :data-source="dataSource">
    <template #action>
      <a-button type="primary" size="small">主要操作</a-button>
    </template>
  </das-alert>
</template>

<script setup>
  import { ref } from 'vue';

  const dataSource = ref([
    {
      type: 'success',
      title: '标题1',
      message: '这是一段提示文案1'
    },
    {
      type: 'error',
      title: '标题2',
      message: "这是一条带有<a href='https://example.com' class='das-alert-link'>链接</a>的消息"
    },
    {
      type: 'info',
      title: '标题3',
      expand: true,
      maxLineNumber: 2,
      message:
        '这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容这是一段很长的提示文案，需要展开查看更多内容'
    }
  ]);
</script>
```

:::

## API

### 属性

| 参数          | 说明                                                                  | 类型        | 默认值  |
| ------------- | --------------------------------------------------------------------- | ----------- | ------- |
| type          | 通知提示的类型(`success`、 `warning` 、`info` 、`error` 、 `common` ) | string      | common  |
| message       | 通知提示的内容                                                        | string      | ''      |
| title         | 通知提示的标题（仅在 banner 模式下有效）                              | string      | ''      |
| closable      | 是否显示关闭按钮                                                      | boolean     | true    |
| showIcon      | 是否显示图标                                                          | boolean     | true    |
| size          | 通知提示的尺寸(`small`、 `default` )                                  | string      | default |
| banner        | 是否使用横幅模式                                                      | boolean     | false   |
| maxLineNumber | 内容最大显示行数（超出后显示展开按钮）                                | number      | -       |
| expand        | 是否可展开                                                            | boolean     | false   |
| float         | 是否使用浮层形式                                                      | boolean     | false   |
| dataSource    | 多条消息轮播数据源                                                    | AlertData[] | -       |

### AlertData

| 参数          | 说明             | 类型    | 默认值 |
| ------------- | ---------------- | ------- | ------ |
| title         | 消息标题         | string  | -      |
| message       | 消息内容         | string  | -      |
| type          | 消息类型         | string  | common |
| expand        | 是否可展开       | boolean | false  |
| maxLineNumber | 内容最大显示行数 | number  | -      |

### 事件

| 事件名称 | 说明                     | 回调参数   |
| -------- | ------------------------ | ---------- |
| close    | 关闭通知提示时触发的事件 | () => void |

### 插槽

| 插槽名称 | 说明                                     |
| -------- | ---------------------------------------- |
| action   | 自定义操作按钮（仅在 banner 模式下有效） |

# das-alert 通知提示（补充设计指导）

## 🎬 适用场景

### 1、操作反馈：

传达对用户操作的反馈，由用户操作触发。

##### 1.1、即时状态反馈

需要快速反馈用户操作结果，保持操作流连续性。例如：

- 表单提交成功/失败提示

- 文件上传进度反馈

- 网络连接中断警告

##### 1.2、安全状态警示

需立即引起注意的高风险场景提示，例如：

- 异地登录安全警告

### 2、横幅提示：

不是由用户或系统触发的，而是随页面内容一起加载出来的，在页面顶部或模块内部的常驻显示的固定条状区域，用于全局或持续性的提示，以引起用户注意并采取适当行动。

##### 2.1、系统级公告

展示系统级、持续性的全局信息，例如：

- 授权即将到期/过期提醒

- 新功能推广入口

##### 2.2、操作预防性引导

在用户完成关键操作前提供预防性指引，例如：

- 功能限制说明

- 操作引导

## ⭐️ 落地实践

##### 放置位置

若通知提示使用固定嵌入，应将其放置在与其相关的部分上方。（不一定是在整个页面顶部）

##### 控制文本行数

描述尽量在 2 行以内，超过折叠。不超过 5 行。

截断的文本会给用户理解带来更多成本，为避免文本截断，请保持内容简洁。

##### 控制展示条数

尽量 1 个页面只展示 1 条，过多提示会给用户带来干扰。若有多个提示，要允许用户手动关闭。

##### 控制操作按钮数量

尽量 1 个操作按钮，最多 3 个。过多选择会让用户难以决策。

##### 保留问题的可见性

若问题未解决但用户手动关闭提示，下次打开该页面仍旧出现通知提示。

非错误问题可考虑其他操作代替「关闭」按钮，例如「稍后处理」、「不再显示」等。

##### 关于许可授权过期

提示位置：

| **登录页**                                                                                                                                                                                                                                                     | **页面内部**                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1wvqrovBENW2Oako/img/c77aa644-1cbd-4e05-a2a9-05d98b7cc655.png)![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1wvqrovBENW2Oako/img/aafee7a0-5800-40b8-974a-ec8f4287d776.png) | ![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1wvqrovBENW2Oako/img/43dac511-a1af-4922-8e00-1c9b7464d968.png)![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1wvqrovBENW2Oako/img/94d1b657-df8f-430a-b2fc-df32c0823ace.png) |
| 特殊处理，不冲突登录页原有效果                                                                                                                                                                                                                                 | 正常使用规范组件                                                                                                                                                                                                                                               |

不同类型提示的内容可参考下图

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/1wvqrovBENW2Oako/img/418ae5a3-2f48-48cd-99fd-851346c78331.png)
