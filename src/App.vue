<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <Layout>
      <RouterView></RouterView>
    </Layout>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import theme from '@/theme/theme';
  // import { storeToRefs } from 'pinia';
  import { getWebsiteConfig } from './api/common';
  import Layout from './components/layout/index.vue';
  import { useAppStore } from './store';
  import { AppConfigType } from './store/modules/app/types';

  const appStore = useAppStore();
  // 主题
  // const { theme } = storeToRefs(appStore);

  getWebsiteConfig()
    .then((data) => {
      appStore.setAppConfig(data as AppConfigType);
    })
    .catch((error) => {
      console.log(error);
    });
</script>

<style lang="less" scoped>
  :root {
    --primary-color: #3498db; /* 默认主题色 */
    --primary-bg: #ffffff; /* 默认背景色 */
  }

  .theme-dark {
    --primary-color: #2c3e50; /* 暗色主题色 */
    --primary-bg: #2c3e50; /* 暗色背景色 */
  }

  /* 应用变量 */
  body {
    color: var(--primary-color);
    background-color: var(--primary-bg);
  }
</style>
