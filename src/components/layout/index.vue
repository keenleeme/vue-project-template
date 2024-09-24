<!--
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-22 16:50:45
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-18 20:11:54
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <a-watermark :content="watermark">
    <a-layout
      class="h-screen"
      :class="{
        dark: themeConfig.mode === 'dark',
        'header-dark': themeConfig.mode === 'dark' || (themeConfig.mode === 'light' && themeConfig.topStyle === 'dark')
      }"
    >
      <HeaderMenus v-if="!fullScreen"></HeaderMenus>
      <a-layout v-if="!fullScreen">
        <SiderMenus v-if="themeConfig.layout != 'top'"></SiderMenus>
        <LayoutContent></LayoutContent>
      </a-layout>
      <RouterView v-if="fullScreen"></RouterView>
    </a-layout>
  </a-watermark>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import type { RouteItemType } from '@/store/modules/menus/types';
  import HeaderMenus from './comps/HeaderMenus.vue';
  import LayoutContent from './comps/LayoutContent.vue';
  import SiderMenus from './comps/SiderMenus.vue';

  const appStore = useAppStore();
  const { watermark } = storeToRefs(appStore);
  const menusStore = useMenusStore();
  const route = useRoute();
  watchEffect(() => {
    const routes = route.meta.parentRoutes as RouteItemType[];
    menusStore.setActiveRoutes(routes);
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  // watchEffect(() => {
  //   const { layout, topStyle } = themeConfig.value;
  // });

  const fullScreen = computed(() => {
    return route.meta.fullScreen;
  });
</script>
