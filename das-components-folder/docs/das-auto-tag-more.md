# das-auto-tag-more 组件使用说明

## 概述

根据宽度自适应显示标签组件（常用语表格中）

## 基础用法

:::demo

```vue
<template>
    <das-table
        id="autoTagMoreTableId"
        ref="tableRef"
        row-key="id"
        :fetch="fetch"
        :columns="columns"
        :scroll="{ x:'max-content', y: 'max-content' }"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'tag1'">
                <das-auto-tag-more tags="text" :tagGap="8" :moreGap="4" />
            </template>
            <template v-if="column.dataIndex === 'tag2'">
                <das-auto-tag-more
                    tags="text"
                    :tagGap="16"
                    :moreGap="8"
                    @click="(tag) => alert(`点击了${tag}`)"
                    @close="(tag) => alert(`关闭了$${tag}`)"
                />
            </template>
        </template>
    </das-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { DASTable, DASTableColumnsType, DASTableFetch } from 'das-component-vue';

const tableRef = ref<InstanceType<typeof DASTable> | null>(null);
const columns = ref<DASTableColumnsType>([
    {
        title: '标签列1',
        dataIndex: 'tag1',
        width: 200,
        resizable: true,
    },
    {
        title: '标签列2',
        dataIndex: 'tag2',
        width: 200,
        resizable: true,
    },
]);

const fetch: DASTableFetch = (params) => {
    return Promise.resolve({
        dataSource: [
            {
                id: 1,
                tag1: ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg'],
            },
            {
                id: 2,
                tag1: ['啊啊啊', '不不不', '猜猜猜', '点点滴滴', '呃呃呃呃', '反反复复', '嘎嘎嘎嘎'],
            },
        ],
        total: 2,
    });
};
</script>
```

:::

## API

### das-auto-tag-more

| 属性名             | 类型                     | 默认值     | 是否必填  | 描述                                                                  |
|-------------------|-------------------------|-----------|----------|----------------------------------------------------------------------|
| tags              | `String[]``Number[]`    | -         | 是        | 标签内容。                                                            |
| tagGap            | `Number`                | 8         | 否        | 标签之前的间距。                                                       |
| iconGap           | `Number`                | 4         | 否        | 标签和更多之间的间距。                                                  |

## 事件

| 属性名             | 类型                     | 默认值     | 是否必填  | 描述                                                                  |
|-------------------|-------------------------|-----------|----------|----------------------------------------------------------------------|
| click             | `(tag: DASTag) => void`  | -         | 否        | 点击标签的回掉函数。                                                    |
| close             | `(tag: DASTa) => void`   | -         | 否        | 关闭标签的回掉函数。                                                    |
