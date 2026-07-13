<template>
  <a-drawer
    :open="open"
    :title="isEdit ? '修改规则' : '新增规则'"
    placement="right"
    width="640"
    destroy-on-close
    class="policy-form-drawer"
    :body-style="{ padding: '16px 20px 80px' }"
    @close="handleCancel"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <section class="form-section">
        <div class="section-title">基础信息</div>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="规则名称" name="name">
              <a-input v-model:value="formState.name" allow-clear placeholder="请输入规则名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="严重等级" name="severity">
              <a-select
                v-model:value="formState.severity"
                :options="severityOptions"
                allow-clear
                placeholder="请选择严重等级"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="类型" name="type">
              <a-input v-model:value="formState.type" allow-clear placeholder="请输入策略类型" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="OWASP TOP 10" name="owasp">
              <a-select
                v-model:value="formState.owasp"
                :options="owaspOptions"
                allow-clear
                placeholder="请选择 OWASP 分类"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="启用" name="enabled">
              <a-switch
                v-model:checked="formState.enabled"
                checked-children="启用"
                un-checked-children="禁用"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="designConcept">
              <template #label>
                <span class="ai-field-label">
                  <span>策略设计理念</span>
                  <a-tooltip title="AI通过理解策略设计理念提供更准确的研判结果">
                    <span class="ai-label-badge">AI</span>
                  </a-tooltip>
                </span>
              </template>
              <a-textarea
                v-model:value="formState.designConcept"
                :rows="4"
                allow-clear
                placeholder="请输入策略设计理念（选填）"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </section>

      <section class="form-section">
        <div class="section-title">策略内容</div>
        <a-form-item label="修复建议" name="remediation">
          <a-textarea
            v-model:value="formState.remediation"
            :rows="3"
            allow-clear
            placeholder="请输入修复建议"
          />
        </a-form-item>
        <a-form-item label="可被利用方式" name="exploitation">
          <a-textarea
            v-model:value="formState.exploitation"
            :rows="3"
            allow-clear
            placeholder="请输入可被利用方式"
          />
        </a-form-item>
      </section>
    </a-form>

    <template #footer>
      <div class="drawer-footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="submitting" @click="handleOk">保存</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, watch } from 'vue';
  import { owaspOptions, severityOptions } from '../mock';
  import type { PolicyRow } from '../types';

  const props = defineProps<{
    open: boolean;
    record?: PolicyRow | null;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
    success: [payload: Partial<PolicyRow> & { name: string }];
  }>();

  const formRef = ref<FormInstance>();
  const submitting = ref(false);

  const formState = reactive({
    name: '',
    severity: undefined as PolicyRow['severity'] | undefined,
    type: '',
    owasp: undefined as string | undefined,
    designConcept: '',
    remediation: '',
    exploitation: '',
    enabled: true
  });

  const isEdit = computed(() => Boolean(props.record?.id));

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
    severity: [{ required: true, message: '请选择严重等级', trigger: 'change' }],
    type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
    owasp: [{ required: true, message: '请选择 OWASP 分类', trigger: 'change' }]
  };

  watch(
    () => props.open,
    (visible) => {
      if (!visible) return;
      if (props.record) {
        formState.name = props.record.name;
        formState.severity = props.record.severity;
        formState.type = props.record.type;
        formState.owasp = props.record.owasp;
        formState.designConcept = props.record.designConcept || '';
        formState.remediation = props.record.remediation;
        formState.exploitation = props.record.exploitation;
        formState.enabled = props.record.enabled;
      } else {
        formState.name = '';
        formState.severity = undefined;
        formState.type = '';
        formState.owasp = undefined;
        formState.designConcept = '';
        formState.remediation = '';
        formState.exploitation = '';
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
      emit('success', {
        id: props.record?.id,
        name: formState.name,
        severity: formState.severity!,
        type: formState.type,
        owasp: formState.owasp,
        designConcept: formState.designConcept,
        remediation: formState.remediation,
        exploitation: formState.exploitation,
        enabled: formState.enabled,
        source: props.record?.source || '用户添加'
      });
      message.success(isEdit.value ? '修改成功' : '新增成功');
      emit('update:open', false);
    }, 300);
  }
</script>

<style lang="less" scoped>
  .form-section {
    margin-bottom: 20px;
  }

  .section-title {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .ai-field-label {
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

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
</style>
