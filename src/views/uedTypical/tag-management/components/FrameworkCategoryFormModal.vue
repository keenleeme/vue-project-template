<template>
  <a-modal
    :open="open"
    :title="isEdit ? '编辑分类' : '新增分类'"
    width="560px"
    :confirm-loading="submitting"
    ok-text="确定"
    cancel-text="取消"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ style: { width: '90px' } }"
      :wrapper-col="{ span: 18 }"
      layout="horizontal"
    >
      <a-form-item label="分类名称" name="title" required>
        <a-input v-model:value="formState.title" allow-clear placeholder="请输入分类名称" />
      </a-form-item>
      <a-form-item label="上级分类" name="parentTitle">
        <a-input v-model:value="formState.parentTitle" disabled placeholder="请输入上级分类" />
      </a-form-item>
      <a-form-item label="分级" name="level">
        <a-select
          v-model:value="formState.level"
          :options="levelOptions"
          allow-clear
          placeholder="请选择分级"
        />
      </a-form-item>
      <a-form-item name="description">
        <template #label>
          <span class="description-label">
            <span>分类说明</span>
            <a-tooltip v-if="isEdit" title="AI阅读分类说明识别API的业务数据">
              <span class="ai-label-badge">AI</span>
            </a-tooltip>
          </span>
        </template>
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          allow-clear
          placeholder="请输入分类说明"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { levelOptions } from '../mock';
  import type { FrameworkTreeNode } from '../types';

  const props = defineProps<{
    open: boolean;
    mode: 'add' | 'edit';
    parentTitle?: string;
    node?: FrameworkTreeNode | null;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    success: [payload: { title: string; level?: string; description?: string }];
  }>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const formState = reactive({
    title: '',
    parentTitle: '',
    level: undefined as string | undefined,
    description: ''
  });

  const isEdit = computed(() => props.mode === 'edit');

  const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  };

  watch(
    () => props.open,
    (visible) => {
      if (!visible) return;
      formState.title = props.node?.title || '';
      formState.parentTitle = props.parentTitle || '';
      formState.level = props.node?.level;
      formState.description = props.node?.description || '';
    }
  );

  function handleCancel() {
    emit('update:open', false);
  }

  async function handleOk() {
    await formRef.value?.validate();
    submitting.value = true;
    setTimeout(() => {
      submitting.value = false;
      emit('success', {
        title: formState.title.trim(),
        level: formState.level,
        description: formState.description.trim()
      });
      message.success(isEdit.value ? '编辑成功' : '新增成功');
      emit('update:open', false);
    }, 200);
  }
</script>

<style lang="less" scoped>
  .description-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .ai-label-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 18px;
    padding: 0 5px;
    border-radius: 4px;
    background: linear-gradient(135deg, #722ed1 0%, #1677ff 100%);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    cursor: help;
  }
</style>
