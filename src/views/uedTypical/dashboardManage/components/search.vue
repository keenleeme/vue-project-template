div
<template>
  <div class="search-wrap" :class="{ divider: isDivider }">
    <a-form :ref="formRef" :model="formData" class="form-wrap" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col v-for="item in showFormItems" :key="item.label" :span="span">
          <a-form-item :label="item.label">
            <template v-if="item.type === 'input'">
              <a-input
                v-model:value="formData[item.prop]"
                :placeholder="item.placeholder || $t('I18N.base_form.pleaseEnter')"
              />
            </template>
            <template v-else-if="item.type === 'select'">
              <a-select
                v-model:value="formData[item.prop]"
                :placeholder="item.placeholder || $t('I18N.base_form.pleaseChoose')"
                :multiple="item.multiple"
                :collapse-tags="item.collapseTags"
              >
                <a-select-option
                  v-for="option in toGetOptions(item)"
                  :key="option[item.valueKey || 'value']"
                  :value="option[item.valueKey || 'value']"
                >
                  {{ option[item.labelKey || 'label'] }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="['date', 'year', 'month', 'datetime'].includes(item.type)">
              <a-date-picker v-model:value="formData[item.prop]" :picker="item.type || ''" />
            </template>
            <template v-else-if="['datetimerange', 'daterange'].includes(item.type)">
              <a-range-picker
                v-model:value="formData[item.prop]"
                :picker="item.type || ''"
                :placeholder="[
                  item.startPlaceholder || $t('I18N.layout.qingXuanZeKaiShiShiJian'),
                  item.endPlaceholder || $t('I18N.layout.qingXuanZeJieShuShiJian')
                ]"
              />
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="span">
          <div class="search-btn-wrap">
            <div @click="toShowMore">
              <UpSquareOutlined v-if="expand" />
              <DownSquareOutlined v-if="expand" />
            </div>
            <a-button v-if="isReset" type="default" class="search reset mr-8" @click="handleReset">{{
              $t('I18N.common.reset')
            }}</a-button>
            <a-button type="primary" class="search confirm" @click="handleSearch">{{
              $t('I18N.common.search')
            }}</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onBeforeMount } from 'vue';

  export interface FormItem {
    type: 'input' | 'select' | 'date' | 'year' | 'month' | 'year' | 'datetime' | 'datetimerange' | 'daterange';
    label: string;
    prop: string;
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    options?: any[];
    multiple?: boolean;
    collapseTags?: boolean;
    labelKey?: string;
    valueKey?: string;
    remote?: boolean;
    remoteUrl?: string;
    remoteKey?: string;
    remoteExtraParams?: Record<string, any>;
  }

  interface IProps<T> {
    formItems: FormItem[];
    initialValues?: Record<string, any>;
    span?: number;
    isDivider?: boolean;
    isReset?: boolean;
    mainViewRows?: number;
    expandDefault?: boolean;
  }

  const props = withDefaults(defineProps<IProps<any>>(), {
    isDivider: true,
    isReset: false,
    initialValues: () => ({}),
    span: 6,
    defaultExpand: false,
    mainViewRows: 1,
    formItems: () => []
  });

  const emit = defineEmits(['onSearch']);

  const labelCol = { style: { width: '88px' } };
  const wrapperCol = { span: 14 };

  const formRef = ref();

  const expand = ref(props.defaultExpand);

  const showFormItems = ref<FormItem[]>([]);
  // 获取展示的表单项
  const toGetShowFormItems = () => {
    const { span, mainViewRows, formItems } = props;
    const columns = 24 / span;
    const showNum = columns * mainViewRows;
    if (expand.value) {
      showFormItems.value = formItems;
    } else {
      showFormItems.value = formItems.filter((item, index) => index < showNum);
    }
  };
  onBeforeMount(() => toGetShowFormItems());

  const remoteOptions: any = reactive({});
  const judgeIsRemoteSelect = () => {
    const { formItems } = props;
    if (formItems.length) {
      formItems.forEach((item) => {
        if (item.remote) {
          remoteOptions[item.prop] = [];
        }
      });
    }
  };
  onBeforeMount(() => judgeIsRemoteSelect());

  const toGetOptions = (item: any) => {
    return item.remote ? remoteOptions[item.prop] : item.options;
  };

  const toShowMore = () => {
    expand.value = !expand.value;
  };

  const handleSearch = () => {
    // todo 去除值为空的key
    emit('onSearch', formData);
  };

  const initialValues = {
    ...props.initialValues
  };

  let formData = reactive(props.initialValues);
  const handleReset = () => {
    // eslint-disable-next-line guard-for-in
    for (const key in initialValues) {
      formData[key] = initialValues[key];
    }
    // formData = initialValues || {};
    formRef.value?.resetFields();
    emit('onSearch', formData);
  };
</script>

<style lang="less" scoped>
  .search-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0 16px;
    padding-top: 16px;
    background: var(--color-bg-container);
    &.divider {
      border-bottom: 1px solid var(--color-component-stroke);
    }
    .form-wrap {
      flex: 1;
    }
    .search-btn-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    :deep(.ant-form-item .ant-form-item-label > label) {
      font-size: 12px;
    }
    :deep(.ant-col-14) {
      max-width: calc(100% - 104px);
    }
  }
  .sql-input {
    flex: 1;
  }
</style>
