<ComponentInfo developer="伍雨豪" date="2025-03-25" />

# das-detail 详情展示

## 组件说明

详情组件，用于详情页的信息展示；支持卡片式和默认两种展示形态，以及多级标题模式

## 何时使用 

- **数据展示**：展示结构化的详细信息，如用户信息、订单信息等
- **表单预览**：用于表单提交后的数据预览展示
- **配置展示**：系统配置、设备信息等多层级数据的展示
- **卡片布局**：需要卡片式布局展示详细信息的场景
- **自适应布局**：支持水平和垂直两种布局方式，适应不同的展示需求

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-detail
      :type="config.type"
      :title="config.title"
      :layout="config.layout"
      :multiple="config.multiple"
      :detail-data="config.detailData"
      :items="config.items"
      :column="config.column"
      :colon="config.colon"
      :label-width="config.labelWidth"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/detail/mock/config';
</script>
```
:::

## 基础用法
:::demo
```vue
<template>
  <div class="demo-container">
    <das-detail :items="defaultItems" :detail-data="defaultData" :column="3" />
    <div style="height: 16px"></div>
    <das-detail :items="defaultItems" :detail-data="defaultData" :column="1" layout="vertical" :colon="false" />
  </div>
</template>

<script lang="ts" setup>
  // 默认模式数据
  const defaultData = {
    todayCount: '100条',
    basicInfo: {
      type: '无标题模式',
      uniqueId: 'api-192.168.33.126-2773879f',
      deviceIp: '192.168.33.188',
      updateTime: '2022-04-21 20:15:08'
    }
  };

  const defaultItems = [
    { label: '类型', key: ['basicInfo', 'type'] },
    { label: '唯一标识', key: ['basicInfo', 'uniqueId'], span: 2 },
    { label: '设备IP', key: ['basicInfo', 'deviceIp'] },
    { label: '更新时间', key: ['basicInfo', 'updateTime'] }
  ];
</script>

<style lang="less" scoped></style>
```
:::

## 卡片模式
:::demo

```vue
<template>
  <das-detail type="card" title="卡片模式" :items="cardItems" :detail-data="cardData" :column="2">
    <template #extra>
      <Button size="small">编辑</Button>
    </template>

    <!-- label 自定义 -->
    <template #label_custom="{ item }">
      <div style="display: flex; align-items: center">
        {{ item.label }}slot
        <Tooltip title="测试文案"><QuestionCircleOutlined style="margin-left: 8px" /></Tooltip>
      </div>
    </template>

    <!-- content 自定义 -->
    <template #content_custom="{ data }">
      <div style="display: flex; align-items: center">
        <Tag color="success">
          {{ data?.projectInfo?.status }}
        </Tag>
        <CopyOutlined />
      </div>
    </template>
  </das-detail>
</template>

<script lang="ts" setup>
  import { CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { Button, Tag, Tooltip } from 'ant-design-vue';

  // 卡片模式数据
  const cardData = {
    projectInfo: {
      status: '进行中',
      createTime: '2023-12-01 10:00:00',
      priority:
        '已创建新进程。 使用者:安全 ID: S-1-5-18 帐户名称: : WIN-RR797SS6PA2$ 帐户域: WORKGROUP 登录 ID: 0x3E7 WORKGROUP 登录 ID: 0x3E7 ',
      description: `已创建新进程。 使用者: 
      安全 ID: S-1-5-18 帐户名称: WIN-RR797SS6PA2$ 帐户域: WORKGROUP 登录 ID: 0x3E7 
      进程信息: 新进程 ID: 0x5614 新进程名称令牌提升类型: TokenElevationTypeDefault (1) 
      创建者进程 ID: 0x2c9e8 进程命令行: "令牌提升类型"指示根据用户帐户控制策略分配给新进程的令牌类型。
      类型 1 是未删除特权或禁用组的完全令牌。完全令牌仅在禁用了用户帐户控制或者用户是内置管理员帐户或服务帐户的情况下使用。
      类型 2 是未删除特权或禁用组的提升令牌。当启用了用户帐户控制并且用户选择使用"以管理员身份运行"选项启动程序时会
      使用提升令牌。当应用程序配置为始终需要管理特权或始终需要最高特权并且用户是管理员组的成员时，也会使用提升令牌。 类型 3 是删除了管理特权并禁用了管理组的受限令牌。当启用了用户帐户控制，应用程序不需要管理特权并且用户未选择使用"以管理员身份运行"选项启动程序时，会使用受限令牌。`
    }
  };

  const cardItems = [
    { label: '自定义', key: ['projectInfo', 'custom'] },
    { label: '创建时间', key: ['projectInfo', 'createTime'] },
    { label: '省略号文本', key: ['projectInfo', 'priority'], span: 2 },
    { label: '展开收起', key: ['projectInfo', 'description'], span: 2, expandable: true }
  ];
</script>
```
:::

## 多级标题模式
:::demo
```vue
<template>
  <das-detail
    type="card"
    title="多级标题"
    :items="multiLevelItems"
    :multiple="true"
    :detail-data="multiLevelData"
    :column="2"
  >
    <!-- label 自定义 -->
    <template #label_custom="{ item }">
      <div style="display: flex; align-items: center">
        {{ item.label }}slot
        <Tooltip title="测试文案"><QuestionCircleOutlined style="margin-left: 8px" /></Tooltip>
      </div>
    </template>

    <!-- content 自定义 -->
    <template #content_custom="{ data }">
      <div style="display: flex; align-items: center">
        <Tag color="success"> 测试 </Tag>
        <CopyOutlined />
      </div>
    </template>
  </das-detail>
</template>

<script lang="ts" setup>
  import { CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { Button, Tag, Space, Tooltip } from 'ant-design-vue';

  // 多级标题模式数据
  const multiLevelData = {
    displayInfo: {
      resolution: '1920x1080'
    },
    transmitInfo: {
      protocol: 'TCP/IP',
      bandwidth: '100Mbps'
    }
  };

  const multiLevelItems = [
    {
      title: '展示信息',
      children: [
        { label: '自定义', key: ['displayInfo', 'custom'] },
        { label: '分辨率', key: ['displayInfo', 'resolution'] }
      ]
    },
    {
      title: '传输信息',
      children: [
        { label: '协议', key: ['transmitInfo', 'protocol'] },
        { label: '带宽', key: ['transmitInfo', 'bandwidth'] }
      ]
    }
  ];
</script>

<style lang="less" scoped>
  .demo-container {
    padding: 16px;
  }
</style>
```
:::

## API

### Props

| 参数       | 说明                              | 类 型                                             | 默认值  |
| ---------- | --------------------------------- | ------------------------------------------------ | ------- |
| type       | 展示类型，支持默认和卡片两种形式  | `'default'` ｜ `'card'` \|`'default'`            |
| title      | 标题（仅在 card 类型下生效）      | `string`                                         | -       |
| layout     | 布局方式                          | `'horizontal'` ｜ `'vertical'` \| `'horizontal'` |
| multiple   | 是否支持多级标题                  | `boolean`                                        | `false` |
| detailData | 详情数据对象                      | `Record<string, any>`                            | -       |
| items      | 详情项配置                        | `DetailItem[]`                                   | `[]`    |
| column     | 一行的列数                        | `number`                                         | `3`     |
| colon      | 配置 label 后面的冒号             | `boolean`                                        | `true`  |
| labelWidth | 标签宽度(设置则 label 自动右对齐) | `number` \| `string`                             | -       |

### DetailItem

| 参数       | 说明                           | 类型                        | 默认值  |
| ---------- | ------------------------------ | --------------------------- | ------- |
| title      | 子标题文本                     | `string`                    | -       |
| label      | 标签文本                       | `string`                    | -       |
| key        | 键名或键名数组                 | `string` ｜ `string[]` \| - |
| span       | 占据的列数                     | `number`                    | `1`     |
| expandable | 是否可展开收起                 | `boolean`                   | `false` |
| expandRow  | 展开行数                       | `number`                    | `4`     |
| children   | 子项数组（多级标题模式下生效） | `DetailItem[]`              | -       |

### Slots

| 名称           | 说明                                      | 参数                                              |
| -------------- | ----------------------------------------- | ------------------------------------------------- |
| title          | 卡片模式下标题区域（若设置则 extra 无效） | -                                                 |
| extra          | 卡片模式下的额外操作区域                  | -                                                 |
| label\_[key]   | 自定义标签内容                            | `{ item: DetailItem }`                            |
| content\_[key] | 自定义内容区域                            | `{ item: DetailItem, data: Record<string, any> }` |
