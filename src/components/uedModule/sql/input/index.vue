<template>
  <div class="sql-input-root">
    <!-- <span
      v-if="data_noFieldsListTip"
      class="noTip">
      无字典列表 不进行智能提示
    </span> -->
    <div
      class="input-with-icon-wrapper"
      :style="{ background: cmp_isDisabled && !props_onlyDisabledButton ? 'var(--background-disabled)' : '' }"
    >
      <!-- icon -->
      <div
        ref="refTreeIconDiv"
        :class="['tree-icon-div', cmp_isDisabled || props_onlyDisabledButton ? 'disabled' : '']"
        @click.stop="onTreeIconClick"
      >
        <!-- <IconOpenTree /> -->
        <img v-if="config.mode !== 'dark'" src="./icon/openTree.svg" />
        <img v-else src="./icon/openTreeDark.svg" />
        <!-- <svg class="iconfont" aria-hidden="true">
          <use xlink:href="#icon-com-organization-line"></use>
        </svg> -->
      </div>
      <!-- editor -->
      <div
        ref="refInputRoot"
        :class="['input-root', { 'no-tips': !props_aiqlShow }]"
        :style="{
          'padding-right': `${props_paddingRight}px`,
          width: `calc(100% - ${props_isShowAI && cpm_isShowAI ? cpm_getWidth : 48}px)`
        }"
      >
        <div ref="refEditorRootDiv" class="editor-root-div"></div>
        <ComAnimationDiv v-if="inputData.data_isShowAnimation" />
      </div>
      <!-- <div v-if="props_isShowAI && cpm_isShowAI" class="ai-logo" @click="$emit('aiTransAiql')">
        <img src="../images/chatHide.webp" alt="" />
        <Poptip
          :value="cpm_showAiAnswer"
          placement="bottom-start"
          class="poptip-feedback"
          @on-popper-hide="onAiTipHide"
        >
          <template #content>
            <div class="tip-feedback">
              <div v-if="cmp_incidentAI === 'success'">
                <div class="show-result">
                  <span class="title">结果反馈</span>
                  <span class="show" @click.stop="showResult">显示结果</span>
                </div>
                <div class="bnts">
                  <a-button type="primary" size="small" @click.stop="$emit('searchFeedback', 1)">查询准确</a-button>
                  <a-button type="primary" size="small" @click.stop="$emit('searchFeedback', 0)">查询不准</a-button>
                </div>
              </div>
              <div v-else-if="cmp_incidentAI === 'error'">
                <p>抱歉，我未能理解，</p>
                <p>能描述得更具体一些吗？</p>
              </div>
            </div>
          </template>
        </Poptip>
      </div> -->
      <div :class="['operate-wrap', cmp_isDisabled ? 'disabled' : '']">
        <!-- <div
          v-if="props_translateShow"
          :class="['lang-icon-wrap', { disabled: props_isShowTree || props_onlyDisabledButton }]"
        >
          <a-spin
            v-if="inputData.data_language_loading"
            style="display: inline-block"
            :class="['lang-icon-loading', { disabled: cmp_isDisabled }]"
          />
          <svg
            v-if="inputData.data_language === 'zh'"
            :class="['iconfont', { disabled: props_isShowTree || props_onlyDisabledButton }]"
            aria-hidden="true"
            @click="changeLanguage('en')"
          >
            <use xlink:href="#icon-AIQL-English-line"></use>
          </svg>
          <svg
            v-if="inputData.data_language === 'en'"
            :class="['iconfont', { disabled: props_isShowTree || props_onlyDisabledButton }]"
            aria-hidden="true"
            @click="changeLanguage('zh')"
          >
            <use xlink:href="#icon-AIQL-Chinese-line"></use>
          </svg>
        </div> -->
        <!-- AiQLTip -->

        <a-tooltip v-if="props_aiqlShow" placement="top">
          <template #title>
            <span>语法说明</span>
          </template>
          <InfoCircleOutlined @click.stop="showTips" />
        </a-tooltip>

        <!-- <div v-if="props_aiqlShow" class="aiql-tip-btn-wrap">
          <svg class="iconfont" aria-hidden="true" @click="showTip">
            <use xlink:href="#icon-com-explain-line"></use>
          </svg>
        </div> -->
      </div>
    </div>
    <div v-if="!props_isShowTree && cmp_hasFieldsList" class="tip-div-wrapper-root">
      <div v-if="inputData.data_isGetValueOptionsLoading" class="spin-div">
        <a-spin size="large"></a-spin>
      </div>
      <ol
        v-if="inputData.data_isShowList"
        ref="refOlRoot"
        class="ol-root"
        :style="{
          width: contextData.provideInputWidth,
          'max-height': contextData.provideInputMaxHeight
        }"
      >
        <span
          v-if="
            inputData.data_tipType === 'FIELD' &&
            !inputData.data_tipMode.includes('FILTER') &&
            props_freqUsedFieldList.length
          "
          class="group-tip-text"
        >
          常用字段
        </span>
        <div
          v-for="(item, index) in inputData.data_toDispOptions"
          :key="`${item.value}-${item.label}-${index}`"
          class="single-li-div"
        >
          <span
            v-if="
              props_freqUsedFieldList.length &&
              props_freqUsedFieldList.length === index &&
              inputData.data_tipType === 'FIELD'
            "
            class="group-tip-text"
          >
            所有字段
          </span>
          <li
            class="single-li"
            :title="cmp_singleLiTitle(item)"
            :style="{
              backgroundColor:
                inputData.data_optionIndex === index || inputData.data_hoverIndex === index ? '#eee' : 'transparent',
              color: inputData.data_optionIndex === index || inputData.data_hoverIndex === index ? '#1E2435' : ''
            }"
            :data-value="typeof item.value === 'boolean' ? `${item.value}` : item.value"
            :data-label="item.label"
            :data-type="item.type"
            :data-index="`${inputData.data_currentFocusSqlInputId}&&&&${index}`"
            @mouseover="onSingleLiMouseOver"
            @mouseout="onSingleLiMouseOut"
          >
            <img v-if="inputData.data_tipImgSrc" class="icon-img" :src="inputData.data_tipImgSrc" alt="field_icon" />
            <div class="li-span-wrapper" :class="{ 'li-span-wrapper-mini': props_inputMiniSize }">
              <!-- 字段名 -->
              <span
                v-if="
                  props_isShowValue &&
                  item.label !== item.value &&
                  item.value !== 'NO_OPTIONS' &&
                  !item.label.includes(`(${item.value})`)
                "
                class="spana field"
              >
                <span v-if="item.superObject" class="field-dylist">{{ item.superObject }}</span>
                {{ `${item.label}(${item.value})` }}
              </span>
              <span v-else class="spana field">
                <span v-if="item.superObject" class="field-dylist">{{ item.superObject }}</span>
                {{ item.label }}
              </span>
              <!-- 字段类型 -->
              <span
                class="spana type"
                :style="{
                  opacity: inputData.data_optionIndex === index || inputData.data_hoverIndex === index ? 1 : 0
                }"
              >
                {{ item.type || '' }}
              </span>
              <!-- 字段描述 -->
              <span
                class="spana desc"
                :style="{
                  opacity: inputData.data_optionIndex === index || inputData.data_hoverIndex === index ? 1 : 0
                }"
              >
                {{ item.desc || '' }}
              </span>
            </div>
          </li>
        </div>
      </ol>
    </div>
  </div>
</template>

<script setup>
  import {
    inject,
    ref,
    watch,
    nextTick,
    reactive,
    computed,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    watchEffect
  } from 'vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { Spin as ASpin, Tooltip as ATooltip } from 'ant-design-vue';
  // import { mapMutations } from 'vuex';
  import CodeMirror from 'codemirror';
  import 'codemirror/addon/display/autorefresh';
  // import 'codemirror/lib/codemirror.css';
  import { cloneDeep, findLastIndex, uniqBy } from 'lodash';
  import { storeToRefs } from 'pinia';
  import PinyinEngine from 'pinyin-engine';
  import { v4 as uuidv4 } from 'uuid';
  import { useThemeStore } from '@/store';
  // import API from '@/common/apis/common';
  // import EventBus from '@/common/libs/bus.js';
  // import HTTP from '@/common/libs/http.js';
  import {
    ALL_OPERATORS,
    ALL_LOGIC_OPERATOR,
    ELEMENT_AND_OBJECT_SUPPORT_TYPE,
    ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT
  } from '../keytype-op-comtype.js';
  import { setCurrentOperatorList } from '../mixins.js';
  import ComAnimationDiv from './animation.vue';
  import customizeMode from './bassElMode.js';
  import elementImgSrc from './icon/element.png';
  import fieldImgSrc from './icon/field1.png';
  import logicalImgSrc from './icon/logical1.png';
  import objectImgSrc from './icon/object.png';
  import opImgSrc from './icon/op1.png';
  // import IconOpenTree from './icon/openTree.svg?component';
  import thresholdImgSrc from './icon/threshold.png';
  import valImgSrc from './icon/val1.png';

  // console.log(opTreeMode.render(),'opTreeMode')

  const instance = getCurrentInstance();
  defineOptions({
    inheritAttrs: false
  });
  const emits = defineEmits([
    'onTreeIconClick',
    'onBlur',
    'onFocus',
    'onInputEnter',
    'showAiResult',
    'onLangChange',
    'onSqlInputChange',
    'onShowTips'
  ]);

  const props = defineProps({
    props_freqUsedFieldList: {
      type: Array,
      required: false,
      default: () => []
    },
    props_allFieldList: {
      type: Array,
      required: false,
      default: () => []
    },
    props_isShowTree: {
      type: Boolean,
      required: true
    },
    props_initialValueToSqlInput: {
      type: String,
      required: false,
      default: ''
    },
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
      default: () => ({})
    },
    // 设置readonly（全部禁用操作）
    props_disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // 只禁用语法树、翻译按钮 (editor编辑器输入不影响)
    props_onlyDisabledButton: {
      type: Boolean,
      default: false
    },
    props_isShowValue: {
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
    // 是否支持手动刷新,需配置injec
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
    // input联想下拉字段、类型、描述 【mini模式下】宽度比设置
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
    // AiQL语法提示器指定参数
    props_aiqlType: {
      type: String,
      default: ''
    },
    // 是否显示 AI
    props_isShowAI: {
      type: Boolean,
      default: false
    },
    // 翻译接口参数
    props_translateLanguageUrlParams: {
      type: Object,
      default: () => ({})
    },
    // 字典数据源
    props_dataSource: {
      type: String,
      default: 'security_logs'
    },
    props_operatorsConfig: {
      type: Object,
      default: () => ({})
    },
    // 活动列表数据集
    props_dynamicListObj: {
      type: Object,
      default: () => ({})
    },
    // 是否支持阈值活动列表
    props_isSupportDynThreshold: {
      type: Boolean,
      default: false
    }
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  const contextData = inject('contextData');

  const inputData = reactive({
    data_currentFocusSqlInputId: uuidv4(),
    // 用于提示的项
    data_toDispOptions: [],
    data_isShowList: false,
    data_isGetValueOptionsLoading: false,
    //
    data_optionIndex: 0,
    data_hoverIndex: -1,
    //
    data_tipType: 'FIELD',
    data_tipMode: 'END_AFTER_SPACE',
    //
    data_tipImgSrc: fieldImgSrc,
    // 如果没有字段列表 则不进行任何智能提示
    data_noFieldsListTip: false,
    // 是否显示一个小动画
    data_isShowAnimation: false,
    // 全局监听点击事件的元素
    windowClickTarget: null,
    // en / zh
    data_language: 'en',
    data_language_loading: false,
    data_language_chinese_val: '',
    data_language_english_val: '',
    data_languageChineseEditorShow: false,
    data_modeEventName: `on-lang-change-${uuidv4()}` // 每个实例保持唯一
  });

  // 计算属性
  const cpm_getWidth = computed(() => {
    // 告警监控存在 偏好设置按钮
    const flag = false; // this.$route.name === 'AlarmList';
    return flag ? 170 : 118;
  });
  const cpm_isShowAI = computed(() => {
    // 看配置是否打开，同时恒脑校验是否通过
    // return this.$store.state.state_isHengNaoAuthorization && localStorage.getItem('hengnaoSwitch') === 'true';
    return false;
  });
  const cpm_showAiAnswer = computed(() => {
    return cmp_incidentAI.value === 'error' || cmp_incidentAI.value === 'success';
  });

  const cmp_incidentAI = computed(() => {
    // return this.$store.state.incidentAi;
    return false;
  });
  const cmp_dynThresholdList = computed(() => {
    return props.props_dynamicListObj.threshold || [];
  });
  const cmp_dynElementList = computed(() => {
    return props.props_dynamicListObj.element || [];
  });
  const cmp_dynObjectList = computed(() => {
    return props.props_dynamicListObj.object || [];
  });
  const cmp_hasFieldsList = computed(() => {
    return props.props_allFieldList.length > 0;
  });
  const cmp_isDisabled = computed(() => {
    return props.props_disabled || inputData.data_language === 'zh';
  });
  const cmp_singleLiTitle = computed(() => {
    return (row) => {
      if (inputData.data_tipType === 'FIELD') {
        const { label = '', value, type = '暂无', desc = '暂无' } = row;
        if (props.props_isShowValue && label !== value && value !== 'NO_OPTIONS' && !label.includes(`(${value})`)) {
          return `字段：${label}(${value})  类型：${type}  描述：${desc}`;
        }
        return `字段：${label}  类型：${type}  描述：${desc}`;
      }
      return '';
    };
  });

  // 监听
  // watch(
  //   () => contextData.refresh.value,
  //   (val) => {
  //     if (val.flag && props.props_manualRefresh) {
  //       refreshInp();
  //     }
  //   },
  //   {
  //     deep: true
  //   }
  // );
  watch(
    () => props.props_isShowTree,
    (newVal) => {
      enableDisableEditor(newVal);
      setReadonlyCursor(newVal);
    }
  );
  watch(
    () => props.props_initialValueToSqlInput,
    (newVal) => {
      // 重置
      if (newVal === '' && inputData.data_language === 'zh') changeLanguage('en');

      // 如果设置的值与原来的值一样 则无需动作
      if (newVal !== getSqlValue()) {
        // 如果当前语言为中文模式，需要翻译内容
        if (inputData.data_language === 'zh') {
          inputData.data_language_english_val = newVal;
          // 值是否为空
          if (newVal) {
            language_translate(newVal);
          } else {
            setSqlValue(newVal);
          }
        } else {
          setSqlValue(newVal);
        }
      }
    }
  );
  watch(
    () => props.props_allFieldList,
    (newVal) => {
      if (newVal && newVal.length) {
        initialPinyinEngine();
        if (refEditorRootDiv.value) {
          initialMountedEvents();
        }
      }
    }
  );
  watch(
    () => inputData.data_toDispOptions,
    () => {
      inputData.data_optionIndex = -1;
      local_dataToDispOptionsLength = inputData.data_toDispOptions.length;
    }
  );
  watch(
    cmp_isDisabled,
    (newVal) => {
      nextTick(() => {
        enableDisableEditor(newVal);
        enableDisableTreeIcon(newVal);
      });
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.props_onlyDisabledButton,
    (newVal) => {
      enableDisableTreeIcon(newVal);
    }
  );
  /**
   * 针对props_aiqlType动态变化的场景，需要做监听，实现实时响应
   * 这里应该只针对弹窗开启的时候，相关逻辑在 aiql 模块统一处理（数组第三位作为占位符）
   */
  // watch(
  //   () => props.props_aiqlType,
  //   (newVal) => {
  //     this.vuex_setAiQLTipShow([null, newVal, true]);
  //   }
  // );

  // 定义一些非响应式的内容
  let local_inputValue = '';
  let local_cursorObj = { line: 0, ch: 0 };
  const local_contentByCursorObj = {
    beforeChar: '',
    before2Char: '',
    beforeContent: '',
    lastWord: '',
    last2Word: '',
    last3Word: '',
    last4Word: '',
    afterChar: '',
    afterWord: '',
    after2Word: '',
    afterContent: '',
    matchBeforeWord: ''
  };
  //
  let local_sortedFreqList = [];
  let local_sortedAllList = [];
  //
  let local_dataToDispOptionsLength = 0;
  let local_isOlDisablePointerEvents = false;
  //
  let local_onCursorActivityChangeTimeoutId = null;
  let local_clonedToDispOptions = [];
  let local_pinyinEngine = null;
  let Editor = null;

  const refEditorRootDiv = ref(null);
  const refInputRoot = ref(null);
  const refOlRoot = ref(null);
  const refTreeIconDiv = ref(null);

  onMounted(() => {
    if (!Editor) {
      // 如果没有字段列表 则只初始化输入框
      Editor = initialEditor(refEditorRootDiv.value);
      window.addEventListener('mousedown', windowClick, true);
      refInputRoot.value.addEventListener('click', handleOpenEditorByChinese);
      addEssentialEvents();
      // 有字段列表 才初始化拼音引擎及注册编辑器事件
      if (cmp_hasFieldsList.value) {
        initialPinyinEngine();
        initialMountedEvents();
      }
      onInputBlur(); // 默认初始化时让输入框失焦
    }
  });

  onBeforeUnmount(() => {
    // TODO
    offEvents();
    local_onCursorActivityChangeTimeoutId = null;
    window.removeEventListener('mousedown', windowClick, true);
    refInputRoot.value.removeEventListener('click', handleOpenEditorByChinese);
    // TODO
    // EventBus.$off(inputData.data_modeEventName);
  });

  function showResult() {
    emits('showAiResult');
  }
  function onAiTipHide() {
    // this.$store.commit('mutation_setINCIDENT_AI', 'hide');
  }
  // ...mapMutations({
  //   vuex_setAiQLTipShow: 'mutation_setAiQLTipShow'
  // }),
  // showTip(event) {
  //   if (props.props_aiqlType) {
  //     this.vuex_setAiQLTipShow([event, props.props_aiqlType]);
  //   } else {
  //     this.vuex_setAiQLTipShow(event);
  //   }
  // },
  function changeLanguage(val) {
    // AIQL树展开时，禁用翻译
    if (props.props_isShowTree || props.props_onlyDisabledButton) return;

    // TODO
    // EventBus.$emit(inputData.data_modeEventName, val);
    // 只针对中文做处理即可
    if (val === 'zh') {
      // 翻译前，先把英文数据缓存
      const sqlVal = getSqlValue();
      inputData.data_language_english_val = sqlVal;

      // 调用接口，执行翻译
      language_translate(sqlVal);
    } else {
      setSqlValue(inputData.data_language_english_val);
    }
    inputData.data_language = val;
    emits('onLangChange', val);
  }
  async function language_translate(val) {
    if (!val) return;
    // 接口请求
    try {
      inputData.data_language_loading = true;
      // 翻译：字典名称、第三方字典id
      const params = {
        querys: [val],
        ...props.props_translateLanguageUrlParams
      };
      // TODO
      const res = {}; // await API.fetchTranslateLanguage(params, contextData.provideTranslateLanguageUrl);
      if (res && Array.isArray(res.data)) {
        // 中文引号影响 codemirror customizeMode 字符匹配
        const sqlVal = res.data[0].replace(/“/g, '"').replace(/”/g, '"');
        setSqlValue(sqlVal);
      }
    } catch (error) {
      inputData.data_language = 'en';
      emits('onLangChange', inputData.data_language);
      // TODO
      // EventBus.$emit(inputData.data_modeEventName, inputData.data_language);
      // this.$Message.error(error.message || '翻译接口错误');
    } finally {
      inputData.data_language_loading = false;
    }
  }
  function handleOpenEditorByChinese() {
    if (inputData.data_language === 'zh') {
      refEditorRootDiv.value.style.height = 'auto';
      Editor.setOption('lineWrapping', true);
      inputData.data_languageChineseEditorShow = true;
    }
  }
  function handleOpenEditorByChineseBlur() {
    if (inputData.data_languageChineseEditorShow) {
      refEditorRootDiv.value.style.height = `${refInputRoot.value.style.height}px`;
      Editor.setOption('lineWrapping', false);
      inputData.data_languageChineseEditorShow = false;
    }
  }
  // 手动刷新
  function refreshInp() {
    Editor.refresh();
  }
  // 监听全局点击事件
  function windowClick(ev) {
    inputData.windowClickTarget = ev.target;
  }
  // 搜索框底部动画
  function showSvgAnimation(isShow) {
    inputData.data_isShowAnimation = isShow;
  }
  // 拼音搜索引擎
  function initialPinyinEngine() {
    local_pinyinEngine = new PinyinEngine(props.props_allFieldList, ['label']);
  }
  // ****************** codeMirror 编辑器相关 ******************
  function initialEditor(node) {
    customizeMode(CodeMirror, props.props_allFieldList, inputData.data_modeEventName);
    const cm = CodeMirror(node, {
      autoRefresh: true,
      lineWrapping: true,
      matchBrackets: true,
      scrollbarStyle: 'null', // default is native
      mode: 'baas/el',
      value: props.props_initialValueToSqlInput || ''
    });
    cm.setSize('100%', 'auto');
    return cm;
  }
  function sortAscByFieldValue(inArr) {
    const toSortArr = [...inArr];
    toSortArr.sort((aObj, bObj) => {
      const va = aObj.value.toLowerCase();
      const vb = bObj.value.toLowerCase();
      if (va < vb) {
        return -1;
      }
      if (va > vb) {
        return 1;
      }
      return 0;
    });
    return toSortArr;
  }
  function initialMountedEvents() {
    // 首先清除所有事件
    // TODO
    // offEvents();
    //
    addEssentialEvents();
    addSmartTipEvents();
    // 合并常用字段及所有字段 即所有字段中会包含常用字段 并且要做排序
    local_sortedFreqList = sortAscByFieldValue(props.props_freqUsedFieldList);
    local_sortedAllList = sortAscByFieldValue(props.props_allFieldList);
    setDataToDispOptions([...local_sortedFreqList, ...local_sortedAllList]);
    setLocalClonedToDispOptions();
    local_dataToDispOptionsLength = inputData.data_toDispOptions.length;
    // 注册全局事件用于关闭智能提示下拉框
    window.addEventListener('click', windowClickCloseList, true);
    // 用户键盘上下选择
    window.addEventListener('keyup', onWindowKeyup, true);
    window.addEventListener('mousemove', onWindowMousemove, true);
  }
  function enableDisableEditor(b) {
    Editor.setOption('readOnly', b ? 'nocursor' : b);
  }
  function enableDisableTreeIcon(b) {
    if (refTreeIconDiv.value) {
      if (b) {
        refTreeIconDiv.value.style.cursor = 'not-allowed';
      } else {
        refTreeIconDiv.value.style.cursor = 'pointer';
      }
    }
  }
  function setReadonlyCursor(isReadonly) {
    if (isReadonly) {
      refEditorRootDiv.value.style.pointerEvents = 'none';
      refInputRoot.value.style.cursor = 'not-allowed';
    } else {
      refEditorRootDiv.value.style.pointerEvents = 'auto';
      refInputRoot.value.style.cursor = 'auto';
    }
  }
  function addEssentialEvents() {
    if (Editor) {
      Editor.on('change', onInputChange);
      Editor.on('focus', onInputFocus);
      Editor.on('blur', onInputBlur);
      Editor.on('keydown', onEditorKeyDown);
    }
  }
  function addSmartTipEvents() {
    if (Editor) {
      Editor.on('cursorActivity', onCursorActivityChange);
    }
  }
  function offEvents() {
    if (Editor) {
      Editor.off('change', onInputChange);
      Editor.off('focus', onInputFocus);
      Editor.off('blur', onInputBlur);
      Editor.off('cursorActivity', onCursorActivityChange);
      Editor.off('keydown', onEditorKeyDown);
      //
      if (refOlRoot.value) {
        refOlRoot.value.removeEventListener('click', onOLClick, true);
      }
      window.removeEventListener('click', windowClickCloseList, true);
      window.removeEventListener('keyup', onWindowKeyup, true);
      window.removeEventListener('mousemove', onWindowMousemove, true);
      clearTimeout(local_onCursorActivityChangeTimeoutId);
    }
  }
  function onInputChange() {
    emits('onSqlInputChange', getSqlValue());
  }
  function onEditorKeyDown(cm, ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      // 如果此时下拉列表未展开 则将回车事件抛出
      if (!inputData.data_isShowList) {
        emits('onInputEnter');
      }
    } else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
    }
  }
  function getSqlValue() {
    return inputData.data_language === 'zh' ? inputData.data_language_english_val : Editor.getValue();
  }
  function setSqlValue(v) {
    Editor.setValue(v);
  }
  function getSqlRangeContent(fromObj, toObj) {
    return Editor.getRange(fromObj, toObj);
  }
  function replaceSqlRange(str, fromObj, toObj) {
    Editor.replaceRange(str, fromObj, toObj);
    setLocalInputValue();
  }
  function onInputFocus() {
    // 当失焦时 只展示一行
    if (Editor && contextData.provideIsAutoCollapse.value) {
      // 设置容器高度为固定的32px
      refEditorRootDiv.value.style.height = 'auto';
      // 禁用行折叠
      Editor.setOption('lineWrapping', true);
    }
    window.currentFocusSqlInputId = inputData.data_currentFocusSqlInputId;
    onCursorActivityChange();
    showSvgAnimation(true);
    emits('onFocus');
  }
  function onInputBlur() {
    // 当失焦时 只展示一行
    if (
      Editor &&
      contextData.provideIsAutoCollapse.value &&
      (!inputData.windowClickTarget ||
        (inputData.windowClickTarget && inputData.windowClickTarget.className !== 'singleLi'))
    ) {
      // 设置容器高度为固定的32px
      refEditorRootDiv.value.style.height = `${refInputRoot.value.style.height}px`;
      // 禁用行折叠
      Editor.setOption('lineWrapping', false);
    }
    nextTick(() => {
      if (window.currentFocusSqlInputId && window.currentFocusSqlInputId !== inputData.data_currentFocusSqlInputId) {
        hideList();
      }
    });
    showSvgAnimation(false);
    emits('onBlur');
  }
  function setInputFocus() {
    Editor.focus();
  }
  function hasFocus() {
    return Editor.hasFocus();
  }
  function getCursorObj() {
    return Editor.getCursor();
  }
  function setCursor(posObj) {
    Editor.setCursor(posObj);
  }
  // ****************** 下拉列表键盘及鼠标事件处理相关 ******************
  function onTreeIconClick() {
    if (cmp_isDisabled.value || props.props_onlyDisabledButton) return; // cmp_isDisabled 状态开启时是必定不可以触发事件的
    emits('onTreeIconClick');
  }
  function onWindowMousemove() {
    if (local_isOlDisablePointerEvents && refOlRoot.value) {
      refOlRoot.value.style.pointerEvents = 'auto';
      local_isOlDisablePointerEvents = false;
    }
  }
  function onSingleLiMouseOver(ev) {
    inputData.data_optionIndex = -1;
    inputData.data_hoverIndex = Number(ev.target.dataset.index.split('&&&&')[1]);
  }
  function onSingleLiMouseOut() {
    inputData.data_hoverIndex = -1;
  }
  function onWindowKeyup(ev) {
    if (inputData.data_isShowList) {
      if (ev.key === 'Escape') {
        hideList();
      }
      // 用键盘选择的时候 就不要鼠标选择了
      if (!local_isOlDisablePointerEvents && refOlRoot.value) {
        refOlRoot.value.style.pointerEvents = 'none';
        local_isOlDisablePointerEvents = true;
        // 接替鼠标悬浮的位置
        if (inputData.data_hoverIndex > -1) {
          inputData.data_optionIndex = inputData.data_hoverIndex;
        }
      }
      const { key } = ev;
      if (key === 'ArrowUp') {
        // 需要用一个临时变量暂存
        let tempIndex = inputData.data_optionIndex;
        tempIndex -= 1;
        if (tempIndex <= -1) {
          inputData.data_optionIndex = local_dataToDispOptionsLength - 1;
        } else {
          inputData.data_optionIndex = tempIndex;
        }
      }
      //
      if (key === 'ArrowDown') {
        if (inputData.data_optionIndex >= local_dataToDispOptionsLength - 1) {
          inputData.data_optionIndex = 0;
        } else {
          inputData.data_optionIndex += 1;
        }
      }
      /** template中的ol列表得用v-if的方式
       * 隐藏的时候不在页面渲染元素 这用通过如下方式去获取页面节点内容才不会出错
       * 其实也可以通过将如下的 data-index 再绑上唯一的ID 也不会查找错误
       * 但比较起来 还是利用 v-if 将不展示的列表直接不渲染 而不是用 v-show 隐藏
       * 最终还是改成了绑上唯一ID的方式 对组件调用者更加友好
       * */
      const toQueryAttr = `[data-index='${inputData.data_currentFocusSqlInputId}&&&&${inputData.data_optionIndex}']`;
      const selectedLiEle = document.querySelector(toQueryAttr);
      if (selectedLiEle) {
        selectedLiEle.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
      //
      if (key === 'Enter') {
        // 有选中项
        if (inputData.data_optionIndex > -1) {
          onOLClick({
            target: { dataset: selectedLiEle.dataset }
          });
        }
      }
    }
  }
  function windowClickCloseList(ev) {
    if (ev.target.getAttribute('role') !== 'presentation') {
      inputData.data_isShowList = false;
      inputData.data_optionIndex = -1;
      handleOpenEditorByChineseBlur();
    }
  }
  // ****************** 无复杂罗辑的辅助方法或者通过API取值的方法 ******************
  function setDataToDispOptions(d) {
    inputData.data_toDispOptions = d;
  }
  function getLastOperatorByField(field) {
    const { beforeContent } = getContentByCursor();
    const wordsArr = beforeContent.replace(/==|!=/g, (a) => ` ${a}`).split(/\s+/);
    return wordsArr[wordsArr.lastIndexOf(field) + 1].toLowerCase();
  }
  async function getValueOptions(field) {
    console.log(11111);
    const getValueOptionsFn = contextData.getValueOptions;
    if (field.indexOf('(') === 0) field = getIncludesParentheseField(field);
    if (getValueOptionsFn) {
      try {
        inputData.data_isGetValueOptionsLoading = true;
        const resp = {};
        // TODO
        // await HTTP.get(props.props_getValueOptionsUrl, {
        //   field,
        //   operator: getLastOperatorByField(field),
        //   ...props.props_getValueOptionsUrlParamObj
        // });
        const [success, data] = await getValueOptionsFn({
          field,
          operator: getLastOperatorByField(field),
          ...props.props_getValueOptionsUrlParamObj
        });
        inputData.data_isGetValueOptionsLoading = false;
        if (success) {
          return data.map((obj) => ({
            label: obj.label ? (obj.label !== obj.value ? `${obj.label}(${obj.value})` : obj.value) : obj.value,
            value: obj.value
          }));
        }
        return [];
      } catch (error) {
        console.log('get value Options error:==', error);
        inputData.data_isGetValueOptionsLoading = false;
        return [];
      }
    } else if (props.props_getValueOptionsUrl === null) {
      return inputData.data_toDispOptions;
    }
    return [];
  }

  function setTipIcon() {
    switch (inputData.data_tipType) {
      case 'FIELD':
        inputData.data_tipImgSrc = fieldImgSrc;
        break;
      case 'OPERATOR':
        inputData.data_tipImgSrc = opImgSrc;
        break;
      case 'LOGICAL_OPERATOR':
        inputData.data_tipImgSrc = logicalImgSrc;
        break;
      case 'VALUE':
        inputData.data_tipImgSrc = valImgSrc;
        break;
      case 'ELEMENT':
        inputData.data_tipImgSrc = elementImgSrc;
        break;
      case 'OBJECT':
        inputData.data_tipImgSrc = objectImgSrc;
        break;
      case 'THRESHOLD':
        inputData.data_tipImgSrc = thresholdImgSrc;
        break;
      default:
        inputData.data_tipImgSrc = '';
    }
  }
  function setTipOptionsToField(isFilterMatchSupportField = false) {
    let arr = [...local_sortedFreqList, ...local_sortedAllList];
    if (isFilterMatchSupportField) {
      // v5.0.1 对象活动列表新增支持ip类型字段
      arr = arr.filter((item) => ELEMENT_AND_OBJECT_SUPPORT_TYPE.includes(item.type));
    }
    setDataToDispOptions(arr);
    inputData.data_tipType = 'FIELD';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function setTipOptionsToOperator(type) {
    const list = setCurrentOperatorList(type, props.props_operatorsConfig, instance);
    setDataToDispOptions(list);
    inputData.data_tipType = 'OPERATOR';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function setTipOptionsToDynamicThreshold() {
    setDataToDispOptions([
      {
        label: '匹配动态阈值',
        value: '${}'
      }
    ]);
    inputData.data_tipType = 'OPERATOR';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function setTipOptionsToDynamicElement() {
    const { last2Word } = local_contentByCursorObj;
    const fieldObj = getFieldObjByFieldName(last2Word);
    const fieldType = fieldObj?.type;
    const eleList = cmp_dynElementList.value.filter((item) => {
      if (fieldType === 'string') return ['string', 'regular'].includes(item.type);
      if (isNumberTypeField(fieldType)) return item.type === 'number';
      return item.type === fieldType;
    });
    const list = [
      {
        label: '普通字段([])',
        value: '[]'
      },
      ...eleList
    ];
    setDataToDispOptions(list);
    inputData.data_tipType = 'ELEMENT';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function setTipOptionsToDynamicObjectList(list) {
    setDataToDispOptions(list || cmp_dynObjectList.value);
    inputData.data_tipType = 'OBJECT';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function setTipOptionsToDyObjectAttr() {
    const { beforeContent: contentStr, matchBeforeWord: fieldName, lastWord } = local_contentByCursorObj;
    // 获取当前对象活动列表
    const contentArr = contentStr.split(' ');
    const currentObjListStrIndex = findLastIndex(contentArr, (item) => item.indexOf('dynList:') !== -1);
    const currentObjListStr = contentArr[currentObjListStrIndex];
    const sIndex = currentObjListStr.lastIndexOf('dynList:');
    const eIndex = currentObjListStr.lastIndexOf('(');
    let eInd = currentObjListStr.length;
    if (eIndex > -1) {
      eInd = eIndex;
    }
    let objListValue = currentObjListStr.substring(sIndex, eInd);
    const dyIndex = objListValue.lastIndexOf(':');
    objListValue = objListValue.substr(dyIndex + 1).trim();
    if (fieldName) {
      let name = fieldName;
      // 如果对象活动列表前面选择的字段是多个，对象活动列表的属性联想需要与前面对应字段类型保持一致
      if (fieldName.indexOf('[') > -1 && fieldName.indexOf(']') > -1) {
        const fieldNameArr = fieldName.replace('[', '').replace(']', '').split(',');
        const len = lastWord.split(',').length;
        name = fieldNameArr[len - 1];
      }
      const fieldObj = getFieldObjByFieldName(name);
      const fieldType = fieldObj?.type;
      // 找到当前对象活动列表 取该条数据下面的list
      const obj = cmp_dynObjectList.value.find((item) => item.value === objListValue);
      if (obj) {
        let list = obj.list.filter((item) => {
          if (isNumberTypeField(fieldType)) return item.type === 'number';
          if (fieldType === 'ip') return item.type === 'string' || item.type === 'ip';
          if (fieldType === 'string') return ['string', 'enum'].includes(item.type);
          return item.type === fieldType;
        });
        if (lastWord.indexOf(',') > -1 && fieldName.indexOf('[') === -1 && fieldName.indexOf(']') === -1) {
          list = [];
        }
        setDataToDispOptions(list);
        inputData.data_tipType = 'OBJECT';
        setTipIcon();
        setLocalClonedToDispOptions();
      } else {
        setDataToDispOptions([{ label: '无候选项', value: 'NO_OPTIONS' }]);
        inputData.data_tipType = 'NONE';
        setTipIcon();
      }
    }
  }
  function setTipOptionsToLogicalOperator() {
    setDataToDispOptions(ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT);
    inputData.data_tipType = 'LOGICAL_OPERATOR';
    setTipIcon();
    setLocalClonedToDispOptions();
  }
  function showList() {
    if (inputData.data_toDispOptions.length && hasFocus()) {
      inputData.data_isShowList = true;
      nextTick(() => {
        refOlRoot.value.addEventListener('click', onOLClick, true);
        refOlRoot.value.scrollTo({ top: 0 });
        inputData.data_optionIndex = 0;
      });
    }
  }
  function hideList() {
    inputData.data_isShowList = false;
    setDataToDispOptions([]);
    inputData.data_optionIndex = -1;
  }
  function isTipAfterEndSpace() {
    const { beforeChar, afterContent } = local_contentByCursorObj;
    // 如果光标前是空格并且光标后是多个空格或者没有空格 即此时光标在整个语句尾部
    return beforeChar === ' ' && !afterContent.trim();
  }
  // 目前只做尾过滤 其实按照当前实现 句中过滤可以一起实现
  function isTipWithFilter() {
    const { beforeChar } = local_contentByCursorObj;
    return (
      beforeChar &&
      beforeChar !== '(' &&
      beforeChar !== ')' &&
      beforeChar !== '[' &&
      beforeChar !== ']' &&
      beforeChar !== ',' &&
      beforeChar !== '"' &&
      beforeChar !== ' ' &&
      beforeChar !== '/'
    );
  }
  function isFieldWord(word) {
    if (word.indexOf('(') === 0) word = getIncludesParentheseField(word);
    const { beforeChar, lastWord, last4Word, beforeWordsArr2 } = local_contentByCursorObj;
    if (
      (!last4Word && (beforeChar === '[' || lastWord === ']')) ||
      (isLogicalOpWord(last4Word) && lastWord === ']') ||
      beforeWordsArr2[beforeWordsArr2.length - 1].indexOf('([') > -1
    ) {
      return true;
    }
    return props.props_allFieldList.findIndex((obj) => obj.value === word) > -1;
  }
  function isOpWord(word) {
    const lowerWrod = word ? word.toLowerCase() : '';
    return ALL_OPERATORS.findIndex((op) => op === lowerWrod) > -1;
  }
  function isLogicalOpWord(word) {
    const upperWord = word.toUpperCase();
    return ALL_LOGIC_OPERATOR.findIndex((lOp) => lOp === upperWord) > -1;
  }
  function isTipForValue() {
    const { lastWord, last2Word } = local_contentByCursorObj;
    if (isOpWord(lastWord) && !lastWord.toLowerCase().includes('exist') && isFieldWord(last2Word)) {
      return true;
    }
    return false;
  }
  function isTipForEnum() {
    const { beforeChar, before2Char, afterChar, last3Word } = local_contentByCursorObj;
    const isEnumType =
      beforeChar === '[' ||
      (beforeChar === '"' && afterChar === ']' && before2Char !== ',') ||
      (beforeChar === ',' && afterChar === '"');
    const isNumberType = beforeChar === '[' || (beforeChar === ',' && afterChar === ']');
    return (isEnumType || isNumberType) && isOpWord(last3Word);
  }
  function isTipForObjectList() {
    const { lastWord, last2Word } = local_contentByCursorObj;
    return (lastWord === 'match' && last2Word === ']') || last2Word === 'match';
  }
  function isDyObjctListAttr() {
    const { beforeWordsArr2, lastWord, afterChar } = local_contentByCursorObj;
    const arrLastWord = beforeWordsArr2[beforeWordsArr2.length - 1];
    const arrLast2Word = beforeWordsArr2[beforeWordsArr2.length - 2];
    let isObjListValue = false;
    const objListValueIndex = arrLastWord.indexOf(':');
    if (objListValueIndex > -1) {
      let objListValue = arrLastWord.substring(objListValueIndex + 1);
      if (objListValue.lastIndexOf('(') > -1) {
        objListValue = objListValue.substring(0, objListValue.lastIndexOf('('));
      }
      isObjListValue = cmp_dynObjectList.value.some(
        (item) => item.value === objListValue || item.label === objListValue
      );
    }
    return (
      arrLastWord.includes('dynList:') &&
      isObjListValue &&
      arrLast2Word === 'match' &&
      lastWord !== ')' &&
      afterChar !== '('
    );
  }
  function isDYListWithFilter() {
    const { beforeChar, afterChar, last3Word, after2Word } = local_contentByCursorObj;
    if (
      beforeChar === '[' &&
      !afterChar &&
      ((last3Word && isLogicalOpWord(last3Word)) || !last3Word || last3Word === '(')
    ) {
      inputData.data_tipMode = 'FILTER';
      const dylistField = '[]';
      const { beforeContent } = local_contentByCursorObj;
      let lastSpaceIndex = beforeContent.split('').lastIndexOf(' ');
      const afterSpaceFullStr = beforeContent.substring(lastSpaceIndex);
      const afterSpaceFullStrNumber = (afterSpaceFullStr.match(/\(/g) || []).length;
      if (lastSpaceIndex === -1) {
        lastSpaceIndex = afterSpaceFullStrNumber || 0;
      } else {
        lastSpaceIndex += afterSpaceFullStrNumber ? afterSpaceFullStrNumber + 1 : 1;
      }
      replaceSqlRange(dylistField, { line: 0, ch: lastSpaceIndex }, local_cursorObj);
      setCursor({ line: 0, ch: local_inputValue.length - 1 });
    } else if (
      (beforeChar === '[' || beforeChar === ',' || after2Word === ']' || afterChar === ']') &&
      afterChar !== ')' &&
      last3Word !== 'in' &&
      last3Word !== 'notin'
    ) {
      return true;
    }
  }
  function setLocalCursorObj() {
    local_cursorObj = getCursorObj();
  }
  function setLocalContentByCursorObj() {
    Object.assign(local_contentByCursorObj, getContentByCursor());
  }
  function getContentByCursor() {
    // 首先获取当前光标位置
    const { ch } = local_cursorObj;
    // 光标之前的第一个字符
    const beforeChar = local_inputValue[ch - 1];
    // 光标之前的第二个字符
    const before2Char = local_inputValue[ch - 2];
    // 光标之前所有内容
    const beforeContent = local_inputValue.slice(0, ch);
    // 获取光标之前的第一个 第二个单词 无论光标之前是否有空格
    const beforeWordsArr = beforeContent
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\(|\)|\[|\]/g, (c) => ` ${c}`)
      .split(' ');
    const beforeWordsArr2 = beforeContent.trim().replace(/\s+/g, ' ').split(' ');
    const len = beforeWordsArr.length;
    const lastWord = beforeWordsArr[len - 1] || '';
    const last2Word = beforeWordsArr[len - 2] || '';
    const last3Word = beforeWordsArr[len - 3] || '';
    const last4Word = beforeWordsArr[len - 4] || '';
    // 光标之后的第一个字符
    const afterChar = local_inputValue[ch];
    // 光标后面的所有内容
    const afterContent = local_inputValue.slice(ch);
    // 光标之后的单词列表
    const afterWordsArr = afterContent
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\(|\)|\[|\]/g, (c) => ` ${c}`)
      .split(' ');
    // 光标之后的一个单词
    const afterWord = afterWordsArr[0];
    const after2Word = afterWordsArr[1];
    // 获取光标之前最后一个match前面的字段【对象活动列表的属性需要与前面字段的类型保持一致】
    let matchBeforeWord = '';
    const matchIndex = beforeWordsArr2.lastIndexOf('match');
    if (matchIndex > 0) {
      matchBeforeWord = beforeWordsArr2[matchIndex - 1];
    }
    return {
      //
      beforeChar,
      before2Char,
      //
      beforeContent,
      //
      lastWord,
      last2Word,
      last3Word,
      last4Word,
      //
      afterChar,
      afterWord,
      after2Word,
      afterContent,

      matchBeforeWord,
      beforeWordsArr2
    };
  }
  function setLocalInputValue() {
    local_inputValue = getSqlValue();
  }
  function isStringTypeField(fieldType) {
    return (
      fieldType === 'string' ||
      fieldType === 'ip' ||
      fieldType === 'timestamp' ||
      fieldType === 'enum' ||
      fieldType === 'array'
    );
  }

  function isNumberTypeField(fieldType) {
    return fieldType === 'double' || fieldType === 'long' || fieldType === 'int' || fieldType === 'float';
  }

  // 是否是元素活动列表支持的字段类型 [number string ip regex【目前字典没有此类型】]
  function isDyElementListSupportFieldName(fieldType) {
    return ELEMENT_AND_OBJECT_SUPPORT_TYPE.includes(fieldType);
  }
  // 是否是活动列表阈值支持的算术符
  function isDyListThresholdSupportOp(word) {
    return ['==', '!=', '>', '<', '>=', '<='].includes(word);
  }
  // 输入智能提示处理过程相关
  function getFieldObjByFieldName(value) {
    // 处理字段前有括号的情况
    if (value.indexOf('(') === 0) value = getIncludesParentheseField(value);
    return props.props_allFieldList.find((obj) => obj.value === value);
  }
  // 去掉字段括号
  function getIncludesParentheseField(field) {
    return field.replace(/\(/g, '');
  }
  /**
   * 在 指标及模型 中，字段值的提示不需要通过接口远程搜索
   * 只需要针对enum及boolean类型做提示
   * enum取自带list，boolean 类型自己设置
   * 3.5.1 统一全部改成如上需求说明 即 enum 及 boolean 不做远程搜索
   * 更新 => v5.0.1 baas项目字段值的提示都从list取, 不做远程搜索，(where条件除外，where手动输入时不支持联想)； ！！！合并之后需要考虑mirror值的联想问题
   */
  async function setTipOptionsToValueByField(fieldName) {
    const isDYList = fieldName[0] === '[' && fieldName[fieldName.length - 1] === ']';
    let type = '';
    let fieldObj = null;
    if (!isDYList) {
      fieldObj = getFieldObjByFieldName(fieldName);
      type = fieldObj.type;
    } else {
      type = 'dylist';
    }
    const list = fieldObj?.list || [];
    let valueOptions = [];
    if (fieldObj && fieldObj.type === 'boolean') {
      valueOptions = [
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ];
      setDataToDispOptions(valueOptions);
      inputData.data_isGetValueOptionsLoading = false;
      inputData.data_tipType = 'VALUE';
      setTipIcon();
      return true;
    }
    if (list.length) {
      valueOptions = list.map((obj) => ({
        label: obj.value === obj.label ? obj.label : `${obj.label}(${obj.value})`,
        value: obj.value,
        type,
        desc: fieldObj.desc
      }));
      setDataToDispOptions(valueOptions);
      inputData.data_isGetValueOptionsLoading = false;
      inputData.data_tipType = 'VALUE';
      setTipIcon();
      return true;
    }
    if (type === 'dylist') {
      setDataToDispOptions(matchList);
      inputData.data_isGetValueOptionsLoading = false;
      inputData.data_tipType = 'VALUE';
      setTipIcon();
      return true;
    }
    const respValueOptions = await getValueOptions(fieldName);
    if (respValueOptions.length) {
      setDataToDispOptions(respValueOptions);
      inputData.data_isGetValueOptionsLoading = false;
      inputData.data_tipType = 'VALUE';
      setTipIcon();
      return true;
    }
    // 无候选项
    const noOptions = [{ label: '无候选项', value: 'NO_OPTIONS' }];
    setDataToDispOptions(noOptions);

    inputData.data_tipType = 'NONE';
    setTipIcon();
    return false; // 如果无候选项 则直接不显示提示框
  }
  /*
      在末尾空格后的提示有如下几种情况
      1、前面是字段名 则提示运算符
      2、前面是运算符 则提示字段值 如果运算符是 in 在上层已经处理 不会进入该种提示模式
      3、前面是逻辑运算符 则提示字段名
      4、如果不是以上三种情况 则是字段值 后续提示逻辑运算符
    */
  async function setNextTipOptionsWithEndSpace() {
    const { lastWord, last2Word } = local_contentByCursorObj;
    //
    const isField = isFieldWord(lastWord);
    const isOp = isOpWord(lastWord);
    const isLogical = isLogicalOpWord(lastWord);
    const isDyObjAttr = isDyObjctListAttr();
    //
    const last2WordType = getFieldObjByFieldName(last2Word)?.type || '';
    if (isField) {
      // 如果是字段名 则继续提示算数运算符
      let fieldType = '';
      if (last2Word[0] === '[' || lastWord === 'match') {
        fieldType = 'dylist';
      } else {
        fieldType = getFieldObjByFieldName(lastWord).type;
      }
      setTipOptionsToOperator(fieldType);
    } else if (isOp) {
      // 如果是算术运算符
      const lowerCaseLastWord = lastWord.toLowerCase();
      if (lowerCaseLastWord === 'exist' || lowerCaseLastWord === 'notexist') {
        // 如果是exist或notexist 则继续提示逻辑运算符
        setTipOptionsToLogicalOperator();
      } else if (lastWord === 'match') {
        // 对象活动列表
        setTipOptionsToDynamicObjectList();
      } else if ((lastWord === 'in' || lastWord === 'notin') && contextData.provideIsSupportDynElement.value) {
        setTipOptionsToDynamicElement();
      } else if (
        isNumberTypeField(last2WordType) &&
        isDyListThresholdSupportOp(lastWord) &&
        contextData.provideIsSupportDynThreshold.value
      ) {
        setTipOptionsToDynamicThreshold();
      } else if (lastWord !== '=~' && lastWord !== '!~') {
        // 否则提示字段值
        await setTipOptionsToValueByField(last2Word);
      }
    } else if (isDyObjAttr) {
      setTipOptionsToDyObjectAttr();
    } else if (isLogical || lastWord === '(') {
      // 如果是逻辑运算符或者 ( 则继续提示字段名
      setTipOptionsToField();
    } else {
      // 如果以上都不是 则认为最后一个单词是字段值 则继续提示逻辑运算符
      setTipOptionsToLogicalOperator();
    }
    setLocalClonedToDispOptions();
    showList();
  }
  function getFilterOptionsWithPinyin(filterStr) {
    if (local_pinyinEngine) {
      return local_pinyinEngine.query(filterStr);
    }
    return [];
  }
  /**
   * 过滤其实总是在当前的候选项中过滤
   * 然后这里做实时的各种类型判断候选
   * 过滤的原则是总是实时去获取当前应该被过滤的候选项
   * 这样才能保证正确并且不会受固定的提示模式的影响
   */
  async function setNextTipOptionsWithFilter() {
    const { lastWord: filterStr, last2Word, last3Word, afterChar, beforeWordsArr2 } = local_contentByCursorObj;
    const lowerFilterStr = filterStr.toLowerCase();
    const upperFilterStr = filterStr.toUpperCase();
    /**
     * 如果是字段 判断为字段的条件有
     * 1、初始为空 即过滤字符前什么都没有
     * 2、后面一个单词为运算符且前面一个单词为逻辑连接符
     * 3、过滤字符前的单词不能为in运算符
     */
    if ((!last2Word || isLogicalOpWord(last2Word) || last2Word === '(') && !['in', 'notin'].includes(last3Word)) {
      // console.log('过滤字段');
      // 对于活动列表场景处理：[srcAddress,destAddress]
      const singleFilterStrArr = lowerFilterStr.split(',');
      const dylistFilterIndex = singleFilterStrArr[singleFilterStrArr.length - 1]
        ? singleFilterStrArr[singleFilterStrArr.length - 1].indexOf('[')
        : -1;
      const singleFilterStr =
        dylistFilterIndex > -1
          ? singleFilterStrArr[singleFilterStrArr.length - 1].slice(
              dylistFilterIndex + 1,
              singleFilterStrArr[singleFilterStrArr.length - 1].length
            )
          : singleFilterStrArr[singleFilterStrArr.length - 1];

      // 从所有字段中过滤
      const searchResList = props.props_allFieldList.filter((obj) => obj.label.toLowerCase().includes(singleFilterStr));
      const options1 = setSearchListBySort(searchResList, singleFilterStr);
      // 拼音过滤
      const options2 = getFilterOptionsWithPinyin(lowerFilterStr);
      // 从所有字段中过滤value
      let options3 = [];
      if (contextData.propsSupportValueFilter.value) {
        const valueFilterList = props.props_allFieldList.filter((obj) =>
          obj.value.toLowerCase().includes(singleFilterStr)
        );
        options3 = setSearchListBySort(valueFilterList, singleFilterStr, 'value');
      }
      // 去重
      setDataToDispOptions(uniqBy([...options1, ...options2, ...options3], 'label'));
      inputData.data_tipType = 'FIELD';
      setTipIcon();
    } else if (
      isFieldWord(last2Word) ||
      (last2Word === ']' && !isOpWord(beforeWordsArr2[beforeWordsArr2.length - 3]))
    ) {
      // console.log('过滤运算符');
      /**
       * 如果是运算符 判断为运算符的条件有
       * 1、过滤字符前的单词为字段名
       */
      // 拿着当前的字段名去设置当前的待过滤列表 不能用之前提示模式设置的
      let type = '';
      const beforeSpaceWord = beforeWordsArr2[beforeWordsArr2.length - 2];
      if (/^\[.*\]$/.test(beforeSpaceWord)) {
        type = 'dylist';
      } else {
        type = getFieldObjByFieldName(last2Word).type;
      }
      const operatorOptionsList = setCurrentOperatorList(type, props.props_operatorsConfig, instance);
      setDataToDispOptions(operatorOptionsList.filter((obj) => obj.label.includes(lowerFilterStr)));
      inputData.data_tipType = 'OPERATOR';
      setTipIcon();
      /**
       * 如果是逻辑运算符 判断为逻辑运算符的条件有
       * 1、过滤字符前的单词为字段值 或者 ] 或者 ) 或者为运算符 exist/notexist
       */
    } else if (
      /".+"/.test(last2Word) ||
      last2Word === ')' ||
      last2Word === ']' ||
      last2Word.toLowerCase().includes('exist')
    ) {
      // console.log('过滤逻辑运算符');
      setDataToDispOptions(ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT.filter((obj) => obj.label.includes(upperFilterStr)));
      inputData.data_tipType = 'LOGICAL_OPERATOR';
      setTipIcon();
      /**
       * 如果是字段值 判断为字段值的情况为
       * 1、过滤字符前为算数运算符 然后无法避免总是要通过接口去获取字段值列表
       */
    } else if (isOpWord(last2Word)) {
      // console.log('过滤字段值');
      if (filterStr === '${') {
        setDataToDispOptions(cmp_dynThresholdList.value);
        inputData.data_tipType = 'THRESHOLD';
        setTipIcon();
      } else if (last2Word === 'match' && afterChar !== '(') {
        if (filterStr.includes('dynList:')) {
          const strArr = filterStr.split('dynList:');
          const keyword = strArr[1];
          const _keyword = strArr[1] ? strArr[1].toLowerCase() : strArr[1];
          /**
           * 三种情况
           * 1.关键字不存在：直接提示对象列表
           * 2.关键字存在并且在对象列表中全字匹配：提示属性
           * 3.关键字存在并且模糊匹配在对象列表中：继续提示对象列表
           */
          if (!keyword) {
            setTipOptionsToDynamicObjectList();
          } else if (cmp_dynObjectList.value.find((item) => item.label === keyword || item.value === keyword)) {
            const list = cmp_dynObjectList.value.filter(
              (item) => item.label.includes(keyword) || item.value.includes(keyword)
            );
            setTipOptionsToDyObjectAttr(list);
          } else {
            const list = cmp_dynObjectList.value.filter(
              (item) => item.label.toLowerCase().includes(_keyword) || item.value.toLowerCase().includes(_keyword)
            );
            setTipOptionsToDynamicObjectList(list);
          }
        } else {
          const keyword = filterStr ? filterStr.toLowerCase() : filterStr;
          const list = cmp_dynObjectList.value.filter(
            (item) => item.label.toLowerCase().includes(keyword) || item.value.toLowerCase().includes(keyword)
          );
          setTipOptionsToDynamicObjectList(list);
        }
      } else if (isDyObjctListAttr()) {
        setTipOptionsToDyObjectAttr();
      } else {
        const fieldObj = getFieldObjByFieldName(last3Word);
        const list = fieldObj.list || [];
        const valueOptions = list.length
          ? list.map((obj) => ({
              label: obj.value === obj.label ? obj.label : `${obj.label}(${obj.value})`,
              value: obj.value,
              desc: fieldObj.desc
            }))
          : await getValueOptions(last3Word);
        setDataToDispOptions(
          valueOptions.filter(
            (obj) =>
              obj.label.toLowerCase().includes(lowerFilterStr) || obj.value.toLowerCase().includes(lowerFilterStr)
          )
        );
        inputData.data_tipType = 'VALUE';
        setTipIcon();
      }
    } else {
      // console.log('无候选');
      setDataToDispOptions([]);
      inputData.data_tipType = 'NONE';
      setTipIcon();
    }
    //
    if (inputData.data_toDispOptions.length) {
      showList();
    } else {
      hideList();
    }
  }
  /**
   * @param list 排序数组
   * @param keyword 关键字
   * @param key 排序取值,默认取label
   */
  function setSearchListBySort(list, keyword, key = 'label') {
    // 按照完全匹配排序
    const sortList = list.sort((a, b) => {
      const aMatchIndex = a[key].toLowerCase().indexOf(keyword);
      const bMatchIndex = b[key].toLowerCase().indexOf(keyword);
      if (aMatchIndex < bMatchIndex) return -1;
      if (aMatchIndex > bMatchIndex) return 1;
      return 0;
    });
    return sortList;
  }
  function setLocalClonedToDispOptions() {
    local_clonedToDispOptions = cloneDeep(inputData.data_toDispOptions);
  }
  function getEnumTipFieldObj() {
    const { beforeContent } = local_contentByCursorObj;
    const strArr = beforeContent
      .trimLeft()
      .replace(/\s+/g, ' ')
      .replace(/\(/g, (a) => ` ${a} `)
      .split(' ')
      .reverse();
    const inIndex = strArr.findIndex((word) => {
      const _w = word.toLowerCase();
      return _w === 'in' || _w === 'notin';
    });
    const field = strArr[inIndex + 1];
    const fieldObj = getFieldObjByFieldName(field) || {};
    return fieldObj;
  }
  async function setNextTipOptionsWithEnum() {
    const { value: fieldName } = getEnumTipFieldObj();
    if (fieldName) {
      await setTipOptionsToValueByField(fieldName);
      showList();
    } else {
      hideList();
    }
  }
  // 智能提示主入口 1、尾提示 2、过滤 3、枚举 4、初始内容为空
  function onCursorActivityChange() {
    clearTimeout(local_onCursorActivityChangeTimeoutId);
    local_onCursorActivityChangeTimeoutId = setTimeout(() => {
      // console.log('==== onCursorActivityChange ====');
      // 只要光标发生改变 就实时更新当前的输入值以及光标前后的内容
      setLocalInputValue(); // 实时保存当前输入框的值
      setLocalCursorObj(); // 实时保存光标位置
      setLocalContentByCursorObj(); // 实时保存光标前后内容
      // 非空值的情况下
      if (local_inputValue.trimLeft()) {
        // 空格之后的末尾
        if (isTipAfterEndSpace()) {
          // console.warn('>> 空格之后的末尾');
          inputData.data_tipMode = 'END_AFTER_SPACE';
          setNextTipOptionsWithEndSpace();
          // 过滤
        } else if (isTipWithFilter()) {
          // console.warn('>> 过滤');
          inputData.data_tipMode = 'FILTER';
          setNextTipOptionsWithFilter();
          // 枚举
        } else if (isTipForEnum()) {
          // console.warn('>> 枚举');
          inputData.data_tipMode = 'ENUM';
          setNextTipOptionsWithEnum();
        } else if (isDYListWithFilter()) {
          // console.warn('>> 活动列表');
          inputData.data_tipMode = 'FILTER';
          setTipOptionsToField(true);
          showList();
        } else if (isDyObjctListAttr()) {
          // console.warn('活动列表属性');
          setTipOptionsToDyObjectAttr();
          showList();
          // 无提示
        } else {
          // console.warn('>> 无提示');
          inputData.data_tipMode = 'NOT_TIP';
          setDataToDispOptions([]);
          hideList();
          setLocalClonedToDispOptions();
        }
        // 输入框为空的初始提示
      } else {
        // console.warn('>> 初始提示');
        inputData.data_tipMode = 'START_EMPTY';
        setTipOptionsToField();
        showList();
      }
    }, 50);
  }
  /**
   * 选择提示项 共分为三大类
   * 1、在尾空格之后 即非过滤 直接填上即可 自动增加尾空格
   * 2、过滤模式 需要覆盖过滤关键字 自动增加尾空格
   * 3、in/notin 模式 需要特殊处理
   * */
  function onOLClick(ev) {
    // 候选项的value 可能是字段名 运算符 字段值 逻辑运算符
    // 最终上屏的值 会被后续改变
    let tov = ev.target.dataset.value;
    const rawValue = tov; // 保存原始值备用
    // console.log('==== on ol click:==', tov);
    // console.log('rawValue:==', rawValue);
    // 如果有候选项
    if (tov && tov !== 'NO_OPTIONS') {
      // 尾空格之后 直接填上 不会发生枚举类型等需要特殊处理的情况
      if (isTipAfterEndSpace()) {
        // 元素活动列表普通匹配
        if (tov === '[]') {
          tov = `${tov}`;
          // 对象列表
        } else if (isTipForObjectList()) {
          // console.log('>> 对象列表');
          tov = `dynList:${tov}`;
          // 字段值
        } else if (isTipForValue()) {
          // console.log('>> 字段值');
          const { lastWord, last2Word, beforeContent } = local_contentByCursorObj;
          let fieldType = '';
          if (
            (beforeContent[0] === '[' && beforeContent[beforeContent.length - 2] === ']') ||
            lastWord === 'match' ||
            last2Word === 'match' ||
            lastWord === '${' ||
            lastWord === 'in' ||
            lastWord === 'notin'
          ) {
            fieldType = 'dylist';
          } else {
            fieldType = getFieldObjByFieldName(last2Word).type;
          }
          if (isStringTypeField(fieldType)) {
            // console.log('>> string类型');
            tov = `"${tov}" `;
          } else if (isNumberTypeField(fieldType) || fieldType === 'boolean') {
            // console.log('>> boolean类型');
            tov = `${tov} `;
          } else if (fieldType === 'array') {
            // console.log('>> array类型');
            // array 类型去掉对于 == 及 != 的支持
            if (lastWord === 'like' || lastWord === 'contains') {
              tov = `"${tov}" `;
            }
          } else if (fieldType === 'dylist') {
            tov = ['in', 'notin'].includes(lastWord) ? `dynList:${tov} ` : `dynList:${tov}`;
          }
          // 运算符
        } else if (isOpWord(tov)) {
          // console.log('>> 运算符');
          const { lastWord } = local_contentByCursorObj;
          const fieldType = getFieldObjByFieldName(lastWord)?.type;
          if (isDyElementListSupportFieldName(fieldType) && contextData.provideIsSupportDynElement.value) {
            tov = `${tov} `;
          } else if (tov === 'in' || tov === 'notin') {
            tov = `${tov} []`;
          } else if (tov === '=~' || tov === '!~') {
            tov = `${tov} //`;
          } else if (tov === '[]') {
            tov = `${tov}`;
          } else {
            tov = `${tov} `;
          }
          // 字段名或者逻辑运算符
        } else {
          tov = `${tov} `;
        }
        replaceSqlRange(tov, local_cursorObj);
        hideList();
        setInputFocus();
        const { lastWord } = local_contentByCursorObj;
        const fieldType = getFieldObjByFieldName(lastWord)?.type || '';
        // 对于 in notin 或者 =~ !~正则表达式 或者动态阈值 需要重新设置光标位置到中括号或大括号中
        if (
          (rawValue === 'in' ||
            rawValue === 'notin' ||
            rawValue === '=~' ||
            rawValue === '!~' ||
            rawValue === '${}' ||
            rawValue === '[]') &&
          (!contextData.provideIsSupportDynElement.value || !isDyElementListSupportFieldName(fieldType))
        ) {
          const ch = rawValue === '${}' ? local_inputValue.length - 2 : local_inputValue.length - 1;
          setCursor({ line: 0, ch });
        }
        // 对象活动列表 选择属性
      } else if (isDyObjctListAttr()) {
        const { lastWord, matchBeforeWord } = local_contentByCursorObj;
        if (lastWord.indexOf('(') > -1) {
          tov = `${rawValue}`;
        } else {
          tov = `(${rawValue}) `;
        }
        replaceSqlRange(tov, local_cursorObj);
        hideList();
        setInputFocus();

        // 设置光标位置
        if (matchBeforeWord.indexOf('[') > -1 && matchBeforeWord.indexOf(']') > -1) {
          const currentbeforeWordsArr = local_inputValue.trim().replace(/\s+/g, ' ').split(' ');
          const matchIndex = currentbeforeWordsArr.lastIndexOf('match');
          if (matchIndex > -1) {
            const currentAfterMatch = currentbeforeWordsArr[matchIndex + 1];
            const fieldNameLen = matchBeforeWord.replace('[', '').replace(']', '').split(',').length;
            const lastWordLen = currentAfterMatch.split(',').filter((item) => item).length;
            if (lastWordLen < fieldNameLen) {
              setCursor({ line: 0, ch: local_inputValue.length - 2 });
            } else {
              setCursor({ line: 0, ch: local_inputValue.length + 2 });
            }
          }
        }
        // 对象活动列表字段
      } else if (isDYListWithFilter()) {
        // console.log('对象活动列表过滤');
        const { beforeContent } = local_contentByCursorObj;
        const beforeContentArr = beforeContent.split('');
        const lastLeftBracketsIndex = beforeContentArr.lastIndexOf('[');
        const lastCommaIndex = beforeContentArr.lastIndexOf(',');
        // 对象活动列表字段过滤替换时 如果有逗号时需要从逗号后面替换，如果没有逗号则从中括号后面替换
        let chIndex = 0;
        if (lastCommaIndex !== -1) {
          chIndex = lastCommaIndex + 1;
        } else if (lastLeftBracketsIndex !== -1) {
          chIndex = lastLeftBracketsIndex + 1;
        }
        replaceSqlRange(tov, { line: 0, ch: chIndex }, local_cursorObj);
        hideList();
        setInputFocus();
        // 对象活动列表
      } else if (isTipForObjectList()) {
        const { beforeContent } = local_contentByCursorObj;
        let lastSpaceIndex = beforeContent.split('').lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
          lastSpaceIndex = 0;
        } else {
          lastSpaceIndex += 1;
        }

        tov = rawValue === 'match' ? 'match ' : `dynList:${rawValue}`;
        replaceSqlRange(tov, { line: 0, ch: lastSpaceIndex }, local_cursorObj);
        hideList();
        setInputFocus();
        setCursor({ line: 0, ch: local_inputValue.length });
      } else if (isTipWithFilter()) {
        // console.log('>>> isTipWithFilter');
        const { beforeContent, last2Word: fieldName } = local_contentByCursorObj;
        const fieldNameType = getFieldObjByFieldName(fieldName)?.type || '';

        // 首先需要获取替换的起始坐标 即最近一个空格的位置
        let lastSpaceIndex = beforeContent.split('').lastIndexOf(' ');
        // 处理字段前面有括号的情况
        const afterSpaceFullField = beforeContent.substring(lastSpaceIndex);
        const afterSpaceBracketNumber = (afterSpaceFullField.match(/\(/g) || []).length;
        if (lastSpaceIndex === -1) {
          lastSpaceIndex = afterSpaceBracketNumber || 0;
        } else {
          lastSpaceIndex += afterSpaceBracketNumber ? afterSpaceBracketNumber + 1 : 1;
        }
        // in/notin 后面有两种情况一种是普通模式 [],另外一种是可选元素活动列表
        // 如果字段类型是不支持元素活动列表 则是普通字段设置中括号
        // if ((rawValue === 'in' || rawValue === 'notin') && !isDyElementListSupportFieldName(fieldNameType) && !contextData.provideIsSupportDynElement) {
        if ((rawValue === 'in' || rawValue === 'notin') && !contextData.provideIsSupportDynElement.value) {
          tov = `${rawValue} []`;
        } else if (rawValue === '=~' || rawValue === '!~') {
          tov = `${rawValue} //`;
        } else {
          tov = `${rawValue} `;
        }
        // 如果是值的过滤的话 上屏还需要考虑字段类型做不同的处理
        const { last2Word, last3Word } = local_contentByCursorObj;
        if (isFieldWord(last3Word) && !last2Word.toLowerCase().includes('exist')) {
          let fieldType = '';
          const threshold = beforeContent.substring(beforeContent.length - 2);
          if ((beforeContent[0] === '[' && beforeContent[beforeContent.length - 2] === ']') || threshold === '${') {
            fieldType = 'dylist';
          } else {
            fieldType = getFieldObjByFieldName(last3Word).type;
          }
          if (isStringTypeField(fieldType)) {
            tov = `"${tov.trim()}" `;
          } else if (isNumberTypeField(fieldType) || fieldType === 'boolean') {
            tov = `${tov} `;
          } else if (fieldType === 'array') {
            if (last2Word === '==' || last2Word === '!=') {
              tov = JSON.stringify(tov.split(','));
            } else if (last2Word === 'like' || last2Word === 'contains') {
              tov = `"${tov}" `;
            }
          } else if (fieldType === 'dylist') {
            if (threshold === '${') {
              tov = `\${dynList:${tov.trim()}`;
            } else {
              tov = `dynList:${tov}`;
            }
          }
        }
        replaceSqlRange(tov, { line: 0, ch: lastSpaceIndex }, local_cursorObj);
        hideList();
        setInputFocus();
        if (
          ((rawValue === 'in' || rawValue === 'notin') && !isDyElementListSupportFieldName(fieldNameType)) ||
          rawValue === '=~' ||
          rawValue === '!~'
        ) {
          setCursor({ line: 0, ch: local_inputValue.length - 1 });
        }
        // 枚举
      } else if (isTipForEnum()) {
        // console.log('>> 枚举');
        // 枚举
        // 根据不同的字段类型决定字段值是否加引号
        // const fieldType = getEnumTipFieldObj().type;
        const { beforeContent } = local_contentByCursorObj;
        let fieldType = '';
        if (beforeContent[0] === '[' && beforeContent[beforeContent.length - 2] === ']') {
          fieldType = 'dylist';
        } else {
          fieldType = getEnumTipFieldObj().type;
        }
        // 对引号进行转译 #10357
        tov = tov.replace(/"/g, '\\"');
        if (isStringTypeField(fieldType) || fieldType === 'array') {
          tov = tov
            .split(',')
            .map((v) => `"${v}"`)
            .join(',');
        } else {
          tov = `${tov}`;
        }
        // 还需要处理逗号
        const { beforeChar, afterChar } = local_contentByCursorObj;
        if (beforeChar === '"' && afterChar === ']') {
          tov = `,${tov}`;
        } else if ((beforeChar === ',' || beforeChar === '[') && afterChar === '"') {
          tov = `${tov},`;
        }
        //
        replaceSqlRange(tov, local_cursorObj);
        hideList();
        setInputFocus();
      } else if (!local_inputValue.trim()) {
        // console.log('>> 输入框为空的情况');
        // 输入框为空的情况
        replaceSqlRange(`${tov} `, local_cursorObj);
        hideList();
        setInputFocus();
      } else {
        // console.log('>> 其他');
        replaceSqlRange(`${tov}`, local_cursorObj);
        hideList();
        setInputFocus();
      }
    } else {
      // console.log('>> 没有候选项');
      hideList();
      setInputFocus();
    }
  }

  function showTips() {
    if (cmp_isDisabled.value) {
      return;
    }
    emits('onShowTips');
  }

  defineExpose({
    getFieldObjByFieldName,
    isStringTypeField
  });
</script>
