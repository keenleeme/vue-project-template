<template>
  <a-watermark :content="watermark">
    <a-layout
      class="h-screen"
      :class="{
        dark: themeConfig.mode === 'dark',
        'header-dark': themeConfig.mode === 'dark' || (themeConfig.mode === 'light' && themeConfig.topStyle === 'dark')
      }"
    >
      <HeaderMenus v-if="!fullScreen" v-bind="menuConfig"></HeaderMenus>
      <a-layout v-if="!fullScreen" class="ant-layout-has-sider">
        <SiderMenus
          v-if="themeConfig.layout === 'side' || (siderMenus && siderMenus.length > 0 && themeConfig.layout === 'mix')"
          v-bind="menuConfig"
        ></SiderMenus>
        <LayoutContent></LayoutContent>
      </a-layout>
      <RouterView v-if="fullScreen"></RouterView>
    </a-layout>
  </a-watermark>
</template>

<script setup lang="ts">
  import { watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import getMenuMock from '@/api/menuMock';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import type { RouteItemType } from '@/store/uedModule/menus/types';
  import HeaderMenus from './comps/HeaderMenus.vue';
  import LayoutContent from './comps/LayoutContent.vue';
  import SiderMenus from './comps/SiderMenus.vue';

  const appStore = useAppStore();
  const { watermark, fullScreen } = storeToRefs(appStore);
  const menusStore = useMenusStore();
  const { siderMenus } = storeToRefs(menusStore);
  const route = useRoute();
  watchEffect(() => {
    const routes = (route.meta.parentRoutes as RouteItemType[]) || [];
    // if (!routes || routes.length === 0) {
    //   routes = [
    //     {
    //       path: route.fullPath,
    //       title: route.meta.title as string,
    //       component: true
    //     }
    //   ];
    // }
    menusStore.setActiveRoutes(routes);
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  // watchEffect(() => {
  //   const { layout, topStyle } = themeConfig.value;
  // });

  watch(route, () => {
    if (route.meta.fullScreen) {
      appStore.setFullScreen(true);
      return true;
    }
    if ((window as any)._routeCenter) {
      const customMeta = (window as any)._routeCenter.getMeta(route.fullPath, route.name as string, route.hash);
      appStore.setFullScreen(!!customMeta?.fullScreen);
    }
  });
  // const fullScreen = computed(() => {
  //   if (route.meta.fullScreen) {
  //     return true;
  //   }
  //   const customMeta = routeCenter.getMeta(route.fullPath, route.name as string, route.hash);
  //   return customMeta?.fullScreen || false;
  // });

  const menuConfig = ref({
    // 不传按默认配置字段，如要修改请补充对应字段的key/value
    dataProps: {
      label: 'title', // 使用 menuMock.ts 中的 title 字段
      children: 'children'
    },
    userMenu: [
      {
        id: 1,
        name: I18N.layout.tuiChuDengLu
      }
    ],
    menuData: getMenuMock() // 使用统一的菜单数据源
  });
</script>
