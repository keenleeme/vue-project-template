<template>
  <div class="table-wrap">
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
          <template #icon>
            <Icon>
              <template #component>
                <svg
                  data-v-4c45684f=""
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <g data-v-4c45684f="" fill="currentColor">
                    <rect data-v-4c45684f="" width="16" height="16" fill="currentColor" opacity="0"></rect>
                    <path
                      data-v-4c45684f=""
                      fill="currentColor"
                      fill-opacity=".9"
                      d="M8,1.2 L14.1,4.6 L14.1,11.4 L8,14.8 L1.9,11.4 L1.9,4.6 L8,1.2 Z M8,2.4 L2.9,5.2 L2.9,10.8 L8,13.6 L13.1,10.8 L13.1,5.2 L8,2.4 Z M8,5 C9.7,5 11,6.3 11,8 C11,9.7 9.7,11 8,11 C6.3,11 5,9.7 5,8 C5,6.3 6.3,5 8,5 Z M8,6 C6.9,6 6,6.9 6,8 C6,9.1 6.9,10 8,10 C9.1,10 10,9.1 10,8 C10,6.9 9.1,6 8,6 Z"
                    ></path>
                  </g>
                </svg>
              </template>
            </Icon>
          </template>
        </a-button>
        <a-button>
          <template #icon>
            <Icon>
              <template #component>
                <svg
                  data-v-4c45684f=""
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <g data-v-4c45684f="" fill="currentColor">
                    <rect data-v-4c45684f="" width="16" height="16" fill="currentColor" opacity="0"></rect>
                    <path
                      data-v-4c45684f=""
                      fill="currentColor"
                      fill-opacity=".9"
                      d="M3.5,4.2 L3.5,7 L2.5,7 L2.5,3 C2.5,2.7 2.7,2.5 3,2.5 L7,2.5 L7,3.5 L4.2,3.5 L7.3,6.6 L6.6,7.4 L3.5,4.2 Z M12.5,11.8 L12.5,9 L13.5,9 L13.5,13 C13.5,13.3 13.3,13.5 13,13.5 L9,13.5 L9,12.5 L11.8,12.5 L8.6,9.4 L9.3,8.7 L12.5,11.8 Z"
                    ></path>
                  </g>
                </svg>
              </template>
            </Icon>
          </template>
        </a-button>
      </div>
    </div>
    <a-table :columns="columns" :data-source="data" bordered @change="onChange">
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
  import { ref } from 'vue';
  import Icon, { HomeOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType, TableProps } from 'ant-design-vue';

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

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
    background: var(--primary-bg);
    padding: 16px;
    margin: 16px;
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
    margin-bottom: 16px;
  }
</style>
