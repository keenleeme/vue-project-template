<template>
  <div class="table-wrap">
    <SearchComponent :is-reset="true" :form-items="formItems"></SearchComponent>
    <div class="operation-wrap">
      <div class="left">
        <a-button type="primary" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button class="mr-8"> 导出 </a-button>
        <a-button class="mr-8"> 重点关注 </a-button>
        <a-button> 取消关注 </a-button>
      </div>
      <div class="right">
        <a-button class="mr-8">
          <template #icon><SettingOutlined /></template>
        </a-button>
        <a-button>
          <template #icon><FullscreenOutlined /></template>
        </a-button>
      </div>
    </div>
    <a-table class="table-box" :columns="columns" :data-source="data" bordered @change="onChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'cyan'"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button class="link" type="link">详情</a-button>
          <a-button class="link" type="link">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { PlusOutlined, SettingOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType, TableProps } from 'ant-design-vue';
  import SearchComponent from './search.vue';

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

  const formItems = [
    {
      label: '输入框文本',
      props: 'name',
      type: 'input'
    },
    {
      label: '选择器',
      props: 'sex',
      type: 'select',
      options: [
        {
          label: '选择项1',
          value: '1'
        },
        {
          label: '选择项2',
          value: '2'
        }
      ]
    },
    {
      label: '日期',
      props: 'date',
      type: 'date',
      placeholder: '请选择'
    },
    {
      label: '日期范围',
      props: 'dateRange',
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  ];

  const columns: TableColumnType<TableDataType>[] = [
    {
      title: '项目名称',
      dataIndex: 'name'
    },
    {
      title: '所属组织',
      dataIndex: 'age'
    },
    {
      title: '所属类别',
      dataIndex: 'tags',
      key: 'tags'
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'operation'
    }
  ];

  const data: TableDataType[] = [
    {
      key: '1',
      name: 'Opc网关系统',
      age: '根组织',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '2',
      name: '综合管理系统',
      age: '科信部门',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '3',
      name: '服务系统',
      age: '监管部门',
      tags: ['重要资产', '核心资产']
    },
    {
      key: '4',
      name: '其他系统',
      age: '其他组织',
      tags: ['重要资产', '核心资产']
    }
  ];
  const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  };
</script>

<style lang="less" scoped>
  .table-wrap {
    background: var(--primary-bg);
    margin: 16px;
    // padding: 24px 16px;
    .link {
      padding: 0;
      margin-right: 28px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .operation-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px;
  }
  .table-box {
    margin: 16px;
  }
</style>
