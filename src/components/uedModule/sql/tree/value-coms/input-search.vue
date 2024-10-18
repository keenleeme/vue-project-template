<template>
  <div class="w-300">
    <ComSelectSearchBox
      ref="ref_selectSearchBox"
      v-model="data_value"
      :props_height="24"
      :props_selectSpecial="props_inputSelectSpecial"
      :props_clearable="true"
      :props_isShowType="true"
      :props_isShowDesc="true"
      :props_isShowValue="true"
      :props_showCommonField="false"
      :props_valCanBlank="props_inputSelectSpecial"
      :props_supportPinyinFilter="false"
      :props_allOptions="props_valueOptions"
      @change-search-val="changeSearchVal"
    ></ComSelectSearchBox>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { debounce } from 'lodash';
  import ComSelectSearchBox from '../../selectSearchBox/index.vue';

  defineOptions({
    name: 'ComTreeValueInputSearch'
  });

  const props = defineProps({
    props_valueOptions: {
      type: Array,
      required: true,
      default: () => []
    },
    props_defaultValue: {
      type: [String, Number],
      default: ''
    },
    props_inputSelectSpecial: {
      type: Boolean,
      default: false
    },
    // 是否是阈值
    props_isThreshold: {
      type: Boolean,
      default: false
    },
    // 是否需要远程搜索
    props_isRemoteSearch: {
      type: Boolean,
      default: false
    }
  });

  const data_value = ref(
    props.props_defaultValue !== null && props.props_defaultValue !== undefined
      ? props.props_defaultValue.toString()
      : ''
  );

  const emits = defineEmits(['onChange', 'remoteMethod']);
  const ref_selectSearchBox = ref(null);

  // isThreshold 是否是选中的阈值
  function changeSearchVal(value, isThreshold = true) {
    if (props.props_isRemoteSearch) {
      changeValue(value);
    }
    const thresholdInfo = props.props_isThreshold ? { isThreshold } : null;
    emits('onChange', data_value.value, thresholdInfo);
  }
  const changeValue = debounce(
    function (value) {
      emits('remoteMethod', value);
    },
    300,
    { trailing: true }
  );

  watch(
    () => props.props_defaultValue,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        data_value.value =
          props.props_defaultValue !== null && props.props_defaultValue !== undefined
            ? props.props_defaultValue.toString()
            : '';
      }
      if (!newVal && ref_selectSearchBox.value) {
        ref_selectSearchBox.value.clearSingleSelect();
      }
    }
  );
</script>
