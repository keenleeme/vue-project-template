<template>
  <a-input-number v-model:value="data_value" class="w-100" size="small" @change="onChange" />
</template>

<script setup>
  import { ref } from 'vue';
  import { InputNumber as AInputNumber } from 'ant-design-vue';

  defineOptions({
    name: 'ComTreeValueInputNumber'
  });

  const props = defineProps({
    props_defaultValue: [Number, String]
  });

  const emits = defineEmits(['onChange']);

  const data_value = ref(isNumber(props.props_defaultValue) ? Number(props.props_defaultValue) : 0);
  function isNumber(n) {
    if (/^((\d+\.\d+)|(\d+))$/g.test(n)) {
      return true;
    }
    // this.$Message.info('有数字类型的字段值非法 将重置为0');
    return false;
  }
  function onChange() {
    emits('onChange', data_value.value);
  }
</script>

<style scoped></style>
