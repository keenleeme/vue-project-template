<ComponentInfo developer="郑思慧" date="2025-7-15" />

# das-transfer 穿梭框组件

## 组件说明

Transfer 穿梭框组件是一个功能强大的左右布局数据选择器，支持树形和表格两种数据源模式。组件提供了灵活的目标区域展示方式（表格、列表、标签），内置搜索、分页、禁用、权重排序等功能，适用于复杂的数据选择场景。

## 何时使用

- 需要从大量数据中选择特定项目时
- 需要展示层级结构数据并进行选择时
- 需要支持搜索、分页的数据选择场景
- 需要直观展示已选项目的场景
- 需要批量数据操作的管理界面
- 需要对已选项目进行权重排序的场景

## 交互演示 {style="color:#ff47a3"}

通过编辑 JSON 配置，实时预览组件效果。可以动态调整组件的各项配置，直观地查看效果。支持树形选择和表格选择两种模式。

:::demo

```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <div style="height: 400px">
      <das-transfer
        v-model:selected-keys="config.selectedKeys"
        :mode="config.mode"
        :data-source="config.dataSource"
        :target-items="config.targetItems"
        :columns="config.columns"
        :target-columns="config.targetColumns"
        :target-type="config.targetType"
        :source-title="config.sourceTitle"
        :target-title="config.targetTitle"
        :show-search="config.showSearch"
        :page-size="config.pageSize"
        :disable="config.disable"
        :tree-props="config.treeProps"
        :table-props="config.tableProps"
        @change="onChange"
      />
    </div>
  </JsonEditor>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { basicConfig as initConfig } from 'Comp/transfer/mock/config';

  const onChange = (keys: any[], items: any[]) => {
    console.log('Transfer 变化:', { keys, items });
  };
</script>
```

:::

## 代码演示

### 表格到列表

表格模式下，数据源为表格数据，目标区域以列表形式展示选中的数据。

:::demo

```vue
<template>
  <das-transfer
    v-model:target-items="selectedItems"
    style="height: 400px"
    mode="table"
    target-type="list"
    row-key="id"
    source-title="员工列表"
    target-title="已选员工"
    :data-source="dataSource"
    :columns="tableColumns"
    :total="total"
    :target-render="targetRender"
    :pagination-config="{
      pageSize: currentPageSize,
      current: currentPage
    }"
    @pagination-change="handleTableChange"
    @change="handleSelectedChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = [
  {
    id: 'emp001',
    name: '张三',
    age: 28,
    department: '技术部',
    position: '高级前端工程师',
  },
  { id: 'emp002', name: '李四', age: 25, department: '技术部', position: '前端工程师' },
  { id: 'emp003', name: '张三', age: 30, department: '产品部', position: '产品经理' },
  { id: 'emp004', name: '王五', age: 27, department: '运营部', position: '运营专员' },
  { id: 'emp005', name: '李四', age: 24, department: '市场部', position: '市场助理' },
  {
    id: 'emp006',
    name: '赵六',
    age: 32,
    department: '财务部',
    position: '财务分析师',
  },
];

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const targetRender = (item) => {
  return `${item.name} (${item.department})`;
};
// 表格选择面板状态
const selectedItems = ref([]);

// 分页状态
const total = computed(() => mockData.length);
const currentPage = ref(1);
const currentPageSize = ref(10);


// 计算属性：根据分页获取当前页数据
const dataSource = computed(() => {
  const startIndex = (currentPage.value - 1) * currentPageSize.value;
  const endIndex = startIndex + currentPageSize.value;
  return mockData.slice(startIndex, endIndex);
});

// 事件处理
const handleTableChange = (current, pageSize) => {
  currentPage.value = current;
  if (pageSize) {
    currentPageSize.value = pageSize;
  }
};

const handleSelectedChange = (keys, items) => {
  console.log('Table Local Pagination - Selected keys:', keys);
  console.log('Table Local Pagination - Selected items:', items);
};
</script>
```

:::

### 表格到标签

表格模式下，目标区域以标签形式展示选中的数据。

:::demo

```vue
<template>
  <das-transfer
    v-model:target-items="selectedItems"
    style="height: 400px"
    mode="table"
    target-type="tag"
    row-key="id"
    :data-source="dataSource"
    :columns="tableColumns"
    :total="total"
    :target-render="targetRender"
    :pagination-config="{
      pageSize: currentPageSize,
      current: currentPage
    }"
    @pagination-change="handleTableChange"
    @change="handleSelectedChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = [
  {
    id: 'emp001',
    name: '张三',
    age: 28,
    department: '技术部',
    position: '高级前端工程师',
  },
  { id: 'emp002', name: '李四', age: 25, department: '技术部', position: '前端工程师' },
  { id: 'emp003', name: '张三', age: 30, department: '产品部', position: '产品经理' },
  { id: 'emp004', name: '王五', age: 27, department: '运营部', position: '运营专员' },
  { id: 'emp005', name: '李四', age: 24, department: '市场部', position: '市场助理' },
  {
    id: 'emp006',
    name: '赵六',
    age: 32,
    department: '财务部',
    position: '财务分析师',
  },
];

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const targetRender = (item) => {
  return `${item.name} (${item.department})`;
};
// 表格选择面板状态
const selectedItems = ref([]);

// 分页状态
const total = computed(() => mockData.length);
const currentPage = ref(1);
const currentPageSize = ref(10);


// 计算属性：根据分页获取当前页数据
const dataSource = computed(() => {
  const startIndex = (currentPage.value - 1) * currentPageSize.value;
  const endIndex = startIndex + currentPageSize.value;
  return mockData.slice(startIndex, endIndex);
});

// 事件处理
const handleTableChange = (current, pageSize) => {
  currentPage.value = current;
  if (pageSize) {
    currentPageSize.value = pageSize;
  }
};

const handleSelectedChange = (keys, items) => {
  console.log('Table Local Pagination - Selected keys:', keys);
  console.log('Table Local Pagination - Selected items:', items);
};
</script>
```

:::

### 表格选择多功能展示

表格模式下支持搜索功能和分页。

:::demo

```vue
<template>
  <das-transfer
    v-model:target-items="selectedItems"
    style="height: 460px"
    mode="table"
    target-type="list"
    row-key="id"
    source-title="员工列表"
    target-title="已选员工"
    show-search
    :data-source="dataSource"
    :columns="tableColumns"
    :total="total"
    :page-size="10"
    :target-render="targetRender"
    :pagination-config="{
      pageSize: currentPageSize,
      current: currentPage
    }"
    :target-search-function="targetSearchFunction"
    @pagination-change="handleTableChange"
    @change="handleSelectedChange"
    @search="search"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = [
  {
    id: 'emp001',
    name: '张三',
    age: 28,
    department: '技术部',
    position: '高级前端工程师',
  },
  { id: 'emp002', name: '李四', age: 25, department: '技术部', position: '前端工程师' },
  { id: 'emp003', name: '张三', age: 30, department: '产品部', position: '产品经理' },
  { id: 'emp004', name: '王五', age: 27, department: '运营部', position: '运营专员' },
  { id: 'emp005', name: '李四', age: 24, department: '市场部', position: '市场助理' },
  {
    id: 'emp006',
    name: '赵六',
    age: 32,
    department: '财务部',
    position: '财务分析师',
  },
];

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const targetRender = (item) => {
  return `${item.name}`;
};

const targetSearchFunction = (row, keyword) => {
  return row.name.includes(keyword)
}
// 表格选择面板状态
const selectedItems = ref([]);

// 分页状态
const total = computed(() => mockData.length);
const currentPage = ref(1);
const currentPageSize = ref(10);

const searchData = ref(mockData);
const search = (value) => {
  currentPage.value = 1;
  searchData.value = JSON.parse(JSON.stringify(mockData)).filter((item) => item.name.includes(value));
};

// 计算属性：根据分页获取当前页数据
const dataSource = computed(() => {
  const startIndex = (currentPage.value - 1) * currentPageSize.value;
  const endIndex = startIndex + currentPageSize.value;
  return searchData.value.slice(startIndex, endIndex);
});


// 事件处理
const handleTableChange = (current, pageSize) => {
  currentPage.value = current;
  if (pageSize) {
    currentPageSize.value = pageSize;
  }
};

const handleSelectedChange = (keys, items) => {
  console.log('Table Local Pagination - Selected keys:', keys);
  console.log('Table Local Pagination - Selected items:', items);
};
</script>
```

:::

### 表格选择支持查询条件自定义

通过自定义搜索slot实现复杂的查询条件。

:::demo

```vue
<template>
  <das-transfer
    v-model:target-items="selectedItems"
    style="height: 500px"
    mode="table"
    target-type="list"
    row-key="id"
    source-title="员工列表"
    target-title="已选员工"
    show-search
    :data-source="dataSource"
    :columns="tableColumns"
    :total="total"
    :page-size="10"
    :target-render="targetRender"
    :pagination-config="{
      pageSize: currentPageSize,
      current: currentPage
    }"
    @pagination-change="handleTableChange"
    @change="handleSelectedChange"
  >
    <template #search>
      <a-form :colon="false" :label-col="{ span: 4 }" @submit="handleSearch">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="部门">
              <a-input v-model:value="searchParam.department" placeholder="请输入部门"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职位">
              <a-input v-model:value="searchParam.position" placeholder="请输入职位"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row justify="end">
          <a-button type="primary" @click="handleSearch" style="margin-right: 8px;">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-row>
      </a-form>
    </template>
  </das-transfer>
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = [
  {
    id: 'emp001',
    name: '张三',
    age: 28,
    department: '技术部',
    position: '高级前端工程师',
  },
  { id: 'emp002', name: '李四', age: 25, department: '技术部', position: '前端工程师' },
  { id: 'emp003', name: '张三', age: 30, department: '产品部', position: '产品经理' },
  { id: 'emp004', name: '王五', age: 27, department: '运营部', position: '运营专员' },
  { id: 'emp005', name: '李四', age: 24, department: '市场部', position: '市场助理' },
  {
    id: 'emp006',
    name: '赵六',
    age: 32,
    department: '财务部',
    position: '财务分析师',
  },
];

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const targetRender = (item) => {
  return `${item.name}`;
};
// 表格选择面板状态
const selectedItems = ref([]);

// 分页状态
const total = computed(() => mockData.length);
const currentPage = ref(1);
const currentPageSize = ref(10);

// 查询参数
const searchParam = ref({});
const searchData = ref(mockData);
const handleSearch = () => {
  currentPage.value = 1;
  const { department, position } = searchParam.value;
  searchData.value = mockData.filter((item) => item.department.includes(department) && item.position.includes(position));
};

const handleReset = () => {
  searchParam.value = {
    department: '',
    position: ''
  }
  handleSearch();
}

// 计算属性：根据分页获取当前页数据
const dataSource = computed(() => {
  const startIndex = (currentPage.value - 1) * currentPageSize.value;
  const endIndex = startIndex + currentPageSize.value;
  return searchData.value.slice(startIndex, endIndex);
});

// 事件处理
const handleTableChange = (current, pageSize) => {
  currentPage.value = current;
  if (pageSize) {
    currentPageSize.value = pageSize;
  }
};

const handleSelectedChange = (keys, items) => {
  console.log('Table Local Pagination - Selected keys:', keys);
  console.log('Table Local Pagination - Selected items:', items);
};
</script>
```

:::


### 树形到标签

树形模式下，数据源为树形数据，目标区域以标签形式展示选中的数据。

:::demo

```vue
<template>
  <das-transfer
    style="height: 400px"
    v-model:selected-keys="selectedKeys"
    mode="tree"
    :data-source="treeData"
    target-type="tag"
    source-title="组织架构"
    target-title="已选人员"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedKeys = ref([]);

const treeData = ref([
  {
    key: '1',
    title: '技术部',
    children: [
      {
        key: '1-1',
        title: '前端组',
        children: [
          { key: '1-1-1', title: '张三', position: '高级前端工程师', department: '技术部' },
          { key: '1-1-2', title: '李四', position: '前端工程师', department: '技术部' }
        ]
      },
      {
        key: '1-2',
        title: '后端组',
        children: [
          { key: '1-2-1', title: '王五', position: 'Java工程师', department: '技术部' },
          { key: '1-2-2', title: '赵六', position: 'Python工程师', department: '技术部' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '产品部',
    children: [
      { key: '2-1', title: '钱七', position: '产品经理', department: '产品部' },
      { key: '2-2', title: '孙八', position: 'UI设计师', department: '产品部' }
    ]
  }
]);

const handleChange = (keys, items) => {
  console.log('树形到标签变化:', { keys, items });
};
</script>
```

:::

### 树形到列表

树形模式下，目标区域以列表形式展示选中的数据。

:::demo

```vue
<template>
  <das-transfer
    style="height: 400px"
    v-model:selected-keys="selectedKeys"
    mode="tree"
    :data-source="treeData"
    target-type="list"
    source-title="组织架构"
    target-title="已选人员"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedKeys = ref([]);

const treeData = ref([
  {
    key: '1',
    title: '技术部',
    children: [
      {
        key: '1-1',
        title: '前端组',
        children: [
          { key: '1-1-1', title: '张三', position: '高级前端工程师', department: '技术部' },
          { key: '1-1-2', title: '李四', position: '前端工程师', department: '技术部' }
        ]
      },
      {
        key: '1-2',
        title: '后端组',
        children: [
          { key: '1-2-1', title: '王五', position: 'Java工程师', department: '技术部' },
          { key: '1-2-2', title: '赵六', position: 'Python工程师', department: '技术部' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '产品部',
    children: [
      { key: '2-1', title: '钱七', position: '产品经理', department: '产品部' },
      { key: '2-2', title: '孙八', position: 'UI设计师', department: '产品部' }
    ]
  }
]);

const handleChange = (keys, items) => {
  console.log('树形到标签变化:', { keys, items });
};
</script>
```

:::


### 树形到表格

树形模式下，目标区域以表格形式展示选中的数据。

:::demo

```vue
<template>
  <das-transfer
    style="height: 400px"
    v-model:selected-keys="selectedKeys"
    mode="tree"
    :data-source="treeData"
    target-type="table"
    :target-columns="targetTableColumns"
    source-title="组织架构"
    target-title="已选人员"
    :page-size="10"
    @change="handleChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedKeys = ref([]);

const treeData = ref([
  {
    key: '1',
    title: '技术部',
    children: [
      {
        key: '1-1',
        title: '前端组',
        children: [
          { key: '1-1-1', title: '张三', position: '高级前端工程师', department: '技术部' },
          { key: '1-1-2', title: '李四', position: '前端工程师', department: '技术部' }
        ]
      },
      {
        key: '1-2',
        title: '后端组',
        children: [
          { key: '1-2-1', title: '王五', position: 'Java工程师', department: '技术部' },
          { key: '1-2-2', title: '赵六', position: 'Python工程师', department: '技术部' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '产品部',
    children: [
      { key: '2-1', title: '钱七', position: '产品经理', department: '产品部' },
      { key: '2-2', title: '孙八', position: 'UI设计师', department: '产品部' }
    ]
  }
]);

const targetTableColumns = [
  {
    title: '姓名',
    dataIndex: 'title',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const handleChange = (keys, items) => {
  console.log('树形到标签变化:', { keys, items });
};
</script>
```

:::


### 树形搜索功能

展示树形模式下的高级搜索功能。

:::demo

```vue
<template>
  <das-transfer
    style="height: 400px"
    v-model:selected-keys="selectedKeys"
    mode="tree"
    :data-source="treeData"
    target-type="list"
    source-title="组织架构"
    target-title="已选人员"
    show-search
    @change="handleChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedKeys = ref([]);

const treeData = ref([
  {
    key: '1',
    title: '技术部',
    children: [
      {
        key: '1-1',
        title: '前端组',
        children: [
          { key: '1-1-1', title: '张三', position: '高级前端工程师', department: '技术部' },
          { key: '1-1-2', title: '李四', position: '前端工程师', department: '技术部' }
        ]
      },
      {
        key: '1-2',
        title: '后端组',
        children: [
          { key: '1-2-1', title: '王五', position: 'Java工程师', department: '技术部' },
          { key: '1-2-2', title: '赵六', position: 'Python工程师', department: '技术部' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '产品部',
    children: [
      { key: '2-1', title: '钱七', position: '产品经理', department: '产品部' },
      { key: '2-2', title: '孙八', position: 'UI设计师', department: '产品部' }
    ]
  }
]);

const handleChange = (keys, items) => {
  console.log('树形到标签变化:', { keys, items });
};
</script>
```

:::


### 列表排序功能

当目标类型为列表时，支持权重排序功能。

:::demo

```vue
<template>
  <das-transfer
    v-model:target-items="selectedItems"
    style="height: 400px"
    mode="table"
    target-type="list"
    :list-sort="true"
    row-key="id"
    source-title="员工列表"
    target-title="已选员工"
    :data-source="dataSource"
    :columns="tableColumns"
    :total="total"
    :target-render="targetRender"
    :pagination-config="{
      pageSize: currentPageSize,
      current: currentPage
    }"
    @pagination-change="handleTableChange"
    @change="handleSelectedChange"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

// 模拟数据
const mockData = [
  {
    id: 'emp001',
    name: '张三',
    age: 28,
    department: '技术部',
    position: '高级前端工程师',
  },
  { id: 'emp002', name: '李四', age: 25, department: '技术部', position: '前端工程师' },
  { id: 'emp003', name: '张三', age: 30, department: '产品部', position: '产品经理' },
  { id: 'emp004', name: '王五', age: 27, department: '运营部', position: '运营专员' },
  { id: 'emp005', name: '李四', age: 24, department: '市场部', position: '市场助理' },
  {
    id: 'emp006',
    name: '赵六',
    age: 32,
    department: '财务部',
    position: '财务分析师',
  },
];

const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
];

const targetRender = (item) => {
  return `${item.name} (${item.department})`;
};
// 表格选择面板状态
const selectedItems = ref([]);

// 分页状态
const total = computed(() => mockData.length);
const currentPage = ref(1);
const currentPageSize = ref(10);


// 计算属性：根据分页获取当前页数据
const dataSource = computed(() => {
  const startIndex = (currentPage.value - 1) * currentPageSize.value;
  const endIndex = startIndex + currentPageSize.value;
  return mockData.slice(startIndex, endIndex);
});

// 事件处理
const handleTableChange = (current, pageSize) => {
  currentPage.value = current;
  if (pageSize) {
    currentPageSize.value = pageSize;
  }
};

const handleSelectedChange = (keys, items) => {
  console.log('Table Local Pagination - Selected keys:', keys);
  console.log('Table Local Pagination - Selected items:', items);
};
</script>
```

:::




## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 组件模式 | `'tree' \| 'table'` | - |
| dataSource | 数据源 | `TreeNode[] \| any[]` | - |
| selectedKeys(v-model) | 选中的keys | `(string \| number)[]` | [] |
| targetItems(v-model) | 目标区域数据（表格模式必填） | `any[]` | - |
| targetType | 目标区域类型 | `'table' \| 'list' \| 'tag'` | - |
| rowKey | 行key的取值 | `string \| ((record: any) => string \| number)` | 'key' |
| sourceTitle | 选择区域标题 | `string` | '可选项' |
| targetTitle | 已选区域标题 | `string` | '已选项' |
| showSearch | 是否显示搜索框 | `boolean` | false |
| pageSize | 目标区域分页大小 | `number` | - |
| disable | 是否禁用 | `boolean` | false |
| targetRender | 目标区域自定义渲染函数 | `(item: any) => string` | - |
| targetSearchFunction | 目标区域自定义搜索函数 | `(item: any, keyword: string) => boolean` | - |
| listSort | 是否启用列表权重排序功能（仅targetType为list时有效） | `boolean` | false |

#### Tree模式特有 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| targetColumns | 目标区域表格列配置（targetType为table时使用） | `TableColumnProps[]` | - |
| treeProps | 树形组件属性 | `TreeProps` | - |
| sourceSearchFunction | 源区域自定义搜索函数 | `(item: any, keyword: string) => boolean` | - |

#### Table模式特有 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `TableColumnProps[]` | - |
| tableProps | 表格属性 | `TableProps` | - |
| paginationConfig | 分页配置 | `{ current: number; pageSize: number }` | - |
| total | 数据总数 | `number` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选择变化时触发 | `(keys: (string \| number)[], items: any[]) => void` |
| search | 搜索时触发 | `(value: string) => void` |
| paginationChange | 分页变化时触发（表格模式） | `(current: number, pageSize: number) => void` |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| title | 自定义标题内容（树形模式） | `{ title: string }` |
| search | 自定义搜索框（表格模式） | - |

### TreeNode 数据结构

```typescript
interface TreeNode {
  key: string | number;
  title?: string;
  label?: string;
  children?: TreeNode[];
  [key: string]: any; // 其他自定义属性
}
```

## 常见问题

### 1. 如何自定义搜索逻辑？

可以通过 `sourceSearchFunction` 和 `targetSearchFunction` 属性自定义搜索逻辑：

```vue
<template>
  <das-transfer
    :source-search-function="customSourceSearch"
    :target-search-function="customTargetSearch"
    <!-- 其他属性 -->
  />
</template>

<script setup>
const customSourceSearch = (item, keyword) => {
  // 自定义源区域搜索逻辑
  return item.title.toLowerCase().includes(keyword.toLowerCase()) ||
         item.department?.toLowerCase().includes(keyword.toLowerCase());
};

const customTargetSearch = (item, keyword) => {
  // 自定义目标区域搜索逻辑
  return item.name.toLowerCase().includes(keyword.toLowerCase());
};
</script>
```

### 2. 表格模式下如何处理分页？

表格模式支持两种分页方式：

**前端分页（一次性加载所有数据）：**
```vue
<script setup>
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allData.slice(start, start + pageSize.value);
});
</script>
```

**后端分页（按需加载数据）：**
```vue
<template>
  <das-transfer
    :data-source="currentPageData"
    :pagination-config="{ current: currentPage, pageSize: pageSize }"
    :total="total"
    @pagination-change="handlePaginationChange"
  />
</template>

<script setup>
const handlePaginationChange = async (current, size) => {
  // 请求新的数据页
  const response = await fetchData({ page: current, size });
  currentPageData.value = response.data;
};
</script>
```

### 3. 如何自定义目标区域的显示内容？

使用 `targetRender` 属性可以自定义目标区域的显示内容：

```vue
<template>
  <das-transfer
    :target-render="customTargetRender"
    <!-- 其他属性 -->
  />
</template>

<script setup>
const customTargetRender = (item) => {
  return `${item.name} (${item.department})`;
};
</script>
```

### 4. 树形数据如何只选择叶子节点？

组件默认只会选择叶子节点（没有children的节点），父节点仅用于展示层级结构，不会被选中。

### 5. 如何禁用特定的选择功能？

使用 `disable` 属性可以禁用整个组件的交互功能，包括：
- 树形选择器的选择功能
- 表格行选择
- 目标区域的删除操作

### 6. 如何使用权重排序功能？

启用 `listSort` 属性后，目标区域的列表项会显示权重输入框，支持以下功能：

```vue
<template>
  <das-transfer
    :list-sort="true"
    target-type="list"
    <!-- 其他属性 -->
  />
</template>

<script setup>
</script>
```

**权重排序特性：**
- 权重值范围：0-999
- 自动排序：按权重从高到低排序
- 实时更新：权重变化时立即重新排序

## 注意事项

1. **数据格式**：树形数据必须符合 `TreeNode` 接口规范，表格数据需要包含唯一的 `key` 字段
2. **表格模式限制**：表格选择模式（`mode="table"`）不支持 `target-type="table"`，只支持 `list` 和 `tag` 两种目标展示类型
3. **权重排序限制**：`listSort` 功能仅在 `target-type="list"` 时生效，不支持表格和标签模式
4. **权重数据持久化**：组件内部会自动为选中项添加 `weight` 属性，如需持久化权重数据，请在初始数据中处理