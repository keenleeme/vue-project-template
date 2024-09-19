<template>
  <div class="sql-tree-root">
    <div v-if="props_isLoadingTree" class="spin-warp">
      <a-spin size="large"></a-spin>
    </div>
    <div
      v-else
      class="tree-node-wrapper"
      :style="{
        'min-width': contextData.provideTreeMinWidth,
        'max-width': contextData.provideTreeMaxWidth,
        minHeight: contextData.provideTreeMinHeight,
        'max-height': contextData.provideTreeMaxHeight
      }"
    >
      <div class="tip">{{ props_realtimeTip }}</div>
      <ComTreeNode class="tree-node-root" :props_treeData="props_sqlToTree"></ComTreeNode>
    </div>
  </div>
</template>

<script setup>
  import { inject, provide, reactive } from 'vue';
  import { Spin as ASpin } from 'ant-design-vue';
  import { EmptyTree } from './sampleTree.js';
  import ComTreeNode from './treeNode.vue';

  const props = defineProps({
    props_realtimeTip: {
      type: String,
      required: false,
      default: ''
    },
    props_isLoadingTree: {
      type: Boolean,
      required: true
    },
    props_freqUsedFieldList: {
      type: Array,
      required: false,
      default: () => []
    },
    props_allFieldList: {
      type: Array,
      required: true
    },
    props_sqlToTree: {
      type: Object,
      required: false,
      default: () => EmptyTree
    }
  });

  const contextData = inject('contextData');

  const provideData = reactive({
    freqUsedFieldOptions: props.props_freqUsedFieldList,
    allFieldOptions: props.props_allFieldList
  });

  provide('provideData', provideData);

  // export default {
  //   provide() {
  //     const provideData = {};
  //     Object.defineProperty(provideData, 'freqUsedFieldOptions', {
  //       get: () => this.props_freqUsedFieldList || [],
  //       enumerable: true
  //     });
  //     Object.defineProperty(provideData, 'allFieldOptions', {
  //       get: () => this.props_allFieldList || [],
  //       enumerable: true
  //     });
  //     return { provideData };
  //   }
  // };
</script>
