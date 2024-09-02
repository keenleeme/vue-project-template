BlockArea<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-23 15:08:02
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-02 14:13:53
 * @Description: 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <!-- <h1>主题配置页themeConfig</h1> -->
      <BlockArea title="主题风格" class="block-area">
        <ThemePanelItem
          type="mode"
          title="默认主题"
          :mode="config.mode"
          :dark="config.dark"
          @update:mode="(value: string) => changeConfig('mode', value)"
        />
        <!-- @update:mode="changeMode"  -->

        <ThemePanelItem
          type="primaryColor"
          title="默认主题色"
          :mode="config.mode"
          :primary-color="config.primaryColor"
          :dark="config.dark"
          @update:primary-color="(value: string) => changeConfig('primaryColor', value)"
          @reset-primary-color="resetPrimaryColor"
        />
        <!-- @update:primary-color="changePrimaryColor" -->
      </BlockArea>

      <BlockArea title="导航设置" class="block-area">
        <ThemePanelItem
          type="layout"
          title="导航布局"
          :mode="config.mode"
          :layout="config.layout"
          :breadcrumb="config.breadcrumb"
          :map-menu="config.mapMenu"
          :accordion="config.accordion"
          :top-style="config.topStyle"
          :side-style="config.sideStyle"
          :header="themeConfig.header"
          @update:top-style="(value: string) => changeConfig('topStyle', value)"
          @update:side-style="(value: string) => changeConfig('sideStyle', value)"
          @update:header="(value: string) => changeConfig('header', value)"
          @update:layout="(value: string) => changeConfig('layout', value)"
          @update:breadcrumb="(value: boolean) => changeConfig('breadcrumb', value)"
          @update:map-menu="(value: boolean) => changeConfig('mapMenu', value)"
          @update:accordion="(value: boolean) => changeConfig('accordion', value)"
        />
        <!-- @update:layout="changeLayout" -->

        <ThemePanelItem
          type="others"
          title="其他设置"
          :light-dark-switch="config.lightDarkSwitch"
          :language-switch="config.languageSwitch"
          :help-center="config.helpCenter"
          @update:light-dark-switch="(value: boolean) => changeConfig('lightDarkSwitch', value)"
          @update:language-switch="(value: boolean) => changeConfig('languageSwitch', value)"
          @update:help-center="(value: boolean) => changeConfig('helpCenter', value)"
        />
      </BlockArea>
    </div>
    <div class="page-footer">
      <a-button @click="resetTheme">恢复出厂设置</a-button>
      <a-button @click="dialogVisiable = true">生成页面嵌套参数</a-button>
      <a-button primary @click="useTheme">应用当前主题</a-button>
    </div>

    <a-modal v-model:open="dialogVisiable" title="生成页面嵌套参数">
      <div>aaa</div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { ThemePanelItem } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';
  import BlockArea from '../../components/blockArea/index.vue';

  const themeStore = useThemeStore();

  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });

  watchEffect(() => {
    console.log('themeConfig changed', themeConfig.value);
    config.value = { ...themeConfig.value };
  });

  const changeConfig = (key: string, newConfig: any) => {
    // config.value = { ...newConfig };
    console.log(2, key, newConfig);
    // themeConfig[key as keyof typeof themeConfig] = newConfig;
    themeConfig.value = { ...themeConfig.value, [key]: newConfig };
    console.log(2, themeConfig.value);
  };

  // const changeMode = (modeValue: string) => {
  //   console.log(1, modeValue);
  //   // themeStore.themeConfig.mode = modeValue;
  //   // themeConfig.value.mode = modeValue;
  //   changeConfig('mode', modeValue);
  // };

  // const changeLayout = (layout: string) => {
  //   console.log(layout);
  //   themeConfig.value.layout = layout;
  // };

  // const changePrimaryColor = (primaryColor: string) => {
  //   // themeStore.themeConfig.primaryColor = primaryColor;
  //   themeConfig.value.primaryColor = primaryColor;
  // };

  // 重置主题色
  const resetPrimaryColor = () => {
    // config.value.primaryColor = '#134BEA';
    themeStore.resetThemePrimaryColor();
  };

  const resetTheme = () => {
    themeStore.reset();
  };

  const dialogVisiable = ref<boolean>(false);
  const toggleDialog = () => {
    dialogVisiable.value = !dialogVisiable.value;
  };

  const useTheme = () => {};
</script>

<style lang="less" scoped>
  .setting-wrapper {
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-content {
      flex-grow: 1;
      background-color: #f7f8fc;
      padding: 16px;
      height: 0;
      overflow-x: hidden;
      color: #1e2435;

      .block-area {
        .theme-panel-item {
          width: 50%;
          &-title {
            color: #1e2435;
            font-weight: 600;
            line-height: 22px;
          }

          .ttheme-panel-common-item > span {
            width: 98px;
            text-align: right;
          }
        }
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      border-top: 1px solid #e9eaf0;
    }
  }
</style>
