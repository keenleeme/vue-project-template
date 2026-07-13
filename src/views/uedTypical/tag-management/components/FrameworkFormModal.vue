<template>
  <a-modal
    :open="open"
    :title="isEdit ? '编辑框架' : '新建框架'"
    width="560px"
    :confirm-loading="submitting"
    ok-text="保存"
    cancel-text="取消"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="分类分级框架名称" name="name">
        <a-input v-model:value="formState.name" allow-clear placeholder="请输入框架名称" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formState.description"
          :rows="4"
          allow-clear
          placeholder="请输入框架描述"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import type { FrameworkRow } from '../types';

  const props = defineProps<{
    open: boolean;
    record?: FrameworkRow | null;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    success: [payload: Partial<FrameworkRow> & { name: string }];
  }>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const formState = reactive({
    name: '',
    description: ''
  });

  const isEdit = computed(() => Boolean(props.record?.id));

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入框架名称', trigger: 'blur' }]
  };

  watch(
    () => props.open,
    (visible) => {
      if (!visible) return;
      formState.name = props.record?.name || '';
      formState.description = props.record?.description || '';
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
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      emit('success', {
        id: props.record?.id,
        name: formState.name,
        description: formState.description,
        source: props.record?.source || '自定义',
        createdAt: props.record?.createdAt || now,
        updatedAt: now
      });
      message.success(isEdit.value ? '编辑成功' : '新建成功');
      emit('update:open', false);
    }, 300);
  }
</script>
