<template>
  <div class="table-wrap">
    <div v-if="showTabs" class="tabs">
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane key="1" tab="Tab 1">默认选项</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" disabled>已选选项</a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">默认选项</a-tab-pane>
      </a-tabs>
    </div>

    <!-- 列表内容直接嵌入 -->
    <div class="table-content">
      <das-search-bar
        class="search-bar"
        :model="searchForm"
        :columns="4"
        :expandable="true"
        @search="handleSearch"
        @reset="handleReset"
      >
        <a-form-item label="输入框文本" name="name">
          <a-input v-model:value="searchForm.name" placeholder="请输入" />
        </a-form-item>

        <a-form-item label="选择器" name="sex">
          <a-select v-model:value="searchForm.sex" placeholder="请选择" :options="sexOptions" />
        </a-form-item>

        <a-form-item label="日期范围" name="dateRange">
          <a-range-picker v-model:value="searchForm.dateRange" :placeholder="['开始时间', '结束时间']" />
        </a-form-item>

        <!-- 额外造一些筛选项（示例数据） -->
        <a-form-item label="所属部门" name="dept">
          <a-select v-model:value="searchForm.dept" :options="deptOptions" allow-clear placeholder="请选择部门" />
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-select v-model:value="searchForm.status" :options="statusOptions" allow-clear placeholder="请选择状态" />
        </a-form-item>

        <a-form-item label="等级" name="level">
          <a-select v-model:value="searchForm.level" :options="levelOptions" allow-clear placeholder="请选择等级" />
        </a-form-item>

        <a-form-item label="创建日期" name="createdAt">
          <a-date-picker v-model:value="searchForm.createdAt" style="width: 100%" placeholder="请选择日期" />
        </a-form-item>

        <a-form-item label="关键词2" name="keyword2">
          <a-input v-model:value="searchForm.keyword2" placeholder="请输入关键词" />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="searchForm.tags"
            mode="multiple"
            :options="tagOptions"
            allow-clear
            placeholder="请选择标签"
          />
        </a-form-item>

        <a-form-item label="最小值" name="minVal">
          <a-input-number v-model:value="searchForm.minVal" :min="0" style="width: 100%" placeholder="请输入数值" />
        </a-form-item>

        <a-form-item label="仅显示启用" name="enabled">
          <a-switch v-model:checked="searchForm.enabled" />
        </a-form-item>
      </das-search-bar>

      <das-table
        class="table-box"
        :columns="columns"
        :dataSource="data"
        :rowKey="'key'"
        :current="1"
        :total="data.length"
        @change="onChange"
        :bordered="false"
      >
        <!-- 操作栏插槽 -->
        <template #operate>
          <a-button @click="add" type="primary">
            <template #icon>
              <PlusOutlined />
            </template>
            新建
          </a-button>
          <a-button>导出</a-button>
          <a-button>重点关注</a-button>
          <a-button>取消关注</a-button>
        </template>

        <!-- 自定义单元格内容 -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a class="brand-link">
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
      </das-table>
    </div>

    <!-- 新增抽屉 -->
    <a-drawer v-model:open="drawerVisible" title="新增项目" placement="right" :width="600" @close="handleDrawerClose">
      <div class="drawer-content">
        <a-form :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" layout="horizontal">
          <a-form-item label="项目名称" name="name" :rules="[{ required: true, message: '请输入项目名称' }]">
            <a-input v-model:value="formData.name" placeholder="请输入项目名称" />
          </a-form-item>

          <a-form-item label="所属组织" name="organization" :rules="[{ required: true, message: '请选择所属组织' }]">
            <a-select v-model:value="formData.organization" placeholder="请选择所属组织" :options="deptOptions" />
          </a-form-item>

          <a-form-item label="项目等级" name="level" :rules="[{ required: true, message: '请选择项目等级' }]">
            <a-select v-model:value="formData.level" placeholder="请选择项目等级" :options="levelOptions" />
          </a-form-item>

          <a-form-item label="项目标签" name="tags">
            <a-select
              v-model:value="formData.tags"
              mode="multiple"
              placeholder="请选择项目标签"
              :options="tagOptions"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="项目描述" name="description">
            <a-textarea v-model:value="formData.description" placeholder="请输入项目描述" :rows="4" />
          </a-form-item>

          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="formData.status">
              <a-radio value="enabled">启用</a-radio>
              <a-radio value="disabled">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <a-button @click="handleDrawerClose">取消</a-button>
          <a-button type="primary" @click="handleSubmit">确定</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType, TableProps } from 'ant-design-vue';

  type TableDataType = {
    key: string;
    name: string;
    age: string;
    tags: string[];
  };

  const showTabs = ref(false);
  const activeKey = ref('1');

  // 抽屉相关
  const drawerVisible = ref(false);
  const formData = reactive({
    name: '',
    organization: '',
    level: '',
    tags: [],
    description: '',
    status: 'enabled'
  });

  // 搜索表单数据
  const searchForm = reactive({
    name: '',
    sex: '1',
    dateRange: undefined,
    dept: undefined,
    status: undefined,
    level: undefined,
    createdAt: undefined,
    keyword2: '',
    tags: [],
    minVal: undefined,
    enabled: false
  });

  // 性别选项
  const sexOptions = [
    {
      label: '选择项1',
      value: '1'
    },
    {
      label: '选择项2',
      value: '2'
    }
  ];

  // 额外筛选选项（示例数据）
  const deptOptions = [
    { label: '根组织', value: 'root' },
    { label: '科信部门', value: 'it' },
    { label: '监管部门', value: 'gov' },
    { label: '其他组织', value: 'other' }
  ];
  const statusOptions = [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' }
  ];
  const levelOptions = [
    { label: '高', value: 'high' },
    { label: '中', value: 'mid' },
    { label: '低', value: 'low' }
  ];
  const tagOptions = [
    { label: '重要资产', value: 'important' },
    { label: '核心资产', value: 'core' },
    { label: '外部系统', value: 'external' }
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

  function add() {
    drawerVisible.value = true;
  }

  // 关闭抽屉
  const handleDrawerClose = () => {
    drawerVisible.value = false;
    // 重置表单
    Object.assign(formData, {
      name: '',
      organization: '',
      level: '',
      tags: [],
      description: '',
      status: 'enabled'
    });
  };

  // 提交表单
  const handleSubmit = () => {
    console.log('提交表单数据:', formData);
    // 这里可以调用API保存数据
    // 保存成功后关闭抽屉
    handleDrawerClose();
  };
</script>

<style lang="less" scoped>
  .table-wrap {
    .table-content {
      background: var(--color-bg-container);
      margin: 16px;
      // padding: 24px 16px;
      .search-bar {
        padding: 0 16px;
      }
      .link {
        padding: 0;
        margin-right: 20px;
        color: var(--color-brand-normal) !important;
        text-decoration: none;
        &:hover {
          color: var(--color-brand-active) !important;
          text-decoration: none;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .brand-link {
      color: var(--color-brand-normal) !important;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        color: var(--color-brand-active) !important;
        text-decoration: none;
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
    /* 统一去除 a-button link 模式的下划线并应用品牌色 */
    :deep(.ant-btn-link) {
      color: var(--color-brand-normal) !important;
      text-decoration: none !important;
    }
    :deep(.ant-btn-link:hover),
    :deep(.ant-btn-link:focus) {
      color: var(--color-brand-active) !important;
      text-decoration: none !important;
    }
    :deep(.ant-btn-link a),
    :deep(.ant-btn-link span),
    :deep(.ant-btn-link *) {
      text-decoration: none !important;
    }
  }

  /* 抽屉样式 */
  .drawer-content {
    padding: 24px 0;
  }

  .drawer-footer {
    text-align: right;
    padding: 16px 0;
    // border-top: 1px solid var(--color-component-stroke);

    .ant-btn {
      margin-left: 8px;
    }
  }
</style>
