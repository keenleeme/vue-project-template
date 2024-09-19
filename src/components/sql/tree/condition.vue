<template>
  <a-row type="flex" class="condition-item">
    <div class="pre-line"></div>
    <!-- 选择字段 -->
    <div>
      <FieldContent
        :props_fieldVal="data_itemData.field"
        :props_commonOptions="cmp_commonOptions"
        :props_allOptions="cmp_allOptions"
        @on-field-change="onFieldChange"
      />
    </div>
    <!-- 选择运算符 -->
    <div class="ml8">
      <OperatorContent
        :props_operatorVal="data_itemData.operator"
        :props_operatorTypeVal="data_itemData.operatorType"
        :props_operatorList="data_operatorList"
        :props_singleCondition="data_itemData"
        @on-operator-change="onOperatorChange"
        @on-operator-other-change="onOperatorOtherChange"
      />
    </div>
    <!-- 值 -->
    <div class="ml8">
      <ValueContent
        ref="ref_valueContentValue"
        :props_value="data_itemData.value"
        :props_singleCondition="data_itemData"
        @on-value-change="onValueChange"
      ></ValueContent>
    </div>
  </a-row>
</template>

<script setup>
  import { computed, inject, onMounted, watch, reactive, ref, nextTick, getCurrentInstance } from 'vue';
  import { Row as ARow } from 'ant-design-vue';
  import { cloneDeep } from 'lodash';
  import { ELEMENT_AND_OBJECT_SUPPORT_TYPE } from '../keytype-op-comtype.js';
  import { setCurrentOperatorList } from '../mixins';
  import FieldContent from './field-content/index.vue';
  import OperatorContent from './operator-content/index.vue';
  import ValueContent from './value-content/index.vue';

  const instance = getCurrentInstance();

  const contextData = inject('contextData');
  const provideData = inject('provideData');

  // const props = { props_singleCondition: {} };
  const props = defineProps({
    props_singleCondition: {
      type: Object,
      default: () => ({})
    }
  });

  const data_itemData = ref(cloneDeep(props.props_singleCondition));
  const data_operatorList = ref([]);
  // const conditionData = reactive({
  //   data_itemData: ,
  //   data_operatorList: [] // 可选运算符列表
  // });

  const ref_valueContentValue = ref(`ref_valueContent${data_itemData.value.id}`);

  const cmp_dynamicListDataSetObj = computed(() => {
    return contextData.provideDynamicListDataSetObj();
  });
  const cmp_id = computed(() => {
    return props.props_singleCondition.id;
  });
  const cmp_dynObjectList = computed(() => {
    return cmp_dynamicListDataSetObj.value.object || [];
  });
  const cmp_dynObjectListValues = computed(() => {
    const obj = cmp_dynObjectList.value.find((item) => item.value === data_itemData.value.name);
    if (obj) return obj.list;
    return [];
  });
  const cmp_commonOptions = computed(() => {
    const { wherePid } = data_itemData.value;
    if (wherePid) {
      return [];
    }
    return provideData.freqUsedFieldOptions;
  });
  const cmp_allOptions = computed(() => {
    const { wherePid } = data_itemData.value;
    if (wherePid) {
      return cmp_dynObjectListValues.value;
    }
    return provideData.allFieldOptions;
  });
  const cmp_operatorsConfig = computed(() => {
    return contextData.provideOperatorsConfig();
  });
  // const cmp_getValueOptionsUrlParamObj = computed(() => {
  //   return propGetValueOptionsUrlParamObj();
  // });

  watch(
    props.props_singleCondition,
    (newval, oldVal) => {
      console.log(cloneDeep(newval), 'cloneDeep(newval)');
      data_itemData.value = cloneDeep(newval);
      if (newval.name !== oldVal.name) {
        setInitialCondition();
      }
    },
    {
      deep: true
    }
  );

  onMounted(() => {
    if (props.props_singleCondition.field) {
      // 首先需要根据字段类型来设置对应的运算符列表及对应的字段值组件
      // 用于类似从SQL转换到树这样的回显
      // 这时不会触发 onFieldChange 之类的
      setInitialCondition();
    }
  });

  function getFieldObjByFieldName(value) {
    const fieldObj = provideData.allFieldOptions.find((obj) => obj.value === value);
    return fieldObj || null;
  }
  function getFieldType(value) {
    const fieldObj = getFieldObjByFieldName(value);
    return fieldObj ? fieldObj.type : 'string';
  }
  function getObjectDynListFieldType(value) {
    const fieldObj = cmp_dynObjectListValues.value.find((item) => item.value === value);
    return fieldObj ? fieldObj.type : 'string';
  }
  function setInitialCondition() {
    const { type, wherePid } = props.props_singleCondition;
    data_operatorList.value = setCurrentOperatorList(type, cmp_operatorsConfig.value, instance);
    if (wherePid) {
      data_operatorList.value = data_operatorList.value.filter((item) => item.value !== 'match');
    }
    setFieldComTypeAndValue(props.props_singleCondition);
  }

  /* 当字段值改变时 可以设置对应的运算符列表及对应值的组件类型及初始值 */
  function onFieldChange(val) {
    data_itemData.value.field = val;
    // 当有切换字段时 强制清空 运算符列表 组件类型及内容
    data_operatorList.value = [];
    data_itemData.value.operator = '';
    resetValueAndComponent();

    nextTick(() => {
      const { field, wherePid } = data_itemData.value;
      if (field) {
        // 获取字段类型
        const type = wherePid ? getObjectDynListFieldType(field) : getFieldType(field);
        data_itemData.value.type = type; // 更改字段名以后 类型就不是原来那个类型了
        // this.local_CachedFieldType = type;
        // 根据选择的字段类型设置运算符列表及默认值
        data_operatorList.value = setCurrentOperatorList(type, cmp_operatorsConfig.value, instance);
        // where条件里的运算符需要过滤掉match
        if (wherePid) {
          data_operatorList.value = data_operatorList.value.filter((item) => item.value !== 'match');
        }
        // 运算符不是match时需要设置默认运算符
        if (data_itemData.value.operator !== 'match') {
          data_itemData.value.operator = data_operatorList.value[0].value;
        }
        setFieldComTypeAndValue(data_itemData.value);
      }
      contextData.provideChangeConditin(cmp_id.value, data_itemData.value, 'field');
    });
  }
  function onOperatorChange(val) {
    data_itemData.value.operator = val;
    if (data_itemData.value.field) {
      // 运算符是in/notin时 新增运算符筛选项需要设置默认值
      if (['in', 'notin'].includes(val) && ELEMENT_AND_OBJECT_SUPPORT_TYPE.includes(data_itemData.value.type)) {
        data_itemData.value.operatorType = val;
      } else {
        data_itemData.value.operatorType = '';
      }
      // 当有运算符切换的时候 强制清空字段值
      data_itemData.value.value = '';
      resetValueAndComponent();
      if (!(Array.isArray(data_itemData.value.keys) && data_itemData.value.keys.length > 0)) {
        setFieldComTypeAndValue(data_itemData.value);
      }
      nextTick(() => {
        contextData.provideChangeConditin(cmp_id.value, data_itemData.value, 'operator');
      });
    }
  }
  function onOperatorOtherChange(val) {
    data_itemData.value.operatorType = val;
    if (data_itemData.value.field) {
      // 当有运算符切换的时候 强制清空字段值
      data_itemData.value.value = '';
      resetValueAndComponent();
      setFieldComTypeAndValue(data_itemData.value);
      nextTick(() => {
        contextData.provideChangeConditin(cmp_id.value, data_itemData.value);
      });
    }
  }
  /**
   * @param 参数1: 值
   * @param {Object} => 参数2:当组件为inputSearch时需要的信息
   */
  function onValueChange(v, inputSearchInfo) {
    if (inputSearchInfo) {
      data_itemData.value.operatorType = inputSearchInfo.isThreshold ? 'dynthreshold' : '';
    }
    data_itemData.value.value = v === undefined || null ? '' : v;
    contextData.provideChangeConditin(cmp_id.value, data_itemData.value, 'value');
  }
  // 重置值组件
  function resetValueAndComponent() {
    ref_valueContentValue.value.resetValueAndComponentNull();
  }
  // 根据字段类型和运算符设置对应值组件
  function setFieldComTypeAndValue(nodeData) {
    // ref_valueContentValue.value = `ref_valueContent${nodeData.id}`;
    nextTick(() => {
      ref_valueContentValue.value.setFieldComTypeAndValue(nodeData);
    });
  }
</script>
