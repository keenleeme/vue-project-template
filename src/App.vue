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
