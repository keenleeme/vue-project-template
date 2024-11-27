<template>
  <div class="table-wrap">
    <SearchComponent :is-reset="true" :initial-values="initialValues" :form-items="formItems"></SearchComponent>
    <div class="operation-wrap">
      <div class="left">
        <a-button type="primary" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinJian') }}
        </a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.zhongDianGuanZhu') }} </a-button>
        <a-button> {{ $t('I18N.layout.quXiaoGuanZhu') }} </a-button>
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
          <a-button class="link" type="link">{{ $t('I18N.layout.xiangQing') }}</a-button>
          <a-button class="link" type="link">{{ $t('I18N.common.delete') }}</a-button>
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

  const initialValues = {
    name: '',
    sex: '1',
    dateRange: undefined
  };

  const formItems = [
    {
      label: I18N.layout.shuRuKuangWenBen,
      prop: 'name',
      type: 'input'
    },
    {
      label: I18N.layout.xuanZeQi,
      props: 'sex',
      type: 'select',
      options: [
        {
          label: I18N.layout.xuanZeXiang1,
          value: '1'
        },
        {
          label: I18N.layout.xuanZeXiang2,
          value: '2'
        }
      ]
    },
    // {
    //   label: I18N.layout.riQi,
    //   prop: 'date',
    //   type: 'date',
    //   placeholder: I18N.layout.qingXuanZe,
    // },
    {
      label: I18N.layout.riQiFanWei,
      prop: 'dateRange',
      type: 'daterange',
      startPlaceholder: I18N.layout.kaiShiShiJian,
      endPlaceholder: I18N.layout.jieShuShiJian
    }
  ];

  const columns: TableColumnType<TableDataType>[] = [
    {
      title: I18N.layout.xiangMuMingCheng,
      dataIndex: 'name'
    },
    {
      title: I18N.layout.suoShuZuZhi,
      dataIndex: 'age'
    },
    {
      title: I18N.layout.suoShuLeiBie,
      dataIndex: 'tags',
      key: 'tags'
    },
    {
      title: I18N.layout.caoZuo,
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
    background: var(--color-bg-container);
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
