<ComponentInfo developer="李忠贤" date="2025-06-27" />

# das-mixed-loading 混合加载

## 组件说明
一个功能强大的混合加载组件，提供多种加载状态展示方式。支持进度圈、进度条、旋转器、骨架屏、百分比显示、混合指示器、动画效果和文本加载等8种不同类型，满足各种业务场景的加载状态展示需求。组件支持以下特性：

- 多种加载类型：支持8种不同的加载展示方式
- 灵活配置：支持自定义颜色、尺寸、文本等属性
- 进度展示：支持百分比进度显示和状态反馈
- 骨架屏：支持内容占位和加载动画
- 自定义内容：支持自定义图标、动画和文本内容

## 何时使用

根据加载指示器的确定性和等待时间选择合适的类型：

### 确定指示器
当可以预知任务完成时间或进度时，使用确定指示器来显示具体的完成状态。

#### 进度圈（Circle）
数据查询、报表生成、文件处理等需要显示完成百分比的场景。

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-slider v-model:value="circlePercent" :min="0" :max="100" style="width: 300px" />
    
    <das-mixed-loading
      type="circle"
      :percent="circlePercent"
      text="数据处理中"
    />
  </a-space>
</template>

<script setup>
import { ref } from 'vue';

const circlePercent = ref(75);
</script>
```

:::

#### 进度条（Progress）
文件上传下载、表单提交、安装更新等线性进度展示。

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-slider v-model:value="progressPercent" :min="0" :max="100" style="width: 300px" />
    
    <das-mixed-loading
      type="progress"
      :percent="progressPercent"
      :progress-status="progressStatus"
    />
  </a-space>
</template>

<script setup>
import { ref } from 'vue';

const progressPercent = ref(60);
</script>
```

:::

#### 百分比显示（Percent）
明确需要显示具体完成百分比的任务。

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-slider v-model:value="percent" :min="0" :max="100" style="width: 300px" />
    
    <das-mixed-loading
      type="percent"
      :percent="percent"
      color="#1890ff"
    />
  </a-space>
</template>

<script setup>
import { ref } from 'vue';

const percent = ref(45);
</script>
```

:::

#### 混合指示器（Mixed）
需要品牌化或特殊视觉效果的场景。

**基础混合指示器**

:::demo

```vue
<template>
    <das-mixed-loading
      type="mixed"
      :percent="65"
      text="Loading"
      :content="i6"
      color="#1890ff"
    />
</template>

<script setup>
import i6 from './i6.gif';
</script>
```

:::

**导入**

:::demo

```vue
<template>
  <das-mixed-loading
    type="animation"
    text="正在上传"
    :content="i2"
    color="#52c41a"
    :show-dots="true"
  />
  <das-mixed-loading
      type="progress"
      :percent="creativePercent"
      style="min-height:50px"
    />
</template>

<script setup>
import { ref } from 'vue';
import i2 from './i2.gif';

const creativePercent = ref(30);
</script>
```

:::

**导出**

:::demo

```vue
<template>
  <das-mixed-loading
    type="animation"
    text="正在导出"
    :content="i3"
    color="#52c41a"
    :show-dots="true"
  />
  <das-mixed-loading
      type="progress"
      :percent="creativePercent"
      style="min-height:50px"
    />
</template>

<script setup>
import { ref } from 'vue';
import i3 from './i3.gif';

const creativePercent = ref(80);
</script>
```
:::

**安全防护一**

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <das-mixed-loading
    type="animation"
    :content="i1"
    color="#52c41a"
    :show-dots="true"
  />
  </a-space>
</template>

<script setup>
import i1 from './i1.gif';

</script>
```
:::

**安全防护二**

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <das-mixed-loading
    type="animation"
    :content="i4"
    color="#52c41a"
    :show-dots="true"
  />
  </a-space>
</template>

<script setup>
import i4 from './i4.gif';

</script>
```

:::

**安全防护三**

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <das-mixed-loading
    type="animation"
    :content="i5"
    color="#52c41a"
    :show-dots="true"
  />
  </a-space>
</template>

<script setup>
import i5 from './i5.gif';

</script>
```

:::

### 不确定指示器
当无法预知任务完成时间或进度时，使用不确定指示器来告知用户系统正在工作。

#### 旋转器（Spinner）
简单组件加载，如按钮、表格行等局部内容加载。

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-button @click="toggleSpinning">{{ spinning ? '停止加载' : '开始加载' }}</a-button>
    
    <das-mixed-loading
      type="spinner"
      :spinning="spinning"
      text="数据加载中"
    >
      <div style="padding: 20px; background: #f5f5f5; border-radius: 4px;">
        <h3>内容区域</h3>
        <p>这里是被包裹的内容，当 spinning 为 true 时会显示加载状态。</p>
      </div>
    </das-mixed-loading>
  </a-space>
</template>

<script setup>
import { ref } from 'vue';

const spinning = ref(true);

const toggleSpinning = () => {
  spinning.value = !spinning.value;
};
</script>
```

:::

#### 骨架屏（Skeleton）
页面内容加载、列表数据加载、卡片内容加载。

:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-button @click="toggleLoading">{{ loading ? '停止加载' : '开始加载' }}</a-button>
    <h4>流光效果</h4>
    <das-mixed-loading
      type="skeleton"
      :spinning="loading"
      :skeleton-rows="3"
      :skeleton-avatar="false"
      :skeleton-title="true"
      :skeleton-active="true"
    >
      <div>
        <h3>真实内容标题</h3>
        <p>这是真实的内容，当加载完成后会显示。</p>
        <p>骨架屏会模拟内容的结构，提供更好的用户体验。</p>
      </div>
    </das-mixed-loading>
    <h4>脉冲效果</h4>
    <das-mixed-loading
      type="skeleton"
      :spinning="loading"
      :skeleton-rows="3"
      :skeleton-avatar="false"
      :skeleton-title="true"
      :skeleton-active="true"
      skeleton-animation="pulse"
    >
      <div>
        <h3>真实内容标题</h3>
        <p>这是真实的内容，当加载完成后会显示。</p>
        <p>骨架屏会模拟内容的结构，提供更好的用户体验。</p>
      </div>
    </das-mixed-loading>
  </a-space>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(true);

const toggleLoading = () => {
  loading.value = !loading.value;
};
</script>
```

:::

#### 动画效果（Animation）
品牌宣传、创意展示、需要吸引用户注意力的场景。

:::demo

```vue
<template>
  <das-mixed-loading
    type="animation"
    text="Loading animation"
    :content="i6"
    color="#52c41a"
    :show-dots="true"
  />
</template>

<script setup>
import i6 from './i6.gif';
</script>
```

:::

#### 文本加载（Text）
简约界面、控制台应用、功能性场景。

:::demo

```vue
<template>
    <das-mixed-loading
      type="text"
      title="Please wait"
      text="Loading data"
      :show-dots="true"
    />
</template>
```

:::

### 等待时间建议

#### 短时等待（<1秒）
😊 **用户感知**：几乎无感知
- **建议**：不使用任何加载指示器

#### 短时等待（1-2秒）
🤔 **用户感知**：开始注意到延迟
- **推荐**：骨架屏（Skeleton）、旋转器（Spinner）
- **避免**：复杂动画和全页旋转器

#### 中等等待（2-10秒）
😤 **用户感知**：可能失去耐心
- **推荐**：确定指示器（进度圈、进度条、百分比、混合指示器）

#### 长时等待（>10秒）
😴 **用户感知**：明显的等待焦虑
- **推荐**：精确进度指示器（百分比、进度条）+ 动画效果或文本说明



## 不同尺寸

通过设置 size 属性来使用不同尺寸的加载组件。
:::demo

```vue
<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <div>
      <h4>小尺寸</h4>
      <das-mixed-loading
        type="circle"
        size="small"
        :percent="60"
        text="Small"
      />
    </div>
    
    <div>
      <h4>默认尺寸</h4>
      <das-mixed-loading
        type="circle"
        size="default"
        :percent="60"
        text="Default"
      />
    </div>
    
    <div>
      <h4>大尺寸</h4>
      <das-mixed-loading
        type="circle"
        size="large"
        :percent="60"
        text="Large"
      />
    </div>
  </a-space>
</template>
```
:::

## API

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 加载类型，可选值：`circle`、`progress`、`spinner`、`skeleton`、`percent`、`mixed`、`animation`、`text` | string | 'circle' |
| size | 组件大小，可选值：`small`、`default`、`large` | string | 'default' |
| spinning | 是否为加载中状态 | boolean | true |
| text | 描述文案/加载文本 | string | '' |
| percent | 百分比（用于进度条和百分比类型） | number | 0 |
| progressStatus | 进度条状态，可选值：`normal`、`exception`、`active`、`success` | string | 'normal' |
| showInfo | 是否显示进度数值或状态图标 | boolean | true |
| color | 主题色彩（用于进度条、图标等） | string | '#1890ff' |
| skeletonRows | 骨架屏段落行数 | number | 3 |
| skeletonAvatar | 是否显示头像占位图 | boolean | false |
| skeletonTitle | 是否显示标题占位图 | boolean | true |
| skeletonActive | 是否展示动画效果 | boolean | true |
| content | 内容参数（可以是图片URL、SVG路径或自定义HTML内容） | string | - |
| title | 标题文本（用于文本类型的主要文本） | string | 'Please wait' |
| showDots | 是否显示加载点动画 | boolean | true |

### 插槽

| 插槽名称 | 说明 |
| --- | --- |
| default | 被包裹的内容（主要用于 spinner 和 skeleton 类型） |

### 类型定义

```typescript
type LoadingType = 'circle' | 'progress' | 'spinner' | 'skeleton' | 'percent' | 'mixed' | 'animation' | 'text';

type LoadingSize = 'small' | 'default' | 'large';

type ProgressStatus = 'normal' | 'exception' | 'active' | 'success';
```