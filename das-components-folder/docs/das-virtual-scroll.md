# das-virtual-scroll 虚拟列表



## 组件说明
一种高效的大数据渲染解决方案。该组件通过"虚拟化"技术，仅渲染用户视口（viewport）内可见的部分数据，而不是渲染全部数据。这种方式可以显著减少 DOM 节点数量，降低内存占用，提升页面渲染性能和用户交互体验。

## 何时使用
- 当需要展示大量数据（通常超过1000条）时，避免一次性渲染所有数据导致性能问题
- 在前端需要展示大型表格、长列表等数据密集型界面时
- 需要优化长列表的滚动性能，提供流畅的用户体验时
- 当应用需要同时维护多个大数据列表，需要控制内存占用时

## 基础用法

:::demo

```vue
<template>
  <div style="height:300px">
    <das-virtual-scroll :items="items" :item-height="30">
      <template #default="{ item }">
        <div class="line-item">{{ item.value }}</div>
      </template>
    </das-virtual-scroll>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  interface ListItem {
    id: number;
    value: string;
  }

  const items = ref<ListItem[]>([]);

  onMounted(() => {
    generateItemList();
  });

  const generateItemList = () => {
    const cloneList = [];
    for (let i = 0; i < 100; i++) {
      cloneList.push({
        id: i + 1, // 假设ID从1开始
        value: `Value ${i + 1}` // 每个元素的value属性
      });
    }
    items.value = cloneList;
  };
</script>

<style>
  .line-item {
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
  }
</style>
```

:::

### 自定义高度
:::demo
```vue
<template>
  <div style="height:300px">
    <das-virtual-scroll :items="items" :item-height="60">
      <template #default="{ item }">
        <div class="custom-item">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </template>
    </das-virtual-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface CustomItem {
  id: number;
  title: string;
  desc: string;
}

const items = ref<CustomItem[]>([]);

onMounted(() => {
  generateItems();
});

const generateItems = () => {
  const list = [];
  for (let i = 0; i < 1000; i++) {
    list.push({
      id: i + 1,
      title: `标题 ${i + 1}`,
      desc: `这是第 ${i + 1} 个项目的详细描述信息`
    });
  }
  items.value = list;
};
</script>

<style>
.custom-item {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}
.title {
  font-weight: bold;
  margin-bottom: 4px;
}
.desc {
  color: #666;
  font-size: 12px;
}
</style>
```
:::

## API

### das-virtual-scroll

| 参数       | 说明     | 类型                       | 可选值 | 默认值 | 版本 |
| ---------- | -------- | -------------------------- | ------ | ------ | ---- |
| items      | 数据数组 | `{id: string \| number}[]` |        |        |
| itemHeight | 单行高度 | `number`                   |        | 30     |

### 事件

| 事件名称 | 说明           | 回调参数                          |
| -------- | -------------- | --------------------------------- |
| scroll   | 列表滚动时触发 | `event: Event`                    |

### 插槽

| 插槽名  | 说明           | 作用域参数                        |
| ------- | -------------- | --------------------------------- |
| default | 列表项内容模板 | `{ item: ListItem, index: number }`

### 注意事项
- 列表项高度（itemHeight）需要是固定值，组件会根据这个值计算可视区域
- 为了保证滚动性能，建议避免在列表项中放置过于复杂的内容
- 如果需要处理动态高度的列表项，建议使用其他替代方案
