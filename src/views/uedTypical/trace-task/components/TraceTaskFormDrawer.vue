<template>
  <!-- 使用 Modal 替代 Drawer；defineModel 绑定 + 固定挂载到 body + 提高 zIndex，避免弹层不显示/被遮挡 -->
  <a-modal
    :open="props.open"
    :title="drawerTitle"
    :width="900"
    :zIndex="2000"
    :get-container="modalContainer"
    :mask-closable="false"
    :destroy-on-close="true"
    centered
    :body-style="{
      maxHeight: 'calc(100vh - 180px)',
      overflowY: 'auto',
      paddingTop: '8px'
    }"
    wrap-class-name="trace-task-form-modal-wrap"
    @cancel="handleClose"
  >
    <div class="trace-task-form">
      <a-alert
        type="info"
        show-icon
        message="多个溯源条件之间按交集进行日志查询，确认后会立即进入执行或排队状态。"
        style="margin-bottom: 16px"
      />

      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-card title="基本信息" size="small" :bordered="false" class="section-card">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="任务名称"
                name="taskName"
                :rules="[
                  { required: true, message: '请输入任务名称' },
                  { max: 50, message: '任务名称最多50个字符' }
                ]"
              >
                <a-input
                  v-model:value="formState.taskName"
                  :maxlength="50"
                  show-count
                  placeholder="请输入任务名称"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="溯源类型" name="traceType" :rules="[{ required: true, message: '请选择溯源类型' }]">
                <a-select
                  v-model:value="formState.traceType"
                  :options="TRACE_TYPE_OPTIONS"
                  :get-popup-container="getPopupContainer"
                  :dropdown-style="selectDropdownStyle"
                  placeholder="请选择溯源类型"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="任务描述" name="taskDescription">
                <a-textarea
                  v-model:value="formState.taskDescription"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                  :maxlength="200"
                  show-count
                  placeholder="请输入任务描述"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card title="溯源条件" size="small" :bordered="false" class="section-card">
          <template v-if="formState.traceType === 'sensitive'">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="登录账号">
                  <a-input
                    v-model:value="formState.sensitiveLoginAccount"
                    placeholder="请输入登录账号，精准查询"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="客户端IP" name="sensitiveClientIp" :rules="sensitiveClientIpFieldRules">
                  <a-input
                    v-model:value="formState.sensitiveClientIp"
                    placeholder="请输入客户端IP，精准查询"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务端IP" name="sensitiveServerIp" :rules="sensitiveServerIpFieldRules">
                  <a-input
                    v-model:value="formState.sensitiveServerIp"
                    placeholder="请输入服务端IP，精准查询"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="应用">
                  <a-space direction="vertical" style="width: 100%">
                    <a-button block @click="openAppSelector('sensitive')"> 选择应用 </a-button>
                    <div class="selected-tags">
                      <a-tag v-for="appId in formState.sensitiveApps" :key="appId" color="processing">
                        {{ getAppName(appId) }}
                      </a-tag>
                      <span v-if="formState.sensitiveApps.length === 0" class="placeholder-text"> 暂未选择应用 </span>
                    </div>
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="API路径">
                  <a-input v-model:value="formState.apiPath" placeholder="示例：/api/user/detail?id=1" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="文件名称">
                  <a-input v-model:value="formState.fileName" placeholder="请输入文件名称，精准查询" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="请求数据标签">
                  <div class="tag-select-row">
                    <a-radio-group v-model:value="formState.requestTagLogic" option-type="button" button-style="solid">
                      <a-radio-button value="OR">或</a-radio-button>
                      <a-radio-button value="AND">且</a-radio-button>
                    </a-radio-group>
                    <a-checkbox-group v-model:value="formState.requestDataTags" :options="DATA_TAG_OPTIONS" />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="返回数据标签">
                  <div class="tag-select-row">
                    <a-radio-group v-model:value="formState.responseTagLogic" option-type="button" button-style="solid">
                      <a-radio-button value="OR">或</a-radio-button>
                      <a-radio-button value="AND">且</a-radio-button>
                    </a-radio-group>
                    <a-checkbox-group v-model:value="formState.responseDataTags" :options="DATA_TAG_OPTIONS" />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="数据线索">
                  <a-textarea
                    v-model:value="formState.dataClue"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                    placeholder="支持输入敏感内容，查询请求体和响应体内容"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="发生时间" name="sensitiveTimeRange" :rules="sensitiveTimeRules">
                  <a-range-picker
                    v-model:value="formState.sensitiveTimeRange"
                    show-time
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <template v-else-if="formState.traceType === 'sourceIp'">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="客户端IP" name="sourceClientIp" :rules="sourceClientIpRules">
                  <a-input v-model:value="formState.sourceClientIp" placeholder="请输入客户端IP" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="应用">
                  <a-space direction="vertical" style="width: 100%">
                    <a-button block @click="openAppSelector('source')"> 选择应用 </a-button>
                    <div class="selected-tags">
                      <a-tag v-for="appId in formState.sourceApps" :key="appId" color="processing">
                        {{ getAppName(appId) }}
                      </a-tag>
                      <span v-if="formState.sourceApps.length === 0" class="placeholder-text"> 暂未选择应用 </span>
                    </div>
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="发生时间" name="sourceTimeRange" :rules="sourceTimeRules">
                  <a-range-picker
                    v-model:value="formState.sourceTimeRange"
                    show-time
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <template v-else-if="formState.traceType === 'account'">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="应用" name="accountAppId" :rules="accountAppRules">
                  <a-select
                    v-model:value="formState.accountAppId"
                    :options="accountAppOptions"
                    :get-popup-container="getPopupContainer"
                    :dropdown-style="selectDropdownStyle"
                    placeholder="请选择应用"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="账号" name="accountName" :rules="accountNameRules">
                  <a-select
                    v-model:value="formState.accountName"
                    show-search
                    allow-clear
                    :filter-option="filterAccountOption"
                    :options="accountOptions"
                    :get-popup-container="getPopupContainer"
                    :dropdown-style="selectDropdownStyle"
                    placeholder="请选择账号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="发生时间" name="accountTimeRange" :rules="accountTimeRules">
                  <a-range-picker
                    v-model:value="formState.accountTimeRange"
                    show-time
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </template>

          <div v-else class="trace-type-placeholder">请选择溯源类型后填写条件</div>
        </a-card>
      </a-form>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button type="primary" @click="handleSubmit">
            {{ submitText }}
          </a-button>
        </a-space>
      </div>
    </template>
  </a-modal>

  <a-modal
    v-model:open="appModalOpen"
    title="选择应用"
    width="50%"
    centered
    @ok="handleAppConfirm"
    @cancel="handleAppCancel"
  >
    <a-checkbox-group v-model:value="tempAppIds" class="app-option-list">
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in APP_OPTIONS" :key="item.id" :span="12">
          <div class="app-option-card">
            <a-checkbox :value="item.id">
              <div class="app-option-name">{{ item.name }}</div>
              <div class="app-option-desc">账号数 {{ item.accounts.length }}，支持日志交叉查询</div>
            </a-checkbox>
          </div>
        </a-col>
      </a-row>
    </a-checkbox-group>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import {
    APP_OPTIONS,
    DATA_TAG_OPTIONS,
    TRACE_TYPE_OPTIONS,
    getAccountsByAppId,
    getAppName,
    type AccountTraceConditions,
    type SensitiveTraceConditions,
    type SourceIpTraceConditions,
    type TraceTask,
    type TraceType
  } from '../task-store';

  const modalContainer = () => document.body;
  const getPopupContainer = (triggerNode: HTMLElement) => triggerNode?.parentElement ?? document.body;
  const selectDropdownStyle = { zIndex: 2100 };

  type DrawerMode = 'create' | 'edit';

  /** 与 a-range-picker + value-format 搭配，未选时为 undefined */
  type StringRange = [string, string] | undefined;

  interface FormState {
    taskName: string;
    taskDescription: string;
    traceType: TraceType | undefined;
    sensitiveLoginAccount: string;
    sensitiveClientIp: string;
    sensitiveServerIp: string;
    sensitiveApps: string[];
    apiPath: string;
    fileName: string;
    requestDataTags: string[];
    requestTagLogic: 'AND' | 'OR';
    responseDataTags: string[];
    responseTagLogic: 'AND' | 'OR';
    dataClue: string;
    sensitiveTimeRange: StringRange;
    sourceClientIp: string;
    sourceApps: string[];
    sourceTimeRange: StringRange;
    accountAppId: string | undefined;
    accountName: string | undefined;
    accountTimeRange: StringRange;
  }

  interface SubmitPayload {
    name: string;
    description: string;
    traceType: TraceType;
    conditions: SensitiveTraceConditions | SourceIpTraceConditions | AccountTraceConditions;
  }

  const props = withDefaults(
    defineProps<{
      open?: boolean;
      mode?: DrawerMode;
      task?: TraceTask | null;
    }>(),
    {
      open: false,
      mode: 'create',
      task: null
    }
  );

  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'submit', payload: SubmitPayload): void;
  }>();

  const createDefaultFormState = (): FormState => ({
    taskName: '',
    taskDescription: '',
    traceType: undefined,
    sensitiveLoginAccount: '',
    sensitiveClientIp: '',
    sensitiveServerIp: '',
    sensitiveApps: [],
    apiPath: '',
    fileName: '',
    requestDataTags: [],
    requestTagLogic: 'OR',
    responseDataTags: [],
    responseTagLogic: 'OR',
    dataClue: '',
    sensitiveTimeRange: undefined,
    sourceClientIp: '',
    sourceApps: [],
    sourceTimeRange: undefined,
    accountAppId: undefined,
    accountName: undefined,
    accountTimeRange: undefined
  });

  const formRef = ref<FormInstance>();
  const formState = reactive<FormState>(createDefaultFormState());
  const appModalOpen = ref(false);
  const appSelectorTarget = ref<'sensitive' | 'source'>('sensitive');
  const tempAppIds = ref<string[]>([]);

  const drawerTitle = computed(() => (props.mode === 'edit' ? '编辑溯源任务' : '创建任务'));

  const submitText = computed(() => (props.mode === 'edit' ? '保存并重新溯源' : '确认并开始溯源'));

  const accountAppOptions = computed(() =>
    APP_OPTIONS.map((item) => ({
      label: item.name,
      value: item.id
    }))
  );

  const accountOptions = computed(() =>
    getAccountsByAppId(formState.accountAppId).map((item) => ({
      label: item,
      value: item
    }))
  );

  const buildFormState = (task?: TraceTask | null): FormState => {
    const nextState = createDefaultFormState();
    if (!task) return nextState;

    nextState.taskName = task.name;
    nextState.taskDescription = task.description;
    nextState.traceType = task.traceType;

    if (task.traceType === 'sensitive') {
      const conditions = task.conditions as SensitiveTraceConditions;
      nextState.sensitiveLoginAccount = conditions.loginAccount;
      nextState.sensitiveClientIp = conditions.clientIp;
      nextState.sensitiveServerIp = conditions.serverIp;
      nextState.sensitiveApps = [...conditions.appIds];
      nextState.apiPath = conditions.apiPath;
      nextState.fileName = conditions.fileName;
      nextState.requestDataTags = [...conditions.requestDataTags];
      nextState.requestTagLogic = conditions.requestTagLogic;
      nextState.responseDataTags = [...conditions.responseDataTags];
      nextState.responseTagLogic = conditions.responseTagLogic;
      nextState.dataClue = conditions.dataClue;
      nextState.sensitiveTimeRange = [conditions.timeRange[0], conditions.timeRange[1]] as StringRange;
    }

    if (task.traceType === 'sourceIp') {
      const conditions = task.conditions as SourceIpTraceConditions;
      nextState.sourceClientIp = conditions.clientIp;
      nextState.sourceApps = [...conditions.appIds];
      nextState.sourceTimeRange = [conditions.timeRange[0], conditions.timeRange[1]] as StringRange;
    }

    if (task.traceType === 'account') {
      const conditions = task.conditions as AccountTraceConditions;
      nextState.accountAppId = conditions.appId;
      nextState.accountName = conditions.account;
      nextState.accountTimeRange = [conditions.timeRange[0], conditions.timeRange[1]] as StringRange;
    }

    return nextState;
  };

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        Object.assign(formState, buildFormState(props.task));
        formRef.value?.clearValidate?.();
      }
    }
  );

  watch(
    () => formState.accountAppId,
    () => {
      const accountList = getAccountsByAppId(formState.accountAppId);
      if (formState.accountName && !accountList.includes(formState.accountName)) {
        formState.accountName = undefined;
      }
    }
  );

  const filterAccountOption = (input: string, option: { label: string; value: string }) =>
    option.label.toLowerCase().includes(input.toLowerCase());

  const openAppSelector = (target: 'sensitive' | 'source') => {
    appSelectorTarget.value = target;
    tempAppIds.value = target === 'sensitive' ? [...formState.sensitiveApps] : [...formState.sourceApps];
    appModalOpen.value = true;
  };

  const handleAppConfirm = () => {
    if (appSelectorTarget.value === 'sensitive') {
      formState.sensitiveApps = [...tempAppIds.value];
    } else {
      formState.sourceApps = [...tempAppIds.value];
    }
    appModalOpen.value = false;
  };

  const handleAppCancel = () => {
    appModalOpen.value = false;
    tempAppIds.value = [];
  };

  const IP_PATTERN = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

  const optionalIpRule = (label: string): Rule => ({
    validator: async (_rule, value: string) => {
      if (!value || !String(value).trim()) return;
      if (!IP_PATTERN.test(String(value).trim())) {
        throw new Error(`${label}格式不正确`);
      }
    },
    trigger: 'blur'
  });

  const sensitiveClientIpFieldRules = computed<Rule[]>(() =>
    formState.traceType === 'sensitive' ? [optionalIpRule('客户端IP')] : []
  );
  const sensitiveServerIpFieldRules = computed<Rule[]>(() =>
    formState.traceType === 'sensitive' ? [optionalIpRule('服务端IP')] : []
  );

  const sourceClientIpRules = computed<Rule[]>(() => {
    if (formState.traceType !== 'sourceIp') return [];
    return [
      { required: true, message: '请输入客户端IP' },
      {
        validator: async (_r, v: string) => {
          if (!v?.trim()) return;
          if (!IP_PATTERN.test(v.trim())) {
            throw new Error('客户端IP格式不正确');
          }
        }
      }
    ];
  });

  const timeRangeRequiredRule = (): Rule => ({
    validator: async (_r, v: StringRange) => {
      if (!v || v.length !== 2 || !v[0]?.trim() || !v[1]?.trim()) {
        throw new Error('请选择发生时间');
      }
    }
  });

  const sensitiveTimeRules = computed<Rule[]>(() =>
    formState.traceType === 'sensitive' ? [timeRangeRequiredRule()] : []
  );

  const sourceTimeRules = computed<Rule[]>(() => (formState.traceType === 'sourceIp' ? [timeRangeRequiredRule()] : []));

  const accountAppRules = computed<Rule[]>(() =>
    formState.traceType === 'account' ? [{ required: true, message: '请选择应用' }] : []
  );

  const accountNameRules = computed<Rule[]>(() =>
    formState.traceType === 'account' ? [{ required: true, message: '请选择账号' }] : []
  );

  const accountTimeRules = computed<Rule[]>(() => (formState.traceType === 'account' ? [timeRangeRequiredRule()] : []));

  const buildSubmitPayload = (): SubmitPayload | null => {
    if (!formState.traceType) return null;

    if (formState.traceType === 'sensitive') {
      const tr = formState.sensitiveTimeRange;
      if (!tr || tr.length !== 2) return null;
      return {
        name: formState.taskName,
        description: formState.taskDescription,
        traceType: 'sensitive',
        conditions: {
          loginAccount: formState.sensitiveLoginAccount,
          clientIp: formState.sensitiveClientIp,
          serverIp: formState.sensitiveServerIp,
          appIds: [...formState.sensitiveApps],
          apiPath: formState.apiPath,
          fileName: formState.fileName,
          requestDataTags: [...formState.requestDataTags],
          requestTagLogic: formState.requestTagLogic,
          responseDataTags: [...formState.responseDataTags],
          responseTagLogic: formState.responseTagLogic,
          dataClue: formState.dataClue,
          timeRange: [tr[0], tr[1]]
        }
      };
    }

    if (formState.traceType === 'sourceIp') {
      const tr = formState.sourceTimeRange;
      if (!tr || tr.length !== 2) return null;
      return {
        name: formState.taskName,
        description: formState.taskDescription,
        traceType: 'sourceIp',
        conditions: {
          clientIp: formState.sourceClientIp,
          appIds: [...formState.sourceApps],
          timeRange: [tr[0], tr[1]]
        }
      };
    }

    const atr = formState.accountTimeRange;
    if (!atr || atr.length !== 2) return null;
    return {
      name: formState.taskName,
      description: formState.taskDescription,
      traceType: 'account',
      conditions: {
        appId: formState.accountAppId || '',
        account: formState.accountName || '',
        timeRange: [atr[0], atr[1]]
      }
    };
  };

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();
      const payload = buildSubmitPayload();
      if (!payload) {
        message.error('请选择溯源类型并完善条件');
        return;
      }
      emit('submit', payload);
    } catch (error) {
      // 表单校验失败时 ant-design-vue 会展示字段级提示
    }
  };

  const handleClose = () => {
    emit('update:open', false);
  };
</script>

<style lang="less" scoped>
  .trace-task-form {
    padding-bottom: 16px;
  }

  .section-card {
    margin-bottom: 16px;
    background: var(--color-bg-container);
    border: 1px solid var(--color-component-stroke);
    border-radius: 8px;
  }

  .selected-tags {
    min-height: 32px;
    padding: 8px 12px;
    border: 1px dashed var(--color-component-stroke);
    border-radius: 6px;
    background: var(--color-bg-page);
  }

  .placeholder-text {
    color: var(--color-text-placeholder);
  }

  .tag-select-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
  }

  .trace-type-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    color: var(--color-text-secondary);
    border: 1px dashed var(--color-component-stroke);
    border-radius: 8px;
    background: var(--color-bg-page);
  }

  .app-option-list {
    width: 100%;
  }

  .app-option-card {
    height: 100%;
    padding: 12px;
    border: 1px solid var(--color-component-stroke);
    border-radius: 8px;
    background: var(--color-bg-page);
  }

  .app-option-name {
    color: var(--color-text-primarys);
    font-weight: 600;
  }

  .app-option-desc {
    margin-top: 4px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }
</style>
