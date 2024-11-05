<template>
  <div :id="cmp_sqlTipTreeRootId" class="ds-sql-tip-tree-root">
    <ComSqlInput
      v-show="!onlyShowTree"
      ref="refComSqlInput"
      :props_manualRefresh="props_manualRefresh"
      :props_freqUsedFieldList="cmp_sortedFreqUsedFieldsList"
      :props_allFieldList="cmp_sortedAllFieldsList"
      :props_isShowTree="rootData.data_isShowTree"
      :props_initialValueToSqlInput="props_vModelSqlValue"
      :props_getValueOptionsUrl="props_getValueOptionsUrl"
      :props_getValueOptionsUrlParamObj="props_getValueOptionsUrlParamObj"
      :props_disabled="props_disabled"
      :props_isShowValue="props_isShowValue"
      :props_paddingRight="props_paddingRight"
      :props_specialEnumWrodList="props_specialEnumWrodList"
      :props_inputMiniSize="props_inputMiniSize"
      :props_aiqlShow="props_aiqlShow"
      :props_translateShow="props_translateShow"
      :props_translateLanguageUrlParams="props_translateLanguageUrlParams"
      :props_onlyDisabledButton="props_onlyDisabledButton"
      :props_dataSource="props_dataSource"
      :props_aiqlType="props_aiqlType"
      :props_dynamicListObj="props_dynamicListObj"
      :props_operatorsConfig="props_operatorsConfig"
      :props_isShowAI="props_isShowAI"
      @ai-trans-aiql="emits('aiTransAiql')"
      @show-ai-result="emits('showAiResult')"
      @search-feedback="(type) => emits('searchFeedback', type)"
      @on-tree-icon-click="onTreeIconClick"
      @on-sql-input-change="onSqlInputChange"
      @on-input-enter="onInputEnter"
      @on-blur="onInputBlur"
      @on-focus="onInputFocus"
      @on-lang-change="onLangChange"
      @on-show-tips="onShowTips"
    />
    <ComTree
      v-if="rootData.data_isShowTree"
      ref="refComTree"
      :props_allFieldList="rootData.data_allFieldsList"
      :props_freqUsedFieldList="rootData.data_freqUsedList"
      :props_sqlToTree="data_treeData"
      :props_realtimeTip="rootData.data_treeToSqlTip"
      :props_isLoadingTree="rootData.data_isLoadingTree"
      @on-tree-to-sql-string-change="onTreeToSqlStringChange"
    />
    <AiQlTip :show-ai-tips="showAiTips" :aiql-guide="aiqlGuide" />
  </div>
</template>

<script setup>
  import { provide, toRefs, reactive, computed, watch, ref, onMounted, onBeforeUnmount } from 'vue';
  import { cloneDeep } from 'lodash';
  import { v4 as uuidv4 } from 'uuid';
  import AiQlTip from './aiqlGuide/index.vue';
  // import Http from '@/common/libs/http.js';
  import ComSqlInput from './input/index.vue';
  import { ALL_NUMBER_TYPE } from './keytype-op-comtype.js';
  import { dispatch, getDOMElement } from './mixins';
  import './style/index.less';
  import ComTree from './tree/index.vue';
  import { EmptyTree } from './tree/sampleTree.js';

  defineOptions({
    name: 'DsSqlTipTree',
    inheritAttrs: false
  });

  const props = defineProps({
    // 项目类型 主要用于区分对应项目的默认值
    props_projectType: {
      type: String,
      default: 'default'
    },
    //
    props_inputWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    props_inputMaxHeight: {
      type: String,
      required: false,
      default: '300px'
    },
    //
    props_treeMinWidth: {
      type: String,
      required: false,
      default: '100%'
    },
    props_treeMaxWidth: {
      type: String,
      required: false,
      default: '1400px'
    },
    props_treeMinHeight: {
      type: String,
      required: false,
      default: '400px'
    },
    props_treeMaxHeight: {
      type: String,
      required: false,
      default: '600px'
    },
    // 添加条件最大数量限制
    props_maxRulesCount: {
      type: Number,
      required: false,
      default: 100
    },
    // 添加组最大数量限制
    props_maxGroupDepth: {
      type: Number,
      required: false,
      default: 5
    },
    // 常用字段
    props_freqUsedFieldList: {
      type: Array,
      required: false,
      default: () => []
    },
    // 所有字段 非必须 如果没有的话 就不进行任何的智能提示
    props_allFieldList: {
      type: Array,
      required: false,
      default: () => []
    },
    // props_vModelSqlValue: {
    //   type: String,
    //   required: true,
    //   default: ''
    // },
    // 获取值列表的 API 路径
    props_getValueOptionsUrl: {
      type: String,
      required: false,
      default: ''
    },
    // 给搜索字段候选值接口的参数 1 日志 2 事件 3 告警
    props_getValueOptionsUrlParamObj: {
      type: Object,
      required: false,
      default: () => ({ searchTypeNum: 3 })
    },
    // 将SQL转为树 通过后台接口 POST 方法
    props_sqlToTreeUrl: {
      type: String,
      required: false,
      default: '/baas/api/v1/grammar/treeTrans'
    },
    // 上面这个API接口的参数
    props_dataSource: {
      type: String,
      required: false,
      default: 'security_logs'
    },
    // 是否禁用
    props_disabled: {
      type: Boolean,
      required: false,
      default: false // true 表示禁止 即 readonly, false表示可编辑
    },
    // 只禁用语法树、翻译按钮 (editor编辑器输入不影响)
    props_onlyDisabledButton: {
      type: Boolean,
      default: false
    },
    props_isAutoCollapse: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否在label后面显示value
    props_isShowValue: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否支持value搜索
    props_supportValueFilter: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是有留出右内边距用于放置语法提示图标
    props_paddingRight: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 是否支持手动刷新,需配置inject
    props_manualRefresh: {
      type: Boolean,
      required: false,
      default: false
    },
    // 非枚举类型需要直接从list里直接获取的特殊字段
    props_specialEnumWrodList: {
      type: Array,
      required: false,
      default: () => []
    },
    // 数据样例
    props_sourceDataExample: {
      type: Array,
      required: false,
      default: () => []
    },
    // input联想下拉 字段、类型、描述 【mini模式下】宽度比设置
    props_inputMiniSize: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否显示 AIQL提示器，默认显示
    props_aiqlShow: {
      type: Boolean,
      default: true
    },
    // 是否显示 翻译，默认显示
    props_translateShow: {
      type: Boolean,
      default: true
    },
    // AiQL语法说明提示器指定参数
    props_aiqlType: {
      type: String,
      default: ''
    },
    // 是否显示 AI
    props_isShowAI: {
      type: Boolean,
      default: false
    },
    // 翻译接口路径
    props_translateLanguageUrl: {
      type: String,
      default: ''
    },
    // 翻译接口参数
    props_translateLanguageUrlParams: {
      type: Object,
      default: () => ({})
    },
    /**
     * @description 运算符选择项是根据字段类型匹配的默认支持详见keytype-op-comtype.js文件，如默认不满足需要特殊处理时，需要传入该配置项
     * @example { string: ['==', '!==', 'match', ...], number: [...] }
     */
    props_operatorsConfig: {
      type: Object,
      default: () => ({})
    },
    // 是否支持元素活动列表
    props_isSupportDynElement: {
      type: Boolean,
      default: false
    },
    // 是否支持阈值活动列表
    props_isSupportDynThreshold: {
      type: Boolean,
      default: false
    },
    // 对象活动列表集合
    props_dynamicListObj: {
      type: Object,
      default: () => ({})
    },
    // 针对于选取的aiql的字段获取对应的下拉值
    getValueOptionsFn: {
      type: Function,
      required: true,
      default: () => () => {}
    },
    getDynamiclistObjDataByEnId: {
      type: Function,
      default: () => () => {}
    },
    getTreeObjBySqlViaApiFn: {
      type: Function,
      required: true,
      default: () => () => {}
    },
    aiqlGuide: {
      type: Array,
      default: () => []
    },
    onlyShowTree: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits([
    'onAddRuleSuccess',
    'onSqlInputChange',
    'onEnter',
    'onBlur',
    'onFocus',
    'onLangChange',
    'aiTransAiql',
    'showAiResult',
    'searchFeedback',
    'onTreeOpenChange'
  ]);
  // model: {
  //     prop: 'props_vModelSqlValue',
  //     event: 'on-sql-input-change'
  //   },
  const props_vModelSqlValue = defineModel();

  const refComSqlInput = ref(null);
  const refsProps = toRefs(props);
  provide('contextData', {
    provideMaxRulesCount: refsProps.props_maxRulesCount,
    provideMaxGroupDepth: refsProps.props_maxGroupDepth,
    getValueOptions: props.getValueOptionsFn,
    getDynamiclistObjDataByEnId: props.getDynamiclistObjDataByEnId,

    provideAddRule: addRule,
    provideDeleteRule: deleteRule,
    provideDeleteRuleKeysOrWhere: deleteRuleKeysOrWhere,
    provideAddGroup: addGroup,
    provideDeleteGroup: deleteGroup,
    provideChangeConditin: changeCondition,
    provideChanngeLogical: changeLogical,
    provideChanngeExpand: changeExpand,

    provideTreeMinWidth: props.props_treeMinWidth, // refsProps.props_treeMinWidth,
    provideTreeMaxWidth: props.props_treeMaxWidth, // refsProps.props_treeMaxWidth,
    provideTreeMinHeight: props.props_treeMinHeight, // refsProps.props_treeMinHeight,
    provideTreeMaxHeight: props.props_treeMaxHeight, // refsProps.props_treeMaxHeight,
    //
    provideInputWidth: refsProps.props_inputWidth,
    provideInputMaxHeight: refsProps.props_inputMaxHeight,
    //
    provideIsAutoCollapse: refsProps.props_isAutoCollapse,
    propsSupportValueFilter: props.props_supportValueFilter,
    propGetValueOptionsUrl: refsProps.props_getValueOptionsUrl,
    propGetValueOptionsUrlParamObj: refsProps.props_getValueOptionsUrlParamObj,

    provideProjectType: refsProps.props_projectType,
    provideIsSupportDynThreshold: refsProps.props_isSupportDynThreshold,
    provideIsSupportDynElement: refsProps.props_isSupportDynElement,
    provideTranslateLanguageUrl: refsProps.props_translateLanguageUrl,
    provideOperatorsConfig: () => props.props_operatorsConfig,
    provideDynamicListDataSetObj: () => props.props_dynamicListObj // 活动列表数据集合【对象，元素，阈值】
  });

  const data_treeData = ref(cloneDeep(EmptyTree));

  const showAiTips = ref(false);

  const rootData = reactive({
    data_isShowTree: false,
    data_isLoadingTree: false,
    // data_treeData: cloneDeep(EmptyTree),
    data_allFieldsList: [],
    data_freqUsedList: [],
    data_treeToSqlTip: '',
    data_currentValue: '',
    data_fieldExistDicList: []
  });

  let local_IsClickOnRoot = false;
  const local_EmptyTree = EmptyTree;
  let local_ClonedTreeData = {};
  /** 用于存储上一次转换成树的SQL值 每次转换前先做比较 如果SQL未发生变化 则不需要再请求接口转换 */
  let local_OldSqlValue = '';
  let local_OldTreeData = {};
  let local_IsOutAddRule = false;

  const cmp_sortedFreqUsedFieldsList = computed(() => {
    const clonedArr = cloneDeep(props.props_freqUsedFieldList);
    clonedArr.sort((a, b) => {
      const aV = a.value.toUpperCase();
      const bV = b.value.toUpperCase();
      if (aV < bV) {
        return -1;
      }
      if (aV > bV) {
        return 1;
      }
      return 0;
    });
    return clonedArr;
  });

  const cmp_sortedAllFieldsList = computed(() => {
    const clonedArr = cloneDeep(props.props_allFieldList);
    clonedArr.sort((a, b) => {
      const aV = a.value.toUpperCase();
      const bV = b.value.toUpperCase();
      if (aV < bV) {
        return -1;
      }
      if (aV > bV) {
        return 1;
      }
      return 0;
    });
    return clonedArr;
  });

  const cmp_sqlTipTreeRootId = computed(() => {
    return `sqlTipTreeRoot${uuidv4()}`;
  });
  watch(
    () => rootData.data_isShowTree,
    (newVal) => {
      emits('onTreeOpenChange', newVal);
    }
  );

  onMounted(() => {
    // 用于点击树意外其他地方关闭树
    getDOMElement().addEventListener('click', onELRootClick, true);
    window.addEventListener('click', clickToCloseTree, false);
    if (props.onlyShowTree) {
      onTreeIconClick();
    }
  });

  onBeforeUnmount(() => {
    getDOMElement().removeEventListener('click', onELRootClick, true);
    window.removeEventListener('click', clickToCloseTree, false);
  });

  function clear() {
    resetTree();
    resetClonedTree();
    resetFieldsList();
  }
  function sortedFreqUsedFieldsList() {
    const clonedArr = cloneDeep(props.props_freqUsedFieldList);
    clonedArr.sort((a, b) => {
      const aV = a.value.toUpperCase();
      const bV = b.value.toUpperCase();
      if (aV < bV) {
        return -1;
      }
      if (aV > bV) {
        return 1;
      }
      return 0;
    });
    return clonedArr;
  }
  function sortedAllFieldsList() {
    const clonedArr = cloneDeep(props.props_allFieldList);
    clonedArr.sort((a, b) => {
      const aV = a.value.toUpperCase();
      const bV = b.value.toUpperCase();
      if (aV < bV) {
        return -1;
      }
      if (aV > bV) {
        return 1;
      }
      return 0;
    });
    return clonedArr;
  }
  function closeTree() {
    if (rootData.data_isShowTree) {
      clear();
      rootData.data_isShowTree = false;
    }
  }
  function onELRootClick() {
    local_IsClickOnRoot = true;
  }
  function clickToCloseTree(e) {
    if (props.onlyShowTree) {
      return;
    }
    const path = e.path || e.composedPath();
    const isClickOnTree = path
      .reduce((prev, curr) => {
        if (curr.id) {
          prev.push(curr.id);
        }
        return prev;
      }, [])
      .includes(cmp_sqlTipTreeRootId.value);
    if (!isClickOnTree) {
      clear();
      rootData.data_isShowTree = false;
      local_IsClickOnRoot = false;
      showAiTips.value = false;
    }
  }
  function onInputEnter() {
    emits('onEnter');
  }
  function onInputBlur() {
    emits('onBlur');
    dispatch('FormItem', 'on-form-blur', rootData.data_currentValue);
  }
  function onInputFocus() {
    emits('onFocus');
  }
  async function getTreeObjBySqlViaApi(sqlStr) {
    try {
      const sourceDataExample = props.props_sourceDataExample.map((v) => v.json);
      const data = {
        queryStr: sqlStr,
        maxRulesCount: props.props_maxRulesCount,
        maxGroupDepth: props.props_maxGroupDepth,
        example: sourceDataExample
      };
      // 目前场景除了/baas/api/v1/grammar/treeEtlTrans 这个接口不需要dataSource参数，其他都需要
      if (props.props_sqlToTreeUrl !== '/baas/api/v1/grammar/treeEtlTrans') {
        data.dataSource = props.props_dataSource;
      }

      const [success, result] = await props.getTreeObjBySqlViaApiFn(data); // ttp.post(props.props_sqlToTreeUrl, data, 'application/json');
      return success ? result : { uiNode: null };
    } catch (error) {
      console.log('get tree obj by sql via api error:==', error);
      return { uiNode: null };
    }
  }
  // 外部添加的条件只有当 field value 完全匹配 并且
  // 当为 == 时 更改为 != 当为 != 时 更改为 ==
  // 当为 in 时 更改为 notin 当为 notin 时 更改为 in
  function traverseTree(inTree, toAddOneRule, hasMatchConditionObj) {
    const { rules } = inTree;
    if (rules && rules.length) {
      rules.forEach((rule) => {
        traverseTree(rule, toAddOneRule, hasMatchConditionObj);
      });
    } else {
      const { field: filedA, operator: opA, type: typeA } = inTree;
      const { field: filedB, operator: opB, value: valB } = toAddOneRule;
      const { value: valA } = inTree;
      if (
        (typeA === 'string' || typeA === 'ip' || typeA === 'timestamp' || typeA === 'enum' || typeA === 'array') &&
        valA
      ) {
        inTree.value = valA;
      }
      if (filedA === filedB && valA === valB) {
        if (opA !== opB && (opA === '==' || opA === '!=') && (opB === '==' || opB === '!=')) {
          inTree.operator = opB;
          hasMatchConditionObj.has = true;
        } else if (opA === opB) {
          hasMatchConditionObj.has = true;
        }
        //
        const opALow = opA.toLowerCase();
        const opBLow = opB.toLowerCase();
        if (opA !== opB && (opALow === 'in' || opALow === 'notin') && (opBLow === 'in' || opBLow === 'notin')) {
          inTree.operator = opB;
          hasMatchConditionObj.has = true;
        } else if (opA === opB) {
          hasMatchConditionObj.has = true;
        }
      }
    }
  }
  function getToAddRuleArr(inObjOrArr) {
    let rulesArr = [];
    const clonedObjOrArr = cloneDeep(inObjOrArr);
    if (Array.isArray(inObjOrArr)) {
      rulesArr = clonedObjOrArr;
    } else {
      rulesArr = [clonedObjOrArr];
    }
    return rulesArr;
  }
  /*
      增加删除条件时 需传入条件节点对象
      基本结构参考 created 生命周期函数中的 rootData.local_EmptyTree 详细说明
    */
  async function comTree_Out_AddRule(objOrArr) {
    // 可以同时添加多个条件
    closeTree();
    const rulesArr = getToAddRuleArr(objOrArr);
    //
    try {
      let newTree = cloneDeep(local_EmptyTree);
      if (props_vModelSqlValue.value) {
        const { uiNode } = await getTreeObjBySqlViaApi(props_vModelSqlValue.value);
        if (uiNode) {
          let existTree = cloneDeep(uiNode);
          //  因为传进来的 tree 是通过后台接口转换的 如果只有一个条件的话 不会有最外层的包装 需要先判断处理
          if (!existTree.rules) {
            existTree = cloneDeep(local_EmptyTree);
            existTree.rules.push(uiNode);
          }
          // *****************************
          const notExistRulesArr = [];
          rulesArr.forEach((oneRuleObj, index) => {
            const hasMatchConditionObj = { has: false };
            traverseTree(existTree, oneRuleObj, hasMatchConditionObj);
            if (!hasMatchConditionObj.has) {
              notExistRulesArr.push(rulesArr[index]);
            }
          });
          // *****************************
          // 如果新添加的条件不存在 则以 AND 的形式添加在最后
          if (notExistRulesArr.length) {
            // 如果最顶层的逻辑连接符不是 AND 的话 需要在最外面再包一层 否则逻辑不对
            if (existTree.condition.toUpperCase() !== 'AND') {
              const clonedEmptyTree = cloneDeep(local_EmptyTree);
              existTree.id = uuidv4();
              clonedEmptyTree.rules.push(existTree);
              clonedEmptyTree.rules = clonedEmptyTree.rules.concat(notExistRulesArr);
              newTree = clonedEmptyTree;
            } else {
              existTree.rules = existTree.rules.concat(notExistRulesArr);
              newTree = existTree;
            }
          } else {
            newTree = existTree;
          }
        }
      } else {
        // 如果输入框为空 则直接添加
        newTree.rules = newTree.rules.concat(rulesArr);
      }
      //
      if (newTree.rules.length) {
        // 整形以后的树结构
        local_IsOutAddRule = true;
        const shapedTreeData = shapeTreeData({ uiNode: cloneDeep(newTree) });
        // 转化成SQL语句写进 sql input 框
        const newSqlStr = getTreeObj2SqlString(shapedTreeData);
        emits('onSqlInputChange', newSqlStr);
        props_vModelSqlValue.value = newSqlStr;
        emits('onAddRuleSuccess', true);
        rootData.data_currentValue = newSqlStr;
      } else {
        console.log('添加条件错误');
        emits('onAddRuleSuccess', false);
        // this.$Message.error('添加条件错误');
      }
    } catch (error) {
      console.log('catch 添加条件错误:==', error);
      emits('onAddRuleSuccess', false);
      // this.$Message.error('添加条件错误');
    }
  }
  /* ==================== 给外部组件调用 END ======================== */
  function resetTree() {
    setTreeData(local_EmptyTree);
  }
  function resetClonedTree() {
    local_ClonedTreeData = null;
  }
  function setTreeData(treeObj) {
    data_treeData.value = cloneDeep(treeObj);
  }
  function setClonedTreeData() {
    local_ClonedTreeData = cloneDeep(data_treeData.value);
  }
  function isFieldInDictionary(field) {
    return props.props_allFieldList.findIndex((obj) => obj.value === field) > -1;
  }
  function shapeSingleRuleValue(inTree, isWhere, whereParentInfo) {
    const { id, name, field, rules, condition, value, operator, operatorType = '', keys, where } = inTree;
    if (inTree.depth) {
      inTree.defaultExpand = true;
      inTree.defaultTreeExpand = true;
    }
    if (rules && rules.length) {
      inTree.condition = condition.toUpperCase();
      if (isWhere) {
        inTree.wherePid = whereParentInfo.id;
        inTree.name = whereParentInfo.name;
      }
      rules.forEach((rule) => {
        shapeSingleRuleValue(rule, isWhere, whereParentInfo);
      });
    } else {
      // 将字段是否存在字典里的结果存放在数组 后面点击语法树事件里 语句未变化时 需要校验
      rootData.data_fieldExistDicList.push(!isFieldInDictionary(field));
      if (!isFieldInDictionary(field) && rootData.data_isShowTree && props.props_projectType === 'default') {
        closeTree();
        // this.$Message.error(`表达式语法中,字段${field || ''}在数据字典中不存在！`);
      }
      /**
       * 对象活动列表类型时 会有keys和where两个属性
       * 1. keys里的数据需要加上父节点Id
       * 2. where时需要加树类型的标识 区分是普通模式还是where模式
       */
      if (keys && Array.isArray(keys) && keys.length) {
        inTree.isObjectDynList = true;
        inTree.defaultExpand = true;
        inTree.keysExpand = true;
        // 处理后端返回数据为null的情况
        inTree.type = inTree.type ? inTree.type : keys[0].type;
        inTree.field = inTree.field ? inTree.field : keys[0].field;
        keys.forEach((item) => {
          item.parentId = inTree.id;
          item.isObjectDynList = true;
          item.defaultExpand = true;
        });
      }
      if (where && typeof where === 'object') {
        inTree.where = shapeTreeData({ uiNode: where }, true, { id, name });
        inTree.where.id = uuidv4();
        inTree.where.name = name;
        inTree.where.wherePid = inTree.id;
        inTree.where.treeType = 'whereTree';
        inTree.where.defaultBtn = true;
        inTree.where.defaultTreeExpand = true;
      }
      inTree.operator = operator.toLowerCase();
      inTree.operatorType = operatorType ? operatorType.toLowerCase() : operator.toLowerCase();
      inTree.value = value;
      inTree.defaultExpand = true;
      /**
       * 如果是where条件下的数据
       * 1. where里面的rules里每条数据需要加上wherePid标识
       * 2. 父节点的name[即对象列表名称] 过滤条件里面的字段需要从当前对象列表的list里面取
       */
      if (isWhere) {
        inTree.wherePid = whereParentInfo.id;
        inTree.name = whereParentInfo.name;
      }
    }
    return inTree;
  }
  function shapeTreeData(inData, isWhere = false, whereParentInfo) {
    rootData.data_fieldExistDicList = [];
    const { uiNode } = inData;
    if (uiNode && !Array.isArray(uiNode) && typeof uiNode === 'object') {
      // 接口返回的数据没有树最外层的结构
      let treeData = cloneDeep(local_EmptyTree);
      // 如果只有一个条件
      if (!uiNode.rules) {
        const singleRule = shapeSingleRuleValue(uiNode, isWhere, whereParentInfo);
        treeData.rules.push(singleRule);
      } else {
        uiNode.id = 'rootNodeId';
        uiNode.defaultExpand = true;
        uiNode.defaultTreeExpand = true;
        treeData = cloneDeep(shapeSingleRuleValue(uiNode, isWhere, whereParentInfo));
      }
      return treeData;
    }
    throw new Error({ message: '语法错误' });
  }
  function onLangChange(val) {
    emits('onLangChange', val);
  }
  function onSqlInputChange(sqlStr) {
    emits('onSqlInputChange', sqlStr);
    props_vModelSqlValue.value = sqlStr;
    rootData.data_currentValue = sqlStr;
  }
  function onTreeToSqlStringChange(isValid, sqlStr) {
    if (isValid) {
      emits('onSqlInputChange', sqlStr);
      props_vModelSqlValue.value = sqlStr;
    } else {
      emits('onSqlInputChange', '');
      props_vModelSqlValue.value = '';
    }
    rootData.data_currentValue = sqlStr;
  }
  async function sql2TreeViaApi(sqlStr) {
    rootData.data_isLoadingTree = true;
    let resp = await getTreeObjBySqlViaApi(sqlStr);
    if (!resp.uiNode) {
      resp = null;
      clear();
      rootData.data_isShowTree = false;
    }
    rootData.data_isLoadingTree = false;
    return resp;
  }
  function setFiledsList() {
    rootData.data_allFieldsList = sortedAllFieldsList();
    rootData.data_freqUsedList = sortedFreqUsedFieldsList();
  }
  function resetFieldsList() {
    rootData.data_allFieldsList = [];
    rootData.data_freqUsedList = [];
  }
  async function onTreeIconClick() {
    rootData.data_isShowTree = !rootData.data_isShowTree;
    // 树打开将SQL转换为树 通过后台接口转换
    if (rootData.data_isShowTree || props.onlyShowTree) {
      showAiTips.value = false;
      setFiledsList();
      setTreeToSqlTip('');
      if (props_vModelSqlValue.value) {
        // 如果SQL语句有变化 则通过接口转换
        if (props.props_vModelSqlValue !== local_OldSqlValue) {
          const respTree = await sql2TreeViaApi(props_vModelSqlValue.value);
          if (respTree) {
            local_IsOutAddRule = false;
            const shapedTreeData = shapeTreeData(respTree);
            setTreeData(shapedTreeData);
            local_OldSqlValue = props_vModelSqlValue.value;
            local_OldTreeData = shapedTreeData;
          }
          // 如果没有变化 则直接用旧值
        } else {
          setTreeData(local_OldTreeData);
          if (rootData.data_fieldExistDicList.some((item) => item)) {
            closeTree();
            // this.$Message.error('表达式语法中,字段在数据字典中不存在！');
          }
        }
      } else {
        rootData.data_fieldExistDicList = [];
        resetTree();
        setClonedTreeData();
      }
    } else {
      clear();
    }
  }
  // 从整棵树中找到对应的节点
  function getTargetRuleObjById(targetId) {
    function getObj(obj) {
      const { id, rules } = obj;
      if (id === targetId) {
        return obj;
      }
      if (rules && rules.length) {
        for (let i = 0, len = rules.length; i < len; i++) {
          const targetObj = getObj(rules[i]);
          if (targetObj) {
            return targetObj;
          }
          if (rules[i].where) {
            const whereObj = getObj(rules[i].where);
            if (whereObj) {
              return whereObj;
            }
          }
        }
      }
    }
    return getObj(local_ClonedTreeData);
  }
  function getTargetGroupParentObjAndIdxByGroupId(targetId) {
    let resultObj = {};
    function getObjAndIdx(inObj) {
      const { rules: inRulesArr } = inObj;
      if (inRulesArr && inRulesArr.length) {
        for (let i = 0, len = inRulesArr.length; i < len; i++) {
          const item = inRulesArr[i];
          if (item.category === 'group') {
            if (item.id === targetId) {
              resultObj = { obj: inObj, idx: i };
              break;
            }
            getObjAndIdx(item);
          }
          if (item.where) {
            if (targetId === item.where.id) {
              resultObj = { obj: inObj, idx: i, whereTree: true };
              break;
            }
            getObjAndIdx(item.where);
          }
        }
      }
    }
    getObjAndIdx(local_ClonedTreeData);
    return resultObj;
  }
  function createEmptyRule(isDylist) {
    const obj = {
      id: uuidv4(),
      category: 'single',
      type: 'string',
      field: '',
      operator: isDylist ? 'match' : '',
      operatorType: 'in',
      value: '',
      isObjectDynList: !!isDylist,
      defaultExpand: true,
      verticalLine: true
    };
    return obj;
  }
  function createEmptyGroup(wherePid, objectName) {
    const obj = {
      id: uuidv4(),
      category: 'group',
      condition: 'AND',
      defaultExpand: true,
      defaultTreeExpand: true,
      rules: [
        {
          id: uuidv4(),
          category: 'single',
          type: 'string',
          field: '',
          operator: '',
          value: '',
          defaultExpand: true
        }
      ]
    };
    if (wherePid) {
      obj.wherePid = wherePid;
      obj.defaultBtn = true;
      obj.rules[0].wherePid = wherePid;
      obj.name = objectName;
      obj.rules[0].name = objectName;
    }
    return obj;
  }
  function addRule(groupId, isObjectDynList = '') {
    setClonedTreeData(); // 总是先深拷贝一份原始数据
    const targetObj = getTargetRuleObjById(groupId);
    if (isObjectDynList) {
      const obj = createEmptyRule(isObjectDynList);
      obj.name = targetObj.keys[0].name;
      obj.parentId = targetObj.id;
      targetObj.keys.push(obj);
      // 如果只有where条件时收起，此时添加字段，收起状态重置为展开状态，避免添加字段被折叠
      if (targetObj.where && !targetObj.keysExpand) {
        targetObj.keysExpand = true;
        targetObj.defaultExpand = true;
        targetObj.where.defaultTreeExpand = true;
      }
    } else {
      const objInfo = createEmptyRule();
      if (targetObj.wherePid) {
        objInfo.wherePid = targetObj.wherePid;
        objInfo.name = targetObj.name;
      }
      targetObj.rules.push(objInfo);
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function deleteRule(groupId, idx, dynListId, delObjDynList) {
    setClonedTreeData();
    const targetObj = getTargetRuleObjById(groupId);
    if (delObjDynList) {
      targetObj.rules[idx].keys = targetObj.rules[idx].keys.filter((item) => item.id !== dynListId);
      // 如果对象活动列表keys为空数组 则这一整条都需要删掉
      if (!targetObj.rules[idx].keys.length) targetObj.rules.splice(idx, 1);
    } else {
      targetObj.rules.splice(idx, 1);
    }
    targetObj.rules.splice(idx, 1);
    // 需要特殊处理当根条件为NOT时 条件被删除后 NOT不在下拉列表中 会导致界面显示为空异常
    // 应该设置为 AND
    if (!local_ClonedTreeData.rules.length) {
      local_ClonedTreeData.condition = 'AND';
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function deleteRuleKeysOrWhere(groupId, currentId, delWhere) {
    setClonedTreeData();
    if (delWhere) {
      const targetObj = getTargetRuleObjById(currentId);
      delete targetObj.where;
    } else {
      const targetGroup = getTargetRuleObjById(groupId);
      targetGroup.rules = targetGroup.rules.filter((item) => item.id !== currentId);
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function addGroup(groupId, wherePid, isCreatWhere = false) {
    setClonedTreeData();
    const targetObj = getTargetRuleObjById(groupId);
    if (isCreatWhere) {
      targetObj.name = targetObj.keys[0].name;
      if (!targetObj.where) {
        const obj = createEmptyGroup(true);
        obj.treeType = 'whereTree';
        obj.defaultTreeExpand = true;
        obj.defaultExpand = true;
        obj.rules[0].wherePid = groupId;
        obj.rules[0].name = targetObj.name;
        targetObj.where = {
          ...obj,
          depth: 0,
          wherePid: wherePid || groupId,
          name: targetObj.name
        };
      } else {
        const depth = targetObj.depth + 1;
        targetObj.where.rules.push(Object.assign(createEmptyGroup(wherePid, targetObj.name), { depth }));
      }
    } else if (wherePid) {
      const depth = targetObj.depth + 1;
      targetObj.rules.push(Object.assign(createEmptyGroup(wherePid, targetObj.name), { depth }));
    } else {
      const depth = targetObj.depth + 1;
      targetObj.rules.push(Object.assign(createEmptyGroup(), { depth }));
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function deleteGroup(groupId) {
    setClonedTreeData();
    const { obj, idx, whereTree = false } = getTargetGroupParentObjAndIdxByGroupId(groupId);
    if (obj && idx > -1) {
      if (whereTree) {
        delete obj.rules[idx].where;
      } else {
        obj.rules.splice(idx, 1);
      }
      setTreeData(local_ClonedTreeData);
      dataTreeDataChanged();
    } else {
      console.log('删除组错误');
    }
  }
  function changeCondition(id, condition, type) {
    const pid = condition.parentId || '';
    // 把 local_ClonedTreeData 传进去 这时拿到的 targetObj就是 local_ClonedTreeData 中的
    // 所以改变targetObj 即改变 local_ClonedTreeData
    setClonedTreeData();
    // 如果parentId存在，说明是对象活动列表
    if (pid) {
      const nodeObj = getTargetRuleObjById(pid);
      if (condition.operator !== 'match') {
        delete nodeObj.keys;
        delete nodeObj.name;
        for (const key in nodeObj) {
          if (key !== 'id' && key !== 'id') {
            nodeObj[key] = condition[key];
          }
        }
        nodeObj.isObjectDynList = false;
        // 对象活动列表切换列表时 需要将keys数组里的所有列表替换为当前
      } else if (type === 'dynName') {
        nodeObj.keys.forEach((item) => {
          item.name = condition.name;
          item.value = condition.value;
        });
        // where里面的字段类型依赖于对象列表的属性
        // 这里对象列表切换时需要把where里面的内容删掉
        if (nodeObj.where) delete nodeObj.where;
      } else {
        const obj = nodeObj.keys.find((item) => item.id === id);
        obj.value = condition.value;
        Object.assign(obj, condition);
      }
    } else {
      const targetObj = getTargetRuleObjById(id);
      targetObj.value = condition.value;
      Object.assign(targetObj, condition);
      // 这里只有当运算符切换为match时才需要在该条数据下面添加对象列表数组keys
      if (type === 'operator' && condition.operator === 'match') {
        condition.keysExpand = true;
        condition.keys = [];
        condition.isObjectDynList = true;
        const objRule = createEmptyRule(true);
        for (const key in objRule) {
          if (key !== 'id') {
            objRule[key] = condition[key];
          }
        }
        objRule.parentId = condition.parentId || id;
        condition.keys.push(objRule);
        Object.assign(targetObj, condition, { id: condition.parentId || id });
      }
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function changeLogical(groupId, v) {
    setClonedTreeData();
    const targetObj = getTargetRuleObjById(groupId);
    targetObj.condition = v;
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function changeExpand(id, type) {
    setClonedTreeData();
    const targetObj = getTargetRuleObjById(id);
    // keys折叠或展开
    if (type === 'keys') {
      targetObj.keysExpand = !targetObj.keysExpand;
      targetObj.keys.forEach((element, index) => {
        if (index === 0) {
          element.defaultExpand = true;
        } else {
          element.defaultExpand = !element.defaultExpand;
        }
      });
      if (targetObj.where) {
        targetObj.where.defaultTreeExpand = !targetObj.where.defaultTreeExpand;
      }
    }
    // where展开折叠
    if (type === 'where') {
      targetObj.defaultBtn = !targetObj.defaultBtn;
      targetObj.where.defaultExpand = !targetObj.where.defaultExpand;
      targetObj.where.rules.forEach((element, index) => {
        if (index === 0) {
          element.defaultExpand = true;
        } else {
          element.defaultExpand = !element.defaultExpand;
          setWhereNodeExpand(element);
        }
      });
    }
    setTreeData(local_ClonedTreeData);
    dataTreeDataChanged();
  }
  function setWhereNodeExpand(group) {
    const { category, rules = [] } = group;
    if (category === 'group') group.defaultTreeExpand = !group.defaultTreeExpand;
    if (Array.isArray(rules) && rules.length) {
      rules.forEach((item) => {
        item.defaultExpand = !item.defaultExpand;
        setWhereNodeExpand(item);
      });
    }
  }
  function isNumberTypeField(fieldType) {
    return ALL_NUMBER_TYPE.includes(fieldType);
  }
  function setTreeToSqlTip(tip) {
    rootData.data_treeToSqlTip = tip;
  }
  // **************************************************
  function validateTree(inTree) {
    let can = true;
    setTreeToSqlTip('');
    //
    const walkRules = (rule) => {
      const { rules: _rules } = rule;
      if (_rules && Array.isArray(_rules) && _rules.length) {
        _rules.forEach((r) => {
          walkRules(r);
        });
      } else {
        const { type, field, operator, operatorType, value, parentId } = rule;
        if (field) {
          if (operator) {
            if (operator !== 'exist' && operator !== 'notexist' && operator !== 'match') {
              if (
                value === null ||
                value === "''" ||
                value === '""' ||
                value === '' ||
                (Array.isArray(value) && !value.length)
              ) {
                can = false;
                setTreeToSqlTip('字段值不能为空');
              }
              // 再做简单基本的类型校验 如number类型且运算符不为 in/notin 时只能输入number
              // 正则是合法的
              if (isNumberTypeField(type) && !operator.includes('in') && operatorType !== 'dynthreshold') {
                const num = Number(value);
                if (typeof num !== 'number' || window.isNaN(num)) {
                  can = false;
                  setTreeToSqlTip('number类型的字段, 字段值非法');
                }
              }
              if (operator.includes('in') && !operator.includes('contains')) {
                if (Array.from(value).pop() === ',' || !value || !value.length) {
                  can = false;
                  setTreeToSqlTip('in/notin运算符对应的字段值不完整');
                }
              }
            }
            if (operator === 'match' && parentId) {
              if (!value) {
                can = false;
                setTreeToSqlTip('字段值不能为空');
              }
            }
          } else {
            can = false;
            setTreeToSqlTip('运算符不能为空');
          }
        } else {
          can = false;
          setTreeToSqlTip('字段名不能为空');
        }
      }
    };
    //
    if (typeof inTree === 'object' && inTree !== null) {
      const { condition, rules } = inTree;
      if (!condition || !rules) {
        can = false;
        setTreeToSqlTip('树结构非法');
      }
      if (rules && Array.isArray(rules) && rules.length) {
        rules.forEach((rule) => {
          walkRules(rule);
          if (rule.isObjectDynList && rule.keys && Array.isArray(rule.keys) && rule.keys.length) {
            rule.keys.forEach((obj) => {
              walkRules(obj);
            });
          }
          if (typeof rule.where === 'object' && rule.where !== null) {
            walkRules(rule.where);
          }
        });
      }
      return can;
    }
    //
    return can;
  }
  function isRegOp(op) {
    return op === '=~' || op === '!~';
  }
  // 获取单个条件
  function getSingleRule({ field, operator, operatorType = '', value, keys, type, wherePid }) {
    const _op = operator.toLowerCase();
    const _opType = operatorType.toLowerCase();
    // 字典里不存在字段的类型和后端保持一致默认处理为string
    const fieldType = wherePid ? type : refComSqlInput.value.getFieldObjByFieldName(field)?.type || 'string';
    const isStringType = refComSqlInput.value.isStringTypeField(fieldType);
    const hasSlash = (val) => {
      if (/^\/\S*\/$/.test(val)) {
        return true;
      }
      return false;
    };
    if (_op.includes('exist')) {
      return `${field} ${operator}`;
    }
    if (_op === 'in' || _op === 'notin') {
      let _value = `[${value}]`;
      if (isStringType) {
        if (Array.isArray(value)) {
          const arr = [];
          value.forEach((item) => {
            item = setValueEscape(item);
            arr.push(`"${item}"`);
          });
          _value = `[${arr.join(',')}]`;
        } else if (typeof value === 'string') {
          // 基本是针对 array 类型
          const val = setValueEscape(value);
          _value = local_IsOutAddRule ? `["${val}"]` : JSON.stringify(value);
        }
      }
      // 处理元素和阈值活动列表语句
      if (_opType === 'dynelement') {
        _value = `dynList:${value}`;
      }
      return `${field} ${operator} ${_value}`;
    }
    // 处理阈值活动列表语句
    if (_opType === 'dynthreshold') {
      const _value = `\${dynList:${value}}`;
      return `${field} ${operator} ${_value}`;
    }

    // 处理对象活动列表语句
    if (keys) {
      const obj = {
        key: [],
        value: [],
        name: ''
      };
      keys.map((item) => {
        obj.key.push(item.field);
        obj.value.push(item.value);
        obj.name = item.name;
      });
      const dynKey = getDynStr(obj.key);
      const dynValue = getDynStr(obj.value);
      const dynKeyStr = obj.key.length > 1 ? `[${dynKey}]` : `${dynKey}`;
      return `${dynKeyStr} match dynList:${obj.name}(${dynValue})`;
    }
    let _value = value;
    if (isStringType && !isRegOp(_op)) {
      const val = setValueEscape(value);
      _value = `"${val}"`;
    } else if (isStringType && isRegOp(_op) && !hasSlash(value)) {
      _value = `/${value}/`;
    }
    return `${field} ${operator} ${_value}`;
  }
  function setValueEscape(value) {
    return value.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
  function getSubRules(rules, condition) {
    return rules
      .map((rule) => {
        if (rule.condition) {
          if (condition !== rule.condition && rule.rules.length > 1) {
            return `( ${treeObj2SqlString(rule)} )`;
          }
          return `${treeObj2SqlString(rule)}`;
        }
        if (rule.keys && rule.where) {
          return `${getSingleRule(rule)} ${treeObj2SqlString(rule.where)}`;
        }
        if (rule.keys) {
          rule.type = rule.type ? rule.type : rule.keys[0].type;
          return `${getSingleRule(rule)}`;
        }
        return getSingleRule(rule);
      })
      .join(` ${condition} `);
  }
  function getDynStr(list) {
    return list.join(',');
  }
  // 获取所有条件
  function treeObj2SqlString(treeObj) {
    const { condition, rules, treeType } = treeObj;
    if (condition === 'NOT') {
      return treeType === 'whereTree'
        ? `where ( ${condition} ${getSubRules(rules, condition)})`
        : `${condition} ${getSubRules(rules, condition)}`;
    }
    if (treeType === 'whereTree') {
      return `where (${getSubRules(rules, condition)})`;
    }
    return getSubRules(rules, condition);
  }
  function getTreeObj2SqlString(treeObj) {
    return treeObj2SqlString(treeObj).trim() /* .replace(/\s+/g, ' ') */;
  }
  /* 手动检测树是否变化 不用watch的deep watch */
  function dataTreeDataChanged() {
    const isValid = validateTree(local_ClonedTreeData);
    if (isValid) {
      local_IsOutAddRule = false;
      const sqlStr = getTreeObj2SqlString(local_ClonedTreeData);
      emits('onSqlInputChange', sqlStr);
      props_vModelSqlValue.value = sqlStr;
      rootData.data_currentValue = sqlStr;
    } else {
      emits('onSqlInputChange', '');
      props_vModelSqlValue.value = '';
      rootData.data_currentValue = '';
    }
  }

  function onShowTips() {
    showAiTips.value = !showAiTips.value;
  }
</script>
