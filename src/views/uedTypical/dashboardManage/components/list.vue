<template>
  <div class="table-wrap">
    <div class="operation-wrap">
      <div class="left">
        <a-button @click="add" type="primary" class="mr-8">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinZengYiBiaoPan') }}
        </a-button>
        <a-button class="mr-8" @click="moveTo">{{ $t('I18N.layout.yiDongDao') }}</a-button>
        <a-button class="mr-8"> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button> {{ $t('I18N.layout.shanChu') }} </a-button>
      </div>
      <div class="right">
        <a-input-search
          class="mr-8 input"
          v-model:value="searchKey"
          :placeholder="$t('I18N.layout.qingShuRuYeMianDiZhi')"
          @search="onSearch"
        />
        <a-button class="mr-8">
          <template #icon>
            <Icon>
              <svg
                width="14px"
                height="14px"
                viewBox="0 0 16 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>1.Base基础/3.Icon图标（通用）/操作/import</title>
                <g
                  id="1.Base基础/3.Icon图标（通用）/操作/import"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <rect
                    id="jump-(Background)"
                    fill="currentColor"
                    opacity="0"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                  ></rect>
                  <path
                    d="M7.5,2 L7.5,3 L3,3 L3,13 L13,13 L13,8.5 L14,8.5 L14,13 C13.9996424,13.2651072 13.8941717,13.5192537 13.7067127,13.7067127 C13.5192537,13.8941717 13.2651072,13.9996424 13,14 L3,14 C2.7348932,13.9996424 2.48074675,13.8941717 2.29328775,13.7067127 C2.10582875,13.5192537 2.00035717,13.2651072 2,13 L2,3 C2.00035717,2.7348932 2.10582875,2.48074675 2.29328775,2.29328775 C2.48074675,2.10582875 2.7348932,2.00035717 3,2 L7.5,2 Z M13.2930002,2 L14,2.70699978 L9.70699978,7 L13,7 L13,8 L8.5,8 C8.22385788,8 8,7.77614224 8,7.5 L8,3 L9,3 L9,6.29299998 L13.2930002,2 Z"
                    id="形状结合"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </Icon>
          </template>
        </a-button>
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
        <a-button :class="{ 'sort-btn': true, 'active-btn': sortStatus }" @click="setSortStatus(!sortStatus)">
          <template #icon>
            <MoreOutlined />
            <MoreOutlined />
          </template>
        </a-button>
      </div>
    </div>
    <a-table
      v-if="sortStatus"
      class="table-box"
      :columns="[...sortColumns, ...columns]"
      :data-source="data"
      :range-selection="false"
      @change="onChange"
    >
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
    </a-table>
    <a-table
      v-else
      class="table-box"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :range-selection="false"
      @change="onChange"
    >
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
    </a-table>
  </div>
  <a-modal
    v-model:open="dialogVisible"
    class="modal-wrap"
    :title="$t('I18N.layout.daoRu')"
    :centered="true"
    :closable="false"
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
    <template #footer>
      <a-button key="back" @click="dialogVisible = false">{{ $t('I18N.common.cancel') }}</a-button>
      <a-button key="submit" type="primary" @click="dialogVisible = false">{{ $t('I18N.layout.queRen') }}</a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:open="dialogMoveVisible"
    class="group-modal-wrap"
    :title="$t('I18N.layout.yiDongDao')"
    :centered="true"
    :closable="false"
  >
    <a-form ref="ruleForm" :model="form" label-position="top" :inline="true" label-width="110px">
      <a-form-item :label="$t('I18N.layout.guaZaiFenZu')" name="name">
        <a-select v-model:value="form.name" :placeholder="$t('I18N.layout.guaZaiFenZu')">
          <a-select-option v-for="item in []" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="dialogMoveVisible = false">{{ $t('I18N.common.cancel') }}</a-button>
      <a-button key="submit" type="primary" @click="dialogMoveVisible = false">{{ $t('I18N.layout.queRen') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import Icon, {
    PlusOutlined,
    SettingOutlined,
    FullscreenOutlined,
    ImportOutlined,
    UploadOutlined,
    MoreOutlined
  } from '@ant-design/icons-vue';
  import type { TableColumnType, TableProps } from 'ant-design-vue';

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

  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
  }

  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }

  const router = useRouter();

  const searchKey = ref('');

  const dialogVisible = ref(false);
  const dialogMoveVisible = ref(false);

  const sortStatus = ref(false);

  const form = ref({
    name: ''
  });

  const fileList = ref<FileItem[]>([]);

  const sortColumns: TableColumnType<TableDataType>[] = [
    {
      title: '',
      dataIndex: 'rowDrag',
      rowDrag: true,
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
      disabled: false,
      createTime: '2021-09-01 10:00:00',
      updateTime: '2021-09-01 10:00:00'
    }
  ];
  const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.disabled,
      name: record.name
    })
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  const handleChange = (info: FileInfo) => {
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
        color: #6e9efd !important;
        background-color: #c0d9ff !important;
        border-color: #0639c3 !important;
        .anticon {
          color: #0639c3 !important;
        }
      }
    }
  }
  .table-box {
    margin: 16px;
  }
  .modal-wrap {
    .anticon {
      font-size: 24px !important;
      margin: 16px 0 0;
    }
    :deep(.ant-upload-wrapper) {
      background: var(--color-bg-container);
      margin-top: 16px;
    }
    .explain-text {
      font-size: 12px;
    }
    .click-btn {
      color: var(--color-brand-normal);
    }
  }
  .explain {
    font-size: 12px;
    color: var(--color-text-placeholder);
    line-height: 20px;
    margin-top: 16px;
  }
</style>
