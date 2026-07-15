<template>
  <a-modal
    :open="open"
    :title="isEdit ? '修改标签' : '新增标签'"
    width="560px"
    :confirm-loading="submitting"
    ok-text="保存"
    cancel-text="取消"
    destroy-on-close
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="标签名称" name="name">
        <a-input v-model:value="formState.name" allow-clear placeholder="请输入标签名称" />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-select
          v-model:value="formState.category"
          :options="categoryOptionList"
          allow-clear
          placeholder="请选择分类"
        />
      </a-form-item>
      <a-form-item label="分级" name="level">
        <a-select v-model:value="formState.level" :options="levelOptionList" allow-clear placeholder="请选择分级" />
      </a-form-item>
      <a-form-item label="是否敏感" name="sensitive">
        <a-select
          v-model:value="formState.sensitive"
          :options="sensitiveOptionList"
          allow-clear
          placeholder="请选择是否敏感"
        />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea v-model:value="formState.description" :rows="3" allow-clear placeholder="请输入标签描述" />
      </a-form-item>
      <a-form-item label="启用" name="enabled">
        <a-switch v-model:checked="formState.enabled" checked-children="启用" un-checked-children="禁用" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { deriveTagSensitive } from '../mock';
  import type { TagRow } from '../types';

  const props = defineProps<{
    open: boolean;
    record?: TagRow | null;
    categoryOptions?: { label: string; value: string }[];
    levelOptions?: { label: string; value: string }[];
    /** 从列表页筛选条件复用的初始值，新增时预填 */
    initialFilterValues?: { category?: string; level?: string; sensitive?: string };
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    success: [payload: Partial<TagRow> & { name: string; sensitive: string }];
  }>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const formState = reactive({
    name: '',
    category: undefined as string | undefined,
    level: undefined as string | undefined,
    sensitive: undefined as string | undefined,
    description: '',
    enabled: true
  });

  const isEdit = computed(() => Boolean(props.record?.id));
  const categoryOptionList = computed(() => props.categoryOptions || []);
  const levelOptionList = computed(() => props.levelOptions || []);

  const sensitiveOptionList = [
    { label: '是', value: '是' },
    { label: '否', value: '否' },
    { label: '未知', value: '未知' }
  ];

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择分类', trigger: 'change' }],
    level: [{ required: true, message: '请选择分级', trigger: 'change' }]
  };

  watch(
    () => props.open,
    (visible) => {
      if (!visible) return;
      if (props.record) {
        formState.name = props.record.name;
        formState.category = props.record.category;
        formState.level = props.record.level;
        formState.sensitive = props.record.sensitive;
        formState.description = props.record.description === '-' ? '' : props.record.description;
        formState.enabled = props.record.enabled;
      } else {
        formState.name = '';
        formState.category = props.initialFilterValues?.category ?? undefined;
        formState.level = props.initialFilterValues?.level ?? undefined;
        formState.sensitive = props.initialFilterValues?.sensitive ?? undefined;
        formState.description = '';
        formState.enabled = true;
      }
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
      const resolvedSensitive = (formState.sensitive ||
        deriveTagSensitive(formState.level || '未分级')) as TagRow['sensitive'];
      emit('success', {
        id: props.record?.id,
        name: formState.name,
        category: formState.category || '未分级',
        level: formState.level || '未分级',
        sensitive: resolvedSensitive,
        description: formState.description || '-',
        enabled: formState.enabled,
        source: props.record?.source || '用户添加'
      });
      message.success(isEdit.value ? '修改成功' : '新增成功');
      emit('update:open', false);
    }, 300);
  }
</script>
