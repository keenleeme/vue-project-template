<template>
  <!-- v-click-outside="handleClose" -->
  <div v-click-outside="handleClose" class="select-search-multi">
    <div class="select-list" @click="openSearch">
      <a-tag
        v-for="item in multiData.data_selectList"
        :key="item.value"
        closable
        :title="item.label"
        :name="item.label"
        @on-change="onChange"
        @on-close="closeTag(item.value)"
      >
        {{ item.label }}
      </a-tag>
      <span class="select-icon">
        <!-- <Icon :type=" ? 'ios-arrow-up' : 'ios-arrow-down'" /> -->
        <ArrowUpOutlined v-if="multiData.data_showDrop" />
        <ArrowDownOutlined v-else />
      </span>
    </div>
    <Transition name="fade">
      <div v-show="multiData.data_showDrop" class="select-wrapper">
        <a-spin v-if="props_loading"></a-spin>
        <div class="input-wrapper">
          <a-input
            v-model:value="multiData.data_searchVal"
            prefix="ios-search"
            size="small"
            clearable
            placeholder="请输入关键词"
            @on-change="changeKeyword"
          ></a-input>
        </div>
        <div class="select-drop">
          <ul v-if="props_valueOptions.length">
            <li
              v-for="(item, index) in props_valueOptions"
              :key="index + item.value"
              :class="{
                select: item.select,
                'select-bg': cmp_lastSelectItem === item.value
              }"
              @click="selectItem(item)"
            >
              <span class="item-label" :title="item.label">{{ item.label }}</span>
              <span class="item-icon">
                <Icon v-show="item.select" type="md-checkmark" />
              </span>
            </li>
          </ul>
          <div v-else class="no-data">无匹配数据</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, watch, reactive, computed, onMounted } from 'vue';
  import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue';
  import { Spin as ASpin, Tag as ATag, Input as AInput } from 'ant-design-vue';
  import { debounce } from 'lodash';
  import vClickOutside from '../../ClickOutside';

  defineOptions({
    name: 'SelectSearch'
  });

  const props = defineProps({
    props_valueOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    props_defaultValue: {
      type: Array,
      default: () => []
    },
    props_loading: {
      type: Boolean,
      default: false
    }
  });
  const multiData = reactive({
    data_value: props.props_defaultValue || [],
    data_searchVal: '',
    data_showDrop: false,
    data_selectList: []
  });
  const cmp_lastSelectItem = computed(() => {
    const last = multiData.data_selectList[multiData.data_selectList.length - 1];
    return last ? last.value : '';
  });

  watch(
    () => props.props_valueOptions,
    (newVal) => {
      if (newVal.length) {
        setSelectValue();
      }
    }
  );

  watch(
    () => reactive.data_showDrop,
    (val) => {
      if (!val) multiData.data_searchVal = '';
    }
  );

  const emits = defineEmits(['onChange', 'remoteMethod', 'setOptionsValue']);

  onMounted(() => {
    setSelectValue();
  });
  function onChange() {
    const value = multiData.data_selectList.map((item) => item.value);
    emits('onChange', value);
  }
  const changeKeyword = debounce(
    function () {
      emits('remoteMethod', multiData.data_searchVal);
    },
    500,
    { trailing: true }
  );
  function closeTag(value) {
    multiData.data_selectList = multiData.data_selectList.filter((item) => item.value !== value);
    onChange();
    emits('setOptionsValue', value);
  }
  function selectItem(info) {
    info.select = !info.select;
    if (info.select) {
      multiData.data_selectList.push(info);
      multiData.data_selectList = [...new Set(multiData.data_selectList)];
    } else {
      multiData.data_selectList = multiData.data_selectList.filter((item) => item.value !== info.value);
    }
    onChange();
  }
  function handleClose() {
    multiData.data_searchVal = '';
    multiData.data_showDrop = false;
  }
  // 默认回写数据时 只有value 这里需要根据value值找到对应的的label
  function setSelectValue() {
    if (Array.isArray(props.props_defaultValue)) {
      if (!multiData.data_selectList.length) {
        multiData.data_selectList = props.props_valueOptions.filter((item) =>
          props.props_defaultValue.includes(item.value)
        );
      }
    }
  }
  function openSearch() {
    multiData.data_showDrop = !multiData.data_showDrop;
    if (multiData.data_showDrop) changeKeyword();
  }
</script>
