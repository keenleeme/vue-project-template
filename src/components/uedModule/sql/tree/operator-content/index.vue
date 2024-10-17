<template>
  <div class="operator-content" :style="{ padding: props_padding }">
    <div ref="selectContainer">
      <a-select
        v-model:value="operatorData.data_operatorVal"
        class="w-120"
        size="small"
        :get-popup-container="getPopupContainer"
        placeholder="选择运算符"
        @change="onOperatorChange"
      >
        <a-select-option v-for="item in props_operatorList" :key="`${item.value}-${item.label}`" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <!-- in 选择新增筛选项 -->
    <template v-if="cmp_isShowOperatorType && !props_singleCondition.wherePid">
      <div ref="selectContainerType">
        <a-select
          v-model:value="operatorData.data_operatorTypeVal"
          class="w-120"
          size="small"
          :get-popup-container="getPopupContainerType"
          placeholder="请选择"
          @change="onOperatorOtherChange"
        >
          <a-select-option
            v-for="item in cmp_operatorElementList"
            :key="`${item.value}-${item.label}`"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { ref, watch, inject, reactive, computed } from 'vue';
  import { Button as AButton, Row as ARow, Select as ASelect, SelectOption as ASelectOption } from 'ant-design-vue';
  import { ELEMENT_AND_OBJECT_SUPPORT_TYPE } from '../../keytype-op-comtype.js';

  const selectContainer = ref(null);
  const selectContainerType = ref(null);

  defineOptions({
    name: 'OperatorContent',
    inheritAttrs: false
  });
  const props = defineProps({
    // 运算符
    props_operatorVal: {
      type: String,
      default: ''
    },
    // 运算符类型 【元素或对象活动列表下有该字段】
    props_operatorTypeVal: {
      type: String,
      default: ''
    },
    // 当前节点数据
    props_singleCondition: {
      type: Object,
      default: () => {}
    },
    // 运算符下拉可选值
    props_operatorList: {
      type: Array,
      default: () => []
    },
    props_padding: {
      type: String,
      default: ''
    }
  });
  const contextData = inject('contextData');
  const operatorData = reactive({
    data_operatorVal: props.props_operatorVal || '',
    data_operatorTypeVal: props.props_operatorTypeVal || '',
    data_inNotinList: ['in', 'notin'],
    data_eleSupportType: ELEMENT_AND_OBJECT_SUPPORT_TYPE
  });

  const cmp_isShowOperatorType = computed(() => {
    return (
      contextData.provideIsSupportDynElement.value &&
      operatorData.data_inNotinList.includes(props.props_singleCondition.operator) &&
      operatorData.data_eleSupportType.includes(props.props_singleCondition.type)
    );
  });
  const cmp_operatorElementList = computed(() => {
    const list = [
      { label: '普通字段([])', value: 'in' },
      { label: '元素列表', value: 'dynelement' }
    ];
    if (operatorData.data_inNotinList.includes(props.props_singleCondition.operator)) {
      list[0].value = props.props_singleCondition.operator;
    }
    return list;
  });
  watch(
    () => props.props_operatorVal,
    (newVal) => {
      operatorData.data_operatorVal = newVal;
    }
  );
  watch(
    () => props.props_operatorTypeVal,
    (newVal) => {
      operatorData.data_operatorTypeVal = newVal;
    }
  );

  const emits = defineEmits(['onOperatorChange', 'onOperatorOtherChange']);
  function onOperatorChange() {
    emits('onOperatorChange', operatorData.data_operatorVal);
  }
  function onOperatorOtherChange() {
    emits('onOperatorOtherChange', operatorData.data_operatorTypeVal);
  }

  function getPopupContainer(triggerNode) {
    // 返回你想要渲染下拉菜单的 DOM 节点
    return selectContainer.value;
  }
  function getPopupContainerType() {
    return selectContainerType.value;
  }
</script>
