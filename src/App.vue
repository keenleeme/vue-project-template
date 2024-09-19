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

  getWebsiteConfig()
    .then((data) => {
      appStore.setAppConfig(data as AppConfigType);
      appStore.setLoginConfig(data.loginConfig);
    })
    .catch((error) => {
      console.log(error);
    });

  // https://wlgc.das-security.cn/material-detail/114 组件详情配置信息
  // 机器人插件（JS文件），由各个产品后端存放，后续更新只需要替换文件
  // 机器人配置项建议从后端配置读取，后续更新二维码等，只需要修改配置项，无需更新前后端
  // 线上咨询弹窗壳子由机器人控制，弹窗内容部署在云端
  // 机器人不能从云端加载，否则当部署环境无法访问到云端或者网络断开时，机器人会无法加载
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://aiservice.dbappsecurity.com.cn/robot-plugin.js';
  document.head.appendChild(script);
  script.onload = () => {
    window.RobotInit({
      // id: '',
      // onlineParams: {
      //   appKey: '', // 自己产品英文名称缩写，用于统计产品使用率等数据
      //   xiaoAn: {
      //     web_plugin_id: '', // 小安配置 必传 钉钉联系（@郭泽阳）申请获取
      //     // 其余配置
      //   },
      //   xiaoHeng: {
      //     appKey: '', // 小恒配置 必传 钉钉联系（@黄旗亮）申请获取
      //     appSecret: '', // 小恒配置 必传 钉钉联系（@黄旗亮）申请获取
      //     // 其余配置
      //   }
      // },
      // onlineSrc: '',
      // disconnectTips: '',
      // move: false,
      // codeSrc: '',
      // dialogWidth: '50%',
      // dialogHeight: '50%',
      // bottom: 20,
      // online: false,
      // code: false,
    });
  };

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
</script>

<!-- 默认主题变量 -->
<style>
  @import url('./styles/reset.css');

  /* 应用变量 */
  :is(body) {
    background-color: var(--primary-bg);
  }
  .layout-overflow-x {
    overflow-x: hidden;
  }
</style>
