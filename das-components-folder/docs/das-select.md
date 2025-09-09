<ComponentInfo developer="曾琴" date="2025-03-19" />

# das-select 下拉选择器

## 组件说明

下拉选择器组件,支持基础选择、分组选择和树形选择等多种模式。提供丰富的交互功能和自定义选项。

## 何时使用

- 需要用户从多个选项中选择一个或多个选项时
- 选项内容较多,需要分组或树形结构展示时
- 需要支持搜索过滤选项时

## 交互演示 {style="color:#ff47a3"}

通过编辑 JSON 配置,实时预览组件效果。可以动态调整组件的各项配置,直观地查看效果。
:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-select
      style="width: 400px"
      :value="config.value"
      :placeholder="config.placeholder"
      :allow-clear="config.allowClear"
      :is-tree="config.isTree"
      :show-search="config.showSearch"
      :options="config.options"
      @search="onSearch"
      @popupScroll="onPopupScroll"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
  import { basicConfig as initConfig } from 'Comp/select/mock/config';

  const onSearch = (value: string) => {
    console.log(value);
  };

  const onPopupScroll = (e: any) => {
    console.log(e);
  };
</script>
```

:::

## das-select-01 基础选择器

展示下拉选择器的基础功能:

- 支持单选/多选模式
- 支持搜索过滤选项,可根据关键字快速定位
- 支持一键清除已选项
- 支持选项禁用
- 支持大数据量场景,内置虚拟滚动

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          show-search
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 100; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value,
      disabled: i === 10
    });
  }

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-02 分组选择器

支持选项分组展示的下拉选择器:

- 通过 options 的嵌套结构配置分组
- 分组之间自动添加分隔线
- 分组标题使用灰色展示,区分普通选项
- 支持分组内选项的所有基础功能

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          show-search
          :is-tree="false"
          placeholder="请选择分组选项"
          v-model:value="value"
          :options="groupOptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const groupOptions = ref([
    {
      label: 'Manager',
      options: [
        {
          value: 'jack',
          label: 'Jack'
        },
        {
          value: 'lucy',
          label: 'Lucy'
        }
      ]
    },
    {
      label: 'Engineer',
      options: [
        {
          value: 'yiminghe',
          label: 'Yiminghe'
        }
      ]
    }
  ]);

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-03 树形选择器

支持树形结构数据选择:

- 支持多层级数据的展示和选择
- 支持节点展开/收起操作
- 支持节点搜索过滤,命中节点自动展开
- 支持节点禁用
- 支持自定义节点内容渲染

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          show-search
          placeholder="请选择树形选项"
          allow-clear
          :is-tree="true"
          v-model:value="treeValue"
          :tree-data="treeOptions"
          is-dropdown-search
          @select="onSelect"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const generateTreeNodes = (
    depth: number,
    nodesPerLevel: number,
    currentDepth: number = 1,
    parentKey: string = ''
  ): any[] => {
    const nodes = [];

    for (let i = 1; i <= nodesPerLevel; i++) {
      const key = parentKey ? `${parentKey}-${i}` : `node-${i}`;
      const node = {
        key,
        title: `Node ${key}`,
        disabled: i === 3
      };

      if (currentDepth < depth) {
        node.children = generateTreeNodes(depth, nodesPerLevel, currentDepth + 1, key);
      }

      nodes.push(node);
    }

    return nodes;
  };

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const treeValue = ref(undefined);
  const treeOptions = ref(generateTreeNodes(2, 8)); // 2层深度，每层8个节点
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-04 下拉搜索

在下拉面板中显示独立搜索框:

- 仅在多选模式下可用
- 搜索框固定在下拉面板顶部
- 支持大数据量场景的搜索
- 搜索时自动高亮匹配文本
- 保持选择器本身的焦点状态

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          is-dropdown-search
          mode="multiple"
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value,
      disabled: i === 10
    });
  }

  const value = ref([]);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-05 最大选择数量

限制多选模式下的最大可选数量:

- 通过 selectMaxCount 设置最大可选数量
- 达到上限后自动禁用未选项
- 在选择器右侧显示已选数量/最大数量
- 超出限制时自动截断多余选项

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          show-search
          mode="multiple"
          :options="options"
          :select-max-count="3"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 70; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value,
      disabled: i === 10
    });
  }

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-06 快捷全选

提供快捷的全选/取消全选操作:

- 在下拉面板顶部显示快捷操作按钮
- 显示当前已选择的数量
- 支持一键全选所有可选项
- 支持一键取消所有选择
- 仅在多选模式下可用

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          is-dropdown-search
          mode="multiple"
          quick-select
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 20; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value
    });
  }

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-07 添加标签

支持手动输入创建新的选项标签:

- 使用 mode="tags" 启用标签模式
- 输入内容按回车自动创建新标签
- 新创建的标签会加入选项列表
- 支持删除已创建的标签
- 可以与预设选项混合使用

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="tags"
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 20; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value
    });
  }

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-08 横向拉伸

支持调整下拉面板的宽度:

- 通过拖拽右下角调整下拉框大小
- 当选项内容过长时支持横向滚动
- 设置 virtual=false 后 只支持横向拉伸
- 面板大小调整不影响选择器本身
- 关闭下拉面板后自动重置尺寸

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          show-search
          :virtual="false"
          mode="multiple"
          is-dropdown-search
          is-dropdown-resize
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 20; i++) {
    const value = generateRandomString(80);
    options.push({
      value,
      label: value,
      disabled: i === 10
    });
  }

  const value = ref(undefined);
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-09 自适应收缩

选中项在输入框中自适应收缩, 仅多选功能中支持

查看收缩选项时可展示成列表

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="multiple"
          render-list
          quick-select
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value,
      disabled: i === 10
    });
  }

  const value = ref(undefined);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
  }
</style>
```

:::

## das-select-10 描述文字

支持对每个选项有描述内容,通过字段 desc 设置

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="multiple"
          is-dropdown-search
          :options="options"
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(30);
    options.push({
      value,
      label: value,
      disabled: i === 10,
      desc: '注释描述文字'
    });
  }

  const value = ref(undefined);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

## das-select-11 垂直描述文字

支持对每个选项有描述内容,通过字段 desc 设置
支持垂直展示

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="multiple"
          is-dropdown-search
          :options="options"
          desc-vertical
        >
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value,
      disabled: i === 10,
      desc: '注释描述文字'
    });
  }

  const value = ref(undefined);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

## das-select-12 自定义选项图标

支持自定义选项图标

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="multiple"
          is-dropdown-search
          :options="options"
        >
          <template #icon="slotProps"> <span>🇨🇳</span> </template>
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value
    });
  }

  const value = ref(undefined);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

## das-select-13 下拉底部操作

支持自定义下拉底部操作

:::demo

```vue
<template>
  <div class="demo-container">
    <div class="demo-section">
      <div class="demo-content">
        <das-select
          style="width: 400px"
          placeholder="请选择选项"
          v-model:value="value"
          :is-tree="false"
          allow-clear
          mode="multiple"
          is-dropdown-search
          :options="options"
        >
          <template #dropdownFooter="props">
            <span>未找到符合的选项？</span>
          </template>
        </das-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const options: { value: string; disabled: boolean }[] = [];
  const generateRandomString = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  for (let i = 0; i < 1000; i++) {
    const value = generateRandomString(10);
    options.push({
      value,
      label: value
    });
  }

  const value = ref(undefined);

  const onSelect = (value: any, option: any) => {
    console.log(value, option);
  };

  const onChange = (value: any, option: any) => {
    console.log(value, option);
  };
</script>

<style lang="less">
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .demo-section {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .demo-content {
    padding: 16px;
    display: flex;
    gap: 8px;
  }
</style>
```

:::

## API

### 公共属性

| 参数             | 说明                                                         | 类型                                            | 默认值                   |
| ---------------- | ------------------------------------------------------------ | ----------------------------------------------- | ------------------------ |
| isTree           | 下拉列表/树                                                  | boolean                                         | `false`                  |
| isDropdownSearch | 是否显示下拉搜索框（只在多选中生效），和 showSearch 互斥     | boolean                                         | `false`                  |
| isDropdownResize | 是否支持下拉框宽度调整                                       | boolean                                         | `false`                  |
| quickSelect      | 是否显示快速选择（只在多选中生效）                           | boolean                                         | `false`                  |
| selectMaxCount   | 最大选择数量（只在多选中生效）                               | number                                          | 0                        |
| allowClear       | 支持清除选中数据                                             | boolean                                         | `false`                  |
| notFoundContent  | 当下拉列表为空时显示的内容                                   | string/slot                                     | `Not Found`              |
| placeholder      | 选择框默认文字                                               | string/slot                                     | -                        |
| placement        | 选择框弹出的位置                                             | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft               |
| popupClassName   | 下拉菜单的 className 属性                                    | string                                          | -                        |
| showSearch       | 配置是否可搜索                                               | boolean                                         | 单选为 false,多选为 true |
| size             | 选择框大小，可选 `large` `small`                             | string                                          | 'default'                |
| status           | 设置校验状态                                                 | 'error' / 'warning'                             | -                        |
| suffixIcon       | 自定义的选择框后缀图标                                       | VNode / slot                                    | -                        |
| value(v-model)   | 指定当前选中的条目                                           | string/string\[]/number/number\[]               | -                        |
| virtual          | 设置 false 时关闭虚拟滚动                                    | boolean                                         | true                     |
| autoResize       | 是否自动调整标签显示数量                                     | boolean                                         | true                     |
| renderList       | 是否使用虚拟列表渲染隐藏标签，只在 autoResize 为 true 时生效 | boolean                                         | false                    |
| descVertical     | 是否垂直显示描述                                             | boolean                                         | false                    |

### Select 模式（isTree: false）

| 参数                     | 说明                                                                                                                                                                                                                                                                      | 类型                                                   | 默认值                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| autofocus                | 默认获取焦点                                                                                                                                                                                                                                                              | boolean                                                | false                                                  |
| bordered                 | 是否有边框                                                                                                                                                                                                                                                                | boolean                                                | true                                                   |
| clearIcon                | 自定义的多选框清空图标                                                                                                                                                                                                                                                    | VNode / slot                                           | -                                                      |
| defaultActiveFirstOption | 是否默认高亮第一个选项。                                                                                                                                                                                                                                                  | boolean                                                | true                                                   |
| defaultOpen              | 是否默认展开下拉菜单                                                                                                                                                                                                                                                      | boolean                                                | -                                                      |
| disabled                 | 是否禁用                                                                                                                                                                                                                                                                  | boolean                                                | false                                                  |
| dropdownMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动                                                                                                                                                                        | boolean / number                                       | true                                                   |
| dropdownMenuStyle        | dropdown 菜单自定义样式                                                                                                                                                                                                                                                   | object                                                 | -                                                      |
| dropdownRender           | 自定义下拉框内容                                                                                                                                                                                                                                                          | ({menuNode: VNode, props}) => VNode / v-slot           | -                                                      |
| dropdownStyle            | 下拉菜单的 style 属性                                                                                                                                                                                                                                                     | object                                                 | -                                                      |
| fieldNames               | 自定义节点 label、value、options 的字段                                                                                                                                                                                                                                   | object                                                 | { label: `label`, value: `value`, options: `options` } |
| filterOption             | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 `true`，反之则返回 `false`。                                                                                                                          | `boolean` / `function(inputValue, option)`             | true                                                   |
| filterSort               | 搜索时对筛选结果项的排序函数, 类似[Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)里的 compareFunction                                                                                                           | (optionA: Option, optionB: Option) => number           | -                                                      |
| firstActiveValue         | 默认高亮的选项                                                                                                                                                                                                                                                            | string / string\[]                                     | -                                                      |
| getPopupContainer        | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。                                                                                                                                                                      | function(triggerNode)                                  | () => document.body                                    |
| labelInValue             | 是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 `string` 变为 `{key: string, label: vNodes, originLabel: any}` 的格式, originLabel（3.1） 保持原始类型，如果通过 a-select-option children 构造的节点，该值是是个函数（即 a-select-option 的默认插槽） | boolean                                                | false                                                  |
| listHeight               | 设置弹窗滚动高度                                                                                                                                                                                                                                                          | number                                                 | 256                                                    |
| menuItemSelectedIcon     | 自定义当前选中的条目图标                                                                                                                                                                                                                                                  | VNode / slot                                           | -                                                      |
| open                     | 是否展开下拉菜单                                                                                                                                                                                                                                                          | boolean                                                | -                                                      |
| option                   | 通过 option 插槽，自定义节点                                                                                                                                                                                                                                              | v-slot:option="{value, label, [disabled, key, title]}" | -                                                      |
| optionFilterProp         | 搜索时过滤对应的 option 属性，不支持 children                                                                                                                                                                                                                             | string                                                 | value                                                  |
| optionLabelProp          | 回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 `value`。                                                                                                                                                                | string                                                 | `children` / `label`(设置 options 时)                  |
| options                  | options 数据，如果设置则不需要手动构造 selectOption 节点                                                                                                                                                                                                                  | Array&lt;{value, label, [disabled, key, title]}>       | \[]                                                    |
| removeIcon               | 自定义的多选框清除图标                                                                                                                                                                                                                                                    | VNode / slot                                           | -                                                      |
| searchValue              | 控制搜索文本                                                                                                                                                                                                                                                              | string                                                 | -                                                      |

### Tree 模式（isTree: true）

| 参数                      | 说明                                                                                                                                                               | 类型                                                                        | 默认值                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| showCheckedStrategy       | 定义选中项回填的方式。`TreeSelect.SHOW_ALL`: 显示所有选中节点(包括父节点). `TreeSelect.SHOW_PARENT`: 只显示父节点(当父节点下所有子节点都选中时). 默认只显示子节点. | enum{TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD }   | TreeSelect.SHOW_CHILD                                            |
| treeData                  | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一）                                                                                 | array&lt;{value, label, children, [disabled, disableCheckbox, selectable]}> | \[]                                                              |
| treeDataSimpleMode        | 使用简单格式的 treeData，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: \[{id:1, pId:0, value:'1', label:"test1",...},...], `pId` 是父节点的 id)    | false/Array&lt;{ id: string, pId: string, rootPId: null }>                  | false                                                            |
| treeDefaultExpandAll      | 默认展开所有树节点                                                                                                                                                 | boolean                                                                     | false                                                            |
| treeDefaultExpandedKeys   | 默认展开的树节点                                                                                                                                                   | string\[] / number\[]                                                       | -                                                                |
| treeExpandedKeys(v-model) | 设置展开的树节点                                                                                                                                                   | string\[] / number\[]                                                       | -                                                                |
| treeIcon                  | 是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式                                                                            | boolean                                                                     | false                                                            |
| treeLine                  | 是否展示线条样式                                                                                                                                                   | boolean / object                                                            | false                                                            |
| treeLoadedKeys            | （受控）已经加载的节点，需要配合 `loadData` 使用                                                                                                                   | string[]                                                                    | []                                                               |
| treeNodeFilterProp        | 输入项过滤对应的 treeNode 属性                                                                                                                                     | string                                                                      | 'value'                                                          |
| treeNodeLabelProp         | 作为显示的 prop 设置                                                                                                                                               | string                                                                      | 'title'                                                          |
| replaceFields             | 替换 treeNode 中 label,value,key,children 字段为 treeData 中对应的字段                                                                                             | object                                                                      | {children:`children`, label:`title`, key:`key`, value: `value` } |

## 事件

| 事件名称              | 说明                 | 回调参数                                     |
| --------------------- | -------------------- | -------------------------------------------- |
| change                | 选中值发生变化时触发 | `function(value, option: Option / TreeNode)` |
| select                | 被选中时调用         | `function(value, option: Option / TreeNode)` |
| deselect              | 取消选中时调用       | `function(value)`                            |
| search                | 搜索框内容变化时回调 | `function(value: string)`                    |
| clear                 | 清除内容时回调       | `function()`                                 |
| blur                  | 失去焦点时回调       | `function(e: FocusEvent)`                    |
| focus                 | 获得焦点时回调       | `function(e: FocusEvent)`                    |
| popupScroll           | 下拉列表滚动时触发   | `function(e: Event)`                         |
| dropdownVisibleChange | 展开下拉菜单的回调   | `function(open: boolean)`                    |
| mouseenter            | 鼠标移入时触发       | `function(e: MouseEvent)`                    |
| mouseleave            | 鼠标移出时触发       | `function(e: MouseEvent)`                    |
| click                 | 点击时触发           | `function(e: MouseEvent)`                    |
| keydown               | 键盘按下时触发       | `function(e: KeyboardEvent)`                 |
| keyup                 | 键盘释放时触发       | `function(e: KeyboardEvent)`                 |
| mousedown             | 鼠标按下时触发       | `function(e: MouseEvent)`                    |
| inputKeyDown          | 输入框键盘按下时触发 | `function(e: KeyboardEvent)`                 |

## 插槽

| 插槽名称       | 说明               | 参数                                     |
| -------------- | ------------------ | ---------------------------------------- |
| dropdownFooter | 自定义下拉底部操作 | `{  props }`                             |
| icon           | 自定义选项图标     | `{ value, label, disabled, key, title }` |

## 注意事项

1. 上述 API 参考 ant-design-vue 的 Select 和 TreeSelect 组件
2. 通过 option 插槽实现高亮文字，因此传入 option 插槽 将失去高亮功能。可以通过以下方式去实现高亮

```
<template #option="slotProps">
  <v-nodes :vnodes="renderHighlightText(slotProps.label)" />
</template>

const VNodes = (_, { attrs }) => attrs.vnodes;

const { renderHighlightText } = useHighlight(searchValue);
```
