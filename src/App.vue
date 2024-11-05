<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <Layout class="layout-overflow-x">
      <RouterView></RouterView>
    </Layout>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { storeToRefs } from 'pinia';
  import { getWebsiteConfig } from './api/common';
  import Layout from './components/uedModule/layout/index.vue';
  import RobotInit from './components/uedModule/robot/index';
  import { useAppStore, useThemeStore } from './store';
  import { AppConfigType } from './store/uedModule/app/types';
  import themeAlgorithm from './theme/themeAlgorithm';

  const appStore = useAppStore();

  // 机器人注册
  RobotInit();
  // window.RobotDestory(); 可使用此方法手动销毁机器人

  // 修改主题色算法
  themeAlgorithm();
  const themeStore = useThemeStore();
  const { theme } = storeToRefs(themeStore);

  getWebsiteConfig()
    .then((data) => {
      appStore.setAppConfig(data as AppConfigType);
      appStore.setLoginConfig(data.loginConfig);
    })
    .catch((error) => {
      console.log(error);
    });

  onUnmounted(() => {
    // window.localStorage.clear();
  });
</script>

<!-- 默认主题变量 -->
<style>
  @import url('./assets/styles/reset.css');

  /* 应用变量 */
  :is(body) {
    background-color: var(--primary-bg);
  }
  .layout-overflow-x {
    overflow-x: hidden;
  }
</style>
