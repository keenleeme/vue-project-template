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
            <a-alert
              type="info"
              show-icon
              message="敏感数据溯源至少需要输入两条线索，系统会按线索交集查询请求、响应、文件与访问日志。"
              style="margin-bottom: 12px"
            />
            <a-form-item name="sensitiveClues" :rules="sensitiveClueRules">
              <div class="sensitive-clue-list">
                <div v-for="(clue, index) in formState.sensitiveClues" :key="clue.id" class="sensitive-clue-card">
                  <div class="clue-card-header">
                    <span>线索 {{ index + 1 }}</span>
                    <a-button
                      type="link"
                      danger
                      size="small"
                      :disabled="formState.sensitiveClues.length <= 2"
                      @click="removeSensitiveClue(index)"
                    >
                      删除
                    </a-button>
                  </div>
                  <a-row :gutter="12">
                    <a-col :span="8">
                      <a-select
                        v-model:value="clue.dimension"
                        :options="SENSITIVE_CLUE_DIMENSION_OPTIONS"
                        :get-popup-container="getPopupContainer"
                        :dropdown-style="selectDropdownStyle"
                        placeholder="请选择线索维度"
                        @change="handleSensitiveClueDimensionChange(clue)"
                      />
                    </a-col>
                    <a-col :span="16">
                      <a-range-picker
                        v-if="clue.dimension === 'timeRange'"
                        v-model:value="clue.timeRange"
                        show-time
                        value-format="YYYY-MM-DD HH:mm:ss"
                        style="width: 100%"
                      />
                      <a-select
                        v-else-if="clue.dimension === 'apiSensitiveLevel'"
                        v-model:value="clue.value"
                        :options="apiSensitiveLevelOptions"
                        :get-popup-container="getPopupContainer"
                        :dropdown-style="selectDropdownStyle"
                        placeholder="请选择API敏感等级"
                        allow-clear
                      />
                      <a-select
                        v-else-if="clue.dimension === 'requestDataTag' || clue.dimension === 'responseDataTag'"
                        v-model:value="clue.values"
                        mode="multiple"
                        :options="dataTagSelectOptions"
                        :get-popup-container="getPopupContainer"
                        :dropdown-style="selectDropdownStyle"
                        placeholder="请选择数据标签"
                        allow-clear
                      />
                      <a-select
                        v-else-if="clue.dimension === 'fileFormat'"
                        v-model:value="clue.value"
                        :options="fileFormatOptions"
                        :get-popup-container="getPopupContainer"
                        :dropdown-style="selectDropdownStyle"
                        placeholder="请选择文件格式"
                        allow-clear
                      />
                      <a-select
                        v-else-if="clue.dimension === 'fileAction'"
                        v-model:value="clue.value"
                        :options="fileActionOptions"
                        :get-popup-container="getPopupContainer"
                        :dropdown-style="selectDropdownStyle"
                        placeholder="请选择文件操作行为"
                        allow-clear
                      />
                      <a-input
                        v-else
                        v-model:value="clue.value"
                        :placeholder="getSensitiveCluePlaceholder(clue.dimension)"
                        allow-clear
                      />
                    </a-col>
                  </a-row>
                </div>
              </div>
              <a-button type="dashed" block @click="addSensitiveClue">新增线索</a-button>
            </a-form-item>
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
    API_SENSITIVE_LEVEL_OPTIONS,
    APP_OPTIONS,
    DATA_TAG_OPTIONS,
    FILE_ACTION_OPTIONS,
    FILE_FORMAT_OPTIONS,
    SENSITIVE_CLUE_DIMENSION_OPTIONS,
    TRACE_TYPE_OPTIONS,
    formatSensitiveClueValue,
    getAccountsByAppId,
    getAppName,
    type AccountTraceConditions,
    type SensitiveClueDimension,
    type SensitiveTraceClue,
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
    sensitiveClues: SensitiveTraceClue[];
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

  let clueIdSeed = 0;
  const createSensitiveClue = (dimension?: SensitiveClueDimension): SensitiveTraceClue => {
    clueIdSeed += 1;
    return {
      id: `sensitive-clue-${Date.now()}-${clueIdSeed}`,
      dimension,
      value: '',
      values: [],
      timeRange: undefined
    };
  };

  const createDefaultFormState = (): FormState => ({
    taskName: '',
    taskDescription: '',
    traceType: undefined,
    sensitiveLoginAccount: '',
    sensitiveClientIp: '',
    sensitiveServerIp: '',
    sensitiveApps: [],
    sensitiveClues: [createSensitiveClue('timeRange'), createSensitiveClue('urlPath')],
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

  const dataTagSelectOptions = DATA_TAG_OPTIONS.map((item) => ({ label: item, value: item }));
  const apiSensitiveLevelOptions = API_SENSITIVE_LEVEL_OPTIONS.map((item) => ({ label: item, value: item }));
  const fileFormatOptions = FILE_FORMAT_OPTIONS.map((item) => ({ label: item, value: item }));
  const fileActionOptions = FILE_ACTION_OPTIONS.map((item) => ({ label: item, value: item }));

  const normalizeSensitiveClues = (conditions: SensitiveTraceConditions) => {
    if (conditions.clues?.length) {
      return conditions.clues.map((item) => ({
        ...createSensitiveClue(item.dimension),
        ...item,
        id: item.id || createSensitiveClue(item.dimension).id,
        values: [...(item.values || [])],
        timeRange: item.timeRange ? ([item.timeRange[0], item.timeRange[1]] as [string, string]) : undefined
      }));
    }

    const legacyClues: SensitiveTraceClue[] = [];
    if (conditions.timeRange) {
      legacyClues.push({
        ...createSensitiveClue('timeRange'),
        timeRange: [conditions.timeRange[0], conditions.timeRange[1]]
      });
    }
    if (conditions.apiPath) legacyClues.push({ ...createSensitiveClue('urlPath'), value: conditions.apiPath });
    if (conditions.loginAccount) legacyClues.push({ ...createSensitiveClue('accountName'), value: conditions.loginAccount });
    if (conditions.clientIp) legacyClues.push({ ...createSensitiveClue('sourceIp'), value: conditions.clientIp });
    if (conditions.serverIp) legacyClues.push({ ...createSensitiveClue('destIp'), value: conditions.serverIp });
    if (conditions.requestDataTags.length) {
      legacyClues.push({ ...createSensitiveClue('requestDataTag'), values: [...conditions.requestDataTags] });
    }
    if (conditions.responseDataTags.length) {
      legacyClues.push({ ...createSensitiveClue('responseDataTag'), values: [...conditions.responseDataTags] });
    }
    if (conditions.fileName) legacyClues.push({ ...createSensitiveClue('fileName'), value: conditions.fileName });
    if (conditions.dataClue) legacyClues.push({ ...createSensitiveClue('urlPath'), value: conditions.dataClue });

    while (legacyClues.length < 2) {
      legacyClues.push(createSensitiveClue(legacyClues.length === 0 ? 'timeRange' : 'urlPath'));
    }
    return legacyClues;
  };

  const buildFormState = (task?: TraceTask | null): FormState => {
    const nextState = createDefaultFormState();
    if (!task) return nextState;

    nextState.taskName = task.name;
    nextState.taskDescription = task.description;
    nextState.traceType = task.traceType;

    if (task.traceType === 'sensitive') {
      const conditions = task.conditions as SensitiveTraceConditions;
      nextState.sensitiveClues = normalizeSensitiveClues(conditions);
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
      nextState.sensitiveTimeRange = conditions.timeRange
        ? ([conditions.timeRange[0], conditions.timeRange[1]] as StringRange)
        : undefined;
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

  const addSensitiveClue = () => {
    formState.sensitiveClues.push(createSensitiveClue());
  };

  const removeSensitiveClue = (index: number) => {
    if (formState.sensitiveClues.length <= 2) return;
    formState.sensitiveClues.splice(index, 1);
  };

  const handleSensitiveClueDimensionChange = (clue: SensitiveTraceClue) => {
    clue.value = '';
    clue.values = [];
    clue.timeRange = undefined;
  };

  const getSensitiveCluePlaceholder = (dimension?: SensitiveClueDimension) => {
    const placeholderMap: Partial<Record<SensitiveClueDimension, string>> = {
      urlPath: '请输入URL路径字符串，如 /api/customer/export',
      appDomain: '请输入应用域名，如 crm.example.com',
      accountName: '请输入账号名称',
      sourceIp: '请输入请求源IP',
      destIp: '请输入目的IP',
      destPort: '请输入目的端口，如 443',
      fileName: '请输入文件名称',
      fileFormat: '请选择文件格式',
      fileAction: '请选择文件操作行为'
    };
    return placeholderMap[dimension || 'urlPath'] || '请选择线索维度后输入线索值';
  };

  const IP_PATTERN = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

  const isSensitiveClueComplete = (clue: SensitiveTraceClue) => {
    if (!clue.dimension) return false;
    if (clue.dimension === 'timeRange') {
      return !!clue.timeRange && clue.timeRange.length === 2 && !!clue.timeRange[0] && !!clue.timeRange[1];
    }
    if (clue.dimension === 'requestDataTag' || clue.dimension === 'responseDataTag') {
      return Array.isArray(clue.values) && clue.values.length > 0;
    }
    return !!clue.value?.trim();
  };

  const validateSensitiveClueValue = (clue: SensitiveTraceClue) => {
    if ((clue.dimension === 'sourceIp' || clue.dimension === 'destIp') && clue.value && !IP_PATTERN.test(clue.value.trim())) {
      return `${clue.dimension === 'sourceIp' ? '请求源IP' : '目的IP'}格式不正确`;
    }
    if (clue.dimension === 'destPort') {
      const port = Number(clue.value);
      if (!Number.isInteger(port) || port < 1 || port > 65535) return '目的端口需为1-65535之间的整数';
    }
    return '';
  };

  const getEffectiveSensitiveClues = () =>
    formState.sensitiveClues
      .filter(isSensitiveClueComplete)
      .map((clue) => ({
        ...clue,
        value: clue.value?.trim(),
        values: [...(clue.values || [])],
        timeRange: clue.timeRange ? ([clue.timeRange[0], clue.timeRange[1]] as [string, string]) : undefined
      }));

  const sensitiveClueRules = computed<Rule[]>(() => {
    if (formState.traceType !== 'sensitive') return [];
    return [
      {
        validator: async () => {
          const completeClues = getEffectiveSensitiveClues();
          if (completeClues.length < 2) {
            throw new Error('请至少填写两条完整线索');
          }
          const invalidMessage = completeClues.map(validateSensitiveClueValue).find(Boolean);
          if (invalidMessage) throw new Error(invalidMessage);
        },
        trigger: 'change'
      }
    ];
  });

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
      const clues = getEffectiveSensitiveClues();
      if (clues.length < 2) return null;
      const timeClue = clues.find((item) => item.dimension === 'timeRange');
      const getClueValue = (dimension: SensitiveClueDimension) =>
        clues.find((item) => item.dimension === dimension)?.value?.trim() || '';
      const getClueValues = (dimension: SensitiveClueDimension) =>
        clues.find((item) => item.dimension === dimension)?.values || [];
      return {
        name: formState.taskName,
        description: formState.taskDescription,
        traceType: 'sensitive',
        conditions: {
          clues,
          loginAccount: getClueValue('accountName'),
          clientIp: getClueValue('sourceIp'),
          serverIp: getClueValue('destIp'),
          appIds: [],
          apiPath: getClueValue('urlPath'),
          fileName: getClueValue('fileName'),
          requestDataTags: getClueValues('requestDataTag'),
          requestTagLogic: formState.requestTagLogic,
          responseDataTags: getClueValues('responseDataTag'),
          responseTagLogic: formState.responseTagLogic,
          dataClue: clues.map((item) => `${item.dimension}:${formatSensitiveClueValue(item)}`).join('; '),
          timeRange: timeClue?.timeRange ? [timeClue.timeRange[0], timeClue.timeRange[1]] : undefined
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
