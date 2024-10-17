<template>
  <a-input
    v-model:value="data_value"
    class="tree-input-com w-300"
    size="small"
    allow-clear
    :placeholder="$t('I18N.base_form.pleaseEnter')"
    @change="onChange"
    @focus="onFocus"
  />
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { Input as AInput } from 'ant-design-vue';

  defineOptions({
    name: 'ComTreeValueInput'
  });

  const props = defineProps({
    props_defaultValue: {
      type: [String, Number, Boolean, Array]
    }
  });

  const emits = defineEmits(['onChange', 'onFocus']);
  const data_value = ref(
    props.props_defaultValue !== null && props.props_defaultValue !== undefined
      ? props.props_defaultValue.toString()
      : ''
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
    }
  );

  function onChange() {
    emits('onChange', data_value.value);
  }
  function onFocus() {
    emits('onFocus');
  }
</script>
