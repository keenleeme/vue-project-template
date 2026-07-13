<template>
  <a-modal
    :open="open"
    :footer="null"
    width="720px"
    destroy-on-close
    class="framework-import-modal"
    @cancel="handleClose"
  >
    <template #title>
      <div class="import-modal__title">
        <span>{{ modalTitle }}</span>
        <a-button type="link" class="template-link" @click="handleDownloadTemplate">
          <DownloadOutlined />
          模板下载
        </a-button>
      </div>
    </template>

    <a-upload-dragger
      v-model:file-list="fileList"
      name="file"
      :multiple="false"
      accept=".xlsx,.xls"
      :before-upload="beforeUpload"
      @remove="handleRemove"
    >
      <p class="upload-icon">
        <FileExcelOutlined />
      </p>
      <p class="upload-text">
        <span class="upload-text__action">点击上传</span>
        <span class="upload-text__divider">或将文件拖拽到这里上传</span>
      </p>
      <p class="upload-hint">只支持Excel，上传内容会覆盖原有数据</p>
    </a-upload-dragger>

    <div class="import-modal__footer">
      <span class="import-modal__tip">若导入数据较多，导入成功后请手动刷新界面</span>
      <a-space>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" :loading="uploading" :disabled="!fileList.length" @click="handleConfirm">
          确定
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { UploadFile, UploadProps } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import type { FrameworkImportType } from '../types';

  const props = defineProps<{
    open: boolean;
    frameworkName?: string;
    importType?: FrameworkImportType;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    success: [];
  }>();

  const fileList = ref<UploadFile[]>([]);
  const uploading = ref(false);

  const importTypeLabel = computed(() =>
    props.importType === 'dataTag' ? '数据标签分类分级' : '框架分类分级'
  );

  const modalTitle = computed(() => `导入${importTypeLabel.value}`);

  watch(
    () => props.open,
    (visible) => {
      if (!visible) {
        fileList.value = [];
        uploading.value = false;
      }
    }
  );

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      /\.xlsx?$/i.test(file.name);
    if (!isExcel) {
      message.error('仅支持上传 Excel 文件');
      return false;
    }
    fileList.value = [file as UploadFile];
    return false;
  };

  function handleRemove() {
    fileList.value = [];
  }

  function handleDownloadTemplate() {
    message.success(`${importTypeLabel.value}模板下载已开始（演示）`);
  }

  function handleClose() {
    emit('update:open', false);
  }

  function handleConfirm() {
    if (!fileList.value.length) return;
    uploading.value = true;
    setTimeout(() => {
      uploading.value = false;
      const label = props.frameworkName ? `「${props.frameworkName}」` : '';
      message.success(`${label}${importTypeLabel.value}导入成功，请手动刷新界面查看最新数据`);
      emit('success');
      emit('update:open', false);
    }, 800);
  }
</script>

<style lang="less" scoped>
  .import-modal__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 24px);
    padding-right: 24px;
  }

  .template-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    height: auto;
    font-size: 13px;
  }

  .upload-icon {
    margin: 8px 0 16px;
    font-size: 48px;
    color: #52c41a;
    line-height: 1;
  }

  .upload-text {
    margin: 0 0 8px;
    font-size: 14px;
    color: #1f2a44;

    &__action {
      color: #1677ff;
      cursor: pointer;
    }

    &__divider {
      color: #4a5874;
    }
  }

  .upload-hint {
    margin: 0;
    font-size: 12px;
    color: #8c9ab3;
  }

  .import-modal__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .import-modal__tip {
    font-size: 12px;
    color: #8c9ab3;
  }

  :deep(.ant-upload-drag) {
    background: #fafbfd;
    border-color: #d9e2ef;
    border-radius: 8px;
  }
</style>
