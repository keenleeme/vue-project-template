<ComponentInfo developer="宋浩" date="2024-03-25" />

# das-highlight 高亮组件

## 组件说明

文本高亮的组件，支持关键词搜索、大小写敏感匹配、精确匹配和字段匹配等功能。它可以帮助用户快速定位和突出显示文本中的关键信息，提供了丰富的配置选项和交互功能。

## 何时使用

- 实现搜索结果的高亮展示，提升用户查找效率
- 需要对文本内容进行关键信息标记和强调时
- 需要支持精确匹配、大小写敏感等高级搜索功能时
- 对文本中的特定字段（如IP地址、时间戳等）进行分类高亮显示

## 交互演示 {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果
:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-highlight
      :content="content"
      :keyword="keyword"
      :case-sensitive="config.caseSensitive"
      :exact-match="config.exactMatch"
      :bold-match="config.boldMatch"
      :show-search="config.showSearch"
      :show-navigation="config.showNavigation"
      :show-count="config.showCount"
      :textColor="config.textColor"
      :background-color="config.backgroundColor"
      :selected-background-color="config.selectedBackgroundColor"
      @change="handleChange"
      @select="handleSelect"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/highlight/mock/config';
import { ref } from 'vue';

const content = ref('这是一段示例文本，用于展示高亮组件的基本功能。你可以在搜索框中输入关键词，匹配的内容会被高亮显示。');
const keyword = ref('高亮');

const handleChange = (matches) => {
  console.log('匹配结果：', matches);
};

const handleSelect = (match) => {
  console.log('选中项：', match);
};
</script>
```
:::

## 基础功能

支持关键词搜索、导航和计数功能。

:::demo

```vue
<template>
  <das-highlight
    :content="content"
    :keyword="keyword"
    :case-sensitive="false"
    :exact-match="false"
    :bold-match="false"
    :show-search="true"
    :show-navigation="true"
    :show-count="true"
    @change="handleChange"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref('这是一段示例文本，用于展示高亮组件的基本功能。你可以在搜索框中输入关键词，匹配的内容会被高亮显示。');
const keyword = ref('高亮');

const handleChange = (matches) => {
  console.log('匹配结果：', matches);
};

const handleSelect = (match) => {
  console.log('选中项：', match);
};
</script>
```
:::


## 大小写敏感

通过`case-sensitive`属性控制匹配时是否区分大小写。

:::demo

```vue
<template>
  <das-highlight
    :content="content"
    :keyword="keyword"
    :case-sensitive="true"
    :show-search="true"
    :show-count="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref('Vue.js is a Progressive Framework. vue.js makes building web UIs easier.');
const keyword = ref('vue');
</script>
```
:::


## 精确匹配

通过`exact-match`属性控制是否进行精确词语匹配。

:::demo

```vue
<template>
  <das-highlight
    :content="content"
    :keyword="keyword"
    :exact-match="true"
    :show-search="true"
    :show-count="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref('React是一个流行的前端框架。React Native用于构建移动应用。reaction和React是不同的词。');
const keyword = ref('React');
</script>
```

:::


## 字段匹配

支持通过字段按钮组匹配特定格式的字段。

:::demo

```vue
<template>
  <das-highlight
    :content="content"
    :fields="fields"
    v-model:active-field="activeField"
    default-active-field="IP地址"
    :show-search="true"
    :show-navigation="true"
    :show-count="true"
    background-color="#e6f7ff"
    selected-background-color="#1890ff"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const content = ref('系统信息：\n主机名：server-01\n主IP：192.168.1.100\n备用IP：10.0.0.1');
const fields = [
  { name: 'IP地址', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'MAC地址', pattern: '[0-9A-F]{2}(?:-[0-9A-F]{2}){5}' },
  { name: '端口号', pattern: '\\b\\d{2,5}\\b' }
];
const activeField = ref('');
</script>
```
:::


## 插槽

支持toolbar区域插槽，通过ref实例调用组件内部方法。

:::demo

```vue
<template>
  <das-highlight
    ref="highlightRef"
    :content="content"
    :fields="fields"
    v-model:active-field="activeField"
    default-active-field="IP地址"
    :show-search="true"
    :show-navigation="true"
    :show-count="true"
    :show-toolbar="false"
  >
      <template #toolbar>
        <a-button type="primary" @click="clickButton">自定义按钮</a-button>
        <div>当前选中：{{ curr }}</div>
        <div>总匹配数：{{ total }}</div>
      </template>

  </das-highlight>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const highlightRef = ref<any>();
const content = ref('系统信息：\n主机名：server-01\n主IP：192.168.1.100\n备用IP：10.0.0.1');
const fields = [
  { name: 'IP地址', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'MAC地址', pattern: '[0-9A-F]{2}(?:-[0-9A-F]{2}){5}' },
  { name: '端口号', pattern: '\\b\\d{2,5}\\b' }
];
const activeField = ref('IP地址');
const curr = ref(0);
const total = ref(0);
const clickButton = () => {
  console.log('点击了自定义按钮', highlightRef.value);
  curr.value = highlightRef.value.currentMatchIndex + 1;
  total.value = highlightRef.value.matchCount;
  highlightRef.value.handleNext();
}
</script>
```
:::



## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 需要高亮的文本内容 | `string` | - |
| keyword | 搜索关键词 | `string` | - |
| case-sensitive | 是否区分大小写 | `boolean` | `false` |
| exact-match | 是否精确匹配 | `boolean` | `false` |
| bold-match | 是否加粗匹配项 | `boolean` | `false` |
| show-search | 是否显示搜索框 | `boolean` | `false` |
| show-navigation | 是否显示导航按钮 | `boolean` | `false` |
| show-count | 是否显示匹配计数 | `boolean` | `false` |
| show-toolbar | 是否显示工具栏 | `boolean` | `true` |
| toolbar | 插槽,`showToolbar`为`false`时适用 | `slot` | - |
| text-color | 匹配文本颜色 | `string` | '#000000' |
| background-color | 匹配项背景色 | `string` | '#ffd54f' |
| selected-background-color | 选中项背景色 | `string` | '#ff9800' |
| fields | 字段匹配配置 | `Array<{ name: string, pattern: string }>` | [] |
| active-field | 当前选中的字段（支持v-model） | `string` | - |
| default-active-field | 默认选中的字段 | `string` | - |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 匹配结果变化时触发 | `(matches: Array<{ text: string, index: number }>) => void` |
| select | 选中匹配项时触发 | `(match: { text: string, index: number }) => void` |
| update:active-field | 字段选中状态变化时触发 | `(field: string) => void` |

### Methods

通过组件实例可以调用以下方法：

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| calculateMaxPage | 计算字段按钮组的最大页数 | - | `void` |
| handleResize | 处理窗口大小变化，重新计算页数 | - | `void` |
| handlePrevPage | 切换到上一页字段按钮组 | - | `void` |
| handleNextPage | 切换到下一页字段按钮组 | - | `void` |
| handleFieldClick | 处理字段按钮点击事件 | `field: { name: string, pattern: string }` | `void` |
| highlightText | 执行文本高亮处理 | - | `void` |
| selectMatch | 选中指定索引的匹配项 | `index: number` | `void` |
| handlePrev | 选中上一个匹配项 | - | `void` |
| handleNext | 选中下一个匹配项 | - | `void` |
| resetHighlight | 重置高亮状态 | - | `void` |

### Properties

通过组件实例可以访问以下属性：

| 属性名 | 说明 | 类型 |
| --- | --- | --- |
| contentRef | 内容区域DOM引用 | `HTMLElement \| null>` |
| fieldsContainerRef | 字段按钮容器DOM引用 | `Ref<HTMLElement \| null>` |
| currentPage | 当前字段按钮组页码 | `Ref<number>` |
| maxPage | 字段按钮组最大页数 | `Ref<number>` |
| searchKeyword | 当前搜索关键词 | `Ref<string>` |
| currentMatchIndex | 当前选中的匹配项索引 | `Ref<number>` |
| matches | 所有匹配项列表 | `Ref<Array<{ text: string, index: number }>>` |
| fieldMatchCounts | 各字段的匹配数量 | `Ref<Record<string, number>>` |
| matchCount | 总匹配数量 | `ComputedRef<number>` |

## 常见问题

### 1. 如何自定义匹配项的样式？

可以通过`text-color`、`background-color`和`selected-background-color`属性来自定义匹配项的文本颜色和背景色。同时，可以通过`bold-match`属性控制是否加粗显示匹配项。

### 2. 如何处理大量文本的性能问题？

组件内部已经对文本处理和高亮渲染进行了优化。但是，当处理大量文本时，建议：

- 合理使用`exact-match`属性，减少不必要的匹配
- 避免过于频繁地更新`content`或`keyword`
- 必要时可以使用分页或虚拟滚动来展示大量文本

### 3. 如何实现自定义的字段匹配规则？

通过`fields`属性可以配置自定义的字段匹配规则，每个字段需要提供：

- name：字段名称
- pattern：匹配的正则表达式

例如，匹配邮箱地址：

```js
const fields = [
  {
    name: '邮箱地址',
    pattern: '\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w+\\b'
  }
];
```

### 4. 如何获取匹配结果？

可以通过监听`change`事件来获取匹配结果：

```vue
<das-highlight
  :content="content"
  :keyword="keyword"
  @change="(matches) => {
    console.log('匹配结果：', matches);
  }"
/>
```

每个匹配项包含：

- text：匹配的文本内容
- index：在原文中的位置索引