<template>
  <div class="field-content w-280">
    <ComSelectSearchBox
      v-model="data_field"
      :props_height="24"
      :props_showCommonField="true"
      :props_isShowType="true"
      :props_isShowDesc="true"
      :props_clearable="true"
      :props_isShowValue="true"
      :props_supportValueFilter="contextData.propsSupportValueFilter"
      :props_commonOptions="props_commonOptions"
      :props_allOptions="props_allOptions"
      @on-change="onFieldChange"
    ></ComSelectSearchBox>
  </div>
</template>

<script setup>
  import { ref, watch, inject } from 'vue';
  import ComSelectSearchBox from '../../selectSearchBox/index.vue';

  defineOptions({
    name: 'FieldContent',
    inheritAttrs: false
  });

  const props = defineProps({
    props_fieldVal: {
      type: String,
      default: ''
    },
    // 同ComSelectSearchBox参数，常用字段
    props_commonOptions: {
      type: Array,
      default: () => []
    },
    // 同ComSelectSearchBox参数，所有字段
    props_allOptions: {
      type: Array,
      default: () => []
    }
  });
  const data_field = ref(props.props_fieldVal || '');
  const contextData = inject('contextData');
  console.log(contextData.propsSupportValueFilter, '哈哈哈');
  watch(
    () => props.props_fieldVal,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        data_field.value = newVal || '';
      }
    }
  );

  const emits = defineEmits(['onFieldChange']);

  function onFieldChange() {
    console.log('onFieldChange');
    emits('onFieldChange', data_field.value);
  }
</script>
