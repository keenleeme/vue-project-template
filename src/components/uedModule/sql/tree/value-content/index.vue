<template>
  <div class="value-content">
    <!-- v-click-outside="handleClose" -->
    <div v-click-outside="handleClose" class="fieldValue">
      <!-- {{ data_filedValueComType.name }} -->
      <component
        :is="data_filedValueComType"
        :id="`component${props_singleCondition.id}`"
        :props_defaultValue="valueData.data_value"
        :props_valueOptions="valueData.data_valueOptions"
        :props_inputSelectSpecial="valueData.data_inputSelectSpecial"
        :props_isThreshold="valueData.data_isThreshold"
        :props_isMultiSelect="valueData.data_isMultiSelect"
        :props_loading="valueData.data_loading"
        :props_isRemoteSearch="valueData.data_isRemoteSearch"
        :props_valueComTop="valueData.data_topValue"
        @set-options-value="setOptionsValue"
        @on-change="onValueChange"
        @on-focus="onFocus"
        @remote-method="remoteMethod"
      />
      <Transition name="fade">
        <ul
          v-if="valueData.data_isShowTips && valueData.data_requestOptions.length !== 0"
          class="select"
          :style="{ top: valueData.data_topValue }"
        >
          <a-spin v-if="valueData.data_loading"></a-spin>
          <li
            v-for="(item, key) in valueData.data_requestOptions"
            :key="key"
            class="select-item"
            :value="item.value"
            :title="item.label"
            @click="handleClickItem(item.value)"
          >
            {{ item.label }}
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup>
  import { watch, reactive, computed, onMounted, inject, markRaw, shallowRef } from 'vue';
  import { Spin as ASpin } from 'ant-design-vue';
  import vClickOutside from '../../ClickOutside';
  // import Http from '@/common/libs/http.js';
  import {
    ALL_NUMBER_TYPE,
    DICTONARY_NUMBER_TYPE,
    FIELDTYPE_COMTYPE_MAP,
    THRESHOLD_SUPPORT_OPERATOR,
    ELEMENT_AND_OBJECT_SUPPORT_TYPE
  } from '../../keytype-op-comtype.js';
  import ComArrayInTags from '../value-coms/arrayInTags.vue';
  import ComTreeValueInputSearch from '../value-coms/input-search.vue';
  import ComTreeValueInput from '../value-coms/input.vue';
  import ComTreeMultiSelect from '../value-coms/multi-select.vue';
  import ComNull from '../value-coms/null.vue';
  import ComTreeValueSelectSearchMulti from '../value-coms/selectSearchMulti.vue';

  defineOptions({
    name: 'ValueContent'
  });

  const emits = defineEmits(['onValueChange']);
  const contextData = inject('contextData');
  const provideData = inject('provideData');

  const props = defineProps({
    props_value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    props_singleCondition: {
      type: Object,
      default: () => {}
    }
  });

  const data_filedValueComType = shallowRef(ComTreeValueInput);
  const data_filedValueComTypeMap = shallowRef({
    INPUTNUMBER: markRaw(ComTreeValueInput),
    INPUTSTRING: markRaw(ComTreeValueInput),
    INPUTSEARCH: markRaw(ComTreeValueInputSearch),
    MULTISELECT: markRaw(ComTreeMultiSelect),
    MULTISELECTSEARCH: markRaw(ComTreeValueSelectSearchMulti),
    NULL: markRaw(ComNull)
  });

  const valueData = reactive({
    data_value: props.props_value || '',
    data_isShowTips: false,
    data_isMultiSelect: false,
    data_topValue: '25px',
    // data_filedValueComType: markRaw(ComTreeValueInput),
    data_valueOptions: [],
    data_isThreshold: false, // 是否是阈值活动列表
    data_inputSelectSpecial: false, // false为默认的select模式，只能选择 ，true的时候为特殊模式
    data_loading: false,
    data_isRemoteSearch: false,
    data_requestOptions: [],
    data_eleSupportType: ELEMENT_AND_OBJECT_SUPPORT_TYPE,
    data_inNotinList: ['in', 'notin']
  });

  const cmp_dynamicListDataSetObj = computed(() => {
    return contextData.provideDynamicListDataSetObj();
  });
  const cmp_dynThresholdList = computed(() => {
    return cmp_dynamicListDataSetObj.value.threshold || [];
  });
  const cmp_dynElementList = computed(() => {
    return cmp_dynamicListDataSetObj.value.element || [];
  });
  const cmp_dynObjectList = computed(() => {
    return cmp_dynamicListDataSetObj.value.object || [];
  });
  const cmp_isShowOperatorType = computed(() => {
    return (
      valueData.data_inNotinList.includes(props.props_singleCondition.operator) &&
      valueData.data_eleSupportType.includes(props.props_singleCondition.type)
    );
  });

  watch(
    () => props.props_value,
    (newVal) => {
      valueData.data_value = newVal;
    }
  );

  onMounted(() => {
    valueData.data_value = props.props_value;
  });
  function handleResize() {
    const id = document.getElementById(`component${props.props_singleCondition.id}`);
    const style = id.getBoundingClientRect();
    valueData.data_topValue = `${style.height + 1}px`;
  }
  function handleClose() {
    valueData.data_isShowTips = false;
  }
  /**
   * @param 参数1: 值
   * @param {Object} => 参数2:当组件为inputSearch时需要的信息
   */
  function onValueChange(v, inputSearchInfo) {
    valueData.data_value = v === undefined || null ? '' : v;
    emits('onValueChange', valueData.data_value, inputSearchInfo);
  }
  function onFocus() {
    valueData.data_isShowTips = true;
  }
  function remoteMethod(keyword) {
    valueData.data_loading = true;
    const { field, wherePid } = props.props_singleCondition;
    getValueOptions(field, wherePid, keyword);
  }
  function setOptionsValue(value) {
    valueData.data_valueOptions = valueData.data_valueOptions.map((item) => {
      if (item.value === value) item.select = false;
      return item;
    });
  }
  function resetValueAndComponentNull() {
    valueData.data_value = '';
    data_filedValueComType.value = ComNull;
  }
  function setFieldComTypeAndValue(nodeData) {
    const {
      type, // 字段类型
      field, // 字段
      operator, // 运算符
      operatorType = '', // 运算符类型
      name: dynName, // 对象列表名称
      wherePid, // where语句pid
      value // 字段值
    } = nodeData;
    const lowerOp = operator.toLowerCase();
    const lowerOpType = operatorType.toLowerCase();
    // 根据选择的字段类型设置值对应的组件类型
    if (lowerOp === 'exist' || lowerOp === 'notexist') {
      data_filedValueComType.value = ComNull;
      nodeData.value = null;
      valueData.data_isShowTips = false;
      return; // 如果是存在或不存在 则设置完成后直接返回即可 无需进行后续动作
    }

    // 进行后续动作
    data_filedValueComType.value = data_filedValueComTypeMap.value[FIELDTYPE_COMTYPE_MAP[type]];

    // 如果字段属于number类型 支持阈值活动列表 并且运算符是阈值活动列表支持的 值的组件需要处理为可搜索的input框
    if (
      DICTONARY_NUMBER_TYPE.includes(type) &&
      contextData.provideIsSupportDynThreshold.value &&
      THRESHOLD_SUPPORT_OPERATOR.includes(lowerOp)
    ) {
      data_filedValueComType.value = ComTreeValueInputSearch;
      nodeData.value = null;
      valueData.data_inputSelectSpecial = true;
      valueData.data_isThreshold = true;
      valueData.data_valueOptions = cmp_dynThresholdList.value;
    }

    // 如果是布尔组件 则设置候选项及默认值
    if (type === 'boolean') {
      valueData.data_isMultiSelect = false;
      valueData.data_valueOptions = [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ];
      nodeData.value = value !== null && value !== undefined ? value.toString() : 'true'; // 设置默认值
      // 如果是多选组件 则需要设置可选项
    } else if (type === 'enum') {
      // 枚举值in/notin时分两种情况 1.普通select多选 2. where模式下需要用到多选可搜索组件
      if (!lowerOp.includes('in')) {
        valueData.data_isMultiSelect = false;
        valueData.data_isRemoteSearch = !!wherePid;
        valueData.data_valueOptions = getFieldList(field);
      } else if (lowerOp.includes('in') && wherePid) {
        data_filedValueComType.value = ComTreeValueSelectSearchMulti;
        nodeData.value = null;
        getValueOptions(field, wherePid, '', value);
      } else {
        valueData.data_isMultiSelect = true;
        valueData.data_isRemoteSearch = !!wherePid;
        valueData.data_valueOptions = getFieldList(field);
      }
      nodeData.value = value || []; // 设置默认值
      // 如果是array类型 并且是 in/notin运算符的话
    } else if (lowerOp === 'in' || lowerOp === 'notin') {
      if (lowerOpType === 'dynelement') {
        data_filedValueComType.value = data_filedValueComTypeMap.value.MULTISELECT;
        valueData.data_valueOptions = filterList(cmp_dynElementList.value, type);
        nodeData.value = value || '';
      } else {
        valueData.data_isRemoteSearch = !!wherePid;
        if (valueData.data_eleSupportType.includes(type)) {
          // nodeData.operatorType = operatorType || cmp_operatorElementList.value[0].value;
        }
        data_filedValueComType.value = ComArrayInTags;
        nodeData.value = value || [];
      }
    } else if (wherePid) {
      valueData.data_isRemoteSearch = !!wherePid;
      data_filedValueComType.value = data_filedValueComTypeMap.value.INPUTSEARCH;
      nodeData.value = value || null;
      valueData.data_inputSelectSpecial = true;
      valueData.data_isThreshold = false;
      // 其他组件设置相应的默认值
    } else {
      nodeData.value = value || value === 0 ? value : ''; // 设置默认值
    }

    // match时设置对象列表默认值 和 对应属性的数据
    if (lowerOp === 'match') {
      nodeData.name = dynName || cmp_dynObjectList.value[0]?.value;
      getDynListObjectValueOption(nodeData.name, type);
    }

    if ((type !== 'enum' && type !== 'boolean') || wherePid) {
      getValueOptions(field, wherePid, '', value);
    }
    if (ALL_NUMBER_TYPE.includes(type) && !cmp_isShowOperatorType.value && !wherePid) {
      valueData.data_requestOptions = cmp_dynThresholdList.value;
    } else {
      valueData.data_requestOptions = [];
      valueData.data_isShowTips = false;
    }
  }
  function getFieldList(value) {
    const fieldObj = getFieldObjByFieldName(value);
    return fieldObj ? fieldObj.list : [];
  }
  function getFieldObjByFieldName(value) {
    const fieldObj = provideData.allFieldOptions.find((obj) => obj.value === value);
    return fieldObj || null;
  }
  function getDynListObjectValueOption(name, type) {
    data_filedValueComType.value = data_filedValueComTypeMap.value.INPUTSEARCH;
    let valuelist = [];
    const obj = cmp_dynObjectList.value.find((item) => item.value === name);
    // 值的数据类型需要与前面字段名称的类型保持一致
    // 这里对象活动列表number类型 对应字段属于number【long, int, float, double】这四种类型
    // v5.0.2 内置活动列表新增enum类型 字段类型为string类型 可匹配string或内置活动列表里的enum类型
    // v5.0.1 新增字段ip类型 可以匹配String类型的值
    // v5.1.0 [ip类型] 可以匹配【String,ip】类型的值 [string类型] 保持原来仅支持【string，enum】的值
    if (obj) {
      valuelist = obj.list.filter((eve) => {
        if (ALL_NUMBER_TYPE.includes(type)) return eve.type === 'number';
        if (type === 'ip') return eve.type === 'string' || eve.type === 'ip';
        if (type === 'string') return ['string', 'enum'].includes(eve.type);
        return eve.type === type;
      });
    } else {
      valuelist = [];
    }
    valueData.data_valueOptions = valuelist;
  }
  function filterList(list, type) {
    return list.filter((item) => {
      if (type === 'string') return ['string', 'regular'].includes(item.type);
      if (ALL_NUMBER_TYPE.includes(type)) return item.type === 'number';
      return item.type === type;
    });
  }
  function handleClickItem(value) {
    if (data_filedValueComType.value === ComArrayInTags) {
      const arr = [...valueData.data_value, ...value.split(',')];
      valueData.data_value = [...new Set(arr)];
    } else {
      valueData.data_value = value;
    }
    valueData.data_isShowTips = false;
    emits('onValueChange', valueData.data_value);
  }
  /**
   * 在 指标及模型 中，字段值的提示不需要通过接口远程搜索
   * 只需要针对enum及boolean类型做提示
   * enum取自带list，boolean 类型自己设置
   * 3.5.1 统一全部改成如上需求说明 即 enum 及 boolean 不做远程搜索
   * v5.0.1 where条件时值过滤新增固定接口/baas/api/v1/dynamiclist/findObjDataByEnId
   */
  async function getValueOptions(field, wherePid = '', keyword = '', fieldValue) {
    console.log(33333);
    const getValueOptionsFn = contextData.getValueOptions;
    if (wherePid) {
      try {
        let selectedList = '';
        // string类型 并且是in/notin时 无需传入selectedList
        const { type, operator } = props.props_singleCondition;
        if (!(type === 'string' && operator.includes('in'))) {
          if (fieldValue && Array.isArray(fieldValue)) selectedList = fieldValue.join(',');
          if (fieldValue && typeof fieldValue === 'string') selectedList = fieldValue;
        }

        const getDynamiclistObjDataByEnIdFn = contextData.getDynamiclistObjDataByEnId;
        const [success, data] = await getDynamiclistObjDataByEnIdFn({
          field,
          enId: props.props_singleCondition.name || '',
          limit: 100,
          keyword,
          selectedList
        });
        // TODO
        // await Http.get('/baas/api/v1/dynamiclist/findObjDataByEnId', {
        //   field,
        //   enId: props.props_singleCondition.name || '',
        //   limit: 100,
        //   keyword,
        //   selectedList,
        // });
        valueData.data_loading = false;
        const valueList = props.props_singleCondition.value;
        if (success) {
          const list = data.map((item) => ({
            label: item.label ? (item.label !== item.value ? `${item.label}(${item.value})` : item.value) : item.value,
            value: item.value,
            select: Array.isArray(valueList) ? valueList.includes(item.value) : false
          }));
          valueData.data_valueOptions = list;
          valueData.data_requestOptions = list;
        }
      } catch (error) {
        valueData.data_requestOptions = [];
        valueData.data_valueOptions = [];
        valueData.data_isShowTips = false;
        valueData.data_loading = false;
      }
    } else if (getValueOptionsFn) {
      try {
        console.log(44444);
        // TODO
        // await Http.get(contextData.propGetValueOptionsUrl.value, {
        //   field,
        //   operator: props.props_singleCondition.operator,
        //   ...contextData.propGetValueOptionsUrlParamObj.value
        // });
        // const { data } = resp;
        const [success, data] = await getValueOptionsFn({
          field,
          operator: props.props_singleCondition.operator,
          ...contextData.propGetValueOptionsUrlParamObj.value
        });
        if (success) {
          valueData.data_requestOptions = data.map((obj) => ({
            label: obj.label ? (obj.label !== obj.value ? `${obj.label}(${obj.value})` : obj.value) : obj.value,
            value: obj.value
          }));
        }
      } catch (error) {
        console.log('get value Options error:==', error);
        valueData.data_requestOptions = [];
        valueData.data_isShowTips = false;
      }
    }
  }

  defineExpose({
    resetValueAndComponentNull,
    setFieldComTypeAndValue
  });
</script>
