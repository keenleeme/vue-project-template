<template>
  <a-modal
    :open="open"
    @update:open="$emit('update:open', $event)"
    title="设置"
    width="70%"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="setting-modal-content">
      <!-- 模型配置部分 -->
      <div class="model-config-section">
        <div class="section-header">
          <h3>模型配置</h3>
          <a-button type="primary" @click="handleAddModel">
            <template #icon>
              <PlusOutlined />
            </template>
            新增模型
          </a-button>
        </div>

        <a-table :dataSource="modelList" :columns="columns" :pagination="false" rowKey="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="table-actions">
                <a-button type="link" size="small" @click="handleEditModel(record)">编辑</a-button>
                <a-popconfirm
                  title="确定要删除这个模型配置吗？"
                  @confirm="handleDeleteModel(record)"
                  okText="确定"
                  cancelText="取消"
                >
                  <a-button type="link" size="small" danger>删除</a-button>
                </a-popconfirm>
              </div>
            </template>
            <template v-else-if="column.key === 'apiKey'">
              <span>{{ '******' }}</span>
            </template>
            <template v-else>
              <a-tooltip :title="record[column.dataIndex]">
                <span>{{ record[column.dataIndex] }}</span>
              </a-tooltip>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 模型选择部分 -->
      <div class="model-selection-section">
        <h3>模型选择</h3>

        <div class="selection-item">
          <a-select
            v-model:value="settings.normalChatModel"
            style="width: 300px"
            placeholder="请选择模型"
            :options="modelOptions"
          />
        </div>
      </div>

      <div class="modal-footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
    </div>

    <!-- 添加/编辑模型弹窗 -->
    <a-modal
      :open="modelFormVisible"
      @update:open="modelFormVisible = $event"
      :title="editingModel ? '编辑模型' : '添加模型'"
      :footer="null"
      @cancel="modelFormVisible = false"
    >
      <a-form ref="modelFormRef" :model="modelForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="模型名称" name="name" :rules="[{ required: true, message: '请输入模型名称' }]">
          <a-input v-model:value="modelForm.name" placeholder="请输入模型名称" style="width: 300px" />
        </a-form-item>
        <a-form-item
          label="API Provider"
          name="apiProvider"
          :rules="[{ required: true, message: '请输入API Provider' }]"
        >
          <a-select
            v-model:value="modelForm.apiProvider"
            style="width: 300px"
            placeholder="请选择API Provider"
            :options="selectedProviderOptions"
          />
        </a-form-item>
        <a-form-item label="API KEY" name="apiKey" :rules="[{ required: true, message: '请输入API KEY' }]">
          <a-input type="password" v-model:value="modelForm.apiKey" placeholder="请输入API KEY" style="width: 300px" />
        </a-form-item>
        <a-form-item label="Alibaba API Line" name="qwenApiLine" v-if="modelForm.apiProvider === 'qwen'">
          <a-select v-model:value="modelForm.qwenApiLine" style="width: 300px" placeholder="请选择Alibaba API Line">
            <a-select-option value="china">China API</a-select-option>
            <a-select-option value="international">International API</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模型id" name="apiModelId" :rules="[{ required: true, message: '请输入模型id' }]">
          <a-select
            v-model:value="modelForm.apiModelId"
            style="width: 300px"
            placeholder="请选择模型id"
            :options="modelIdOptions"
          >
          </a-select>
        </a-form-item>

        <!-- <a-form-item label="是否激活" name="is_active">
           <a-switch v-model:checked="modelForm.is_active" />
        </a-form-item> -->

        <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
          <a-space>
            <a-button @click="modelFormVisible = false">取消</a-button>
            <a-button type="primary" @click="handleSubmitModelForm">确定</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineProps, defineEmits, watch, onMounted, computed } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import type { ModelConfigResponseData, ModelConfigCreate } from '../types/api';

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:open']);

  const modelFormRef = ref(null);

  // 定义类型
  interface TableColumn {
    title: string;
    dataIndex: keyof ModelConfigResponseData;
    key: string;
    ellipsis?: boolean;
  }

  // 表格列定义
  const columns: TableColumn[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'apiProvider',
      dataIndex: 'apiProvider',
      key: 'apiProvider'
    },
    {
      title: '模型ID',
      dataIndex: 'apiModelId',
      key: 'apiModelId'
    },
    {
      title: 'qwenApiLine',
      dataIndex: 'qwenApiLine',
      key: 'qwenApiLine'
    },
    {
      title: 'KEY',
      dataIndex: 'apiKey',
      key: 'apiKey',
      ellipsis: true
    }
  ];

  // 模型提供商选项
  const selectedProviderOptions = [
    {
      value: 'deepseek',
      label: 'DeepSeek'
    },
    {
      value: 'qwen',
      label: 'Alibaba Qwen'
    }
  ];

  // 模型列表数据
  const modelList = ref<ModelConfigResponseData[]>([]);

  // 设置数据
  const settings = reactive({
    normalChatModel: '',
    longTextModel: '',
    imageModel: ''
  });

  // 模型表单相关
  const modelFormVisible = ref(false);
  const editingModel = ref<ModelConfigResponseData | null>(null);

  // 模型表单类型定义
  interface ModelForm extends ModelConfigCreate {
    id?: number;
    name: string;
  }

  // 默认表单数据
  const defaultModelForm: ModelForm = {
    name: '',
    apiProvider: '',
    apiKey: '',
    qwenApiLine: 'china',
    apiModelId: ''
  };

  const modelForm = reactive<ModelForm>({ ...defaultModelForm });

  // 重置表单
  const resetModelForm = (data: Partial<ModelForm> = {}) => {
    Object.assign(modelForm, { ...defaultModelForm, ...data });
  };

  // 获取模型配置
  const fetchModelConfigs = () => {
    const savedModelList = localStorage.getItem('modelList');
    modelList.value = savedModelList ? JSON.parse(savedModelList) : [];
  };

  // 模型ID选项
  const modelIdOptions = computed(() => {
    const deepseekOptions = [
      { value: 'deepseek-chat', label: 'deepseek-chat' },
      { value: 'deepseek-reasoner', label: 'deepseek-reasoner' }
    ];

    const qwenOptionsChina = [
      'qwen2.5-coder-32b-instruct',
      'qwen2.5-coder-14b-instruct',
      'qwen2.5-coder-7b-instruct',
      'qwen2.5-coder-3b-instruct',
      'qwen2.5-coder-1.5b-instruct',
      'qwen2.5-coder-0.5b-instruct',
      'qwen-coder-plus-latest',
      'qwen-plus-latest',
      'qwen-turbo-latest',
      'qwen-max-latest'
    ].map((value) => ({ value, label: value }));

    const qwenOptionsInternational = [
      'qwen2.5-coder-32b-instruct',
      'qwen2.5-coder-14b-instruct',
      'qwen2.5-coder-7b-instruct',
      'qwen2.5-coder-3b-instruct',
      'qwen2.5-coder-1.5b-instruct',
      'qwen2.5-coder-0.5b-instruct'
    ].map((value) => ({ value, label: value }));

    switch (modelForm.apiProvider) {
      case 'deepseek':
        return deepseekOptions;
      case 'qwen':
        return modelForm.qwenApiLine === 'china' ? qwenOptionsChina : qwenOptionsInternational;
      default:
        return [];
    }
  });

  // 计算属性：模型选项
  const modelOptions = computed(() => {
    return modelList.value.map((model) => ({
      label: model.name,
      value: String(model.apiKey),
      apiProvider: model.apiProvider,
      qwenApiLine: model.qwenApiLine
    }));
  });

  // 事件处理方法
  const handleCancel = () => {
    emit('update:open', false);
  };

  const handleSave = () => {
    // 校验1：检查是否有配置模型
    if (!settings.normalChatModel) {
      message.error('请选择一个模型');
      return;
    }

    // 校验2：检查模型列表是否为空
    if (modelList.value.length === 0) {
      message.error('请先添加至少一个模型配置');
      return;
    }

    // 查找选中的模型
    const selectedModel = modelList.value.find((model) => model.apiKey === settings.normalChatModel);

    // 校验3：检查是否找到匹配的模型
    if (!selectedModel) {
      message.error('未找到匹配的模型配置，请检查配置');
      return;
    }

    // 保存配置并关闭弹窗
    try {
      localStorage.setItem('chatSettings', JSON.stringify(selectedModel));
      message.success('配置保存成功');
      emit('update:open', false);
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败，请重试');
    }
  };

  const handleAddModel = () => {
    editingModel.value = null;
    resetModelForm();
    modelFormVisible.value = true;
  };

  const handleEditModel = (record: ModelConfigResponseData) => {
    editingModel.value = record;
    const formData: ModelForm = {
      name: record.name,
      model: record.model,
      api_base: record.api_base || '',
      apiKey: '', // 出于安全考虑不显示
      context_window: record.context_window || 16384,
      system_prompt: record.system_prompt || '',
      is_active: record.is_active !== false
    };
    resetModelForm(formData);
    modelFormVisible.value = true;
  };

  const handleDeleteModel = async () => {
    // try {
    //   await modelApi.deleteModelConfig(record.id);
    //   message.success('删除成功');
    //   fetchModelConfigs();
    // } catch (error) {
    //   console.error('删除模型失败:', error);
    //   message.error('删除模型失败');
    // }
  };

  const handleSubmitModelForm = async () => {
    // form 表单校验
    const valid = await modelFormRef.value.validate();

    if (!valid) {
      return;
    }

    try {
      const modelData = {
        name: modelForm.name,
        apiProvider: modelForm.apiProvider,
        qwenApiLine: modelForm.qwenApiLine,
        apiKey: modelForm.apiKey,
        apiModelId: modelForm.apiModelId
      };

      // 检查是否已存在相同名称的模型
      const exists = modelList.value.some((model) => model.name === modelData.name);
      if (exists) {
        message.error('模型名称已存在，请使用其他名称');
        return;
      }

      modelList.value.push(modelData);
      localStorage.setItem('modelList', JSON.stringify(modelList.value));
      message.success('添加成功');
      modelFormVisible.value = false;
    } catch (error) {
      console.error('保存模型失败:', error);
      message.error('保存模型失败');
    }
  };

  // 监听和生命周期
  watch(
    () => props.open,
    (val) => {
      if (val) {
        fetchModelConfigs();
      } else {
        handleCancel();
      }
    }
  );

  onMounted(() => {
    // 先获取模型
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      settings.normalChatModel = String(parsedSettings.apiKey);
    }
    if (props.open) {
      fetchModelConfigs();
    }
  });

  // 监听 apiProvider 变化
  watch(
    () => modelForm.apiProvider,
    () => {
      modelForm.apiModelId = '';
    }
  );
</script>

<style lang="less" scoped>
  .setting-modal-content {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
      }
    }

    .model-config-section {
      margin-bottom: 24px;
    }

    .model-selection-section {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .selection-item {
        margin-left: 10px;
        display: flex;
        align-items: center;
        // margin-bottom: 16px;

        .label {
          width: 80px;
          margin-right: 16px;
          font-weight: bold;
        }
      }
    }

    .table-actions {
      display: flex;
      gap: 4px;
    }
    .modal-form-tip {
      font-size: var(--font-size-base);
      color: var(--color-text-disabled);
      margin-top: 3px;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
  }
</style>
