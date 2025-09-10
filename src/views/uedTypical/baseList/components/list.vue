<template>
  <div class="table-wrap">
    <das-search-bar :model="searchForm" :columns="4" :expandable="true" @search="handleSearch" @reset="handleReset">
      <a-form-item :label="$t('I18N.layout.shuRuKuangWenBen')" name="name">
        <a-input v-model:value="searchForm.name" :placeholder="$t('I18N.base_form.pleaseEnter')" />
      </a-form-item>

      <a-form-item :label="$t('I18N.layout.xuanZeQi')" name="sex">
        <a-select
          v-model:value="searchForm.sex"
          :placeholder="$t('I18N.base_form.pleaseChoose')"
          :options="sexOptions"
        />
      </a-form-item>

      <a-form-item :label="$t('I18N.layout.riQiFanWei')" name="dateRange">
        <a-range-picker
          v-model:value="searchForm.dateRange"
          :placeholder="[$t('I18N.layout.kaiShiShiJian'), $t('I18N.layout.jieShuShiJian')]"
        />
      </a-form-item>
    </das-search-bar>

    <das-table
      class="table-box"
      :columns="columns"
      :data-source="data"
      :row-key="'key'"
      :current="1"
      :total="data.length"
      @change="onChange"
      :bordered="false"
    >
      <!-- 操作栏插槽 -->
      <template #operate>
        <a-button @click="add" type="primary" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinJian') }}
        </a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.zhongDianGuanZhu') }} </a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.quXiaoGuanZhu') }} </a-button>
      </template>

      <!-- 自定义单元格内容 -->
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
    </das-table>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType, TableProps } from 'ant-design-vue';

  const { t } = useI18n();

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

  const router = useRouter();

  // 搜索表单数据
  const searchForm = reactive({
    name: '',
    sex: '1',
    dateRange: undefined
  });

  // 性别选项
  const sexOptions = [
    {
      label: t('I18N.layout.xuanZeXiang1'),
      value: '1'
    },
    {
      label: t('I18N.layout.xuanZeXiang2'),
      value: '2'
    }
  ];

  // 搜索处理函数
  const handleSearch = (values: any) => {
    console.log('搜索参数:', values);
    // 这里可以调用API进行搜索
  };

  // 重置处理函数
  const handleReset = (values: any) => {
    console.log('重置参数:', values);
    // 重置搜索条件
    Object.assign(searchForm, {
      name: '',
      sex: '1',
      dateRange: undefined
    });
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

  function add() {
    router.push({
      path: '/work-list/add'
    });
  }
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
    padding: 16px;
  }
</style>
