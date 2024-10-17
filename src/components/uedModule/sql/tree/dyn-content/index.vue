<template>
  <div class="dyn-content w-180">
    <ComSelectSearchBox
      v-model="data_dynName"
      :props_height="24"
      :props_showCommonField="true"
      :props_isShowType="true"
      :props_isShowDesc="true"
      :props_clearable="true"
      :props_isShowValue="true"
      :props_allOptions="props_dynObjectList"
      @on-change="onObjectListChange"
    ></ComSelectSearchBox>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import ComSelectSearchBox from '../../selectSearchBox/index.vue';

  defineOptions({
    name: 'DynContent',
    inheritAttrs: false
  });
  const props = defineProps({
    props_dynNameVal: {
      type: String,
      default: ''
    },
    // 动态对象活动列表
    props_dynObjectList: {
      type: Array,
      default: () => []
    }
  });

  const data_dynName = ref(props.props_dynNameVal || '');
  watch(
    () => props.props_dynNameVal,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        data_dynName.value = newVal || '';
      }
    }
  );

  const emits = defineEmits(['onObjectListChange']);
  function onObjectListChange() {
    console.log('onObjectListChange');
    emits('onObjectListChange', data_dynName.value);
  }
</script>
