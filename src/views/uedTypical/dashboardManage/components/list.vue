<template>
  <div class="table-wrap">
    <das-table
      class="table-box"
      :columns="columns"
      :dataSource="data"
      :rowKey="'key'"
      :selection="true"
      :current="1"
      :total="data?.length || 0"
      @change="onChange"
      :bordered="false"
    >
      <template #operate="{ rowSelection, rowSelectionData }">
        <a-button type="primary" @click="add">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t('I18N.layout.xinZengYiBiaoPan') }}
        </a-button>
        <a-button :disabled="rowSelection.length === 0" @click="moveToFromSlot(rowSelectionData)">{{
          $t('I18N.layout.yiDongDao')
        }}</a-button>
        <a-button> {{ $t('I18N.layout.daoChu') }} </a-button>
        <a-button :disabled="rowSelection.length === 0"> {{ $t('I18N.layout.shanChu') }} </a-button>
      </template>
      <template #shortcut>
        <a-input style="width: 200px" v-model:value="searchKey" placeholder="请输入关键字" @change="handleSearch" />
        <a-tooltip placement="top" title="导入">
          <a-button style="padding: 2px">
            <template #icon>
              <i class="zq-icon zq-icon-import"></i>
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top" title="设置">
          <a-button style="padding: 2px">
            <template #icon>
              <i class="zq-icon zq-icon-setting"></i>
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top" title="排序">
          <a-button
            :class="{ 'sort-btn': true, 'active-btn': sortStatus }"
            @click="setSortStatus(!sortStatus)"
            style="padding: 2px"
          >
            <template #icon>
              <i class="zq-icon zq-icon-move"></i>
            </template>
          </a-button>
        </a-tooltip>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'rowDrag'">
          <div
            v-if="sortStatus"
            class="drag-handle"
            draggable="true"
            @dragstart="handleDragStart($event, record, index)"
            @dragover.prevent="handleDragOver"
            @drop.prevent="handleDrop($event, record, index)"
            @dragenter.prevent
          >
            <i class="zq-icon zq-icon-move" style="cursor: move; color: #999"></i>
          </div>
          <div v-else style="width: 48px; height: 20px"></div>
        </template>
        <template v-else-if="column.key === 'name'">
          <a class="brand-link">
            {{ record.name }}
          </a>
        </template>
        <template v-else-if="column.key === 'status'">
          <span @click.stop @mousedown.stop>
            <a-switch
              :checked="statusMap[record.key]"
              :disabled="record.disabled"
              @update:checked="(val) => (statusMap[record.key] = val)"
            />
          </span>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button class="link" :disabled="record.disabled" type="link">{{ $t('I18N.layout.xiangQing') }}</a-button>
          <a-button class="link" :disabled="record.disabled" type="link">{{ $t('I18N.common.delete') }}</a-button>
          <a-button class="link" :disabled="record.disabled" type="link" @click="moveToSingle(record)">{{
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
          <i class="zq-icon zq-icon-export" style="font-size: 32px; font-weight: 500"></i>
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
  import { computed, ref, reactive } from 'vue';
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
      key: 'rowDrag',
      width: 48,
      align: 'center'
    }
  ];

  const columns: TableColumnType<TableDataType>[] = [
    {
      title: '',
      dataIndex: 'rowDrag',
      key: 'rowDrag',
      width: 48,
      align: 'center'
    },
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

  // 原始数据 - 改为响应式
  const originalData = ref<TableDataType[]>([
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
  ]);

  // 根据搜索关键词过滤数据
  const data = computed(() => {
    if (!searchKey.value) {
      return originalData.value;
    }
    return originalData.value.filter(
      (item) =>
        item.name.includes(searchKey.value) ||
        item.desc.includes(searchKey.value) ||
        item.group.includes(searchKey.value)
    );
  });

  // 将开关状态从行数据中剥离，避免切换时触发行整行重渲染
  const statusMap = reactive<Record<string, boolean>>({});
  originalData.value.forEach((item) => {
    statusMap[item.key] = item.status;
  });
  const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  };

  const onSearch = (value: string) => {
    console.log(value);
  };

  // 搜索处理
  const handleSearch = () => {
    console.log('搜索关键词:', searchKey.value);
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
    if (selectedRows.value.length === 0) {
      message.error('请先选择要移动的仪表盘');
      return;
    }
    dialogMoveVisible.value = true;
  }

  function moveToFromSlot(rowSelectionData: TableDataType[]) {
    console.log('从插槽获取的选中数据:', rowSelectionData);
    if (!rowSelectionData || rowSelectionData.length === 0) {
      message.error('请先选择要移动的仪表盘');
      return;
    }
    // 更新 selectedRows 以便在确认函数中使用
    selectedRows.value = rowSelectionData;
    dialogMoveVisible.value = true;
  }

  function moveToSingle(record: TableDataType) {
    // 设置当前选中的记录
    selectedRows.value = [record];
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

      // 更新原始数据中的分组信息
      selectedRows.value.forEach((selectedRow) => {
        const dataItem = originalData.value.find((item) => item.key === selectedRow.key);
        if (dataItem) {
          dataItem.group = selectedGroup.name;
        }
      });

      message.success(`已将 ${dashboardNames} 移动到 ${selectedGroup.name}`);
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

  // 已改为使用 v-model 即时同步展示，无需额外处理函数

  function setSortStatus(status) {
    console.log('切换排序状态:', status);
    sortStatus.value = status;
  }

  // 拖拽相关变量
  let draggedIndex: number = -1;

  // 拖拽开始
  function handleDragStart(event: DragEvent, record: TableDataType, index: number) {
    draggedIndex = index;
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/html', record.key);
    console.log('开始拖拽:', record.name, '索引:', index);
  }

  // 拖拽悬停
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  // 拖拽放置
  function handleDrop(event: DragEvent, targetRecord: TableDataType, targetIndex: number) {
    event.preventDefault();

    if (draggedIndex === -1 || draggedIndex === targetIndex) {
      return;
    }

    console.log('拖拽放置:', draggedIndex, '->', targetIndex);

    // 获取当前显示的数据（可能是过滤后的）
    const currentData = [...data.value];

    // 重新排序当前显示的数据
    const [draggedElement] = currentData.splice(draggedIndex, 1);
    currentData.splice(targetIndex, 0, draggedElement);

    // 更新响应式数据
    originalData.value = currentData;

    console.log('拖拽排序完成:', draggedElement.name, '->', targetRecord.name);
    console.log(
      '新的数据顺序:',
      originalData.value.map((item) => item.name)
    );

    draggedIndex = -1;
  }
</script>

<style lang="less" scoped>
  .table-wrap {
    background: var(--color-bg-container);
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
  /* 减少/禁用开关动画，避免视觉延迟 */
  :deep(.ant-switch) {
    transition: none !important;
  }
  :deep(.ant-switch .ant-switch-handle) {
    transition: none !important;
  }
  :deep(.ant-switch .ant-switch-inner) {
    transition: none !important;
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
    padding: 0 16px 16px;
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

  /* 拖拽相关样式 */
  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 4px;

    &:hover {
      background-color: var(--color-fill-tertiary);
      border-radius: 4px;
    }

    i {
      font-size: 14px;
      transition: color 0.2s;
    }

    &:hover i {
      color: var(--color-text-secondary) !important;
    }
  }

  /* 拖拽时的行样式 */
  :deep(.ant-table-tbody > tr[draggable='true']:hover) {
    background-color: var(--color-fill-quaternary);
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
</style>
