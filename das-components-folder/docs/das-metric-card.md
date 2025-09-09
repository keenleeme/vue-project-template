<ComponentInfo developer="张洋洋" date="2025-03-22" />

# das-metric-card 指标卡片
## 组件说明

指标卡片用于展示重要的数据指标，支持多种布局方式和展示形式。它可以清晰地呈现数值、趋势和相关描述信息，适用于数据统计和监控场景。

## 何时使用

- 需要突出展示核心数据指标时
- 展示带有标题、数值和描述的统计信息时
- 需要在数据展示中体现趋势变化时
- 需要灵活的布局方式来适应不同的展示需求时
## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果
:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-metric-card
      :title="config.title"
      :value="config.value"
      :prefix="config.prefix"
      :suffix="config.suffix"
      :description="config.description"
      :size="config.size"
      :type="config.type"
      :bordered="config.bordered"
      :value-color="config.valueColor"
      :layout="config.layout"
      :align="config.align"
      :wrapper-style="config.wrapperStyle"
      :footer="config.footer"
      :num="config.num"
      :total="config.total"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/metric-card/mock/config';
</script>
```
:::



## 基础用法

### 基础示例

展示最基本的指标卡片用法。

:::demo

```vue
<template>
  <div class="card-row">
    <das-metric-card title="总计" value="102" layout="horizontal" :wrapperStyle="{ border: '1px solid #0639C3' }" />

    <das-metric-card title="告警总数（个）" value="102" layout="horizontal" />

    <das-metric-card title="磁盘使用率" value="33" layout="horizontal" suffix="%" />

    <das-metric-card title="总计" value="102" layout="horizontal">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
    </das-metric-card>

    <das-metric-card title="" value="33" layout="horizontal" suffix="%">
      <template #title>
        <span style="margin-right: 8px">磁盘使用率</span>
        <a-tooltip placement="top" title="说明">
          <InfoCircleOutlined />
        </a-tooltip>
      </template>
    </das-metric-card>
  </div>
</template>

<script setup lang="ts">
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { Tooltip as ATooltip } from 'ant-design-vue';
  import demoImg from '../../../components/metric-card/imgs/demo.png';
</script>

<style>
  .card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```

:::

### 不同尺寸

支持大、中、小三种尺寸。

:::demo

```vue
<template>
  <div class="card-row">
    <das-metric-card value="102" layout="horizontal" size="small">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #title>
        <span style="margin-right: 8px">总计</span>
        <a-tooltip placement="top" title="说明">
          <InfoCircleOutlined />
        </a-tooltip>
      </template>
    </das-metric-card>

    <das-metric-card value="102" layout="horizontal" size="medium">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #title>
        <span style="margin-right: 8px">总计</span>
        <a-tooltip placement="top" title="说明">
          <InfoCircleOutlined />
        </a-tooltip>
      </template>
    </das-metric-card>

    <das-metric-card value="102" layout="horizontal" size="large">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #title>
        <span style="margin-right: 8px">总计</span>
        <a-tooltip placement="top" title="说明">
          <InfoCircleOutlined :style="{ fontSize: '14px' }" />
        </a-tooltip>
      </template>
    </das-metric-card>
  </div>
</template>

<script setup lang="ts">
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { Tooltip as ATooltip } from 'ant-design-vue';
  import demoImg from '../../../components/metric-card/imgs/demo.png';
</script>

<style>
  .card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```

:::

### 布局方式

支持垂直和水平两种布局方式。

:::demo

```vue
<template>
  <div class="card-row">
    <das-metric-card title="标题" value="102" layout="vertical" :wrapperStyle="{ width: '300px' }" />

    <das-metric-card title="标题" value="102" layout="vertical" :wrapperStyle="{ width: '300px' }" align="center" />

    <das-metric-card title="标题" value="102" layout="vertical" :wrapperStyle="{ width: '300px' }" align="right" />

    <das-metric-card title="告警总数（个）" value="102" layout="vertical" :wrapperStyle="{ width: '300px' }" />

    <das-metric-card title="磁盘使用率" value="15" layout="vertical" suffix="%" :wrapperStyle="{ width: '300px' }" />

    <das-metric-card title="标题" value="102" layout="vertical" :wrapperStyle="{ width: '300px' }">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
    </das-metric-card>
  </div>

  <div class="card-row">
    <das-metric-card title="标题" value="102" layout="vertical" align="between" :wrapperStyle="{ width: '300px' }">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
    </das-metric-card>

    <das-metric-card title="标题" value="102" layout="vertical" align="between" :wrapperStyle="{ width: '400px' }">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #description> 自定义描述内容 </template>
    </das-metric-card>

    <das-metric-card
      title="标题"
      value="102"
      layout="vertical"
      align="between"
      :wrapperStyle="{ width: '400px' }"
      footer
      :num="100"
      :total="102"
    >
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #description> 自定义描述内容 </template>
    </das-metric-card>

    <das-metric-card title="标题" value="102" layout="vertical" align="between" :wrapperStyle="{ width: '400px' }">
      <template #image>
        <img :src="demoImg" alt="img" />
      </template>
      <template #description> 自定义描述内容 </template>

      <template #footer> 自定义footer </template>
    </das-metric-card>
  </div>
</template>

<script setup>
  import demoImg from '../../../components/metric-card/imgs/demo.png';
</script>

<style>
  .card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
```

:::

### 自定义样式

可以自定义卡片的样式，包括颜色、边框等。

:::demo

```vue
<template>
  <das-metric-card title="自定义样式" value="89.9%" :value-color="'#52c41a'" :bordered="false" type="success" />
</template>
```

:::

## API

### Props

| 参数         | 说明                                                                                     | 类型             | 默认值     |
| ------------ | ---------------------------------------------------------------------------------------- | ---------------- | ---------- |
| title        | 卡片标题                                                                                 | string           | ''         |
| value        | 数值内容                                                                                 | string \| number | ''         |
| prefix       | 数值前缀                                                                                 | string           | ''         |
| suffix       | 数值后缀                                                                                 | string           | ''         |
| description  | 描述文本                                                                                 | string           | ''         |
| size         | 卡片尺寸，可选值：'small' \| 'medium' \| 'large'                                         | string           | 'medium'   |
| type         | 卡片类型，可选值：'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | string           | 'default'  |
| bordered     | 是否显示边框                                                                             | boolean          | true       |
| valueColor   | 数值颜色                                                                                 | string           | ''         |
| layout       | 布局方式，可选值：'vertical' \| 'horizontal'                                             | string           | 'vertical' |
| align        | 对齐方式，可选值：'left' \| 'center' \| 'right'                                          | string           | 'left'     |
| wrapperStyle | 容器样式                                                                                 | object           | {}         |
| footer       | 是否显示底部内容                                                                         | boolean          | false      |
| num          | 进度值（配合 footer 使用）                                                               | number           | -          |
| total        | 总数（配合 footer 使用）                                                                 | number           | -          |

### Slots

| 名称        | 说明           |
| ----------- | -------------- |
| title       | 自定义标题内容 |
| prefix      | 自定义前缀内容 |
| default     | 自定义数值内容 |
| suffix      | 自定义后缀内容 |
| description | 自定义描述内容 |
| image       | 自定义图片内容 |
| footer      | 自定义底部内容 |

## 常见问题

### 1. 如何调整数值的显示样式？

可以通过以下方式调整数值样式：

- 使用 `valueColor` 属性设置数值颜色
- 通过默认插槽自定义数值的完整内容

### 2. 如何在卡片中添加图标？

可以通过 `image` 插槽添加图标或图片，建议根据 `layout` 属性选择合适的图标尺寸：

- 垂直布局：建议图标尺寸不超过 30x30px
- 水平布局：建议图标尺寸不超过 24x24px
