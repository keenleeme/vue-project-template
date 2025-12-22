<template>
  <!-- Header 样式 -->
  <a-dropdown v-if="config.languageSwitch && type === 'header'" class="side-menu-footer-item" :placement="placement">
    <i class="icon-button menuicon menu-icon-multilingual"></i>
    <template #overlay>
      <a-menu @click="handleLocaleChangeFromMenu" :selected-keys="[themeConfig.lang]">
        <a-menu-item key="zh">简体中文</a-menu-item>
        <a-menu-item key="en">English</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>

  <!-- SideMenu 样式 -->
  <div v-if="config.languageSwitch && type === 'side'" class="side-menu-footer-item">
    <a-dropdown class="side-menu-footer-item" :placement="placement">
      <div>
        <i class="menuicon menu-icon-multilingual"></i>
        <span class="ant-dropdown-link" @click.prevent>
          {{ config.lang === 'zh' ? '多语言' : 'Multilingual' }}
        </span>
      </div>
      <template #overlay>
        <a-menu @click="handleLocaleChangeFromMenu" :selected-keys="[themeConfig.lang]">
          <a-menu-item key="zh">简体中文</a-menu-item>
          <a-menu-item key="en">English</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useI18n } from '@/libs/hooks/useI18n';
  import { useThemeStore } from '@/store';

  interface Props {
    type?: 'header' | 'side';
    placement?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'header',
    placement: 'bottom'
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({ ...themeConfig.value });

  // 国际化
  const { handleLocaleChangeFromMenu } = useI18n();

  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });
</script>
