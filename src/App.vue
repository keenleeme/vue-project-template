<template>
  <!-- <a-config-provider :locale="zhCN" :theme="theme"> -->
  <!-- <a-config-provider :locale="zhCN" :theme="{ algorithm: theme.darkAlgorithm }"> -->
  <a-config-provider :locale="zhCN" :theme="theme">
    <Layout class="layout-overflow-x">
      <RouterView></RouterView>
    </Layout>
  </a-config-provider>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import { generate } from '@ant-design/colors';
  // import { theme } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import Color from 'color';
  import { storeToRefs } from 'pinia';
  // import theme from '@/theme/theme';
  import { getWebsiteConfig } from './api/common';
  import Layout from './components/layout/index.vue';
  import RobotInit from './components/robot/index';
  import { useAppStore, useThemeStore } from './store';
  import { AppConfigType } from './store/modules/app/types';

  // const Color = require('color');

  const appStore = useAppStore();
  // // antdesian组件主题
  // const { theme } = storeToRefs(appStore);
  // watch(
  //   () => theme.value,
  //   (val) => {
  //     console.log('theme changed',val, theme.value);
  //   }
  // );

  // 机器人注册
  RobotInit();
  // window.RobotDestory(); 可使用此方法手动销毁机器人

  getWebsiteConfig()
    .then((data) => {
      appStore.setAppConfig(data as AppConfigType);
      appStore.setLoginConfig(data.loginConfig);
    })
    .catch((error) => {
      console.log(error);
    });

  // 物料库组件 主题色设置
  let primaryColors: string[] = [];
  let darkPrimaryColors: string[] = [];
  const themeStore = useThemeStore();
  const { themeConfig, theme } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  watch(
    () => config.value.primaryColor,
    () => {
      const color = Color(config.value.primaryColor);
      const darkOriginColor = color
        .saturate(15 / 85)
        .lighten(0.25)
        .hex();
      primaryColors = generate(config.value.primaryColor);
      darkPrimaryColors = generate(darkOriginColor, { theme: 'dark', backgroundColor: '#020C1E' });
      nextTick(() => {
        const bodyEl = document.body;
        // bodyEl.className = config.value.mode === 'dark' || config.value.dark === true ? 'thmee-dark' : '';
        bodyEl.style.setProperty('--um-primary-color-light', primaryColors[0]);
        bodyEl.style.setProperty('--um-primary-color-hover', primaryColors[4]);
        bodyEl.style.setProperty('--um-primary-color-normal', primaryColors[5]);
        bodyEl.style.setProperty('--um-dark-primary-color-light', darkPrimaryColors[0]);
        bodyEl.style.setProperty('--um-dark-primary-color-hover', darkPrimaryColors[4]);
        bodyEl.style.setProperty('--um-dark-primary-color-normal', darkPrimaryColors[5]);
        bodyEl.style.setProperty('--c-color-primary-7', primaryColors[7]);
        bodyEl.style.setProperty('--c-color-primary-5', primaryColors[4]);
        bodyEl.style.setProperty('--c-color-primary-6', primaryColors[5]);
        bodyEl.style.setProperty('--c-color-primary-2', primaryColors[1]);
        bodyEl.style.setProperty('colorPrimary', primaryColors[0]);
      });
    },
    {
      immediate: true,
      deep: true
    }
  );

  watch(
    () => config.value.mode,
    (val) => {
      const bodyEl = document.body;
      bodyEl.className = val === 'dark' ? 'theme-dark' : '';
    }
  );

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
