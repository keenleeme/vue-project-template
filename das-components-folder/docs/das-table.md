<ComponentInfo developer="刘广庆" date="2024-03-29" />

# das-table 表格组件

## 组件说明

表格组件是一个功能强大的数据展示组件，支持自定义刷新、一键折叠、表格尺寸、列设置等功能。组件集成了操作栏和快捷操作功能，提供了灵活的数据展示和交互能力。

## 何时使用

- 需要展示结构化数据时
- 需要支持表格数据的选择、排序、筛选等操作时
- 需要展示带有展开行的复杂数据时
- 需要自定义表格头部和单元格内容时

## 交互演示 {style="color:#ff47a3"}

通过编辑 JSON 配置，实时预览组件效果。可以动态调整组件的各项配置，直观地查看效果。

:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-table
      :columns="config.columns"
      row-key="cid"
      size="small"
      :getCheckboxProps="getCheckboxProps"
      :data-source="config.dataSource"
      :refreshIntervals="config.refreshIntervals"
      :selection="config.selection"
      @change="onChange"
      @select="onSelect"
      @columnChange="columnChange"
    >
    </das-table>
  </JsonEditor>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { basicConfig as initConfig } from 'Comp/table/mock/config';

  const name = ref('');
  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log('表格查询:', { pagination, filters, sorter });
  };
  const onSelect = (selectedRowKeys: any, selectedRows: any) => {
    console.log('选择项:', { selectedRowKeys, selectedRows });
  };
  const columnChange = (columns: any) => {
    console.log('列设置:', columns);
  };
  
  function getCheckboxProps(record: any) {
    return {
      disabled: record.cid === 2
    };
  }
</script>
```

:::

## 表格插槽

- 操作项插槽
- 快捷查询插槽<span style="color: red">（使用\<a-form-item>会自动纳入高级筛选，可通过col属性配置占用列数，默认为1，支持设置为1或2）</span>
- 自定义表头插槽
- 单元格内容插槽

:::demo

```vue
<template>
  <das-table
    ref="slotTableRef"
    :columns="columns"
    :data-source="dataSource"
    :row-key="'id'"
    :current="1"
    :hideTool="hideTool"
    :total="2"
    >
      <template #operate="{ rowSelection, rowSelectionData }">
        <a-button type="primary">新增</a-button>
        <a-button :disabled="rowSelection.length === 0">删除</a-button>
        <a-button :disabled="rowSelection.length === 0" @click="rmSelection">移除选中项</a-button>
        <span>{{ (rowSelectionData.map(ite => ite.name) || []).join('、') }}</span>
      </template>
      <template #shortcut>
        <a-input style="width: 160px" v-model:value="queryForm.name1" placeholder="请输入关键字"></a-input>
        <a-button @click="changeTool">{{hideTool ? '显示' : '隐藏'}}工具栏</a-button>
        <a-form-item label="姓名" name="name2">
          <a-input v-model:value="queryForm.name" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="年龄" name="age">
          <a-input v-model:value="queryForm.age" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="关键字" name="keyword">
          <a-input v-model:value="queryForm.keyword" placeholder="请输入" ></a-input>
        </a-form-item>
        <a-form-item label="地址" name="address" :col="2">
          <a-input v-model:value="queryForm.address" placeholder="请输入" ></a-input>
        </a-form-item>
      </template>
      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span :style="{ color: 'red' }"> {{ column.title }} </span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <div v-if="column.dataIndex === 'age'">
          <span :style="{ color: record.age >= 18 ? 'red' : '' }">{{ record.age }}</span>
        </div>
      </template>
   </das-table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const queryForm = ref({});
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const dataSource = ref([
    {
      id: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      id: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
  ]);

  const hideTool = ref(false)
  function changeTool() {
    hideTool.value = !hideTool.value
  }
  const slotTableRef = ref(null);
  function rmSelection() {
    slotTableRef.value.selection = [];
  }
</script>
```

:::



## 动态参数

- 自定义刷新周期<span style="color: #999">（默认：无） （单位：分钟）</span>
- 列设置固定展示项<span style="color: #999">（columns[item]: disbaled: true）</span>
- 隐藏多选框<span style="color: #999">（默认：显示）</span>
- 隐藏分页<span style="color: #999">（默认：显示）</span>

:::demo

```vue
<template>
  <das-table
    storageKey="localStorage"
    :columns="columns"
    :data-source="dataSource"
    :selection="false"
    :pagination="false"
    :row-key="'id'"
    :current="1"
    :scroll="{x: 1000}"
    :total="2"
    :refreshIntervals="[20, 30, 40]"
    >
      <template #operate="{ rowSelection }">
        <div style="font-size: 14px">字段1-3左浮动，字段4固定显示，字段15右浮动</div>
      </template>
   </das-table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const columns = Array.from({ length: 15 }).map((_, index) => ({
    title: `字段-${index + 1}`,
    dataIndex: `name_${index}`,
    width: 100,
    disabled: index === 4,
    fixed: index === 14 ? 'right' : index < 3 ? 'left' : false,
    ellipsis: true,
    key: `name_${index}`,
  }))

  const dataSource = ref([
    {
      id: '1',
      name_0: '张三',
      name_1: '北京市朝阳区',
    },
    {
      id: '2',
      name_0: '李四',
      name_1: '北京市朝阳区',
    },
  ]);
</script>
```

:::

## 表格内容展开
:::demo

```vue
<template>
  <das-table
    :columns="columns"
    :data-source="dataSource"
    :selection="false"
    :row-key="'id'"
    :current="1"
    :total="2"
    :refreshIntervals="[20, 30, 40]"
    >
    <template #expand="{ record }">
        详情 {{ record.name }}
    </template>
   </das-table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const dataSource = ref([
    {
      id: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      id: '2',
      name: '李四',
      age: 42,
      address: '上海市浦东新区',
    },
  ]);
</script>
```

:::

## 表格吸附
:::demo

```vue
<template>
  <div style="height: 300px;overflow: auto">
    <das-table
        :columns="columns"
        :data-source="dataSource"
        :selection="false"
        :row-key="'id'"
        :sticky="true"
        :current="1"
        :total="2"
        >
    </das-table>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const dataSource = Array.from({ length: 10 }).map((_, index) => ({
    cid: index,
    name: `name-${index}`,
    age: 15 + index
  }));
</script>
```

:::


## 表格加载中
:::demo

```vue
<template>
 <a-button @click="loadingFn">加载</a-button>
    <das-table
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :selection="false"
        :row-key="'id'"
        :current="1"
        :total="2"
        @change="onChange"
        >
    </das-table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const loading = ref(false);
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  const dataSource = []
  const loadingFn = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log('表格查询:', { pagination, filters, sorter });
  };
</script>
```

:::

## 复杂场景使用
:::demo

```vue
<template>
    <das-table
        :loading="loading"
        :columns="columns"
        :data-source="dataSource"
        :selection="false"
        :row-key="'id'"
        :current="1"
        :scroll="{ x: 1800}"
        :total="dataSource.length"
        @change="onChange"
        >
        <template #operate="{ rowSelection }">
          <a-button type="primary">新增</a-button>
          <a-button :disabled="rowSelection.length === 0">删除</a-button>
        </template>
        <template #shortcut>
          <a-input style="width: 160px" v-model:value="name" placeholder="请输入关键字"></a-input>
        </template>
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            {{ column.title }}
            <a-tooltip :title="column.title">
              <ExclamationCircleOutlined style="margin-left: 4px;color: #666;" />
            </a-tooltip>
          </template>
        </template>
        <template #bodyCell="{ column, record, text }">
          <div v-if="column.dataIndex === 'money'">
            {{record.money}}
          </div>
          <div v-if="column.dataIndex === 'rich'">
            <div v-html="record.rich"></div>
          </div>
          <div v-if="column.dataIndex === 'tags'">
              <a-tag v-for="(ite, ind) in record.tags.slice(0, 2)" :key="ind" :bordered="false" color="processing">{{ite}}</a-tag>
              <a-popover v-if="record.tags.slice(2).length > 0">
                <template #content>
                  <p v-for="(ite, ind) in record.tags.slice(2)" style="width: 100px;">{{ite}}</p>
                </template>
                <a-tag :bordered="false" color="processing">+2</a-tag>
              </a-popover>
          </div>
          <div v-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">{{ record.status === 1 ? '成功' : '失败' }}</a-tag>
          </div>
          <div v-if="column.dataIndex === 'progess'">
            <a-progress :percent="record.progess" />
          </div>
          <div v-if="column.dataIndex === 'switch'">
            <a-popconfirm
              :title="`确定${record.switch ? '关闭' : '开启'}此选项吗?`"
              ok-text="是"
              cancel-text="否"
            >
              <a-switch :checked="record.switch" />
            </a-popconfirm>
          </div>
          <div v-if="column.dataIndex === 'address'">
            <div class="das-table-copybox">
              <div>{{ record.address }}</div>
              <div class="das-copy-iconbox">
                <a-tooltip title="复制">
                  <CopyOutlined/>
                </a-tooltip>
              </div>
            </div>
          </div>
          <div v-if="column.dataIndex === 'actions'">
            <DasButtonGroup
              type="row"
              align="left"
              :actions="rowActions"
            />
          </div>
        </template>
    </das-table>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ExclamationCircleOutlined, CopyOutlined } from '@ant-design/icons-vue';

  const name = ref('');
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      disabled: true,
      fixed: 'left',
      key: 'name',
      resizable: true,
      width: 100,
      maxWidth: 200,
      ellipsis: true,
    },
    {
      title: '筛选',
      dataIndex: 'age',
      width: 80,
      key: 'age',
      filters: [
        { text: '未成年', value: '<' },
        { text: '成年', value: '>' },
      ],
      onFilter: (value: string, record: any) => {
        if (value === '<') {
          return record.age < 18;
        }
        return record.age >= 18;
      }
    },
    {
      title: '富文本',
      dataIndex: 'rich',
      width: 180,
      key: 'rich',
    },
    {
      title: '标签组',
      dataIndex: 'tags',
      width: 180,
      key: 'tags',
    },
    {
      title: '进度',
      dataIndex: 'progess',
      width: 160,
      key: 'progess',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
      key: 'status',
    },
    {
      title: '金额',
      dataIndex: 'money',
      align:'right',
      width: 100,
      key: 'money',
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 200,
      ellipsis: true,
      key: 'path',
    },
    {
      title: '开关',
      dataIndex: 'switch',
      width: 60,
      key: 'switch',
    },
    {
      title: '复制',
      dataIndex: 'address',
      width: 120,
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      fixed: 'right',
      width: 250,
      key: 'actions',
    },
  ];
  const loading = ref(false)
  const dataSource = Array.from({ length: 6 }).map((_, index) => ({
    cid: index,
    name: `表格组件说明复杂场景文档模式-${index}`,
    money: `￥${(100 + index).toFixed(2)}`,
    createTime: '2025-04-01 00:00:00',
    path: `APATH > BPATH > CPATH`,
    tags: ['标签A', '标签B', '标签C', '标签D'],
    status: index % 2 === 0 ? 0 : 1,
    switch: index % 2 === 0,
    progess: 100 - index * 10,
    rich: 'alarmId <span style="color: rgb(64, 169, 255);">==</span> <span style="color: rgb(0, 0, 255);">"123123123"</span>',
    address: `address-${index}`,
    age: 15 + index
  }));
  const loadingFn = () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
  const onChange = (pagination: any, filters: any, sorter: any) => {
    loadingFn()
    console.log('filters', filters)
  };
  const rowActions = [
  {
    label: '编辑',
    action: 'edit'
  },
  {
    label: '删除',
    action: 'delete'
  },
  {
    label: '查看详情',
    action: 'view',
    isExternal: true
  },
  {
    label: '加白',
    action: 'whitelist',
    group: '标记'
  },
  {
    label: '加黑',
    action: 'blacklist',
    group: '标记'
  }
];
function switchFn() {

}
</script>
<style scoped>
.das-table-copybox {
  display: flex;
  justify-content: space-between;
}
.das-copy-iconbox {
  display: none;
}
.das-table-copybox:hover .das-copy-iconbox {
  display: block;
}
.das-copy-iconbox:hover path {
  cursor: pointer;
  fill: var(--sql--theme-active-color);
}
</style>
```

:::


## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否加载中 | `boolean` | false |
| bordered | 表格边框 | `boolean` | true |
| selection | 多选框 | `boolean` | true |
| columns | 列的配置 | `ColumnType[]` | - |
| dataSource | 数据数组 | `any[]` | - |
| size | 表格大小 | `string：(small \| middle \| large)` | middle |
| rowKey | 行 key 的取值 | `string \| ((record: any) => string)` | id |
| storageKey | 表头存储key | `string` | - |
| refreshIntervals | 刷新周期 | `array` | [5, 10, 20] |
| scroll | 滚动配置(如果有width属性，scroll会自动计算) | `{x:number, y: number}` | - |
| pagination | 分页器是否显示 | `boolean` | true |
| pageSizeOptions | 分页器配置 | `string[]` | ['10', '20', '50', '100'] |
| current | 当前页<span style="color: #ff7875">（不传：内部分页）</span> | `number` | 1 |
| sticky | 固定表头 | `	boolean \| {offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}` | false |
| pageSize | 当前页展示行数 | `number` | 10 |
| total | 总条数 | `number` | 0 |
| hideTool | 隐藏工具栏 | `boolean` | false |
| tools | 工具栏配置 | `array` | ['refresh', 'collapse', 'size', 'columns'] |
| hidePageTool | 隐藏分页器工具栏 | `boolean` | false |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 表格变化时的回调函数 | `(pagination: TablePaginationConfig, filters: any, sorter: any) => void` |
| select | 选择行时的回调函数 | `(pagination: TablePaginationConfig, filters: any, sorter: any) => void` |
| expand | 展开/收起行时的回调函数 | `(expanded: boolean, record: any) => void` |
| columnChange | 修改列配置后回调函数 | `(column: column[]) => void` |
| expandedRowsChange | 展开的行变化时的回调函数 | `(expandedRows: string[]) => void` |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| operate | 操作栏插槽 | `{ selectedRowKeys: string[], selectedRows: any[] }` |
| shortcut | 快捷操作插槽  [注意事项](/components/table.html#注意事项) | `{ selectedRowKeys: string[], selectedRows: any[] }` |
| headerCell | 自定义表头单元格 | `{ column: ColumnType }` |
| bodyCell | 自定义单元格 | `{ column: ColumnType, record: any, index: number }` |
| expand | 自定义展开行内容 | `{ record: any }` |

### Column

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | `string` | - |
| dataIndex | 列数据在数据项中对应的路径 | `string` | - |
| key | 列的唯一标识 | `string` | - |
| width | 列宽度 | `string\|number` | - |
| minWidth | 拖动列最小宽度，会受到表格自动调整分配宽度影响 | `number` | - |
| maxWidth | 拖动列最大宽度，会受到表格自动调整分配宽度影响 | `number` | - |
| resizable | 是否可拖动调整宽度，此时 width 必须是 number 类型 | `boolean` | - |
| fixed | 列是否固定，可选 true(等效于 left) 'left' 'right' | `boolean\|string` | false |
| disabled | 是否固定显示 | `false` | - |
| sorter | 排序函数 | `boolean \| ((a: any, b: any) => number)` | - |
| filters | 表头的筛选菜单项 | `{ text: string, value: string }[]` | - |
| onFilter | 本地模式下，确定筛选的运行函数 | `(value: string, record: any) => boolean` | - |

## 注意事项

1. 在快捷查询插槽`#shortcut`中使用`<a-form-item>`组件时，该查询项会自动纳入高级筛选中。
2. `<a-form-item>`组件支持通过`col`属性配置占用列数，默认值为1，仅支持设置为1或2。
3. 表格列`ellipsis`属性已重写，在tooltip基础上封装。
4. 自定义刷新周期 `refreshIntervals` 默认立即刷新，刷新周期单位：分钟。
4. 表格的表头、分页吸附 `sticky` 依赖于父容器的CSS属性。