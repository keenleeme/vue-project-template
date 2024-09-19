<template>
  <div class="keys-rule">
    <!-- 字段值 -->
    <div class="field-wrap">
      <div v-for="(item, index) in props_rules" :key="item.id + index" class="item-wrap">
        <template v-if="item.defaultExpand">
          <div class="horizontal-line"></div>
          <FieldContent
            :props_fieldVal="item.field"
            :props_commonOptions="cmp_commonOptions"
            :props_allOptions="cmp_allOptions"
            @on-field-change="(val) => onFieldChange(val, item)"
          />
          <div class="horizontal-line"></div>
        </template>
      </div>
      <!-- 垂直线 -->
      <div v-if="props_verticalLine" class="vertical-line after-line"></div>
    </div>
    <!-- 运算符 -->
    <div :class="[{ 'operator-wrap-fold': props_verticalLine }]">
      <div v-for="(item, index) in props_rules" :key="item.id + index" class="item-wrap">
        <template v-if="item.defaultExpand">
          <div v-if="index === 0" class="horizontal-line"></div>
          <OperatorContent
            v-if="index === 0"
            :props_operatorVal="item.operator"
            :props_operatorTypeVal="item.operatorType"
            :props_singleCondition="item"
            :props_operatorList="ruleData.data_operatorList"
            @on-operator-change="(val) => onOperatorChange(val, item)"
          />
          <div v-if="index === 0" class="horizontal-line"></div>
        </template>
      </div>
    </div>
    <!-- 对象活动列表 -->
    <div :class="[{ 'operator-wrap-fold': props_verticalLine }]">
      <div v-for="(item, index) in props_rules" :key="item.id + index" class="item-wrap">
        <template v-if="item.defaultExpand">
          <div v-if="index === 0" class="horizontal-line"></div>
          <DynContent
            v-if="index === 0"
            :props_dynNameVal="item.name"
            :props_dynObjectList="cmp_dynObjectList"
            @on-object-list-change="(val) => onObjectListChange(val, item)"
          />
          <div v-if="index === 0" class="horizontal-line"></div>
        </template>
      </div>
    </div>

    <!-- 字段值 -->
    <div class="value-wrap">
      <div v-if="props_verticalLine" class="vertical-line pre-line"></div>
      <div v-for="(item, index) in props_rules" :key="item.id + index" class="item-wrap">
        <template v-if="item.defaultExpand">
          <div class="horizontal-line"></div>
          <ValueContent
            :ref="(el) => setItemRef(el, `ref_valueContent${item.id}`)"
            :props_value="item.value"
            :props_singleCondition="item"
            @on-value-change="(val, inputSearchInfo) => onValueChange(val, inputSearchInfo, item)"
          />
        </template>
      </div>
    </div>
    <!-- 添加/删除 -->
    <div class="btns-wrap">
      <div v-for="(item, index) in props_rules" :key="item.id + index" class="item-wrap">
        <template v-if="item.defaultExpand">
          <div class="btns-item">
            <a-button
              v-show="index === props_rules.length - 1"
              type="primary"
              size="small"
              :class="{ 'add-btn': !(index === props_rules.length - 1 && props_showFilterBtn) }"
              @click="addField(item)"
              >添加字段</a-button
            >
            <a-button
              v-if="index === props_rules.length - 1 && props_showFilterBtn"
              style="background: #f16407; color: #fff"
              size="small"
              class="add-btn"
              @click="addFilterConditon(item)"
              >添加过滤条件</a-button
            >
            <DeleteOutlined
              class="del-icon"
              :class="{ 'del-icon-disabled': cmp_delIconDsiable }"
              @click="deleteSingleRule(item)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { nextTick, watch, inject, reactive, getCurrentInstance, computed, onMounted } from 'vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { Button as AButton } from 'ant-design-vue';
  import { ELEMENT_AND_OBJECT_SUPPORT_TYPE } from '../../keytype-op-comtype.js';
  import { setCurrentOperatorList } from '../../mixins';
  import DynContent from '../dyn-content/index.vue';
  import FieldContent from '../field-content/index.vue';
  import OperatorContent from '../operator-content/index.vue';
  import ValueContent from '../value-content/index.vue';

  const instance = getCurrentInstance();

  defineOptions({
    name: 'KeysRule',
    inheritAttrs: false
  });

  const props = defineProps({
    props_rules: {
      type: Array,
      default: () => []
    },
    props_verticalLine: {
      type: Boolean,
      default: true
    },
    props_showFilterBtn: {
      type: Boolean,
      default: true
    }
  });

  const contextData = inject('contextData');
  const provideData = inject('provideData');

  const refsList = {};
  function setItemRef(el, key) {
    refsList[key] = el;
  }

  const ruleData = reactive({
    data_operatorList: [], // 运算符选项列表
    // data_open: false,
    // data_keysList: []
    data_itemData: {}
  });

  const emits = defineEmits(['addFilterConditon', 'deleteSingleRule']);

  const cmp_dynamicListDataSetObj = computed(() => {
    return contextData.provideDynamicListDataSetObj();
  });
  const cmp_dynObjectList = computed(() => {
    return cmp_dynamicListDataSetObj.value.object || [];
  });
  const cmp_commonOptions = computed(() => {
    return provideData.freqUsedFieldOptions.filter((item) => ELEMENT_AND_OBJECT_SUPPORT_TYPE.includes(item.type));
  });
  const cmp_allOptions = computed(() => {
    return provideData.allFieldOptions.filter((item) => ELEMENT_AND_OBJECT_SUPPORT_TYPE.includes(item.type));
  });
  const cmp_dynObjectListValues = computed(() => {
    const obj = cmp_dynObjectList.value.find((item) => item.value === ruleData.data_itemData.name);
    if (obj) return obj.list;
    return [];
  });
  const cmp_delIconDsiable = computed(() => {
    return props.props_rules.length > 1 && !props.props_rules.every((item) => item.defaultExpand);
  });
  const cmp_operatorsConfig = computed(() => {
    return contextData.provideOperatorsConfig();
  });

  onMounted(() => {
    initValueCom();
  });

  watch(
    () => props.props_rules,
    (newVal, oldVal) => {
      if (!oldVal) {
        setInitialCondition();
      }
    },
    {
      deep: true,
      immediate: true
    }
  );

  function initValueCom() {
    props.props_rules.forEach((item) => {
      setValueCom(item);
    });
  }
  function addField(row) {
    contextData.provideAddRule(row.parentId, 'isObjectDynList');
  }
  function addFilterConditon() {
    emits('addFilterConditon');
  }
  function deleteSingleRule(rowData) {
    if (cmp_delIconDsiable.value) return false;
    emits('deleteSingleRule', rowData.id);
  }
  function setInitialCondition() {
    const { type } = props.props_rules[0];
    ruleData.data_operatorList = setCurrentOperatorList(type, cmp_operatorsConfig.value, instance);
  }
  function onFieldChange(fieldval, rowData) {
    console.log('onFieldChange-1');
    rowData.field = fieldval;
    const { field, wherePid } = rowData;
    if (field) {
      // 获取字段类型
      const type = wherePid ? getObjectDynListFieldType(field) : getFieldType(field);
      // 更改字段名以后 类型就不是原来那个类型了
      rowData.type = type;
      // 如果运算符已选match 切换字段的类型不是对象活动列表支持的类型需要重置
      // 根据选择的字段类型设置运算符列表及默认值
      ruleData.data_operatorList = setCurrentOperatorList(type, cmp_operatorsConfig.value, instance);
      // where条件里的运算符需要过滤掉match
      if (wherePid) {
        ruleData.data_operatorList = ruleData.data_operatorList.filter((item) => item.value !== 'match');
      }
      // 运算符不是match时需要设置默认运算符
      if (rowData.operator !== 'match') {
        rowData.operator = ruleData.data_operatorList[0].value;
      }
      resetValueAndComponent(rowData);
      setValueCom(rowData);
    }
    contextData.provideChangeConditin(rowData.id, rowData, 'field');
  }
  function onOperatorChange(val, rowData) {
    rowData.operator = val;
    if (rowData.field) {
      rowData.value = null;
      rowData.operatorType = '';
      contextData.provideChangeConditin(rowData.id, rowData, 'operator');
    }
  }
  function onObjectListChange(val, rowData) {
    props.props_rules.map((item) => {
      item.name = val;
      resetValueAndComponent(item);
      setValueCom(item);
    });
    contextData.provideChangeConditin(rowData.id, rowData, 'dynName');
  }
  function onValueChange(v, inputSearchInfo, rowData) {
    if (inputSearchInfo) {
      rowData.operatorType = inputSearchInfo.isThreshold ? 'dynthreshold' : '';
    }
    rowData.value = v === undefined || null ? '' : v;
    contextData.provideChangeConditin(rowData.id, rowData, 'value');
  }
  function getFieldObjByFieldName(value) {
    const fieldObj = provideData.allFieldOptions.find((obj) => obj.value === value);
    return fieldObj || null;
  }
  function getFieldType(value) {
    const fieldObj = getFieldObjByFieldName(value);
    return fieldObj ? fieldObj.type : 'string';
  }
  function getObjectDynListFieldType(value) {
    const fieldObj = cmp_dynObjectListValues.value.valueValues.find((item) => item.value === value);
    return fieldObj ? fieldObj.type : 'string';
  }
  //  function   getDynListObjectValueOption(name, type) {
  //       this.data_FiledValueComType = this.local_FiledValueComTypeMap.INPUTSEARCH;
  //       let valuelist = [];
  //       const obj = cmp_dynObjectList.value.find((item) => item.value === name);
  //       // 值的数据类型需要与前面字段名称的类型保持一致
  //       // 这里对象活动列表number类型 对应字段属于number【long, int, float, double】这四种类型
  //       // v5.0.2 内置活动列表新增enum类型 字段类型为string类型 可匹配string或内置活动列表里的enum类型
  //       // v5.0.1 新增字段ip类型 可以匹配String类型的值
  //       if (obj) {
  //         valuelist = obj.list.filter((eve) => {
  //           if (ALL_NUMBER_TYPE.includes(type)) return eve.type === 'number';
  //           if (type === 'ip') return eve.type === 'string';
  //           if (type === 'string') return eve.type === 'string' || eve.type === 'enum';
  //           return eve.type === type;
  //         });
  //       } else {
  //         valuelist = [];
  //       }
  //       this.data_valueOptions = valuelist;
  //     }
  // 设置值组件类型
  function setValueCom(rowData) {
    nextTick(() => {
      refsList[`ref_valueContent${rowData.id}`].setFieldComTypeAndValue(rowData);
    });
  }
  // 切换时重置值组件
  function resetValueAndComponent(rowData) {
    rowData.value = null;
    refsList[`ref_valueContent${rowData.id}`].resetValueAndComponentNull();
  }
</script>
