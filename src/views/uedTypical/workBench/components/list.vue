<template>
  <div class="table-wrap">
    <das-table
      :columns="columns"
      :data-source="data"
      :row-key="'key'"
      :selection="true"
      :refresh-intervals="[5, 10, 20]"
      :total="data.length"
      :current="1"
      @change="onChange"
      @select="onSelect"
      @column-change="columnChange"
      :bordered="false"
    >
      <!-- 操作栏插槽 -->
      <template #operate="{ rowSelection }">
        <a-button type="primary" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinJian') }}
        </a-button>
        <a-button class="mr-8" :disabled="rowSelection.length === 0"> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button class="mr-8" :disabled="rowSelection.length === 0">
          {{ $t('I18N.layout.zhongDianGuanZhu') }}
        </a-button>
        <a-button :disabled="rowSelection.length === 0"> {{ $t('I18N.layout.quXiaoGuanZhu') }} </a-button>
        <span v-if="rowSelection.length > 0" class="selection-info"> 已选择 {{ rowSelection.length }} 项 </span>
      </template>

      <!-- 快捷查询插槽 -->
      <template #shortcut>
        <a-input style="width: 200px" v-model:value="searchKeyword" placeholder="请输入关键字" @change="handleSearch" />
      </template>

      <!-- 自定义单元格内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a @click="handleViewDetail(record)">
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <span>
            <a-tag v-for="tag in record.tags" :key="tag" :color="getTagColor(tag)">
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button class="link" type="link" @click="handleViewDetail(record)">
            {{ $t('I18N.layout.xiangQing') }}
          </a-button>
          <a-button class="link" type="link" @click="handleDelete(record)">
            {{ $t('I18N.common.delete') }}
          </a-button>
        </template>
      </template>
    </das-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

  // 搜索关键词
  const searchKeyword = ref('');

  // 表格列配置 - 使用das-table增强功能
  const columns: any[] = [
    {
      title: I18N.layout.xiangMuMingCheng,
      key: 'name',
      width: 200,
      // ellipsis: true,
      disabled: true, // 固定显示列
      resizable: true
    },
    {
      title: I18N.layout.suoShuZuZhi,
      dataIndex: 'age',
      width: 150,
      ellipsis: true,
      resizable: true
    },
    {
      title: I18N.layout.suoShuLeiBie,
      key: 'tags',
      width: 200
      // ellipsis: true
    },
    {
      title: I18N.layout.caoZuo,
      key: 'operation',
      width: 150,
      fixed: 'right'
    }
  ];

  // 原始数据
  const originalData: TableDataType[] = [
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

  // 根据搜索关键词过滤数据
  const data = computed(() => {
    if (!searchKeyword.value) {
      return originalData;
    }
    return originalData.filter(
      (item) =>
        item.name.includes(searchKeyword.value) ||
        item.age.includes(searchKeyword.value) ||
        item.tags.some((tag) => tag.includes(searchKeyword.value))
    );
  });

  // 表格变化事件
  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log('表格查询:', { pagination, filters, sorter });
  };

  // 选择行事件
  const onSelect = (selectedRowKeys: string[], selectedRows: TableDataType[]) => {
    console.log('选择项:', { selectedRowKeys, selectedRows });
  };

  // 列配置变化事件
  const columnChange = (columns: TableColumnType<TableDataType>[]) => {
    console.log('列设置:', columns);
  };

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索关键词:', searchKeyword.value);
  };

  // 查看详情
  const handleViewDetail = (record: TableDataType) => {
    console.log('查看详情:', record);
    // 这里可以添加跳转到详情页的逻辑
  };

  // 删除处理
  const handleDelete = (record: TableDataType) => {
    console.log('删除:', record);
    // 这里可以添加删除确认和删除逻辑
  };

  // 获取标签颜色
  const getTagColor = (tag: string) => {
    if (tag === '重要资产') return 'red';
    if (tag === '核心资产') return 'blue';
    return 'green';
  };
</script>

<style lang="less" scoped>
  .table-wrap {
    background: var(--color-bg-container);
    padding: 16px;
    margin: 16px;

    .link {
      padding: 0;
      margin-right: 28px;
      &:last-child {
        margin-right: 0;
      }
    }

    .mr-8 {
      margin-right: 8px;
    }

    .selection-info {
      margin-left: 16px;
      color: var(--color-text-secondary);
      font-size: 14px;
    }
  }
</style>
