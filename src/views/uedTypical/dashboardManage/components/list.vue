<template>
  <div class="table-wrap">
    <das-table
      class="table-box"
      :columns="sortStatus ? [...sortColumns, ...columns] : columns"
      :data-source="data"
      :row-key="'id'"
      :current="1"
      :total="data.length"
      :row-selection="{ selectedRowKeys: selectedRows.map((row) => row.key), onChange: onSelectionChange }"
      @change="onChange"
      :bordered="false"
    >
      <template #operate="{ rowSelection }">
        <a-button type="primary" @click="add" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinZengYiBiaoPan') }}
        </a-button>
        <a-button class="mr-8" :disabled="selectedRows.length === 0" @click="moveTo">{{
          $t('I18N.layout.yiDongDao')
        }}</a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button :disabled="rowSelection.length === 0"> {{ $t('I18N.layout.shanChu') }} </a-button>
      </template>
      <template #shortcut>
        <a-input-search
          class="mr-8 input"
          v-model:value="searchKey"
          :placeholder="$t('I18N.layout.qingShuRuYeMianDiZhi')"
          @search="onSearch"
        />
        <a-button class="mr-8">
          <template #icon>
            <ImportOutlined />
          </template>
        </a-button>
        <a-button class="mr-8">
          <template #icon>
            <SettingOutlined />
          </template>
        </a-button>
        <a-button :class="{ 'sort-btn': true, 'active-btn': sortStatus }" @click="setSortStatus(!sortStatus)">
          <template #icon>
            <MoreOutlined />
            <MoreOutlined />
          </template>
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a>
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-switch v-model:checked="record.status" :disabled="record.disabled" />
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button class="link" :disabled="record.disabled" type="link">{{ $t('I18N.layout.xiangQing') }}</a-button>
          <a-button class="link" :disabled="record.disabled" type="link">{{ $t('I18N.common.delete') }}</a-button>
          <a-button class="link" :disabled="record.disabled" type="link" @click="moveTo">{{
            $t('I18N.layout.yiDongDao')
          }}</a-button>
        </template>
      </template>
    </das-table>
  </div>
  <a-modal
    v-model:open="dialogVisible"
    :title="$t('I18N.layout.daoRu')"
    @ok="dialogVisible = false"
    @cancel="dialogVisible = false"
  >
    <div>
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="true"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        @change="handleChange"
      >
        <p class="exp-drag-icon">
          <UploadOutlined />
        </p>
        <p class="explain-text">
          <span class="click-btn">{{ $t('I18N.layout.dianJiShangChuan') }}</span
          >&nbsp;&nbsp;/ &nbsp;&nbsp;{{ $t('I18N.layout.tuoZhuaiDaoCiQuYu') }}
        </p>
      </a-upload-dragger>
      <p class="explain">{{ $t('I18N.layout.zhiChiGeShiWenJian') }}</p>
    </div>
  </a-modal>

  <a-modal
    v-model:open="dialogMoveVisible"
    :title="$t('I18N.layout.yiDongDao')"
    @ok="handleMoveConfirm"
    @cancel="handleMoveCancel"
  >
    <a-form ref="ruleForm" :model="form" layout="horizontal">
      <a-form-item :label="$t('I18N.layout.guaZaiFenZu')" name="group">
        <a-select v-model:value="form.group" :placeholder="$t('I18N.layout.guaZaiFenZu')">
          <a-select-option v-for="item in mountGroups" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { PlusOutlined, SettingOutlined, ImportOutlined, UploadOutlined, MoreOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { TableColumnType, TableProps, UploadChangeParam, UploadFile } from 'ant-design-vue';

  type TableDataType = {
    key: string;
    name: string;
    desc: string;
    group: string;
    status: boolean;
    rowDrag: boolean;
    disabled: boolean;
    createTime: string;
    updateTime: string;
  };

  const searchKey = ref('');

  const dialogVisible = ref(false);
  const dialogMoveVisible = ref(false);
  const selectedRows = ref<TableDataType[]>([]);

  const sortStatus = ref(false);

  const form = ref({
    group: ''
  });

  const fileList = ref<UploadFile[]>([]);

  // 挂载分组选项数据
  const mountGroups = ref([
    { id: '1', name: '仪表盘' },
    { id: '2', name: '可视化大屏' },
    { id: '3', name: '可视化拓扑' },
    { id: '4', name: '通用典型页面' }
  ]);

  const sortColumns: TableColumnType<TableDataType>[] = [
    {
      title: '',
      dataIndex: 'rowDrag',
      width: 48
    }
  ];

  const columns: TableColumnType<TableDataType>[] = [
    {
      title: I18N.layout.yiBiaoPanMingCheng,
      dataIndex: 'name'
    },
    {
      title: I18N.layout.yiBiaoPanMiaoShu,
      dataIndex: 'desc'
    },
    {
      title: I18N.layout.guaZaiFenZu,
      dataIndex: 'group'
    },
    {
      title: I18N.layout.qiYongZhuangTai,
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: I18N.layout.chuangJianShiJian,
      dataIndex: 'createTime'
    },
    {
      title: I18N.layout.gengXingeShiJian,
      dataIndex: 'updateTime'
    },
    {
      title: I18N.layout.caoZuo,
      dataIndex: 'operation',
      width: 210,
      key: 'operation'
    }
  ];

  const data: TableDataType[] = [
    {
      key: '1',
      name: '仪表盘A',
      desc: '仪表盘',
      group: '仪表盘',
      status: true,
      rowDrag: true,
      disabled: true,
      createTime: '2021-09-01 10:00:00',
      updateTime: '2021-09-01 10:00:00'
    },
    {
      key: '2',
      name: '仪表盘B',
      desc: '可视化大屏',
      group: '可视化大屏',
      status: true,
      rowDrag: true,
      disabled: false,
      createTime: '2021-09-01 10:00:00',
      updateTime: '2021-09-01 10:00:00'
    },
    {
      key: '3',
      name: '仪表盘C',
      desc: '可视化拓扑',
      group: '可视化拓扑',
      status: true,
      rowDrag: true,
      disabled: false,
      createTime: '2021-09-01 10:00:00',
      updateTime: '2021-09-01 10:00:00'
    },
    {
      key: '4',
      name: '仪表盘D',
      desc: '通用页面',
      group: '通用页面',
      status: false,
      rowDrag: true,
      disabled: false,
      createTime: '2021-09-01 10:00:00',
      updateTime: '2021-09-01 10:00:00'
    }
  ];
  const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  const onSelectionChange = (_selectedRowKeys: string[], selectedRowsData: TableDataType[]) => {
    selectedRows.value = selectedRowsData;
    console.log('选中的行:', selectedRowsData);
  };

  const handleChange = (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  };

  function add() {
    dialogVisible.value = true;
  }

  function moveTo() {
    dialogMoveVisible.value = true;
  }

  function handleMoveConfirm() {
    if (!form.value.group) {
      message.error('请选择挂载分组');
      return;
    }

    if (selectedRows.value.length === 0) {
      message.error('请选择要移动的仪表盘');
      return;
    }

    // 找到选中的挂载分组名称
    const selectedGroup = mountGroups.value.find((item) => item.id === form.value.group);
    if (selectedGroup) {
      const dashboardNames = selectedRows.value.map((row) => row.name).join('、');
      message.success(`已将 ${dashboardNames} 移动到 ${selectedGroup.name}`);
      console.log('移动到分组:', selectedGroup.name, '仪表盘:', selectedRows.value);
    }

    // 重置表单并关闭弹框
    form.value.group = '';
    selectedRows.value = [];
    dialogMoveVisible.value = false;
  }

  function handleMoveCancel() {
    // 重置表单并关闭弹框
    form.value.group = '';
    selectedRows.value = [];
    dialogMoveVisible.value = false;
  }

  function setSortStatus(status) {
    sortStatus.value = status;
  }
</script>

<style lang="less" scoped>
  .table-wrap {
    background: var(--color-bg-container);
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
    margin: 0 16px;
    .right {
      display: flex;
      justify-content: flex-end;
      flex: 1;
      .input {
        width: 240px;
      }
      .sort-btn {
        .anticon-more {
          position: relative;
          left: -8px;
          width: 0;
        }
      }
      .active-btn {
        color: var(--color-brand-normal) !important;
        background-color: var(--color-brand-light) !important;
        border-color: var(--color-brand-active) !important;
        .anticon {
          color: var(--color-brand-active) !important;
        }
      }
    }
  }
  .table-box {
    padding: 16px;
  }
  .modal-wrap {
    .anticon {
      font-size: var(--font-size-xl) !important;
      margin: 16px 0 0;
    }
    :deep(.ant-upload-wrapper) {
      background: var(--color-bg-container);
      margin-top: 16px;
    }
    .explain-text {
      font-size: var(--font-size-small);
    }
    .click-btn {
      color: var(--color-brand-normal);
    }
  }
  .explain {
    font-size: var(--font-size-small);
    color: var(--color-text-placeholder);
    line-height: 20px;
    margin-top: 16px;
  }
</style>
