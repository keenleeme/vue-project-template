<template>
  <Transition name="fade">
    <div
      v-show="showAiTips"
      class="aiql-tip-root"
      :style="{
        minWidth: contextData.provideTreeMinWidth,
        maxWidth: contextData.provideTreeMaxWidth,
        minHeight: contextData.provideTreeMinHeight,
        maxHeight: contextData.provideTreeMaxHeight
      }"
    >
      <div class="table-header">
        <div class="item short">{{ $t('I18N.base_form.yuFa') }}</div>
        <div class="item short">{{ $t('I18N.base_form.desc') }}</div>
        <div class="item flex">{{ $t('I18N.base_form.shiLi') }}</div>
      </div>
      <div class="table-content">
        <div v-for="item in aiqlGuide" :key="item.expression" class="table-item">
          <div class="item short" :title="item.expression">{{ item.expression }}</div>
          <div class="item short" :title="item.desc">{{ item.desc }}</div>
          <div class="item flex" :title="item.example">{{ item.example }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { inject } from 'vue';

  const props = defineProps({
    aiqlGuide: {
      type: Array,
      default: () => []
    },
    showAiTips: {
      type: Boolean,
      default: false
    }
  });
  const contextData = inject('contextData');
</script>
