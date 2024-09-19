<template>
  <div class="array-in-tags-root w-300">
    <template v-if="tagsData.data_value && tagsData.data_value.length">
      <a-tag
        v-for="(item, index) in tagsData.data_value"
        :key="`tag-${index}`"
        class="ellipsis-tag"
        closable
        @close.prevent="onTagClose(index)"
      >
        <span class="content">{{ item }}</span>
      </a-tag>
    </template>
    <a-input
      v-if="tagsData.data_inputMode"
      ref="refInput"
      v-model:value="tagsData.data_inputValue"
      class="inputRoot"
      size="small"
      placeholder="回车或选择新增"
      @press-enter="onInputEnter"
      @focus="onFocus"
      @blur="onBlur"
      @change="changeValue"
    />
    <a-button v-else size="small" type="dashed" class="btn" @click="addTag">
      <template #icon><PlusOutlined /></template>
      添加
    </a-button>
  </div>
</template>

<script setup>
  import { ref, nextTick, reactive, watch } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Button as AButton, Input as AInput, Tag as ATag } from 'ant-design-vue';
  import { cloneDeep, debounce } from 'lodash';

  defineOptions({
    name: 'ComArrayInTags'
  });

  const props = defineProps({
    props_defaultValue: {
      type: [Array, String],
      default: () => []
    },
    // 是否需要远程搜索
    props_isRemoteSearch: {
      type: Boolean,
      default: false
    }
  });
  const tagsData = reactive({
    data_inputMode: false,
    data_inputValue: '',
    data_value: cloneDeep(props.props_defaultValue) || []
  });

  const refInput = ref(null);

  const emits = defineEmits(['onFocus', 'onChange', 'remoteMethod']);
  function onFocus() {
    emits('onFocus');
    changeValue();
  }
  function onBlur() {
    tagsData.data_inputValue = '';
    tagsData.data_inputMode = false;
  }
  function addTag() {
    tagsData.data_inputMode = true;
    nextTick(() => {
      refInput.value.focus();
    });
  }
  function onInputEnter() {
    tagsData.data_inputMode = false;
    if (tagsData.data_inputValue) {
      const set = new Set(tagsData.data_value);
      set.add(tagsData.data_inputValue);
      tagsData.data_value = Array.from(set);
      onChange();
      nextTick(() => {
        tagsData.data_inputValue = '';
      });
    }
  }
  function onTagClose(index) {
    tagsData.data_value.splice(index, 1);
    nextTick(() => {
      onChange();
    });
  }
  function onChange() {
    emits('onChange', tagsData.data_value);
  }
  const changeValue = debounce(
    function () {
      if (props.props_isRemoteSearch) {
        emits('remoteMethod', tagsData.data_inputValue);
      }
    },
    300,
    { trailing: true }
  );

  watch(
    () => props.props_defaultValue,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        tagsData.data_value = props.props_defaultValue;
      }
    }
  );
</script>
