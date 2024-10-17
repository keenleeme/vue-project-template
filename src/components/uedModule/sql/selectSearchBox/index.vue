<template>
  <div id="baseSelectBox" ref="refs_baseSelectBox" class="base-select-box">
    <input
      ref="refs_inputBox"
      v-model="boxData.data_searchVal"
      class="input-box"
      :style="{ height: props_height + 'px' }"
      :disabled="disabled"
      :placeholder="props_placeholder"
      @input="filterOptions"
      @focus="focusSelect('input')"
      @blur="blurSelect"
    />
    <CloseCircleFilled
      v-if="boxData.data_searchVal && props_clearable"
      :class="`delete-icon ${disabled ? 'disabled' : ''}`"
      @click="deleteValue"
    ></CloseCircleFilled>
    <DownOutlined
v-if="props_iconType === 'down'" class="right-icon" :class="{'rotate-down': boxData.data_showOption,}"
    disabled: disabled @click="focusSelect('searchIcon')"/>
    <SearchOutlined v-if="props_iconType === 'search'" class="search-icon" />

    <Transition name="fade">
      <ol v-show="boxData.data_showOption" ref="refs_OlBox" class="ol-box" :style="{ top: props_height + 'px' }">
        <span v-if="boxData.data_options.length === 0" class="no-data"> 无匹配数据 </span>
        <span v-if="props_showCommonField && !boxData.data_isFilter && props_commonOptions.length > 0" class="li-title">
          常用字段
        </span>
        <div v-for="(item, index) in boxData.data_options" :key="index">
          <span
            v-if="
              props_showCommonField &&
              !boxData.data_isFilter &&
              props_commonOptions.length &&
              props_commonOptions.length === index
            "
            class="li-title"
          >
            所有字段
          </span>
          <li
            :class="{ actived: boxData.data_selectIndex === index, disabled: props_disabled && item.disabled }"
            @click="handleSelect(item, index)"
            @mouseover="onSingleLiMouseOver(index)"
            @mouseout="onSingleLiMouseOut"
          >
            <span
              v-if="
                props_isShowValue &&
                item.label !== item.value &&
                item.value !== 'NO_OPTIONS' &&
                !item.label.includes(`(${item.value})`)
              "
              class="span-item field"
              :title="`${item.label}(${item.value})`"
              >{{ `${item.label}(${item.value})` }}</span
            >
            <span v-else class="span-item field" :title="item.label">{{ item.label }}</span>
            <span v-if="props_isShowType" class="span-item type" :title="item.type">{{ item.type }}</span>
            <span v-if="props_isShowDesc" class="span-item desc" :title="item.desc">{{ item.desc }}</span>
          </li>
        </div>
      </ol>
    </Transition>
  </div>
</template>

<script setup>
  import { onBeforeUnmount, onMounted, reactive, watch, nextTick, ref } from 'vue';
  import { CloseCircleFilled, DownOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { uniqBy } from 'lodash';
  import PinyinEngine from 'pinyin-engine';

  defineOptions({
    name: 'BaseSelect',
    inheritAttrs: false
  });

  const props = defineProps({
    // 常用字段列表
    props_commonOptions: {
      type: Array,
      default: () => []
    },
    // 所有字段列表
    props_allOptions: {
      type: Array,
      default: () => []
    },
    // 是否显示常用字段列表，默认不显示
    props_showCommonField: {
      type: Boolean,
      default: false
    },
    // v-model绑定的选中项
    // props_selectedVal: {
    //   type: [String, Boolean, Number],
    //   default: ''
    // },
    // 若要启动下拉列表某项disabled功能，需要先传入该参数（值为true）
    props_disabled: {
      type: Boolean,
      default: false
    },
    // 整个下拉框disabled（与上述props_disabled区分开）
    disabled: {
      type: Boolean,
      default: false
    },
    // 修改下拉输入框的placeholder显示
    props_placeholder: {
      type: String,
      default: '请选择'
    },
    // 该下拉框的值是否可以为空或者为下拉选项中不存在的值，默认为false，当输入为空或者下拉项中不存在的值时，会默认置回上次设置的值
    props_valCanBlank: {
      type: Boolean,
      default: false
    },
    // 是否显示清空按钮
    props_clearable: {
      type: Boolean,
      default: false
    },
    // 是否支持拼音搜索，默认支持
    props_supportPinyinFilter: {
      type: Boolean,
      default: true
    },
    // 下拉框的高度
    props_height: {
      type: [String, Number],
      default: 32
    },
    // 是否显示字段类型
    props_isShowType: {
      type: Boolean,
      default: false
    },
    // 是否显示字段描述
    props_isShowDesc: {
      type: Boolean,
      default: false
    },
    // 是否在label后显示value
    props_isShowValue: {
      type: Boolean,
      required: false,
      default: false
    },
    // 右侧图标类型
    // 下拉图标-down（默认）; 搜索图标-search;
    props_iconType: {
      type: String,
      default: 'down'
    },
    // 是否支持value搜索
    props_supportValueFilter: {
      type: Boolean,
      required: false,
      default: false
    },
    // select模式下 设置下拉框选中值时显示对应的value 修改输入框的值后 如不是全字匹配 则显示当前修改的值
    props_selectSpecial: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const modelValue = defineModel();
  // model: {
  //     prop: 'props_selectedVal',
  //     event: 'changeSearchVal'
  //   },

  const emits = defineEmits(['onOpenChange', 'changeSearchVal', 'onChange', 'onSearch', 'onEnter']);

  const boxData = reactive({
    data_searchVal: '', // 选中值对应展示的label值
    data_options: [], // 下拉选项值
    data_showOption: false, // 是否显示下拉选项
    data_isFilter: false, // 是否过滤状态（模糊搜索功能）
    data_selectIndex: -1 // 选中项在下拉列表的index值
  });

  watch(
    () => props.props_commonOptions,
    () => {
      getOptionList(() => {
        const selectIndex = boxData.data_options.findIndex((ele) => ele.value === modelValue.value);
        setValue(selectIndex);
      });
    }
  );

  watch(
    () => props.props_allOptions,
    (newVal) => {
      getOptionList(() => {
        if (data_OptionInit && newVal.length > 0) {
          const selectIndex = boxData.data_options.findIndex((ele) => ele.value === modelValue.value);
          setValue(selectIndex);
          data_OptionInit = false;
        }
      });
    }
  );

  watch(
    () => modelValue.value,
    (newVal) => {
      if (props.props_iconType === 'down') {
        const selectIndex = boxData.data_options.findIndex((ele) => ele.value === newVal);
        setValue(selectIndex);
      } else if (props.props_iconType === 'search') {
        boxData.data_searchVal = newVal;
      }
    }
  );

  watch(
    () => props.data_showOption,
    (newVal) => {
      emits('onOpenChange', newVal);
    }
  );

  watch(
    () => props.data_showOption,
    (newVal) => {
      if (props.props_iconType === 'search') {
        modelValue.value = newVal;
        emits('changeSearchVal', newVal);
      }
      if (props.props_selectSpecial) {
        const selectIndex = boxData.data_options.findIndex((ele) => ele.label === newVal);
        if (selectIndex === -1) {
          modelValue.value = newVal;
          emits('changeSearchVal', newVal, false);
        }
      }
    }
  );

  let local_IsOlDisablePointerEvents = false;
  // const data_valueInit = true;
  let data_OptionInit = true;
  let private_hideOlTimer = null;
  let private_deleteFocusTimer = null;
  let local_PinyinEngine = null;
  let private_isDeleteValueFouce = null;
  let data_HoverIndex = 0;

  const refs_baseSelectBox = ref(null);
  const refs_inputBox = ref(null);
  const refs_OlBox = ref(null);

  onMounted(() => {
    getOptionList(() => {
      const selectIndex = boxData.data_options.findIndex((ele) => ele.value === modelValue.value);
      setValue(selectIndex);
    });

    window.addEventListener('click', clickBlankHideOlBox);
    window.addEventListener('keyup', onWindowKeyup, true);
    window.addEventListener('mousemove', onWindowMousemove, true);
  });

  onBeforeUnmount(() => {
    clearTimeout(private_hideOlTimer);
    private_hideOlTimer = null;
    clearTimeout(private_deleteFocusTimer);
    private_deleteFocusTimer = null;
    window.removeEventListener('click', clickBlankHideOlBox);
    window.removeEventListener('keyup', onWindowKeyup, true);
    window.removeEventListener('mousemove', onWindowMousemove, true);
  });

  // 获取下拉选择列表
  function getOptionList(callback) {
    boxData.data_options = [];
    let allOptions = [];
    if (props.props_showCommonField) {
      allOptions = props.props_commonOptions.slice(0).concat(props.props_allOptions.slice(0));
    } else {
      allOptions = props.props_allOptions.slice(0);
    }
    boxData.data_selectIndex = allOptions.findIndex((ele) => ele.value === modelValue.value); // 当前选中项index
    boxData.data_options = allOptions.slice(0); // 真实展示的列表值
    if (allOptions.length > 0 && props.props_supportPinyinFilter) {
      initPinyinEngine(); // 初始化拼音引擎
    }
    if (callback) {
      callback();
    }
  }
  // 设置选中项
  function setValue(index) {
    if (props.props_selectSpecial && index === -1) {
      boxData.data_searchVal = modelValue.value;
    } else {
      const val = boxData.data_options[index];
      boxData.data_searchVal = val && val.label;
    }
  }
  // 通过选择下拉项改变值
  function handleSelect(val, index) {
    // 选中的值为disabled，不可选
    if (props.props_disabled && val.disabled) {
      return;
    }
    boxData.data_isFilter = false;
    const selectIndex = boxData.data_options.findIndex((ele) => ele.value === val.value);
    setValue(selectIndex);
    boxData.data_selectIndex = index;
    modelValue.value = val.value;
    emits('changeSearchVal', val.value);
    emits('onChange', val.value);
    hideOlBox();
  }
  // 模糊搜索功能：通过输入框的值，过滤下拉项列表
  function filterOptions() {
    getOptionList();
    boxData.data_isFilter = true;
    if (!boxData.data_showOption) {
      boxData.data_showOption = true;
    }
    nextTick(() => {
      if (boxData.data_searchVal === '') {
        boxData.data_options = boxData.data_options.slice(0);
        boxData.data_isFilter = false;
      } else {
        const allOptions = props.props_allOptions.slice(0);
        let normalFilterOption = [];
        let valueFilterOption = [];
        let pinyinFilterOption = [];
        if (props.props_supportPinyinFilter) {
          pinyinFilterOption = local_PinyinEngine.query(boxData.data_searchVal); // 拼音搜索
        }
        const filterLabelList = allOptions.filter(
          (item) => item.label.toLowerCase().indexOf(boxData.data_searchVal.toLowerCase()) !== -1
        ); // 普通搜索（英文不区分大小写搜索）
        normalFilterOption = sortBySearchList(filterLabelList, boxData.data_searchVal);
        if (props.props_supportValueFilter) {
          const filterValueList = allOptions.filter(
            (item) => item.value.toLowerCase().indexOf(boxData.data_searchVal.toLowerCase()) !== -1
          ); // value搜索（英文不区分大小写搜索）
          valueFilterOption = sortBySearchList(filterValueList, boxData.data_searchVal, 'value');
        }
        // 对搜索结果进行排序
        boxData.data_options = uniqBy([...normalFilterOption, ...pinyinFilterOption, ...valueFilterOption], 'label'); // 去重处理
      }
    });
  }
  function sortBySearchList(list, keyword, key = 'label') {
    if (!keyword) return list;
    const sortList = list.sort((a, b) => {
      const va = a[key].toLowerCase().indexOf(keyword.toLowerCase());
      const vb = b[key].toLowerCase().indexOf(keyword.toLowerCase());
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });
    return sortList;
  }
  function focusSelect(type) {
    if (props.disabled) return;
    if (props.props_iconType === 'down') {
      if (private_isDeleteValueFouce) {
        if (private_deleteFocusTimer) {
          clearTimeout(private_deleteFocusTimer);
          private_deleteFocusTimer = null;
        }
        private_deleteFocusTimer = setTimeout(() => {
          boxData.data_showOption = true;
          boxData.data_isFilter = false;
        }, 200);
        private_isDeleteValueFouce = false;
        return;
      }
      boxData.data_showOption = true;
      getOptionList();
      boxData.data_isFilter = false;
    } else if (props.props_iconType === 'search') {
      if (type === 'searchIcon') {
        boxData.data_showOption = false;
        emits('onSearch');
      } else {
        boxData.data_showOption = true;
        getOptionList();
        boxData.data_isFilter = false;
      }
    }
  }
  // 失焦后的处理：当select值被清空或者输入的值在下拉选项中找不到时，默认置回原先的值
  function blurSelect() {
    if (props.props_valCanBlank) {
      return;
    }
    if (boxData.data_searchVal === '') {
      const selectIndex = boxData.data_options.findIndex((ele) => ele.value === modelValue.value);
      setValue(selectIndex);
    } else {
      let allOptions = [];
      allOptions = props.props_allOptions.slice(0);
      const filterArr = allOptions.filter((item) => item.label === boxData.data_searchVal);
      if (filterArr.length === 0) {
        const selectIndex = allOptions.findIndex((ele) => ele.value === modelValue.value);
        boxData.data_searchVal = allOptions[selectIndex] && allOptions[selectIndex].label;
      }
    }
  }
  // 隐藏下拉框
  function hideOlBox() {
    boxData.data_showOption = false;
    if (private_hideOlTimer) {
      clearTimeout(private_hideOlTimer);
      private_hideOlTimer = null;
    }
    private_hideOlTimer = setTimeout(() => {
      getOptionList();
    }, 500);
  }
  function clickBlankHideOlBox(event) {
    const selectBoxEle = refs_baseSelectBox.value;
    if (!((selectBoxEle && selectBoxEle.contains(event.target)) || event.target.id === 'baseSelectBox')) {
      hideOlBox();
    }
  }
  // 拼音搜索引擎
  function initPinyinEngine() {
    local_PinyinEngine = new PinyinEngine(props.props_allOptions, ['label']);
  }
  function deleteValue() {
    if (props.disabled) return;
    boxData.data_searchVal = '';
    private_isDeleteValueFouce = true;
    refs_inputBox.value.focus();
  }
  /* -------------------------------- 通过键盘上下键操作 start ------------------------------- */
  function onSingleLiMouseOver(index) {
    data_HoverIndex = index;
  }
  function onSingleLiMouseOut() {
    data_HoverIndex = -1;
  }
  function onWindowMousemove() {
    if (local_IsOlDisablePointerEvents && refs_OlBox.value) {
      refs_OlBox.value.style.pointerEvents = 'auto';
      local_IsOlDisablePointerEvents = false;
    }
  }
  function onWindowKeyup(event) {
    const { key } = event;
    const optionLength = boxData.data_options.length;
    if (boxData.data_showOption) {
      if (key === 'Escape') {
        hideOlBox();
        refs_inputBox.value.blur();
      }

      // 用键盘选择的时候 就不要鼠标选择了
      if (!local_IsOlDisablePointerEvents && refs_OlBox.value) {
        refs_OlBox.value.style.pointerEvents = 'none';
        local_IsOlDisablePointerEvents = true;
        // 接替鼠标悬浮的位置
        if (data_HoverIndex > -1) {
          boxData.data_selectIndex = data_HoverIndex;
        } else {
          boxData.data_selectIndex = -1;
        }
      }

      if (key === 'ArrowUp') {
        let tempIndex = boxData.data_selectIndex;
        tempIndex -= 1;
        if (tempIndex <= -1) {
          boxData.data_selectIndex = optionLength - 1;
        } else {
          boxData.data_selectIndex = tempIndex;
        }
      }

      if (key === 'ArrowDown') {
        if (boxData.data_selectIndex >= optionLength - 1) {
          boxData.data_selectIndex = 0;
        } else {
          boxData.data_selectIndex += 1;
        }
      }

      const selectedLiEle = refs_OlBox.value.querySelectorAll('li')[boxData.data_selectIndex];
      if (selectedLiEle) {
        selectedLiEle.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      if (key === 'Enter') {
        // 有选中项
        if (
          boxData.data_selectIndex > -1 &&
          boxData.data_options[boxData.data_selectIndex] &&
          !boxData.data_options[boxData.data_selectIndex].disabled
        ) {
          setValue(boxData.data_selectIndex);
          modelValue.value = boxData.data_options[boxData.data_selectIndex].value;
          emits('changeSearchVal', boxData.data_options[boxData.data_selectIndex].value);
          emits('onChange', boxData.data_options[boxData.data_selectIndex].value);
          hideOlBox();
          refs_inputBox.value.blur();
        } else if (props.props_iconType === 'search') {
          modelValue.value = boxData.data_searchVal;
          emits('changeSearchVal', boxData.data_searchVal);
          hideOlBox();
          refs_inputBox.value.blur();
          emits('onEnter');
        }
      }
    }
  }
  /* -------------------------------- 通过键盘上下键操作 end --------------------------------- */

  /* -------------------------------- 提供外部组件调用 start ------------------------------- */
  function clearSingleSelect() {
    boxData.data_searchVal = '';
    modelValue.value = '';
    emits('changeSearchVal', '');
  }

  defineExpose({
    clearSingleSelect
  });
</script>
