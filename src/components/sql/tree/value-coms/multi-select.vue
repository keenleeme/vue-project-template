<template>
  <div ref="multiSelectWrap" class="multi-select-wrap">
    <a-select
      v-if="props_isRemoteSearch"
      v-model:value="data_value"
      class="w-300"
      size="small"
      allow-clear
      show-search
      option-filter-prop="title"
      placeholder="选择字段"
      :get-popup-container="getPopupContainer"
      @change="onChange"
      @search="remoteSearch"
      @dropdown-visible-change="openChange"
    >
      <a-select-option
        v-for="(item, index) in props_valueOptions"
        :key="`${item.value}-${index}`"
        :value="item.value"
        :title="item.label"
        >{{ item.label || item.value }}</a-select-option
      >
    </a-select>
    <a-select
      v-else
      v-model:value="data_value"
      class="w-300"
      option-filter-prop="title"
      :mode="props_isMultiSelect ? 'multiple' : ''"
      size="small"
      :get-popup-container="getPopupContainer"
      allow-clear
      show-search
      placeholder="选择字段"
      @change="onChange"
    >
      <a-select-option
        v-for="(item, index) in props_valueOptions"
        :key="`${item.value}-${index}`"
        :value="item.value"
        :title="item.label"
        >{{ item.label || item.value }}</a-select-option
      >
    </a-select>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { Select as ASelect, SelectOption as ASelectOption } from 'ant-design-vue';
  import { debounce } from 'lodash';

  defineOptions({
    name: 'ComTreeMultiSelect'
  });

  const multiSelectWrap = ref(null);

  const props = defineProps({
    props_valueOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    props_isMultiSelect: {
      type: Boolean,
      required: true
    },
    props_defaultValue: {
      type: [Array, String, Boolean]
    },
    // 是否支持远程搜索
    props_isRemoteSearch: {
      type: Boolean,
      default: false
    },
    props_loading: {
      type: Boolean,
      default: false
    },
    // 下拉框距离父组件高度
    props_valueComTop: {
      type: String,
      default: ''
    }
  });

  const emits = defineEmits(['onChange', 'remoteMethod']);
  const data_value = ref(
    typeof props.props_defaultValue === 'boolean' ? props.props_defaultValue.toString() : props.props_defaultValue || ''
  );

  function onChange() {
    emits('onChange', data_value.value);
  }
  const remoteSearch = debounce(
    function (val) {
      if (props.props_isRemoteSearch) {
        emits('remoteMethod', val || '');
      }
    },
    300,
    { trailing: true }
  );
  function openChange(val) {
    if (val) {
      onChange();
    }
  }

  function getPopupContainer() {
    return multiSelectWrap.value;
  }
</script>
